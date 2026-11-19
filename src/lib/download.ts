import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Link de download de modelo: assinado e com validade (30 dias). Quem recebeu
 * o e-mail baixa sem login; quem não deixou e-mail vê a prévia na página.
 */
function segredo(): string {
  return process.env.CRON_SECRET || process.env.ADMIN_PASSWORD || "chave-local";
}

export function assinarDownload(slug: string, expira: number): string {
  return createHmac("sha256", segredo()).update(`modelo:${slug}:${expira}`).digest("hex").slice(0, 32);
}

export function downloadValido(slug: string, expira: number, token: string): boolean {
  if (!Number.isFinite(expira) || expira < Date.now()) return false;
  const esperado = Buffer.from(assinarDownload(slug, expira));
  const recebido = Buffer.from(token || "");
  return esperado.length === recebido.length && timingSafeEqual(esperado, recebido);
}
