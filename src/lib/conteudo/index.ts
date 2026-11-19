/**
 * Conteúdo em escala: carga, portão de qualidade, ondas e motor de links.
 *
 * Tudo é calculado UMA vez por processo (build ou servidor) a partir dos JSON
 * em src/content. A ordem importa:
 *   1. carrega e valida o formato (schema)
 *   2. avalia cada página isolada (gate individual)
 *   3. similaridade TF-IDF entre todas → reprova quase-duplicata
 *   4. unicidade de title/H1/description
 *   5. motor de links entre as aprovadas → garante 3 entradas e 3 saídas
 *   6. ondas: aprovada só vai ao ar quando a onda dela chegou
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { CLUSTERS, getCluster, type ClusterId } from "@/lib/seo/taxonomia";
import { getIsca, type Isca } from "@/data/iscas";
import ondasConfig from "@/data/seo/ondas.json";
import {
  paginaConteudoSchema,
  ROTA_POR_TIPO,
  TIPOS_CONTEUDO,
  urlDe,
  type PaginaConteudo,
  type TipoConteudo,
} from "./schema";
import { avaliarPagina, LIMITES, type ResultadoQualidade } from "./gate";
import { cosseno, hash, vetoresTfIdf, type Vetor } from "./texto";
import { textoCorrido } from "./gate";

export * from "./schema";

export const BASE_URL = "https://www.andersdev.com.br";
const DIR = join(process.cwd(), "src/content");

export interface LinkInterno {
  href: string;
  ancora: string;
  tipo: TipoConteudo | "comercial";
}

export interface PaginaAvaliada extends PaginaConteudo {
  url: string;
  urlAbsoluta: string;
  arquivo: string;
  qualidade: ResultadoQualidade;
  linksSaida: LinkInterno[];
  linksEntrada: string[];
  isca: Isca;
  iscaSecundaria: Isca;
}

export interface ErroFormato {
  arquivo: string;
  indice: number;
  slug?: string;
  erro: string;
}

/* ---------------------------------------------------------------- ondas */

interface ConfigOndas {
  tiposPausados: string[];
  ondas: Array<{ numero: number; liberaEm: string; pausada?: boolean }>;
}
const ONDAS = ondasConfig as unknown as ConfigOndas;

export function dataLiberacao(onda: number): string | null {
  return ONDAS.ondas.find((o) => o.numero === onda)?.liberaEm ?? null;
}

function hojeISO(agora = new Date()): string {
  // Data de Brasília: a onda "de hoje" vira às 00h no fuso do público.
  return new Date(agora.getTime() - 3 * 3600_000).toISOString().slice(0, 10);
}

/** Aprovada + onda liberada + tipo não pausado. */
export function estaNoAr(p: PaginaAvaliada, agora = new Date()): boolean {
  if (!p.qualidade.publicavel) return false;
  if (ONDAS.tiposPausados.includes(p.tipo)) return false;
  const o = ONDAS.ondas.find((x) => x.numero === p.onda);
  if (!o || o.pausada) return false;
  return o.liberaEm <= hojeISO(agora);
}

/* ---------------------------------------------------------------- carga */

function lerArquivos(): { paginas: Array<PaginaConteudo & { arquivo: string }>; erros: ErroFormato[] } {
  const paginas: Array<PaginaConteudo & { arquivo: string }> = [];
  const erros: ErroFormato[] = [];
  if (!existsSync(DIR)) return { paginas, erros };
  for (const tipo of TIPOS_CONTEUDO) {
    const pasta = join(DIR, tipo);
    if (!existsSync(pasta)) continue;
    for (const nome of readdirSync(pasta).filter((f) => f.endsWith(".json")).sort()) {
      const arquivo = `src/content/${tipo}/${nome}`;
      let lista: unknown;
      try {
        lista = JSON.parse(readFileSync(join(pasta, nome), "utf8"));
      } catch (e) {
        erros.push({ arquivo, indice: -1, erro: `JSON inválido: ${(e as Error).message}` });
        continue;
      }
      if (!Array.isArray(lista)) {
        erros.push({ arquivo, indice: -1, erro: "o arquivo deve ser uma lista de páginas" });
        continue;
      }
      lista.forEach((bruta, indice) => {
        const r = paginaConteudoSchema.safeParse(bruta);
        if (!r.success) {
          erros.push({
            arquivo,
            indice,
            slug: (bruta as { slug?: string })?.slug,
            erro: r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
          });
          return;
        }
        if (r.data.tipo !== tipo) {
          erros.push({ arquivo, indice, slug: r.data.slug, erro: `tipo "${r.data.tipo}" na pasta "${tipo}"` });
          return;
        }
        paginas.push({ ...r.data, arquivo });
      });
    }
  }
  return { paginas, erros };
}

