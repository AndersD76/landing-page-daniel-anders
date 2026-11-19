/**
 * Produção contínua — Etapa 11 (roda no GitHub Actions, diariamente).
 *
 * 1. Lê a fila de produção no banco (enchida pelo job diário a partir do mapa
 *    de buscas e do Search Console).
 * 2. Atualiza tiposPausados em ondas.json com a regra dos 50% em 21 dias.
 * 3. Para cada consulta: gera a página no template do tipo com a API do
 *    Claude, valida o formato, passa no portão de qualidade (inclusive
 *    similaridade com tudo que já existe e fontes conferidas ao vivo).
 * 4. Aprovada → entra em src/content/<tipo>/auto-AAAA-MM.json na próxima onda
 *    com vaga. Reprovada duas vezes → fila de revisão no painel.
 * O workflow faz commit do que mudou; o deploy publica pela onda.
 *
 * Variáveis: ANTHROPIC_API_KEY, DATABASE_URL, LOTE (padrão 60).
 */

import Anthropic from "@anthropic-ai/sdk";
import { neon } from "@neondatabase/serverless";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { paginaConteudoSchema, TIPOS_CONTEUDO, urlDe, type PaginaConteudo, type TipoConteudo } from "../../src/lib/conteudo/schema";
import { avaliarPagina, textoCorrido, LIMITES } from "../../src/lib/conteudo/gate";
import { cosseno, vetoresTfIdf } from "../../src/lib/conteudo/texto";
import { getCluster } from "../../src/lib/seo/taxonomia";
import { paginasCusto } from "../../src/data/custos";

const MODELO = "claude-opus-5-5";
const LOTE = Number(process.env.LOTE || 60);
const RAIZ = process.cwd();
const ONDAS = join(RAIZ, "src/data/seo/ondas.json");
const FONTES = join(RAIZ, "src/data/seo/fontes-verificadas.json");
const hoje = new Date().toISOString().slice(0, 10);

if (!process.env.ANTHROPIC_API_KEY || !process.env.DATABASE_URL) {
  console.log("ANTHROPIC_API_KEY e DATABASE_URL são necessárias — nada a fazer.");
  process.exit(0);
}

const sql = neon(process.env.DATABASE_URL);
const client = new Anthropic();

/* ---------------------------------------------------------------- contexto */

function lerConteudo(): PaginaConteudo[] {
  const out: PaginaConteudo[] = [];
  for (const tipo of TIPOS_CONTEUDO) {
    const pasta = join(RAIZ, "src/content", tipo);
    if (!existsSync(pasta)) continue;
    for (const f of readdirSync(pasta).filter((x) => x.endsWith(".json"))) {
      for (const b of JSON.parse(readFileSync(join(pasta, f), "utf8"))) {
        const r = paginaConteudoSchema.safeParse(b);
        if (r.success) out.push(r.data);
      }
    }
  }
  return out;
}

const TABELA_PRECOS = paginasCusto
  .filter((p) => p.kind === "tipo")
  .map((p) => `- ${p.tipo.nome}: ${p.preco.faixa} (fonte interna ${p.tipo.variante === "site" ? "/calculadora-site" : "/calculadora-app"})`)
  .join("\n");

