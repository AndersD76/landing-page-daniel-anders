import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eadCourses, eadModules, eadLessons } from "@/lib/db/ead-schema";
import { eq, count, sql } from "drizzle-orm";

export async function GET() {
  try {
    const courses = await db
      .select({
        id: eadCourses.id,
        slug: eadCourses.slug,
        titulo: eadCourses.titulo,
        subtitulo: eadCourses.subtitulo,
        descricao: eadCourses.descricao,
        cargaHoraria: eadCourses.cargaHoraria,
        imagem: eadCourses.imagem,
        publico: eadCourses.publico,
        prerequisito: eadCourses.prerequisito,
        objetivo: eadCourses.objetivo,
        preco: eadCourses.preco,
        ordem: eadCourses.ordem,
        moduleCount: sql<number>`(
          SELECT COUNT(*) FROM ead_modules
          WHERE ead_modules.course_id = ${eadCourses.id}
        )`.as("module_count"),
        lessonCount: sql<number>`(
          SELECT COUNT(*) FROM ead_lessons
          WHERE ead_lessons.module_id IN (
            SELECT id FROM ead_modules WHERE ead_modules.course_id = ${eadCourses.id}
          )
        )`.as("lesson_count"),
      })
      .from(eadCourses)
      .where(eq(eadCourses.ativo, true))
      .orderBy(eadCourses.ordem);

    return NextResponse.json(
      { courses },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (err) {
    console.error("EAD courses list error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
