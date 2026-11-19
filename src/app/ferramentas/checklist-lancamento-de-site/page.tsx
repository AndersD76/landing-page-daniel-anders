import type { Metadata } from "next";
import { FerramentaLayout } from "@/components/ferramentas/FerramentaLayout";
import { PAGINAS_FERRAMENTAS as P } from "@/data/ferramentas/paginas";
import { ChecklistIsca } from "@/components/ferramentas/ChecklistIsca";
import { CHECKLIST_LANCAMENTO } from "@/data/ferramentas/checklists";

export const metadata: Metadata = {
  title: { absolute: P.lancamento.title },
  description: P.lancamento.description,
  alternates: { canonical: `https://www.andersdev.com.br/ferramentas/${P.lancamento.slug}` },
  openGraph: { title: P.lancamento.title, description: P.lancamento.description, images: [{ url: `/og?t=${encodeURIComponent(P.lancamento.conteudo.h1)}&k=Ferramenta%20gratuita`, width: 1200, height: 630 }] },
};

export default function Page() {
  return (
    <FerramentaLayout iscaId="checklist-lancamento-site" conteudo={P.lancamento.conteudo}>
      <ChecklistIsca iscaId="checklist-lancamento-site" titulo="Checklist de lançamento de site" grupos={CHECKLIST_LANCAMENTO} ctaHref="/quanto-custa/site-institucional" ctaTexto="Prefere receber o site com tudo isso resolvido? Veja a faixa de preço." />
    </FerramentaLayout>
  );
}
