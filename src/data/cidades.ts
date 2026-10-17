/**
 * Eixo GEOGRÁFICO — uma página por município do RS.
 *
 * Este é o eixo mais arriscado dos três, e vale dizer por quê: o preço de um
 * site não muda em Carazinho. Página de cidade com preço nacional e texto
 * genérico é exatamente o erro que os outros eixos evitam.
 *
 * O que justifica estas páginas é que o DADO muda de verdade por cidade:
 *   - quantas empresas existem ali (CEMPRE/IBGE)
 *   - o que essas empresas fazem (composição setorial)
 *   - o que a cidade tem de ATÍPICO frente ao estado (sobre-representação)
 *
 * E é a sobre-representação que decide o conteúdo: em Gramado a hospedagem
 * pesa 3,2x a média do RS, então a página fala de sistema de reserva; em Bento
 * Gonçalves a indústria pesa 1,5x, então fala de chão de fábrica. Não é a
 * mesma página com o nome trocado — é a mesma página com a conta refeita.
 *
 * O gate reprova cidade cuja carga veio incompleta ou que não tem nenhum setor
 * mensuravelmente atípico: sem isso, a página não teria o que dizer.
 */

import {
  calcularEstimativa,
  formatBRL,
  formatDataCarga,
  getConfig,
  FONTE_PRECIFICACAO,
} from "@/lib/calculadora";
import cempre from "./cidades-cempre.json";
import { BASE_URL, type ResultadoGate } from "./custos";
import { setoresConteudo } from "./setores";
import type { FAQ } from "./custos-tipos";

export interface SetorCidade {
  nome: string;
  empresas: number;
}

export interface CidadeBruta {
  slug: string;
  nome: string;
  ibgeId: string;
  uf: string;
  mesorregiao: string;
  microrregiao: string | null;
  empresas: number;
  pessoalOcupado: number | null;
  setores: SetorCidade[];
}

export const fonteCidades = {
  nome: cempre.fonte,
  url: cempre.fonteUrl,
  anoReferencia: String(cempre.anoReferencia),
  carregadoEm: cempre.carregadoEm,
  totalMunicipiosUf: cempre.totalMunicipiosUf,
  minEmpresas: cempre.minEmpresas,
  totalEmpresasUf: cempre.totalEmpresasUf,
};

const GATE_CIDADE = {
  minEmpresas: 800,
  minSetores: 5,
  /** razão mínima para um setor contar como atípico frente ao estado */
  minRazaoAtipica: 1.15,
} as const;

/** Mesorregião da base de operação — define atendimento presencial. */
const MESO_BASE = "Noroeste Rio-grandense";
const CIDADE_BASE = "Passo Fundo";

const mediaUf = new Map<string, number>(
  (cempre.mediaUf as Array<{ nome: string; pctUf: number }>).map((m) => [m.nome, m.pctUf])
);

/* ------------------------------------------------- contexto por mesorregião */

interface ContextoRegiao {
  resumo: string;
  atendimento: string;
}

