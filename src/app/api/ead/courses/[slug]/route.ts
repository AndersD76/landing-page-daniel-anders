import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  eadCourses,
  eadModules,
  eadLessons,
} from "@/lib/db/ead-schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const [course] = await db
      .select()
      .from(eadCourses)
      .where(eq(eadCourses.slug, slug))
      .limit(1);

    if (!course || !course.ativo) {
      return NextResponse.json(
        { error: "Curso não encontrado." },
        { status: 404 },
      );
    }

    const modules = await db
      .select()
      .from(eadModules)
      .where(eq(eadModules.courseId, course.id))
      .orderBy(eadModules.ordem);

    const moduleIds = modules.map((m) => m.id);
    let allLessons: {
      id: number;
      moduleId: number;
      slug: string;
      titulo: string;
      duracao: string | null;
      ordem: number | null;
    }[] = [];

    if (moduleIds.length > 0) {
      allLessons = await db
        .select({
          id: eadLessons.id,
          moduleId: eadLessons.moduleId,
          slug: eadLessons.slug,
          titulo: eadLessons.titulo,
          duracao: eadLessons.duracao,
          ordem: eadLessons.ordem,
        })
        .from(eadLessons)
        .where(
          moduleIds.length === 1
            ? eq(eadLessons.moduleId, moduleIds[0])
            : sql`${eadLessons.moduleId} IN (${sql.join(
                moduleIds.map((id) => sql`${id}`),
                sql`, `,
              )})`,
        )
        .orderBy(eadLessons.ordem);
    }

    const modulesWithLessons = modules.map((mod) => ({
      ...mod,
      lessons: allLessons.filter((l) => l.moduleId === mod.id),
    }));

    return NextResponse.json({
      course: {
        id: course.id,
        slug: course.slug,
        titulo: course.titulo,
        subtitulo: course.subtitulo,
        descricao: course.descricao,
        cargaHoraria: course.cargaHoraria,
        preco: course.preco,
        imagem: course.imagem,
        publico: course.publico,
        prerequisito: course.prerequisito,
        objetivo: course.objetivo,
      },
      modules: modulesWithLessons,
    });
  } catch (err) {
    console.error("EAD course detail error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
