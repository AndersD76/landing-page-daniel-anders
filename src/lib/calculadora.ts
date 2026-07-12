/**
 * Lógica das calculadoras de custo (/calculadora-site e /calculadora-app).
 * Pura e sem dependências — usada pelo wizard client-side e testável via node.
 * Faixas de referência: mercado freelancer BR 2026.
 */

export interface OpcaoTipo {
  id: string;
  label: string;
  desc: string;
  min: number;
  max: number;
}

export interface OpcaoMultiplicador {
  id: string;
  label: string;
  mult: number;
}

export interface OpcaoIntegracao {
  id: string;
  label: string;
  pct: number; // percentual sobre a base ajustada (0.15–0.30)
}

export interface CalculadoraConfig {
  slug: "calculadora-site" | "calculadora-app";
  unidadeLabel: string; // pergunta do passo 2
  tipos: OpcaoTipo[];
  volumes: OpcaoMultiplicador[];
  integracoes: OpcaoIntegracao[];
  prazos: OpcaoMultiplicador[];
}

export interface Selecao {
  tipoId: string;
  volumeId: string;
  integracaoIds: string[];
  prazoId: string;
}

export interface LinhaBreakdown {
  label: string;
  min: number;
  max: number;
}

export interface Estimativa {
  min: number;
  max: number;
  breakdown: LinhaBreakdown[];
}

export const configSite: CalculadoraConfig = {
  slug: "calculadora-site",
  unidadeLabel: "Quantas páginas o site vai ter?",
  tipos: [
    {
      id: "landing",
      label: "Landing page / página de vendas",
      desc: "Uma página focada em conversão: captura de leads ou venda direta",
      min: 1500,
      max: 4000,
    },
    {
      id: "institucional",
      label: "Site institucional",
      desc: "Home, sobre, serviços, blog e contato — a presença digital da empresa",
      min: 3000,
      max: 10000,
    },
    {
      id: "ecommerce",
      label: "E-commerce / loja virtual",
      desc: "Catálogo de produtos, carrinho, checkout e gestão de pedidos",
      min: 8000,
      max: 25000,
    },
  ],
  volumes: [
    { id: "ate-5", label: "Até 5 páginas", mult: 1.0 },
    { id: "6-10", label: "6 a 10 páginas", mult: 1.15 },
    { id: "11-20", label: "11 a 20 páginas", mult: 1.3 },
    { id: "20-mais", label: "Mais de 20 páginas", mult: 1.5 },
  ],
  integracoes: [
    {
      id: "pagamento",
      label: "Pagamento online (Pix, cartão, assinatura)",
      pct: 0.2,
    },
    {
      id: "ia",
      label: "IA (chatbot, busca inteligente, conteúdo)",
      pct: 0.25,
    },
    {
      id: "erp-crm",
      label: "ERP / CRM (estoque, notas, funil de vendas)",
      pct: 0.3,
    },
    {
      id: "automacao",
      label: "Automação de marketing (e-mail, WhatsApp)",
      pct: 0.15,
    },
  ],
  prazos: [
    { id: "urgente", label: "Menos de 3 semanas", mult: 1.25 },
    { id: "padrao", label: "1 a 2 meses", mult: 1.0 },
    { id: "flexivel", label: "3 meses ou mais", mult: 0.95 },
  ],
};

export const configApp: CalculadoraConfig = {
  slug: "calculadora-app",
  unidadeLabel: "Quantas telas o app vai ter?",
  tipos: [
    {
      id: "mobile-simples",
      label: "App mobile simples",
      desc: "Poucas telas, sem backend complexo: catálogo, agendamento, fidelidade",
      min: 12000,
      max: 30000,
    },
    {
      id: "mvp-saas",
      label: "MVP SaaS (web app)",
      desc: "Produto web com login, assinatura e o núcleo do negócio funcionando",
      min: 15000,
      max: 40000,
    },
    {
      id: "completo",
      label: "App completo com backend",
      desc: "Mobile + API + painel admin: marketplace, delivery, fintech, logística",
      min: 25000,
      max: 60000,
    },
  ],
  volumes: [
    { id: "ate-5", label: "Até 5 telas", mult: 0.9 },
    { id: "6-12", label: "6 a 12 telas", mult: 1.0 },
    { id: "13-25", label: "13 a 25 telas", mult: 1.2 },
    { id: "25-mais", label: "Mais de 25 telas", mult: 1.45 },
  ],
  integracoes: [
    {
      id: "pagamento",
      label: "Pagamento (Pix, cartão, assinatura, split)",
      pct: 0.2,
    },
    {
      id: "ia",
      label: "IA (chatbot, recomendação, visão computacional)",
      pct: 0.25,
    },
    {
      id: "erp-crm",
      label: "ERP / sistemas internos da empresa",
      pct: 0.3,
    },
    {
      id: "push-whatsapp",
      label: "Notificações push / WhatsApp",
      pct: 0.15,
    },
  ],
  prazos: [
    { id: "urgente", label: "Menos de 6 semanas", mult: 1.25 },
    { id: "padrao", label: "2 a 3 meses", mult: 1.0 },
    { id: "flexivel", label: "4 meses ou mais", mult: 0.95 },
  ],
};