const REGIOES: Record<string, ContextoRegiao> = {
  "Noroeste Rio-grandense": {
    resumo:
      "O Noroeste concentra o agronegócio gaúcho e a cadeia que vive dele: máquinas, armazenagem, transporte e os serviços profissionais que atendem produtor e cooperativa. É uma economia de empresa média, gestão familiar e ciclo sazonal — o que muda o que um sistema precisa resolver. Sistema de safra não é sistema de varejo: o pico de demanda tem data no calendário e todo mundo precisa dele ao mesmo tempo.",
    atendimento:
      "Esta é a região onde eu moro e trabalho. Reunião presencial no seu escritório é possível e, em projeto de operação, costuma encurtar bastante o levantamento — ver o processo rodando explica em uma hora o que três calls não explicam.",
  },
  "Nordeste Rio-grandense": {
    resumo:
      "A Serra combina duas economias que raramente convivem: indústria de transformação madura, com empresa que exporta e tem processo formalizado, e turismo intenso, com pico sazonal e ticket alto. São necessidades opostas num raio de poucos quilômetros — uma precisa de rastreabilidade e integração com ERP, a outra de reserva, ocupação e experiência do hóspede.",
    atendimento:
      "Atendimento remoto, com visita presencial combinada nas etapas que pedem: levantamento inicial e entrega. Da minha base são cerca de três horas de viagem.",
  },
  "Metropolitana de Porto Alegre": {
    resumo:
      "A região metropolitana tem a maior densidade de empresas do estado e, com ela, a maior concorrência por atenção. É onde o comprador já recebeu proposta de agência, já testou plataforma pronta e já se decepcionou com alguma das duas. Aqui a conversa raramente começa em 'preciso de um site' — começa em 'preciso que isso pare de me custar tempo'.",
    atendimento:
      "Atendimento remoto, que é o padrão da região: a maior parte dos projetos que atendo aqui roda inteiramente por call e demo semanal, sem perda de ritmo.",
  },
  "Centro Oriental Rio-grandense": {
    resumo:
      "O Centro Oriental tem uma economia puxada por agroindústria e pelo comércio que atende um raio amplo de municípios menores. A empresa típica atende várias cidades a partir de uma sede só, o que coloca logística e atendimento distribuído no centro do problema — e é aí que planilha compartilhada começa a falhar.",
    atendimento: "Atendimento remoto, com visita combinada quando o projeto envolve operação em campo.",
  },
  "Centro Ocidental Rio-grandense": {
    resumo:
      "Região de economia agrícola e serviços de apoio, com empresas que operam em rede entre municípios vizinhos. O gargalo recorrente é coordenação: quem está onde, o que foi entregue, o que ainda falta. Problema de informação distribuída, não de volume.",
    atendimento: "Atendimento remoto, com visita combinada para levantamento de operação.",
  },
  "Sudoeste Rio-grandense": {
    resumo:
      "A Campanha tem distâncias longas e empresas que atendem áreas extensas com equipe pequena. Isso torna conectividade instável um requisito de projeto, não um detalhe: sistema que exige internet no momento da operação simplesmente não é usado, e a equipe volta para o papel.",
    atendimento: "Atendimento remoto. Projetos daqui costumam exigir funcionamento offline — e isso entra no escopo desde o início.",
  },
  "Sudeste Rio-grandense": {
    resumo:
      "O Sudeste reúne polo universitário, agroindústria e comércio regional. A presença de universidade muda o perfil: há mais empresa nascida de pesquisa e mais comprador que entende a diferença entre sistema sob medida e plataforma pronta — a conversa técnica começa mais adiantada.",
    atendimento: "Atendimento remoto, com visita combinada nas etapas de levantamento e entrega.",
  },
};

/* --------------------------------- recomendação derivada do perfil da cidade */

/** Liga seção CNAE aos setores que já têm página própria. */
const SECAO_PARA_SETOR: Record<string, string[]> = {
  "Alojamento e alimentação": ["restaurantes-e-bares"],
  "Saúde e serviços sociais": ["clinicas-e-consultorios", "clinicas-veterinarias"],
  "Transporte e armazenagem": ["transportadoras"],
  "Atividades imobiliárias": ["imobiliarias"],
  "Atividades profissionais e técnicas": [
    "escritorios-de-contabilidade",
    "escritorios-de-advocacia",
    "empresas-de-engenharia",
  ],
  "Comércio e reparação de veículos": ["oficinas-mecanicas"],
  "Outros serviços": ["saloes-de-beleza"],
  "Artes, cultura e esporte": ["academias", "produtoras-de-eventos"],
};

export interface SetorAnalisado extends SetorCidade {
  pctCidade: number;
  pctUf: number | null;
  razao: number | null;
}

export interface PaginaCidade {
  slug: string;
  url: string;
  title: string;
  metaDescription: string;
  h1: string;
  cidade: CidadeBruta;
  /** posição da cidade entre as carregadas, por nº de empresas */
  posicaoUf: number;
  totalCarregadas: number;
  setores: SetorAnalisado[];
  /** setor mais atípico frente ao estado — é ele que molda o conteúdo */
  vocacao: SetorAnalisado | null;
  /** páginas de setor recomendadas, derivadas do perfil real */
  setoresRecomendados: Array<{ slug: string; nome: string }>;
  regiao: ContextoRegiao;
  presencial: boolean;
  preco: {
    site: string;
    sistema: string;
    atualizadoEm: string;
    atualizadoEmISO: string;
    fonte: string;
  };
  faqs: FAQ[];
  gate: ResultadoGate;
}


/** Limite da meta description: o validador reprova fora de 70-185 chars. */
const DESC_MAX = 180;

