/**
 * Integrações externas sem SDK: Bing Webmaster, IndexNow e SERP.
 *
 *   BING_WEBMASTER_API_KEY  — Bing Webmaster Tools > Configurações > Acesso à API
 *   SERPAPI_KEY             — opcional, checagem semanal da SERP (serpapi.com)
 *
 * Documentação: Bing Webmaster API https://learn.microsoft.com/en-us/bingwebmaster/
 *               IndexNow https://www.indexnow.org/documentation
 */

export const HOST = "www.andersdev.com.br";
export const INDEXNOW_KEY = "db16d61e067044d48b75f2edbbe3fd1a";

export function temBing(): boolean {
  return !!process.env.BING_WEBMASTER_API_KEY;
}

function dataBing(v: string): string {
  const ms = Number(/\/Date\((\d+)/.exec(v)?.[1] ?? 0);
  return new Date(ms).toISOString().slice(0, 10);
}

export interface LinhaBing {
  data: string;
  pagina: string;
  consulta: string;
  cliques: number;
  impressoes: number;
  posicao: number | null;
}

async function bing<T>(metodo: string): Promise<T> {
  const url = `https://ssl.bing.com/webmaster/api.svc/json/${metodo}?siteUrl=${encodeURIComponent(`https://${HOST}/`)}&apikey=${process.env.BING_WEBMASTER_API_KEY}`;
  const r = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!r.ok) throw new Error(`Bing ${metodo}: HTTP ${r.status}`);
  return ((await r.json()) as { d: T }).d;
}

export async function bingConsultas(): Promise<LinhaBing[]> {
  const d = await bing<Array<{ Date: string; Query: string; Clicks: number; Impressions: number; AvgImpressionPosition: number }>>("GetQueryStats");
  return d.map((x) => ({ data: dataBing(x.Date), pagina: "", consulta: x.Query.slice(0, 300), cliques: x.Clicks, impressoes: x.Impressions, posicao: x.AvgImpressionPosition ?? null }));
}

export async function bingPaginas(): Promise<LinhaBing[]> {
  const d = await bing<Array<{ Date: string; Query: string; Clicks: number; Impressions: number; AvgImpressionPosition: number }>>("GetPageStats");
  return d.map((x) => ({ data: dataBing(x.Date), pagina: x.Query.slice(0, 500), consulta: "", cliques: x.Clicks, impressoes: x.Impressions, posicao: x.AvgImpressionPosition ?? null }));
}

/** IndexNow aceita até 10.000 URLs por chamada. */
export async function avisarIndexNow(urls: string[]): Promise<number> {
  let aceitas = 0;
  for (let i = 0; i < urls.length; i += 10_000) {
    const lote = urls.slice(i, i + 10_000);
    const r = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`, urlList: lote }),
    });
    if (r.status !== 200 && r.status !== 202) throw new Error(`IndexNow HTTP ${r.status}`);
    aceitas += lote.length;
  }
  return aceitas;
}

export interface Serp {
  top3: Array<{ posicao: number; url: string; titulo: string }>;
  recursos: string[];
  aiOverview: boolean;
  citados: string[];
  nossaPosicao: number | null;
  citadoNoAiOverview: boolean;
}

export function temSerp(): boolean {
  return !!process.env.SERPAPI_KEY;
}

/** Uma consulta à SERP do Google Brasil via SerpApi (sem raspagem direta do Google). */
export async function checarSerp(consulta: string): Promise<Serp> {
  const u = new URL("https://serpapi.com/search.json");
  u.search = new URLSearchParams({ engine: "google", q: consulta, gl: "br", hl: "pt-br", google_domain: "google.com.br", num: "20", api_key: process.env.SERPAPI_KEY! }).toString();
  const r = await fetch(u, { signal: AbortSignal.timeout(60_000) });
  if (!r.ok) throw new Error(`SerpApi HTTP ${r.status}`);
  const j = (await r.json()) as Record<string, unknown> & {
    organic_results?: Array<{ position: number; link: string; title: string }>;
    ai_overview?: { references?: Array<{ link?: string }> };
  };
  const organicos = j.organic_results ?? [];
  const citados = (j.ai_overview?.references ?? []).map((x) => x.link ?? "").filter(Boolean);
  const nossa = organicos.find((o) => o.link.includes(HOST.replace("www.", "")));
  return {
    top3: organicos.slice(0, 3).map((o) => ({ posicao: o.position, url: o.link, titulo: o.title })),
    recursos: Object.keys(j).filter((k) => /(answer_box|knowledge_graph|related_questions|local_results|ai_overview|top_stories|inline_videos|shopping_results)/.test(k)),
    aiOverview: !!j.ai_overview,
    citados,
    nossaPosicao: nossa?.position ?? null,
    citadoNoAiOverview: citados.some((c) => c.includes(HOST.replace("www.", ""))),
  };
}
