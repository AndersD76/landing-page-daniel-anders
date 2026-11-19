import type { Metadata } from "next";
import { FerramentaLayout } from "@/components/ferramentas/FerramentaLayout";
import { PAGINAS_FERRAMENTAS as P } from "@/data/ferramentas/paginas";
import { PriorizadorMvp } from "@/components/ferramentas/Geradores";

export const metadata: Metadata = {
  title: { absolute: P.mvp.title },
  description: P.mvp.description,
  alternates: { canonical: `https://www.andersdev.com.br/ferramentas/${P.mvp.slug}` },
  openGraph: { title: P.mvp.title, description: P.mvp.description, images: [{ url: `/og?t=${encodeURIComponent(P.mvp.conteudo.h1)}&k=Ferramenta%20gratuita`, width: 1200, height: 630 }] },
};

export default function Page() {
  return (
    <FerramentaLayout iscaId="escopo-mvp" conteudo={P.mvp.conteudo}>
      <PriorizadorMvp />
    </FerramentaLayout>
  );
}