function montarDescricao(
  bruta: CidadeBruta,
  vocacao: SetorAnalisado | null,
  precoSite: string
): string {
  const n = bruta.empresas.toLocaleString("pt-BR");
  const ano = fonteCidades.anoReferencia;

  const completa = vocacao
    ? `${n} empresas em ${bruta.nome}/RS (IBGE ${ano}). ${vocacao.nome} pesa ${vocacao.razao}x a média do estado. Veja que sistema se paga aqui e a faixa de ${precoSite}.`
    : `${n} empresas em ${bruta.nome}/RS (IBGE ${ano}). Veja o perfil setorial da cidade, que sistema faz sentido aqui e a faixa de ${precoSite} para site institucional.`;
  if (completa.length <= DESC_MAX) return completa;

  const media = vocacao
    ? `${n} empresas em ${bruta.nome}/RS (IBGE ${ano}). ${vocacao.nome} pesa ${vocacao.razao}x a média do RS. Veja que sistema se paga aqui.`
    : `${n} empresas em ${bruta.nome}/RS (IBGE ${ano}). Perfil setorial da cidade e a faixa de preço de site e sistema sob medida.`;
  if (media.length <= DESC_MAX) return media;

  return `${n} empresas em ${bruta.nome}/RS (IBGE ${ano}). Perfil setorial da cidade e faixa de preço de site e sistema sob medida.`;
}

function faixa(variante: "site" | "app", tipoId: string, volumeId: string): string {
  const config = getConfig(variante);
  const e = calcularEstimativa(config, {
    tipoId,
    volumeId,
    integracaoIds: [],
    prazoId: "padrao",
  });
  return `${formatBRL(e.min)} a ${formatBRL(e.max)}`;
}

const nomeSetorPorSlug = new Map(setoresConteudo.map((s) => [s.slug, s.nome]));

function montar(bruta: CidadeBruta, posicao: number, total: number): PaginaCidade {
  const reprovacoes: string[] = [];

  const setores: SetorAnalisado[] = bruta.setores.map((s) => {
    const pctCidade = (s.empresas / bruta.empresas) * 100;
    const pctUf = mediaUf.get(s.nome) ?? null;
    return {
      ...s,
      pctCidade: Number(pctCidade.toFixed(1)),
      pctUf,
      razao: pctUf && pctUf > 0 ? Number((pctCidade / pctUf).toFixed(2)) : null,
    };
  });

  const atipicos = setores
    .filter((s) => s.razao !== null && s.razao >= GATE_CIDADE.minRazaoAtipica)
    .sort((a, b) => (b.razao ?? 0) - (a.razao ?? 0));
  const vocacao = atipicos[0] ?? null;

  if (bruta.empresas < GATE_CIDADE.minEmpresas)
    reprovacoes.push(`abaixo do mínimo de empresas (${bruta.empresas})`);
  if (setores.length < GATE_CIDADE.minSetores)
    reprovacoes.push(`composição setorial incompleta (${setores.length})`);
  if (!vocacao)
    reprovacoes.push("nenhum setor atípico frente ao estado — página não teria o que dizer");
  if (!REGIOES[bruta.mesorregiao])
    reprovacoes.push(`sem contexto para a mesorregião "${bruta.mesorregiao}"`);

  const recomendados = vocacao
    ? (SECAO_PARA_SETOR[vocacao.nome] ?? [])
        .map((slug) => ({ slug, nome: nomeSetorPorSlug.get(slug) ?? slug }))
        .filter((r) => nomeSetorPorSlug.has(r.slug))
    : [];

  const presencial = bruta.mesorregiao === MESO_BASE;
  const configSite = getConfig("site");
  const precoSite = faixa("site", "institucional", "6-10");
  const precoSistema = faixa("app", "mvp-saas", "13-25");

  const faqs: FAQ[] = [
    {
      q: `Quantas empresas existem em ${bruta.nome}?`,
      a: `Segundo o Cadastro Central de Empresas do IBGE, ano de referência ${fonteCidades.anoReferencia}, ${bruta.nome} tem ${bruta.empresas.toLocaleString("pt-BR")} empresas e outras organizações ativas${bruta.pessoalOcupado ? `, que ocupam ${bruta.pessoalOcupado.toLocaleString("pt-BR")} pessoas` : ""}. Isso coloca a cidade na ${posicao}ª posição entre os ${total} municípios gaúchos com porte suficiente para sustentar análise própria neste levantamento.`,
    },
    {
      q: `O preço de um site muda por eu estar em ${bruta.nome}?`,
      a: `Não. O trabalho é entregue remotamente e a faixa é a mesma de qualquer lugar do estado: site institucional entre ${precoSite}. O que muda por cidade é o tipo de sistema que faz sentido — e isso vem do perfil econômico dela, não do CEP. Prefiro dizer isso de forma direta a cobrar diferente por localização.`,
    },
    {
      q: `Que tipo de sistema faz mais sentido para empresas de ${bruta.nome}?`,
      a: vocacao
        ? `O perfil da cidade aponta um caminho: ${vocacao.nome.toLowerCase()} responde por ${vocacao.pctCidade}% das empresas locais, contra ${vocacao.pctUf}% na média do Rio Grande do Sul — uma concentração ${vocacao.razao}x maior. Setor concentrado significa problema repetido, e problema repetido é o que mais se paga em sistema sob medida.`
        : `O perfil de ${bruta.nome} acompanha de perto a média do estado, sem um setor dominante. Nesse caso o critério deixa de ser o setor e passa a ser o gargalo: onde a planilha já não dá conta.`,
    },
    {
      q: presencial
        ? `Você atende presencialmente em ${bruta.nome}?`
        : `Como funciona o atendimento à distância para ${bruta.nome}?`,
      a: presencial
        ? `Sim. ${bruta.nome} está na mesma região de ${CIDADE_BASE}, onde fica minha base, então reunião presencial é possível e costuma valer a pena no levantamento — ver o processo rodando no seu escritório explica em uma hora o que três calls não explicam. O desenvolvimento em si segue remoto, com demo semanal.`
        : `Por call, com demo funcionando toda semana. Você não recebe relatório de progresso: recebe o sistema rodando para clicar. Visita presencial é possível e combinada quando o projeto envolve levantamento de operação em campo.`,
    },
  ];

  return {
    slug: bruta.slug,
    url: `${BASE_URL}/sites-e-sistemas/${bruta.slug}`,
    title: `Criação de Sites e Sistemas em ${bruta.nome} — Preços 2026`,
    metaDescription: montarDescricao(bruta, vocacao, precoSite),
    h1: `Criação de sites e sistemas em ${bruta.nome}`,
    cidade: bruta,
    posicaoUf: posicao,
    totalCarregadas: total,
    setores,
    vocacao,
    setoresRecomendados: recomendados,
    regiao: REGIOES[bruta.mesorregiao] ?? { resumo: "", atendimento: "" },
    presencial,
    preco: {
      site: precoSite,
      sistema: precoSistema,
      atualizadoEm: formatDataCarga(configSite.atualizadoEm),
      atualizadoEmISO: configSite.atualizadoEm,
      fonte: FONTE_PRECIFICACAO,
    },
    faqs,
    gate: {
      aprovado: reprovacoes.length === 0,
      reprovacoes,
      palavras: 0, // este eixo é julgado por completude de dado, não por prosa
    },
  };
}

