import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/context";
import { Analytics } from "@/components/analytics/Analytics";
import { ClickTracker } from "@/components/analytics/ClickTracker";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
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
      "AndersDev | Desenvolvimento de Sites, Apps e Sistemas | Passo Fundo RS",
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
      "AndersDev | Desenvolvimento de Sites, Apps e Sistemas | Passo Fundo RS",
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

const schemaOrg = [
  {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    name: "AndersDev — Desenvolvimento de Software",
    description:
      "Desenvolvimento de sites, aplicativos mobile, sistemas web, e-commerce e automação em Passo Fundo e região. +15 anos de experiência em tecnologia e negócios.",
    url: "https://www.andersdev.com.br",
    telephone: "+55-54-99964-8368",
    email: "danielanders76@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rua Uruguai, 679 - Sala 201",
      addressLocality: "Passo Fundo",
      addressRegion: "RS",
      postalCode: "99010-112",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -28.2625,
      longitude: -52.4069,
    },
    areaServed: [
      { "@type": "City", name: "Passo Fundo" },
      { "@type": "State", name: "Rio Grande do Sul" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    founder: {
      "@type": "Person",
      name: "Daniel Anders",
      jobTitle: "Desenvolvedor Full-Stack & Consultor de Negócios",
      url: "https://www.andersdev.com.br",
      sameAs: [
        "https://github.com/AndersD76",
        "https://linkedin.com/in/danielandersbrrs",
      ],
    },
    serviceType: [
      "Desenvolvimento de Sites",
      "Aplicativos Mobile",
      "Sistemas Web",
      "E-commerce",
      "Automação Empresarial",
      "SaaS e MVP",
      "Dashboards e Analytics",
      "Integração de APIs",
    ],
    priceRange: "$$",
    sameAs: [
      "https://github.com/AndersD76",
      "https://linkedin.com/in/danielandersbrrs",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Daniel Anders",
    jobTitle: "Desenvolvedor Full-Stack & Consultor de Negócios",
    url: "https://www.andersdev.com.br",
    email: "danielanders76@gmail.com",
    telephone: "+55-54-99964-8368",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rua Uruguai, 679 - Sala 201",
      addressLocality: "Passo Fundo",
      addressRegion: "RS",
      postalCode: "99010-112",
      addressCountry: "BR",
    },
    alumniOf: "Engenharia Elétrica",
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Desenvolvimento SaaS",
      "Consultoria de Negócios",
      "ISO 9001",
    ],
    sameAs: [
      "https://github.com/AndersD76",
      "https://linkedin.com/in/danielandersbrrs",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quanto custa criar um site profissional em Passo Fundo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sites institucionais partem de R$ 2.500 e e-commerces de R$ 5.000, dependendo do escopo. A AndersDev oferece orçamento gratuito em uma conversa de 15 minutos para definir o que seu negócio precisa.",
        },
      },
      {
        "@type": "Question",
        name: "Quanto tempo leva para desenvolver um aplicativo ou sistema?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Um MVP funcional fica pronto em 2 a 6 semanas. Sites institucionais levam 1 a 2 semanas. Sistemas mais complexos com integrações e dashboards levam de 4 a 12 semanas.",
        },
      },
      {
        "@type": "Question",
        name: "A AndersDev atende empresas de outras cidades além de Passo Fundo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. Embora o escritório fique em Passo Fundo (RS), atendemos empresas de todo o Rio Grande do Sul e do Brasil com reuniões online, demos semanais e comunicação assíncrona.",
        },
      },
      {
        "@type": "Question",
        name: "Quais serviços de desenvolvimento a AndersDev oferece?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sites institucionais, e-commerce, aplicativos mobile, sistemas web sob medida, SaaS/MVP, dashboards, automação empresarial e integração de APIs (Stripe, WhatsApp, ERPs). Tecnologias: React, Next.js, TypeScript, Python, FastAPI, PostgreSQL.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "AndersDev — Serviços de Desenvolvimento de Software",
    description:
      "Desenvolvimento de sites, aplicativos, sistemas web, e-commerce e automação para empresas em Passo Fundo e região.",
    brand: { "@type": "Brand", name: "AndersDev" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "3",
      bestRating: "5",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Rafael M." },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody:
          "Entregou o projeto antes do prazo com qualidade acima das expectativas. Entende de negócio, não só de código.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Carlos S." },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody:
          "O sistema IoT que ele construiu economizou milhares em perdas de matéria-prima. Monitoramento 24/7 com alertas instantâneos.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Ana L." },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody:
          "Comunicação impecável. Toda semana tinha demo funcionando. Nunca trabalhei com um dev que entendesse tão bem de negócios.",
      },
    ],
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
        <Analytics />
        <ClickTracker />
      </body>
    </html>
  );
}
