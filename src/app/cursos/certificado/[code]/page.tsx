import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageFooter } from "@/components/layout/PageFooter";

interface CertificateData {
  code: string;
  studentName: string;
  courseTitle: string;
  courseCargaHoraria: string | null;
  issuedAt: string;
}

async function getCertificate(
  code: string,
): Promise<CertificateData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/ead/certificate/${code}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.valid || !data.certificate) return null;
    return {
      code: data.certificate.code,
      studentName: data.certificate.studentName,
      courseTitle: data.certificate.courseTitle,
      courseCargaHoraria: data.certificate.cargaHoraria,
      issuedAt: data.certificate.issuedAt,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const cert = await getCertificate(code);
  if (!cert) return { title: "Certificado nao encontrado" };

  return {
    title: `Certificado - ${cert.studentName} - ${cert.courseTitle}`,
    description: `Certificado de conclusao do curso ${cert.courseTitle} emitido para ${cert.studentName} pela AndersDev.`,
    openGraph: {
      title: `Certificado AndersDev - ${cert.courseTitle}`,
      description: `${cert.studentName} concluiu o curso ${cert.courseTitle}.`,
      url: `https://www.andersdev.com.br/cursos/certificado/${code}`,
    },
  };
}

export default async function CertificadoPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const cert = await getCertificate(code);
  if (!cert) notFound();

  const issuedDate = new Date(cert.issuedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <main className="min-h-screen py-12 md:py-24">
        <div className="container-main flex justify-center">
          <div className="w-full max-w-2xl">
            {/* Certificate card */}
            <div className="relative bg-surface-dark border border-white/[0.08] rounded-2xl overflow-hidden">
              {/* Top accent line */}
              <div className="h-1 bg-gradient-to-r from-brand via-brand-bright to-brand" />

              {/* Corner decorations */}
              <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-brand/20 rounded-tl-lg" />
              <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-brand/20 rounded-tr-lg" />
              <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-brand/20 rounded-bl-lg" />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-brand/20 rounded-br-lg" />

              <div className="px-8 py-12 md:px-16 md:py-16 text-center">
                {/* Logo */}
                <div className="font-heading text-xl font-bold text-foreground mb-1">
                  anders<span className="text-brand">dev</span>
                </div>
                <p className="text-xs text-gray tracking-[3px] uppercase mb-10">
                  CERTIFICADO DE CONCLUSAO
                </p>

                {/* Verified badge */}
                <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 px-4 py-1.5 rounded-full mb-8">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-brand"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-xs font-bold text-brand tracking-[1px]">
                    VERIFICADO
                  </span>
                </div>

                {/* Content */}
                <p className="text-sm text-gray mb-3">
                  Certificamos que
                </p>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {cert.studentName}
                </h1>

                <p className="text-sm text-gray mb-2">
                  concluiu com aproveitamento o curso
                </p>
                <h2 className="font-heading text-xl md:text-2xl font-bold text-brand mb-6">
                  {cert.courseTitle}
                </h2>

                {cert.courseCargaHoraria && (
                  <p className="text-sm text-gray mb-2">
                    Carga horaria: {cert.courseCargaHoraria}
                  </p>
                )}

                <p className="text-sm text-gray mb-8">
                  Emitido em {issuedDate}
                </p>

                {/* Divider */}
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent mx-auto mb-8" />

                {/* Issuer */}
                <div>
                  <p className="text-sm text-foreground font-bold">
                    Daniel Anders
                  </p>
                  <p className="text-xs text-gray">
                    Desenvolvedor Full-Stack &amp; Instrutor
                  </p>
                </div>

                {/* Code */}
                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                  <p className="text-[0.65rem] text-gray-600 tracking-[2px] uppercase">
                    Codigo de verificacao
                  </p>
                  <p className="font-mono text-sm text-gray mt-1">
                    {cert.code}
                  </p>
                  <p className="text-[0.65rem] text-gray-600 mt-2">
                    Verifique em andersdev.com.br/cursos/certificado/{cert.code}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link
                href="/cursos"
                className="text-sm text-gray hover:text-brand transition-colors no-underline"
              >
                Ver mais cursos
              </Link>
              <span className="text-white/[0.08] hidden sm:inline">|</span>
              <Link
                href="/"
                className="text-sm text-gray hover:text-brand transition-colors no-underline"
              >
                Conhecer AndersDev
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PageFooter />
    </>
  );
}
