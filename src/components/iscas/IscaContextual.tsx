"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { rastrear } from "@/lib/telemetria/cliente";
import type { Isca } from "@/data/iscas";

/**
 * Isca do cluster dentro do conteúdo (meio e fim da página). Não é pop-up:
 * fica no fluxo de leitura e não bloqueia nada. Dispara isca_vista uma vez,
 * quando metade do card entra na tela.
 */
export function IscaCard({ isca, posicao }: { isca: Pick<Isca, "id" | "nome" | "chamada" | "entrega" | "href" | "botao">; posicao: "meio" | "fim" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          rastrear("isca_vista", { isca_id: isca.id, posicao });
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isca.id, posicao]);

  return (
    <div ref={ref} className="my-10 rounded-2xl border border-brand/30 bg-brand/[0.06] p-6 md:p-7" data-isca-card={isca.id}>
      <span className="text-[11px] font-bold tracking-[3px] text-brand uppercase">Ferramenta gratuita</span>
      <p className="font-heading text-xl md:text-2xl font-bold text-foreground mt-2 mb-2">{isca.chamada}</p>
      <p className="text-sm text-gray mb-5">{isca.entrega}. Sem cadastro para ver o resultado.</p>
      <Link
        href={isca.href}
        data-track="isca_iniciada"
        data-isca={isca.id}
        data-track-source={posicao}
        className="inline-block text-sm font-bold text-white bg-brand px-6 py-3 rounded-lg no-underline hover:bg-brand-bright"
      >
        {isca.botao} →
      </Link>
    </div>
  );
}

/** Barra discreta no celular. Fecha com 1 toque e não volta na mesma sessão. */
export function BarraIscaMobile({ isca }: { isca: Pick<Isca, "id" | "chamada" | "href" | "botao"> }) {
  const [fechada, setFechada] = useState(true);
  useEffect(() => {
    try {
      // Leitura de sessionStorage só no cliente; o estado inicial "fechada"
      // evita piscar a barra antes de saber a preferência.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFechada(window.sessionStorage.getItem("barra_isca_fechada") === "1");
    } catch {
      setFechada(false);
    }
  }, []);
  if (fechada) return null;
  return (
    <div
      data-barra-isca
      className="fixed bottom-0 inset-x-0 z-[600] md:hidden bg-surface-black/95 backdrop-blur-md border-t border-white/10 px-3 py-2 flex items-center gap-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
    >
      <p className="flex-1 text-xs text-gray-200 leading-snug line-clamp-2">{isca.chamada}</p>
      <Link
        href={isca.href}
        data-track="isca_iniciada"
        data-isca={isca.id}
        data-track-source="barra-mobile"
        className="shrink-0 text-xs font-bold text-white bg-brand px-3 py-2 rounded-full no-underline"
      >
        {isca.botao}
      </Link>
      <button
        aria-label="Fechar"
        className="shrink-0 text-gray px-2 py-1 text-lg leading-none"
        onClick={() => {
          try {
            window.sessionStorage.setItem("barra_isca_fechada", "1");
          } catch {}
          setFechada(true);
        }}
      >
        ×
      </button>
    </div>
  );
}
