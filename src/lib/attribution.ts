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

/**
 * Identificador de sessão: aleatório, sem vínculo com pessoa, sem persistir
 * entre visitas. Serve só para costurar os eventos de uma mesma visita.
 */
function novoSessionId(): string {
  try {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return `f${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  }
}

export interface Attribution {
  landingPage: string;
  /** aleatório, por aba. Não identifica pessoa e morre com a sessão. */
  sessionId: string;
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
    sessionId: novoSessionId(),
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


/** Host do referrer apenas — o caminho completo pode carregar dado de terceiro. */
function referrerHost(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const u = new URL(document.referrer);
    if (u.hostname === window.location.hostname) return undefined;
    return u.hostname;
  } catch {
    return undefined;
  }
}

function tipoDispositivo(): "mobile" | "desktop" {
  return window.matchMedia?.("(max-width: 767px)").matches ? "mobile" : "desktop";
}

/**
 * Envia um evento para a coleta própria. Nunca lança e nunca bloqueia a
 * navegação: falha de medição não pode atrapalhar quem está lendo.
 */
export function enviarTrack(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const a = read() || captureAttribution();
  if (!a) return;

  const corpo = JSON.stringify({ ...payload, sessionId: a.sessionId });

  try {
    // sendBeacon sobrevive à navegação; fetch é o plano B.
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon(
        "/api/track",
        new Blob([corpo], { type: "application/json" })
      );
      if (ok) return;
    }
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: corpo,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* medição nunca quebra a página */
  }
}

/** Pageview da rota atual. */
export function enviarPageview(path: string): void {
  if (typeof window === "undefined") return;
  const a = read() || captureAttribution();
  enviarTrack({
    tipo: "pageview",
    path,
    landingPage: a?.landingPage,
    referrerHost: referrerHost(),
    utmSource: a?.utmSource,
    utmMedium: a?.utmMedium,
    utmCampaign: a?.utmCampaign,
    device: tipoDispositivo(),
  });
}
