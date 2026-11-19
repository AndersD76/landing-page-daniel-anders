/**
 * Formato do conteúdo editorial em escala (pilar, satélite, modelo, glossário,
 * norma, comparativo).
 *
 * Padrão do repo: conteúdo é dado versionado, renderizado no servidor. Cada
 * arquivo em src/content/<tipo>/*.json é uma lista de páginas neste formato.
 * O job de produção contínua grava aqui também — então este schema é o
 * contrato entre quem escreve (gente ou LLM) e quem publica (templates + gate).
 */

import { z } from "zod";

export const TIPOS_CONTEUDO = ["pilar", "satelite", "modelo", "glossario", "norma", "comparativo"] as const;
export type TipoConteudo = (typeof TIPOS_CONTEUDO)[number];

export const CLUSTER_IDS = [
  "custo-projeto",
  "sites",
  "seo-google",
  "ecommerce",
  "aplicativos",
  "sistemas-gestao",
  "automacao-integracao",
  "lgpd-legal",
  "contratacao-projeto",
] as const;

/** Prefixo de rota por tipo. Mudar aqui exige 301 das URLs antigas. */
export const ROTA_POR_TIPO: Record<TipoConteudo, string> = {
  pilar: "/guias",
  satelite: "/perguntas",
  modelo: "/modelos",
  glossario: "/glossario",
  norma: "/leis",
  comparativo: "/comparar",
};

export const ROTULO_TIPO: Record<TipoConteudo, string> = {
  pilar: "Guia",
  satelite: "Pergunta",
  modelo: "Modelo",
  glossario: "Glossário",
  norma: "Lei explicada",
  comparativo: "Comparativo",
};

const tabelaSchema = z.object({
  colunas: z.array(z.string()).min(2),
  linhas: z.array(z.array(z.string())).min(1),
  legenda: z.string().optional(),
});

const secaoSchema = z.object({
  titulo: z.string().min(3),
  paragrafos: z.array(z.string().min(1)).default([]),
  lista: z.array(z.string().min(1)).optional(),
  listaOrdenada: z.boolean().optional(),
  tabela: tabelaSchema.optional(),
});

const fonteSchema = z.object({
  titulo: z.string().min(3),
  /** URL absoluta (fonte externa) ou caminho interno começando com "/" (dado próprio). */
  url: z.string().min(1),
  orgao: z.string().min(2),
  consultadoEm: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const faqSchema = z.object({
  pergunta: z.string().min(8),
  resposta: z.string().min(20),
});

export const VALOR_PROPRIO = [
  "calculo",
  "tabela",
  "modelo",
  "exemplo",
  "checklist",
  "dado-proprio",
  "passo-a-passo",
] as const;

const extraGlossario = z.object({
  termo: z.string().min(1),
  sigla: z.string().optional(),
  exemploPratico: z.string().min(80),
  termosRelacionados: z.array(z.string()).default([]),
});

const extraModelo = z.object({
  formato: z.enum(["planilha", "checklist", "documento"]),
  setor: z.string().optional(),
  comoUsar: z.array(z.string().min(5)).min(3),
  colunas: z.array(z.string()).optional(),
  linhasExemplo: z.array(z.array(z.string())).optional(),
  itens: z.array(z.object({ grupo: z.string(), item: z.string() })).optional(),
  documento: z.array(z.object({ titulo: z.string(), texto: z.string() })).optional(),
});

const extraNorma = z.object({
  norma: z.string().min(3),
  dispositivo: z.string().min(2),
  urlOficial: z.string().url(),
  oQuePede: z.array(z.string().min(5)).min(2),
  oQueCobram: z.array(z.string().min(5)).min(2),
  evidencias: z.array(z.string().min(5)).min(2),
  errosComuns: z.array(z.string().min(5)).min(2),
});

const extraComparativo = z.object({
  opcaoA: z.string().min(2),
  opcaoB: z.string().min(2),
  criterios: z.array(z.object({ criterio: z.string(), a: z.string(), b: z.string() })).min(5),
  quandoA: z.string().min(40),
  quandoB: z.string().min(40),
  veredito: z.string().min(40),
});

export const paginaConteudoSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug em kebab-case sem acento"),
  tipo: z.enum(TIPOS_CONTEUDO),
  cluster: z.enum(CLUSTER_IDS),
  consulta: z.string().min(3),
  consultasSecundarias: z.array(z.string()).default([]),
  title: z.string().min(10),
  description: z.string().min(50),
  h1: z.string().min(3),
  respostaDireta: z.string().min(80),
  secoes: z.array(secaoSchema).min(1),
  valorProprio: z.object({ tipo: z.enum(VALOR_PROPRIO), descricao: z.string().min(10) }),
  faq: z.array(faqSchema).default([]),
  fontes: z.array(fonteSchema).default([]),
  iscaId: z.string().optional(),
  /** true = depende de experiência, número ou decisão do autor → rascunho, não publica */
  dependeAutor: z.boolean().default(false),
  notaAutor: z.string().optional(),
  /** onda de publicação (ver src/data/seo/ondas.json) */
  onda: z.number().int().min(1).default(1),
  revisadoEm: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  publicadoEm: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  /** de onde veio: matriz programática e célula, quando houver */
  matriz: z.string().optional(),
  celula: z.record(z.string()).optional(),
  glossario: extraGlossario.optional(),
  modelo: extraModelo.optional(),
  norma: extraNorma.optional(),
  comparativo: extraComparativo.optional(),
});

export type PaginaConteudoBruta = z.input<typeof paginaConteudoSchema>;
export type PaginaConteudo = z.output<typeof paginaConteudoSchema>;
export type Secao = z.output<typeof secaoSchema>;
export type Fonte = z.output<typeof fonteSchema>;

export function urlDe(p: Pick<PaginaConteudo, "tipo" | "slug">): string {
  return `${ROTA_POR_TIPO[p.tipo]}/${p.slug}`;
}
