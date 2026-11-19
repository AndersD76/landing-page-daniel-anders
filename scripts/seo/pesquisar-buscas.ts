/**
 * Pesquisa de buscas — Etapa 3.
 *
 * Fonte: autocomplete do Google (pt-BR, Brasil) sobre sementes do ICP ×
 * modificadores (alfabeto + perguntas + formatos). É busca real digitada por
 * gente real; não traz volume, então a popularidade é a posição na lista de
 * sugestões e vai marcada como estimativa.
 *
 * Saída: src/data/seo/mapa-buscas.json — lido pela sincronização de boot, que
 * carrega a tabela `mapa_buscas`. Rodar de novo só ACRESCENTA consultas: o
 * que já estava no mapa fica (com a primeira fonte registrada).
 *
 *   npx tsx scripts/seo/pesquisar-buscas.ts            # coleta completa
 *   npx tsx scripts/seo/pesquisar-buscas.ts --rapido   # só sementes, sem alfabeto
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  calcularPrioridade,
  classificarCluster,
  classificarIntencao,
  classificarTipoPagina,
  getCluster,
  type IscaId,
} from "../../src/lib/seo/taxonomia";
import { CAMINHO_MAPA, gravarMapa, lerMapa, type ConsultaMapa } from "../../src/lib/seo/mapa-arquivo";

export const SEMENTES = [
  // custo
  "quanto custa um site", "quanto custa um aplicativo", "quanto custa um sistema", "quanto custa uma loja virtual",
  "preço de site", "valor de um aplicativo", "orçamento de site", "quanto cobrar por um site",
  "quanto custa manter um site", "quanto custa um software", "quanto custa um ecommerce",
  // sites
  "site para empresa", "site institucional", "criar site", "landing page", "site profissional",
  "hospedagem de site", "domínio", "site wordpress", "site responsivo", "site para pequena empresa",
  // seo
  "site não aparece no google", "como aparecer no google", "seo para pequenas empresas", "google meu negócio",
  "como colocar meu site no google", "search console",
  // ecommerce
  "loja virtual", "ecommerce", "como vender pela internet", "plataforma de ecommerce", "loja própria ou marketplace",
  "taxa do ifood", "gateway de pagamento",
  // apps
  "aplicativo para empresa", "criar aplicativo", "app de delivery próprio", "aplicativo de agendamento",
  "publicar app na play store", "publicar app na app store", "pwa", "flutter ou react native",
  // sistemas
  "sistema para", "sistema de gestão", "erp para pequenas empresas", "crm", "software sob medida",
  "sistema de ordem de serviço", "controle de estoque", "sistema de agendamento", "sistema financeiro",
  "sistema para clínica", "sistema para oficina", "sistema para restaurante", "sistema para transportadora",
  "sistema web", "saas",
  // automação
  "automação de processos", "sair da planilha", "planilha de controle", "automação whatsapp",
  "integração de sistemas", "api", "chatbot para empresa", "inteligência artificial para empresas",
  "automatizar planilha", "integração whatsapp",
  // lgpd / legal
  "lgpd para site", "política de privacidade", "termos de uso", "cookies lgpd", "contrato de desenvolvimento de software",
  "registro de software", "lgpd pequenas empresas", "acessibilidade em sites", "direito de arrependimento loja virtual",
  // contratação
  "freelancer ou agência", "contratar programador", "empresa de desenvolvimento de software", "briefing de site",
  "escopo de projeto de software", "mvp", "requisitos de software", "desenvolvedor freelancer",
  "fábrica de software",
];

/** Modificadores pedidos na Etapa 3. "pre" entra antes da semente. */
const MODIFICADORES: Array<{ texto: string; pre?: boolean }> = [
  { texto: "como", pre: true },
  { texto: "o que é", pre: true },
  { texto: "quanto custa", pre: true },
  { texto: "qual", pre: true },
  { texto: "quando", pre: true },
  { texto: "melhor", pre: true },
  { texto: "prazo" },
  { texto: "multa" },
  { texto: "obrigatório" },
  { texto: "exemplo" },
  { texto: "modelo" },
  { texto: "planilha" },
  { texto: "checklist" },
  { texto: "passo a passo" },
  { texto: "vs" },
  { texto: "grátis" },
  { texto: "pdf" },
  { texto: "para" },
];

const ALFABETO = "abcdefghijklmnopqrstuvwxyz".split("");

const SAIDA = CAMINHO_MAPA;
const CACHE = join(process.cwd(), ".cache/autocomplete");

