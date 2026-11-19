import { NextRequest, NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { rateLimit, getClientIp } from "@/lib/security";

/**
 * Diagnóstico de site: busca a página informada e confere sinais técnicos
 * básicos de SEO, segurança e LGPD.
 *
 * Proteção contra SSRF: só http/https, portas padrão, nenhum IP privado,
 * loopback, link-local ou de metadados — conferido a cada redirecionamento.
 */

const UA = "Mozilla/5.0 (compatible; AndersDevDiagnostico/1.0; +https://www.andersdev.com.br/ferramentas/diagnostico-de-site)";
const LIMITE_BYTES = 2_000_000;

function ipPrivado(ip: string): boolean {
  if (isIP(ip) === 6) {
    const x = ip.toLowerCase();
    return x === "::1" || x === "::" || x.startsWith("fc") || x.startsWith("fd") || x.startsWith("fe80") || x.startsWith("::ffff:");
  }
  const p = ip.split(".").map(Number);
  return (
    p[0] === 10 ||
    p[0] === 127 ||
    p[0] === 0 ||
    (p[0] === 169 && p[1] === 254) ||
    (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
    (p[0] === 192 && p[1] === 168) ||
    (p[0] === 100 && p[1] >= 64 && p[1] <= 127) ||
    p[0] >= 224
  );
}

async function urlSegura(u: URL): Promise<boolean> {
  if (!["http:", "https:"].includes(u.protocol)) return false;
  if (u.port && !["80", "443"].includes(u.port)) return false;
  if (u.username || u.password) return false;
  const host = u.hostname;
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return false;
  if (isIP(host)) return !ipPrivado(host);
  try {
    const enderecos = await lookup(host, { all: true });
    return enderecos.length > 0 && enderecos.every((a) => !ipPrivado(a.address));
  } catch {
    return false;
  }
}

async function buscar(inicial: URL): Promise<{ url: URL; status: number; html: string; ms: number; headers: Headers } | { erro: string }> {
  let atual = inicial;
  const t0 = Date.now();
  for (let saltos = 0; saltos < 5; saltos++) {
    if (!(await urlSegura(atual))) return { erro: "Endereço não permitido." };
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10_000);
    let res: Response;
    try {
      res = await fetch(atual, { redirect: "manual", signal: ctrl.signal, headers: { "User-Agent": UA, Accept: "text/html" } });
    } catch {
      clearTimeout(timer);
      return { erro: "O site não respondeu em 10 segundos." };
    }
    clearTimeout(timer);
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      atual = new URL(res.headers.get("location")!, atual);
      continue;
    }
    const leitor = res.body?.getReader();
    let recebidos = 0;
    const partes: Uint8Array[] = [];
    if (leitor) {
      for (;;) {
        const { done, value } = await leitor.read();
        if (done) break;
        recebidos += value.length;
        if (recebidos > LIMITE_BYTES) break;
        partes.push(value);
      }
    }
    return { url: atual, status: res.status, html: Buffer.concat(partes).toString("utf8"), ms: Date.now() - t0, headers: res.headers };
  }
  return { erro: "Redirecionamentos demais." };
}

async function existe(u: URL): Promise<boolean> {
  if (!(await urlSegura(u))) return false;
  try {
    const r = await fetch(u, { method: "GET", headers: { "User-Agent": UA }, signal: AbortSignal.timeout(6000) });
    return r.ok;
  } catch {
    return false;
  }
}

