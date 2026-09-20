import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import { CtaContextual } from "@/components/custos/CtaContextual";
import { DistribuicaoUf } from "@/components/setores/DistribuicaoUf";
import { formatBRL } from "@/lib/calculadora";
import { BASE_URL } from "@/data/custos";
import {
  fonteMercado,
  setoresRelacionados,
  type PaginaSetor,
} from "@/data/setores-paginas";

export function PaginaSetorView({ pagina }: { pagina: PaginaSetor }) {
  const { conteudo, dado, preco } = pagina;
  const relacionados = setoresRelacionados(pagina);
  const custoHref = `/quanto-custa/${conteudo.projeto.custoSlug.join("/")}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Sistema para",
        item: `${BASE_URL}/sistema-para`,
      },
      { "@type": "ListItem", position: 3, name: conteudo.nome, item: pagina.url },
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
        links={[{ href: "/sistema-para", label: "Por setor" }]}
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
            href="/sistema-para"
            className="hover:text-brand transition-colors no-underline text-gray"
          >
            Sistema para
          </Link>
          <span className="text-gray/50">/</span>
          <span className="text-foreground">{conteudo.nome}</span>
        </div>

        {/* HERO */}
        <header className="mb-10">
          <span className="text-xs font-bold tracking-[4px] text-brand uppercase mb-4 block">
            SETOR · CNAE {dado.cnae}
          </span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {pagina.h1}
          </h1>
          {conteudo.intro.map((p, i) => (
            <p key={i} className="text-lg text-gray leading-relaxed mb-4">
              {p}
            </p>
          ))}
        </header>

        {/* O MERCADO — dado do IBGE */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl font-bold mb-6">
            O tamanho do setor no Brasil
          </h2>

          <div className="glass-card">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
              <div>
                <p className="font-heading text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                  {dado.empresasBrasil.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-gray mt-1">empresas no país</p>
              </div>
              <div>
                <p className="font-heading text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                  {pagina.participacaoPct}%
                </p>
                <p className="text-xs text-gray mt-1">
                  do total de empresas do Brasil
                </p>
              </div>
              {dado.pessoalOcupado !== null && (
                <div>
                  <p className="font-heading text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                    {dado.pessoalOcupado.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-xs text-gray mt-1">pessoas ocupadas</p>
                </div>
              )}
              <div>
                <p className="font-heading text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                  {pagina.concentracaoTop5Pct}%
                </p>
                <p className="text-xs text-gray mt-1">
                  concentrados em 5 estados
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.06]">
              <DistribuicaoUf
                titulo={`Onde estão as empresas do setor`}
                linhas={dado.topUfs}
                totalBrasil={dado.empresasBrasil}
              />
            </div>

            <p className="text-xs text-gray mt-6">
              Fonte:{" "}
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
          </div>
        </section>

        {/* MÓDULOS */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl font-bold mb-5">
            O que um sistema de {conteudo.nomeFrase} precisa ter
          </h2>
          <ul className="flex flex-col gap-2">
            {conteudo.oQueOSistemaPrecisa.map((item) => (
              <li key={item} className="flex gap-3 text-gray leading-relaxed">
                <span className="text-brand shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ONDE O DINHEIRO VAZA */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl font-bold mb-4">
            Onde o dinheiro vaza hoje
          </h2>
          <p className="text-gray leading-relaxed">{conteudo.ondeODinheiroVaza}</p>
        </section>

        {/* PREÇO */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl font-bold mb-5">
            Quanto custa um sistema desse porte
          </h2>
          <div className="glass-card">
            <span className="text-xs font-bold tracking-wide text-gray uppercase">
              Faixa estimada para o escopo acima
            </span>
            <p className="font-heading text-3xl md:text-4xl font-bold text-foreground my-3">
              {preco.faixa}
            </p>

            <div className="border border-white/[0.08] rounded-xl overflow-hidden mt-5">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Composição da faixa de preço
                </caption>
                <tbody>
                  {preco.estimativa.breakdown.map((linha, i) => (
                    <tr key={i} className="border-b border-white/[0.06] last:border-0">
                      <td className="px-4 py-3 text-gray">{linha.label}</td>
                      <td className="px-4 py-3 text-right text-foreground whitespace-nowrap">
                        {formatBRL(linha.min)} <span className="text-gray">a</span>{" "}
                        {formatBRL(linha.max)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray mt-4">
              Fonte: {preco.fonte} — atualizado em{" "}
              <time dateTime={preco.atualizadoEmISO}>{preco.atualizadoEm}</time>.
            </p>

            <p className="text-sm text-gray mt-5">
              Essa faixa parte do escopo típico do setor. Para ver como cada
              integração mexe no valor, veja{" "}
              <Link
                href={custoHref}
                className="text-brand hover:text-brand-bright transition-colors"
              >
                o detalhamento desse tipo de projeto
              </Link>
              .
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-14">
          <CtaContextual
            escopo={`setor/${conteudo.slug}`}
            escopoLabel={conteudo.nome}
            faixa={preco.faixa}
            source={`sistema-para:${conteudo.slug}`}
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

        {/* RELACIONADOS */}
        {relacionados.length > 0 && (
          <section className="mb-14">
            <h2 className="font-heading text-2xl font-bold mb-6">
              Outros setores
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {relacionados.map((r) => (
                <Link
                  key={r.slug}
                  href={`/sistema-para/${r.slug}`}
                  className="glass-card no-underline group !p-5"
                >
                  <h3 className="font-heading text-sm font-bold text-foreground mb-1 group-hover:text-brand transition-colors">
                    {r.conteudo.nome}
                  </h3>
                  <p className="text-xs text-gray">
                    {r.dado.empresasBrasil.toLocaleString("pt-BR")} empresas ·{" "}
                    {r.preco.faixa}
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
