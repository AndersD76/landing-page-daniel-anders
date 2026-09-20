import type { Metadata } from "next";
import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import { BASE_URL } from "@/data/custos";
import { fonteMercado, setoresIndexaveis } from "@/data/setores-paginas";

const URL = `${BASE_URL}/sistema-para`;

export const metadata: Metadata = {
  title: {
    absolute: "Sistema Sob Medida por Setor: O Que Muda e Quanto Custa",
  },
  description:
    "O que o sistema de cada setor precisa ter, com dado de mercado do IBGE e faixa de preço real. Clínicas, restaurantes, transportadoras, imobiliárias e mais.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Sistema Sob Medida por Setor: O Que Muda e Quanto Custa",
    description:
      "Módulos, dor operacional e faixa de preço por setor, com dado do CEMPRE/IBGE.",
    url: URL,
    type: "website",
  },
};

export default function SistemaParaHub() {
  const ordenados = [...setoresIndexaveis].sort(
    (a, b) => b.dado.empresasBrasil - a.dado.empresasBrasil
  );

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Sistema para", item: URL },
    ],
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: ordenados.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.conteudo.nome,
      url: p.url,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <PageNavbar
        links={[{ href: "/quanto-custa", label: "Quanto custa" }]}
        cta={{ href: "/calculadora-app", label: "CALCULAR AGORA" }}
        narrow
      />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
        <div className="flex items-center gap-2 text-sm text-gray mb-8">
          <Link href="/" className="hover:text-brand transition-colors no-underline text-gray">
            Início
          </Link>
          <span className="text-gray/50">/</span>
          <span className="text-foreground">Sistema para</span>
        </div>

        <header className="mb-12">
          <span className="text-xs font-bold tracking-[4px] text-brand uppercase mb-4 block">
            POR SETOR
          </span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5">
            O que muda no sistema de cada setor
          </h1>
          <p className="text-lg text-gray leading-relaxed">
            Sistema de clínica e sistema de oficina não são o mesmo software com
            outro nome. Cada página abre os módulos que aquele setor precisa, a
            dor operacional que o sistema resolve e a faixa de preço do escopo
            típico — com o tamanho do mercado vindo do IBGE.
          </p>
          <p className="text-xs text-gray mt-4">
            Dado de mercado:{" "}
            <a
              href={fonteMercado.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:text-brand-bright transition-colors"
            >
              {fonteMercado.nome}
            </a>
            , ano de referência {fonteMercado.anoReferencia} — atualizado em{" "}
            <time dateTime={fonteMercado.carregadoEm}>
              {fonteMercado.carregadoEm.split("-").reverse().join("/")}
            </time>
            .
          </p>
        </header>

        <section className="mb-12">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {ordenados.map((p) => (
              <Link
                key={p.slug}
                href={`/sistema-para/${p.slug}`}
                className="glass-card no-underline group"
              >
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h2 className="font-heading text-base font-bold text-foreground group-hover:text-brand transition-colors">
                    {p.conteudo.nome}
                  </h2>
                  <span className="text-xs text-gray whitespace-nowrap tabular-nums">
                    CNAE {p.dado.cnae}
                  </span>
                </div>
                <p className="text-sm text-gray leading-relaxed mb-3">
                  {p.conteudo.oQueOSistemaPrecisa[0]}.
                </p>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-3 border-t border-white/[0.06]">
                  <span className="text-xs text-gray tabular-nums">
                    {p.dado.empresasBrasil.toLocaleString("pt-BR")} empresas
                  </span>
                  <span className="text-xs font-bold text-brand whitespace-nowrap">
                    {p.preco.faixa}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="text-center py-12">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Seu setor não está <span className="text-brand">na lista?</span>
          </h2>
          <p className="text-gray mb-8">
            A faixa de preço não depende do setor — depende do escopo. Use a
            calculadora e veja o número do seu projeto em 1 minuto.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/calculadora-app" className="cta-btn">
              CALCULAR MEU SISTEMA
            </Link>
            <Link
              href="/quanto-custa"
              className="text-sm text-gray hover:text-brand transition-colors no-underline"
            >
              ou ver o custo por tipo de projeto
            </Link>
          </div>
        </section>
      </main>

      <PageFooter narrow />
    </>
  );
}
