/**
 * Validação de SEO sobre o HTML REALMENTE gerado pelo build.
 *
 * Não valida o modelo de dados — isso é o `npm run gate`. Aqui a pergunta é
 * outra: o que foi para o disco tem título único, description única, um H1,
 * canonical, JSON-LD válido e carimbo de fonte?
 *
 * Rodar depois de `npm run build`:  npm run validar:seo
 */

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const RAIZ = ".next/server/app";
const ALVOS = [join(RAIZ, "quanto-custa"), join(RAIZ, "sistema-para")];
const HUBS = ["quanto-custa.html", "sistema-para.html"];

let falhas = 0;
let avisos = 0;

function falha(msg) {
  falhas++;
  console.log(`  FALHA  ${msg}`);
}
function aviso(msg) {
  avisos++;
  console.log(`  aviso  ${msg}`);
}

const ausentes = ALVOS.filter((a) => !existsSync(a));
if (ausentes.length) {
  console.error(
    `\nNão encontrado: ${ausentes.join(", ")}. Rode "npm run build" antes.\n`
  );
  process.exit(1);
}

/* ------------------------------------------------ coleta dos HTML gerados */

function listarHtml(dir) {
  const out = [];
  for (const entrada of readdirSync(dir)) {
    const caminho = join(dir, entrada);
    if (statSync(caminho).isDirectory()) out.push(...listarHtml(caminho));
    else if (entrada.endsWith(".html")) out.push(caminho);
  }
  return out;
}

const arquivos = ALVOS.flatMap(listarHtml);
for (const hub of HUBS) {
  const caminho = join(RAIZ, hub);
  if (existsSync(caminho)) arquivos.push(caminho);
}

console.log(`\nValidação de SEO — ${arquivos.length} páginas geradas`);
console.log("=".repeat(66));

function extrair(html, regex) {
  const m = html.match(regex);
  return m ? m[1].trim() : null;
}

function decodificar(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

const paginas = [];

for (const arquivo of arquivos) {
  const html = readFileSync(arquivo, "utf8");
  const rel = arquivo.replace(/\\/g, "/").replace(`${RAIZ}/`, "/").replace(/\.html$/, "");

  const title = extrair(html, /<title>([^<]*)<\/title>/);
  const desc = extrair(html, /<meta name="description" content="([^"]*)"/);
  const canonical = extrair(html, /<link rel="canonical" href="([^"]*)"/);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) =>
    decodificar(m[1].replace(/<[^>]+>/g, "").trim())
  );
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);

  const jsonlds = [...html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
  )].map((m) => m[1]);

  paginas.push({
    rel,
    title: title ? decodificar(title) : null,
    desc: desc ? decodificar(desc) : null,
    canonical,
    h1s,
    noindex,
    jsonlds,
    html,
  });
}

/* -------------------------------------------------------- checagens por página */

console.log("\nPor página");
console.log("-".repeat(66));

