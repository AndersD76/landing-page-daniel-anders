import type { Metadata } from "next";
import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import { BASE_URL } from "@/data/custos";
import { alternativasIndexaveis } from "@/data/alternativas-paginas";

const URL = `${BASE_URL}/alternativa-a`;

export const metadata: Metadata = {
  title: { absolute: "Alternativas a Wix, WordPress, Shopify e No-Code" },
  description:
    "Quando trocar a plataforma por um sistema próprio compensa de verdade. Calcule o ponto de virada com o que você paga hoje, sem preço de concorrente chutado.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Alternativas a Wix, WordPress, Shopify e No-Code",
    description:
      "Ponto de virada calculado com o seu custo atual, contra a faixa real de um projeto próprio.",
    url: URL,
    type: "website",
  },
};

export default function AlternativasHub() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Alternativas", item: URL },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <PageNavbar
        links={[{ href: "/quanto-custa", label: "Quanto custa" }]}
        cta={{ href: "/calculadora-site", label: "CALCULAR AGORA" }}
        narrow
      />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
        <div className="flex items-center gap-2 text-sm text-gray mb-8">
          <Link href="/" className="hover:text-brand transition-colors no-underline text-gray">
            Início
          </Link>
          <span className="text-gray/50">/</span>
          <span className="text-foreground">Alternativas</span>
        </div>

        <header className="mb-12">
          <span className="text-xs font-bold tracking-[4px] text-brand uppercase mb-4 block">
            PONTO DE VIRADA
          </span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5">
            Quando trocar de plataforma compensa
          </h1>
          <p className="text-lg text-gray leading-relaxed mb-4">
            Quase sempre a resposta é continuar onde está. Plataforma pronta
            resolve de verdade, e trocar sem um problema concreto só muda o
            problema de lugar. Estas páginas existem para a outra metade dos
            casos — quando a conta já virou e ninguém fez a conta.
          </p>
          <p className="text-sm text-gray leading-relaxed">
            Nenhuma delas publica o preço do concorrente: esse número muda sem
            aviso e eu estaria chutando. Você informa o que paga hoje e a
            calculadora devolve o ponto de virada contra a faixa real de um
            projeto próprio.
          </p>
        </header>

        <section className="mb-12">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {alternativasIndexaveis.map((p) => (
              <Link
                key={p.slug}
                href={`/alternativa-a/${p.slug}`}
                className="glass-card no-underline group"
              >
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h2 className="font-heading text-base font-bold text-foreground group-hover:text-brand transition-colors">
                    Alternativa a {p.alternativa.nome}
                  </h2>
                  <span className="text-xs text-gray whitespace-nowrap">
                    {p.alternativa.categoria}
                  </span>
                </div>
                <p className="text-sm text-gray leading-relaxed">
                  {p.alternativa.sinalDeTroca.split(". ")[0]}.
                </p>
                <p className="text-xs text-brand mt-3 pt-3 border-t border-white/[0.06]">
                  Projeto próprio equivalente: {p.preco.faixa} →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="text-center py-12">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Ainda não sabe <span className="text-brand">qual escopo</span> precisa?
          </h2>
          <p className="text-gray mb-8">
            A calculadora monta a faixa pelo que o seu projeto realmente exige,
            em cerca de um minuto.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/calculadora-site" className="cta-btn">
              CALCULAR SITE
            </Link>
            <Link href="/calculadora-app" className="cta-btn">
              CALCULAR SISTEMA
            </Link>
          </div>
        </section>
      </main>

      <PageFooter narrow />
    </>
  );
}