export function getConfig(variante: "site" | "app"): CalculadoraConfig {
  return variante === "site" ? configSite : configApp;
}

function arredondar(valor: number): number {
  return Math.round(valor / 100) * 100;
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function calcularEstimativa(
  config: CalculadoraConfig,
  selecao: Selecao
): Estimativa {
  const tipo = config.tipos.find((t) => t.id === selecao.tipoId);
  const volume = config.volumes.find((v) => v.id === selecao.volumeId);
  const prazo = config.prazos.find((p) => p.id === selecao.prazoId);
  if (!tipo || !volume || !prazo) {
    throw new Error("Seleção inválida na calculadora");
  }

  const breakdown: LinhaBreakdown[] = [];

  // Base do tipo de projeto
  breakdown.push({ label: tipo.label, min: tipo.min, max: tipo.max });

  // Ajuste por volume (nº de telas/páginas)
  const baseMin = tipo.min * volume.mult;
  const baseMax = tipo.max * volume.mult;
  if (volume.mult !== 1.0) {
    breakdown.push({
      label: `Escopo: ${volume.label.toLowerCase()}`,
      min: baseMin - tipo.min,
      max: baseMax - tipo.max,
    });
  }

  // Integrações: percentual sobre a base ajustada
  let integrMin = 0;
  let integrMax = 0;
  for (const id of selecao.integracaoIds) {
    const integ = config.integracoes.find((i) => i.id === id);
    if (!integ) continue;
    const iMin = baseMin * integ.pct;
    const iMax = baseMax * integ.pct;
    integrMin += iMin;
    integrMax += iMax;
    breakdown.push({ label: integ.label, min: iMin, max: iMax });
  }

  // Ajuste de prazo sobre o subtotal
  const subMin = baseMin + integrMin;
  const subMax = baseMax + integrMax;
  const finalMin = subMin * prazo.mult;
  const finalMax = subMax * prazo.mult;
  if (prazo.mult !== 1.0) {
    breakdown.push({
      label:
        prazo.mult > 1
          ? `Prazo apertado (${prazo.label.toLowerCase()})`
          : `Prazo flexível (${prazo.label.toLowerCase()})`,
      min: finalMin - subMin,
      max: finalMax - subMax,
    });
  }

  return {
    min: arredondar(finalMin),
    max: arredondar(finalMax),
    breakdown: breakdown.map((b) => ({
      label: b.label,
      min: arredondar(b.min),
      max: arredondar(b.max),
    })),
  };
}

/** Resumo legível da seleção — vai no campo message do lead. */
export function resumoSelecao(
  config: CalculadoraConfig,
  selecao: Selecao,
  estimativa: Estimativa
): string {
  const tipo = config.tipos.find((t) => t.id === selecao.tipoId);
  const volume = config.volumes.find((v) => v.id === selecao.volumeId);
  const prazo = config.prazos.find((p) => p.id === selecao.prazoId);
  const integs = selecao.integracaoIds
    .map((id) => config.integracoes.find((i) => i.id === id)?.label)
    .filter(Boolean)
    .join(", ");

  return [
    `Calculadora: ${config.slug}`,
    `Tipo: ${tipo?.label}`,
    `Escopo: ${volume?.label}`,
    `Integrações: ${integs || "nenhuma"}`,
    `Prazo: ${prazo?.label}`,
    `Estimativa: ${formatBRL(estimativa.min)} - ${formatBRL(estimativa.max)}`,
  ].join(" | ");
}
