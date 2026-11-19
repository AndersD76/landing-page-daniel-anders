import type { Metadata } from "next";
import { FerramentaLayout } from "@/components/ferramentas/FerramentaLayout";
import { PAGINAS_FERRAMENTAS as P } from "@/data/ferramentas/paginas";
import { CustoDaPlanilha } from "@/components/ferramentas/Calculadoras";
import { faixaNumericaDoTipo } from "@/data/faixas";

export const metadata: Metadata = {
  title: { absolute: P.planilha.title },
  description: P.planilha.description,
  alternates: { canonical: `https://www.andersdev.com.br/ferramentas/${P.planilha.slug}` },
  openGraph: { title: P.planilha.title, description: P.planilha.description, images: [{ url: `/og?t=${encodeURIComponent(P.planilha.conteudo.h1)}&k=Ferramenta%20gratuita`, width: 1200, height: 630 }] },
};

export default function Page() {
  return (
    <FerramentaLayout iscaId="custo-da-planilha" conteudo={P.planilha.conteudo}>
      <CustoDaPlanilha faixa={{ rotulo: "Sistema web sob medida", ...faixaNumericaDoTipo("mvp-saas"), href: "/quanto-custa/mvp-saas" }} />
    </FerramentaLayout>
  );
}
