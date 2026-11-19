/**
 * Formato em disco do mapa de buscas (src/data/seo/mapa-buscas.json).
 *
 * Colunar para caber no repositório: 12 mil consultas em lista de objetos
 * passam de 4 MB; em colunas, com a semente indexada, ficam em ~1 MB. A
 * tabela `mapa_buscas` no banco é a forma de consulta; este arquivo é a carga.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ClusterId, Intencao, IscaId, TipoPagina } from "./taxonomia";

export interface ConsultaMapa {
  consulta: string;
  intencao: Intencao;
  cluster: ClusterId;
  tipoPagina: TipoPagina;
  iscaId: IscaId;
  /** 1 = primeira sugestão do autocomplete. Proxy de popularidade, não volume. */
  posicaoAutocomplete: number | null;
  volume: number | null;
  volumeFonte: "estimativa-autocomplete" | "keyword-planner" | "gsc";
  prioridade: number;
  fonte: "autocomplete" | "gsc" | "paa" | "concorrente" | "norma" | "manual";
  semente: string;
  coletadoEm: string;
}

export const CAMINHO_MAPA = join(process.cwd(), "src/data/seo/mapa-buscas.json");

const COLUNAS = [
  "consulta", "intencao", "cluster", "tipoPagina", "iscaId", "posicaoAutocomplete",
  "volume", "volumeFonte", "prioridade", "fonte", "semente", "coletadoEm",
] as const;

interface ArquivoMapa {
  versao: 1;
  observacao: string;
  colunas: readonly string[];
  sementes: string[];
  linhas: unknown[][];
}

export function lerMapa(caminho = CAMINHO_MAPA): ConsultaMapa[] {
  const bruto = JSON.parse(readFileSync(caminho, "utf8")) as ArquivoMapa | ConsultaMapa[];
  if (Array.isArray(bruto)) return bruto; // formato antigo (lista de objetos)
  const idx = Object.fromEntries(bruto.colunas.map((c, i) => [c, i]));
  return bruto.linhas.map((l) => {
    const o: Record<string, unknown> = {};
    for (const c of COLUNAS) o[c] = l[idx[c]];
    o.semente = bruto.sementes[l[idx.semente] as number];
    return o as unknown as ConsultaMapa;
  });
}

export function gravarMapa(lista: ConsultaMapa[], caminho = CAMINHO_MAPA): void {
  const sementes = [...new Set(lista.map((c) => c.semente))];
  const posSemente = new Map(sementes.map((s, i) => [s, i]));
  const arquivo: ArquivoMapa = {
    versao: 1,
    observacao:
      "Volume real só com Keyword Planner ou Search Console. Até lá, posicaoAutocomplete é o sinal de popularidade e volumeFonte = estimativa-autocomplete.",
    colunas: COLUNAS,
    sementes,
    linhas: lista.map((c) => COLUNAS.map((k) => (k === "semente" ? posSemente.get(c.semente) : c[k]))),
  };
  writeFileSync(
    caminho,
    JSON.stringify(arquivo).replace(/\],\[/g, "],\n[") + "\n"
  );
}
