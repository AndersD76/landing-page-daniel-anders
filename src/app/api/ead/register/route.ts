import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eadUsers } from "@/lib/db/ead-schema";
import { rateLimit, getClientIp } from "@/lib/security";
import { hashPassword, createToken, setEadCookie } from "@/lib/ead/auth";
import { verifyCsrf } from "@/lib/ead/csrf";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const csrfError = verifyCsrf(req);
    if (csrfError) return csrfError;

    const ip = getClientIp(req);

    if (!rateLimit(`ead-register:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em 1 minuto." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { nome, email, senha, telefone, empresa } = body;

    if (!nome || typeof nome !== "string" || nome.trim().length < 2) {
      return NextResponse.json(
        { error: "Nome deve ter pelo menos 2 caracteres." },
        { status: 400 },
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "E-mail obrigatório." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Formato de e-mail inválido." },
        { status: 400 },
      );
    }

    if (!senha || typeof senha !== "string" || senha.length < 6) {
      return NextResponse.json(
        { error: "Senha deve ter pelo menos 6 caracteres." },
        { status: 400 },
      );
    }

    const existing = await db
      .select({ id: eadUsers.id })
      .from(eadUsers)
      .where(eq(eadUsers.email, email.trim().toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 409 },
      );
    }

    const senhaHash = await hashPassword(senha);

    const [user] = await db
      .insert(eadUsers)
      .values({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senhaHash,
        telefone: telefone?.trim() || null,
        empresa: empresa?.trim() || null,
      })
      .returning({
        id: eadUsers.id,
        nome: eadUsers.nome,
        email: eadUsers.email,
        telefone: eadUsers.telefone,
        empresa: eadUsers.empresa,
      });

    const token = createToken(user.id, user.email);
    const response = NextResponse.json({
      success: true,
      message: "Cadastro realizado com sucesso!",
      user,
    });

    setEadCookie(response, token);
    return response;
  } catch (err) {
    console.error("EAD register error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
