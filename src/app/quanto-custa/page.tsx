import type { Metadata } from "next";
import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import { BASE_URL, paginasIndexaveis } from "@/data/custos";
import { configSite, formatDataCarga, FONTE_PRECIFICACAO } from "@/lib/calculadora";

const URL = `${BASE_URL}/quanto-custa`;

export const metadata: Metadata = {
  title: { absolute: "Quanto Custa: Site, App e Sistema em 2026 — Faixas Reais" },
  description:
    "Faixas de preço reais para landing page, site institucional, e-commerce, app mobile, MVP de SaaS e sistema completo. Com o que entra em cada uma e o que encarece.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Quanto Custa: Site, App e Sistema em 2026",
    description:
      "Faixas de preço reais por tipo de projeto e por integração, com breakdown do que compõe o valor.",
    url: URL,
    type: "website",
  },
};

export default function QuantoCustaHub() {
  const tipos = paginasIndexaveis.filter((p) => p.kind === "tipo");
  const sites = tipos.filter((p) => p.tipo.variante === "site");
  const apps = tipos.filter((p) => p.tipo.variante === "app");

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Quanto custa", item: URL },
    ],
  };

  const grupos = [
    { titulo: "Site e loja virtual", paginas: sites },
    { titulo: "App, sistema e SaaS", paginas: apps },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <PageNavbar
        links={[{ href: "/blog", label: "Blog" }]}
        cta={{ href: "/calculadora-site", label: "CALCULAR AGORA" }}
        narrow
      />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
        <div className="flex items-center gap-2 text-sm text-gray mb-8">
          <Link href="/" className="hover:text-brand transition-colors no-underline text-gray">
            Início
          </Link>
          <span className="text-gray/50">/</span>
          <span className="text-foreground">Quanto custa</span>
        </div>

        <header className="mb-12">
          <span className="text-xs font-bold tracking-[4px] text-brand uppercase mb-4 block">
            FAIXAS REAIS
          </span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5">
            Quanto custa cada tipo de projeto em 2026
          </h1>
          <p className="text-lg text-gray leading-relaxed">
            Cada página abre a faixa de um tipo de projeto, com o que entra, o
            que fica de fora e onde o orçamento costuma estourar. Os números
            saem do mesmo modelo que alimenta as calculadoras — não são
            &quot;a partir de&quot; e não mudam conforme quem pergunta.
          </p>
          <p className="text-xs text-gray mt-4">
            Fonte: {FONTE_PRECIFICACAO} — atualizado em{" "}
            <time dateTime={configSite.atualizadoEm}>
              {formatDataCarga(configSite.atualizadoEm)}
            </time>
            .
          </p>
        </header>

        {grupos.map((grupo) => (
          <section key={grupo.titulo} className="mb-12">
            <h2 className="font-heading text-2xl font-bold mb-6">
              {grupo.titulo}
            </h2>
            <div className="flex flex-col gap-4">
              {grupo.paginas.map((p) => {
                const filhas = paginasIndexaveis.filter(
                  (c) => c.kind === "combo" && c.tipo.slug === p.tipo.slug
                );
                return (
                  <div key={p.url} className="glass-card">
                    <Link
                      href={`/quanto-custa/${p.tipo.slug}`}
                      className="no-underline group block"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                        <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-brand transition-colors">
                          {p.tipo.nome}
                        </h3>
                        <span className="font-heading font-bold text-brand whitespace-nowrap">
                          {p.preco.faixa}
                        </span>
                      </div>
                      <p className="text-sm text-gray leading-relaxed">
                        {p.tipo.intro[0].split(". ")[0]}.
                      </p>
                    </Link>

                    {filhas.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                        {filhas.map((c) => (
                          <Link
                            key={c.url}
                            href={`/quanto-custa/${c.slugPath.join("/")}`}
                            className="text-xs text-brand/80 bg-brand/[0.08] px-3 py-1.5 rounded-full no-underline hover:bg-brand/[0.14] transition-colors"
                          >
                            com {c.combo?.nomeCurto}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <section className="text-center py-12">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Quer o número do <span className="text-brand">seu</span> projeto?
          </h2>
          <p className="text-gray mb-8">
            A calculadora ajusta escopo, integrações e prazo e mostra a faixa na
            tela — sem cadastro para ver o resultado.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/calculadora-site" className="cta-btn">
              CALCULAR SITE
            </Link>
            <Link href="/calculadora-app" className="cta-btn">
              CALCULAR APP
            </Link>
          </div>
          <p className="text-sm text-gray mt-8">
            Prefere ver pelo seu ramo de atividade?{" "}
            <Link
              href="/sistema-para"
              className="text-brand hover:text-brand-bright transition-colors"
            >
              Veja o que muda no sistema de cada setor
            </Link>
            .
          </p>
        </section>
      </main>

      <PageFooter narrow />
    </>
  );
}
