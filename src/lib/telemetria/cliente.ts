/**
 * Adaptador de telemetria do navegador.
 *
 * Um evento sai daqui para até três destinos:
 *   1. /api/track → tabela `eventos` (sempre; sem PII; é a cópia de referência)
 *   2. GA4 (gtag) — só com consentimento de analytics
 *   3. PostHog — só com consentimento de analytics e chave configurada
 *
 * Contexto obrigatório (page_type, cluster, consulta_alvo, isca_id) vem do
 * <main data-page-type ...> da página, então nenhum componente precisa
 * repassar isso à mão.
 */

import { temAnalytics } from "./consentimento";
import type { NomeEvento } from "./eventos";
import { lerFirstTouch, lerSessao, tipoDispositivo } from "@/lib/attribution";

type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    posthog?: { capture: (nome: string, props?: Record<string, unknown>) => void };
  }
}

export interface ContextoPagina {
  page_type: string | null;
  cluster: string | null;
  consulta_alvo: string | null;
  isca_id: string | null;
}

export function contextoDaPagina(): ContextoPagina {
  if (typeof document === "undefined") return { page_type: null, cluster: null, consulta_alvo: null, isca_id: null };
  const el = document.querySelector<HTMLElement>("[data-page-type]");
  const d = el?.dataset ?? {};
  return {
    page_type: d.pageType ?? null,
    cluster: d.cluster ?? null,
    consulta_alvo: d.consulta ?? null,
    isca_id: d.isca ?? null,
  };
}

export function rastrear(nome: NomeEvento, props: Props = {}): void {
  if (typeof window === "undefined") return;
  const ctx = contextoDaPagina();
  const isca = (props.isca_id as string | undefined) ?? ctx.isca_id;
  const contexto = { ...ctx, isca_id: isca ?? null };
  const lt = lerSessao();
  const ft = lerFirstTouch() ?? lt;

  const corpo = {
    tipo: "evento",
    nome,
    path: window.location.pathname,
    pageType: contexto.page_type,
    cluster: contexto.cluster,
    consultaAlvo: contexto.consulta_alvo,
    iscaId: contexto.isca_id,
    props: Object.fromEntries(Object.entries(props).filter(([k]) => k !== "isca_id")),
    sessionId: lt?.sessionId,
    device: tipoDispositivo(),
    lt: lt
      ? { canal: lt.canal, origem: lt.origem, landing: lt.landingPage, utmSource: lt.utmSource, utmMedium: lt.utmMedium, utmCampaign: lt.utmCampaign }
      : null,
    ft: ft
      ? { canal: ft.canal, origem: ft.origem, landing: ft.landingPage, utmSource: ft.utmSource, utmMedium: ft.utmMedium, utmCampaign: ft.utmCampaign, em: ft.startedAt }
      : null,
  };
  if (!corpo.sessionId) return;

  try {
    const json = JSON.stringify(corpo);
    if (!navigator.sendBeacon?.("/api/track", new Blob([json], { type: "application/json" }))) {
      void fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: json, keepalive: true }).catch(() => {});
    }
  } catch {
    /* medição nunca quebra a página */
  }

  if (!temAnalytics()) return;
  const paraTerceiros: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries({ ...props, ...contexto })) if (v !== null && v !== undefined) paraTerceiros[k] = v;
  try {
    if (typeof window.gtag === "function") window.gtag("event", nome, paraTerceiros);
  } catch {}
  try {
    window.posthog?.capture(nome, paraTerceiros);
  } catch {}
}