/* --------------------------------------------------------- motor de links */

/** Âncoras variadas e descritivas, escolhidas de forma estável por par. */
function ancoraPara(origem: string, alvo: PaginaConteudo): string {
  const opcoes = [
    alvo.h1,
    alvo.glossario ? `o que é ${alvo.glossario.termo}` : alvo.consulta,
    alvo.title.replace(/\s*[|:—–-]\s*.*$/, ""),
  ]
    .map((s) => s.trim())
    .filter((s, i, a) => s.length >= 4 && a.indexOf(s) === i);
  const escolha = opcoes[hash(origem + alvo.slug) % opcoes.length];
  return escolha.charAt(0).toUpperCase() + escolha.slice(1);
}

const PREFERENCIA_TIPO: Record<TipoConteudo, TipoConteudo[]> = {
  pilar: ["satelite", "modelo", "glossario", "norma", "comparativo"],
  satelite: ["pilar", "satelite", "glossario", "modelo", "comparativo", "norma"],
  modelo: ["pilar", "satelite", "modelo", "glossario"],
  glossario: ["glossario", "satelite", "pilar", "modelo"],
  norma: ["norma", "pilar", "modelo", "satelite", "glossario"],
  comparativo: ["comparativo", "pilar", "satelite", "glossario"],
};