const REGRAS = `Você redige uma página para www.andersdev.com.br (Daniel Anders, desenvolvedor de software em Passo Fundo/RS que faz sites, lojas, apps, sistemas e automação para pequenas e médias empresas). Leitor: dono ou gerente de empresa de 10 a 200 pessoas, não técnico. Português do Brasil com acentuação correta, frases curtas, segunda pessoa, sem jargão sem explicação e sem frases de marketing vazias.

Regras que reprovam a página:
1. Nada inventado: nenhuma estatística, case, cliente, depoimento, "estudos mostram", e nenhuma experiência em primeira pessoa ("meus clientes", "na minha experiência", "desenvolvi").
2. Preço só desta tabela, citando a fonte interna correspondente em "fontes":
${TABELA_PRECOS}
   Nunca publique preço ou taxa de terceiros. Exemplos numéricos hipotéticos devem ser declarados como exemplo.
3. Afirmação legal (lei, decreto, artigo, resolução) só com fonte em domínio .gov.br/.jus.br/.leg.br e o artigo correto. Regra técnica só com a documentação oficial de quem a define. Use apenas URLs que você tem certeza de que existem; elas serão conferidas automaticamente. Na dúvida, não afirme o fato.
4. Se a página só fica boa com opinião, número ou experiência do autor, ou é texto jurídico para copiar, marque "dependeAutor": true e explique em "notaAutor".
5. "respostaDireta": 40 a 60 palavras; as duas primeiras frases respondem a consulta e repetem as palavras dela.
6. "title" até 60 caracteres começando pela consulta; "description" de 70 a 155 caracteres com benefício e chamada; "h1" é a consulta em forma natural.
7. "valorProprio" com evidência concreta: tabela (seção com "tabela" de 3+ linhas), checklist (lista de 6+ itens), passo-a-passo (lista com "listaOrdenada": true, 4+ passos), exemplo (glossário: "glossario.exemploPratico" com 50+ palavras), modelo (bloco "modelo" com prévia).
8. Tamanho mínimo (palavras): ${Object.entries(LIMITES.palavrasMin).map(([k, v]) => `${k} ${v}`).join(", ")}. FAQ mínima: ${Object.entries(LIMITES.faqMin).map(([k, v]) => `${k} ${v}`).join(", ")}.
9. Não repita texto de outras páginas do site.

Responda SOMENTE com um objeto JSON válido (sem markdown, sem comentários) no mesmo formato do exemplo, com "revisadoEm": "${hoje}" e "consultadoEm": "${hoje}" nas fontes.`;

function exemploDoTipo(todas: PaginaConteudo[], tipo: TipoConteudo): string {
  const ex = todas.find((p) => p.tipo === tipo && !p.dependeAutor);
  return ex ? JSON.stringify(ex) : "";
}

/* ------------------------------------------------------------------ fontes */

const verificadas: Record<string, { ok: boolean; status: number; em: string }> = existsSync(FONTES)
  ? JSON.parse(readFileSync(FONTES, "utf8"))
  : {};

async function urlResponde(url: string): Promise<boolean> {
  if (verificadas[url]?.ok) return true;
  for (const metodo of ["HEAD", "GET"] as const) {
    try {
      const r = await fetch(url, { method: metodo, redirect: "follow", signal: AbortSignal.timeout(15_000), headers: { "User-Agent": "Mozilla/5.0 (verificacao-de-fontes)" } });
      if (r.status < 400) {
        verificadas[url] = { ok: true, status: r.status, em: hoje };
        return true;
      }
    } catch {
      /* tenta o próximo método */
    }
  }
  verificadas[url] = { ok: false, status: 0, em: hoje };
  return false;
}

/* --------------------------------------------------------------- geração */

