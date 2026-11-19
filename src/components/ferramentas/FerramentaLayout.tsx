import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import { AUTOR, SITE_URL } from "@/data/autor";
import { getIsca, type Isca } from "@/data/iscas";
import { getCluster, type IscaId } from "@/lib/seo/taxonomia";

export interface ConteudoFerramenta {
  h1: string;
  respostaDireta: string;
  comoFunciona: string[];
  faq: Array<{ pergunta: string; resposta: string }>;
  atualizadoEm: string;
}

/**
 * Moldura de toda ferramenta gratuita: H1, resposta direta, a ferramenta
 * (client component), explicação do método, FAQ visível e JSON-LD
 * (SoftwareApplication gratuito + FAQPage + BreadcrumbList) que bate com o
 * que está na tela.
 */
export function FerramentaLayout({
  iscaId,
  conteudo,
  children,
}: {
  iscaId: IscaId;
  conteudo: ConteudoFerramenta;
  children: React.ReactNode;
}) {
  const isca = getIsca(iscaId) as Isca;
  const cluster = getCluster(isca.clusters[0]);
  const url = `${SITE_URL}${isca.href}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: isca.nome,
      description: conteudo.respostaDireta,
      url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "pt-BR",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      author: { "@type": "Person", "@id": AUTOR.id, name: AUTOR.nome },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: conteudo.faq.map((f) => ({ "@type": "Question", name: f.pergunta, acceptedAnswer: { "@type": "Answer", text: f.resposta } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
        { "@type": "ListItem", position: 3, name: isca.nome, item: url },
      ],
    },
  ];

  return (
    <>
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <PageNavbar links={[{ href: "/ferramentas", label: "Ferramentas" }, { href: "/guias", label: "Guias" }]} narrow />
      <main
        id="main-content"
        className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-14"
        data-page-type="ferramenta"
        data-cluster={isca.clusters[0]}
        data-consulta={conteudo.h1.toLowerCase()}
        data-isca={isca.id}
      >
        <nav aria-label="Trilha" className="text-sm text-gray mb-6">
          <Link href="/" className="no-underline text-gray hover:text-brand">Início</Link>
          <span className="text-gray/50 mx-2">/</span>
          <Link href="/ferramentas" className="no-underline text-gray hover:text-brand">Ferramentas</Link>
        </nav>
        <span className="text-xs font-bold tracking-[4px] text-brand uppercase mb-3 block">Ferramenta gratuita</span>
        <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-5">{conteudo.h1}</h1>
        <p className="text-lg text-foreground/90 leading-relaxed border-l-4 border-brand pl-4 mb-8">{conteudo.respostaDireta}</p>

        {children}

        <section className="mt-14 mb-10">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Como funciona</h2>
          {conteudo.comoFunciona.map((p, i) => (
            <p key={i} className="text-gray leading-relaxed mb-3">{p}</p>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Perguntas frequentes</h2>
          {conteudo.faq.map((f, i) => (
            <div key={i} className="mb-5">
              <h3 className="font-bold text-foreground mb-1.5">{f.pergunta}</h3>
              <p className="text-gray leading-relaxed">{f.resposta}</p>
            </div>
          ))}
        </section>

        {cluster && (
          <p className="text-sm text-gray">
            Mais sobre o tema em <Link href={`/temas/${cluster.id}`} className="text-brand underline">{cluster.nome}</Link>. Ferramenta mantida por{" "}
            <Link href="/sobre/daniel-anders" className="underline">{AUTOR.nome}</Link>, atualizada em {conteudo.atualizadoEm.split("-").reverse().join("/")}.
          </p>
        )}
      </main>
      <PageFooter narrow />
    </>
  );
}

/** CTA do serviço no momento do resultado (dispara cta_produto_clicado). */
export function CtaResultado({ iscaId, texto, href }: { iscaId: string; texto: string; href: string }) {
  return (
    <div className="mt-6 rounded-xl border border-white/10 p-5 bg-white/[0.03]">
      <p className="text-sm text-gray mb-3">{texto}</p>
      <div className="flex flex-wrap gap-3">
        <a
          href={href}
          data-track="cta_produto_clicado"
          data-isca={iscaId}
          className="text-sm font-bold text-white bg-brand px-5 py-2.5 rounded-lg no-underline"
        >
          Ver quanto custa resolver isso
        </a>
        <a
          href="https://cal.com/daniel-anders-emx5kl"
          target="_blank"
          rel="noopener noreferrer"
          data-track="cta_produto_clicado"
          data-isca={iscaId}
          className="text-sm font-bold text-foreground border border-white/20 px-5 py-2.5 rounded-lg no-underline"
        >
          Conversar 15 minutos
        </a>
      </div>
    </div>
  );
}
