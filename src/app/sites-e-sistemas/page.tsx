import type { Metadata } from "next";
import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import { BASE_URL } from "@/data/custos";
import {
  cidadesIndexaveis,
  cidadesPorRegiao,
  fonteCidades,
} from "@/data/cidades";

const URL = `${BASE_URL}/sites-e-sistemas`;

export const metadata: Metadata = {
  title: {
    absolute: "Criação de Sites e Sistemas no RS — Por Cidade e Perfil",
  },
  description:
    "Quantas empresas existem em cada cidade do Rio Grande do Sul, o que elas fazem e que sistema faz sentido ali. Dado do CEMPRE/IBGE por município, com faixa de preço real.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Criação de Sites e Sistemas no RS — Por Cidade",
    description:
      "Perfil econômico de cada município gaúcho e o sistema que tende a se pagar ali.",
    url: URL,
    type: "website",
  },
};

export default function SitesESistemasHub() {
  const regioes = cidadesPorRegiao();
  const totalEmpresas = cidadesIndexaveis.reduce(
    (s, p) => s + p.cidade.empresas,
    0
  );

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Por cidade", item: URL },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <PageNavbar
        links={[{ href: "/sistema-para", label: "Por setor" }]}
        cta={{ href: "/calculadora-site", label: "CALCULAR AGORA" }}
        narrow
      />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
        <div className="flex items-center gap-2 text-sm text-gray mb-8">
          <Link href="/" className="hover:text-brand transition-colors no-underline text-gray">
            Início
          </Link>
          <span className="text-gray/50">/</span>
          <span className="text-foreground">Por cidade</span>
        </div>

        <header className="mb-12">
          <span className="text-xs font-bold tracking-[4px] text-brand uppercase mb-4 block">
            RIO GRANDE DO SUL
          </span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5">
            Sites e sistemas por cidade
          </h1>
          <p className="text-lg text-gray leading-relaxed mb-4">
            O preço de um site não muda em Carazinho. O que muda é{" "}
            <em>qual</em> sistema se paga ali — e isso vem do perfil econômico
            da cidade, não do CEP. Cada página abre quantas empresas existem no
            município, o que elas fazem, e em que esse perfil difere da média do
            estado.
          </p>
          <p className="text-sm text-gray leading-relaxed">
            São {cidadesIndexaveis.length} municípios gaúchos com porte
            suficiente para sustentar análise própria, somando{" "}
            {totalEmpresas.toLocaleString("pt-BR")} empresas. Cidades abaixo de{" "}
            {fonteCidades.minEmpresas.toLocaleString("pt-BR")} empresas ficam de
            fora porque a amostra não sustenta comparação honesta.
          </p>
          <p className="text-xs text-gray mt-4">
            Fonte:{" "}
            <a
              href={fonteCidades.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:text-brand-bright transition-colors"
            >
              {fonteCidades.nome}
            </a>
            , ano de referência {fonteCidades.anoReferencia} — atualizado em{" "}
            <time dateTime={fonteCidades.carregadoEm}>
              {fonteCidades.carregadoEm.split("-").reverse().join("/")}
            </time>
            .
          </p>
        </header>

        {regioes.map(({ regiao, cidades }) => (
          <section key={regiao} className="mb-12">
            <h2 className="font-heading text-xl md:text-2xl font-bold mb-5">
              {regiao}{" "}
              <span className="text-gray font-normal text-base">
                ({cidades.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {cidades.map((p) => (
                <Link
                  key={p.slug}
                  href={`/sites-e-sistemas/${p.slug}`}
                  className="flex items-baseline justify-between gap-2 px-4 py-3 border border-white/[0.08] rounded-xl no-underline hover:border-brand/30 transition-colors group"
                >
                  <span className="text-sm text-foreground group-hover:text-brand transition-colors truncate">
                    {p.cidade.nome}
                  </span>
                  <span className="text-xs text-gray whitespace-nowrap tabular-nums shrink-0">
                    {p.cidade.empresas.toLocaleString("pt-BR")}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="text-center py-12">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Sua cidade não está <span className="text-brand">na lista?</span>
          </h2>
          <p className="text-gray mb-8">
            O atendimento é remoto e vale para qualquer lugar do Brasil. A lista
            cobre só os municípios com dado suficiente para análise própria.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/calculadora-site" className="cta-btn">
              CALCULAR MEU PROJETO
            </Link>
            <Link
              href="/sistema-para"
              className="text-sm text-gray hover:text-brand transition-colors no-underline"
            >
              ou ver o que muda por setor
            </Link>
          </div>
        </section>
      </main>

      <PageFooter narrow />
    </>
  );
}
