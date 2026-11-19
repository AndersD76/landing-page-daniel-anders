"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  EVENTO_CONSENTIMENTO,
  lerConsentimento,
  type Consentimento,
} from "@/lib/telemetria/consentimento";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

/**
 * Compatibilidade: componentes antigos chamam trackEvent(nome, params).
 * Vai para GA4/Plausible só com consentimento; a taxonomia nova usa
 * rastrear() de @/lib/telemetria/cliente, que também grava a cópia local.
 */
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined" || lerConsentimento()?.analytics !== true) return;
  if (GA_MEASUREMENT_ID && typeof window.gtag === "function") window.gtag("event", eventName, params);
  if (PLAUSIBLE_DOMAIN && typeof window.plausible === "function") window.plausible(eventName, { props: params });
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    plausible: (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

/**
 * Carregamento conforme LGPD (Consent Mode v2, modo básico):
 * - o padrão "denied" é declarado antes de qualquer tag;
 * - gtag.js, PostHog, Clarity e Plausible só são baixados DEPOIS do
 *   consentimento de analytics — sem escolha, nenhum script de terceiro roda;
 * - sinais de anúncio (ad_*) só com consentimento de marketing.
 */
export function Analytics() {
  const [consent, setConsent] = useState<Consentimento | null>(null);

  useEffect(() => {
    const atualizar = () => setConsent(lerConsentimento());
    atualizar();
    const onConsent = (e: Event) => setConsent((e as CustomEvent<Consentimento>).detail);
    window.addEventListener(EVENTO_CONSENTIMENTO, onConsent);
    window.addEventListener("storage", atualizar);
    return () => {
      window.removeEventListener(EVENTO_CONSENTIMENTO, onConsent);
      window.removeEventListener("storage", atualizar);
    };
  }, []);

  const analytics = consent?.analytics === true;
  const marketing = consent?.marketing === true;

  return (
    <>
      {GA_MEASUREMENT_ID && (
        <Script id="ga4-consent-default" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`}
        </Script>
      )}

      {GA_MEASUREMENT_ID && analytics && (
        <>
          <Script id="ga4-consent-update" strategy="afterInteractive">
            {`gtag('consent','update',{analytics_storage:'granted',ad_storage:'${marketing ? "granted" : "denied"}',ad_user_data:'${marketing ? "granted" : "denied"}',ad_personalization:'${marketing ? "granted" : "denied"}'});`}
          </Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}
          </Script>
        </>
      )}

      {POSTHOG_KEY && analytics && (
        <Script id="posthog-init" strategy="lazyOnload">
          {`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('${POSTHOG_KEY}',{api_host:'${POSTHOG_HOST}',person_profiles:'identified_only',capture_pageview:true,autocapture:false,mask_all_text:false,session_recording:{maskAllInputs:true,maskTextSelector:'[data-pii]'}});`}
        </Script>
      )}

      {PLAUSIBLE_DOMAIN && analytics && (
        <Script defer data-domain={PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" strategy="lazyOnload" />
      )}

      {CLARITY_ID && analytics && (
        <Script id="clarity-init" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      )}
    </>
  );
}
