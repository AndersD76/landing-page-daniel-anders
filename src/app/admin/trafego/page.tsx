"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Painel de tráfego. Protegido pela mesma sessão do resto do /admin —
 * a API recusa sem cookie válido, então não há dado aqui sem autenticação.
 */

interface Trafego {
  dias: number;
  totais: {
    views: number;
    sessoes: number;
    ctaVisto: number;
    ctaClicado: number;
    leads: number;
  };
  funil: {
    sessoes: number;
    ctaVisto: number;
    ctaClicado: number;
    leads: number;
    taxaVistoSobreSessao: number | null;
    taxaClicadoSobreVisto: number | null;
    taxaLeadSobreClicado: number | null;
  };
  porDia: { dia: string; views: number; sessoes: number }[];
  porPagina: { path: string; views: number; sessoes: number }[];
  porOrigem: { origem: string; medium: string; sessoes: number }[];
  porEntrada: { landingPage: string | null; sessoes: number }[];
  leadsPorEntrada: { landingPage: string | null; total: number }[];
}

const JANELAS = [7, 30, 90];

function pct(v: number | null): string {
  return v === null ? "—" : `${v.toFixed(1)}%`;
}

export default function AdminTrafegoPage() {
  const [dias, setDias] = useState(30);
  // Um estado só, escrito apenas dentro do callback assíncrono: setState
  // síncrono no corpo do efeito dispara renderização em cascata.
  const [resposta, setResposta] = useState<{
    dias: number;
    dados: Trafego | null;
    erro: string;
  } | null>(null);

  useEffect(() => {
    let cancelado = false;

    fetch(`/api/admin/trafego?dias=${dias}`)
      .then(async (res) => {
        if (res.status === 401) throw new Error("Sessão expirada. Faça login em /admin.");
        if (!res.ok) throw new Error("Não consegui carregar os dados.");
        return res.json();
      })
      .then((json) => {
        if (!cancelado) setResposta({ dias, dados: json, erro: "" });
      })
      .catch((e) => {
        if (!cancelado) {
          setResposta({
            dias,
            dados: null,
            erro: e instanceof Error ? e.message : "Erro",
          });
        }
      });

    return () => {
      cancelado = true;
    };
  }, [dias]);

  // "Carregando" é derivado: a resposta na tela ainda não é da janela pedida.
  const atual = resposta?.dias === dias ? resposta : null;
  const dados = atual?.dados ?? null;
  const erro = atual?.erro ?? "";
  const carregando = atual === null;

  const maxDia = dados ? Math.max(...dados.porDia.map((d) => d.sessoes), 1) : 1;
  const maxPagina = dados ? Math.max(...dados.porPagina.map((p) => p.sessoes), 1) : 1;

  // Mapa de leads por página de entrada, para cruzar com as sessões.
  const leadsPorPagina = new Map(
    (dados?.leadsPorEntrada ?? []).map((l) => [l.landingPage ?? "(sem origem)", l.total])
  );

  return (
    <main className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Tráfego</h1>
          <p className="text-sm text-gray mt-1">
            Coleta própria, no mesmo banco dos leads. Sem IP e sem dado pessoal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {JANELAS.map((j) => (
            <button
              key={j}
              onClick={() => setDias(j)}
              className={`px-4 py-2 rounded-xl text-sm border transition-colors ${
                dias === j
                  ? "border-brand/50 text-foreground"
                  : "border-white/[0.08] text-gray hover:border-brand/30"
              }`}
            >
              {j}d
            </button>
          ))}
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl text-sm border border-white/[0.08] text-gray hover:border-brand/30 transition-colors no-underline"
          >
            Leads →
          </Link>
        </div>
      </div>

      {erro && (
        <div className="glass-card border-brand/30 mb-8">
          <p className="text-brand text-sm">{erro}</p>
          <Link href="/admin" className="text-sm text-brand underline mt-2 inline-block">
            Ir para o login
          </Link>
        </div>
      )}

      {carregando && !dados && <p className="text-gray text-sm">Carregando…</p>}

      {dados && (
        <>
          {/* FUNIL — cada taxa sobre a etapa anterior */}
          <section className="mb-10">
            <h2 className="font-heading text-lg font-bold mb-4">
              Funil por sessão distinta
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { rotulo: "Sessões", valor: dados.funil.sessoes, taxa: null },
                {
                  rotulo: "Viram o CTA",
                  valor: dados.funil.ctaVisto,
                  taxa: dados.funil.taxaVistoSobreSessao,
                },
                {
                  rotulo: "Clicaram",
                  valor: dados.funil.ctaClicado,
                  taxa: dados.funil.taxaClicadoSobreVisto,
                },
                {
                  rotulo: "Viraram lead",
                  valor: dados.funil.leads,
                  taxa: dados.funil.taxaLeadSobreClicado,
                },
              ].map((e) => (
                <div key={e.rotulo} className="glass-card !p-5">
                  <p className="font-heading text-2xl font-bold text-foreground tabular-nums">
                    {e.valor.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-xs text-gray mt-1">{e.rotulo}</p>
                  {e.taxa !== null && (
                    <p className="text-xs text-brand mt-2">
                      {pct(e.taxa)} da etapa anterior
                    </p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray mt-3">
              Sem o denominador &quot;viram o CTA&quot; não dá para saber se a
              oferta não convence ou se ninguém chegou a ver o botão.
            </p>
          </section>

          {/* POR DIA */}
          <section className="mb-10">
            <h2 className="font-heading text-lg font-bold mb-4">
              Sessões por dia
            </h2>
            <div className="glass-card">
              {dados.porDia.length === 0 ? (
                <p className="text-sm text-gray">Nenhuma visita no período.</p>
              ) : (
                <div className="flex items-end gap-[2px] h-[140px]">
                  {dados.porDia.map((d) => (
                    <div
                      key={d.dia}
                      className="flex-1 bg-brand rounded-t-[4px] min-w-[3px]"
                      style={{ height: `${(d.sessoes / maxDia) * 100}%` }}
                      title={`${d.dia}: ${d.sessoes} sessões, ${d.views} páginas`}
                    />
                  ))}
                </div>
              )}
              {dados.porDia.length > 0 && (
                <div className="flex justify-between text-xs text-gray mt-3">
                  <span>{dados.porDia[0]?.dia}</span>
                  <span>{dados.porDia[dados.porDia.length - 1]?.dia}</span>
                </div>
              )}
            </div>
          </section>

          {/* PÁGINAS */}
          <section className="mb-10">
            <h2 className="font-heading text-lg font-bold mb-4">
              Páginas mais vistas
            </h2>
            <div className="glass-card">
              {dados.porPagina.length === 0 ? (
                <p className="text-sm text-gray">Sem dado no período.</p>
              ) : (
                <div className="flex flex-col gap-[2px]">
                  {dados.porPagina.map((p) => (
                    <div key={p.path} className="flex items-center gap-3">
                      <span className="text-xs text-gray w-[260px] shrink-0 truncate text-right">
                        {p.path}
                      </span>
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <div
                          className="h-4 bg-brand rounded-[4px]"
                          style={{
                            width: `${Math.max((p.sessoes / maxPagina) * 100, 1.5)}%`,
                          }}
                        />
                        <span className="text-xs text-foreground tabular-nums whitespace-nowrap">
                          {p.sessoes}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ORIGEM */}
          <section className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="font-heading text-lg font-bold mb-4">Origem</h2>
              <div className="glass-card !p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] text-left">
                      <th className="px-4 py-3 font-bold text-foreground">Origem</th>
                      <th className="px-4 py-3 font-bold text-foreground">Meio</th>
                      <th className="px-4 py-3 font-bold text-foreground text-right">
                        Sessões
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray">
                    {dados.porOrigem.map((o, i) => (
                      <tr key={i} className="border-t border-white/[0.06]">
                        <td className="px-4 py-2.5 truncate max-w-[160px]">
                          {o.origem}
                        </td>
                        <td className="px-4 py-2.5">{o.medium}</td>
                        <td className="px-4 py-2.5 text-right text-foreground tabular-nums">
                          {o.sessoes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* A pergunta que importa */}
            <div>
              <h2 className="font-heading text-lg font-bold mb-4">
                Qual página gera lead
              </h2>
              <div className="glass-card !p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.04] text-left">
                      <th className="px-4 py-3 font-bold text-foreground">
                        Página de entrada
                      </th>
                      <th className="px-4 py-3 font-bold text-foreground text-right">
                        Sessões
                      </th>
                      <th className="px-4 py-3 font-bold text-foreground text-right">
                        Leads
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray">
                    {dados.porEntrada.map((e, i) => {
                      const chave = e.landingPage ?? "(sem origem)";
                      const leads = leadsPorPagina.get(chave) ?? 0;
                      return (
                        <tr key={i} className="border-t border-white/[0.06]">
                          <td className="px-4 py-2.5 truncate max-w-[200px]">
                            {chave}
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums">
                            {e.sessoes}
                          </td>
                          <td
                            className={`px-4 py-2.5 text-right tabular-nums ${
                              leads > 0 ? "text-brand font-bold" : ""
                            }`}
                          >
                            {leads}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray mt-3">
                A coluna de leads cruza pela página de entrada gravada no próprio
                lead — não pela página onde o formulário foi enviado.
              </p>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
