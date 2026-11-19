import type { Metadata } from "next";
import { HubView, type GrupoHub } from "@/components/conteudo/HubView";
import { paginasNoArDoTipo } from "@/lib/conteudo";
import { item } from "@/lib/conteudo/hubs";
import { getIsca } from "@/data/iscas";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: { absolute: "Glossário de tecnologia para empresas | AndersDev" },
  description:
    "API, ERP, LGPD, SEO, PWA, gateway: termos de tecnologia em português claro, cada um com exemplo prático de pequena empresa. Consulte.",
  alternates: { canonical: "https://www.andersdev.com.br/glossario" },
};

function letra(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase();
}

function nomeTermo(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export default function Page() {
  const termos = paginasNoArDoTipo("glossario").sort((a, b) =>
    (a.glossario?.termo ?? a.h1).localeCompare(b.glossario?.termo ?? b.h1, "pt-BR")
  );
  const grupos = new Map<string, GrupoHub>();
  for (const t of termos) {
    const nome = t.glossario?.termo ? nomeTermo(t.glossario.termo) : t.h1;
    const l = letra(nome);
    if (!grupos.has(l)) grupos.set(l, { titulo: l, itens: [] });
    grupos.get(l)!.itens.push({ ...item(t), titulo: nome });
  }
  return (
    <HubView
      h1="Glossário de tecnologia para empresas"
      intro="Os termos que aparecem em orçamento, contrato e reunião de projeto, explicados sem jargão e com um exemplo concreto de oficina, clínica, loja ou transportadora."
      url="/glossario"
      pageType="hub"
      grupos={[...grupos.values()]}
      isca={getIsca("mini-curso-sistema")}
    />
  );
}
