/**
 * Relatório de dados próprios (ativo linkável): empresas por setor no Brasil e
 * por município no RS, a partir do CEMPRE/IBGE já carregado no repositório
 * pelos scripts carregar:cempre e carregar:cidades. Quando o IBGE publicar ano
 * novo e os scripts rodarem, o relatório e os gráficos embutidos se atualizam
 * sozinhos no próximo deploy.
 */

import cempreSetores from "./setores-cempre.json";
import cempreCidades from "./cidades-cempre.json";
import { setoresConteudo } from "./setores";

export const FONTE_SETORES = {
  nome: cempreSetores.fonte,
  url: cempreSetores.fonteUrl,
  ano: cempreSetores.anoReferencia,
  carregadoEm: cempreSetores.carregadoEm,
  totalBrasil: cempreSetores.totalEmpresasBrasil,
};

export const FONTE_CIDADES = {
  nome: cempreCidades.fonte,
  ano: cempreCidades.anoReferencia,
  carregadoEm: cempreCidades.carregadoEm,
  totalUf: cempreCidades.totalEmpresasUf,
};

export interface LinhaSetor {
  slug: string;
  nome: string;
  cnae: string;
  empresas: number;
  pessoal: number | null;
  pessoasPorEmpresa: number | null;
  ufLider: string | null;
}

export function setoresRanking(): LinhaSetor[] {
  return cempreSetores.setores
    .map((s) => {
      const nome = setoresConteudo.find((c) => c.slug === s.slug)?.nome ?? s.slug;
      return {
        slug: s.slug,
        nome,
        cnae: s.cnae,
        empresas: s.empresasBrasil,
        pessoal: s.pessoalOcupado ?? null,
        pessoasPorEmpresa: s.pessoalOcupado ? Math.round((s.pessoalOcupado / s.empresasBrasil) * 10) / 10 : null,
        ufLider: s.topUfs?.[0]?.uf ?? null,
      };
    })
    .sort((a, b) => b.empresas - a.empresas);
}

export interface LinhaCidade {
  slug: string;
  nome: string;
  empresas: number;
  pessoal: number | null;
}

export function cidadesRanking(n = 20): LinhaCidade[] {
  return (cempreCidades.cidades as Array<{ slug: string; nome: string; empresas: number; pessoalOcupado?: number }>)
    .map((c) => ({ slug: c.slug, nome: c.nome, empresas: c.empresas, pessoal: c.pessoalOcupado ?? null }))
    .sort((a, b) => b.empresas - a.empresas)
    .slice(0, n);
}

export const fmt = (n: number) => n.toLocaleString("pt-BR");
