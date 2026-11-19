import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { estaNoAr, getPagina, slugsDoTipo, ROTULO_TIPO, type TipoConteudo } from "@/lib/conteudo";
import { PaginaConteudoView } from "./PaginaConteudoView";

/**
 * Fábrica das rotas de conteúdo: mesma regra para os seis tipos.
 * - generateStaticParams devolve tudo que passou no portão (inclusive ondas
 *   futuras, que respondem 404 até a data — o ISR diário as libera sozinho);
 * - página fora do ar (reprovada, rascunho, onda futura, tipo pausado) = 404.
 */

export function tituloFinal(title: string): string {
  const sufixo = " | AndersDev";
  return title.length + sufixo.length <= 60 ? `${title}${sufixo}` : title;
}

export function criarRota(tipo: TipoConteudo) {
  async function generateStaticParams() {
    return slugsDoTipo(tipo).map((slug) => ({ slug }));
  }

  async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const p = getPagina(tipo, slug);
    if (!p || !estaNoAr(p)) return { title: "Página não encontrada", robots: { index: false, follow: false } };
    const og = `/og?t=${encodeURIComponent(p.h1)}&k=${encodeURIComponent(ROTULO_TIPO[p.tipo])}`;
    return {
      title: { absolute: tituloFinal(p.title) },
      description: p.description,
      alternates: { canonical: p.urlAbsoluta },
      robots: { index: true, follow: true },
      authors: [{ name: "Daniel Anders", url: "https://www.andersdev.com.br/sobre/daniel-anders" }],
      openGraph: {
        type: "article",
        locale: "pt_BR",
        url: p.urlAbsoluta,
        siteName: "AndersDev",
        title: p.title,
        description: p.description,
        publishedTime: p.publicadoEm ?? p.revisadoEm,
        modifiedTime: p.revisadoEm,
        images: [{ url: og, width: 1200, height: 630, alt: p.h1 }],
      },
      twitter: { card: "summary_large_image", title: p.title, description: p.description, images: [og] },
    };
  }

  async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const p = getPagina(tipo, slug);
    if (!p || !estaNoAr(p)) notFound();
    return <PaginaConteudoView p={p} />;
  }

  return { generateStaticParams, generateMetadata, Page };
}
