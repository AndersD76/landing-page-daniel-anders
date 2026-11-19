import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Terceiros só carregam com consentimento (Analytics.tsx); aqui apenas se permite.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://us-assets.i.posthog.com https://eu-assets.i.posthog.com https://plausible.io https://www.clarity.ms https://scripts.clarity.ms",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://us.i.posthog.com https://eu.i.posthog.com https://us-assets.i.posthog.com https://eu-assets.i.posthog.com https://plausible.io https://*.clarity.ms",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Host canônico. Hoje o apex nem resolve no DNS, então isto é rede de
  // segurança: se um dia apontar para o app, redireciona em vez de servir o
  // site em dois hostnames e dividir o sinal entre eles.
  redirects: async () => [
    {
      source: "/:path*",
      has: [{ type: "host", value: "andersdev.com.br" }],
      destination: "https://www.andersdev.com.br/:path*",
      permanent: true,
    },
  ],
  headers: async () => [
    {
      // /embed/* é feito para ser embutido em outros sites (gráficos com
      // atribuição): define o próprio CSP com frame-ancestors * na resposta.
      source: "/((?!embed/).*)",
      headers: securityHeaders,
    },
  ],
  poweredByHeader: false,
};

export default nextConfig;
