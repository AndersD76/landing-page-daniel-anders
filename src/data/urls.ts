/**
 * Fonte única das URLs indexáveis do site.
 *
 * Sitemaps e IndexNow consomem daqui. Ter dois lugares listando URL é como
 * garantir que um dia eles vão divergir — e a divergência só aparece no
 * Search Console, semanas depois.
 */

import { getServiceSlugs } from "./services";
import { getAllPosts } from "./blog";
import { BASE_URL, paginasIndexaveis } from "./custos";
import { setoresIndexaveis } from "./setores-paginas";
import { cidadesIndexaveis } from "./cidades";
import { alternativasIndexaveis } from "./alternativas-paginas";
import type { UrlSitemap } from "@/lib/sitemap";
import { paginasNoArDoTipo, type TipoConteudo } from "@/lib/conteudo";
import { CLUSTERS } from "@/lib/seo/taxonomia";
import { ISCAS } from "./iscas";

export { BASE_URL };

/** Páginas fixas — conteúdo gerado tem sitemap próprio. */
const FIXAS: Array<{
  path: string;
  priority: number;
  changefreq: "weekly" | "monthly" | "yearly";
}> = [
  { path: "", priority: 1.0, changefreq: "weekly" },
  { path: "/quanto-custa", priority: 0.9, changefreq: "monthly" },
  { path: "/sistema-para", priority: 0.9, changefreq: "monthly" },
  { path: "/sites-e-sistemas", priority: 0.9, changefreq: "monthly" },
  { path: "/alternativa-a", priority: 0.9, changefreq: "monthly" },
  { path: "/calculadora-site", priority: 0.9, changefreq: "monthly" },
  { path: "/calculadora-app", priority: 0.9, changefreq: "monthly" },
  { path: "/apps", priority: 0.8, changefreq: "weekly" },
  { path: "/apps/calculadora", priority: 0.7, changefreq: "monthly" },
  { path: "/para-startups", priority: 0.8, changefreq: "monthly" },
  { path: "/para-pmes-brasil", priority: 0.8, changefreq: "monthly" },
  { path: "/agencias-parceiras", priority: 0.8, changefreq: "monthly" },
  { path: "/trabalhar-comigo", priority: 0.8, changefreq: "monthly" },
  { path: "/recursos/spec-app-startup", priority: 0.7, changefreq: "monthly" },
  { path: "/privacidade", priority: 0.3, changefreq: "yearly" },
];

export function urlsFixas(): UrlSitemap[] {
  return FIXAS.map((p) => ({
    loc: `${BASE_URL}${p.path}`,
    changefreq: p.changefreq,
    priority: p.priority,
  }));
}

export function urlsServicos(): UrlSitemap[] {
  return getServiceSlugs().map((slug) => ({
    loc: `${BASE_URL}/servicos/${slug}`,
    changefreq: "monthly" as const,
    priority: 0.8,
  }));
}

export function urlsBlog(): UrlSitemap[] {
  return [
    { loc: `${BASE_URL}/blog`, changefreq: "daily" as const, priority: 0.9 },
    ...getAllPosts().map((post) => ({
      loc: `${BASE_URL}/blog/${post.slug}`,
      lastmod: post.publishedAt,
      changefreq: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

/** Só o que passou no quality gate. Reprovada não é anunciada. */
export function urlsCustos(): UrlSitemap[] {
  return paginasIndexaveis.map((p) => ({
    loc: p.url,
    lastmod: p.preco.atualizadoEmISO,
    changefreq: "monthly" as const,
    priority: p.kind === "tipo" ? 0.8 : 0.7,
  }));
}

/** Só o que passou no quality gate do eixo de setor. */
export function urlsSetores(): UrlSitemap[] {
  return setoresIndexaveis.map((p) => ({
    loc: p.url,
    lastmod: p.preco.atualizadoEmISO,
    changefreq: "monthly" as const,
    priority: 0.8,
  }));
}

/** Só o que passou no quality gate do eixo geográfico. */
export function urlsCidades(): UrlSitemap[] {
  return cidadesIndexaveis.map((p) => ({
    loc: p.url,
    lastmod: p.preco.atualizadoEmISO,
    changefreq: "monthly" as const,
    priority: 0.7,
  }));
}

/** Só o que passou no quality gate do eixo de comparação. */
export function urlsAlternativas(): UrlSitemap[] {
  return alternativasIndexaveis.map((p) => ({
    loc: p.url,
    lastmod: p.preco.atualizadoEmISO,
    changefreq: "monthly" as const,
    priority: 0.8,
  }));
}

/** Conteúdo em escala: só o que está no ar (aprovado + onda liberada). lastmod = revisão real. */
export function urlsConteudo(tipo: TipoConteudo, agora = new Date()): UrlSitemap[] {
  return paginasNoArDoTipo(tipo, agora).map((p) => ({
    loc: p.urlAbsoluta,
    lastmod: p.revisadoEm,
    changefreq: "monthly" as const,
    priority: p.tipo === "pilar" ? 0.9 : 0.6,
  }));
}

/** Ferramentas, hubs e páginas institucionais novas. */
export function urlsFerramentasEHubs(): UrlSitemap[] {
  const revisao = "2026-11-18";
  const caminhos = [
    "/ferramentas",
    ...ISCAS.filter((i) => i.href.startsWith("/ferramentas/")).map((i) => i.href),
    "/guias",
    "/perguntas",
    "/modelos",
    "/glossario",
    "/leis",
    "/comparar",
    ...CLUSTERS.map((c) => `/temas/${c.id}`),
    "/sobre",
    "/sobre/daniel-anders",
    "/politica-editorial",
    "/dados/empresas-por-setor",
    "/dados/metodologia",
  ];
  return caminhos.map((p) => ({
    loc: `${BASE_URL}${p}`,
    lastmod: revisao,
    changefreq: "monthly" as const,
    priority: p.startsWith("/ferramentas") ? 0.8 : 0.6,
  }));
}

export const TIPOS_SITEMAP: Array<{ arquivo: string; tipo: TipoConteudo }> = [
  { arquivo: "sitemap-guias.xml", tipo: "pilar" },
  { arquivo: "sitemap-perguntas.xml", tipo: "satelite" },
  { arquivo: "sitemap-modelos.xml", tipo: "modelo" },
  { arquivo: "sitemap-glossario.xml", tipo: "glossario" },
  { arquivo: "sitemap-leis.xml", tipo: "norma" },
  { arquivo: "sitemap-comparativos.xml", tipo: "comparativo" },
];

export function todasUrlsIndexaveis(): string[] {
  return [
    ...urlsFerramentasEHubs(),
    ...TIPOS_SITEMAP.flatMap((t) => urlsConteudo(t.tipo)),
    ...urlsFixas(),
    ...urlsServicos(),
    ...urlsBlog(),
    ...urlsCustos(),
    ...urlsSetores(),
    ...urlsCidades(),
    ...urlsAlternativas(),
  ].map((u) => u.loc);
}
