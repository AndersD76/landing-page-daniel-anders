/**
 * Aplica um arquivo .sql no banco, via driver Neon (já é dependência).
 *
 * Existe porque o projeto não tem psql no ambiente e porque o `drizzle-kit
 * generate` só sabe gerar baseline aqui — as migrações incrementais vivem em
 * drizzle/manual/ e precisam de um jeito de rodar.
 *
 * A URL vem SEMPRE do ambiente. Nunca passe credencial por argumento: ela fica
 * no histórico do shell e na lista de processos.
 *
 * Rodar:  DATABASE_URL="postgres://..." node scripts/aplicar-migracao.mjs drizzle/manual/arquivo.sql
 */

import { readFileSync } from "node:fs";
import { Client } from "@neondatabase/serverless";

const arquivo = process.argv[2];
if (!arquivo) {
  console.error("Uso: node scripts/aplicar-migracao.mjs <caminho.sql>");
  process.exit(1);
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL não definida no ambiente.");
  process.exit(1);
}

const sql = readFileSync(arquivo, "utf8");

/** Esconde a senha ao imprimir — log não é lugar de credencial. */
function mascarar(u) {
  try {
    const p = new URL(u);
    return `${p.protocol}//${p.username}:***@${p.hostname}${p.pathname}`;
  } catch {
    return "(url inválida)";
  }
}

const client = new Client(url);

try {
  await client.connect();
  console.log(`Conectado: ${mascarar(url)}`);
  console.log(`Aplicando: ${arquivo}\n`);

  // O arquivo já traz BEGIN/COMMIT e blocos DO $$...$$ com ponto e vírgula
  // dentro. Enviar inteiro, sem fatiar, é o que preserva esses blocos.
  await client.query(sql);

  console.log("Migração aplicada com sucesso.");
} catch (err) {
  console.error("\nFalhou:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