function calcularLinks(paginas: PaginaAvaliada[], vetores: Map<string, Vetor>) {
  const porUrl = new Map(paginas.map((p) => [p.url, p]));
  const pilarDoCluster = new Map<ClusterId, PaginaAvaliada>();
  for (const p of paginas) if (p.tipo === "pilar" && !pilarDoCluster.has(p.cluster)) pilarDoCluster.set(p.cluster, p);

  const saidas = new Map<string, string[]>();
  for (const p of paginas) {
    const v = vetores.get(p.url)!;
    const candidatos = paginas
      .filter((o) => o.url !== p.url)
      .map((o) => {
        let s = cosseno(v, vetores.get(o.url)!);
        if (o.cluster === p.cluster) s += 0.15;
        const pref = PREFERENCIA_TIPO[p.tipo].indexOf(o.tipo);
        if (pref >= 0) s += 0.04 * (PREFERENCIA_TIPO[p.tipo].length - pref) / PREFERENCIA_TIPO[p.tipo].length;
        return { o, s };
      })
      .sort((a, b) => b.s - a.s);

    const escolhidos: string[] = [];
    const pilar = pilarDoCluster.get(p.cluster);
    if (pilar && pilar.url !== p.url) escolhidos.push(pilar.url);
    // diversidade: no máximo 3 do mesmo tipo
    const contagem = new Map<string, number>();
    for (const { o } of candidatos) {
      if (escolhidos.length >= (p.tipo === "pilar" ? 14 : 7)) break;
      if (escolhidos.includes(o.url)) continue;
      const n = contagem.get(o.tipo) ?? 0;
      if (n >= (p.tipo === "pilar" ? 6 : 3)) continue;
      contagem.set(o.tipo, n + 1);
      escolhidos.push(o.url);
    }
    saidas.set(p.url, escolhidos);
  }

  // Pilar lista todos os satélites do seu cluster (é o hub do cluster).
  for (const [cluster, pilar] of pilarDoCluster) {
    const lista = saidas.get(pilar.url)!;
    for (const p of paginas) if (p.cluster === cluster && p.tipo === "satelite" && !lista.includes(p.url)) lista.push(p.url);
  }

  // Garante 3 links de ENTRADA: quem tem menos recebe link das páginas mais parecidas.
  const entradas = () => {
    const m = new Map<string, string[]>();
    for (const [origem, alvos] of saidas) for (const a of alvos) m.set(a, [...(m.get(a) ?? []), origem]);
    return m;
  };
  let mapaEntradas = entradas();
  for (const p of paginas) {
    const atuais = mapaEntradas.get(p.url) ?? [];
    if (atuais.length >= LIMITES.linksMin) continue;
    const v = vetores.get(p.url)!;
    const doadores = paginas
      .filter((o) => o.url !== p.url && !atuais.includes(o.url))
      .map((o) => ({ o, s: cosseno(v, vetores.get(o.url)!) + (o.cluster === p.cluster ? 0.15 : 0) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, LIMITES.linksMin - atuais.length);
    for (const { o } of doadores) saidas.get(o.url)!.push(p.url);
    mapaEntradas = entradas();
  }

  for (const p of paginas) {
    p.linksSaida = (saidas.get(p.url) ?? []).map((u) => {
      const alvo = porUrl.get(u)!;
      return { href: u, ancora: ancoraPara(p.slug, alvo), tipo: alvo.tipo };
    });
    const comercial = getCluster(p.cluster)!.paginaComercial;
    p.linksSaida.push({ href: comercial.href, ancora: comercial.rotulo, tipo: "comercial" });
    p.linksEntrada = mapaEntradas.get(p.url) ?? [];
  }
}

/* ------------------------------------------------------------- avaliação */

interface Conjunto {
  todas: PaginaAvaliada[];
  erros: ErroFormato[];
}

let cache: Conjunto | null = null;

export function carregarConteudo(): Conjunto {
  if (cache) return cache;
  const { paginas: brutas, erros } = lerArquivos();

  // slug repetido no mesmo tipo: a segunda é erro de formato
  const vistos = new Set<string>();
  const unicas = brutas.filter((p, i) => {
    const chave = urlDe(p);
    if (vistos.has(chave)) {
      erros.push({ arquivo: p.arquivo, indice: i, slug: p.slug, erro: `URL duplicada: ${chave}` });
      return false;
    }
    vistos.add(chave);
    return true;
  });

  const avaliadas: PaginaAvaliada[] = unicas.map((p) => {
    const cluster = getCluster(p.cluster)!;
    return {
      ...p,
      url: urlDe(p),
      urlAbsoluta: `${BASE_URL}${urlDe(p)}`,
      qualidade: avaliarPagina(p),
      linksSaida: [],
      linksEntrada: [],
      isca: getIsca(p.iscaId) ?? getIsca(cluster.isca)!,
      iscaSecundaria: getIsca(cluster.iscaSecundaria)!,
    };
  });

  // Similaridade entre todas (inclusive reprovadas: duplicata reprova as duas pontas).
  const vetores = vetoresTfIdf(avaliadas.map((p) => `${p.h1} ${p.consulta} ${textoCorrido(p)}`));
  const mapaVetores = new Map(avaliadas.map((p, i) => [p.url, vetores[i]]));
  for (let i = 0; i < avaliadas.length; i++) {
    let max = 0;
    let par: string | undefined;
    for (let j = 0; j < avaliadas.length; j++) {
      if (i === j) continue;
      const s = cosseno(vetores[i], vetores[j]);
      if (s > max) {
        max = s;
        par = avaliadas[j].url;
      }
    }
    const q = avaliadas[i].qualidade;
    q.similaridadeMax = Number(max.toFixed(3));
    q.parSimilar = par;
    q.checagens.push({
      id: "similaridade-abaixo-do-limiar",
      ok: max < LIMITES.similaridadeMax,
      detalhe: `${(max * 100).toFixed(0)}% com ${par ?? "—"} (limite ${LIMITES.similaridadeMax * 100}%)`,
    });
  }

  // Unicidade de title, H1 e description.
  for (const campo of ["title", "h1", "description"] as const) {
    const contagem = new Map<string, number>();
    for (const p of avaliadas) {
      const v = p[campo].trim().toLowerCase();
      contagem.set(v, (contagem.get(v) ?? 0) + 1);
    }
    for (const p of avaliadas) {
      const n = contagem.get(p[campo].trim().toLowerCase()) ?? 0;
      p.qualidade.checagens.push({ id: `${campo}-unico`, ok: n === 1, detalhe: n > 1 ? `repetido em ${n} páginas` : undefined });
    }
  }

  for (const p of avaliadas) {
    p.qualidade.aprovado = p.qualidade.checagens.every((c) => c.ok);
    p.qualidade.publicavel = p.qualidade.aprovado && !p.dependeAutor;
  }

  // Links só entre publicáveis: link para página reprovada é link para 404.
  const publicaveis = avaliadas.filter((p) => p.qualidade.publicavel);
  calcularLinks(publicaveis, mapaVetores);
  for (const p of avaliadas) {
    const ok = p.qualidade.publicavel
      ? p.linksEntrada.length >= LIMITES.linksMin && p.linksSaida.length >= LIMITES.linksMin
      : true;
    p.qualidade.checagens.push({
      id: "links-internos-3-entrada-3-saida",
      ok,
      detalhe: `${p.linksEntrada.length} entrada / ${p.linksSaida.length} saída`,
    });
    if (!ok) {
      p.qualidade.aprovado = false;
      p.qualidade.publicavel = false;
    }
  }

  cache = { todas: avaliadas, erros };
  return cache;
}

/* --------------------------------------------------------------- consultas */

export function paginasNoAr(agora = new Date()): PaginaAvaliada[] {
  return carregarConteudo().todas.filter((p) => estaNoAr(p, agora));
}

export function paginasNoArDoTipo(tipo: TipoConteudo, agora = new Date()): PaginaAvaliada[] {
  return paginasNoAr(agora).filter((p) => p.tipo === tipo);
}

export function getPagina(tipo: TipoConteudo, slug: string): PaginaAvaliada | undefined {
  return carregarConteudo().todas.find((p) => p.tipo === tipo && p.slug === slug);
}

/** Slugs para generateStaticParams: todo publicável (as ondas futuras também, em 404 até a data). */
export function slugsDoTipo(tipo: TipoConteudo): string[] {
  return carregarConteudo()
    .todas.filter((p) => p.tipo === tipo && p.qualidade.publicavel)
    .map((p) => p.slug);
}

/** Links de saída filtrados pelo que já está no ar (onda futura não recebe link ainda). */
export function linksNoAr(p: PaginaAvaliada, agora = new Date()): LinkInterno[] {
  const noAr = new Set(paginasNoAr(agora).map((x) => x.url));
  return p.linksSaida.filter((l) => l.tipo === "comercial" || noAr.has(l.href));
}

export function porCluster(agora = new Date()): Array<{ cluster: (typeof CLUSTERS)[number]; paginas: PaginaAvaliada[] }> {
  const noAr = paginasNoAr(agora);
  return CLUSTERS.map((cluster) => ({ cluster, paginas: noAr.filter((p) => p.cluster === cluster.id) }));
}

export function resumoConteudo(agora = new Date()) {
  const { todas, erros } = carregarConteudo();
  const noAr = new Set(paginasNoAr(agora).map((p) => p.url));
  const porTipo = Object.fromEntries(
    TIPOS_CONTEUDO.map((t) => {
      const doTipo = todas.filter((p) => p.tipo === t);
      return [
        t,
        {
          total: doTipo.length,
          aprovadas: doTipo.filter((p) => p.qualidade.aprovado).length,
          rascunhos: doTipo.filter((p) => p.qualidade.aprovado && p.dependeAutor).length,
          reprovadas: doTipo.filter((p) => !p.qualidade.aprovado).length,
          noAr: doTipo.filter((p) => noAr.has(p.url)).length,
        },
      ];
    })
  );
  return { total: todas.length, noAr: noAr.size, errosFormato: erros.length, porTipo };
}

export { ROTA_POR_TIPO };
