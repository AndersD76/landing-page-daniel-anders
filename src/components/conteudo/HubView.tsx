import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import { IscaCard } from "@/components/iscas/IscaContextual";
import { SITE_URL } from "@/data/autor";
import type { Isca } from "@/data/iscas";

export interface GrupoHub {
  titulo: string;
  descricao?: string;
  itens: Array<{ href: string; titulo: string; resumo?: string }>;
}

/**
 * Hub rastreável sem JavaScript: só HTML com links. Serve aos hubs por tipo
 * (todos os modelos, todo o glossário…), por cluster (/temas/...) e ao índice
 * de ferramentas.
 */
export function HubView(props: {
  h1: string;
  intro: string;
  url: string;
  pageType: string;
  cluster?: string;
  grupos: GrupoHub[];
  isca?: Isca;
  rodape?: React.ReactNode;
}) {
  const total = props.grupos.reduce((n, g) => n + g.itens.length, 0);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: props.h1,
      description: props.intro,
      url: `${SITE_URL}${props.url}`,
      inLanguage: "pt-BR",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: total,
        itemListElement: props.grupos
          .flatMap((g) => g.itens)
          .slice(0, 200)
          .map((it, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}${it.href}`, name: it.titulo })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: props.h1, item: `${SITE_URL}${props.url}` },
      ],
    },
  ];

  return (
    <>
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <PageNavbar
        links={[
          { href: "/guias", label: "Guias" },
          { href: "/glossario", label: "Glossário" },
          { href: "/modelos", label: "Modelos" },
          { href: "/ferramentas", label: "Ferramentas" },
        ]}
      />
      <main
        id="main-content"
        className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-16"
        data-page-type="hub"
        data-cluster={props.cluster}
        data-isca={props.isca?.id}
      >
        <nav aria-label="Trilha" className="text-sm text-gray mb-6">
          <Link href="/" className="no-underline text-gray hover:text-brand">Início</Link>
          <span className="text-gray/50 mx-2">/</span>
          <span className="text-foreground">{props.h1}</span>
        </nav>
        <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-4">{props.h1}</h1>
        <p className="text-lg text-gray leading-relaxed max-w-[760px] mb-10">{props.intro}</p>

        {props.grupos.map((g) =>
          g.itens.length ? (
            <section key={g.titulo} className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">{g.titulo}</h2>
              {g.descricao && <p className="text-gray mb-4">{g.descricao}</p>}
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {g.itens.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href} className="block glass-card no-underline h-full">
                      <span className="block font-bold text-foreground text-sm mb-1">{it.titulo}</span>
                      {it.resumo && <span className="block text-xs text-gray leading-relaxed line-clamp-3">{it.resumo}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null
        )}

        {props.isca && <IscaCard isca={props.isca} posicao="fim" />}
        {props.rodape}
      </main>
      <PageFooter />
    </>
  );
}
