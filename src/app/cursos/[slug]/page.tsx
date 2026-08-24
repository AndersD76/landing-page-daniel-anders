import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EadNavbar } from "@/components/ead/EadNavbar";
import { EnrollButton } from "@/components/ead/EnrollButton";
import { PageFooter } from "@/components/layout/PageFooter";

interface Lesson {
  id: number;
  slug: string;
  titulo: string;
  duracao: string | null;
  ordem: number;
}

interface Module {
  id: number;
  titulo: string;
  descricao: string | null;
  ordem: number;
  lessons: Lesson[];
}

interface CourseDetail {
  id: number;
  slug: string;
  titulo: string;
  subtitulo: string | null;
  descricao: string | null;
  cargaHoraria: string | null;
  preco: string | null;
  publico: string | null;
  prerequisito: string | null;
  objetivo: string | null;
  modules: Module[];
}

async function getCourse(slug: string): Promise<CourseDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/ead/courses/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { ...data.course, modules: data.modules } as CourseDetail;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return {};

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0,
  );

  return {
    title: course.titulo,
    description:
      course.subtitulo ||
      `Curso gratuito: ${course.titulo}. ${totalLessons} aulas praticas com certificado.`,
    openGraph: {
      title: `${course.titulo} | AndersDev Cursos`,
      description:
        course.subtitulo ||
        `Curso gratuito com ${totalLessons} aulas e certificado.`,
      url: `https://www.andersdev.com.br/cursos/${slug}`,
    },
    alternates: {
      canonical: `https://www.andersdev.com.br/cursos/${slug}`,
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0,
  );

  const isFree = !course.preco || parseFloat(course.preco) === 0;

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.titulo,
    description: course.subtitulo || course.descricao,
    provider: {
      "@type": "Organization",
      name: "AndersDev",
      url: "https://www.andersdev.com.br",
    },
    isAccessibleForFree: isFree,
    offers: isFree
      ? { "@type": "Offer", price: "0", priceCurrency: "BRL" }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      <EadNavbar />

      <main className="min-h-screen">
        {/* BREADCRUMB */}
        <div className="container-main pt-6">
          <div className="flex items-center gap-2 text-sm text-gray">
            <Link
              href="/cursos"
              className="hover:text-brand transition-colors no-underline text-gray"
            >
              Cursos
            </Link>
            <span>/</span>
            <span className="text-foreground">{course.titulo}</span>
          </div>
        </div>

        {/* HERO */}
        <section className="py-12 md:py-20">
          <div className="container-main">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_380px] md:gap-12 items-start">
              {/* LEFT - Course info */}
              <div>
                {isFree && (
                  <div className="inline-block text-[0.6rem] font-bold tracking-[2px] text-brand bg-brand/10 px-3 py-1 rounded-full mb-4">
                    GRATUITO
                  </div>
                )}

                <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-4">
                  {course.titulo}
                </h1>

                {course.subtitulo && (
                  <p className="text-xl text-gray leading-relaxed mb-8">
                    {course.subtitulo}
                  </p>
                )}

                {course.descricao && (
                  <div className="text-gray-400 leading-relaxed mb-8 whitespace-pre-line">
                    {course.descricao}
                  </div>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-white/[0.06]">
                  {course.cargaHoraria && (
                    <div className="flex items-center gap-2">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-brand"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span className="text-sm text-foreground">
                        {course.cargaHoraria}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-brand"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    <span className="text-sm text-foreground">
                      {course.modules.length}{" "}
                      {course.modules.length === 1 ? "modulo" : "modulos"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-brand"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span className="text-sm text-foreground">
                      {totalLessons} {totalLessons === 1 ? "aula" : "aulas"}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-6">
                  {course.objetivo && (
                    <div>
                      <h2 className="font-heading text-lg font-bold text-foreground mb-2">
                        Objetivo
                      </h2>
                      <p className="text-gray-400 leading-relaxed">
                        {course.objetivo}
                      </p>
                    </div>
                  )}
                  {course.publico && (
                    <div>
                      <h2 className="font-heading text-lg font-bold text-foreground mb-2">
                        Publico-alvo
                      </h2>
                      <p className="text-gray-400 leading-relaxed">
                        {course.publico}
                      </p>
                    </div>
                  )}
                  {course.prerequisito && (
                    <div>
                      <h2 className="font-heading text-lg font-bold text-foreground mb-2">
                        Pre-requisito
                      </h2>
                      <p className="text-gray-400 leading-relaxed">
                        {course.prerequisito}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT - Sticky CTA card */}
              <div className="md:sticky md:top-24">
                <div className="glass-card border-brand/10">
                  <div className="text-center mb-6">
                    {isFree ? (
                      <div className="font-heading text-3xl font-bold text-brand">
                        Gratuito
                      </div>
                    ) : (
                      <div className="font-heading text-3xl font-bold text-foreground">
                        R$ {parseFloat(course.preco!).toFixed(2).replace(".", ",")}
                      </div>
                    )}
                  </div>

                  <EnrollButton
                    courseId={course.id}
                    courseSlug={course.slug}
                    isFree={isFree}
                    className="block w-full text-center text-sm font-bold text-white bg-brand px-6 py-4 rounded-full no-underline hover:scale-[1.02] transition-transform shadow-brand-sm mb-4 border-none"
                  >
                    {isFree ? "Comecar Curso" : "Comprar Curso"}
                  </EnrollButton>

                  <div className="flex flex-col gap-3 pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-brand/60 shrink-0"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Acesso vitalicio
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-brand/60 shrink-0"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Certificado de conclusao
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-brand/60 shrink-0"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Conteudo pratico
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MODULE LIST */}
        <section className="py-16 md:py-24 border-t border-white/[0.04]">
          <div className="container-main">
            <span className="section-label">CONTEUDO PROGRAMATICO</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8 md:mb-12">
              {course.modules.length}{" "}
              {course.modules.length === 1 ? "modulo" : "modulos"},{" "}
              {totalLessons} {totalLessons === 1 ? "aula" : "aulas"}
            </h2>

            <div className="flex flex-col gap-4 max-w-3xl">
              {course.modules
                .sort((a, b) => a.ordem - b.ordem)
                .map((mod, i) => (
                  <details
                    key={mod.id}
                    className="glass-card group cursor-pointer"
                    open={i === 0}
                  >
                    <summary className="font-heading font-bold text-foreground list-none flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-brand/40">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <span className="block">{mod.titulo}</span>
                          <span className="text-xs text-gray font-normal mt-1 block">
                            {mod.lessons.length}{" "}
                            {mod.lessons.length === 1 ? "aula" : "aulas"}
                          </span>
                        </div>
                      </div>
                      <span className="text-brand group-open:rotate-45 transition-transform text-xl ml-4 shrink-0">
                        +
                      </span>
                    </summary>

                    <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-2">
                      {mod.descricao && (
                        <p className="text-sm text-gray-500 mb-2">
                          {mod.descricao}
                        </p>
                      )}
                      {mod.lessons
                        .sort((a, b) => a.ordem - b.ordem)
                        .map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-brand/40 shrink-0"
                              >
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg>
                              <span className="text-sm text-gray-400">
                                {lesson.titulo}
                              </span>
                            </div>
                            {lesson.duracao && (
                              <span className="text-xs text-gray-600 shrink-0 ml-4">
                                {lesson.duracao}
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </details>
                ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 md:py-24 border-t border-white/[0.04]">
          <div className="container-main text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Pronto para <span className="text-brand">comecar?</span>
            </h2>
            <p className="text-gray text-lg mb-8 max-w-xl mx-auto">
              Crie sua conta gratuita e comece a estudar agora mesmo.
            </p>
            <EnrollButton
              courseId={course.id}
              courseSlug={course.slug}
              isFree={isFree}
              className="cta-btn inline-flex border-none cursor-pointer"
            >
              {isFree ? "COMECAR AGORA" : "COMPRAR AGORA"}
            </EnrollButton>
          </div>
        </section>
      </main>

      <PageFooter />
    </>
  );
}
