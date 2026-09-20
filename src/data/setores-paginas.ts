/**
 * Gerador do eixo de SETOR + quality gate.
 *
 * Três fontes se encontram aqui, e nenhuma é digitada na página:
 *   - mercado: CEMPRE/IBGE (setores-cempre.json, carregado por script)
 *   - preço:   calcularEstimativa() sobre a tabela de lib/calculadora.ts
 *   - conteúdo: setores.ts (editorial, específico por setor)
 *
 * Setor cuja carga veio incompleta não vira página indexável. Isso é o
 * sistema funcionando.
 */

import {
  calcularEstimativa,
  formatBRL,
  formatDataCarga,
  getConfig,
  FONTE_PRECIFICACAO,
  type Estimativa,
} from "@/lib/calculadora";
import { setoresConteudo, type SetorConteudo } from "./setores";
import cempre from "./setores-cempre.json";
import { BASE_URL, paginasCusto, type ResultadoGate } from "./custos";
import type { FAQ } from "./custos-tipos";

export interface DadoSetor {
  slug: string;
  cnae: string;
  empresasBrasil: number;
  pessoalOcupado: number | null;
  salariosMilReais: number | null;
  topUfs: Array<{ uf: string; empresas: number }>;
  ufsComDado: number;
}

export interface FonteDado {
  nome: string;
  url: string;
  anoReferencia: string;
  carregadoEm: string;
}

export const fonteMercado: FonteDado = {
  nome: cempre.fonte,
  url: cempre.fonteUrl,
  anoReferencia: String(cempre.anoReferencia),
  carregadoEm: cempre.carregadoEm,
};

const GATE_SETOR = {
  minPalavras: 240,
  minFaqs: 3,
  minModulos: 5,
  /** abaixo disso o setor é pequeno demais para sustentar uma página */
  minEmpresas: 5_000,
  /** carga precisa cobrir quase todas as UFs para a distribuição ser honesta */
  minUfs: 20,
} as const;

