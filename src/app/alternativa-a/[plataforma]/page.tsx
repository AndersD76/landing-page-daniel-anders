import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import { CtaContextual } from "@/components/custos/CtaContextual";
import { PontoDeVirada } from "@/components/alternativas/PontoDeVirada";
import { BASE_URL } from "@/data/custos";
import {
  alternativasIndexaveis,
  getPaginaAlternativa,
  paginasAlternativa,
} from "@/data/alternativas-paginas";

export const dynamicParams = false;

export function generateStaticParams() {
  return paginasAlternativa.map((p) => ({ plataforma: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ plataforma: string }>;
}): Promise<Metadata> {
  const { plataforma } = await params;
  const pagina = getPaginaAlternativa(plataforma);
  if (!pagina) return {};

  return {
    title: { absolute: pagina.title },
    description: pagina.metaDescription,
    alternates: { canonical: pagina.url },
    robots: pagina.gate.aprovado ? undefined : { index: false, follow: true },
    openGraph: {
      title: pagina.title,
      description: pagina.metaDescription,
      url: pagina.url,
      type: "article",
    },
  };
}

export default async function AlternativaPage({
  params,
}: {
  params: Promise<{ plataforma: string }>;
}) {
  const { plataforma } = await params;
  const pagina = getPaginaAlternativa(plataforma);
  if (!pagina) notFound();

  const { alternativa: alt, preco } = pagina;
  const outras = alternativasIndexaveis.filter((p) => p.slug !== pagina.slug);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Alternativas",
        item: `${BASE_URL}/alternativa-a`,
      },
      { "@type": "ListItem", position: 3, name: alt.nome, item: pagina.url },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pagina.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      {[breadcrumb, faqSchema].map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      <PageNavbar
        links={[{ href: "/alternativa-a", label: "Alternativas" }]}
        cta={{ href: "#orcamento", label: "RECEBER ESCOPO" }}
        narrow
      />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
        <div className="flex items-center gap-2 text-sm text-gray mb-8 flex-wrap">
          <Link href="/" className="hover:text-brand transition-colors no-underline text-gray">
            Início
          </Link>
          <span className="text-gray/50">/</span>
          <Link
            href="/alternativa-a"
            className="hover:text-brand transition-colors no-underline text-gray"
          >
            Alternativas
          </Link>
          <span className="text-gray/50">/</span>
          <span className="text-foreground">{alt.nome}</span>
        </div>

        <header className="mb-10">
          <span className="text-xs font-bold tracking-[4px] text-brand uppercase mb-4 block">
            COMPARAÇÃO · {alt.categoria.toUpperCase()}
          </span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {alt.h1}
          </h1>
          {alt.intro.map((p, i) => (
            <p key={i} className="text-lg text-gray leading-relaxed mb-4">
              {p}
            </p>
          ))}
        </header>

        {/* FERRAMENTA */}
        <section className="mb-14" id="calculadora">
          <PontoDeVirada
            nomePlataforma={alt.nome}
            label={alt.labelCustoAtual}
            projetoMin={preco.min}
            projetoMax={preco.max}
            source={`alternativa-a:${alt.slug}`}
          />
          <p className="text-xs text-gray mt-4">
            Faixa do projeto próprio — Fonte: {preco.fonte} — atualizado em{" "}
            <time dateTime={preco.atualizadoEmISO}>{preco.atualizadoEm}</time>.
          </p>
        </section>

        {/* HONESTIDADE PRIMEIRO */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold mb-5">
            Onde {alt.nome} realmente ganha
          </h2>
          <p className="text-gray leading-relaxed mb-5">
            Vale começar por aqui, porque na maior parte dos casos a resposta
            certa é continuar onde está. Troca de tecnologia que não resolve um
            problema concreto só move o problema de lugar.
          </p>
          <ul className="flex flex-col gap-2">
            {alt.ondeElaGanha.map((item) => (
              <li key={item} className="flex gap-3 text-gray leading-relaxed">
                <span className="text-brand shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold mb-5">
            Onde trava
          </h2>
          <ul className="flex flex-col gap-2">
            {alt.ondeTrava.map((item) => (
              <li key={item} className="flex gap-3 text-gray leading-relaxed">
                <span className="text-gray/50 shrink-0">—</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14">
          <h2 className="font-heading text-2xl font-bold mb-4">
            O sinal de que chegou a hora
          </h2>
          <p className="text-gray leading-relaxed">{alt.sinalDeTroca}</p>
        </section>

        {/* CTA */}
        <section className="mb-14">
          <CtaContextual
            escopo={`alternativa/${alt.slug}`}
            escopoLabel={`Alternativa a ${alt.nome}`}
            faixa={preco.faixa}
            source={`alternativa-a:${alt.slug}`}
          />
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl font-bold mb-6">
            Perguntas frequentes
          </h2>
          <div className="flex flex-col gap-4">
            {pagina.faqs.map((f) => (
              <details key={f.q} className="glass-card !p-5 group">
                <summary className="font-heading font-bold text-foreground text-sm cursor-pointer list-none flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-brand group-open:rotate-45 transition-transform text-xl shrink-0">
                    +
                  </span>
                </summary>
                <p className="text-sm text-gray leading-relaxed mt-3 pt-3 border-t border-white/[0.06]">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {outras.length > 0 && (
          <section className="mb-14">
            <h2 className="font-heading text-2xl font-bold mb-6">
              Outras comparações
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {outras.map((o) => (
                <Link
                  key={o.slug}
                  href={`/alternativa-a/${o.slug}`}
                  className="glass-card no-underline group !p-5"
                >
                  <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-brand transition-colors">
                    Alternativa a {o.alternativa.nome}
                  </h3>
                  <p className="text-xs text-gray mt-1">
                    {o.alternativa.categoria}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <PageFooter narrow />
    </>
  );
}
