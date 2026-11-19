"use client";

import { useEffect } from "react";
import { trackEvent } from "./Analytics";
import { rastrear } from "@/lib/telemetria/cliente";
import { ehEventoValido } from "@/lib/telemetria/eventos";

/**
 * Rastreador global de cliques. Um único listener no document cobre todos os
 * links do site (inclusive em Server Components):
 * - cal.com        -> call_clicada
 * - wa.me          -> whatsapp_clicado
 * - [data-track]   -> evento da taxonomia (ex.: cta_produto_clicado) ou legado
 */
export function ClickTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      const page = window.location.pathname;
      const custom = anchor.getAttribute("data-track");
      if (custom) {
        const props = {
          destino: href.slice(0, 200),
          isca_id: anchor.getAttribute("data-isca") || undefined,
          origem: anchor.getAttribute("data-track-source") || page,
        };
        if (ehEventoValido(custom)) rastrear(custom, props);
        else trackEvent(custom, { page, source: props.origem });
        return;
      }

      if (href.includes("cal.com")) rastrear("call_clicada", { destino: "cal.com" });
      else if (href.includes("wa.me") || href.includes("api.whatsapp.com")) rastrear("whatsapp_clicado", { destino: "whatsapp" });
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
