/**
 * Carga do CEMPRE (IBGE) para o eixo de setor.
 *
 * Fonte: IBGE, Cadastro Central de Empresas (CEMPRE), agregado 6449 da API
 * SIDRA. Dado oficial, público e citável — não é raspagem.
 *
 * Por que não o dump de CNPJ da Receita: o dump são ~20 GB mensais e traz
 * estabelecimento, não empresa. Para a pergunta que a página responde
 * ("quantas empresas desse setor existem e como se distribuem"), o CEMPRE
 * responde melhor, é agregado por CNAE e vem com ano de referência explícito.
 *
 * O ano de referência é lido da resposta, nunca digitado — é ele que alimenta
 * o carimbo "Fonte: X — atualizado em <data da carga>".
 *
 * Rodar: npm run carregar:cempre
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

const API = "https://servicodados.ibge.gov.br/api/v3/agregados/6449";
const VARS = { empresas: "2585", pessoal: "707", salarios: "662" };
const CLASSIFICACAO = "12762"; // CNAE 2.0
const SAIDA = join("src", "data", "setores-cempre.json");

/** Setores atendidos. O id é a categoria CNAE 2.0 dentro do agregado. */
const SETORES = [
  { slug: "clinicas-e-consultorios", cnae: "86.30-5", catId: "117818" },
  { slug: "restaurantes-e-bares", cnae: "56.11-2", catId: "117551" },
  { slug: "transportadoras", cnae: "49.30-2", catId: "117496" },
  { slug: "imobiliarias", cnae: "68.10-2", catId: "117669" },
  { slug: "escritorios-de-advocacia", cnae: "69.11-7", catId: "117676" },
  { slug: "escritorios-de-contabilidade", cnae: "69.20-6", catId: "117679" },
  { slug: "empresas-de-engenharia", cnae: "71.12-0", catId: "117688" },
  { slug: "oficinas-mecanicas", cnae: "45.20-0", catId: "117369" },
  { slug: "academias", cnae: "93.13-1", catId: "117856" },
  { slug: "saloes-de-beleza", cnae: "96.02-5", catId: "117885" },
  { slug: "clinicas-veterinarias", cnae: "75.00-1", catId: "117713" },
  { slug: "produtoras-de-eventos", cnae: "82.30-0", catId: "117769" },
];

async function buscarJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": "andersdev-cempre-loader" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
  return res.json();
}

/** Descobre o período mais recente publicado — não assume o ano. */
async function ultimoPeriodo() {
  const meta = await buscarJson(`${API}/metadados`);
  const fim = meta?.periodicidade?.fim;
  if (!fim) throw new Error("metadados sem período final");
  return String(fim);
}

function indexarPorCategoria(bloco) {
  const out = new Map();
  for (const r of bloco.resultados ?? []) {
    const cat = r.classificacoes?.[0]?.categoria ?? {};
    const catId = Object.keys(cat)[0];
    for (const s of r.series ?? []) {
      const loc = s.localidade?.id;
      const valores = Object.values(s.serie ?? {});
      const bruto = valores[valores.length - 1];
      const n = Number(bruto);
      if (!Number.isFinite(n)) continue; // "...", "-", "X" = sem dado
      out.set(`${catId}|${loc}`, n);
    }
  }
  return out;
}

async function main() {
  const periodo = await ultimoPeriodo();
  console.log(`CEMPRE — período mais recente publicado: ${periodo}`);

  const TOTAL_CAT = "117897"; // categoria "Total" do CNAE no agregado
  const ids = [TOTAL_CAT, ...SETORES.map((s) => s.catId)].join(",");
  const vars = Object.values(VARS).join("|");

  const url = (loc) =>
    `${API}/periodos/${periodo}/variaveis/${vars}` +
    `?localidades=${loc}&classificacao=${CLASSIFICACAO}[${ids}]`;

  console.log("Buscando Brasil (N1)...");
  const brasil = await buscarJson(url("N1[all]"));
  console.log("Buscando unidades da federação (N3)...");
  const ufs = await buscarJson(url("N3[all]"));

  const idx = {};
  for (const [nome, id] of Object.entries(VARS)) {
    idx[nome] = {
      br: indexarPorCategoria(brasil.find((b) => b.id === id) ?? {}),
      uf: indexarPorCategoria(ufs.find((b) => b.id === id) ?? {}),
    };
  }

  // Nomes das UFs vêm da própria resposta.
  const nomesUf = new Map();
  for (const r of (ufs[0]?.resultados ?? [])) {
    for (const s of r.series ?? []) {
      if (s.localidade?.id) nomesUf.set(s.localidade.id, s.localidade.nome);
    }
  }

  const registros = [];
  const semDado = [];

  for (const setor of SETORES) {
    const empresasBr = idx.empresas.br.get(`${setor.catId}|1`);
    const pessoalBr = idx.pessoal.br.get(`${setor.catId}|1`);
    const salariosBr = idx.salarios.br.get(`${setor.catId}|1`);

    if (!Number.isFinite(empresasBr) || empresasBr <= 0) {
      semDado.push({ slug: setor.slug, motivo: "sem número de empresas no Brasil" });
      continue;
    }

    const porUf = [];
    for (const [locId, nome] of nomesUf) {
      const n = idx.empresas.uf.get(`${setor.catId}|${locId}`);
      if (Number.isFinite(n) && n > 0) porUf.push({ uf: nome, empresas: n });
    }
    porUf.sort((a, b) => b.empresas - a.empresas);

    if (porUf.length < 20) {
      semDado.push({
        slug: setor.slug,
        motivo: `distribuição por UF incompleta (${porUf.length}/27)`,
      });
      continue;
    }

    registros.push({
      slug: setor.slug,
      cnae: setor.cnae,
      empresasBrasil: empresasBr,
      pessoalOcupado: Number.isFinite(pessoalBr) ? pessoalBr : null,
      // a API devolve em mil reais
      salariosMilReais: Number.isFinite(salariosBr) ? salariosBr : null,
      topUfs: porUf.slice(0, 5),
      ufsComDado: porUf.length,
    });
  }

  const totalBrasil = idx.empresas.br.get(`${TOTAL_CAT}|1`);
  if (!Number.isFinite(totalBrasil) || totalBrasil <= 0) {
    throw new Error("total de empresas do país não veio na carga");
  }

  const payload = {
    fonte: "IBGE — Cadastro Central de Empresas (CEMPRE)",
    fonteUrl: "https://sidra.ibge.gov.br/tabela/6449",
    agregado: 6449,
    anoReferencia: periodo,
    carregadoEm: new Date().toISOString().slice(0, 10),
    totalEmpresasBrasil: totalBrasil,
    setores: registros,
  };

  writeFileSync(SAIDA, JSON.stringify(payload, null, 2) + "\n", "utf8");

  console.log(`\nGravado: ${SAIDA}`);
  console.log(`  setores com dado completo: ${registros.length}/${SETORES.length}`);
  if (semDado.length) {
    console.log("  fora da carga (fonte incompleta):");
    for (const s of semDado) console.log(`    - ${s.slug}: ${s.motivo}`);
  }
  console.log(`  ano de referência: ${periodo}`);
  console.log(`  total de empresas no país: ${totalBrasil.toLocaleString("pt-BR")}`);
}

main().catch((err) => {
  console.error("\nFalha na carga:", err.message);
  process.exit(1);
});
