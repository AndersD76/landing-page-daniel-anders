import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailSubscribers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyUnsubscribeToken } from "@/lib/security";
import { executar, temBanco } from "@/lib/ops/sql";

/**
 * Descadastro em 1 clique.
 *
 * GET  — o link no rodapé de todo e-mail: descadastra na hora, sem tela de
 *        confirmação nem login.
 * POST — o cabeçalho List-Unsubscribe-Post (RFC 8058) que Gmail e Outlook
 *        usam no botão "cancelar inscrição" deles.
 *
 * Descadastrar encerra TODAS as sequências e o opt-in de marketing do lead.
 */
async function descadastrar(email: string) {
  await db.update(emailSubscribers).set({ status: "unsubscribed" }).where(eq(emailSubscribers.email, email));
  if (temBanco()) {
    await executar(`UPDATE sequencias_inscricoes SET status = 'cancelada' WHERE email = $1 AND status = 'ativa'`, [email]).catch(() => {});
    await executar(`UPDATE leads SET optin_marketing = false WHERE email = $1`, [email]).catch(() => {});
    await executar(
      `INSERT INTO eventos (nome, path, origem_registro) VALUES ('descadastro_concluido', '/api/newsletter/unsubscribe', 'servidor')`
    ).catch(() => {});
  }
}

function credenciais(req: NextRequest) {
  return {
    email: req.nextUrl.searchParams.get("email"),
    token: req.nextUrl.searchParams.get("token"),
  };
}

export async function GET(req: NextRequest) {
  const { email, token } = credenciais(req);
  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return new NextResponse(htmlPage("Link inválido", "O link de cancelamento é inválido ou expirou."), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
  try {
    await descadastrar(email);
    return new NextResponse(
      htmlPage("Inscrição cancelada", "Pronto: você não vai mais receber e-mails da AndersDev. Nenhuma outra ação é necessária."),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return new NextResponse(htmlPage("Erro", "Ocorreu um erro. Responda qualquer e-mail nosso pedindo o descadastro."), {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}

export async function POST(req: NextRequest) {
  const { email, token } = credenciais(req);
  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  try {
    await descadastrar(email);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

function htmlPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>${title} — AndersDev</title>
  <style>
    body { font-family: Arial, sans-serif; background: #0a1929; color: #edf2f7; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 48px; max-width: 420px; text-align: center; }
    h1 { color: #e63946; margin: 0 0 16px; }
    p { color: #a0aec0; line-height: 1.6; }
    a { color: #e63946; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <p style="margin-top: 24px;"><a href="https://www.andersdev.com.br">Voltar ao site</a></p>
  </div>
</body>
</html>`;
}
