import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eadCourses, eadEnrollments } from "@/lib/db/ead-schema";
import { getEadUser } from "@/lib/ead/auth";
import { verifyCsrf } from "@/lib/ead/csrf";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const csrfError = verifyCsrf(req);
    if (csrfError) return csrfError;

    const payload = getEadUser(req);
    if (!payload) {
      return NextResponse.json(
        { error: "Você precisa estar logado para se matricular." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { courseId } = body;

    if (!courseId || typeof courseId !== "number") {
      return NextResponse.json(
        { error: "ID do curso é obrigatório." },
        { status: 400 },
      );
    }

    const [course] = await db
      .select({ id: eadCourses.id, ativo: eadCourses.ativo })
      .from(eadCourses)
      .where(eq(eadCourses.id, courseId))
      .limit(1);

    if (!course || !course.ativo) {
      return NextResponse.json(
        { error: "Curso não encontrado." },
        { status: 404 },
      );
    }

    const existing = await db
      .select({ id: eadEnrollments.id })
      .from(eadEnrollments)
      .where(
        and(
          eq(eadEnrollments.userId, payload.userId),
          eq(eadEnrollments.courseId, courseId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Você já está matriculado neste curso." },
        { status: 409 },
      );
    }

    // Cursos gratuitos: matrícula direta, sem pagamento
    const [enrollment] = await db
      .insert(eadEnrollments)
      .values({
        userId: payload.userId,
        courseId,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Matrícula realizada com sucesso!",
      enrollment: {
        id: enrollment.id,
        courseId: enrollment.courseId,
        createdAt: enrollment.createdAt,
      },
    });
  } catch (err) {
    console.error("EAD enroll error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
