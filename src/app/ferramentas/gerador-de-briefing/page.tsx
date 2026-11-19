import type { Metadata } from "next";
import { FerramentaLayout } from "@/components/ferramentas/FerramentaLayout";
import { PAGINAS_FERRAMENTAS as P } from "@/data/ferramentas/paginas";
import { GeradorBriefing } from "@/components/ferramentas/Geradores";

export const metadata: Metadata = {
  title: { absolute: P.briefing.title },
  description: P.briefing.description,
  alternates: { canonical: `https://www.andersdev.com.br/ferramentas/${P.briefing.slug}` },
  openGraph: { title: P.briefing.title, description: P.briefing.description, images: [{ url: `/og?t=${encodeURIComponent(P.briefing.conteudo.h1)}&k=Ferramenta%20gratuita`, width: 1200, height: 630 }] },
};

export default function Page() {
  return (
    <FerramentaLayout iscaId="gerador-briefing-site" conteudo={P.briefing.conteudo}>
      <GeradorBriefing />
    </FerramentaLayout>
  );
}
