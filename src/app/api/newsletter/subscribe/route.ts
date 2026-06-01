import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { emailSubscribers } from "@/lib/db/schema";

const subscribeSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(1, "Nome é obrigatório").max(255).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { email, name } = parsed.data;

    await db
      .insert(emailSubscribers)
      .values({
        email,
        name: name || null,
        source: "newsletter",
        tags: ["newsletter"],
        status: "confirmed",
      })
      .onConflictDoNothing();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 },
    );
  }
}
