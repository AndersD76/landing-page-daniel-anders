/**
 * /llms-full.txt — texto integral, em Markdown, das páginas de referência
 * (guias, leis explicadas e comparativos) que estão no ar. Gerado do mesmo
 * conteúdo das páginas: nada aqui é escrito à mão.
 */

import { paginasNoArDoTipo, type PaginaAvaliada } from "@/lib/conteudo";

export const revalidate = 3600;

function markdown(p: PaginaAvaliada): string {
  const partes = [`# ${p.h1}`, `Fonte: ${p.urlAbsoluta} — revisado em ${p.revisadoEm}`, "", p.respostaDireta, ""];
  for (const s of p.secoes) {
    partes.push(`## ${s.titulo}`, "", ...s.paragrafos.flatMap((x) => [x, ""]));
    if (s.lista) partes.push(...s.lista.map((x, i) => (s.listaOrdenada ? `${i + 1}. ${x}` : `- ${x}`)), "");
    if (s.tabela) {
      partes.push(`| ${s.tabela.colunas.join(" | ")} |`, `|${s.tabela.colunas.map(() => "---").join("|")}|`);
      partes.push(...s.tabela.linhas.map((l) => `| ${l.join(" | ")} |`), "");
    }
  }
  if (p.comparativo) {
    partes.push(`## ${p.comparativo.opcaoA} × ${p.comparativo.opcaoB}`, "", `| Critério | ${p.comparativo.opcaoA} | ${p.comparativo.opcaoB} |`, "|---|---|---|");
    partes.push(...p.comparativo.criterios.map((c) => `| ${c.criterio} | ${c.a} | ${c.b} |`), "", `Veredito: ${p.comparativo.veredito}`, "");
  }
  if (p.faq.length) partes.push("## Perguntas frequentes", "", ...p.faq.flatMap((f) => [`**${f.pergunta}** ${f.resposta}`, ""]));
  if (p.fontes.length) partes.push("Fontes: " + p.fontes.map((f) => `${f.titulo} (${f.url.startsWith("/") ? "https://www.andersdev.com.br" + f.url : f.url})`).join("; "), "");
  return partes.join("\n");
}

export function GET() {
  const paginas = [...paginasNoArDoTipo("pilar"), ...paginasNoArDoTipo("norma"), ...paginasNoArDoTipo("comparativo")];
  const corpo = [
    "# AndersDev — guias, leis explicadas e comparativos (texto integral)",
    "",
    "Conteúdo de www.andersdev.com.br, de Daniel Anders (Passo Fundo/RS). Política editorial: https://www.andersdev.com.br/politica-editorial",
    "",
    ...paginas.map(markdown),
  ].join("\n");
  return new Response(corpo, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" },
  });
}
