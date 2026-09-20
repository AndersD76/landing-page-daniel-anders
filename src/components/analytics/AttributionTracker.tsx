"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Grava a página de entrada da sessão no primeiro carregamento.
 * Não sobrescreve em navegações seguintes — entrada é a primeira, não a última.
 */
export function AttributionTracker() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
