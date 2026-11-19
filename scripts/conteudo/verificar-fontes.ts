/**
 * Confere ao vivo toda URL de fonte externa do conteúdo e grava o resultado
 * em src/data/seo/fontes-verificadas.json (lido pelo portão de qualidade).
 * Página com fonte que não responde é reprovada.
 *
 *   npx tsx scripts/conteudo/verificar-fontes.ts            # só as novas
 *   npx tsx scripts/conteudo/verificar-fontes.ts --todas    # reconfere tudo
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { TIPOS_CONTEUDO } from "../../src/lib/conteudo/schema";

const CACHE = join(process.cwd(), "src/data/seo/fontes-verificadas.json");
const UA = "Mozilla/5.0 (verificacao-de-fontes; +https://www.andersdev.com.br/politica-editorial)";

async function testar(url: string): Promise<number> {
  for (const metodo of ["HEAD", "GET"] as const) {
    for (let t = 0; t < 2; t++) {
      try {
        const r = await fetch(url, { method: metodo, redirect: "follow", headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20_000) });
        if (r.status < 400) return r.status;
        if (metodo === "GET" && t === 1) return r.status;
      } catch {
        /* tenta de novo */
      }
    }
  }
  return 0;
}

async function main() {
  const cache: Record<string, { ok: boolean; status: number; em: string }> = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, "utf8")) : {};
  const urls = new Set<string>();
  for (const tipo of TIPOS_CONTEUDO) {
    const pasta = join(process.cwd(), "src/content", tipo);
    if (!existsSync(pasta)) continue;
    for (const f of readdirSync(pasta).filter((x) => x.endsWith(".json"))) {
      for (const p of JSON.parse(readFileSync(join(pasta, f), "utf8"))) {
        for (const fonte of p.fontes ?? []) if (!String(fonte.url).startsWith("/")) urls.add(fonte.url);
        if (p.norma?.urlOficial) urls.add(p.norma.urlOficial);
      }
    }
  }
  const todas = process.argv.includes("--todas");
  const fila = [...urls].filter((u) => todas || !cache[u]?.ok);
  console.log(`${urls.size} URLs de fonte; conferindo ${fila.length}`);
  let i = 0;
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (fila.length) {
        const u = fila.shift()!;
        const status = await testar(u);
        cache[u] = { ok: status > 0 && status < 400, status, em: new Date().toISOString().slice(0, 10) };
        if (++i % 50 === 0) console.log(`  ${i}…`);
      }
    })
  );
  const ordenado = Object.fromEntries(Object.entries(cache).filter(([u]) => urls.has(u)).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(CACHE, JSON.stringify(ordenado, null, 1) + "\n");
  const ruins = Object.entries(ordenado).filter(([, v]) => !v.ok);
  console.log(`${Object.keys(ordenado).length - ruins.length} ok, ${ruins.length} sem resposta`);
  for (const [u, v] of ruins) console.log(`  ✗ ${v.status} ${u}`);
}
main();
