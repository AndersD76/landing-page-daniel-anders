import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaginaSetorView } from "@/components/setores/PaginaSetorView";
import { getPaginaSetor, paginasSetor } from "@/data/setores-paginas";

export const dynamicParams = false;

export function generateStaticParams() {
  return paginasSetor.map((p) => ({ setor: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ setor: string }>;
}): Promise<Metadata> {
  const { setor } = await params;
  const pagina = getPaginaSetor(setor);
  if (!pagina) return {};

  return {
    title: { absolute: pagina.title },
    description: pagina.metaDescription,
    alternates: { canonical: pagina.url },
    // Reprovou no gate: fica no ar para quem chega por link, fora do índice.
    robots: pagina.gate.aprovado ? undefined : { index: false, follow: true },
    openGraph: {
      title: pagina.title,
      description: pagina.metaDescription,
      url: pagina.url,
      type: "article",
    },
  };
}

export default async function SistemaParaSetorPage({
  params,
}: {
  params: Promise<{ setor: string }>;
}) {
  const { setor } = await params;
  const pagina = getPaginaSetor(setor);
  if (!pagina) notFound();

  return <PaginaSetorView pagina={pagina} />;
}
