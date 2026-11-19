/**
 * Inicialização do servidor (chamada por src/instrumentation.ts).
 *
 * 1. aplica migrações aditivas marcadas (cria as tabelas do painel sozinho);
 * 2. anota o deploy na linha do tempo;
 * 3. espelha conteúdo, gate, ondas, mapa de buscas e off-page no banco;
 * 4. avisa o IndexNow do que é novo.
 *
 * Nunca derruba o servidor: cada etapa registra falha e segue.
 */

import { aplicarMigracoes } from "./migracoes";
import { anotar, registrarExecucao, temBanco } from "./sql";
import {
  anunciarNovidades,
  sincronizarConteudo,
  sincronizarDistribuicao,
  sincronizarMapaBuscas,
  sincronizarOffPage,
} from "./registro";

let rodando = false;

async function etapa(nome: string, fn: () => Promise<unknown>) {
  try {
    const r = await fn();
    await registrarExecucao(`boot:${nome}`, true, typeof r === "number" || typeof r === "string" ? String(r) : undefined);
  } catch (e) {
    console.error(`[boot] ${nome}:`, e);
    await registrarExecucao(`boot:${nome}`, false, e instanceof Error ? e.message : String(e));
  }
}

export async function sincronizarNaInicializacao() {
  if (rodando || !temBanco()) return;
  rodando = true;
  try {
    await etapa("migracoes", async () => (await aplicarMigracoes()).join(", ") || "nada novo");
    const sha = process.env.RAILWAY_GIT_COMMIT_SHA || process.env.SOURCE_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA;
    if (sha) {
      await etapa("deploy", () =>
        anotar("deploy", `Deploy ${sha.slice(0, 7)}`, process.env.RAILWAY_GIT_COMMIT_MESSAGE?.slice(0, 500), `deploy:${sha}`)
      );
    }
    await etapa("conteudo", () => sincronizarConteudo());
    await etapa("mapa-buscas", () => sincronizarMapaBuscas());
    await etapa("off-page", () => sincronizarOffPage());
    await etapa("distribuicao", () => sincronizarDistribuicao());
    // Espera o novo deploy assumir o tráfego antes de chamar os buscadores.
    await new Promise((r) => setTimeout(r, 90_000));
    await etapa("indexnow", () => anunciarNovidades());
  } finally {
    rodando = false;
  }
}
