/**
 * Gerador do eixo de comparação + gate.
 *
 * A faixa de comparação vem de calcularEstimativa(). Nenhum preço de
 * concorrente entra aqui — ver o cabeçalho de alternativas.ts.
 */

import {
  calcularEstimativa,
  formatBRL,
  formatDataCarga,
  getConfig,
  FONTE_PRECIFICACAO,
  type Estimativa,
} from "@/lib/calculadora";
import { alternativas, type Alternativa } from "./alternativas";
import { BASE_URL, paginasCusto, type ResultadoGate } from "./custos";
import type { FAQ } from "./custos-tipos";

const GATE_ALT = {
  minPalavras: 220,
  minFaqs: 3,
  minItens: 4,
} as const;

export interface PaginaAlternativa {
  slug: string;
  url: string;
  title: string;
  metaDescription: string;
  h1: string;
  alternativa: Alternativa;
  preco: {
    faixa: string;
    min: number;
    max: number;
    estimativa: Estimativa;
    fonte: string;
    atualizadoEm: string;
    atualizadoEmISO: string;
  };
  faqs: FAQ[];
  gate: ResultadoGate;
}

function contarPalavras(...blocos: (string | string[] | undefined)[]): number {
  return blocos
    .flatMap((b) => (Array.isArray(b) ? b : [b]))
    .filter((s): s is string => typeof s === "string")
    .join(" ")
    .split(/\s+/)
    .filter((w) => w.replace(/[^\p{L}]/gu, "").length > 1).length;
}

function montar(alt: Alternativa): PaginaAlternativa {
  const config = getConfig(alt.projeto.variante);
  const estimativa = calcularEstimativa(config, {
    tipoId: alt.projeto.tipoId,
    volumeId: alt.projeto.volumeId,
    integracaoIds: [],
    prazoId: "padrao",
  });
  const faixa = `${formatBRL(estimativa.min)} a ${formatBRL(estimativa.max)}`;

  const palavras = contarPalavras(
    alt.intro,
    alt.sinalDeTroca,
    alt.faqs.map((f) => f.a)
  );

  const reprovacoes: string[] = [];
  if (palavras < GATE_ALT.minPalavras)
    reprovacoes.push(`prosa própria insuficiente (${palavras}/${GATE_ALT.minPalavras})`);
  if (alt.faqs.length < GATE_ALT.minFaqs)
    reprovacoes.push(`FAQs insuficientes (${alt.faqs.length}/${GATE_ALT.minFaqs})`);
  if (alt.ondeElaGanha.length < GATE_ALT.minItens)
    reprovacoes.push("lista de pontos fortes insuficiente");
  if (alt.ondeTrava.length < GATE_ALT.minItens)
    reprovacoes.push("lista de limites insuficiente");
  if (!(estimativa.min > 0 && estimativa.max > estimativa.min))
    reprovacoes.push("faixa de preço inválida");

  return {
    slug: alt.slug,
    url: `${BASE_URL}/alternativa-a/${alt.slug}`,
    title: alt.title,
    metaDescription: alt.metaDesc(faixa),
    h1: alt.h1,
    alternativa: alt,
    preco: {
      faixa,
      min: estimativa.min,
      max: estimativa.max,
      estimativa,
      fonte: FONTE_PRECIFICACAO,
      atualizadoEm: formatDataCarga(config.atualizadoEm),
      atualizadoEmISO: config.atualizadoEm,
    },
    faqs: alt.faqs,
    gate: { aprovado: reprovacoes.length === 0, reprovacoes, palavras },
  };
}

export const paginasAlternativa: PaginaAlternativa[] = (() => {
  const paginas = alternativas.map(montar);
  const titulosCusto = new Set(paginasCusto.map((p) => p.title.trim().toLowerCase()));

  for (const campo of ["title", "h1", "metaDescription"] as const) {
    const vistos = new Map<string, number>();
    for (const p of paginas) {
      const v = p[campo].trim().toLowerCase();
      vistos.set(v, (vistos.get(v) ?? 0) + 1);
    }
    for (const p of paginas) {
      const v = p[campo].trim().toLowerCase();
      if ((vistos.get(v) ?? 0) > 1) {
        p.gate.reprovacoes.push(`${campo} duplicado dentro do eixo de comparação`);
        p.gate.aprovado = false;
      }
      if (campo === "title" && titulosCusto.has(v)) {
        p.gate.reprovacoes.push("title colide com o eixo de custo");
        p.gate.aprovado = false;
      }
    }
  }

  return paginas;
})();

export const alternativasIndexaveis = paginasAlternativa.filter((p) => p.gate.aprovado);
export const alternativasReprovadas = paginasAlternativa.filter((p) => !p.gate.aprovado);

export function getPaginaAlternativa(slug: string): PaginaAlternativa | undefined {
  return paginasAlternativa.find((p) => p.slug === slug);
}
