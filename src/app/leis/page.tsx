import type { Metadata } from "next";
import { HubView } from "@/components/conteudo/HubView";
import { paginasNoArDoTipo } from "@/lib/conteudo";
import { item } from "@/lib/conteudo/hubs";
import { getIsca } from "@/data/iscas";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: { absolute: "Leis para sites, lojas e sistemas explicadas | AndersDev" },
  description:
    "LGPD, Marco Civil, Decreto do e-commerce, CDC e Lei do Software: um artigo por página, com o que pede e as evidências a guardar. Confira.",
  alternates: { canonical: "https://www.andersdev.com.br/leis" },
};

export default function Page() {
  const normas = paginasNoArDoTipo("norma").sort((a, b) => a.h1.localeCompare(b.h1, "pt-BR"));
  return (
    <HubView
      h1="Leis para sites, lojas e sistemas, explicadas"
      intro="Um dispositivo por página, com link para o texto oficial: o que a norma pede, o que costuma ser cobrado, que evidência guardar e os erros comuns. Conteúdo informativo, não é parecer jurídico."
      url="/leis"
      pageType="hub"
      cluster="lgpd-legal"
      grupos={[{ titulo: "Dispositivos explicados", itens: normas.map(item) }]}
      isca={getIsca("checklist-lgpd-site")}
    />
  );
}
