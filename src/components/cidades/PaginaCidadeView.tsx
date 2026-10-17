import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import { CtaContextual } from "@/components/custos/CtaContextual";
import { ComposicaoSetorial } from "@/components/cidades/ComposicaoSetorial";
import { BASE_URL } from "@/data/custos";
import {
  cidadesVizinhas,
  fonteCidades,
  type PaginaCidade,
} from "@/data/cidades";

const LIMITE_ATIPICO = 1.15;

export function PaginaCidadeView({ pagina }: { pagina: PaginaCidade }) {
  const { cidade, vocacao, preco, regiao } = pagina;
  const vizinhas = cidadesVizinhas(pagina);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Sites e sistemas por cidade",
        item: `${BASE_URL}/sites-e-sistemas`,
      },
      { "@type": "ListItem", position: 3, name: cidade.nome, item: pagina.url },
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

  // areaServed real, sem inventar endereço local: a base é uma só.
  const servicoSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Criação de sites e sistemas em ${cidade.nome}`,
    serviceType: "Desenvolvimento de software sob medida",
    provider: {
      "@type": "Person",
      name: "Daniel Anders",
      url: BASE_URL,
    },
    areaServed: {
      "@type": "City",
      name: cidade.nome,
      containedInPlace: {
        "@type": "State",
        name: "Rio Grande do Sul",
      },
    },
    url: pagina.url,
  };

  return (
    <>
      {[breadcrumb, faqSchema, servicoSchema].map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      <PageNavbar
        links={[{ href: "/sites-e-sistemas", label: "Por cidade" }]}
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
            href="/sites-e-sistemas"
            className="hover:text-brand transition-colors no-underline text-gray"
          >
            Por cidade
          </Link>
          <span className="text-gray/50">/</span>
          <span className="text-foreground">{cidade.nome}</span>
        </div>

        {/* HERO */}
        <header className="mb-10">
          <span className="text-xs font-bold tracking-[4px] text-brand uppercase mb-4 block">
            {cidade.mesorregiao.toUpperCase()} · {cidade.uf}
          </span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {pagina.h1}
          </h1>
          <p className="text-lg text-gray leading-relaxed mb-4">
            {cidade.nome} tem{" "}
            <strong className="text-foreground">
              {cidade.empresas.toLocaleString("pt-BR")} empresas
            </strong>{" "}
            e outras organizações ativas, a {pagina.posicaoUf}ª maior
            concentração entre os {pagina.totalCarregadas} municípios gaúchos
            analisados aqui.
            {vocacao && (
              <>
                {" "}O que distingue a cidade é{" "}
                <strong className="text-foreground">
                  {vocacao.nome.toLowerCase()}
                </strong>
                : {vocacao.pctCidade}% das empresas locais, contra{" "}
                {vocacao.pctUf}% na média do estado.
              </>
            )}
          </p>
          <p className="text-lg text-gray leading-relaxed">
            Essa diferença não é curiosidade estatística — é o que decide qual
            sistema se paga primeiro aqui.
          </p>
        </header>

        {/* DADOS */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl font-bold mb-6">
            O perfil econômico de {cidade.nome}
          </h2>

          <div className="glass-card">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
              <div>
                <p className="font-heading text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                  {cidade.empresas.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-gray mt-1">empresas ativas</p>
              </div>
              {cidade.pessoalOcupado !== null && (
                <div>
                  <p className="font-heading text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                    {cidade.pessoalOcupado.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-xs text-gray mt-1">pessoas ocupadas</p>
                </div>
              )}
              <div>
                <p className="font-heading text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                  {pagina.posicaoUf}º
                </p>
                <p className="text-xs text-gray mt-1">
                  entre {pagina.totalCarregadas} municípios analisados
                </p>
              </div>
              {vocacao && (
                <div>
                  <p className="font-heading text-2xl md:text-3xl font-bold text-brand tabular-nums">
                    {vocacao.razao}x
                  </p>
                  <p className="text-xs text-gray mt-1">
                    {vocacao.nome.toLowerCase()} vs. média do RS
                  </p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/[0.06]">
              <ComposicaoSetorial
                cidade={cidade.nome}
                linhas={pagina.setores}
                limiteAtipico={LIMITE_ATIPICO}
              />
            </div>

            <p className="text-xs text-gray mt-6">
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
              . Mesorregião conforme a divisão territorial do IBGE.
            </p>
          </div>
        </section>

        {/* REGIÃO */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl font-bold mb-4">
            {cidade.mesorregiao}: o que caracteriza a região
          </h2>
          <p className="text-gray leading-relaxed mb-6">{regiao.resumo}</p>
          <div className="glass-card">
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">
              {pagina.presencial ? "Atendimento presencial" : "Atendimento remoto"}
            </h3>
            <p className="text-gray leading-relaxed text-sm">
              {regiao.atendimento}
            </p>
          </div>
        </section>

        {/* O QUE FAZ SENTIDO AQUI */}
        {pagina.setoresRecomendados.length > 0 && (
          <section className="mb-14">
            <h2 className="font-heading text-2xl font-bold mb-5">
              Que sistema tende a se pagar primeiro em {cidade.nome}
            </h2>
            <p className="text-gray leading-relaxed mb-6">
              Setor concentrado significa problema repetido, e problema repetido
              é o que mais rende em sistema sob medida — o mesmo trabalho atende
              muita gente. Pelo perfil da cidade, estas páginas abrem o escopo e
              o custo do que faz sentido aqui:
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {pagina.setoresRecomendados.map((r) => (
                <Link
                  key={r.slug}
                  href={`/sistema-para/${r.slug}`}
                  className="glass-card no-underline group !p-5"
                >
                  <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-brand transition-colors">
                    Sistema para {r.nome.toLowerCase()}
                  </h3>
                  <p className="text-xs text-gray mt-1">
                    Módulos, dor operacional e faixa de preço →
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* PREÇO */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl font-bold mb-5">
            Quanto custa, e por que não muda por cidade
          </h2>
          <div className="glass-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <span className="text-xs font-bold tracking-wide text-gray uppercase">
                  Site institucional
                </span>
                <p className="font-heading text-2xl font-bold text-foreground mt-2">
                  {preco.site}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold tracking-wide text-gray uppercase">
                  Sistema sob medida
                </span>
                <p className="font-heading text-2xl font-bold text-foreground mt-2">
                  {preco.sistema}
                </p>
              </div>
            </div>

            <p className="text-gray leading-relaxed text-sm mb-4">
              Essa faixa é a mesma em {cidade.nome}, em Porto Alegre ou em
              qualquer outro lugar. O trabalho é entregue remotamente e cobrar
              diferente por localização seria arbitrário. O que muda de cidade
              para cidade é <em>qual</em> sistema faz sentido — e isso vem do
              perfil econômico acima, não do CEP.
            </p>

            <p className="text-xs text-gray">
              Fonte: {preco.fonte} — atualizado em{" "}
              <time dateTime={preco.atualizadoEmISO}>{preco.atualizadoEm}</time>.
            </p>

            <p className="text-sm text-gray mt-5">
              Quer ajustar escopo, integrações e prazo?{" "}
              <Link
                href="/calculadora-site"
                className="text-brand hover:text-brand-bright transition-colors"
              >
                Use a calculadora
              </Link>{" "}
              ou veja{" "}
              <Link
                href="/quanto-custa"
                className="text-brand hover:text-brand-bright transition-colors"
              >
                o custo aberto por tipo de projeto
              </Link>
              .
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-14">
          <CtaContextual
            escopo={`cidade/${cidade.slug}`}
            escopoLabel={`${cidade.nome}/${cidade.uf}`}
            faixa={preco.site}
            source={`sites-e-sistemas:${cidade.slug}`}
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

        {/* VIZINHAS */}
        {vizinhas.length > 0 && (
          <section className="mb-14">
            <h2 className="font-heading text-2xl font-bold mb-6">
              Cidades próximas
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {vizinhas.map((v) => (
                <Link
                  key={v.slug}
                  href={`/sites-e-sistemas/${v.slug}`}
                  className="glass-card no-underline group !p-5"
                >
                  <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-brand transition-colors">
                    {v.cidade.nome}
                  </h3>
                  <p className="text-xs text-gray mt-1 tabular-nums">
                    {v.cidade.empresas.toLocaleString("pt-BR")} empresas
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
