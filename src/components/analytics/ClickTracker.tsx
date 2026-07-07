"use client";

import { useEffect } from "react";
import { trackEvent } from "./Analytics";

/**
 * Rastreador global de cliques em CTAs. Um unico listener no document
 * cobre todos os links do site (inclusive em Server Components):
 * - cal.com        -> click_agendar_call
 * - wa.me          -> whatsapp_click
 * - [data-track]   -> evento customizado (ex: blog_cta_click)
 */
export function ClickTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      const page = window.location.pathname;

      const customEvent = anchor.getAttribute("data-track");
      if (customEvent) {
        trackEvent(customEvent, {
          page,
          source: anchor.getAttribute("data-track-source") || page,
        });
        return;
      }

      if (href.includes("cal.com")) {
        trackEvent("click_agendar_call", { page });
      } else if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
        trackEvent("whatsapp_click", { page });
      }
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
