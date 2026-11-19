/**
 * Rastreadores: identificação por user-agent (no proxy, a cada acesso) e
 * validação por IP contra as faixas publicadas pelo próprio provedor (no job
 * diário). User-agent sozinho é falsificável; a coluna `verificado` separa o
 * Googlebot de verdade do impostor.
 */

export type Familia = "busca" | "ia-busca" | "ia-treino" | "outro";

export const BOTS: Array<{ nome: string; padrao: RegExp; familia: Familia; faixas?: string[] }> = [
  { nome: "Googlebot", padrao: /Googlebot|Google-InspectionTool|GoogleOther/i, familia: "busca", faixas: ["https://developers.google.com/static/crawling/ipranges/common-crawlers.json"] },
  { nome: "Bingbot", padrao: /bingbot|BingPreview|adidxbot/i, familia: "busca", faixas: ["https://www.bing.com/toolbox/bingbot.json"] },
  { nome: "OAI-SearchBot", padrao: /OAI-SearchBot/i, familia: "ia-busca", faixas: ["https://openai.com/searchbot.json"] },
  { nome: "ChatGPT-User", padrao: /ChatGPT-User/i, familia: "ia-busca", faixas: ["https://openai.com/chatgpt-user.json"] },
  { nome: "GPTBot", padrao: /GPTBot/i, familia: "ia-treino", faixas: ["https://openai.com/gptbot.json"] },
  { nome: "PerplexityBot", padrao: /PerplexityBot/i, familia: "ia-busca", faixas: ["https://www.perplexity.ai/perplexitybot.json"] },
  { nome: "Perplexity-User", padrao: /Perplexity-User/i, familia: "ia-busca", faixas: ["https://www.perplexity.ai/perplexity-user.json"] },
  { nome: "Claude-SearchBot", padrao: /Claude-SearchBot/i, familia: "ia-busca" },
  { nome: "Claude-User", padrao: /Claude-User/i, familia: "ia-busca" },
  { nome: "ClaudeBot", padrao: /ClaudeBot/i, familia: "ia-treino" },
  { nome: "Applebot", padrao: /Applebot(?!-Extended)/i, familia: "busca" },
  { nome: "Google-Extended", padrao: /Google-Extended/i, familia: "ia-treino" },
  { nome: "Meta-ExternalAgent", padrao: /meta-externalagent/i, familia: "ia-treino" },
  { nome: "CCBot", padrao: /CCBot/i, familia: "ia-treino" },
  { nome: "Bytespider", padrao: /Bytespider/i, familia: "ia-treino" },
  { nome: "DuckDuckBot", padrao: /DuckDuckBot/i, familia: "busca" },
  { nome: "YandexBot", padrao: /YandexBot/i, familia: "busca" },
];

export function identificarBot(ua: string | null): (typeof BOTS)[number] | null {
  if (!ua) return null;
  return BOTS.find((b) => b.padrao.test(ua)) ?? null;
}

/* --------------------------------------------------------- validação de IP */

function ipv4ParaInt(ip: string): number {
  return ip.split(".").reduce((a, o) => (a << 8) + Number(o), 0) >>> 0;
}

function ipv6ParaBig(ip: string): bigint {
  const [cabeca, cauda] = ip.split("::");
  const a = cabeca ? cabeca.split(":") : [];
  const b = cauda !== undefined && cauda ? cauda.split(":") : [];
  const meio = new Array(8 - a.length - b.length).fill("0");
  return [...a, ...(cauda !== undefined ? meio : []), ...b].reduce((acc, h) => (acc << BigInt(16)) + BigInt(parseInt(h || "0", 16)), BigInt(0));
}

export function ipNaFaixa(ip: string, cidr: string): boolean {
  const [rede, bitsStr] = cidr.split("/");
  const bits = Number(bitsStr);
  if (ip.includes(":") !== rede.includes(":")) return false;
  if (!ip.includes(":")) {
    const mascara = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    return (ipv4ParaInt(ip) & mascara) === (ipv4ParaInt(rede) & mascara);
  }
  const mascara = bits === 0 ? BigInt(0) : ((BigInt(1) << BigInt(128)) - BigInt(1)) ^ ((BigInt(1) << BigInt(128 - bits)) - BigInt(1));
  return (ipv6ParaBig(ip) & mascara) === (ipv6ParaBig(rede) & mascara);
}

export async function baixarFaixas(): Promise<Map<string, string[]>> {
  const out = new Map<string, string[]>();
  for (const b of BOTS) {
    if (!b.faixas) continue;
    const cidrs: string[] = [];
    for (const url of b.faixas) {
      try {
        const r = await fetch(url, { signal: AbortSignal.timeout(20_000), headers: { "User-Agent": "Mozilla/5.0 (verificacao-de-rastreadores)" } });
        const j = (await r.json()) as { prefixes?: Array<{ ipv4Prefix?: string; ipv6Prefix?: string }> };
        for (const p of j.prefixes ?? []) cidrs.push((p.ipv4Prefix ?? p.ipv6Prefix)!);
      } catch {
        /* provedor fora: tenta amanhã */
      }
    }
    if (cidrs.length) out.set(b.nome, cidrs);
  }
  return out;
}
