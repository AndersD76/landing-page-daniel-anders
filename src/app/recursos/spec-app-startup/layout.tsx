import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Template Grátis: Especificação de App para Startups",
  description:
    "Baixe o template de especificação técnica para apps de startup. Documento pronto para preencher e alinhar escopo, prazos e custos com seu desenvolvedor.",
  keywords: [
    "template especificação app",
    "documento escopo startup",
    "spec app startup",
    "especificação técnica software",
  ],
  alternates: { canonical: "https://www.andersdev.com.br/recursos/spec-app-startup" },
  openGraph: {
    title: "Template Grátis: Especificação de App para Startups",
    description:
      "Documento pronto para preencher e alinhar escopo, prazos e custos com seu desenvolvedor.",
    url: "https://www.andersdev.com.br/recursos/spec-app-startup",
    type: "website",
  },
};

export default function LeadMagnetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
