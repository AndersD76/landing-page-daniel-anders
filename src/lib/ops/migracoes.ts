/**
 * Aplica as migrações marcadas com `-- aplicar-no-boot` em drizzle/manual/.
 *
 * Só arquivos aditivos e idempotentes recebem a marca. As migrações antigas
 * (setembro e outubro) foram aplicadas à mão e não têm a marca: este runner
 * não as toca.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { consultar, executar } from "./sql";

const DIR = join(process.cwd(), "drizzle/manual");

/** Separa comandos por ";" no fim da linha, respeitando blocos $$ ... $$. */
export function separarComandos(sql: string): string[] {
  const semComentario = sql
    .split("\n")
    .filter((l) => !l.trim().startsWith("--"))
    .join("\n");
  const comandos: string[] = [];
  let atual = "";
  let dentroDolar = false;
  for (const linha of semComentario.split("\n")) {
    const ocorrencias = (linha.match(/\$\$/g) ?? []).length;
    if (ocorrencias % 2 === 1) dentroDolar = !dentroDolar;
    atual += linha + "\n";
    if (!dentroDolar && /;\s*$/.test(linha)) {
      const c = atual.trim().replace(/;\s*$/, "");
      if (c && !/^(BEGIN|COMMIT)$/i.test(c)) comandos.push(c);
      atual = "";
    }
  }
  if (atual.trim()) comandos.push(atual.trim());
  return comandos;
}

export async function aplicarMigracoes(): Promise<string[]> {
  if (!existsSync(DIR)) return [];
  const arquivos = readdirSync(DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .filter((f) => readFileSync(join(DIR, f), "utf8").startsWith("-- aplicar-no-boot"));
  if (!arquivos.length) return [];

  await executar(`CREATE TABLE IF NOT EXISTS "_migracoes" ("arquivo" varchar(255) PRIMARY KEY, "aplicada_em" timestamp DEFAULT now() NOT NULL)`);
  const feitas = new Set(
    (await consultar<{ arquivo: string }>(`SELECT arquivo FROM _migracoes`)).map((r) => r.arquivo)
  );
  const aplicadas: string[] = [];
  for (const f of arquivos) {
    if (feitas.has(f)) continue;
    for (const comando of separarComandos(readFileSync(join(DIR, f), "utf8"))) {
      await executar(comando);
    }
    await executar(`INSERT INTO _migracoes (arquivo) VALUES ($1) ON CONFLICT DO NOTHING`, [f]);
    aplicadas.push(f);
  }
  return aplicadas;
}
