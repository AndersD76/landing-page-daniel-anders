import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  eadLessons,
  eadModules,
  eadEnrollments,
  eadProgress,
} from "@/lib/db/ead-schema";
import { getEadUser } from "@/lib/ead/auth";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = getEadUser(req);
    if (!payload) {
      return NextResponse.json(
        { error: "Você precisa estar logado para acessar as aulas." },
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
      .select()
      .from(eadLessons)
      .where(eq(eadLessons.id, lessonId))
      .limit(1);

    if (!lesson) {
      return NextResponse.json(
        { error: "Aula não encontrada." },
        { status: 404 },
      );
    }

    // Buscar modulo para verificar o curso
    const [mod] = await db
      .select()
      .from(eadModules)
      .where(eq(eadModules.id, lesson.moduleId))
      .limit(1);

    if (!mod) {
      return NextResponse.json(
        { error: "Módulo não encontrado." },
        { status: 404 },
      );
    }

    // Verificar matrícula no curso
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

    // Verificar se já concluiu esta aula
    const [progress] = await db
      .select({ completed: eadProgress.completed })
      .from(eadProgress)
      .where(
        and(
          eq(eadProgress.userId, payload.userId),
          eq(eadProgress.lessonId, lessonId),
        ),
      )
      .limit(1);

    return NextResponse.json({
      lesson: {
        id: lesson.id,
        moduleId: lesson.moduleId,
        slug: lesson.slug,
        titulo: lesson.titulo,
        duracao: lesson.duracao,
        conteudo: lesson.conteudo,
        entregavelTitulo: lesson.entregavelTitulo,
        entregavelUrl: lesson.entregavelUrl,
        ordem: lesson.ordem,
      },
      completed: progress?.completed ?? false,
    });
  } catch (err) {
    console.error("EAD lesson error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
