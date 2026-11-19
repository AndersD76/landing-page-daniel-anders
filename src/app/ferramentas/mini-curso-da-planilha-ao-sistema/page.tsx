import type { Metadata } from "next";
import { FerramentaLayout } from "@/components/ferramentas/FerramentaLayout";
import { PAGINAS_FERRAMENTAS as P } from "@/data/ferramentas/paginas";
import { CapturaEmail } from "@/components/iscas/CapturaEmail";

export const metadata: Metadata = {
  title: { absolute: P.minicurso.title },
  description: P.minicurso.description,
  alternates: { canonical: `https://www.andersdev.com.br/ferramentas/${P.minicurso.slug}` },
  openGraph: { title: P.minicurso.title, description: P.minicurso.description, images: [{ url: `/og?t=${encodeURIComponent(P.minicurso.conteudo.h1)}&k=Ferramenta%20gratuita`, width: 1200, height: 630 }] },
};

export default function Page() {
  return (
    <FerramentaLayout iscaId="mini-curso-sistema" conteudo={P.minicurso.conteudo}>
      <CapturaEmail
        iscaId="mini-curso-sistema"
        titulo="Receber o mini-curso (5 e-mails, 1 a cada 2 dias)"
        textoBotao="Quero o mini-curso"
        relatorio={{
          titulo: "Mini-curso: da planilha ao sistema",
          resumo: "Inscrição confirmada. A aula 1 chega em seguida; as demais, a cada 2 dias.",
          destaques: [],
          secoes: [{ titulo: "Aulas", itens: ["1. Mapear o processo", "2. Medir o custo manual", "3. Decidir o que automatizar primeiro", "4. Pronto ou sob medida, e como comparar propostas", "5. Começar pequeno e medir"] }],
        }}
      />
    </FerramentaLayout>
  );
}
