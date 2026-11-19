/**
 * Atribuição de sessão (last-touch) e de primeira visita (first-touch).
 *
 * Grava a PÁGINA DE ENTRADA da sessão, os UTMs e o CANAL dessa entrada. Todo
 * formulário e toda isca anexam esses campos no envio, para que o lead
 * carregue a origem no próprio registro — não só no evento.
 *
 * First-touch entre visitas só existe com consentimento de analytics (fica no
 * localStorage); sem ele, o first-touch é a própria sessão.
 */

import { classificarCanal, type Canal } from "@/lib/seo/taxonomia";
import { temAnalytics } from "@/lib/telemetria/consentimento";

const KEY = "ad_attrib_v1";
const KEY_FT = "ad_ft_v1";
const HOST_PROPRIO = "www.andersdev.com.br";

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
  /** canal da entrada: organico, ia, social, email, pago, referencia, direto */
  canal?: Canal;
  /** host do referrer ou utm_source da entrada */
  origem?: string;
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

function gravarFirstTouch(a: Attribution) {
  if (!temAnalytics()) return;
  try {
    if (!window.localStorage.getItem(KEY_FT)) {
      window.localStorage.setItem(KEY_FT, JSON.stringify({ ...a, sessionId: "" }));
    }
  } catch {
    /* storage bloqueado */
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
  const ref = referrerHost();
  const utmSource = params.get("utm_source") || undefined;
  const utmMedium = params.get("utm_medium") || undefined;
  const attrib: Attribution = {
    landingPage: window.location.pathname + window.location.search,
    sessionId: novoSessionId(),
    utmSource,
    utmMedium,
    utmCampaign: params.get("utm_campaign") || undefined,
    canal: classificarCanal({ referrerHost: ref, utmSource, utmMedium, hostProprio: HOST_PROPRIO }),
    origem: utmSource || ref,
    startedAt: new Date().toISOString(),
  };

  gravarFirstTouch(attrib);
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(attrib));
  } catch {
    // sessionStorage bloqueado (janela anônima, cookies off): seguimos sem
    // persistir — o envio ainda leva a atribuição desta pageview.
  }
  return attrib;
}

/** Atribuição da sessão atual (last-touch). */
export function lerSessao(): Attribution | null {
  return read() || captureAttribution();
}

/** First-touch persistido entre visitas (só com consentimento de analytics). */
export function lerFirstTouch(): Attribution | null {
  if (typeof window === "undefined" || !temAnalytics()) return null;
  try {
    const raw = window.localStorage.getItem(KEY_FT);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {
    return null;
  }
  const atual = read();
  if (atual) gravarFirstTouch(atual);
  return atual;
}

function resumo(x: Attribution | null) {
  return x
    ? {
        canal: x.canal,
        origem: x.origem,
        landingPage: x.landingPage,
        utmSource: x.utmSource,
        utmMedium: x.utmMedium,
        utmCampaign: x.utmCampaign,
        startedAt: x.startedAt,
      }
    : null;
}

/** Campos prontos para anexar ao corpo de um POST de lead. */
export function attributionPayload(): {
  landingPage?: string;
  formPage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  canal?: string;
  atribuicao?: { ft: ReturnType<typeof resumo>; lt: ReturnType<typeof resumo> };
} {
  if (typeof window === "undefined") return {};
  const a = lerSessao();
  const ft = lerFirstTouch() ?? a;
  return {
    landingPage: a?.landingPage,
    formPage: window.location.pathname,
    utmSource: a?.utmSource,
    utmMedium: a?.utmMedium,
    utmCampaign: a?.utmCampaign,
    canal: a?.canal,
    atribuicao: { ft: resumo(ft), lt: resumo(a) },
  };
}

export function tipoDispositivo(): "mobile" | "desktop" {
  return window.matchMedia?.("(max-width: 767px)").matches ? "mobile" : "desktop";
}

/**
 * Envia um evento para a coleta própria. Nunca lança e nunca bloqueia a
 * navegação: falha de medição não pode atrapalhar quem está lendo.
 */
export function enviarTrack(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const a = lerSessao();
  if (!a) return;

  const corpo = JSON.stringify({ ...payload, sessionId: a.sessionId });

  try {
    // sendBeacon sobrevive à navegação; fetch é o plano B.
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon("/api/track", new Blob([corpo], { type: "application/json" }));
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
  const a = lerSessao();
  const ctx = document.querySelector<HTMLElement>("[data-page-type]")?.dataset;
  enviarTrack({
    tipo: "pageview",
    path,
    landingPage: a?.landingPage,
    referrerHost: referrerHost(),
    utmSource: a?.utmSource,
    utmMedium: a?.utmMedium,
    utmCampaign: a?.utmCampaign,
    canal: a?.canal,
    pageType: ctx?.pageType,
    cluster: ctx?.cluster,
    device: tipoDispositivo(),
  });
}
