import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eadUsers } from "@/lib/db/ead-schema";
import { rateLimit, getClientIp } from "@/lib/security";
import { verifyPassword, createToken, setEadCookie } from "@/lib/ead/auth";
import { verifyCsrf } from "@/lib/ead/csrf";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const csrfError = verifyCsrf(req);
    if (csrfError) return csrfError;

    const ip = getClientIp(req);

    if (!rateLimit(`ead-login:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em 1 minuto." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { email, senha } = body;

    if (!email || !senha) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 },
      );
    }

    const [user] = await db
      .select()
      .from(eadUsers)
      .where(eq(eadUsers.email, email.trim().toLowerCase()))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 },
      );
    }

    if (!user.ativo) {
      return NextResponse.json(
        { error: "Conta desativada. Entre em contato com o suporte." },
        { status: 403 },
      );
    }

    const senhaValida = await verifyPassword(senha, user.senhaHash);
    if (!senhaValida) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 },
      );
    }

    const token = createToken(user.id, user.email);
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        empresa: user.empresa,
      },
    });

    setEadCookie(response, token);
    return response;
  } catch (err) {
    console.error("EAD login error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
