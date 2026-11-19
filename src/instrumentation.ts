/**
 * Ganchos de inicialização do Next.js. A sincronização roda em segundo plano
 * (não segura o servidor) e só no runtime Node em produção.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NODE_ENV !== "production" || process.env.NEXT_PHASE === "phase-production-build") return;
  if (!process.env.DATABASE_URL) return;
  const { sincronizarNaInicializacao } = await import("./lib/ops/boot");
  setTimeout(() => {
    void sincronizarNaInicializacao();
  }, 5_000);
}
