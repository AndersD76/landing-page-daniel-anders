import type { Metadata } from "next";
import { HubView } from "@/components/conteudo/HubView";
import { paginasNoArDoTipo } from "@/lib/conteudo";
import { item } from "@/lib/conteudo/hubs";
import { getIsca } from "@/data/iscas";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: { absolute: "Modelos e planilhas grátis para empresas | AndersDev" },
  description:
    "Planilhas, checklists e modelos de documento prontos: estoque, ordem de serviço, fluxo de caixa, briefing, LGPD. Veja a prévia e baixe.",
  alternates: { canonical: "https://www.andersdev.com.br/modelos" },
};

export default function Page() {
  const modelos = paginasNoArDoTipo("modelo").sort((a, b) => a.h1.localeCompare(b.h1, "pt-BR"));
  const de = (f: string) => modelos.filter((m) => m.modelo?.formato === f).map(item);
  return (
    <HubView
      h1="Modelos e planilhas prontos para usar"
      intro="Cada modelo tem a prévia completa na página. O arquivo editável (CSV que abre no Excel e no Google Sheets, ou texto) chega por e-mail."
      url="/modelos"
      pageType="hub"
      grupos={[
        { titulo: "Planilhas", itens: de("planilha") },
        { titulo: "Checklists", itens: de("checklist") },
        { titulo: "Modelos de documento", itens: de("documento") },
      ]}
      isca={getIsca("custo-da-planilha")}
    />
  );
}
