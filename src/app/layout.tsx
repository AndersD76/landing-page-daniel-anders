import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/context";
import { Analytics } from "@/components/analytics/Analytics";
import { AttributionTracker } from "@/components/analytics/AttributionTracker";
import { PageviewTracker } from "@/components/analytics/PageviewTracker";
import { ClickTracker } from "@/components/analytics/ClickTracker";
import { CookieConsent } from "@/components/analytics/CookieConsent";
import { EngagementTracker } from "@/components/analytics/EngagementTracker";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { DesktopCtaBar } from "@/components/layout/DesktopCtaBar";
import { organizationJsonLd } from "@/data/autor";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.andersdev.com.br"),
  title: {
    default:
      "AndersDev | Sites, Apps e Sistemas | Passo Fundo RS",
    template: "%s | AndersDev — Passo Fundo RS",
  },
  description:
    "Desenvolvimento de sites, aplicativos mobile, sistemas web, e-commerce e automação em Passo Fundo e região. +15 anos de experiência. Orçamento gratuito.",
  keywords: [
    "desenvolvimento de sites passo fundo",
    "criar aplicativo passo fundo",
    "desenvolvimento de sistemas RS",
    "empresa de desenvolvimento de software passo fundo",
    "criar e-commerce passo fundo",
    "desenvolvimento web passo fundo",
    "aplicativo mobile passo fundo",
    "sistema personalizado passo fundo",
    "automação empresarial RS",
    "site institucional passo fundo",
    "loja virtual passo fundo",
    "software sob medida RS",
    "AndersDev",
    "Daniel Anders",
  ],
  authors: [{ name: "Daniel Anders" }],
  creator: "AndersDev",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.andersdev.com.br",
    siteName: "AndersDev",
    title:
      "AndersDev | Sites, Apps e Sistemas | Passo Fundo RS",
    description:
      "Sites, aplicativos, sistemas web, e-commerce e automação para empresas em Passo Fundo e região. Orçamento gratuito.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AndersDev — Desenvolvimento de Software em Passo Fundo RS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AndersDev | Sites, Apps e Sistemas | Passo Fundo RS",
    description:
      "Desenvolvimento de sites, apps e sistemas para empresas. +15 anos de experiência. Passo Fundo, RS.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.andersdev.com.br",
  },
};

/**
 * JSON-LD global: só o que vale para TODAS as páginas — a organização e o
 * site. FAQPage, Article, HowTo etc. ficam nas páginas onde o conteúdo está
 * visível (antes havia FAQPage em todas as páginas sem FAQ na tela, o que
 * contraria as diretrizes de dados estruturados do Google).
 */
const schemaOrg = [
  { "@context": "https://schema.org", ...organizationJsonLd() },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.andersdev.com.br/#site",
    name: "AndersDev",
    url: "https://www.andersdev.com.br",
    inLanguage: "pt-BR",
    publisher: { "@id": "https://www.andersdev.com.br/#organizacao" },
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon-48.png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e63946" />
        {schemaOrg.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="bg-surface-black text-foreground font-body">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-brand focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold focus:no-underline"
        >
          Pular para o conteúdo
        </a>
        <I18nProvider>{children}</I18nProvider>
        <MobileCtaBar />
        <DesktopCtaBar />
        <Analytics />
        <AttributionTracker />
        <Suspense fallback={null}>
          <PageviewTracker />
        </Suspense>
        <ClickTracker />
        <EngagementTracker />
        <CookieConsent />
      </body>
    </html>
  );
}
