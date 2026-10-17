"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { enviarPageview } from "@/lib/attribution";

/**
 * Dispara pageview na coleta própria a cada mudança de rota.
 *
 * Fica separado do AttributionTracker porque este precisa reagir à navegação,
 * e por isso depende de useSearchParams — que exige Suspense no App Router.
 */
export function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const qs = searchParams?.toString();
    enviarPageview(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, searchParams]);

  return null;
}
