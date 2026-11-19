/**
 * Registro das iscas (lead magnets).
 *
 * Regra de toda isca: parte do resultado aparece na tela SEM cadastro; o
 * resultado completo vai por e-mail; a URL é própria e compartilhável; e o
 * momento do resultado tem CTA para o serviço. Opt-in de marketing é um
 * checkbox separado e desmarcado — receber o resultado não inscreve ninguém
 * em sequência.
 */

import type { ClusterId, IscaId } from "@/lib/seo/taxonomia";

export interface Isca {
  id: IscaId;
  nome: string;
  /** chamada curta para o card contextual */
  chamada: string;
  /** o que a pessoa leva — aparece no card e no e-mail */
  entrega: string;
  href: string;
  /** rótulo do botão do card */
  botao: string;
  clusters: ClusterId[];
  /** "ferramenta" roda na página; "download" entrega arquivo; "curso" é sequência */
  formato: "calculadora" | "diagnostico" | "checklist" | "gerador" | "download" | "curso";
}

export const ISCAS: Isca[] = [
  {
    id: "calculadora-site",
    nome: "Calculadora de custo de site",
    chamada: "Quanto custa o seu site, com o escopo que você precisa?",
    entrega: "Faixa de preço na tela e escopo detalhado por e-mail",
    href: "/calculadora-site",
    botao: "Calcular agora",
    clusters: ["custo-projeto", "sites", "ecommerce"],
    formato: "calculadora",
  },
  {
    id: "calculadora-app",
    nome: "Calculadora de custo de app",
    chamada: "Quanto custa o seu app ou sistema web?",
    entrega: "Faixa de preço na tela e escopo detalhado por e-mail",
    href: "/calculadora-app",
    botao: "Calcular agora",
    clusters: ["custo-projeto", "aplicativos", "sistemas-gestao"],
    formato: "calculadora",
  },
  {
    id: "diagnostico-site",
    nome: "Diagnóstico gratuito de site",
    chamada: "Seu site está pronto para aparecer no Google?",
    entrega: "Nota de 0 a 100 na tela e relatório completo por e-mail",
    href: "/ferramentas/diagnostico-de-site",
    botao: "Diagnosticar meu site",
    clusters: ["seo-google", "sites", "lgpd-legal"],
    formato: "diagnostico",
  },
  {
    id: "custo-da-planilha",
    nome: "Calculadora do custo da planilha",
    chamada: "Quanto o processo manual custa por ano — e em quantos meses um sistema se paga?",
    entrega: "Custo anual e prazo de retorno na tela; projeção de 12 meses por e-mail",
    href: "/ferramentas/custo-da-planilha",
    botao: "Calcular o custo",
    clusters: ["sistemas-gestao", "automacao-integracao"],
    formato: "calculadora",
  },
  {
    id: "checklist-lancamento-site",
    nome: "Checklist de lançamento de site",
    chamada: "O site está pronto para ir ao ar? 30 itens em 5 minutos.",
    entrega: "Pontuação na tela e lista do que falta, com explicação, por e-mail",
    href: "/ferramentas/checklist-lancamento-de-site",
    botao: "Fazer o checklist",
    clusters: ["sites", "seo-google"],
    formato: "checklist",
  },
  {
    id: "checklist-lgpd-site",
    nome: "Checklist LGPD para site e sistema",
    chamada: "Seu site cumpre a LGPD? Confira em 20 perguntas.",
    entrega: "Pontuação na tela e plano de adequação por e-mail",
    href: "/ferramentas/checklist-lgpd",
    botao: "Conferir agora",
    clusters: ["lgpd-legal", "ecommerce"],
    formato: "checklist",
  },
  {
    id: "gerador-briefing-site",
    nome: "Gerador de briefing de site",
    chamada: "Monte o briefing do seu site em 10 minutos e receba orçamentos comparáveis.",
    entrega: "Resumo na tela e briefing completo por e-mail, pronto para enviar a fornecedores",
    href: "/ferramentas/gerador-de-briefing",
    botao: "Montar meu briefing",
    clusters: ["contratacao-projeto", "sites"],
    formato: "gerador",
  },
  {
    id: "escopo-mvp",
    nome: "Priorizador de escopo de MVP",
    chamada: "Liste as funções e descubra o que entra na primeira versão.",
    entrega: "Corte do MVP e prazo estimado na tela; escopo priorizado por e-mail",
    href: "/ferramentas/escopo-de-mvp",
    botao: "Priorizar funções",
    clusters: ["contratacao-projeto", "aplicativos"],
    formato: "gerador",
  },
  {
    id: "taxa-marketplace",
    nome: "Calculadora de taxa de marketplace",
    chamada: "Quanto a comissão do marketplace leva por ano — e quando um canal próprio se paga?",
    entrega: "Comissão anual e ponto de virada na tela; simulação por e-mail",
    href: "/ferramentas/taxa-de-marketplace",
    botao: "Simular",
    clusters: ["ecommerce", "aplicativos"],
    formato: "calculadora",
  },
  {
    id: "mini-curso-sistema",
    nome: "Mini-curso: da planilha ao sistema em 5 e-mails",
    chamada: "Cinco e-mails curtos para tirar a operação da planilha sem jogar dinheiro fora.",
    entrega: "1 e-mail a cada 2 dias, com exercício prático",
    href: "/ferramentas/mini-curso-da-planilha-ao-sistema",
    botao: "Quero o mini-curso",
    clusters: ["sistemas-gestao", "automacao-integracao"],
    formato: "curso",
  },
  {
    id: "spec-app-startup",
    nome: "Template de especificação de app",
    chamada: "Especifique o app antes de pedir orçamento.",
    entrega: "Template em PDF por e-mail",
    href: "/recursos/spec-app-startup",
    botao: "Baixar template",
    clusters: ["aplicativos", "contratacao-projeto"],
    formato: "download",
  },
  {
    id: "modelo-download",
    nome: "Modelo pronto para baixar",
    chamada: "Baixe este modelo pronto para usar.",
    entrega: "Arquivo editável por e-mail",
    href: "/modelos",
    botao: "Baixar o modelo",
    clusters: [],
    formato: "download",
  },
];

export const ISCA_POR_ID = Object.fromEntries(ISCAS.map((i) => [i.id, i])) as Record<IscaId, Isca>;

export function getIsca(id: string | undefined | null): Isca | undefined {
  return id ? ISCA_POR_ID[id as IscaId] : undefined;
}
