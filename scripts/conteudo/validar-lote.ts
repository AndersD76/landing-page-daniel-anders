/**
 * Valida um arquivo de conteúdo ANTES de ele entrar no conjunto.
 *
 *   npx tsx scripts/conteudo/validar-lote.ts src/content/glossario/lote-01.json
 *   npx tsx scripts/conteudo/validar-lote.ts src/content/glossario/lote-01.json --sem-rede
 *
 * Roda o formato (schema), o portão individual, a checagem das fontes ao vivo
 * (HEAD/GET em cada URL externa) e a similaridade contra todo o conteúdo já
 * existente em src/content. Sai com código 1 se alguma página reprovar.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { paginaConteudoSchema, TIPOS_CONTEUDO, urlDe, type PaginaConteudo } from "../../src/lib/conteudo/schema";
import { avaliarPagina, textoCorrido, LIMITES } from "../../src/lib/conteudo/gate";
import { cosseno, vetoresTfIdf } from "../../src/lib/conteudo/texto";

const arquivo = process.argv[2];
const semRede = process.argv.includes("--sem-rede");
if (!arquivo) {
  console.error("Uso: npx tsx scripts/conteudo/validar-lote.ts <arquivo.json> [--sem-rede]");
  process.exit(2);
}

export async function urlResponde(url: string): Promise<{ ok: boolean; status: number }> {
  const tentar = async (metodo: "HEAD" | "GET") => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    try {
      const r = await fetch(url, {
        method: metodo,
        redirect: "follow",
        signal: ctrl.signal,
        headers: { "User-Agent": "Mozilla/5.0 (verificacao-de-fontes; +https://www.andersdev.com.br/politica-editorial)" },
      });
      return r.status;
    } finally {
      clearTimeout(t);
    }
  };
  try {
    let s = await tentar("HEAD");
    if (s >= 400) s = await tentar("GET");
    return { ok: s < 400, status: s };
  } catch {
    try {
      const s = await tentar("GET");
      return { ok: s < 400, status: s };
    } catch {
      return { ok: false, status: 0 };
    }
  }
}

function lerTodoConteudo(excluir: string): PaginaConteudo[] {
  const out: PaginaConteudo[] = [];
  for (const tipo of TIPOS_CONTEUDO) {
    const pasta = join(process.cwd(), "src/content", tipo);
    if (!existsSync(pasta)) continue;
    for (const nome of readdirSync(pasta).filter((f) => f.endsWith(".json"))) {
      const caminho = join(pasta, nome);
      if (caminho.replace(/\\/g, "/").endsWith(excluir.replace(/\\/g, "/"))) continue;
      try {
        const lista = JSON.parse(readFileSync(caminho, "utf8"));
        for (const b of lista) {
          const r = paginaConteudoSchema.safeParse(b);
          if (r.success) out.push(r.data);
        }
      } catch {
        /* arquivo de outro lote em edição — ignora */
      }
    }
  }
  return out;
}

async function main() {
  let lista: unknown[];
  try {
    lista = JSON.parse(readFileSync(arquivo, "utf8"));
  } catch (e) {
    console.error(`JSON inválido em ${arquivo}: ${(e as Error).message}`);
    process.exit(1);
  }
  if (!Array.isArray(lista)) {
    console.error("O arquivo deve ser uma LISTA de páginas.");
    process.exit(1);
  }

  const paginas: PaginaConteudo[] = [];
  let falhas = 0;
  lista.forEach((b, i) => {
    const r = paginaConteudoSchema.safeParse(b);
    if (!r.success) {
      falhas++;
      console.log(`✗ [${i}] ${(b as { slug?: string })?.slug ?? "?"} — FORMATO: ${r.error.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ")}`);
    } else paginas.push(r.data);
  });

  // fontes ao vivo
  const urls = [...new Set(paginas.flatMap((p) => p.fontes.map((f) => f.url)).filter((u) => !u.startsWith("/")))];
  const status = new Map<string, { ok: boolean; status: number }>();
  if (!semRede) {
    await Promise.all(urls.map(async (u) => status.set(u, await urlResponde(u))));
  }

  const outros = lerTodoConteudo(arquivo);
  const todos = [...paginas, ...outros];
  const vetores = vetoresTfIdf(todos.map((p) => `${p.h1} ${p.consulta} ${textoCorrido(p)}`));
  const urlsOutros = new Set(outros.map((p) => urlDe(p)));

  paginas.forEach((p, i) => {
    const r = avaliarPagina(p);
    const checagens = r.checagens.filter((c) => c.id !== "fontes-respondem");
    if (!semRede) {
      const ruins = p.fontes.filter((f) => !f.url.startsWith("/") && !status.get(f.url)?.ok);
      checagens.push({
        id: "fontes-respondem",
        ok: ruins.length === 0,
        detalhe: ruins.map((f) => `${f.url} → ${status.get(f.url)?.status ?? "?"}`).join(", "),
      });
    }
    let max = 0;
    let par = "";
    todos.forEach((o, j) => {
      if (j === i) return;
      const s = cosseno(vetores[i], vetores[j]);
      if (s > max) {
        max = s;
        par = urlDe(o);
      }
    });
    checagens.push({ id: "similaridade", ok: max < LIMITES.similaridadeMax, detalhe: `${(max * 100).toFixed(0)}% com ${par}` });
    if (urlsOutros.has(urlDe(p))) checagens.push({ id: "url-unica", ok: false, detalhe: `${urlDe(p)} já existe em outro arquivo` });

    const ruins = checagens.filter((c) => !c.ok);
    if (ruins.length) {
      falhas++;
      console.log(`✗ ${p.slug} (${r.palavras} palavras)`);
      for (const c of ruins) console.log(`    - ${c.id}${c.detalhe ? `: ${c.detalhe}` : ""}`);
    } else {
      console.log(`✓ ${p.slug} (${r.palavras} palavras${p.dependeAutor ? ", RASCUNHO: depende do autor" : ""})`);
    }
  });

  console.log(`\n${paginas.length - (falhas - (lista.length - paginas.length))}/${lista.length} aprovadas em ${arquivo}`);
  process.exitCode = falhas ? 1 : 0;
}

main();
