import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";

export function PaginaInstitucional({
  h1,
  rotulo,
  jsonLd,
  children,
}: {
  h1: string;
  rotulo: string;
  jsonLd: Record<string, unknown>[];
  children: React.ReactNode;
}) {
  return (
    <>
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <PageNavbar links={[{ href: "/guias", label: "Guias" }, { href: "/ferramentas", label: "Ferramentas" }]} narrow />
      <main id="main-content" className="max-w-[800px] mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-16" data-page-type="institucional">
        <nav aria-label="Trilha" className="text-sm text-gray mb-6">
          <Link href="/" className="no-underline text-gray hover:text-brand">Início</Link>
          <span className="text-gray/50 mx-2">/</span>
          <span className="text-foreground">{rotulo}</span>
        </nav>
        <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-8">{h1}</h1>
        <div className="space-y-5 text-gray text-base md:text-lg leading-relaxed [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-brand [&_a]:underline [&_strong]:text-foreground">
          {children}
        </div>
      </main>
      <PageFooter narrow />
    </>
  );
}
