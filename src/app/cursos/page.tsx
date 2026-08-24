import { Metadata } from "next";
import { CourseCard } from "@/components/ead/CourseCard";
import { EadNavbar } from "@/components/ead/EadNavbar";
import { PageFooter } from "@/components/layout/PageFooter";

export const metadata: Metadata = {
  title: "Cursos Gratuitos de Desenvolvimento",
  description:
    "Cursos gratuitos de desenvolvimento web, apps e sistemas. Aprenda React, Next.js, TypeScript, Python e mais com quem constroi software de verdade.",
  openGraph: {
    title: "Cursos Gratuitos | AndersDev",
    description:
      "Aprenda desenvolvimento web com cursos gratuitos e certificado. React, Next.js, TypeScript, Python e mais.",
    url: "https://www.andersdev.com.br/cursos",
  },
  alternates: {
    canonical: "https://www.andersdev.com.br/cursos",
  },
};

interface CourseFromAPI {
  id: number;
  slug: string;
  titulo: string;
  subtitulo: string | null;
  cargaHoraria: string | null;
  preco: string | null;
  moduleCount: number;
  lessonCount: number;
}

async function getCourses(): Promise<CourseFromAPI[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/ead/courses`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.courses || [];
  } catch {
    return [];
  }
}

export default async function CursosPage() {
  const courses = await getCourses();

  return (
    <>
      <EadNavbar />

      <main className="min-h-screen">
        {/* HERO */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-brand/[0.04] to-transparent">
          <div className="container-main text-center">
            <span className="section-label">PLATAFORMA EAD</span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-6">
              Cursos{" "}
              <span className="text-brand">Gratuitos</span>
            </h1>
            <p className="text-xl text-gray max-w-2xl mx-auto leading-relaxed">
              Aprenda com quem constroi software de verdade. Cursos praticos,
              direto ao ponto, com certificado de conclusao.
            </p>
          </div>
        </section>

        {/* COURSE GRID */}
        <section className="py-16 md:py-24">
          <div className="container-main">
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    slug={course.slug}
                    titulo={course.titulo}
                    subtitulo={course.subtitulo}
                    cargaHoraria={course.cargaHoraria}
                    moduleCount={course.moduleCount}
                    lessonCount={course.lessonCount}
                    preco={course.preco}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card text-center py-16 max-w-xl mx-auto">
                <div className="text-4xl font-mono text-brand/30 mb-4">
                  {"</>"}
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                  Em breve
                </h2>
                <p className="text-gray leading-relaxed mb-6">
                  Estamos preparando os cursos. Cadastre-se para ser avisado
                  quando o primeiro curso estiver disponivel.
                </p>
                <a
                  href="/cursos/registro"
                  className="text-sm font-bold text-brand hover:text-brand-bright transition-colors"
                >
                  Criar conta gratuita
                </a>
              </div>
            )}
          </div>
        </section>

        {/* VALUE PROPS */}
        <section className="py-16 md:py-24 border-t border-white/[0.04]">
          <div className="container-main">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
              {[
                {
                  icon: "R$0",
                  title: "100% Gratuito",
                  description:
                    "Todos os cursos sao gratuitos. Sem pegadinha, sem paywall escondido.",
                },
                {
                  icon: "//",
                  title: "Pratico e direto",
                  description:
                    "Conteudo criado por quem desenvolve software todos os dias. Sem enrolacao.",
                },
                {
                  icon: "[ ]",
                  title: "Certificado incluso",
                  description:
                    "Conclua o curso e a prova final para receber seu certificado verificavel.",
                },
              ].map((prop) => (
                <div key={prop.title} className="glass-card h-full">
                  <div className="text-2xl font-mono text-brand/40 mb-4">
                    {prop.icon}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    {prop.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PageFooter />
    </>
  );
}
