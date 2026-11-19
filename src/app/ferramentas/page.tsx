import type { Metadata } from "next";
import { HubView } from "@/components/conteudo/HubView";
import { ISCAS } from "@/data/iscas";

export const metadata: Metadata = {
  title: { absolute: "Ferramentas gratuitas para empresas | AndersDev" },
  description: "Calculadoras, diagnóstico de site, checklists de lançamento e LGPD, gerador de briefing e priorizador de MVP. Resultado na hora, sem cadastro.",
  alternates: { canonical: "https://www.andersdev.com.br/ferramentas" },
};

export default function Page() {
  const ferramentas = ISCAS.filter((i) => i.id !== "modelo-download");
  return (
    <HubView
      h1="Ferramentas gratuitas para tirar o projeto do papel"
      intro="Todas mostram o resultado na tela, sem cadastro. Se quiser o relatório completo, ele vai por e-mail — e a inscrição em conteúdos é sempre opcional."
      url="/ferramentas"
      pageType="hub"
      grupos={[
        { titulo: "Ferramentas", itens: ferramentas.map((i) => ({ href: i.href, titulo: i.nome, resumo: i.chamada })) },
        { titulo: "Modelos para baixar", itens: [{ href: "/modelos", titulo: "Modelos, planilhas e checklists", resumo: "Prévia completa na página; arquivo editável por e-mail." }] },
      ]}
    />
  );
}
