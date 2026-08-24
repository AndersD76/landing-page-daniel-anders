"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && GA_MEASUREMENT_ID && window.gtag) {
    window.gtag("event", eventName, params);
  }

  if (typeof window !== "undefined" && PLAUSIBLE_DOMAIN && window.plausible) {
    window.plausible(eventName, { props: params });
  }
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    plausible: (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

export function Analytics() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent");
    if (stored === "granted") setConsentGranted(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "cookie_consent") {
        setConsentGranted(e.newValue === "granted");
      }
    };
    const onConsent = (e: Event) => {
      setConsentGranted((e as CustomEvent).detail === "granted");
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("consent_update", onConsent);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("consent_update", onConsent);
    };
  }, []);

  return (
    <>
      {/* Consent Mode v2 — default denied (loads before anything) */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script id="ga4-consent-default" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500,
              });
            `}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Plausible — only after consent */}
      {PLAUSIBLE_DOMAIN && consentGranted && (
        <Script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}

      {/* Microsoft Clarity — only after consent */}
      {CLARITY_ID && consentGranted && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}
        </Script>
      )}
    </>
  );
}
