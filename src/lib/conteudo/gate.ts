/**
 * Portão de qualidade — Etapa 7.
 *
 * Toda página do conteúdo em escala passa por aqui antes de ser publicada.
 * Reprovada não entra no sitemap, não recebe link interno e responde 404
 * (não noindex): página fraca não deve nem existir para o rastreador.
 *
 * Checagens que dependem do conjunto (similaridade, unicidade, links de
 * entrada) rodam em `avaliarConjunto`, depois do motor de links.
 */

import { getIsca } from "@/data/iscas";
import { getCluster } from "@/lib/seo/taxonomia";
import type { PaginaConteudo, TipoConteudo } from "./schema";
import { contarPalavras, frases, semAcento, tokens } from "./texto";
import fontesVerificadas from "@/data/seo/fontes-verificadas.json";

export const LIMITES = {
  respostaMin: 40,
  respostaMax: 60,
  /** tolerância de contagem (hifenizados, siglas) */
  respostaFolga: 5,
  titleMax: 60,
  descriptionMin: 70,
  descriptionMax: 155,
  similaridadeMax: 0.6,
  linksMin: 3,
  palavrasMin: {
    pilar: 1200,
    satelite: 450,
    modelo: 300,
    glossario: 250,
    norma: 450,
    comparativo: 600,
  } satisfies Record<TipoConteudo, number>,
  faqMin: {
    pilar: 4,
    satelite: 3,
    modelo: 3,
    glossario: 2,
    norma: 3,
    comparativo: 3,
  } satisfies Record<TipoConteudo, number>,
} as const;

export interface Checagem {
  id: string;
  ok: boolean;
  detalhe?: string;
}

export interface ResultadoQualidade {
  aprovado: boolean;
  /** aprovado e sem dependência do autor */
  publicavel: boolean;
  checagens: Checagem[];
  palavras: number;
  similaridadeMax: number;
  parSimilar?: string;
}

/** Domínios aceitos como fonte oficial para afirmação legal/normativa. */
const DOMINIOS_LEGAIS = [/\.gov\.br$/, /\.jus\.br$/, /\.leg\.br$/, /^www\.abnt\.org\.br$/, /^abnt\.org\.br$/];

/** Fontes técnicas oficiais (documentação de quem define a regra). */
const DOMINIOS_TECNICOS = [
  ...DOMINIOS_LEGAIS,
  /(^|\.)w3\.org$/, /(^|\.)google\.com$/, /(^|\.)developers\.google\.com$/, /(^|\.)web\.dev$/,
  /(^|\.)apple\.com$/, /(^|\.)android\.com$/, /(^|\.)microsoft\.com$/, /(^|\.)bing\.com$/,
  /(^|\.)registro\.br$/, /(^|\.)nic\.br$/, /(^|\.)cgi\.br$/, /(^|\.)ibge\.gov\.br$/,
  /(^|\.)mozilla\.org$/, /(^|\.)owasp\.org$/, /(^|\.)schema\.org$/, /(^|\.)iso\.org$/,
  /(^|\.)stripe\.com$/, /(^|\.)whatsapp\.com$/, /(^|\.)meta\.com$/, /(^|\.)facebook\.com$/,
  /(^|\.)github\.com$/, /(^|\.)nextjs\.org$/, /(^|\.)react\.dev$/, /(^|\.)postgresql\.org$/,
  /(^|\.)letsencrypt\.org$/, /(^|\.)sebrae\.com\.br$/, /(^|\.)indexnow\.org$/, /(^|\.)openai\.com$/,
  /(^|\.)anthropic\.com$/, /(^|\.)cloudflare\.com$/, /(^|\.)mercadopago\.com\.br$/,
];

