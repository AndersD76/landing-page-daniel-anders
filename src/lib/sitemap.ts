/**
 * Geração de sitemap. Sempre a partir dos dados — nunca editado à mão.
 *
 * O índice em /sitemap.xml aponta para um filho por tipo de conteúdo. Página
 * reprovada no quality gate não entra em nenhum deles: se não merece índice,
 * não merece sitemap.
 */

export interface UrlSitemap {
  loc: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

function escapar(url: string): string {
  return url
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function dataISO(valor?: string | Date): string | undefined {
  if (!valor) return undefined;
  const d = valor instanceof Date ? valor : new Date(valor);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

export function construirUrlset(urls: UrlSitemap[]): string {
  const corpo = urls
    .map((u) => {
      const partes = [`    <loc>${escapar(u.loc)}</loc>`];
      const lastmod = dataISO(u.lastmod);
      if (lastmod) partes.push(`    <lastmod>${lastmod}</lastmod>`);
      if (u.changefreq) partes.push(`    <changefreq>${u.changefreq}</changefreq>`);
      if (u.priority !== undefined)
        partes.push(`    <priority>${u.priority.toFixed(1)}</priority>`);
      return `  <url>\n${partes.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${corpo}
</urlset>`;
}

export function construirIndice(
  sitemaps: Array<{ loc: string; lastmod?: string }>
): string {
  const corpo = sitemaps
    .map((s) => {
      const partes = [`    <loc>${escapar(s.loc)}</loc>`];
      const lastmod = dataISO(s.lastmod);
      if (lastmod) partes.push(`    <lastmod>${lastmod}</lastmod>`);
      return `  <sitemap>\n${partes.join("\n")}\n  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${corpo}
</sitemapindex>`;
}

export function respostaXml(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
