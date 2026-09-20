/**
 * Atribuição de sessão.
 *
 * Grava a PÁGINA DE ENTRADA da sessão (a primeira que o visitante abriu) e os
 * UTMs dessa entrada. Todo formulário anexa esses campos no envio, para que o
 * lead carregue a origem no próprio registro — não só no evento.
 *
 * Sem isso não dá para saber qual página gera dinheiro.
 */

const KEY = "ad_attrib_v1";

export interface Attribution {
  landingPage: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  startedAt: string;
}

function read(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

/**
 * Chamada uma vez por sessão, no primeiro carregamento. Não sobrescreve:
 * a página de entrada é a primeira, não a última.
 */
export function captureAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  const existing = read();
  if (existing) return existing;

  const params = new URLSearchParams(window.location.search);
  const attrib: Attribution = {
    landingPage: window.location.pathname + window.location.search,
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    startedAt: new Date().toISOString(),
  };

  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(attrib));
  } catch {
    // sessionStorage bloqueado (janela anônima, cookies off): seguimos sem
    // persistir — o envio ainda leva a atribuição desta pageview.
  }
  return attrib;
}

/** Campos prontos para anexar ao corpo de um POST de lead. */
export function attributionPayload(): {
  landingPage?: string;
  formPage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
} {
  if (typeof window === "undefined") return {};
  const a = read() || captureAttribution();
  return {
    landingPage: a?.landingPage,
    formPage: window.location.pathname,
    utmSource: a?.utmSource,
    utmMedium: a?.utmMedium,
    utmCampaign: a?.utmCampaign,
  };
}
