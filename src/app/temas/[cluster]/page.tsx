import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HubView, type GrupoHub } from "@/components/conteudo/HubView";
import { paginasNoAr, TIPOS_CONTEUDO, type TipoConteudo } from "@/lib/conteudo";
import { item } from "@/lib/conteudo/hubs";
import { CLUSTERS, getCluster } from "@/lib/seo/taxonomia";
import { getIsca } from "@/data/iscas";

export const revalidate = 86400;

const TITULO_GRUPO: Record<TipoConteudo, string> = {
  pilar: "Guia completo",
  satelite: "Perguntas",
  modelo: "Modelos e planilhas",
  glossario: "Glossário",
  norma: "Leis explicadas",
  comparativo: "Comparativos",
};

export async function generateStaticParams() {
  return CLUSTERS.map((c) => ({ cluster: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ cluster: string }> }): Promise<Metadata> {
  const { cluster } = await params;
  const c = getCluster(cluster);
  if (!c) return {};
  const titulo = `${c.nome} | AndersDev`;
  return {
    title: { absolute: titulo.length <= 60 ? titulo : c.nome.slice(0, 60) },
    description: `${c.descricao} Guias, perguntas, modelos e comparativos do tema.`.slice(0, 155),
    alternates: { canonical: `https://www.andersdev.com.br/temas/${c.id}` },
  };
}

export default async function Page({ params }: { params: Promise<{ cluster: string }> }) {
  const { cluster } = await params;
  const c = getCluster(cluster);
  if (!c) notFound();
  const doCluster = paginasNoAr().filter((p) => p.cluster === c.id);
  const grupos: GrupoHub[] = TIPOS_CONTEUDO.map((t) => ({
    titulo: TITULO_GRUPO[t],
    itens: doCluster
      .filter((p) => p.tipo === t)
      .sort((a, b) => a.h1.localeCompare(b.h1, "pt-BR"))
      .map(item),
  }));
  grupos.push({ titulo: "Serviço", itens: [{ href: c.paginaComercial.href, titulo: c.paginaComercial.rotulo }] });
  return (
    <HubView
      h1={c.nome}
      intro={c.descricao}
      url={`/temas/${c.id}`}
      pageType="hub"
      cluster={c.id}
      grupos={grupos}
      isca={getIsca(c.isca)}
    />
  );
}
