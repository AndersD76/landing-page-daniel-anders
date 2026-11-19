"use client";

import { useEffect, useState } from "react";
import {
  EVENTO_ABRIR_PREFERENCIAS,
  aplicarConsentModeGoogle,
  lerConsentimento,
  salvarConsentimento,
} from "@/lib/telemetria/consentimento";

/**
 * Banner de consentimento granular (LGPD).
 *
 * Três botões com o mesmo peso visual — recusar é tão fácil quanto aceitar.
 * "Personalizar" abre as duas escolhas separadas (analytics, marketing), as
 * duas desmarcadas. Reabre pelo link "Preferências de cookies" do rodapé.
 */
export function CookieConsent() {
  const [aberto, setAberto] = useState(false);
  const [detalhes, setDetalhes] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const atual = lerConsentimento();
    if (atual) aplicarConsentModeGoogle(atual);
    // Sem escolha registrada: abre o banner (localStorage só existe no cliente).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else setAberto(true);
    const reabrir = () => {
      const c = lerConsentimento();
      setAnalytics(c?.analytics ?? false);
      setMarketing(c?.marketing ?? false);
      setDetalhes(true);
      setAberto(true);
    };
    window.addEventListener(EVENTO_ABRIR_PREFERENCIAS, reabrir);
    return () => window.removeEventListener(EVENTO_ABRIR_PREFERENCIAS, reabrir);
  }, []);

  function decidir(escolha: { analytics: boolean; marketing: boolean }) {
    salvarConsentimento(escolha);
    setAberto(false);
  }

  if (!aberto) return null;

  const botao =
    "flex-1 text-xs font-bold px-3 py-2.5 rounded-lg border transition-colors";

  return (
    <div
      role="dialog"
      aria-label="Preferências de cookies"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[700] bg-[#0f1729] border border-white/10 rounded-xl p-5 shadow-2xl"
    >
      <p className="text-sm text-gray-300 leading-relaxed mb-3">
        Usamos medição própria sem dados pessoais. Ferramentas de terceiros (Google Analytics e
        similares) só carregam se você permitir.{" "}
        <a href="/privacidade" className="underline text-gray-200 hover:text-white">
          Política de Privacidade
        </a>
      </p>

      {detalhes && (
        <div className="space-y-3 mb-4">
          <label className="flex items-start gap-3 text-sm text-gray-300">
            <input type="checkbox" checked disabled className="mt-1" />
            <span>
              <strong className="text-gray-100">Necessários</strong> — sessão anônima da aba e esta
              escolha. Sempre ativos.
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="mt-1"
            />
            <span>
              <strong className="text-gray-100">Analytics</strong> — Google Analytics 4 e ferramentas de
              medição de uso, com cookies.
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-1"
            />
            <span>
              <strong className="text-gray-100">Marketing</strong> — sinais para anúncios e remarketing.
            </span>
          </label>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => decidir({ analytics: false, marketing: false })}
          className={`${botao} text-gray-200 border-white/20 hover:border-white/40`}
        >
          RECUSAR
        </button>
        {detalhes ? (
          <button
            onClick={() => decidir({ analytics, marketing })}
            className={`${botao} text-gray-200 border-white/20 hover:border-white/40`}
          >
            SALVAR ESCOLHA
          </button>
        ) : (
          <button
            onClick={() => setDetalhes(true)}
            className={`${botao} text-gray-200 border-white/20 hover:border-white/40`}
          >
            PERSONALIZAR
          </button>
        )}
        <button
          onClick={() => decidir({ analytics: true, marketing: true })}
          className={`${botao} text-white bg-brand border-brand hover:bg-brand-bright`}
        >
          ACEITAR TODOS
        </button>
      </div>
    </div>
  );
}
