/**
 * Gerador do eixo "quanto custa" + quality gate.
 *
 * Nada aqui inventa número. Toda faixa sai de calcularEstimativa() sobre a
 * tabela de lib/calculadora.ts, e a data do carimbo sai de config.atualizadoEm.
 *
 * O gate é obrigatório: página que não atinge o mínimo de conteúdo próprio sai
 * com noindex e fica de fora do sitemap. Reprovar é o sistema funcionando.
 */

import {
  calcularEstimativa,
  formatBRL,
  formatDataCarga,
  getConfig,
  FONTE_PRECIFICACAO,
  type Estimativa,
} from "@/lib/calculadora";
import { tiposCusto, type TipoCusto, type FAQ } from "./custos-tipos";
import { combosCusto, type ComboCusto } from "./custos-combos";

export const BASE_URL = "https://www.andersdev.com.br";

/* ------------------------------------------------------------------ gate */

/** Mínimos para uma página do eixo entrar no índice. */
export const GATE = {
  /** palavras de prosa própria (não conta rótulo de UI nem número) */
  minPalavras: 220,
  /** perguntas próprias respondidas na página */
  minFaqs: 3,
  /** itens de lista específicos da entidade */
  minItensLista: 4,
} as const;

export interface ResultadoGate {
  aprovado: boolean;
  reprovacoes: string[];
  palavras: number;
}

function contarPalavras(...blocos: (string | string[] | undefined)[]): number {
  const texto = blocos
    .flatMap((b) => (Array.isArray(b) ? b : [b]))
    .filter((s): s is string => typeof s === "string")
    .join(" ");
  return texto.split(/\s+/).filter((w) => w.replace(/[^\p{L}]/gu, "").length > 1)
    .length;
}

/* ------------------------------------------------------------- preços */

export interface PrecoPagina {
  faixa: string;
  min: number;
  max: number;
  estimativa: Estimativa;
  /** acréscimo da integração, quando a página for de combinação */
  acrescimo?: string;
  fonte: string;
  atualizadoEm: string;
  atualizadoEmISO: string;
}

function precoDe(
  tipo: TipoCusto,
  integracaoId?: string
): PrecoPagina {
  const config = getConfig(tipo.variante);
  const base = calcularEstimativa(config, {
    tipoId: tipo.tipoId,
    volumeId: tipo.volumeRef,
    integracaoIds: [],
    prazoId: "padrao",
  });

  const alvo = integracaoId
    ? calcularEstimativa(config, {
        tipoId: tipo.tipoId,
        volumeId: tipo.volumeRef,
        integracaoIds: [integracaoId],
        prazoId: "padrao",
      })
    : base;

  const acrescimo = integracaoId
    ? `${formatBRL(alvo.min - base.min)} a ${formatBRL(alvo.max - base.max)}`
    : undefined;

  return {
    faixa: `${formatBRL(alvo.min)} a ${formatBRL(alvo.max)}`,
    min: alvo.min,
    max: alvo.max,
    estimativa: alvo,
    acrescimo,
    fonte: FONTE_PRECIFICACAO,
    atualizadoEm: formatDataCarga(config.atualizadoEm),
    atualizadoEmISO: config.atualizadoEm,
  };
}

/* ------------------------------------------------------------- páginas */

export interface PaginaCusto {
  kind: "tipo" | "combo";
  url: string;
  slugPath: string[];
  title: string;
  metaDescription: string;
  h1: string;
  preco: PrecoPagina;
  gate: ResultadoGate;
  /** conteúdo já resolvido, para o template não precisar saber de qual fonte veio */
  tipo: TipoCusto;
  combo?: ComboCusto;
  faqs: FAQ[];
}

function montarTipo(tipo: TipoCusto): PaginaCusto {
  const preco = precoDe(tipo);
  const palavras = contarPalavras(
    tipo.intro,
    tipo.quandoVale,
    tipo.quandoNaoVale,
    tipo.prazoTipico,
    tipo.faqs.map((f) => f.a)
  );

  const reprovacoes: string[] = [];
  if (palavras < GATE.minPalavras)
    reprovacoes.push(`prosa própria insuficiente (${palavras}/${GATE.minPalavras})`);
  if (tipo.faqs.length < GATE.minFaqs)
    reprovacoes.push(`FAQs insuficientes (${tipo.faqs.length}/${GATE.minFaqs})`);
  if (tipo.oQueEntra.length < GATE.minItensLista)
    reprovacoes.push("lista de escopo insuficiente");
  if (!(preco.min > 0 && preco.max > preco.min))
    reprovacoes.push("faixa de preço inválida");

  return {
    kind: "tipo",
    url: `${BASE_URL}/quanto-custa/${tipo.slug}`,
    slugPath: [tipo.slug],
    title: tipo.title,
    metaDescription: tipo.metaDesc(preco.faixa),
    h1: tipo.h1,
    preco,
    gate: { aprovado: reprovacoes.length === 0, reprovacoes, palavras },
    tipo,
    faqs: tipo.faqs,
  };
}

