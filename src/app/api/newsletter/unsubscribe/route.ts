import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailSubscribers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyUnsubscribeToken } from "@/lib/security";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const token = req.nextUrl.searchParams.get("token");

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return new NextResponse(
      htmlPage("Link inválido", "O link de cancelamento é inválido ou expirou."),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  try {
    await db
      .update(emailSubscribers)
      .set({ status: "unsubscribed" })
      .where(eq(emailSubscribers.email, email));

    return new NextResponse(
      htmlPage("Inscrição cancelada", "Você foi removido da nossa lista. Sentiremos sua falta!"),
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return new NextResponse(
      htmlPage("Erro", "Ocorreu um erro. Tente novamente ou entre em contato."),
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
}

function htmlPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Anders Dev</title>
  <style>
    body { font-family: Arial, sans-serif; background: #0a1929; color: #edf2f7; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 48px; max-width: 420px; text-align: center; }
    h1 { color: #e63946; margin: 0 0 16px; }
    p { color: #8892a8; line-height: 1.6; }
    a { color: #e63946; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <p style="margin-top: 24px;"><a href="https://andersdev.com.br">Voltar ao site</a></p>
  </div>
</body>
</html>`;
}