function host(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function ehFonteLegal(url: string): boolean {
  const h = host(url);
  return !!h && DOMINIOS_LEGAIS.some((r) => r.test(h));
}

export function ehFonteOficial(url: string): boolean {
  if (url.startsWith("/")) return true; // dado próprio do site (calculadora, CEMPRE carregado)
  const h = host(url);
  return !!h && DOMINIOS_TECNICOS.some((r) => r.test(h));
}

const verificadas = fontesVerificadas as Record<string, { ok: boolean; status: number; em: string }>;

export function textoCorrido(p: PaginaConteudo): string {
  return [
    p.respostaDireta,
    ...p.secoes.flatMap((s) => [s.titulo, ...s.paragrafos, ...(s.lista ?? []), ...(s.tabela ? s.tabela.linhas.flat() : [])]),
    ...p.faq.flatMap((f) => [f.pergunta, f.resposta]),
    p.glossario?.exemploPratico ?? "",
    ...(p.modelo?.comoUsar ?? []),
    ...(p.modelo?.documento?.flatMap((d) => [d.titulo, d.texto]) ?? []),
    ...(p.modelo?.itens?.map((i) => i.item) ?? []),
    ...(p.norma ? [...p.norma.oQuePede, ...p.norma.oQueCobram, ...p.norma.evidencias, ...p.norma.errosComuns] : []),
    ...(p.comparativo
      ? [p.comparativo.quandoA, p.comparativo.quandoB, p.comparativo.veredito, ...p.comparativo.criterios.flatMap((c) => [c.a, c.b])]
      : []),
  ].join(" \n");
}

/**
 * Padrões de afirmação que só o autor pode fazer. LLM escrevendo "um cliente
 * meu economizou 40%" é invenção — reprova.
 */
const INVENCAO = [
  /\b(meus|nossos) clientes\b/i,
  /\bum cliente (meu|nosso)\b/i,
  /\b(atendi|atendemos|entreguei|entregamos|desenvolvi|desenvolvemos) (um|uma|o|a|mais de|\d)/i,
  /\bem um projeto (que fiz|recente|nosso|meu)\b/i,
  /\bna minha experiência\b/i,
  /\bnossa experiência\b/i,
  /\bdepoimento\b/i,
  /\b(estudos|pesquisas) (mostram|indicam|apontam)\b/i,
  /\bsegundo (uma )?pesquisa\b/i,
  /\b\d{1,3}% (das|dos) (empresas|usuários|consumidores|brasileiros|pequenas)\b/i,
];

const REF_LEGAL = /\b(Lei n|Lei \d|Lei Complementar|Decreto|art\. ?\d|artigo \d|Resolução|Portaria|Instrução Normativa|MP \d)/i;
const REF_NUMERICA = /(R\$ ?\d|US\$ ?\d|€ ?\d|\d+(,\d+)? ?%)/;

function primeirasFrasesCobremConsulta(resposta: string, consulta: string): { ok: boolean; cobertura: number } {
  const alvo = [...new Set(tokens(consulta))];
  if (!alvo.length) return { ok: true, cobertura: 1 };
  const inicio = new Set(tokens(frases(resposta).slice(0, 2).join(" ")));
  const cobertos = alvo.filter((t) => inicio.has(t)).length;
  const cobertura = cobertos / alvo.length;
  return { ok: cobertura >= 0.6, cobertura };
}

function normal(s: string): string {
  return semAcento(s.toLowerCase()).replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function consultaPrimeiroNoTitle(title: string, consulta: string): boolean {
  const t = normal(title);
  const q = normal(consulta);
  if (t.startsWith(q)) return true;
  // aceita a consulta reescrita, desde que os termos de conteúdo abram o título
  const alvo = [...new Set(tokens(consulta))];
  const abertura = new Set(tokens(title.slice(0, Math.max(30, consulta.length + 12))));
  return alvo.length > 0 && alvo.filter((x) => abertura.has(x)).length / alvo.length >= 0.75;
}

function h1RefleteConsulta(h1: string, consulta: string): boolean {
  const alvo = [...new Set(tokens(consulta))];
  const h = new Set(tokens(h1));
  return alvo.length === 0 || alvo.filter((x) => h.has(x)).length / alvo.length >= 0.7;
}

/** Evidência concreta do "valor próprio" declarado — declarar não basta. */
function valorProprioPresente(p: PaginaConteudo): { ok: boolean; detalhe: string } {
  const tabelas = p.secoes.filter((s) => s.tabela && s.tabela.linhas.length >= 3);
  const ordenadas = p.secoes.filter((s) => s.listaOrdenada && (s.lista?.length ?? 0) >= 4);
  const listasLongas = p.secoes.filter((s) => (s.lista?.length ?? 0) >= 6);
  switch (p.valorProprio.tipo) {
    case "tabela":
    case "calculo":
      return { ok: tabelas.length > 0, detalhe: "exige tabela com 3+ linhas" };
    case "modelo": {
      const m = p.modelo;
      const ok =
        !!m &&
        (((m.colunas?.length ?? 0) >= 3 && (m.linhasExemplo?.length ?? 0) >= 3) ||
          (m.itens?.length ?? 0) >= 8 ||
          (m.documento?.length ?? 0) >= 4);
      return { ok, detalhe: "exige modelo com prévia (3 colunas × 3 linhas, 8 itens ou 4 blocos)" };
    }
    case "checklist":
      return { ok: listasLongas.length > 0 || (p.modelo?.itens?.length ?? 0) >= 8, detalhe: "exige lista com 6+ itens" };
    case "passo-a-passo":
      return { ok: ordenadas.length > 0, detalhe: "exige lista ordenada com 4+ passos" };
    case "exemplo": {
      const ex = p.glossario?.exemploPratico ?? p.secoes.find((s) => /exemplo/i.test(s.titulo))?.paragrafos.join(" ") ?? "";
      return { ok: contarPalavras(ex) >= 50, detalhe: "exige exemplo prático com 50+ palavras" };
    }
    case "dado-proprio":
      return {
        ok: p.fontes.some((f) => f.url.startsWith("/")) || !!p.matriz,
        detalhe: "exige fonte interna (calculadora/CEMPRE) ou célula de matriz",
      };
  }
}

/** Avaliação individual — tudo que não depende das outras páginas. */
export function avaliarPagina(p: PaginaConteudo): ResultadoQualidade {
  const c: Checagem[] = [];
  const texto = textoCorrido(p);
  const palavras = contarPalavras(texto);

  const nResp = contarPalavras(p.respostaDireta);
  c.push({
    id: "resposta-direta-40-60",
    ok: nResp >= LIMITES.respostaMin - LIMITES.respostaFolga && nResp <= LIMITES.respostaMax + LIMITES.respostaFolga,
    detalhe: `${nResp} palavras`,
  });

  const cob = primeirasFrasesCobremConsulta(p.respostaDireta, p.consulta);
  c.push({ id: "responde-nas-2-primeiras-frases", ok: cob.ok, detalhe: `cobertura ${(cob.cobertura * 100).toFixed(0)}%` });

  const vp = valorProprioPresente(p);
  c.push({ id: "valor-proprio", ok: vp.ok, detalhe: `${p.valorProprio.tipo}: ${vp.detalhe}` });

  // Fontes
  const temRefLegal = REF_LEGAL.test(texto) || p.tipo === "norma";
  const temRefNumerica = REF_NUMERICA.test(texto);
  const legais = p.fontes.filter((f) => ehFonteLegal(f.url));
  const oficiais = p.fontes.filter((f) => ehFonteOficial(f.url));
  if (temRefLegal) c.push({ id: "fonte-legal-oficial", ok: legais.length > 0, detalhe: `${legais.length} fonte(s) .gov.br/.jus.br/.leg.br` });
  if (temRefNumerica) c.push({ id: "fonte-para-numeros", ok: oficiais.length > 0, detalhe: `${oficiais.length} fonte(s) oficial(is)` });
  if (p.norma) c.push({ id: "norma-url-oficial", ok: ehFonteLegal(p.norma.urlOficial), detalhe: p.norma.urlOficial });
  const externas = p.fontes.filter((f) => !f.url.startsWith("/"));
  const naoConfirmadas = externas.filter((f) => !verificadas[f.url]?.ok);
  c.push({
    id: "fontes-respondem",
    ok: naoConfirmadas.length === 0,
    detalhe: naoConfirmadas.length ? `sem resposta 2xx/3xx: ${naoConfirmadas.map((f) => f.url).join(", ")}` : `${externas.length} verificada(s)`,
  });

  const invencao = INVENCAO.filter((r) => r.test(texto)).map((r) => texto.match(r)?.[0]);
  c.push({ id: "nada-inventado", ok: invencao.length === 0, detalhe: invencao.length ? `trecho: "${invencao.join('", "')}"` : undefined });

  const min = LIMITES.palavrasMin[p.tipo];
  c.push({ id: "tamanho-pela-intencao", ok: palavras >= min, detalhe: `${palavras}/${min} palavras` });

  c.push({ id: "faq", ok: p.faq.length >= LIMITES.faqMin[p.tipo], detalhe: `${p.faq.length}/${LIMITES.faqMin[p.tipo]}` });

  c.push({ id: "title-ate-60", ok: p.title.length <= LIMITES.titleMax, detalhe: `${p.title.length} caracteres` });
  c.push({ id: "title-consulta-primeiro", ok: consultaPrimeiroNoTitle(p.title, p.consulta) });
  c.push({
    id: "description-70-155",
    ok: p.description.length >= LIMITES.descriptionMin && p.description.length <= LIMITES.descriptionMax,
    detalhe: `${p.description.length} caracteres`,
  });
  c.push({ id: "h1-e-a-consulta", ok: h1RefleteConsulta(p.h1, p.consulta) });

  const isca = getIsca(p.iscaId) ?? getIsca(getCluster(p.cluster)?.isca);
  c.push({ id: "isca-presente", ok: !!isca, detalhe: isca?.id });

  if (p.tipo === "glossario") c.push({ id: "glossario-exemplo", ok: !!p.glossario, detalhe: "bloco glossario obrigatório" });
  if (p.tipo === "modelo") c.push({ id: "modelo-previa", ok: !!p.modelo, detalhe: "bloco modelo obrigatório" });
  if (p.tipo === "norma") c.push({ id: "norma-estrutura", ok: !!p.norma, detalhe: "bloco norma obrigatório" });
  if (p.tipo === "comparativo") c.push({ id: "comparativo-criterios", ok: !!p.comparativo, detalhe: "bloco comparativo obrigatório" });

  const aprovado = c.every((x) => x.ok);
  return { aprovado, publicavel: aprovado && !p.dependeAutor, checagens: c, palavras, similaridadeMax: 0 };
}
