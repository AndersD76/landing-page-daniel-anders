import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  eadLessons,
  eadModules,
  eadEnrollments,
  eadProgress,
} from "@/lib/db/ead-schema";
import { getEadUser } from "@/lib/ead/auth";
import { verifyCsrf } from "@/lib/ead/csrf";
import { eq, and } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const csrfError = verifyCsrf(req);
    if (csrfError) return csrfError;

    const payload = getEadUser(req);
    if (!payload) {
      return NextResponse.json(
        { error: "Você precisa estar logado." },
        { status: 401 },
      );
    }

    const { id } = await params;
    const lessonId = parseInt(id, 10);

    if (isNaN(lessonId)) {
      return NextResponse.json(
        { error: "ID da aula inválido." },
        { status: 400 },
      );
    }

    const [lesson] = await db
      .select({ id: eadLessons.id, moduleId: eadLessons.moduleId })
      .from(eadLessons)
      .where(eq(eadLessons.id, lessonId))
      .limit(1);

    if (!lesson) {
      return NextResponse.json(
        { error: "Aula não encontrada." },
        { status: 404 },
      );
    }

    // Verificar modulo e curso
    const [mod] = await db
      .select({ courseId: eadModules.courseId })
      .from(eadModules)
      .where(eq(eadModules.id, lesson.moduleId))
      .limit(1);

    if (!mod) {
      return NextResponse.json(
        { error: "Módulo não encontrado." },
        { status: 404 },
      );
    }

    // Verificar matrícula
    const [enrollment] = await db
      .select({ id: eadEnrollments.id })
      .from(eadEnrollments)
      .where(
        and(
          eq(eadEnrollments.userId, payload.userId),
          eq(eadEnrollments.courseId, mod.courseId),
        ),
      )
      .limit(1);

    if (!enrollment) {
      return NextResponse.json(
        { error: "Você não está matriculado neste curso." },
        { status: 403 },
      );
    }

    // Verificar se já completou
    const [existing] = await db
      .select({ id: eadProgress.id })
      .from(eadProgress)
      .where(
        and(
          eq(eadProgress.userId, payload.userId),
          eq(eadProgress.lessonId, lessonId),
        ),
      )
      .limit(1);

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Aula já marcada como concluída.",
      });
    }

    await db.insert(eadProgress).values({
      userId: payload.userId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Aula concluída com sucesso!",
    });
  } catch (err) {
    console.error("EAD lesson complete error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
