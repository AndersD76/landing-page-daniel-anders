import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import * as eadSchema from "./ead-schema";

export { eadSchema };

// Validação eager: falha rápido com mensagem clara assim que este módulo é
// carregado (startup/cold start), em vez de deixar o erro genérico do driver
// estourar só na primeira query.
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL não está definida. Configure a variável de ambiente " +
      "DATABASE_URL (connection string do NeonDB/Postgres) antes de iniciar a aplicação.",
  );
}

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = neon(url);
  return drizzle(sql, { schema: { ...schema, ...eadSchema } });
}

let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_, prop) {
    return (getDb() as any)[prop];
  },
});
