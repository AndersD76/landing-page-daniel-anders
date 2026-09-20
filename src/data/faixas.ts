/**
 * Faixa de preço de um tipo de projeto, em texto, para uso fora das páginas
 * do eixo de custo (JSON-LD do layout, llms.txt, textos de apoio).
 *
 * Existe porque preço escrito à mão diverge do dado. O JSON-LD do layout
 * anunciava "a partir de R$ 2.500" em todas as páginas enquanto a calculadora
 * respondia outra coisa na mesma tela — contradição legível por máquina.
 */

import { paginasCusto } from "./custos";

export function faixaDoTipo(slug: string): string {
  const pagina = paginasCusto.find((p) => p.kind === "tipo" && p.tipo.slug === slug);
  if (!pagina) {
    throw new Error(
      `faixaDoTipo: tipo "${slug}" não existe no eixo de custo. ` +
        `Disponíveis: ${paginasCusto.filter((p) => p.kind === "tipo").map((p) => p.tipo.slug).join(", ")}`
    );
  }
  return pagina.preco.faixa;
}

/** Piso e teto numéricos, para Offer/AggregateOffer em JSON-LD. */
export function faixaNumericaDoTipo(slug: string): { min: number; max: number } {
  const pagina = paginasCusto.find((p) => p.kind === "tipo" && p.tipo.slug === slug);
  if (!pagina) throw new Error(`faixaNumericaDoTipo: tipo "${slug}" não existe`);
  return { min: pagina.preco.min, max: pagina.preco.max };
}
