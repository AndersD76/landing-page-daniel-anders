import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Investimento — Estime o Custo do Seu Projeto",
  description:
    "Calcule o investimento estimado para seu projeto de desenvolvimento web. Landing pages, web apps, SaaS, dashboards, e-commerce e APIs. Estimativa em tempo real com base no tipo, funcionalidades e prazo.",
  keywords: [
    "calculadora preço desenvolvimento",
    "quanto custa um app",
    "preço desenvolvimento web",
    "orçamento site",
    "orçamento saas",
    "custo mvp",
    "calculadora investimento projeto",
    "desenvolvimento sob medida preço",
  ],
  openGraph: {
    title: "Calculadora de Investimento — Estime o Custo do Seu Projeto",
    description:
      "Estime o custo do seu projeto em 3 passos: tipo, funcionalidades e prazo. Cálculo em tempo real.",
    url: "https://andersdev.com.br/apps/calculadora",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Daniel Anders — Calculadora de Investimento",
      },
    ],
  },
  alternates: {
    canonical: "https://andersdev.com.br/apps/calculadora",
  },
};

export default function CalculadoraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
