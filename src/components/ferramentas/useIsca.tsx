"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { rastrear } from "@/lib/telemetria/cliente";

/**
 * Estado de ferramenta guardado na URL (?a=1&b=2): o link é compartilhável e
 * reabre com os mesmos números. Também dispara isca_iniciada na primeira
 * alteração e expõe `concluir()` para isca_concluida.
 */
export function useEstadoNaUrl<T extends Record<string, string | number>>(iscaId: string, inicial: T) {
  const [estado, setEstado] = useState<T>(inicial);
  const iniciou = useRef(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const lido = { ...inicial };
    let mudou = false;
    for (const k of Object.keys(inicial) as Array<keyof T>) {
      const v = q.get(String(k));
      if (v === null) continue;
      mudou = true;
      (lido as Record<string, string | number>)[String(k)] = typeof inicial[k] === "number" ? Number(v) || 0 : v;
    }
    // Estado inicial vem da URL compartilhada — só existe no cliente.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (mudou) setEstado(lido);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alterar = useCallback(
    (k: keyof T, v: string | number) => {
      if (!iniciou.current) {
        iniciou.current = true;
        rastrear("isca_iniciada", { isca_id: iscaId });
      }
      setEstado((atual) => {
        const novo = { ...atual, [k]: v };
        const url = new URL(window.location.href);
        url.searchParams.set(String(k), String(v));
        window.history.replaceState(null, "", url.toString());
        return novo;
      });
    },
    [iscaId]
  );

  const concluir = useCallback(
    (props: Record<string, string | number | boolean> = {}) => rastrear("isca_concluida", { isca_id: iscaId, ...props }),
    [iscaId]
  );

  return { estado, alterar, concluir };
}

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const campoCls =
  "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand";

export function Campo(props: {
  rotulo: string;
  ajuda?: string;
  valor: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  passo?: number;
  sufixo?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-foreground mb-1">{props.rotulo}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          className={campoCls}
          value={Number.isFinite(props.valor) ? props.valor : 0}
          min={props.min ?? 0}
          max={props.max}
          step={props.passo ?? 1}
          onChange={(e) => props.onChange(Number(e.target.value))}
        />
        {props.sufixo && <span className="text-sm text-gray whitespace-nowrap">{props.sufixo}</span>}
      </span>
      {props.ajuda && <span className="block text-xs text-gray mt-1">{props.ajuda}</span>}
    </label>
  );
}
