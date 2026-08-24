"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

interface LessonSummary {
  id: number;
  slug: string;
  titulo: string;
  duracao: string | null;
  ordem: number;
  completed: boolean;
}

interface Module {
  id: number;
  titulo: string;
  ordem: number;
  lessons: LessonSummary[];
}

interface CourseData {
  id: number;
  slug: string;
  titulo: string;
  modules: Module[];
  allCompleted: boolean;
  hasFinalExam: boolean;
}

interface LessonDetail {
  id: number;
  moduleId: number;
  slug: string;
  titulo: string;
  duracao: string | null;
  conteudo: string | null;
  entregavelTitulo: string | null;
  entregavelUrl: string | null;
  ordem: number;
  completed: boolean;
}

export default function PlayerPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);
  const [lessonDetail, setLessonDetail] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [marking, setMarking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");

  const allLessons = course
    ? course.modules
        .sort((a, b) => a.ordem - b.ordem)
        .flatMap((m) => m.lessons.sort((a, b) => a.ordem - b.ordem))
    : [];

  const currentIndex = currentLessonId
    ? allLessons.findIndex((l) => l.id === currentLessonId)
    : -1;

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const fetchLesson = useCallback(
    async (lessonId: number) => {
      setLoadingLesson(true);
      try {
        const res = await fetch(`/api/ead/lesson/${lessonId}`);

        if (res.status === 401) {
          localStorage.removeItem("ead_user");
          router.push("/cursos/registro");
          return;
        }

        if (res.status === 403) {
          router.push(`/cursos/${slug}`);
          return;
        }

        if (!res.ok) return;

        const data = await res.json();
        setLessonDetail({ ...data.lesson, completed: data.completed });

        // Update completion status in the course sidebar
        setCourse((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            modules: prev.modules.map((m) => ({
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId ? { ...l, completed: data.completed } : l,
              ),
            })),
          };
        });
      } catch {
        /* ignore */
      } finally {
        setLoadingLesson(false);
      }
    },
    [router, slug],
  );

  const fetchCourse = useCallback(async () => {
    try {
      const res = await fetch(`/api/ead/courses/${slug}`);

      if (!res.ok) {
        setError("Erro ao carregar o curso.");
        return;
      }

      const data = await res.json();
      const modules: Module[] = (data.modules || []).map(
        (mod: {
          id: number;
          titulo: string;
          ordem: number;
          lessons: {
            id: number;
            slug: string;
            titulo: string;
            duracao: string | null;
            ordem: number;
          }[];
        }) => ({
          id: mod.id,
          titulo: mod.titulo,
          ordem: mod.ordem ?? 0,
          lessons: (mod.lessons || []).map(
            (l: {
              id: number;
              slug: string;
              titulo: string;
              duracao: string | null;
              ordem: number;
            }) => ({
              id: l.id,
              slug: l.slug,
              titulo: l.titulo,
              duracao: l.duracao,
              ordem: l.ordem ?? 0,
              completed: false,
            }),
          ),
        }),
      );

      const courseData: CourseData = {
        id: data.course.id,
        slug: data.course.slug,
        titulo: data.course.titulo,
        modules,
        allCompleted: false,
        hasFinalExam: false,
      };

      setCourse(courseData);

      // Select initial lesson: first one
      const all = modules
        .sort((a, b) => a.ordem - b.ordem)
        .flatMap((m) => m.lessons.sort((a, b) => a.ordem - b.ordem));

      if (all.length > 0 && !currentLessonId) {
        setCurrentLessonId(all[0].id);
      }
    } catch {
      setError("Erro de conexao.");
    } finally {
      setLoading(false);
    }
  }, [slug, currentLessonId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // Fetch lesson detail whenever currentLessonId changes
  useEffect(() => {
    if (currentLessonId) {
      fetchLesson(currentLessonId);
    }
  }, [currentLessonId, fetchLesson]);

  // Check if quiz exists for this course (to show "Fazer Prova Final" button)
  useEffect(() => {
    if (!course) return;

    async function checkQuiz() {
      try {
        const res = await fetch(`/api/ead/quiz/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.questions && data.questions.length > 0) {
            setCourse((prev) =>
              prev ? { ...prev, hasFinalExam: true } : prev,
            );
          }
        }
      } catch {
        /* quiz not available */
      }
    }

    checkQuiz();
  }, [course?.id, slug]);

  async function markComplete() {
    if (!lessonDetail || lessonDetail.completed) return;
    setMarking(true);

    try {
      const res = await fetch(
        `/api/ead/lesson/${lessonDetail.id}/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (res.ok) {
        // Update lesson detail
        setLessonDetail({ ...lessonDetail, completed: true });

        // Update sidebar
        setCourse((prev) => {
          if (!prev) return prev;
          const updated = {
            ...prev,
            modules: prev.modules.map((m) => ({
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonDetail.id ? { ...l, completed: true } : l,
              ),
            })),
          };

          // Check if all completed
          const allDone = updated.modules
            .flatMap((m) => m.lessons)
            .every((l) => l.completed);
          if (allDone) {
            updated.allCompleted = true;
          }

          return updated;
        });
      }
    } catch {
      /* ignore */
    } finally {
      setMarking(false);
    }
  }

  function selectLesson(lesson: LessonSummary) {
    setCurrentLessonId(lesson.id);
    setSidebarOpen(false);
  }

  const completedCount = allLessons.filter((l) => l.completed).length;
  const progressPercent =
    allLessons.length > 0 ? (completedCount / allLessons.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-black flex items-center justify-center">
        <div className="text-gray">Carregando...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-surface-black flex items-center justify-center">
        <div className="glass-card text-center max-w-md">
          <p className="text-brand mb-4">{error || "Curso nao encontrado."}</p>
          <Link
            href="/cursos"
            className="text-sm font-bold text-brand hover:text-brand-bright transition-colors"
          >
            Voltar para cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-black flex flex-col">
      {/* TOP BAR */}
      <header className="border-b border-white/[0.04] bg-surface-black/90 backdrop-blur-md sticky top-0 z-nav">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray hover:text-foreground transition-colors cursor-pointer"
              aria-label="Menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-2 no-underline">
              <Image
                src="/logo.png"
                alt="Anders Dev"
                width={28}
                height={28}
                className="w-7 h-7"
                priority
              />
              <span className="font-heading text-sm font-bold text-foreground tracking-tight hidden sm:inline">
                anders<span className="text-brand">dev</span>
              </span>
            </Link>

            <span className="text-white/[0.08]">|</span>
            <span className="text-sm text-gray truncate max-w-[200px] sm:max-w-none">
              {course.titulo}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-mono text-gray">
                {Math.round(progressPercent)}%
              </span>
            </div>

            <Link
              href="/cursos/meus-cursos"
              className="text-xs text-gray hover:text-brand transition-colors no-underline"
            >
              Meus Cursos
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-80 bg-surface-dark border-r border-white/[0.04] overflow-y-auto transition-transform md:transition-none pt-16 md:pt-0`}
        >
          {/* Mobile close */}
          <div className="md:hidden flex justify-end p-3">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray hover:text-foreground transition-colors cursor-pointer"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="p-4">
            {course.modules
              .sort((a, b) => a.ordem - b.ordem)
              .map((mod, mi) => {
                const modCompleted = mod.lessons.every((l) => l.completed);

                return (
                  <div key={mod.id} className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-[0.55rem] font-bold shrink-0 ${
                          modCompleted
                            ? "bg-brand/20 border-brand/40 text-brand"
                            : "border-white/[0.12] text-gray-600"
                        }`}
                      >
                        {modCompleted ? (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          String(mi + 1).padStart(2, "0")
                        )}
                      </span>
                      <span className="text-xs font-bold text-gray tracking-[1px] uppercase truncate">
                        {mod.titulo}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5 ml-2.5 pl-4 border-l border-white/[0.06]">
                      {mod.lessons
                        .sort((a, b) => a.ordem - b.ordem)
                        .map((lesson) => {
                          const isActive = currentLessonId === lesson.id;

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => selectLesson(lesson)}
                              className={`text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2.5 cursor-pointer ${
                                isActive
                                  ? "bg-brand/10 text-brand"
                                  : "text-gray-400 hover:bg-white/[0.03] hover:text-foreground"
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  lesson.completed
                                    ? "bg-brand/20 border-brand/40"
                                    : "border-white/[0.12]"
                                }`}
                              >
                                {lesson.completed && (
                                  <svg
                                    width="8"
                                    height="8"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    className="text-brand"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </span>
                              <span className="truncate">{lesson.titulo}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {loadingLesson ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray">Carregando aula...</div>
            </div>
          ) : lessonDetail ? (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
              {/* Lesson title */}
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
                {lessonDetail.titulo}
              </h1>

              {/* Lesson content */}
              {lessonDetail.conteudo ? (
                <div
                  className="prose prose-invert max-w-none mb-12
                    [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4
                    [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3
                    [&_p]:text-gray-400 [&_p]:leading-relaxed [&_p]:mb-4
                    [&_ul]:text-gray-400 [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:list-disc
                    [&_ol]:text-gray-400 [&_ol]:mb-4 [&_ol]:pl-5 [&_ol]:list-decimal
                    [&_li]:mb-1.5 [&_li]:leading-relaxed
                    [&_code]:text-brand [&_code]:bg-brand/[0.08] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                    [&_pre]:bg-surface-dark [&_pre]:border [&_pre]:border-white/[0.08] [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:mb-4
                    [&_pre_code]:bg-transparent [&_pre_code]:p-0
                    [&_blockquote]:border-l-2 [&_blockquote]:border-brand/30 [&_blockquote]:pl-4 [&_blockquote]:text-gray [&_blockquote]:italic
                    [&_a]:text-brand [&_a]:hover:text-brand-bright [&_a]:transition-colors
                    [&_strong]:text-foreground
                    [&_table]:w-full [&_table]:border-collapse [&_table]:mb-4
                    [&_th]:text-left [&_th]:text-foreground [&_th]:font-bold [&_th]:py-2 [&_th]:px-3 [&_th]:border-b [&_th]:border-white/[0.08]
                    [&_td]:text-gray-400 [&_td]:py-2 [&_td]:px-3 [&_td]:border-b [&_td]:border-white/[0.04]"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(lessonDetail.conteudo),
                  }}
                />
              ) : (
                <div className="glass-card text-center py-12 mb-12">
                  <p className="text-gray">
                    O conteudo desta aula esta sendo preparado.
                  </p>
                </div>
              )}

              {/* Mark complete button */}
              {!lessonDetail.completed && (
                <div className="border-t border-white/[0.06] pt-6 mb-8">
                  <button
                    onClick={markComplete}
                    disabled={marking}
                    className="w-full sm:w-auto bg-brand text-white font-bold py-3 px-8 rounded-full text-sm hover:scale-[1.02] transition-transform shadow-brand-sm disabled:opacity-50 cursor-pointer"
                  >
                    {marking ? "Salvando..." : "Marcar como concluida"}
                  </button>
                </div>
              )}

              {lessonDetail.completed && (
                <div className="border-t border-white/[0.06] pt-6 mb-8">
                  <div className="flex items-center gap-2 text-sm text-brand">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Aula concluida
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
                {prevLesson ? (
                  <button
                    onClick={() => selectLesson(prevLesson)}
                    className="flex items-center gap-2 text-sm text-gray hover:text-brand transition-colors cursor-pointer"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Anterior
                  </button>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <button
                    onClick={() => selectLesson(nextLesson)}
                    className="flex items-center gap-2 text-sm text-brand font-bold hover:text-brand-bright transition-colors cursor-pointer"
                  >
                    Proxima aula
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ) : course.allCompleted ? (
                  course.hasFinalExam ? (
                    <Link
                      href={`/cursos/player/${slug}/prova`}
                      className="text-sm font-bold text-white bg-brand px-5 py-2.5 rounded-full no-underline hover:scale-105 transition-transform shadow-brand-sm"
                    >
                      Fazer Prova Final
                    </Link>
                  ) : (
                    <Link
                      href="/cursos/meus-cursos"
                      className="text-sm font-bold text-brand hover:text-brand-bright transition-colors no-underline"
                    >
                      Ver meus cursos
                    </Link>
                  )
                ) : (
                  <div />
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray">Selecione uma aula para comecar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
