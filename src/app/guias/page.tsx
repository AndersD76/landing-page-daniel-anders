import type { Metadata } from "next";
import { HubView } from "@/components/conteudo/HubView";
import { paginasNoArDoTipo } from "@/lib/conteudo";
import { item } from "@/lib/conteudo/hubs";
import { CLUSTERS } from "@/lib/seo/taxonomia";
import { getIsca } from "@/data/iscas";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: { absolute: "Guias completos: sites, apps e sistemas | AndersDev" },
  description:
    "Guias para donos de empresa: quanto custa, como contratar, LGPD, Google, loja virtual, apps, sistemas e automação. Comece por aqui.",
  alternates: { canonical: "https://www.andersdev.com.br/guias" },
};

export default function Page() {
  return (
    <HubView
      h1="Guias completos para tirar o projeto do papel"
      intro="Um guia por tema, do básico à decisão. Cada um aponta para as perguntas, modelos e comparativos do mesmo assunto."
      url="/guias"
      pageType="hub"
      grupos={[
        { titulo: "Guias", itens: paginasNoArDoTipo("pilar").map(item) },
        {
          titulo: "Todos os temas",
          itens: CLUSTERS.map((c) => ({ href: `/temas/${c.id}`, titulo: c.nome, resumo: c.descricao })),
        },
      ]}
      isca={getIsca("gerador-briefing-site")}
    />
  );
}
