"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EadNavbar } from "@/components/ead/EadNavbar";
import { PageFooter } from "@/components/layout/PageFooter";

interface EnrolledCourse {
  enrollmentId: number;
  enrolledAt: string;
  courseId: number;
  slug: string;
  titulo: string;
  subtitulo: string | null;
  imagem: string | null;
  cargaHoraria: string | null;
  totalLessons: number;
  completedLessons: number;
  progress: number;
}

export default function MeusCursosPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/ead/my-courses");

        if (res.status === 401) {
          localStorage.removeItem("ead_user");
          router.push("/cursos/registro");
          return;
        }

        if (!res.ok) {
          setError("Erro ao carregar seus cursos.");
          return;
        }

        const data = await res.json();
        setCourses(data.courses || []);
      } catch {
        setError("Erro de conexao. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [router]);

  return (
    <>
      <EadNavbar />

      <main className="min-h-screen py-12 md:py-20">
        <div className="container-main">
          <span className="section-label">MEU PAINEL</span>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-8 md:mb-12">
            Meus <span className="text-brand">Cursos</span>
          </h1>

          {loading ? (
            <div className="flex flex-col gap-4 max-w-3xl">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="glass-card animate-pulse"
                >
                  <div className="h-5 bg-white/[0.06] rounded w-2/3 mb-3" />
                  <div className="h-3 bg-white/[0.04] rounded w-1/2 mb-6" />
                  <div className="h-2 bg-white/[0.04] rounded-full w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="glass-card max-w-xl">
              <p className="text-brand">{error}</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="glass-card text-center py-16 max-w-xl mx-auto">
              <div className="text-4xl font-mono text-brand/30 mb-4">
                {"{ }"}
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                Nenhum curso matriculado
              </h2>
              <p className="text-gray leading-relaxed mb-6">
                Explore nosso catalogo e comece a aprender agora.
              </p>
              <Link
                href="/cursos"
                className="cta-btn inline-flex"
              >
                VER CURSOS
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-w-3xl">
              {courses.map((course) => {
                const isComplete = course.progress >= 100;

                return (
                  <div
                    key={course.enrollmentId}
                    className={`glass-card ${isComplete ? "border-brand/15" : ""}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                          {course.titulo}
                        </h3>
                        {course.subtitulo && (
                          <p className="text-sm text-gray">
                            {course.subtitulo}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Link
                          href={`/cursos/player/${course.slug}`}
                          className="text-sm font-bold text-white bg-brand px-4 py-2 rounded-full no-underline hover:scale-105 transition-transform shadow-brand-sm"
                        >
                          {isComplete
                            ? "Revisar"
                            : course.completedLessons > 0
                              ? "Continuar"
                              : "Comecar"}
                        </Link>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(course.progress, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-mono text-gray shrink-0">
                        {Math.round(course.progress)}%
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-600">
                        {course.completedLessons} de {course.totalLessons} aulas
                        concluidas
                      </span>
                      {isComplete && (
                        <span className="text-[0.6rem] font-bold tracking-[2px] text-brand bg-brand/10 px-2.5 py-0.5 rounded-full">
                          CONCLUIDO
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <PageFooter />
    </>
  );
}
