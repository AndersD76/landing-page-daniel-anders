"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { rastrear } from "@/lib/telemetria/cliente";
import { CapturaEmail } from "@/components/iscas/CapturaEmail";
import { CtaResultado } from "./FerramentaLayout";

export interface ItemChecklist {
  id: string;
  texto: string;
  /** por que importa e como resolver — vai no relatório completo */
  explicacao: string;
  peso: 1 | 2 | 3;
}

export interface GrupoChecklist {
  titulo: string;
  itens: ItemChecklist[];
}

/**
 * Checklist com nota. O estado fica na URL (?ok=id1,id2) — o link é
 * compartilhável e reabre com as mesmas respostas.
 * Na tela: nota + 3 pendências mais pesadas. Por e-mail: todas, explicadas.
 */
export function ChecklistIsca({
  iscaId,
  titulo,
  grupos,
  ctaTexto,
  ctaHref,
}: {
  iscaId: string;
  titulo: string;
  grupos: GrupoChecklist[];
  ctaTexto: string;
  ctaHref: string;
}) {
  const todos = useMemo(() => grupos.flatMap((g) => g.itens.map((i) => ({ ...i, grupo: g.titulo }))), [grupos]);
  const [marcados, setMarcados] = useState<Set<string>>(new Set());
  const [mostrar, setMostrar] = useState(false);
  const iniciou = useRef(false);

  useEffect(() => {
    const ok = new URLSearchParams(window.location.search).get("ok");
    if (ok) {
      // Estado inicial vem da URL compartilhada — só existe no cliente.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMarcados(new Set(ok.split(",").filter(Boolean)));
    }
  }, []);

  function alternar(id: string) {
    if (!iniciou.current) {
      iniciou.current = true;
      rastrear("isca_iniciada", { isca_id: iscaId });
    }
    setMarcados((atual) => {
      const n = new Set(atual);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      const url = new URL(window.location.href);
      url.searchParams.set("ok", [...n].join(","));
      window.history.replaceState(null, "", url.toString());
      return n;
    });
  }

  const pesoTotal = todos.reduce((s, i) => s + i.peso, 0);
  const pesoOk = todos.filter((i) => marcados.has(i.id)).reduce((s, i) => s + i.peso, 0);
  const nota = Math.round((pesoOk / pesoTotal) * 100);
  const pendentes = todos.filter((i) => !marcados.has(i.id)).sort((a, b) => b.peso - a.peso);

  function verResultado() {
    setMostrar(true);
    rastrear("isca_concluida", { isca_id: iscaId, nota });
  }

  const relatorio = {
    titulo,
    resumo: `Nota ${nota}/100 — ${pendentes.length} de ${todos.length} itens pendentes.`,
    destaques: [
      { rotulo: "Nota", valor: `${nota}/100` },
      { rotulo: "Itens atendidos", valor: `${todos.length - pendentes.length} de ${todos.length}` },
    ],
    secoes: grupos
      .map((g) => ({
        titulo: `Pendências — ${g.titulo}`,
        itens: g.itens.filter((i) => !marcados.has(i.id)).map((i) => `${i.texto}: ${i.explicacao}`),
      }))
      .filter((s) => s.itens.length),
  };

  return (
    <div>
      <div className="space-y-8">
        {grupos.map((g) => (
          <fieldset key={g.titulo}>
            <legend className="font-heading text-xl font-bold text-foreground mb-3">{g.titulo}</legend>
            <ul className="space-y-2">
              {g.itens.map((i) => (
                <li key={i.id}>
                  <label className="flex items-start gap-3 cursor-pointer text-gray hover:text-foreground">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 accent-[#e63946]"
                      checked={marcados.has(i.id)}
                      onChange={() => alternar(i.id)}
                    />
                    <span>{i.texto}</span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        ))}
      </div>

      <button
        onClick={verResultado}
        className="mt-8 text-sm font-bold text-white bg-brand px-6 py-3 rounded-lg"
      >
        Ver minha nota
      </button>

      {mostrar && (
        <div className="mt-8 space-y-4" aria-live="polite">
          <div className="glass-card">
            <p className="text-xs font-bold tracking-[3px] text-gray uppercase">Sua nota</p>
            <p className="font-heading text-5xl font-bold text-foreground my-2">{nota}<span className="text-2xl text-gray">/100</span></p>
            <p className="text-gray">
              {pendentes.length === 0
                ? "Tudo marcado. Guarde o link desta página: ele reabre com as suas respostas."
                : `${pendentes.length} pendência(s). As mais importantes:`}
            </p>
            {pendentes.length > 0 && (
              <ol className="list-decimal pl-5 mt-3 space-y-1 text-foreground">
                {pendentes.slice(0, 3).map((p) => (
                  <li key={p.id}>{p.texto}</li>
                ))}
              </ol>
            )}
          </div>
          {pendentes.length > 0 && (
            <CapturaEmail
              iscaId={iscaId}
              relatorio={relatorio}
              entrada={{ marcados: [...marcados] }}
              titulo="Receba a lista completa de pendências, com o porquê e como resolver cada uma"
            />
          )}
          <CtaResultado iscaId={iscaId} texto={ctaTexto} href={ctaHref} />
        </div>
      )}
    </div>
  );
}