function normalizar(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

async function esperar(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function sugestoes(q: string): Promise<string[]> {
  const arq = join(CACHE, `${Buffer.from(q).toString("base64url")}.json`);
  if (existsSync(arq)) return JSON.parse(readFileSync(arq, "utf8"));
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=pt-BR&gl=br&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`;
  for (let tentativa = 0; tentativa < 4; tentativa++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (pesquisa-de-buscas)" } });
      if (res.status === 429 || res.status >= 500) {
        await esperar(2000 * (tentativa + 1));
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      const ct = res.headers.get("content-type") || "";
      const texto = /charset=(iso-8859-1|latin1)/i.test(ct) ? buf.toString("latin1") : buf.toString("utf8");
      const json = JSON.parse(texto) as [string, string[]];
      const lista = (json[1] || []).map(normalizar);
      mkdirSync(CACHE, { recursive: true });
      writeFileSync(arq, JSON.stringify(lista));
      return lista;
    } catch {
      await esperar(1500 * (tentativa + 1));
    }
  }
  return [];
}

/** Descarta o que não é do ICP: celebridade, jogo, curso de faculdade etc. */
const RUIDO = /(casamento|aniversário|aniversario|namorad|onlyfans|apostas|bet|cassino|jogo do|novela|filme|série|serie |música|musica|letra|futebol|receita de|horóscopo|horoscopo|tarot|crush|meme|wallpaper|porn|xxx|grátis download crack|crack|apk mod|hack)/;

function classificar(consulta: string, semente: string, posicao: number | null, fonte: ConsultaMapa["fonte"]): ConsultaMapa {
  const intencao = classificarIntencao(consulta);
  const cluster = classificarCluster(consulta);
  const tipoPagina = classificarTipoPagina(consulta, intencao);
  const c = getCluster(cluster)!;
  const iscaId: IscaId =
    tipoPagina === "modelo" ? "modelo-download" : tipoPagina === "custo" ? (/(app|aplicativo)/.test(consulta) ? "calculadora-app" : "calculadora-site") : c.isca;
  return {
    consulta,
    intencao,
    cluster,
    tipoPagina,
    iscaId,
    posicaoAutocomplete: posicao,
    volume: null,
    volumeFonte: "estimativa-autocomplete",
    prioridade: calcularPrioridade(intencao, cluster, posicao),
    fonte,
    semente,
    coletadoEm: new Date().toISOString().slice(0, 10),
  };
}

async function main() {
  const rapido = process.argv.includes("--rapido");
  const existentes: ConsultaMapa[] = existsSync(SAIDA) ? lerMapa() : [];
  // --reclassificar: reaplica as regras da taxonomia sem nova coleta.
  const reclassificar = process.argv.includes("--reclassificar");
  const mapa = new Map(
    existentes.map((c) => [c.consulta, reclassificar ? classificar(c.consulta, c.semente, c.posicaoAutocomplete, c.fonte) : c])
  );
  const antes = mapa.size;

  const pedidos: Array<{ q: string; semente: string }> = [];
  for (const s of SEMENTES) {
    pedidos.push({ q: s, semente: s });
    for (const m of MODIFICADORES) pedidos.push({ q: m.pre ? `${m.texto} ${s}` : `${s} ${m.texto}`, semente: s });
    if (!rapido) for (const l of ALFABETO) pedidos.push({ q: `${s} ${l}`, semente: s });
  }

  console.log(`Pesquisa de buscas: ${pedidos.length} consultas ao autocomplete`);
  let feitos = 0;
  const CONCORRENCIA = 4;
  const fila = [...pedidos];

  async function trabalhador() {
    while (fila.length) {
      const p = fila.shift()!;
      const lista = await sugestoes(p.q);
      lista.forEach((sug, i) => {
        if (sug.length < 6 || sug.length > 90 || RUIDO.test(sug)) return;
        const atual = mapa.get(sug);
        const posicao = i + 1;
        if (!atual) mapa.set(sug, classificar(sug, p.semente, posicao, "autocomplete"));
        else if ((atual.posicaoAutocomplete ?? 99) > posicao && atual.fonte === "autocomplete") {
          mapa.set(sug, classificar(sug, atual.semente, posicao, "autocomplete"));
        }
      });
      feitos++;
      if (feitos % 200 === 0) console.log(`  ${feitos}/${pedidos.length} — ${mapa.size} consultas únicas`);
      await esperar(120);
    }
  }
  await Promise.all(Array.from({ length: CONCORRENCIA }, trabalhador));

  // Segunda passada: as sugestões mais populares viram semente (cauda longa real).
  if (!rapido) {
    const topo = [...mapa.values()]
      .filter((c) => c.posicaoAutocomplete !== null && c.posicaoAutocomplete <= 3 && c.intencao !== "navegacional")
      .sort((a, b) => b.prioridade - a.prioridade)
      .slice(0, 400);
    console.log(`Segunda passada: ${topo.length} sugestões viram semente`);
    fila.push(...topo.map((c) => ({ q: c.consulta + " ", semente: c.semente })));
    await Promise.all(Array.from({ length: CONCORRENCIA }, trabalhador));
  }

  const lista = [...mapa.values()].sort((a, b) => b.prioridade - a.prioridade || a.consulta.localeCompare(b.consulta));
  mkdirSync(dirname(SAIDA), { recursive: true });
  gravarMapa(lista);

  const porCluster = new Map<string, number>();
  const porTipo = new Map<string, number>();
  for (const c of lista) {
    porCluster.set(c.cluster, (porCluster.get(c.cluster) ?? 0) + 1);
    porTipo.set(c.tipoPagina, (porTipo.get(c.tipoPagina) ?? 0) + 1);
  }
  console.log(`\n${lista.length} consultas no mapa (+${lista.length - antes} nesta execução)`);
  console.log("Por cluster:", Object.fromEntries(porCluster));
  console.log("Por tipo de página:", Object.fromEntries(porTipo));
}

if (process.argv[1]?.includes("pesquisar-buscas")) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
