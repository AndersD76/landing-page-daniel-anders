/**
 * Google: Search Console (desempenho, inspeção de URL, sitemaps) e GA4 Data API.
 *
 * Autenticação por conta de serviço (JWT RS256 assinado aqui, sem SDK):
 *   GOOGLE_SERVICE_ACCOUNT_JSON  — o JSON da chave (cru ou em base64)
 *   GSC_SITE_URL                 — ex.: "sc-domain:andersdev.com.br"
 *   GA4_PROPERTY_ID              — só o número da propriedade
 * A conta de serviço precisa ser adicionada como usuário na propriedade do
 * Search Console e como Leitor na propriedade do GA4.
 *
 * Endpoints (documentação oficial):
 *   searchAnalytics.query  https://developers.google.com/webmaster-tools/v1/searchanalytics/query
 *   urlInspection.index    https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect
 *   sitemaps.submit        https://developers.google.com/webmaster-tools/v1/sitemaps/submit
 *   GA4 runReport          https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport
 */

import { createSign } from "node:crypto";

interface ContaServico {
  client_email: string;
  private_key: string;
}

function conta(): ContaServico | null {
  const bruto = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!bruto) return null;
  try {
    const json = bruto.trim().startsWith("{") ? bruto : Buffer.from(bruto, "base64").toString("utf8");
    return JSON.parse(json) as ContaServico;
  } catch {
    return null;
  }
}

export function temGoogle(): boolean {
  return !!conta();
}

export const GSC_SITE = process.env.GSC_SITE_URL || "sc-domain:andersdev.com.br";

const b64url = (b: Buffer | string) => Buffer.from(b).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

const tokens = new Map<string, { token: string; expira: number }>();

async function token(escopo: string): Promise<string> {
  const c = conta();
  if (!c) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON não configurada");
  const cache = tokens.get(escopo);
  if (cache && cache.expira > Date.now() + 60_000) return cache.token;
  const agora = Math.floor(Date.now() / 1000);
  const cab = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const corpo = b64url(JSON.stringify({ iss: c.client_email, scope: escopo, aud: "https://oauth2.googleapis.com/token", iat: agora, exp: agora + 3600 }));
  const ass = createSign("RSA-SHA256").update(`${cab}.${corpo}`).sign(c.private_key);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${cab}.${corpo}.${b64url(ass)}` }),
  });
  const j = (await res.json()) as { access_token?: string; expires_in?: number; error_description?: string };
  if (!j.access_token) throw new Error(`token Google: ${j.error_description ?? res.status}`);
  tokens.set(escopo, { token: j.access_token, expira: Date.now() + (j.expires_in ?? 3600) * 1000 });
  return j.access_token;
}

async function chamar<T>(url: string, escopo: string, init: RequestInit = {}): Promise<T> {
  const t = await token(escopo);
  const res = await fetch(url, { ...init, headers: { ...(init.headers ?? {}), Authorization: `Bearer ${t}`, "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(`${url.split("?")[0]} → HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const texto = await res.text();
  return (texto ? JSON.parse(texto) : {}) as T;
}

const GSC_RO = "https://www.googleapis.com/auth/webmasters.readonly";
const GSC_RW = "https://www.googleapis.com/auth/webmasters";
const GA_RO = "https://www.googleapis.com/auth/analytics.readonly";

export interface LinhaGsc {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/** Desempenho por data × página × consulta × dispositivo, paginado. */
export async function gscDesempenho(inicio: string, fim: string): Promise<LinhaGsc[]> {
  const out: LinhaGsc[] = [];
  for (let startRow = 0; startRow < 200_000; startRow += 25_000) {
    const r = await chamar<{ rows?: LinhaGsc[] }>(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`,
      GSC_RO,
      {
        method: "POST",
        body: JSON.stringify({ startDate: inicio, endDate: fim, dimensions: ["date", "page", "query", "device"], rowLimit: 25_000, startRow, dataState: "final" }),
      }
    );
    out.push(...(r.rows ?? []));
    if ((r.rows ?? []).length < 25_000) break;
  }
  return out;
}

export interface Inspecao {
  verdict?: string;
  coverageState?: string;
  lastCrawlTime?: string;
  indexingState?: string;
}

export async function gscInspecionar(url: string): Promise<Inspecao> {
  const r = await chamar<{ inspectionResult?: { indexStatusResult?: Inspecao } }>(
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    GSC_RO,
    { method: "POST", body: JSON.stringify({ inspectionUrl: url, siteUrl: GSC_SITE, languageCode: "pt-BR" }) }
  );
  return r.inspectionResult?.indexStatusResult ?? {};
}

export async function gscEnviarSitemap(sitemapUrl: string): Promise<void> {
  await chamar(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    GSC_RW,
    { method: "PUT" }
  );
}

export interface LinhaGa4 {
  data: string;
  pagina: string;
  canal: string;
  sessoes: number;
  usuarios: number;
  eventosChave: number;
}

export async function ga4Diario(inicio: string, fim: string): Promise<LinhaGa4[]> {
  const prop = process.env.GA4_PROPERTY_ID;
  if (!prop) throw new Error("GA4_PROPERTY_ID não configurada");
  const r = await chamar<{ rows?: Array<{ dimensionValues: Array<{ value: string }>; metricValues: Array<{ value: string }> }> }>(
    `https://analyticsdata.googleapis.com/v1beta/properties/${prop}:runReport`,
    GA_RO,
    {
      method: "POST",
      body: JSON.stringify({
        dateRanges: [{ startDate: inicio, endDate: fim }],
        dimensions: [{ name: "date" }, { name: "landingPage" }, { name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }, { name: "totalUsers" }, { name: "keyEvents" }],
        limit: 100000,
      }),
    }
  );
  return (r.rows ?? []).map((x) => {
    const d = x.dimensionValues[0].value;
    return {
      data: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`,
      pagina: x.dimensionValues[1].value.slice(0, 500),
      canal: x.dimensionValues[2].value.slice(0, 60),
      sessoes: Number(x.metricValues[0].value),
      usuarios: Number(x.metricValues[1].value),
      eventosChave: Math.round(Number(x.metricValues[2].value)),
    };
  });
}
