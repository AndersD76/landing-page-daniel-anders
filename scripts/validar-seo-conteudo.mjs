/**
 * Teste de SEO do conteúdo em escala, sobre o HTML gerado pelo build.
 * Roda dentro do `npm run build`: se uma página indexável quebrar, o build
 * (e portanto o deploy) falha.
 *
 * Por página: HTML gerado, <title> ≤ 60, description 70–160, canonical
 * absoluto e igual à URL, exatamente 1 H1, JSON-LD que faz parse,
 * BreadcrumbList, FAQPage só se o FAQ estiver visível, nenhum noindex,
 * 3+ links internos, sem placeholder.
 * Sitemaps do conteúdo: toda URL anunciada tem HTML e não tem noindex.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const RAIZ = ".next/server/app";
const BASE = "https://www.andersdev.com.br";
const PASTAS = ["guias", "perguntas", "modelos", "glossario", "leis", "comparar", "ferramentas", "temas", "dados", "sobre"];
const AVULSAS = ["guias.html", "perguntas.html", "modelos.html", "glossario.html", "leis.html", "comparar.html", "ferramentas.html", "politica-editorial.html", "sobre.html"];
const SITEMAPS = ["sitemap-guias.xml", "sitemap-perguntas.xml", "sitemap-modelos.xml", "sitemap-glossario.xml", "sitemap-leis.xml", "sitemap-comparativos.xml", "sitemap-ferramentas.xml"];

let falhas = 0;
const falha = (m) => {
  falhas++;
  console.log(`  FALHA  ${m}`);
};

if (!existsSync(RAIZ)) {
  console.error("Rode o build antes (.next/server/app não existe).");
  process.exit(1);
}

function listar(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((e) => {
    const c = join(dir, e);
    return statSync(c).isDirectory() ? listar(c) : c.endsWith(".html") ? [c] : [];
  });
}

const arquivos = [...PASTAS.flatMap((p) => listar(join(RAIZ, p))), ...AVULSAS.map((a) => join(RAIZ, a)).filter(existsSync)];
const dec = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const paginas = new Map();
for (const arq of arquivos) {
  const html = readFileSync(arq, "utf8");
  const rel = arq.replace(/\\/g, "/").replace(`${RAIZ}/`, "/").replace(/\.html$/, "");
  // 404 pré-renderizado (onda futura) não é página indexável.
  if (html.includes("NEXT_HTTP_ERROR_FALLBACK;404")) continue;
  paginas.set(rel, html);
}

console.log(`\nSEO do conteúdo em escala — ${paginas.size} páginas geradas`);
console.log("=".repeat(66));

const titulos = new Map();
for (const [rel, html] of paginas) {
  const erros = [];
  const title = dec(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const desc = dec(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  const jsonlds = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const visivel = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ");
  const links = new Set([...html.matchAll(/<a [^>]*href="(\/[^"#?]*)/g)].map((m) => m[1]));

  if (!title) erros.push("sem <title>");
  else if (title.length > 60) erros.push(`title com ${title.length} caracteres (> 60)`);
  if (desc.length < 70 || desc.length > 160) erros.push(`description com ${desc.length} caracteres`);
  if (!canonical.startsWith(BASE)) erros.push(`canonical ausente ou relativo: "${canonical}"`);
  else if (canonical.replace(BASE, "") !== rel && !(rel.endsWith("/index") && canonical.replace(BASE, "") === rel.replace(/\/index$/, "")))
    erros.push(`canonical ${canonical} difere da URL ${rel}`);
  if (h1 !== 1) erros.push(`${h1} H1`);
  if (noindex) erros.push("noindex em página indexável");
  const tipos = [];
  for (const j of jsonlds) {
    try {
      const o = JSON.parse(j);
      tipos.push(...[].concat(o["@type"]));
    } catch {
      erros.push("JSON-LD não faz parse");
    }
  }
  if (!tipos.includes("BreadcrumbList") && !rel.startsWith("/sobre") && rel !== "/politica-editorial" && !rel.startsWith("/dados/metodologia"))
    erros.push("sem BreadcrumbList");
  if (tipos.includes("FAQPage") && !/Perguntas frequentes/.test(visivel)) erros.push("FAQPage sem FAQ visível");
  if (links.size < 3) erros.push(`só ${links.size} links internos`);
  for (const [r, re] of [["lorem ipsum", /lorem ipsum/i], ["TODO", /\bTODO\b/], ["[REVISAR]", /\[REVISAR/i], ["undefined", /\bundefined\b/]]) {
    if (re.test(visivel)) erros.push(`placeholder visível: ${r}`);
  }
  if (title) titulos.set(title, [...(titulos.get(title) ?? []), rel]);
  if (erros.length) {
    console.log(`  ${rel}`);
    erros.forEach((e) => falha(`   ${e}`));
  }
}

for (const [t, rels] of titulos) if (rels.length > 1) falha(`title repetido "${t}" em ${rels.join(", ")}`);

console.log("\nSitemaps do conteúdo");
console.log("-".repeat(66));
for (const nome of SITEMAPS) {
  const arq = [join(RAIZ, `${nome}.body`), join(RAIZ, nome)].find((c) => existsSync(c) && statSync(c).isFile());
  if (!arq) {
    falha(`${nome} não foi gerado`);
    continue;
  }
  const urls = [...readFileSync(arq, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  let semHtml = 0;
  for (const u of urls) {
    const rel = u.replace(BASE, "");
    if (!paginas.has(rel) && !paginas.has(`${rel}/index`)) {
      semHtml++;
      if (semHtml <= 5) falha(`${nome} anuncia URL sem HTML indexável: ${u}`);
    }
  }
  if (semHtml > 5) falha(`${nome}: mais ${semHtml - 5} URLs sem HTML`);
  console.log(`  ${nome}: ${urls.length} URLs`);
}

console.log("\n" + "=".repeat(66));
if (falhas) {
  console.error(`${falhas} falha(s) de SEO no conteúdo gerado.\n`);
  process.exit(1);
}
console.log("Conteúdo gerado passou em todas as checagens.\n");
