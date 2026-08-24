import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  eadCourses,
  eadEnrollments,
  eadModules,
  eadLessons,
  eadProgress,
} from "@/lib/db/ead-schema";
import { getEadUser } from "@/lib/ead/auth";
import { eq, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const payload = getEadUser(req);
    if (!payload) {
      return NextResponse.json(
        { error: "Você precisa estar logado." },
        { status: 401 },
      );
    }

    const enrollments = await db
      .select({
        enrollmentId: eadEnrollments.id,
        enrolledAt: eadEnrollments.createdAt,
        courseId: eadCourses.id,
        slug: eadCourses.slug,
        titulo: eadCourses.titulo,
        subtitulo: eadCourses.subtitulo,
        imagem: eadCourses.imagem,
        cargaHoraria: eadCourses.cargaHoraria,
        totalLessons: sql<number>`(
          SELECT COUNT(*) FROM ead_lessons
          WHERE ead_lessons.module_id IN (
            SELECT id FROM ead_modules WHERE ead_modules.course_id = ${eadCourses.id}
          )
        )`.as("total_lessons"),
        completedLessons: sql<number>`(
          SELECT COUNT(*) FROM ead_progress
          WHERE ead_progress.user_id = ${payload.userId}
            AND ead_progress.completed = true
            AND ead_progress.lesson_id IN (
              SELECT id FROM ead_lessons
              WHERE ead_lessons.module_id IN (
                SELECT id FROM ead_modules WHERE ead_modules.course_id = ${eadCourses.id}
              )
            )
        )`.as("completed_lessons"),
      })
      .from(eadEnrollments)
      .innerJoin(eadCourses, eq(eadEnrollments.courseId, eadCourses.id))
      .where(eq(eadEnrollments.userId, payload.userId))
      .orderBy(eadEnrollments.createdAt);

    const courses = enrollments.map((e) => {
      const total = Number(e.totalLessons) || 0;
      const completed = Number(e.completedLessons) || 0;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        enrollmentId: e.enrollmentId,
        enrolledAt: e.enrolledAt,
        courseId: e.courseId,
        slug: e.slug,
        titulo: e.titulo,
        subtitulo: e.subtitulo,
        imagem: e.imagem,
        cargaHoraria: e.cargaHoraria,
        totalLessons: total,
        completedLessons: completed,
        progress,
      };
    });

    return NextResponse.json({ courses });
  } catch (err) {
    console.error("EAD my-courses error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
