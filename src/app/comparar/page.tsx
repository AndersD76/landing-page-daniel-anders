import type { Metadata } from "next";
import { HubView } from "@/components/conteudo/HubView";
import { gruposPorCluster } from "@/lib/conteudo/hubs";
import { getIsca } from "@/data/iscas";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: { absolute: "Comparativos: qual escolher na sua empresa | AndersDev" },
  description:
    "WordPress ou Wix, app nativo ou PWA, ERP pronto ou sob medida: comparações critério a critério, sem preço inventado. Veja qual serve para você.",
  alternates: { canonical: "https://www.andersdev.com.br/comparar" },
};

export default function Page() {
  return (
    <HubView
      h1="Comparativos para decidir sem achismo"
      intro="Duas opções lado a lado, critério a critério, com o cenário em que cada uma vence. Para comparar com plataformas específicas, veja também as páginas de alternativas."
      url="/comparar"
      pageType="hub"
      grupos={[
        ...gruposPorCluster("comparativo"),
        {
          titulo: "Alternativas a plataformas",
          descricao: "Quando a plataforma pronta começa a custar mais do que resolve.",
          itens: [
            { href: "/alternativa-a/wix", titulo: "Alternativa ao Wix" },
            { href: "/alternativa-a/wordpress", titulo: "Alternativa ao WordPress" },
            { href: "/alternativa-a/shopify", titulo: "Alternativa à Shopify" },
            { href: "/alternativa-a/agencia", titulo: "Alternativa à agência" },
            { href: "/alternativa-a/no-code", titulo: "Alternativa ao no-code" },
          ],
        },
      ]}
      isca={getIsca("taxa-marketplace")}
    />
  );
}
