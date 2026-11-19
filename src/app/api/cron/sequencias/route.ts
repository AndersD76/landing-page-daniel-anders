import { NextRequest, NextResponse } from "next/server";
import { cronAutorizado } from "@/lib/ops/cron-auth";
import { consultar, executar, registrarExecucao } from "@/lib/ops/sql";
import { SEQUENCIAS } from "@/data/sequencias";
import { enviarEmailSequencia, SITE } from "@/lib/email-crescimento";
import { escapeHtml } from "@/lib/security";

/**
 * Envia o próximo e-mail de cada inscrição ativa cujo horário chegou.
 * Respeita descadastro (status do assinante) e manda no máximo 1 e-mail por
 * pessoa por execução. Roda a cada hora.
 */
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!cronAutorizado(req)) return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  const devidas = await consultar<{ id: number; email: string; nome: string | null; cluster: string; passo: number; created_at: string }>(
    `SELECT s.id, s.email, s.nome, s.cluster, s.passo, s.created_at FROM sequencias_inscricoes s
      LEFT JOIN email_subscribers e ON e.email = s.email
      WHERE s.status = 'ativa' AND s.proximo_envio_em <= now() AND coalesce(e.status::text, 'confirmed') <> 'unsubscribed'
      ORDER BY s.proximo_envio_em LIMIT 60`
  );
  let enviados = 0;
  for (const s of devidas) {
    const seq = SEQUENCIAS[s.cluster];
    const email = seq?.[s.passo];
    if (!email) {
      await executar(`UPDATE sequencias_inscricoes SET status = 'concluida' WHERE id = $1`, [s.id]);
      continue;
    }
    const nome = (s.nome ?? "").split(" ")[0] || "tudo bem";
    const cta = email.cta
      ? `<p><a href="${email.cta.href.startsWith("http") ? email.cta.href : SITE + email.cta.href}?utm_source=email&utm_medium=email&utm_campaign=${encodeURIComponent(s.cluster)}-sequencia&utm_content=passo-${s.passo + 1}" style="display:inline-block;padding:12px 22px;background:#e63946;color:#fff;font-weight:bold;text-decoration:none;border-radius:8px">${escapeHtml(email.cta.texto)}</a></p>`
      : "";
    const corpo = `<span style="display:none">${escapeHtml(email.previa)}</span><p>Olá, ${escapeHtml(nome)}!</p>${email.paragrafos
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("")}${cta}<p>— Daniel Anders</p>`;
    const ok = await enviarEmailSequencia({ para: s.email, assunto: email.assunto, corpoHtml: corpo });
    if (!ok) continue;
    enviados++;
    const proximo = seq[s.passo + 1];
    const base = new Date(s.created_at).getTime();
    await executar(
      `UPDATE sequencias_inscricoes SET passo = passo + 1, status = $1, proximo_envio_em = $2 WHERE id = $3`,
      [proximo ? "ativa" : "concluida", proximo ? new Date(Math.max(base + proximo.dia * 86400_000, Date.now() + 3600_000)) : null, s.id]
    );
  }
  await registrarExecucao("sequencias", true, `${enviados}/${devidas.length} enviados`, enviados);
  return NextResponse.json({ ok: true, devidas: devidas.length, enviados });
}
