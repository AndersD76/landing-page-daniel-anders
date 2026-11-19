"use client";

import { useEffect, useState } from "react";
import { CapturaEmail } from "@/components/iscas/CapturaEmail";
import { rastrear } from "@/lib/telemetria/cliente";
import { CtaResultado } from "./FerramentaLayout";
import { campoCls } from "./useIsca";

interface Checagem {
  id: string;
  titulo: string;
  ok: boolean;
  detalhe: string;
  comoResolver: string;
}

interface Resultado {
  url: string;
  nota: number;
  principais: Array<{ titulo: string; detalhe: string }>;
  checagens: Checagem[];
}

export function DiagnosticoSite() {
  const [url, setUrl] = useState("");
  const [estado, setEstado] = useState<"ocioso" | "rodando" | "ok" | "erro">("ocioso");
  const [erro, setErro] = useState("");
  const [res, setRes] = useState<Resultado | null>(null);

  async function rodar(alvo: string) {
    if (!alvo.trim()) return;
    setEstado("rodando");
    setErro("");
    rastrear("isca_iniciada", { isca_id: "diagnostico-site" });
    const u = new URL(window.location.href);
    u.searchParams.set("site", alvo.trim());
    window.history.replaceState(null, "", u.toString());
    try {
      const r = await fetch("/api/ferramentas/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: alvo }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.erro || "Não consegui analisar este endereço.");
      setRes(j);
      setEstado("ok");
      rastrear("isca_concluida", { isca_id: "diagnostico-site", nota: j.nota });
    } catch (e) {
      setEstado("erro");
      setErro(e instanceof Error ? e.message : "Erro.");
    }
  }

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("site");
    if (s) {
      // Link compartilhado com ?site=: preenche e roda uma vez.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUrl(s);
      void rodar(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const falhas = res?.checagens.filter((c) => !c.ok) ?? [];
  const relatorio = res
    ? {
        titulo: `Diagnóstico de ${new URL(res.url).hostname}`,
        resumo: `Nota ${res.nota}/100 — ${falhas.length} ponto(s) a corrigir em ${res.checagens.length} verificados.`,
        destaques: [
          { rotulo: "Nota", valor: `${res.nota}/100` },
          { rotulo: "Endereço analisado", valor: res.url },
        ],
        secoes: [
          { titulo: "O que corrigir (do mais importante para o menos)", itens: falhas.map((f) => `${f.titulo} — ${f.detalhe} Como resolver: ${f.comoResolver}`) },
          { titulo: "O que já está certo", itens: res.checagens.filter((c) => c.ok).map((c) => c.titulo) },
        ],
      }
    : null;

  return (
    <div>
      <form
        className="flex flex-col sm:flex-row gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void rodar(url);
        }}
      >
        <input className={campoCls} type="text" inputMode="url" placeholder="www.suaempresa.com.br" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="Endereço do site" />
        <button className="shrink-0 text-sm font-bold text-white bg-brand px-6 py-3 rounded-lg disabled:opacity-60" disabled={estado === "rodando"}>
          {estado === "rodando" ? "Analisando…" : "Diagnosticar"}
        </button>
      </form>
      {estado === "erro" && <p className="mt-3 text-sm text-red-400" role="alert">{erro}</p>}
      {res && relatorio && (
        <div className="mt-8 space-y-4" aria-live="polite">
          <div className="glass-card">
            <p className="text-xs font-bold tracking-[3px] text-gray uppercase">Nota de {new URL(res.url).hostname}</p>
            <p className="font-heading text-5xl font-bold text-foreground my-2">{res.nota}<span className="text-2xl text-gray">/100</span></p>
            {res.principais.length ? (
              <>
                <p className="text-gray mb-2">Os 3 pontos que mais pesam:</p>
                <ol className="list-decimal pl-5 space-y-1 text-foreground">
                  {res.principais.map((p) => (
                    <li key={p.titulo}>
                      {p.titulo} <span className="text-gray text-sm">— {p.detalhe}</span>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <p className="text-gray">Nenhum problema nos itens verificados.</p>
            )}
          </div>
          <CapturaEmail iscaId="diagnostico-site" relatorio={relatorio} entrada={{ url: res.url }} titulo={`Receba o relatório completo (${res.checagens.length} verificações, com como resolver cada uma)`} />
          <CtaResultado iscaId="diagnostico-site" href="/quanto-custa/site-institucional" texto="Prefere que alguém resolva? Veja quanto custa um site rápido e pronto para o Google." />
        </div>
      )}
    </div>
  );
}
