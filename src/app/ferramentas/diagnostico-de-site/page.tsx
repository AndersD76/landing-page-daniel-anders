import type { Metadata } from "next";
import { FerramentaLayout } from "@/components/ferramentas/FerramentaLayout";
import { PAGINAS_FERRAMENTAS as P } from "@/data/ferramentas/paginas";
import { DiagnosticoSite } from "@/components/ferramentas/Diagnostico";

export const metadata: Metadata = {
  title: { absolute: P.diagnostico.title },
  description: P.diagnostico.description,
  alternates: { canonical: `https://www.andersdev.com.br/ferramentas/${P.diagnostico.slug}` },
  openGraph: { title: P.diagnostico.title, description: P.diagnostico.description, images: [{ url: `/og?t=${encodeURIComponent(P.diagnostico.conteudo.h1)}&k=Ferramenta%20gratuita`, width: 1200, height: 630 }] },
};

export default function Page() {
  return (
    <FerramentaLayout iscaId="diagnostico-site" conteudo={P.diagnostico.conteudo}>
      <DiagnosticoSite />
    </FerramentaLayout>
  );
}
