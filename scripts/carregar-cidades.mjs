/**
 * Carga do CEMPRE por MUNICÍPIO, para o eixo geográfico.
 *
 * Fonte: IBGE — Cadastro Central de Empresas (CEMPRE), agregado 6449 (SIDRA),
 * mais a API de localidades para mesorregião. Dado oficial e citável.
 *
 * Por que só o RS: é a área de atendimento real. Gerar página para os 5.570
 * municípios do país com o mesmo texto e preço nacional seria exatamente o
 * erro que este eixo existe para evitar — página genérica com o nome trocado.
 * Aqui o que muda por cidade é o número de empresas E a composição setorial,
 * que é o que decide qual sistema faz sentido ali.
 *
 * Rodar: npm run carregar:cidades
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

const API = "https://servicodados.ibge.gov.br/api/v3/agregados/6449";
const LOCALIDADES = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/43/municipios";
const CLASSIFICACAO = "12762";
const TOTAL_CAT = "117897";
const UF = "43"; // Rio Grande do Sul
const SAIDA = join("src", "data", "cidades-cempre.json");

/** Mínimo de empresas para a cidade sustentar uma página própria. */
const MIN_EMPRESAS = 800;

/** Seções da CNAE 2.0 — o perfil econômico da cidade sai daqui. */
const SECOES = [
  { id: "116830", nome: "Agropecuária" },
  { id: "116910", nome: "Indústria de transformação" },
  { id: "117329", nome: "Construção" },
  { id: "117363", nome: "Comércio e reparação de veículos" },
  { id: "117484", nome: "Transporte e armazenagem" },
  { id: "117543", nome: "Alojamento e alimentação" },
  { id: "117555", nome: "Informação e comunicação" },
  { id: "117608", nome: "Atividades financeiras e seguros" },
  { id: "117666", nome: "Atividades imobiliárias" },
  { id: "117673", nome: "Atividades profissionais e técnicas" },
  { id: "117714", nome: "Serviços administrativos" },
  { id: "117788", nome: "Educação" },
  { id: "117810", nome: "Saúde e serviços sociais" },
  { id: "117838", nome: "Artes, cultura e esporte" },
  { id: "117861", nome: "Outros serviços" },
];

async function buscarJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": "andersdev-cidades-loader" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
  return res.json();
}

async function ultimoPeriodo() {
  const meta = await buscarJson(`${API}/metadados`);
  const fim = meta?.periodicidade?.fim;
  if (!fim) throw new Error("metadados sem período final");
  return String(fim);
}

/** Mapa "catId|localidadeId" -> valor numérico. Valor não numérico some. */
function indexar(bloco) {
  const out = new Map();
  for (const r of bloco?.resultados ?? []) {
    const cat = r.classificacoes?.[0]?.categoria ?? {};
    const catId = Object.keys(cat)[0];
    for (const s of r.series ?? []) {
      const valores = Object.values(s.serie ?? {});
      const n = Number(valores[valores.length - 1]);
      if (Number.isFinite(n)) out.set(`${catId}|${s.localidade?.id}`, n);
    }
  }
  return out;
}

