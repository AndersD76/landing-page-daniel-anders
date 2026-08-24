"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie_consent";

type ConsentStatus = "granted" | "denied" | null;

function getStoredConsent(): ConsentStatus {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(CONSENT_KEY);
  if (v === "granted" || v === "denied") return v;
  return null;
}

function updateGtagConsent(status: "granted" | "denied") {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: status,
      ad_storage: status,
      ad_user_data: status,
      ad_personalization: status,
    });
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      updateGtagConsent(stored);
    } else {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "granted");
    updateGtagConsent("granted");
    window.dispatchEvent(new CustomEvent("consent_update", { detail: "granted" }));
    setVisible(false);
  }

  function deny() {
    localStorage.setItem(CONSENT_KEY, "denied");
    updateGtagConsent("denied");
    window.dispatchEvent(new CustomEvent("consent_update", { detail: "denied" }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[700] bg-[#0f1729] border border-white/10 rounded-xl p-5 shadow-2xl animate-fade-up">
      <p className="text-sm text-gray-300 leading-relaxed mb-4">
        Este site usa cookies para analytics (Google Analytics).
        Seus dados não são compartilhados com terceiros.{" "}
        <a href="/privacidade" className="underline text-gray-200 hover:text-white">
          Política de Privacidade
        </a>
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={accept}
          className="flex-1 text-xs font-bold text-white bg-brand px-4 py-2.5 rounded-lg hover:bg-brand-bright transition-colors"
        >
          ACEITAR
        </button>
        <button
          onClick={deny}
          className="flex-1 text-xs font-bold text-gray-400 border border-white/10 px-4 py-2.5 rounded-lg hover:text-white hover:border-white/20 transition-colors"
        >
          RECUSAR
        </button>
      </div>
    </div>
  );
}
