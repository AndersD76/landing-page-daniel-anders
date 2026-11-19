"use client";

import { abrirPreferencias } from "@/lib/telemetria/consentimento";

/** Reabre o banner de consentimento — revogar tem que ser tão fácil quanto aceitar. */
export function BotaoPreferencias({ className }: { className?: string }) {
  return (
    <button type="button" onClick={abrirPreferencias} className={className}>
      Preferências de cookies
    </button>
  );
}