async function gerar(tipo: TipoConteudo, consulta: string, cluster: string, exemplo: string, titulosExistentes: string[], erros?: string[]): Promise<unknown> {
  const pedido = [
    `Tipo de página: ${tipo}. Cluster: ${cluster} (${getCluster(cluster)?.nome ?? ""}). Consulta principal: "${consulta}".`,
    `Exemplo de página aprovada do mesmo tipo (formato a seguir; não copie o conteúdo):\n${exemplo}`,
    `Títulos que já existem no site (não repita): ${titulosExistentes.slice(0, 400).join(" | ")}`,
    erros?.length ? `A versão anterior foi reprovada por: ${erros.join("; ")}. Corrija esses pontos.` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const resposta = await client.beta.messages.create({
    model: MODELO,
    max_tokens: 16000,
    // Recusa de segurança: o servidor reexecuta no modelo de reserva certo.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "high" },
    system: REGRAS,
    messages: [{ role: "user", content: pedido }],
  });
  if (resposta.stop_reason === "refusal") throw new Error("recusado pelo modelo");
  if (resposta.stop_reason === "max_tokens") throw new Error("resposta cortada (max_tokens)");
  const texto = resposta.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
  const json = texto.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
  return JSON.parse(json);
}

async function avaliar(bruto: unknown, tipo: TipoConteudo, consulta: string, existentes: PaginaConteudo[]): Promise<{ pagina?: PaginaConteudo; erros: string[] }> {
  const r = paginaConteudoSchema.safeParse({ ...(bruto as object), tipo, consulta });
  if (!r.success) return { erros: r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) };
  const p = r.data;
  const erros = avaliarPagina(p)
    .checagens.filter((c) => !c.ok && c.id !== "fontes-respondem")
    .map((c) => `${c.id}${c.detalhe ? ` (${c.detalhe})` : ""}`);
  for (const f of p.fontes.filter((x) => !x.url.startsWith("/"))) if (!(await urlResponde(f.url))) erros.push(`fonte não responde: ${f.url}`);
  if (existentes.some((o) => urlDe(o) === urlDe(p))) erros.push(`slug já existe: ${p.slug}`);
  if (existentes.some((o) => o.title.toLowerCase() === p.title.toLowerCase())) erros.push("title repetido");
  const vet = vetoresTfIdf([textoCorrido(p), ...existentes.map((o) => `${o.h1} ${o.consulta} ${textoCorrido(o)}`)]);
  const max = Math.max(0, ...vet.slice(1).map((v) => cosseno(vet[0], v)));
  if (max >= LIMITES.similaridadeMax) erros.push(`similaridade ${(max * 100).toFixed(0)}% com página existente`);
  return { pagina: p, erros };
}

/* ------------------------------------------------------------------ ondas */

interface Ondas {
  tiposPausados: string[];
  tamanhoMaximo: number;
  ondas: Array<{ numero: number; liberaEm: string }>;
}

async function atualizarPausas(ondas: Ondas) {
  const r = (await sql.query(
    `SELECT pr.tipo, count(*)::int total, count(*) FILTER (WHERE pr.indexada)::int indexadas
       FROM ondas o JOIN paginas_registro pr ON pr.onda = o.numero
      WHERE o.libera_em <= current_date - 21 AND pr.status = 'publicada' AND pr.verificada_em IS NOT NULL
        AND o.numero = (SELECT max(numero) FROM ondas WHERE libera_em <= current_date - 21)
      GROUP BY pr.tipo`
  )) as Array<{ tipo: string; total: number; indexadas: number }>;
  for (const x of r) {
    const abaixo = x.total >= 10 && x.indexadas / x.total < 0.5;
    if (abaixo && !ondas.tiposPausados.includes(x.tipo)) {
      ondas.tiposPausados.push(x.tipo);
      console.log(`Pausando "${x.tipo}": ${x.indexadas}/${x.total} indexadas 21 dias depois da onda.`);
    }
  }
}