interface Checagem {
  id: string;
  titulo: string;
  ok: boolean;
  peso: number;
  detalhe: string;
  comoResolver: string;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`diagnostico:${ip}`, 8, 60 * 60_000)) {
    return NextResponse.json({ erro: "Limite de diagnósticos por hora atingido. Tente mais tarde." }, { status: 429 });
  }
  let alvo: URL;
  try {
    const { url } = (await req.json()) as { url?: string };
    const bruto = (url ?? "").trim();
    alvo = new URL(/^https?:\/\//i.test(bruto) ? bruto : `https://${bruto}`);
  } catch {
    return NextResponse.json({ erro: "Endereço inválido." }, { status: 400 });
  }

  const r = await buscar(alvo);
  if ("erro" in r) return NextResponse.json({ erro: r.erro }, { status: 422 });

  const h = r.html;
  const pegar = (re: RegExp) => h.match(re)?.[1]?.trim() ?? "";
  const title = pegar(/<title[^>]*>([\s\S]*?)<\/title>/i).replace(/\s+/g, " ");
  const desc = pegar(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) || pegar(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const h1s = (h.match(/<h1[\s>]/gi) ?? []).length;
  const viewport = /<meta[^>]+name=["']viewport["']/i.test(h);
  const canonical = /<link[^>]+rel=["']canonical["']/i.test(h);
  const noindex = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(h) || /noindex/i.test(r.headers.get("x-robots-tag") ?? "");
  const lang = /<html[^>]+lang=["'][a-z]/i.test(h);
  const jsonld = /application\/ld\+json/i.test(h);
  const og = /<meta[^>]+property=["']og:title["']/i.test(h);
  const imgs = h.match(/<img\b[^>]*>/gi) ?? [];
  const semAlt = imgs.filter((i) => !/\balt=["'][^"']+["']/i.test(i)).length;
  const privacidade = /privacidade|privacy/i.test(h);
  const kb = Math.round(Buffer.byteLength(h) / 1024);
  const origem = new URL("/", r.url);
  const [robots, sitemap] = await Promise.all([existe(new URL("/robots.txt", origem)), existe(new URL("/sitemap.xml", origem))]);

  const c: Checagem[] = [
    { id: "https", titulo: "HTTPS ativo", ok: r.url.protocol === "https:", peso: 10, detalhe: r.url.protocol === "https:" ? "O site abre em HTTPS." : "O endereço final não usa HTTPS.", comoResolver: "Instale um certificado (Let's Encrypt é gratuito) e redirecione http:// para https://." },
    { id: "status", titulo: "Página responde com sucesso", ok: r.status === 200, peso: 10, detalhe: `Status HTTP ${r.status}.`, comoResolver: "A página inicial precisa responder 200. Erros 4xx/5xx impedem a indexação." },
    { id: "tempo", titulo: "Resposta rápida do servidor", ok: r.ms < 1500, peso: 8, detalhe: `${r.ms} ms até receber a página (medido do nosso servidor).`, comoResolver: "Hospedagem lenta, ausência de cache ou página gerada a cada visita são as causas mais comuns." },
    { id: "peso", titulo: "HTML enxuto", ok: kb < 500, peso: 4, detalhe: `${kb} KB de HTML.`, comoResolver: "HTML muito grande costuma vir de construtores visuais; reduza blocos ocultos e scripts embutidos." },
    { id: "title", titulo: "Título da página adequado", ok: title.length >= 10 && title.length <= 65, peso: 10, detalhe: title ? `"${title.slice(0, 90)}" (${title.length} caracteres).` : "Sem <title>.", comoResolver: "Título único por página, até ~60 caracteres, começando pelo que a pessoa busca." },
    { id: "description", titulo: "Descrição para o Google", ok: desc.length >= 70 && desc.length <= 165, peso: 8, detalhe: desc ? `${desc.length} caracteres.` : "Sem meta description.", comoResolver: "Escreva 1–2 frases (70–155 caracteres) com o benefício e uma chamada. É o texto do resultado de busca." },
    { id: "h1", titulo: "Um título principal (H1)", ok: h1s === 1, peso: 5, detalhe: `${h1s} H1 encontrado(s).`, comoResolver: "Use exatamente um H1 por página, com o assunto principal." },
    { id: "viewport", titulo: "Preparado para celular", ok: viewport, peso: 10, detalhe: viewport ? "Meta viewport presente." : "Sem meta viewport — o site provavelmente não se adapta ao celular.", comoResolver: "Adicione <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> e teste em celulares reais." },
    { id: "noindex", titulo: "Página liberada para o Google", ok: !noindex, peso: 12, detalhe: noindex ? "A página pede para NÃO ser indexada (noindex)." : "Sem bloqueio de indexação.", comoResolver: "Remova o noindex — comum em sites que saíram do ambiente de testes sem revisão." },
    { id: "canonical", titulo: "Endereço canônico declarado", ok: canonical, peso: 4, detalhe: canonical ? "Tag canonical presente." : "Sem tag canonical.", comoResolver: "Declare a URL oficial da página para evitar versões duplicadas (com/sem www, parâmetros)." },
    { id: "lang", titulo: "Idioma declarado", ok: lang, peso: 3, detalhe: lang ? "Atributo lang presente." : "Sem atributo lang no <html>.", comoResolver: "Use <html lang=\"pt-BR\">: ajuda leitores de tela e buscadores." },
    { id: "jsonld", titulo: "Dados estruturados", ok: jsonld, peso: 4, detalhe: jsonld ? "JSON-LD encontrado." : "Sem dados estruturados.", comoResolver: "Marque empresa, endereço e telefone com schema.org (LocalBusiness/Organization), coerente com o que aparece na página." },
    { id: "og", titulo: "Prévia para WhatsApp e redes", ok: og, peso: 3, detalhe: og ? "Tags Open Graph presentes." : "Sem Open Graph — o link compartilhado sai sem imagem e título.", comoResolver: "Adicione og:title, og:description e og:image." },
    { id: "alt", titulo: "Imagens com texto alternativo", ok: imgs.length === 0 || semAlt / imgs.length <= 0.2, peso: 3, detalhe: `${semAlt} de ${imgs.length} imagens sem alt.`, comoResolver: "Descreva cada imagem relevante no atributo alt." },
    { id: "robots", titulo: "robots.txt publicado", ok: robots, peso: 3, detalhe: robots ? "robots.txt encontrado." : "robots.txt não encontrado.", comoResolver: "Publique um robots.txt que libere o site e aponte o sitemap." },
    { id: "sitemap", titulo: "sitemap.xml publicado", ok: sitemap, peso: 4, detalhe: sitemap ? "sitemap.xml encontrado." : "sitemap.xml não encontrado no endereço padrão.", comoResolver: "Gere um sitemap e envie no Google Search Console." },
    { id: "privacidade", titulo: "Política de privacidade linkada", ok: privacidade, peso: 5, detalhe: privacidade ? "Há menção a privacidade na página." : "Nenhum link de privacidade encontrado na página inicial.", comoResolver: "A LGPD garante ao visitante acesso facilitado às informações sobre o uso dos dados (art. 9º). Publique a política e linke no rodapé." },
  ];

  const total = c.reduce((s, x) => s + x.peso, 0);
  const nota = Math.round((c.filter((x) => x.ok).reduce((s, x) => s + x.peso, 0) / total) * 100);
  const falhas = c.filter((x) => !x.ok).sort((a, b) => b.peso - a.peso);

  return NextResponse.json({
    url: r.url.toString(),
    nota,
    principais: falhas.slice(0, 3).map((f) => ({ titulo: f.titulo, detalhe: f.detalhe })),
    checagens: c,
  });
}
