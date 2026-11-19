import type { Metadata } from "next";
import { HubView } from "@/components/conteudo/HubView";
import { gruposPorCluster } from "@/lib/conteudo/hubs";
import { getIsca } from "@/data/iscas";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: { absolute: "Perguntas sobre sites, apps e sistemas | AndersDev" },
  description:
    "Respostas diretas às dúvidas de quem vai contratar site, loja virtual, app ou sistema: prazo, custo, LGPD, Google e integrações.",
  alternates: { canonical: "https://www.andersdev.com.br/perguntas" },
};

export default function Page() {
  return (
    <HubView
      h1="Perguntas sobre sites, apps e sistemas"
      intro="Cada página responde uma pergunta só, logo na primeira frase, com passo a passo, tabela ou checklist. Organizado por tema."
      url="/perguntas"
      pageType="hub"
      grupos={gruposPorCluster("satelite")}
      isca={getIsca("calculadora-site")}
    />
  );
}
