import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import {
  eadCourses,
  eadEnrollments,
  eadQuizQuestions,
  eadQuizAttempts,
  eadCertificates,
} from "@/lib/db/ead-schema";
import { getEadUser } from "@/lib/ead/auth";
import { verifyCsrf } from "@/lib/ead/csrf";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseSlug: string }> },
) {
  try {
    const payload = getEadUser(req);
    if (!payload) {
      return NextResponse.json(
        { error: "Você precisa estar logado para acessar a prova." },
        { status: 401 },
      );
    }

    const { courseSlug } = await params;

    const [course] = await db
      .select({ id: eadCourses.id, titulo: eadCourses.titulo })
      .from(eadCourses)
      .where(eq(eadCourses.slug, courseSlug))
      .limit(1);

    if (!course) {
      return NextResponse.json(
        { error: "Curso não encontrado." },
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
          eq(eadEnrollments.courseId, course.id),
        ),
      )
      .limit(1);

    if (!enrollment) {
      return NextResponse.json(
        { error: "Você não está matriculado neste curso." },
        { status: 403 },
      );
    }

    const questions = await db
      .select({
        id: eadQuizQuestions.id,
        pergunta: eadQuizQuestions.pergunta,
        alternativas: eadQuizQuestions.alternativas,
      })
      .from(eadQuizQuestions)
      .where(
        and(
          eq(eadQuizQuestions.courseId, course.id),
          eq(eadQuizQuestions.isFinal, true),
        ),
      );

    return NextResponse.json({
      courseId: course.id,
      titulo: course.titulo,
      questions,
    });
  } catch (err) {
    console.error("EAD quiz GET error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseSlug: string }> },
) {
  try {
    const csrfError = verifyCsrf(req);
    if (csrfError) return csrfError;

    const payload = getEadUser(req);
    if (!payload) {
      return NextResponse.json(
        { error: "Você precisa estar logado para enviar a prova." },
        { status: 401 },
      );
    }

    const { courseSlug } = await params;

    const [course] = await db
      .select({ id: eadCourses.id, titulo: eadCourses.titulo })
      .from(eadCourses)
      .where(eq(eadCourses.slug, courseSlug))
      .limit(1);

    if (!course) {
      return NextResponse.json(
        { error: "Curso não encontrado." },
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
          eq(eadEnrollments.courseId, course.id),
        ),
      )
      .limit(1);

    if (!enrollment) {
      return NextResponse.json(
        { error: "Você não está matriculado neste curso." },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { answers } = body;

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Respostas são obrigatórias." },
        { status: 400 },
      );
    }

    // Buscar perguntas com gabarito
    const questions = await db
      .select()
      .from(eadQuizQuestions)
      .where(
        and(
          eq(eadQuizQuestions.courseId, course.id),
          eq(eadQuizQuestions.isFinal, true),
        ),
      );

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma questão encontrada para este curso." },
        { status: 404 },
      );
    }

    // Calcular pontuação
    let correctCount = 0;
    const results: {
      questionId: number;
      correct: boolean;
      explicacao: string | null;
    }[] = [];

    for (const q of questions) {
      const selectedIndex = answers[String(q.id)];
      const isCorrect =
        typeof selectedIndex === "number" &&
        selectedIndex === q.respostaCorreta;

      if (isCorrect) correctCount++;

      results.push({
        questionId: q.id,
        correct: isCorrect,
        explicacao: q.explicacao,
      });
    }

    const totalQuestions = questions.length;
    const score = (correctCount / totalQuestions) * 100;
    const passed = score >= 70;

    // Salvar tentativa
    await db.insert(eadQuizAttempts).values({
      userId: payload.userId,
      courseId: course.id,
      isFinal: true,
      score: score.toFixed(2),
      totalQuestions,
      correctAnswers: correctCount,
      passed,
    });

    // Se aprovado, verificar se já tem certificado
    let certificate = null;
    if (passed) {
      const [existingCert] = await db
        .select()
        .from(eadCertificates)
        .where(
          and(
            eq(eadCertificates.userId, payload.userId),
            eq(eadCertificates.courseId, course.id),
          ),
        )
        .limit(1);

      if (!existingCert) {
        const code = `CERT-${randomUUID().slice(0, 8).toUpperCase()}`;

        const [newCert] = await db
          .insert(eadCertificates)
          .values({
            userId: payload.userId,
            courseId: course.id,
            code,
          })
          .returning();

        certificate = {
          code: newCert.code,
          createdAt: newCert.createdAt,
        };
      } else {
        certificate = {
          code: existingCert.code,
          createdAt: existingCert.createdAt,
        };
      }
    }

    return NextResponse.json({
      score: Math.round(score),
      totalQuestions,
      correctAnswers: correctCount,
      passed,
      results,
      certificate,
      message: passed
        ? "Parabéns! Você foi aprovado!"
        : "Você não atingiu a nota mínima de 70%. Tente novamente!",
    });
  } catch (err) {
    console.error("EAD quiz POST error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
