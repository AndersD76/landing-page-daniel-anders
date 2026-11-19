import type { Metadata } from "next";
import { FerramentaLayout } from "@/components/ferramentas/FerramentaLayout";
import { PAGINAS_FERRAMENTAS as P } from "@/data/ferramentas/paginas";
import { ChecklistIsca } from "@/components/ferramentas/ChecklistIsca";
import { CHECKLIST_LGPD } from "@/data/ferramentas/checklists";

export const metadata: Metadata = {
  title: { absolute: P.lgpd.title },
  description: P.lgpd.description,
  alternates: { canonical: `https://www.andersdev.com.br/ferramentas/${P.lgpd.slug}` },
  openGraph: { title: P.lgpd.title, description: P.lgpd.description, images: [{ url: `/og?t=${encodeURIComponent(P.lgpd.conteudo.h1)}&k=Ferramenta%20gratuita`, width: 1200, height: 630 }] },
};

export default function Page() {
  return (
    <FerramentaLayout iscaId="checklist-lgpd-site" conteudo={P.lgpd.conteudo}>
      <ChecklistIsca iscaId="checklist-lgpd-site" titulo="Checklist LGPD para site e sistema" grupos={CHECKLIST_LGPD} ctaHref="/servicos/desenvolvimento-react-next-js" ctaTexto="Site e sistema com consentimento, descadastro e segurança já embutidos: veja como funciona." />
    </FerramentaLayout>
  );
}
