import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaginaCidadeView } from "@/components/cidades/PaginaCidadeView";
import { getPaginaCidade, paginasCidade } from "@/data/cidades";

export const dynamicParams = false;

export function generateStaticParams() {
  return paginasCidade.map((p) => ({ cidade: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cidade: string }>;
}): Promise<Metadata> {
  const { cidade } = await params;
  const pagina = getPaginaCidade(cidade);
  if (!pagina) return {};

  return {
    title: { absolute: pagina.title },
    description: pagina.metaDescription,
    alternates: { canonical: pagina.url },
    robots: pagina.gate.aprovado ? undefined : { index: false, follow: true },
    openGraph: {
      title: pagina.title,
      description: pagina.metaDescription,
      url: pagina.url,
      type: "article",
    },
  };
}

export default async function CidadePage({
  params,
}: {
  params: Promise<{ cidade: string }>;
}) {
  const { cidade } = await params;
  const pagina = getPaginaCidade(cidade);
  if (!pagina) notFound();

  return <PaginaCidadeView pagina={pagina} />;
}
