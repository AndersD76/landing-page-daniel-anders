import type { Metadata } from "next";
import { FerramentaLayout } from "@/components/ferramentas/FerramentaLayout";
import { PAGINAS_FERRAMENTAS as P } from "@/data/ferramentas/paginas";
import { TaxaMarketplace } from "@/components/ferramentas/Calculadoras";
import { faixaNumericaDoTipo } from "@/data/faixas";

export const metadata: Metadata = {
  title: { absolute: P.marketplace.title },
  description: P.marketplace.description,
  alternates: { canonical: `https://www.andersdev.com.br/ferramentas/${P.marketplace.slug}` },
  openGraph: { title: P.marketplace.title, description: P.marketplace.description, images: [{ url: `/og?t=${encodeURIComponent(P.marketplace.conteudo.h1)}&k=Ferramenta%20gratuita`, width: 1200, height: 630 }] },
};

export default function Page() {
  return (
    <FerramentaLayout iscaId="taxa-marketplace" conteudo={P.marketplace.conteudo}>
      <TaxaMarketplace faixa={{ rotulo: "Loja virtual própria", ...faixaNumericaDoTipo("ecommerce"), href: "/quanto-custa/ecommerce" }} />
    </FerramentaLayout>
  );
}