function proximaOnda(ondas: Ondas, todas: PaginaConteudo[]): number {
  // Mantém o calendário semanal estendido por 12 semanas à frente.
  while (ondas.ondas.length < 1 || ondas.ondas[ondas.ondas.length - 1].liberaEm < new Date(Date.now() + 84 * 86400_000).toISOString().slice(0, 10)) {
    const ultima = ondas.ondas[ondas.ondas.length - 1];
    const d = new Date(`${ultima.liberaEm}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 7);
    ondas.ondas.push({ numero: ultima.numero + 1, liberaEm: d.toISOString().slice(0, 10) });
  }
  for (const o of ondas.ondas) {
    if (o.liberaEm <= hoje) continue;
    if (todas.filter((p) => p.onda === o.numero).length < ondas.tamanhoMaximo) return o.numero;
  }
  return ondas.ondas[ondas.ondas.length - 1].numero;
}

/* ------------------------------------------------------------------- main */

async function main() {
  const ondas = JSON.parse(readFileSync(ONDAS, "utf8")) as Ondas;
  await atualizarPausas(ondas);

  const todas = lerConteudo();
  const tipos = TIPOS_CONTEUDO.filter((t) => t !== "pilar" && !ondas.tiposPausados.includes(t));
  const fila = (await sql.query(
    `SELECT id, consulta, tipo, cluster FROM fila_conteudo WHERE status = 'pendente' AND tipo = ANY($1) ORDER BY prioridade DESC, id LIMIT $2`,
    [tipos, LOTE]
  )) as Array<{ id: number; consulta: string; tipo: TipoConteudo; cluster: string }>;
  console.log(`Fila: ${fila.length} consultas (tipos ativos: ${tipos.join(", ")})`);

  const mes = hoje.slice(0, 7);
  let aprovadas = 0;
  for (const item of fila) {
    await sql.query(`UPDATE fila_conteudo SET status = 'gerando', tentativas = tentativas + 1, atualizado_em = now() WHERE id = $1`, [item.id]);
    const exemplo = exemploDoTipo(todas, item.tipo);
    const titulos = todas.map((p) => p.title);
    let resultado: { pagina?: PaginaConteudo; erros: string[] } = { erros: [] };
    let bruto: unknown = null;
    for (let tentativa = 0; tentativa < 2; tentativa++) {
      try {
        bruto = await gerar(item.tipo, item.consulta, item.cluster, exemplo, titulos, tentativa ? resultado.erros : undefined);
        resultado = await avaliar(bruto, item.tipo, item.consulta, todas);
      } catch (e) {
        resultado = { erros: [e instanceof Error ? e.message : String(e)] };
      }
      if (!resultado.erros.length) break;
    }

    if (resultado.pagina && !resultado.erros.length) {
      const p = { ...resultado.pagina, onda: proximaOnda(ondas, todas), revisadoEm: hoje, matriz: "fila-diaria" };
      const arquivo = join(RAIZ, "src/content", p.tipo, `auto-${mes}.json`);
      const lista = existsSync(arquivo) ? JSON.parse(readFileSync(arquivo, "utf8")) : [];
      lista.push(p);
      writeFileSync(arquivo, JSON.stringify(lista, null, 2) + "\n");
      todas.push(p);
      aprovadas++;
      await sql.query(
        `UPDATE fila_conteudo SET status = $1, motivo = $2, conteudo = $3, atualizado_em = now() WHERE id = $4`,
        [p.dependeAutor ? "revisao" : "gerada", p.dependeAutor ? `Depende do autor: ${p.notaAutor ?? ""}` : `onda ${p.onda}`, JSON.stringify({ url: urlDe(p) }), item.id]
      );
      console.log(`✓ ${urlDe(p)} → onda ${p.onda}${p.dependeAutor ? " (rascunho)" : ""}`);
    } else {
      await sql.query(`UPDATE fila_conteudo SET status = 'revisao', motivo = $1, conteudo = $2, atualizado_em = now() WHERE id = $3`, [
        resultado.erros.join("; ").slice(0, 2000),
        bruto ? JSON.stringify(bruto) : null,
        item.id,
      ]);
      console.log(`✗ ${item.consulta}: ${resultado.erros.slice(0, 3).join("; ")}`);
    }
  }

  writeFileSync(ONDAS, JSON.stringify(ondas, null, 2) + "\n");
  writeFileSync(FONTES, JSON.stringify(Object.fromEntries(Object.entries(verificadas).sort(([a], [b]) => a.localeCompare(b))), null, 1) + "\n");
  console.log(`\n${aprovadas}/${fila.length} páginas aprovadas e enfileiradas nas ondas.`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
