/**
 * Relatório do quality gate dos dois eixos gerados.
 * Roda antes de qualquer geração em massa. Reprovar é o sistema funcionando.
 *
 * Rodar: npm run gate
 */

import {
  paginasCusto,
  paginasIndexaveis,
  paginasReprovadas,
  GATE,
} from "../src/data/custos";
import {
  paginasSetor,
  setoresIndexaveis,
  setoresReprovados,
  fonteMercado,
} from "../src/data/setores-paginas";

const linha = "=".repeat(66);

/* ------------------------------------------------------- eixo quanto custa */

console.log("\nQuality gate — eixo QUANTO CUSTA (tipo × integração)");
console.log(linha);
console.log(
  `Mínimos: ${GATE.minPalavras} palavras próprias, ${GATE.minFaqs} FAQs, ${GATE.minItensLista} itens de lista`
);
console.log(`Fonte do dado: modelo de precificação próprio\n`);

const porTipo = { tipo: 0, combo: 0 };
for (const p of paginasIndexaveis) porTipo[p.kind]++;

console.log(`Geradas:     ${paginasCusto.length}`);
console.log(
  `Indexáveis:  ${paginasIndexaveis.length}  (${porTipo.tipo} tipo + ${porTipo.combo} combinação)`
);
console.log(`Reprovadas:  ${paginasReprovadas.length}`);

if (paginasReprovadas.length) {
  console.log("\nFora do índice e fora do sitemap:");
  for (const p of paginasReprovadas) {
    console.log(`  ${p.url}`);
    for (const m of p.gate.reprovacoes) console.log(`     - ${m}`);
  }
}

const pc = paginasCusto.map((p) => p.gate.palavras).sort((a, b) => a - b);
console.log(
  `\nProsa própria: mín ${pc[0]} / mediana ${pc[Math.floor(pc.length / 2)]} / máx ${pc[pc.length - 1]}`
);

console.log("\nAmostra:");
for (const p of paginasCusto.slice(0, 3)) {
  const extra = p.preco.acrescimo ? ` (integração: ${p.preco.acrescimo})` : "";
  console.log(`  ${p.slugPath.join("/")}: ${p.preco.faixa}${extra}`);
}

/* -------------------------------------------------------------- eixo setor */

console.log("\n\nQuality gate — eixo SETOR (CNAE)");
console.log(linha);
console.log(`Fonte do dado: ${fonteMercado.nome}`);
console.log(
  `Ano de referência: ${fonteMercado.anoReferencia} | carga em: ${fonteMercado.carregadoEm}\n`
);

console.log(`Geradas:     ${paginasSetor.length}`);
console.log(`Indexáveis:  ${setoresIndexaveis.length}`);
console.log(`Reprovadas:  ${setoresReprovados.length}`);

if (setoresReprovados.length) {
  console.log("\nFora do índice e fora do sitemap:");
  for (const p of setoresReprovados) {
    console.log(`  ${p.url}`);
    for (const m of p.gate.reprovacoes) console.log(`     - ${m}`);
  }
}

const ps = paginasSetor.map((p) => p.gate.palavras).sort((a, b) => a - b);
console.log(
  `\nProsa própria: mín ${ps[0]} / mediana ${ps[Math.floor(ps.length / 2)]} / máx ${ps[ps.length - 1]}`
);

console.log("\nAmostra (dado IBGE real + preço calculado):");
for (const p of paginasSetor.slice(0, 5)) {
  console.log(
    `  ${p.slug.padEnd(30)} ${p.dado.empresasBrasil.toLocaleString("pt-BR").padStart(9)} empresas · ` +
      `${p.participacaoPct}% do país · ${p.concentracaoTop5Pct}% em 5 UFs · ${p.preco.faixa}`
  );
}

/* ------------------------------------------------------------------ total */

const total = paginasIndexaveis.length + setoresIndexaveis.length;
const geradas = paginasCusto.length + paginasSetor.length;

console.log("\n" + linha);
console.log(`TOTAL: ${total} páginas indexáveis de ${geradas} geradas`);
console.log(linha + "\n");