function slugificar(nome) {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const periodo = await ultimoPeriodo();
  console.log(`CEMPRE — período mais recente publicado: ${periodo}`);

  console.log("Buscando mesorregiões (API de localidades)...");
  const municipios = await buscarJson(LOCALIDADES);
  const meta = new Map(
    municipios.map((m) => [
      String(m.id),
      {
        nome: m.nome,
        mesorregiao: m.microrregiao?.mesorregiao?.nome ?? null,
        microrregiao: m.microrregiao?.nome ?? null,
      },
    ])
  );
  console.log(`  ${meta.size} municípios do RS`);

  const url = (cats) =>
    `${API}/periodos/${periodo}/variaveis/2585%7C707` +
    `?localidades=N6[N3[${UF}]]&classificacao=${CLASSIFICACAO}[${cats}]`;

  console.log("Buscando totais por município...");
  const totais = await buscarJson(url(TOTAL_CAT));
  const empresas = indexar(totais.find((b) => b.id === "2585"));
  const pessoal = indexar(totais.find((b) => b.id === "707"));

  console.log("Buscando composição setorial dos municípios...");
  const secoes = await buscarJson(url(SECOES.map((s) => s.id).join(",")));
  const porSecao = indexar(secoes.find((b) => b.id === "2585"));

  // Base de comparação: a composição do ESTADO inteiro, não a soma dos top-6
  // das cidades carregadas. Sem isso a "média" fica torta e a razão de
  // sobre-representação vira número inventado.
  console.log("Buscando composição setorial do estado (base de comparação)...");
  const urlUf = (cats) =>
    `${API}/periodos/${periodo}/variaveis/2585` +
    `?localidades=N3[${UF}]&classificacao=${CLASSIFICACAO}[${cats}]`;
  const ufSecoes = await buscarJson(urlUf([TOTAL_CAT, ...SECOES.map((s) => s.id)].join(",")));
  const porSecaoUf = indexar(ufSecoes.find((b) => b.id === "2585"));
  const totalUf = porSecaoUf.get(`${TOTAL_CAT}|${UF}`);
  if (!Number.isFinite(totalUf) || totalUf <= 0) {
    throw new Error("total de empresas do estado não veio na carga");
  }
  const mediaUf = SECOES.map((sec) => {
    const n = porSecaoUf.get(`${sec.id}|${UF}`);
    return {
      nome: sec.nome,
      empresas: Number.isFinite(n) ? n : null,
      pctUf: Number.isFinite(n) ? Number(((n / totalUf) * 100).toFixed(2)) : null,
    };
  }).filter((m) => m.pctUf !== null);
  console.log(`  estado: ${totalUf.toLocaleString("pt-BR")} empresas, ${mediaUf.length} seções`);

  const registros = [];
  const foraDoGate = [];

  for (const [id, info] of meta) {
    const total = empresas.get(`${TOTAL_CAT}|${id}`);

    if (!Number.isFinite(total)) {
      foraDoGate.push({ nome: info.nome, motivo: "sem número de empresas na fonte" });
      continue;
    }
    if (total < MIN_EMPRESAS) continue; // pequena demais, nem entra no relatório

    const setores = SECOES.map((s) => ({
      nome: s.nome,
      empresas: porSecao.get(`${s.id}|${id}`) ?? null,
    }))
      .filter((s) => Number.isFinite(s.empresas) && s.empresas > 0)
      .sort((a, b) => b.empresas - a.empresas);

    // Sem composição setorial a página não teria o que dizer além do total.
    if (setores.length < 5) {
      foraDoGate.push({
        nome: info.nome,
        motivo: `composição setorial incompleta (${setores.length} seções)`,
      });
      continue;
    }
    if (!info.mesorregiao) {
      foraDoGate.push({ nome: info.nome, motivo: "sem mesorregião na fonte" });
      continue;
    }

    registros.push({
      slug: slugificar(info.nome),
      nome: info.nome,
      ibgeId: id,
      uf: "RS",
      mesorregiao: info.mesorregiao,
      microrregiao: info.microrregiao,
      empresas: total,
      pessoalOcupado: pessoal.get(`${TOTAL_CAT}|${id}`) ?? null,
      setores: setores.slice(0, 6),
    });
  }

  registros.sort((a, b) => b.empresas - a.empresas);

  const payload = {
    fonte: "IBGE — Cadastro Central de Empresas (CEMPRE)",
    fonteUrl: "https://sidra.ibge.gov.br/tabela/6449",
    fonteRegioes: "IBGE — Divisão territorial brasileira",
    agregado: 6449,
    anoReferencia: periodo,
    carregadoEm: new Date().toISOString().slice(0, 10),
    uf: "RS",
    minEmpresas: MIN_EMPRESAS,
    totalEmpresasUf: totalUf,
    mediaUf,
    totalMunicipiosUf: meta.size,
    cidades: registros,
  };

  writeFileSync(SAIDA, JSON.stringify(payload, null, 2) + "\n", "utf8");

  console.log(`\nGravado: ${SAIDA}`);
  console.log(`  municípios no RS:              ${meta.size}`);
  console.log(`  passaram o corte (>= ${MIN_EMPRESAS}):   ${registros.length}`);
  if (foraDoGate.length) {
    console.log(`  fora por fonte incompleta:     ${foraDoGate.length}`);
    for (const f of foraDoGate.slice(0, 10)) console.log(`     - ${f.nome}: ${f.motivo}`);
  }
  console.log(`  ano de referência:             ${periodo}`);
}

main().catch((err) => {
  console.error("\nFalha na carga:", err.message);
  process.exit(1);
});
