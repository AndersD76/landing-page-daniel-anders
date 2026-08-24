import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  eadCertificates,
  eadCourses,
  eadUsers,
} from "@/lib/db/ead-schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;

    const [cert] = await db
      .select({
        id: eadCertificates.id,
        code: eadCertificates.code,
        createdAt: eadCertificates.createdAt,
        userId: eadCertificates.userId,
        courseId: eadCertificates.courseId,
      })
      .from(eadCertificates)
      .where(eq(eadCertificates.code, code))
      .limit(1);

    if (!cert) {
      return NextResponse.json(
        { error: "Certificado não encontrado." },
        { status: 404 },
      );
    }

    const [student] = await db
      .select({ nome: eadUsers.nome })
      .from(eadUsers)
      .where(eq(eadUsers.id, cert.userId))
      .limit(1);

    const [course] = await db
      .select({
        titulo: eadCourses.titulo,
        cargaHoraria: eadCourses.cargaHoraria,
      })
      .from(eadCourses)
      .where(eq(eadCourses.id, cert.courseId))
      .limit(1);

    return NextResponse.json({
      valid: true,
      certificate: {
        code: cert.code,
        studentName: student?.nome ?? "Aluno",
        courseTitle: course?.titulo ?? "Curso",
        cargaHoraria: course?.cargaHoraria ?? null,
        issuedAt: cert.createdAt,
      },
    });
  } catch (err) {
    console.error("EAD certificate error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