export interface PaginaSetor {
  slug: string;
  url: string;
  title: string;
  metaDescription: string;
  h1: string;
  conteudo: SetorConteudo;
  dado: DadoSetor;
  preco: {
    faixa: string;
    min: number;
    max: number;
    estimativa: Estimativa;
    fonte: string;
    atualizadoEm: string;
    atualizadoEmISO: string;
  };
  /** participação do setor no total de empresas do país, calculada */
  participacaoPct: string;
  /** concentração nas 5 maiores UFs, calculada */
  concentracaoTop5Pct: string;
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

function formatarNumero(n: number): string {
  return n.toLocaleString("pt-BR");
}

const dadosPorSlug = new Map<string, DadoSetor>(
  (cempre.setores as DadoSetor[]).map((s) => [s.slug, s])
);

/** Total de empresas do país, no mesmo recorte e período — vem da carga. */
const TOTAL_EMPRESAS_BR = cempre.totalEmpresasBrasil;

function montar(conteudo: SetorConteudo): PaginaSetor | null {
  const dado = dadosPorSlug.get(conteudo.slug);
  const reprovacoes: string[] = [];

  if (!dado) {
    // Sem dado carregado não existe página: ela não teria o que dizer.
    return null;
  }

  const config = getConfig(conteudo.projeto.variante);
  const estimativa = calcularEstimativa(config, {
    tipoId: conteudo.projeto.tipoId,
    volumeId: conteudo.projeto.volumeId,
    integracaoIds: conteudo.projeto.integracaoIds,
    prazoId: "padrao",
  });
  const faixa = `${formatBRL(estimativa.min)} a ${formatBRL(estimativa.max)}`;

  const palavras = contarPalavras(
    conteudo.intro,
    conteudo.ondeODinheiroVaza,
    conteudo.faqs.map((f) => f.a)
  );

  if (palavras < GATE_SETOR.minPalavras)
    reprovacoes.push(`prosa própria insuficiente (${palavras}/${GATE_SETOR.minPalavras})`);
  if (conteudo.faqs.length < GATE_SETOR.minFaqs)
    reprovacoes.push(`FAQs insuficientes (${conteudo.faqs.length}/${GATE_SETOR.minFaqs})`);
  if (conteudo.oQueOSistemaPrecisa.length < GATE_SETOR.minModulos)
    reprovacoes.push(`módulos insuficientes (${conteudo.oQueOSistemaPrecisa.length}/${GATE_SETOR.minModulos})`);
  if (dado.empresasBrasil < GATE_SETOR.minEmpresas)
    reprovacoes.push(`setor pequeno demais (${dado.empresasBrasil} empresas)`);
  if (dado.ufsComDado < GATE_SETOR.minUfs)
    reprovacoes.push(`carga incompleta (${dado.ufsComDado}/27 UFs)`);
  if (!(estimativa.min > 0 && estimativa.max > estimativa.min))
    reprovacoes.push("faixa de preço inválida");

  const top5 = dado.topUfs.slice(0, 5).reduce((s, u) => s + u.empresas, 0);

  return {
    slug: conteudo.slug,
    url: `${BASE_URL}/sistema-para/${conteudo.slug}`,
    title: conteudo.title,
    metaDescription: conteudo.metaDesc(formatarNumero(dado.empresasBrasil), faixa),
    h1: conteudo.h1,
    conteudo,
    dado,
    preco: {
      faixa,
      min: estimativa.min,
      max: estimativa.max,
      estimativa,
      fonte: FONTE_PRECIFICACAO,
      atualizadoEm: formatDataCarga(config.atualizadoEm),
      atualizadoEmISO: config.atualizadoEm,
    },
    participacaoPct: ((dado.empresasBrasil / TOTAL_EMPRESAS_BR) * 100).toFixed(1),
    concentracaoTop5Pct: ((top5 / dado.empresasBrasil) * 100).toFixed(0),
    faqs: conteudo.faqs,
    gate: { aprovado: reprovacoes.length === 0, reprovacoes, palavras },
  };
}

export const paginasSetor: PaginaSetor[] = (() => {
  const paginas = setoresConteudo
    .map(montar)
    .filter((p): p is PaginaSetor => p !== null);

  // Unicidade dentro do eixo E contra o eixo de custo — os dois publicam juntos.
  const titulosCusto = new Set(paginasCusto.map((p) => p.title.trim().toLowerCase()));
  const h1sCusto = new Set(paginasCusto.map((p) => p.h1.trim().toLowerCase()));

  for (const campo of ["title", "h1", "metaDescription"] as const) {
    const vistos = new Map<string, number>();
    for (const p of paginas) {
      const v = p[campo].trim().toLowerCase();
      vistos.set(v, (vistos.get(v) ?? 0) + 1);
    }
    for (const p of paginas) {
      const v = p[campo].trim().toLowerCase();
      if ((vistos.get(v) ?? 0) > 1) {
        p.gate.reprovacoes.push(`${campo} duplicado dentro do eixo de setor`);
        p.gate.aprovado = false;
      }
      if (
        (campo === "title" && titulosCusto.has(v)) ||
        (campo === "h1" && h1sCusto.has(v))
      ) {
        p.gate.reprovacoes.push(`${campo} colide com o eixo de custo`);
        p.gate.aprovado = false;
      }
    }
  }

  return paginas;
})();

export const setoresIndexaveis = paginasSetor.filter((p) => p.gate.aprovado);
export const setoresReprovados = paginasSetor.filter((p) => !p.gate.aprovado);

export function getPaginaSetor(slug: string): PaginaSetor | undefined {
  return paginasSetor.find((p) => p.slug === slug);
}

/** Relacionados: setores vizinhos + a página de custo do mesmo projeto. */
export function setoresRelacionados(pagina: PaginaSetor): PaginaSetor[] {
  return setoresIndexaveis
    .filter((p) => p.slug !== pagina.slug)
    .sort((a, b) => b.dado.empresasBrasil - a.dado.empresasBrasil)
    .slice(0, 4);
}

export function resumoGateSetor() {
  return {
    total: paginasSetor.length,
    indexaveis: setoresIndexaveis.length,
    reprovados: setoresReprovados.map((p) => ({
      url: p.url,
      motivos: p.gate.reprovacoes,
    })),
  };
}
