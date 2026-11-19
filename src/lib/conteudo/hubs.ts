import { CLUSTERS } from "@/lib/seo/taxonomia";
import { paginasNoArDoTipo, type PaginaAvaliada, type TipoConteudo } from "./index";
import type { GrupoHub } from "@/components/conteudo/HubView";

export function item(p: PaginaAvaliada) {
  const primeira = p.respostaDireta.split(/(?<=[.!?])\s/)[0];
  return { href: p.url, titulo: p.h1, resumo: primeira };
}

/** Agrupa as páginas no ar de um tipo pelos clusters, na ordem da taxonomia. */
export function gruposPorCluster(tipo: TipoConteudo): GrupoHub[] {
  const paginas = paginasNoArDoTipo(tipo);
  return CLUSTERS.map((c) => ({
    titulo: c.nome,
    descricao: c.descricao,
    itens: paginas
      .filter((p) => p.cluster === c.id)
      .sort((a, b) => a.h1.localeCompare(b.h1, "pt-BR"))
      .map(item),
  })).filter((g) => g.itens.length);
}
