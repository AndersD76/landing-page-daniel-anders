/**
 * Avisa os buscadores que suportam IndexNow (Bing, Yandex, Seznam, Naver) sobre
 * as URLs indexáveis. O Google não participa do IndexNow — lá o caminho é o
 * sitemap no Search Console.
 *
 * As URLs vêm dos sitemaps publicados, não de uma lista à mão: se o quality
 * gate reprovou uma página, ela não está no sitemap e não é anunciada aqui.
 *
 * Rodar: npm run avisar:indexnow
 */

const HOST = "www.andersdev.com.br";
const KEY = "db16d61e067044d48b75f2edbbe3fd1a";
const BASE = `https://${HOST}`;

async function urlsDoSitemap(nome) {
  const res = await fetch(`${BASE}/${nome}`);
  if (!res.ok) throw new Error(`${nome}: HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const indice = await urlsDoSitemap("sitemap.xml");
const filhos = indice.map((u) => u.replace(`${BASE}/`, ""));
console.log(`Índice: ${filhos.length} sitemaps filhos`);

const urls = [];
for (const filho of filhos) {
  const lista = await urlsDoSitemap(filho);
  console.log(`  ${filho}: ${lista.length} URLs`);
  urls.push(...lista);
}

const unicas = [...new Set(urls)];
console.log(`\nTotal: ${unicas.length} URLs únicas`);

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${BASE}/${KEY}.txt`,
    urlList: unicas,
  }),
});

console.log(`\nIndexNow respondeu: HTTP ${res.status}`);
if (res.status === 200 || res.status === 202) {
  console.log("Aceito. Bing, Yandex, Seznam e Naver foram notificados.");
  console.log("Google não usa IndexNow — lá o caminho é o sitemap no Search Console.");
} else {
  console.log("Corpo:", (await res.text()).slice(0, 300));
  process.exitCode = 1;
}
