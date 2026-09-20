import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import { CtaContextual } from "@/components/custos/CtaContextual";
import { formatBRL } from "@/lib/calculadora";
import {
  BASE_URL,
  relacionadasDe,
  type PaginaCusto,
} from "@/data/custos";

function Carimbo({ pagina }: { pagina: PaginaCusto }) {
  return (
    <p className="text-xs text-gray mt-4">
      Fonte: {pagina.preco.fonte} — atualizado em{" "}
      <time dateTime={pagina.preco.atualizadoEmISO}>
        {pagina.preco.atualizadoEm}
      </time>
      .
    </p>
  );
}

export function PaginaCustoView({ pagina }: { pagina: PaginaCusto }) {
  const { tipo, combo, preco } = pagina;
  const relacionadas = relacionadasDe(pagina);
  const calculadoraHref =
    tipo.variante === "site" ? "/calculadora-site" : "/calculadora-app";

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Quanto custa",
        item: `${BASE_URL}/quanto-custa`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tipo.nome,
        item: `${BASE_URL}/quanto-custa/${tipo.slug}`,
      },
      ...(combo
        ? [
            {
              "@type": "ListItem",
              position: 4,
              name: combo.nomeCurto,
              item: pagina.url,
            },
          ]
        : []),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageNavbar
        links={[{ href: "/quanto-custa", label: "Quanto custa" }]}
        cta={{ href: "#orcamento", label: "RECEBER ESCOPO" }}
        narrow
      />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm text-gray mb-8 flex-wrap">
          <Link href="/" className="hover:text-brand transition-colors no-underline text-gray">
            Início
          </Link>
          <span className="text-gray/50">/</span>
          <Link
            href="/quanto-custa"
            className="hover:text-brand transition-colors no-underline text-gray"
          >
            Quanto custa
          </Link>
          {combo && (
            <>
              <span className="text-gray/50">/</span>
              <Link
                href={`/quanto-custa/${tipo.slug}`}
                className="hover:text-brand transition-colors no-underline text-gray"
              >
                {tipo.nome}
              </Link>
            </>
          )}
          <span className="text-gray/50">/</span>
          <span className="text-foreground">
            {combo ? combo.nomeCurto : tipo.nome}
          </span>
        </div>

        {/* HERO */}
        <header className="mb-10">
          <span className="text-xs font-bold tracking-[4px] text-brand uppercase mb-4 block">
            CUSTO REAL · {tipo.variante === "site" ? "SITE" : "APP"}
          </span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {pagina.h1}
          </h1>
          {(combo ? combo.intro : tipo.intro).map((p, i) => (
            <p key={i} className="text-lg text-gray leading-relaxed mb-4">
              {p}
            </p>
          ))}
        </header>

        {/* FAIXA + BREAKDOWN */}
        <section className="mb-14">
          <div className="glass-card">
            <span className="text-xs font-bold tracking-wide text-gray uppercase">
              Faixa estimada
            </span>
            <p className="font-heading text-3xl md:text-4xl font-bold text-foreground my-3">
              {preco.faixa}
            </p>
            {preco.acrescimo && combo && (
              <p className="text-sm text-gray mb-4">
                Desse total, cerca de <strong className="text-foreground">{preco.acrescimo}</strong>{" "}
                correspondem à camada de {combo.nomeCurto}.
              </p>
            )}

            <div className="border border-white/[0.08] rounded-xl overflow-hidden mt-5">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Composição da faixa de preço
                </caption>
                <tbody>
                  {preco.estimativa.breakdown.map((linha, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/[0.06] last:border-0"
                    >
                      <td className="px-4 py-3 text-gray">{linha.label}</td>
                      <td className="px-4 py-3 text-right text-foreground whitespace-nowrap">
                        {formatBRL(linha.min)}{" "}
                        <span className="text-gray">a</span>{" "}
                        {formatBRL(linha.max)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Carimbo pagina={pagina} />

            <p className="text-sm text-gray mt-5">
              Quer ajustar escopo, volume e prazo e ver o número mudar?{" "}
              <Link
                href={calculadoraHref}
                className="text-brand hover:text-brand-bright transition-colors"
              >
                Use a calculadora completa
              </Link>
              .
            </p>
          </div>
        </section>

        {/* CORPO: TIPO */}
        {!combo && (
          <>
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-5">
                O que entra nessa faixa
              </h2>
              <ul className="flex flex-col gap-2 mb-8">
                {tipo.oQueEntra.map((item) => (
                  <li key={item} className="flex gap-3 text-gray leading-relaxed">
                    <span className="text-brand shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="font-heading text-lg font-bold text-foreground mb-3">
                O que normalmente fica de fora
              </h3>
              <ul className="flex flex-col gap-2">
                {tipo.oQueNaoEntra.map((item) => (
                  <li key={item} className="flex gap-3 text-gray leading-relaxed">
                    <span className="text-gray/50 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card">
                <h3 className="font-heading text-lg font-bold text-foreground mb-3">
                  Quando vale a pena
                </h3>
                <p className="text-gray leading-relaxed text-sm">
                  {tipo.quandoVale}
                </p>
              </div>
              <div className="glass-card">
                <h3 className="font-heading text-lg font-bold text-foreground mb-3">
                  Quando não vale
                </h3>
                <p className="text-gray leading-relaxed text-sm">
                  {tipo.quandoNaoVale}
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-3">
                Prazo típico
              </h2>
              <p className="text-gray leading-relaxed">{tipo.prazoTipico}</p>
            </section>
          </>
        )}

        {/* CORPO: COMBO */}
        {combo && (
          <>
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-5">
                O que muda no escopo
              </h2>
              <ul className="flex flex-col gap-2">
                {combo.oQueMuda.map((item) => (
                  <li key={item} className="flex gap-3 text-gray leading-relaxed">
                    <span className="text-brand shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-4">
                Onde esse projeto trava e fica caro
              </h2>
              <p className="text-gray leading-relaxed">{combo.ondeTravaCaro}</p>
            </section>

            <section className="mb-12">
              <div className="glass-card">
                <h3 className="font-heading text-lg font-bold text-foreground mb-3">
                  Antes disso, o projeto base
                </h3>
                <p className="text-gray leading-relaxed text-sm mb-4">
                  {tipo.quandoVale}
                </p>
                <Link
                  href={`/quanto-custa/${tipo.slug}`}
                  className="text-sm font-bold text-brand hover:text-brand-bright transition-colors no-underline"
                >
                  Ver o custo de {tipo.nome.toLowerCase()} sem integração →
                </Link>
              </div>
            </section>
          </>
        )}

        {/* CTA CONTEXTUAL */}
        <section className="mb-14">
          <CtaContextual
            escopo={pagina.slugPath.join("/")}
            escopoLabel={combo ? `${tipo.nome} com ${combo.nomeCurto}` : tipo.nome}
            faixa={preco.faixa}
            source={`quanto-custa:${pagina.slugPath.join("/")}`}
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

        {/* RELACIONADOS — página órfã não é descoberta */}
        {relacionadas.length > 0 && (
          <section className="mb-14">
            <h2 className="font-heading text-2xl font-bold mb-6">
              Relacionados
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {relacionadas.map((r) => (
                <Link
                  key={r.url}
                  href={`/quanto-custa/${r.slugPath.join("/")}`}
                  className="glass-card no-underline group !p-5"
                >
                  <h3 className="font-heading text-sm font-bold text-foreground mb-1 group-hover:text-brand transition-colors">
                    {r.h1}
                  </h3>
                  <p className="text-xs text-gray">{r.preco.faixa}</p>
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
