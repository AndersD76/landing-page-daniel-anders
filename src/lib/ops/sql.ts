/**
 * SQL cru para as tabelas operacionais (mapa de buscas, monitores, filas).
 *
 * Por que não Drizzle aqui: são ~25 tabelas de painel e ingestão, consultadas
 * com agregações que ficam mais legíveis em SQL. O lead e o tráfego legados
 * continuam no Drizzle (src/lib/db).
 *
 * Nunca lança na importação: sem DATABASE_URL, `temBanco()` é false e quem
 * chama decide o que fazer (o build local, por exemplo, segue sem banco).
 */

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

export function temBanco(): boolean {
  return !!process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost/dummy");
}

function cliente(): NeonQueryFunction<false, false> {
  if (!_sql) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não definida");
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

export type Linha = Record<string, unknown>;

export async function consultar<T extends Linha = Linha>(texto: string, params: unknown[] = []): Promise<T[]> {
  const r = await cliente().query(texto, params);
  return r as unknown as T[];
}

export async function executar(texto: string, params: unknown[] = []): Promise<void> {
  await cliente().query(texto, params);
}

/**
 * INSERT em lote com ON CONFLICT. `linhas` são objetos com as mesmas chaves
 * (nomes de coluna). Quebra em blocos para ficar longe do limite de parâmetros.
 */
export async function inserirEmLote(
  tabela: string,
  linhas: Linha[],
  conflito: string,
  bloco = 400
): Promise<number> {
  if (!linhas.length) return 0;
  const colunas = Object.keys(linhas[0]);
  let total = 0;
  for (let i = 0; i < linhas.length; i += bloco) {
    const parte = linhas.slice(i, i + bloco);
    const params: unknown[] = [];
    const valores = parte
      .map((l) => `(${colunas.map((c) => {
        const v = l[c];
        params.push(v !== null && typeof v === "object" && !(v instanceof Date) ? JSON.stringify(v) : v);
        return `$${params.length}`;
      }).join(",")})`)
      .join(",");
    await executar(
      `INSERT INTO "${tabela}" (${colunas.map((c) => `"${c}"`).join(",")}) VALUES ${valores} ${conflito}`,
      params
    );
    total += parte.length;
  }
  return total;
}

/** Registra execução de job (aparece no painel como saúde das integrações). */
export async function registrarExecucao(job: string, ok: boolean, detalhe?: string, linhas?: number) {
  if (!temBanco()) return;
  try {
    await executar(
      `INSERT INTO integracoes_execucoes (job, ok, detalhe, linhas) VALUES ($1, $2, $3, $4)`,
      [job, ok, detalhe?.slice(0, 4000) ?? null, linhas ?? null]
    );
  } catch {
    /* registrar falha de registro seria recursão */
  }
}

export async function anotar(tipo: string, titulo: string, detalhe?: string, referencia?: string) {
  if (!temBanco()) return;
  await executar(
    `INSERT INTO anotacoes (tipo, titulo, detalhe, referencia) VALUES ($1, $2, $3, $4) ON CONFLICT (referencia) DO NOTHING`,
    [tipo, titulo.slice(0, 300), detalhe ?? null, referencia ?? null]
  );
}