for (const p of paginas) {
  const erros = [];

  if (!p.title) erros.push("sem <title>");
  else if (p.title.length > 75) erros.push(`title com ${p.title.length} chars (>75)`);

  if (!p.desc) erros.push("sem meta description");
  else if (p.desc.length < 70 || p.desc.length > 185)
    erros.push(`description com ${p.desc.length} chars (fora de 70-185)`);

  if (!p.canonical) erros.push("sem canonical");
  if (p.h1s.length !== 1) erros.push(`${p.h1s.length} H1 (esperado 1)`);

  // JSON-LD precisa existir e ser parseável
  if (p.jsonlds.length === 0) erros.push("sem JSON-LD");
  const tipos = [];
  for (const bruto of p.jsonlds) {
    try {
      const obj = JSON.parse(bruto);
      tipos.push(obj["@type"]);
    } catch {
      erros.push("JSON-LD inválido (não faz parse)");
    }
  }
  if (!tipos.includes("BreadcrumbList")) erros.push("sem BreadcrumbList");

  // Páginas de entidade precisam de FAQPage e do carimbo de fonte
  const ehEntidade = !["/quanto-custa", "/sistema-para"].includes(p.rel);
  if (ehEntidade) {
    if (!tipos.includes("FAQPage")) erros.push("sem FAQPage");
    if (!/Fonte:.*atualizado em/.test(p.html))
      erros.push("sem carimbo de fonte");
    if (!/datetime="\d{4}-\d{2}-\d{2}"/i.test(p.html))
      erros.push("carimbo sem data legível por máquina");
  }

  // Nada de placeholder publicado. Só no texto visível: "todo" é palavra
  // comum em português e o HTML carrega scripts do framework.
  const visivel = p.html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ");
  for (const [rotulo, re] of [
    ["em breve", /em breve/i],
    ["lorem ipsum", /lorem ipsum/i],
    ["TODO", /TODO/],
    ["XXX", /XXX/],
    ["[REVISAR]", /\[REVISAR/i],
  ]) {
    if (re.test(visivel)) erros.push(`contém placeholder: "${rotulo}"`);
  }

  if (erros.length) {
    console.log(`  ${p.rel}`);
    for (const e of erros) falha(`   ${e}`);
  }
}

if (falhas === 0) console.log("  todas as páginas passaram nas checagens individuais");

/* ------------------------------------------------- achados do site inteiro */

console.log("\nJSON-LD do site (layout raiz)");
console.log("-".repeat(66));

const comRating = paginas.filter((p) => p.jsonlds.some((j) => j.includes("aggregateRating")));
if (comRating.length) {
  falha(
    `aggregateRating presente em ${comRating.length}/${paginas.length} páginas ` +
      `(vem do layout raiz, não destas páginas).`
  );
  console.log(
    "         Nota do Google: review e aggregateRating sobre o próprio negócio,\n" +
      "         no próprio site, não são elegíveis a rich result e podem gerar\n" +
      "         ação manual. Decisão do dono — ver src/app/layout.tsx."
  );
} else {
  console.log("  sem aggregateRating — ok");
}

/* ------------------------------------------------------------- unicidade */

console.log("\nUnicidade");
console.log("-".repeat(66));

for (const [campo, get] of [
  ["title", (p) => p.title],
  ["description", (p) => p.desc],
  ["H1", (p) => p.h1s[0]],
  ["canonical", (p) => p.canonical],
]) {
  const mapa = new Map();
  for (const p of paginas) {
    const v = (get(p) || "").toLowerCase();
    if (!v) continue;
    mapa.set(v, [...(mapa.get(v) || []), p.rel]);
  }
  const dupes = [...mapa.entries()].filter(([, urls]) => urls.length > 1);
  if (dupes.length) {
    for (const [valor, urls] of dupes)
      falha(`${campo} repetido em ${urls.length} páginas: "${valor.slice(0, 55)}..." (${urls.join(", ")})`);
  } else {
    console.log(`  ${campo}: ${mapa.size} valores distintos em ${paginas.length} páginas — ok`);
  }
}

/* ---------------------------------------------- sitemap x noindex x gate */

console.log("\nSitemap");
console.log("-".repeat(66));

function lerSitemap(nome) {
  for (const candidato of [
    join(RAIZ, `${nome}.body`),
    join(RAIZ, nome),
  ]) {
    if (existsSync(candidato) && statSync(candidato).isFile()) {
      return readFileSync(candidato, "utf8");
    }
  }
  return null;
}

const indice = lerSitemap("sitemap.xml");
if (!indice) {
  falha("sitemap.xml não foi gerado");
} else {
  const filhos = [...indice.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  console.log(`  índice aponta para ${filhos.length} sitemaps filhos`);
  if (filhos.length < 5) falha("índice com menos de 5 filhos");

  // Os dois sitemaps de conteúdo gerado.
  const urlsSitemap = ["sitemap-custos.xml", "sitemap-setores.xml"].flatMap(
    (nome) => {
      const xml = lerSitemap(nome);
      if (!xml) {
        falha(`${nome} não foi gerado`);
        return [];
      }
      if (!/^<\?xml version="1\.0" encoding="UTF-8"\?>/.test(xml))
        falha(`${nome} sem declaração XML`);
      const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      console.log(`  ${nome}: ${urls.length} URLs`);
      return urls;
    }
  );

  {
    // Toda URL do sitemap precisa existir como HTML e NÃO ter noindex.
    for (const url of urlsSitemap) {
      const caminho = url.replace("https://www.andersdev.com.br", "");
      const p = paginas.find((x) => x.rel === caminho);
      if (!p) falha(`sitemap anuncia URL sem HTML gerado: ${url}`);
      else if (p.noindex) falha(`sitemap anuncia página com noindex: ${url}`);
    }

    // Toda página com noindex precisa estar FORA do sitemap.
    for (const p of paginas.filter((x) => x.noindex)) {
      const url = `https://www.andersdev.com.br${p.rel}`;
      if (urlsSitemap.includes(url))
        falha(`página noindex está no sitemap: ${url}`);
      else console.log(`  noindex fora do sitemap (correto): ${p.rel}`);
    }

  }
}

/* ----------------------------------------------------------------- saída */

console.log("\n" + "=".repeat(66));
if (avisos) console.log(`${avisos} aviso(s).`);
if (falhas > 0) {
  console.error(`${falhas} falha(s) de SEO no HTML gerado.\n`);
  process.exit(1);
}
console.log("HTML gerado passou em todas as checagens.\n");
