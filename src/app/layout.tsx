import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/context";
import { Analytics } from "@/components/analytics/Analytics";
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
  metadataBase: new URL("https://andersdev.com.br"),
  title: {
    default: "Daniel Anders | Full-Stack Developer & Business Consultant",
    template: "%s | Daniel Anders Dev",
  },
  description:
    "Desenvolvedor Full-Stack especializado em React, Next.js, TypeScript, Python e FastAPI. Construindo MVPs SaaS, dashboards e aplicações web para startups e empresas no mundo todo.",
  keywords: [
    "full-stack developer",
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "FastAPI",
    "SaaS",
    "MVP",
    "web development",
    "freelance developer",
    "Daniel Anders",
    "desenvolvedor",
  ],
  authors: [{ name: "Daniel Anders" }],
  creator: "Daniel Anders",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: "en_US",
    url: "https://andersdev.com.br",
    siteName: "Daniel Anders Dev",
    title: "Daniel Anders | Full-Stack Developer & Business Consultant",
    description:
      "Construindo aplicações web modernas com React, Next.js, TypeScript e Python. Disponível para projetos freelance no mundo todo.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Daniel Anders - Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Anders | Full-Stack Developer",
    description:
      "React, Next.js, TypeScript, Python. Building web apps for startups worldwide.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://andersdev.com.br",
  },
};

const schemaOrg = [
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Daniel Anders - Full-Stack Developer",
    description:
      "Full-Stack Developer specializing in React, Next.js, TypeScript, Python, and FastAPI.",
    url: "https://andersdev.com.br",
    telephone: "+55-54-99964-8368",
    email: "danielanders76@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Passo Fundo",
      addressRegion: "RS",
      addressCountry: "BR",
    },
    founder: {
      "@type": "Person",
      name: "Daniel Anders",
      jobTitle: "Full-Stack Developer & Business Consultant",
      url: "https://andersdev.com.br",
      sameAs: [
        "https://github.com/AndersD76",
        "https://linkedin.com/in/danielandersbrrs",
      ],
    },
    areaServed: "Worldwide",
    serviceType: [
      "Web Development",
      "SaaS Development",
      "API Integration",
      "Business Consulting",
      "Dashboard Development",
      "AI Integration",
      "Payment System Integration",
      "Cloud & DevOps",
    ],
    sameAs: [
      "https://github.com/AndersD76",
      "https://linkedin.com/in/danielandersbrrs",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Daniel Anders",
    jobTitle: "Full-Stack Developer & Business Consultant",
    url: "https://andersdev.com.br",
    email: "danielanders76@gmail.com",
    telephone: "+55-54-99964-8368",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Passo Fundo",
      addressRegion: "RS",
      addressCountry: "BR",
    },
    alumniOf: "Electrical Engineering",
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "SaaS Development",
      "Business Consulting",
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
        name: "What technologies does Daniel Anders work with?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "React, Next.js 14, TypeScript, Python, FastAPI, Node.js, PostgreSQL, Prisma, Tailwind CSS, Docker, Vercel, Railway, AWS, and AI integrations with OpenAI and Claude.",
        },
      },
      {
        "@type": "Question",
        name: "How long does it take to build an MVP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most MVPs are delivered in 2-6 weeks depending on complexity. Simple web apps take 2-3 weeks, while full SaaS platforms with auth, payments, and dashboards take 4-6 weeks.",
        },
      },
      {
        "@type": "Question",
        name: "Does Daniel Anders work with international clients?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Based in Brazil, Daniel works remotely with clients worldwide. Communication is in English or Portuguese, with weekly demos and async updates.",
        },
      },
      {
        "@type": "Question",
        name: "How much does a freelance web development project cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Projects typically range from $500 to $5,000+ depending on scope. A free 15-minute discovery call helps define requirements and provide an accurate estimate.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Daniel Anders - Full-Stack Development Services",
    description:
      "Full-stack web development, SaaS MVPs, dashboards, API integrations, and business consulting.",
    brand: { "@type": "Brand", name: "AndersD76" },
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
          "Delivered the project ahead of schedule with quality above expectations. Understands business, not just code.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Carlos S." },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody:
          "The IoT system he built saved thousands in raw material losses. 24/7 monitoring with instant alerts.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Ana L." },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody:
          "Flawless communication. Every week there was a working demo. Never worked with a dev who understood business so well.",
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
        <Analytics />
      </body>
    </html>
  );
}