export const paginasCidade: PaginaCidade[] = (() => {
  const brutas = cempre.cidades as CidadeBruta[];
  const paginas = brutas.map((c, i) => montar(c, i + 1, brutas.length));

  // Unicidade dentro do eixo.
  for (const campo of ["title", "h1", "metaDescription"] as const) {
    const vistos = new Map<string, number>();
    for (const p of paginas) {
      const v = p[campo].trim().toLowerCase();
      vistos.set(v, (vistos.get(v) ?? 0) + 1);
    }
    for (const p of paginas) {
      if ((vistos.get(p[campo].trim().toLowerCase()) ?? 0) > 1) {
        p.gate.reprovacoes.push(`${campo} duplicado dentro do eixo geográfico`);
        p.gate.aprovado = false;
      }
    }
  }

  return paginas;
})();

export const cidadesIndexaveis = paginasCidade.filter((p) => p.gate.aprovado);
export const cidadesReprovadas = paginasCidade.filter((p) => !p.gate.aprovado);

export function getPaginaCidade(slug: string): PaginaCidade | undefined {
  return paginasCidade.find((p) => p.slug === slug);
}

/** Vizinhas da mesma mesorregião — malha interna com sentido geográfico. */
export function cidadesVizinhas(pagina: PaginaCidade): PaginaCidade[] {
  const mesma = cidadesIndexaveis.filter(
    (p) => p.cidade.mesorregiao === pagina.cidade.mesorregiao && p.slug !== pagina.slug
  );
  if (mesma.length >= 4) return mesma.slice(0, 6);
  const outras = cidadesIndexaveis.filter(
    (p) => p.cidade.mesorregiao !== pagina.cidade.mesorregiao && p.slug !== pagina.slug
  );
  return [...mesma, ...outras].slice(0, 6);
}

export function cidadesPorRegiao(): Array<{ regiao: string; cidades: PaginaCidade[] }> {
  const mapa = new Map<string, PaginaCidade[]>();
  for (const p of cidadesIndexaveis) {
    const k = p.cidade.mesorregiao;
    mapa.set(k, [...(mapa.get(k) ?? []), p]);
  }
  return [...mapa.entries()]
    .map(([regiao, cidades]) => ({ regiao, cidades }))
    .sort((a, b) => b.cidades.length - a.cidades.length);
}
