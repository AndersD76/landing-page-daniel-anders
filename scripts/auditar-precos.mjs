/**
 * Audita preço escrito à mão no código.
 *
 * FALHA quando um preço aparece dentro de JSON-LD: ali ele é lido por máquina
 * e, divergindo do dado, o Google recebe uma contradição. Foi o que acontecia
 * com "Sites institucionais partem de R$ 2.500" no layout, enquanto a
 * calculadora respondia outra coisa na mesma página.
 *
 * AVISA nos demais lugares (texto de apoio em página de marketing), porque ali
 * o preço envelhece sem quebrar nada — mas envelhece.
 *
 * Rodar: npm run auditar:precos
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const RAIZ = "src";
const IGNORAR = ["src/data/blog.ts", "src/data/services.ts"];
const PRECO = /R\$\s?\d{1,3}(?:\.\d{3})+/g;

function listar(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...listar(p));
    else if (/\.(ts|tsx)$/.test(e)) out.push(p);
  }
  return out;
}

let falhas = 0;
const avisos = [];

console.log("\nAuditoria de preço escrito à mão");
console.log("=".repeat(66));

for (const arquivo of listar(RAIZ)) {
  const rel = arquivo.split("\\").join("/");
  if (IGNORAR.includes(rel)) continue;

  const linhas = readFileSync(arquivo, "utf8").split("\n");
  linhas.forEach((linha, i) => {
    if (linha.trimStart().startsWith("*") || linha.trimStart().startsWith("//")) return;
    const achados = linha.match(PRECO);
    if (!achados) return;

    // JSON-LD: o bloco de schema tem "@type" por perto ou está em schemaOrg.
    const contexto = linhas.slice(Math.max(0, i - 25), i + 3).join("\n");
    const ehSchema = /"@type"|schemaOrg|acceptedAnswer/.test(contexto);

    const item = `${rel}:${i + 1}  ${achados.join(", ")}`;
    if (ehSchema) {
      console.log(`  FALHA  ${item}  -> preço em JSON-LD precisa vir de faixaDoTipo()`);
      falhas++;
    } else {
      avisos.push(item);
    }
  });
}

if (!falhas) console.log("  nenhum preço escrito à mão dentro de JSON-LD — ok");

if (avisos.length) {
  console.log(`\n  ${avisos.length} preço(s) em texto de página, fora de JSON-LD:`);
  for (const a of avisos) console.log(`    aviso  ${a}`);
  console.log("\n  Não quebram nada hoje, mas envelhecem sozinhos quando a");
  console.log("  tabela de preços mudar. Candidatos a usar faixaDoTipo().");
}

console.log("\n" + "=".repeat(66));
if (falhas) {
  console.error(`${falhas} preço(s) divergível(is) em dado estruturado.\n`);
  process.exit(1);
}
console.log("Dado estruturado sem preço escrito à mão.\n");
