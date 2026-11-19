/**
 * Consentimento granular (LGPD): analytics e marketing são escolhas separadas.
 * Sem escolha registrada, nada opcional carrega — o padrão é negado.
 *
 * Necessários (sempre ativos, sem cookie): sessão anônima da aba para a
 * medição própria sem dado pessoal e a preferência de consentimento em si.
 */

export interface Consentimento {
  v: 2;
  analytics: boolean;
  marketing: boolean;
  em: string;
}

const CHAVE = "consentimento_v2";
const CHAVE_ANTIGA = "cookie_consent";
export const EVENTO_CONSENTIMENTO = "consentimento_atualizado";
export const EVENTO_ABRIR_PREFERENCIAS = "abrir_preferencias_cookies";

export function lerConsentimento(): Consentimento | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CHAVE);
    if (raw) return JSON.parse(raw) as Consentimento;
    // Migração do banner antigo: ele pedia só "analytics (Google Analytics)".
    const antigo = window.localStorage.getItem(CHAVE_ANTIGA);
    if (antigo === "granted" || antigo === "denied") {
      const c: Consentimento = { v: 2, analytics: antigo === "granted", marketing: false, em: new Date().toISOString() };
      window.localStorage.setItem(CHAVE, JSON.stringify(c));
      window.localStorage.removeItem(CHAVE_ANTIGA);
      return c;
    }
  } catch {
    /* storage bloqueado: trata como sem escolha */
  }
  return null;
}

export function temAnalytics(): boolean {
  return lerConsentimento()?.analytics === true;
}

export function temMarketing(): boolean {
  return lerConsentimento()?.marketing === true;
}

/** Atualiza Consent Mode v2 do Google com a escolha atual. */
export function aplicarConsentModeGoogle(c: Pick<Consentimento, "analytics" | "marketing">) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: c.marketing ? "granted" : "denied",
    ad_user_data: c.marketing ? "granted" : "denied",
    ad_personalization: c.marketing ? "granted" : "denied",
  });
}

export function salvarConsentimento(escolha: { analytics: boolean; marketing: boolean }) {
  const c: Consentimento = { v: 2, ...escolha, em: new Date().toISOString() };
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(c));
  } catch {
    /* sem storage, a escolha vale só para esta página */
  }
  if (!c.analytics) {
    // Revogação: apaga o first-touch persistido e os cookies do GA neste domínio.
    try {
      window.localStorage.removeItem("ad_ft_v1");
    } catch {}
    for (const nome of document.cookie.split(";").map((x) => x.split("=")[0].trim())) {
      if (nome.startsWith("_ga") || nome.startsWith("ph_")) {
        document.cookie = `${nome}=; Max-Age=0; path=/; domain=.andersdev.com.br`;
        document.cookie = `${nome}=; Max-Age=0; path=/`;
      }
    }
  }
  aplicarConsentModeGoogle(c);
  window.dispatchEvent(new CustomEvent(EVENTO_CONSENTIMENTO, { detail: c }));
}

export function abrirPreferencias() {
  window.dispatchEvent(new Event(EVENTO_ABRIR_PREFERENCIAS));
}