function montarCombo(combo: ComboCusto): PaginaCusto | null {
  const tipo = tiposCusto.find((t) => t.slug === combo.tipoSlug);
  if (!tipo) return null;

  const preco = precoDe(tipo, combo.integracaoId);
  const palavras = contarPalavras(
    combo.intro,
    combo.ondeTravaCaro,
    combo.faqs.map((f) => f.a)
  );

  const reprovacoes: string[] = [];
  if (palavras < GATE.minPalavras)
    reprovacoes.push(`prosa própria insuficiente (${palavras}/${GATE.minPalavras})`);
  if (combo.faqs.length < GATE.minFaqs)
    reprovacoes.push(`FAQs insuficientes (${combo.faqs.length}/${GATE.minFaqs})`);
  if (combo.oQueMuda.length < GATE.minItensLista)
    reprovacoes.push("lista do que muda insuficiente");
  if (!preco.acrescimo) reprovacoes.push("acréscimo da integração não calculado");
  if (!(preco.min > 0 && preco.max > preco.min))
    reprovacoes.push("faixa de preço inválida");

  return {
    kind: "combo",
    url: `${BASE_URL}/quanto-custa/${tipo.slug}/${combo.slug}`,
    slugPath: [tipo.slug, combo.slug],
    title: combo.title,
    metaDescription: combo.metaDesc(preco.faixa, preco.acrescimo ?? ""),
    h1: combo.h1,
    preco,
    gate: { aprovado: reprovacoes.length === 0, reprovacoes, palavras },
    tipo,
    combo,
    faqs: combo.faqs,
  };
}

/** Todas as páginas do eixo, com o gate já aplicado. */
export const paginasCusto: PaginaCusto[] = (() => {
  const paginas = [
    ...tiposCusto.map(montarTipo),
    ...combosCusto.map(montarCombo).filter((p): p is PaginaCusto => p !== null),
  ];

  // Unicidade: title, H1 e description repetidos em escala derrubam o domínio.
  // Quem repete reprova — inclusive a primeira ocorrência, porque não dá para
  // saber qual das duas é a correta.
  for (const campo of ["title", "h1", "metaDescription"] as const) {
    const vistos = new Map<string, number>();
    for (const p of paginas) {
      const v = p[campo].trim().toLowerCase();
      vistos.set(v, (vistos.get(v) ?? 0) + 1);
    }
    for (const p of paginas) {
      if ((vistos.get(p[campo].trim().toLowerCase()) ?? 0) > 1) {
        p.gate.reprovacoes.push(`${campo} duplicado com outra página`);
        p.gate.aprovado = false;
      }
    }
  }

  return paginas;
})();

export const paginasIndexaveis = paginasCusto.filter((p) => p.gate.aprovado);
export const paginasReprovadas = paginasCusto.filter((p) => !p.gate.aprovado);

export function getPaginaCusto(slugPath: string[]): PaginaCusto | undefined {
  return paginasCusto.find(
    (p) =>
      p.slugPath.length === slugPath.length &&
      p.slugPath.every((s, i) => s === slugPath[i])
  );
}

/** Relacionados do rodapé — página órfã não é descoberta. */
export function relacionadasDe(pagina: PaginaCusto): PaginaCusto[] {
  const irmaos = paginasIndexaveis.filter(
    (p) => p.tipo.slug === pagina.tipo.slug && p.url !== pagina.url
  );
  const outrosTipos = paginasIndexaveis.filter(
    (p) =>
      p.kind === "tipo" &&
      p.tipo.slug !== pagina.tipo.slug &&
      p.tipo.variante === pagina.tipo.variante
  );
  const travessia = paginasIndexaveis.filter(
    (p) => p.kind === "tipo" && p.tipo.variante !== pagina.tipo.variante
  );
  return [...irmaos, ...outrosTipos, ...travessia].slice(0, 6);
}

/** Resumo para o script de validação e para o relatório de carga. */
export function resumoGate() {
  return {
    total: paginasCusto.length,
    indexaveis: paginasIndexaveis.length,
    reprovadas: paginasReprovadas.map((p) => ({
      url: p.url,
      motivos: p.gate.reprovacoes,
    })),
  };
}
