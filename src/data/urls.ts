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
import type { UrlSitemap } from "@/lib/sitemap";

export { BASE_URL };

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Páginas fixas — conteúdo gerado tem sitemap próprio. */
const FIXAS: Array<{
  path: string;
  priority: number;
  changefreq: "weekly" | "monthly" | "yearly";
}> = [
  { path: "", priority: 1.0, changefreq: "weekly" },
  { path: "/quanto-custa", priority: 0.9, changefreq: "monthly" },
  { path: "/sistema-para", priority: 0.9, changefreq: "monthly" },
  { path: "/calculadora-site", priority: 0.9, changefreq: "monthly" },
  { path: "/calculadora-app", priority: 0.9, changefreq: "monthly" },
  { path: "/apps", priority: 0.8, changefreq: "weekly" },
  { path: "/apps/calculadora", priority: 0.7, changefreq: "monthly" },
  { path: "/para-startups", priority: 0.8, changefreq: "monthly" },
  { path: "/para-pmes-brasil", priority: 0.8, changefreq: "monthly" },
  { path: "/agencias-parceiras", priority: 0.8, changefreq: "monthly" },
  { path: "/trabalhar-comigo", priority: 0.8, changefreq: "monthly" },
  { path: "/cursos", priority: 0.7, changefreq: "monthly" },
  { path: "/recursos/spec-app-startup", priority: 0.7, changefreq: "monthly" },
  { path: "/privacidade", priority: 0.3, changefreq: "yearly" },
];

export function urlsFixas(): UrlSitemap[] {
  return FIXAS.map((p) => ({
    loc: `${BASE_URL}${p.path}`,
    lastmod: hoje(),
    changefreq: p.changefreq,
    priority: p.priority,
  }));
}

export function urlsServicos(): UrlSitemap[] {
  return getServiceSlugs().map((slug) => ({
    loc: `${BASE_URL}/servicos/${slug}`,
    lastmod: hoje(),
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

export function todasUrlsIndexaveis(): string[] {
  return [
    ...urlsFixas(),
    ...urlsServicos(),
    ...urlsBlog(),
    ...urlsCustos(),
    ...urlsSetores(),
  ].map((u) => u.loc);
}
