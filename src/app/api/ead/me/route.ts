import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eadUsers } from "@/lib/db/ead-schema";
import { getEadUser } from "@/lib/ead/auth";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const payload = getEadUser(req);
    if (!payload) {
      return NextResponse.json(
        { error: "Não autenticado." },
        { status: 401 },
      );
    }

    const [user] = await db
      .select({
        id: eadUsers.id,
        nome: eadUsers.nome,
        email: eadUsers.email,
        telefone: eadUsers.telefone,
        empresa: eadUsers.empresa,
        createdAt: eadUsers.createdAt,
      })
      .from(eadUsers)
      .where(eq(eadUsers.id, payload.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("EAD me error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
