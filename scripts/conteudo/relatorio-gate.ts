/**
 * Resumo do portão de qualidade do conteúdo em escala (terminal).
 *   npx tsx scripts/conteudo/relatorio-gate.ts [--detalhe]
 */
import { carregarConteudo, resumoConteudo } from "../../src/lib/conteudo";

const r = resumoConteudo();
console.log(`\nConteúdo: ${r.total} páginas, ${r.noAr} no ar hoje, ${r.errosFormato} erro(s) de formato`);
console.table(r.porTipo);
const { todas, erros } = carregarConteudo();
// Reprovar é o portão funcionando; só erro de FORMATO (JSON/schema) falha o CI.
process.exitCode = erros.length ? 1 : 0;
for (const e of erros) console.log(`FORMATO ${e.arquivo}[${e.indice}] ${e.slug ?? ""}: ${e.erro}`);
const contagem = new Map<string, number>();
for (const p of todas.filter((x) => !x.qualidade.aprovado))
  for (const c of p.qualidade.checagens.filter((c) => !c.ok)) contagem.set(c.id, (contagem.get(c.id) ?? 0) + 1);
console.log("Reprovações por checagem:", Object.fromEntries(contagem));
if (process.argv.includes("--detalhe"))
  for (const p of todas.filter((x) => !x.qualidade.publicavel))
    console.log(`- ${p.url}${p.dependeAutor ? " [RASCUNHO]" : ""}: ${p.qualidade.checagens.filter((c) => !c.ok).map((c) => `${c.id}${c.detalhe ? ` (${c.detalhe})` : ""}`).join("; ")}`);
