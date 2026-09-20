import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaginaCustoView } from "@/components/custos/PaginaCustoView";
import { getPaginaCusto, paginasCusto } from "@/data/custos";

export const dynamicParams = false;

export function generateStaticParams() {
  return paginasCusto
    .filter((p) => p.kind === "combo")
    .map((p) => ({ tipo: p.slugPath[0], combo: p.slugPath[1] }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tipo: string; combo: string }>;
}): Promise<Metadata> {
  const { tipo, combo } = await params;
  const pagina = getPaginaCusto([tipo, combo]);
  if (!pagina) return {};

  return {
    // absolute: o título já está completo e com a palavra-chave na frente.
    // Herdar o sufixo do layout empurraria para ~90 chars e o Google cortaria.
    title: { absolute: pagina.title },
    description: pagina.metaDescription,
    alternates: { canonical: pagina.url },
    robots: pagina.gate.aprovado
      ? undefined
      : { index: false, follow: true },
    openGraph: {
      title: pagina.title,
      description: pagina.metaDescription,
      url: pagina.url,
      type: "article",
    },
  };
}

export default async function QuantoCustaComboPage({
  params,
}: {
  params: Promise<{ tipo: string; combo: string }>;
}) {
  const { tipo, combo } = await params;
  const pagina = getPaginaCusto([tipo, combo]);
  if (!pagina) notFound();

  return <PaginaCustoView pagina={pagina} />;
}
