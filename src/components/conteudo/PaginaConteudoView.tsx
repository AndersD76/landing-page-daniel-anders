import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import { IscaCard, BarraIscaMobile } from "@/components/iscas/IscaContextual";
import { CapturaEmail } from "@/components/iscas/CapturaEmail";
import { AUTOR, ORGANIZACAO, SITE_URL } from "@/data/autor";
import { getCluster } from "@/lib/seo/taxonomia";
import {
  linksNoAr,
  ROTA_POR_TIPO,
  ROTULO_TIPO,
  type PaginaAvaliada,
  type Secao,
} from "@/lib/conteudo";

function dataBR(iso: string): string {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

function ancora(titulo: string, i: number): string {
  return (
    titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || `secao-${i}`
  );
}

const HUB_POR_TIPO: Record<PaginaAvaliada["tipo"], { href: string; rotulo: string }> = {
  pilar: { href: "/guias", rotulo: "Guias" },
  satelite: { href: "/perguntas", rotulo: "Perguntas" },
  modelo: { href: "/modelos", rotulo: "Modelos" },
  glossario: { href: "/glossario", rotulo: "Glossário" },
  norma: { href: "/leis", rotulo: "Leis explicadas" },
  comparativo: { href: "/comparar", rotulo: "Comparativos" },
};

function SecaoView({ s, i }: { s: Secao; i: number }) {
  const ListaTag = s.listaOrdenada ? "ol" : "ul";
  return (
    <section id={ancora(s.titulo, i)} className="mb-10 scroll-mt-24">
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">{s.titulo}</h2>
      {s.paragrafos.map((p, j) => (
        <p key={j} className="text-base md:text-lg text-gray leading-relaxed mb-4">
          {p}
        </p>
      ))}
      {s.lista && (
        <ListaTag className={`${s.listaOrdenada ? "list-decimal" : "list-disc"} pl-6 space-y-2 text-gray mb-4`}>
          {s.lista.map((item, j) => (
            <li key={j} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ListaTag>
      )}
      {s.tabela && (
        <div className="overflow-x-auto -mx-4 sm:mx-0 mb-4">
          <table className="w-full text-sm border-collapse min-w-[520px]">
            {s.tabela.legenda && <caption className="text-left text-xs text-gray mb-2">{s.tabela.legenda}</caption>}
            <thead>
              <tr>
                {s.tabela.colunas.map((c, j) => (
                  <th key={j} scope="col" className="text-left font-bold text-foreground border-b border-white/15 px-3 py-2 bg-white/[0.03]">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.tabela.linhas.map((l, j) => (
                <tr key={j} className="border-b border-white/5">
                  {l.map((c, k) => (
                    <td key={k} className={`px-3 py-2 align-top ${k === 0 ? "text-foreground font-medium" : "text-gray"}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function BlocoTipo({ p }: { p: PaginaAvaliada }) {
  if (p.glossario) {
    return (
      <aside className="glass-card mb-10">
        <p className="text-xs font-bold tracking-[3px] text-brand uppercase mb-2">Exemplo prático</p>
        <p className="text-base md:text-lg text-gray leading-relaxed">{p.glossario.exemploPratico}</p>
        {p.glossario.termosRelacionados.length > 0 && (
          <p className="text-sm text-gray mt-4">
            Termos relacionados: {p.glossario.termosRelacionados.join(", ")}.
          </p>
        )}
      </aside>
    );
  }
  if (p.norma) {
    const n = p.norma;
    const blocos: Array<[string, string[]]> = [
      ["O que a norma pede", n.oQuePede],
      ["O que costuma ser cobrado", n.oQueCobram],
      ["Evidências para guardar", n.evidencias],
      ["Erros comuns", n.errosComuns],
    ];
    return (
      <section className="mb-10">
        <p className="text-sm text-gray mb-4">
          <strong className="text-foreground">{n.norma}</strong> — {n.dispositivo}.{" "}
          <a href={n.urlOficial} rel="noopener" className="text-brand underline">
            Texto oficial
          </a>
          . Conteúdo informativo, não é parecer jurídico.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {blocos.map(([t, itens]) => (
            <div key={t} className="glass-card">
              <h2 className="font-heading text-lg font-bold text-foreground mb-3">{t}</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray">
                {itens.map((i, j) => (
                  <li key={j}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (p.comparativo) {
    const c = p.comparativo;
    return (
      <section className="mb-10">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
          {c.opcaoA} × {c.opcaoB}: critério a critério
        </h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0 mb-6">
          <table className="w-full text-sm border-collapse min-w-[520px]">
            <thead>
              <tr>
                <th scope="col" className="text-left text-foreground border-b border-white/15 px-3 py-2 bg-white/[0.03]">Critério</th>
                <th scope="col" className="text-left text-foreground border-b border-white/15 px-3 py-2 bg-white/[0.03]">{c.opcaoA}</th>
                <th scope="col" className="text-left text-foreground border-b border-white/15 px-3 py-2 bg-white/[0.03]">{c.opcaoB}</th>
              </tr>
            </thead>
            <tbody>
              {c.criterios.map((x, j) => (
                <tr key={j} className="border-b border-white/5">
                  <td className="px-3 py-2 align-top text-foreground font-medium">{x.criterio}</td>
                  <td className="px-3 py-2 align-top text-gray">{x.a}</td>
                  <td className="px-3 py-2 align-top text-gray">{x.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="glass-card">
            <h3 className="font-bold text-foreground mb-2">Quando escolher {c.opcaoA}</h3>
            <p className="text-sm text-gray leading-relaxed">{c.quandoA}</p>
          </div>
          <div className="glass-card">
            <h3 className="font-bold text-foreground mb-2">Quando escolher {c.opcaoB}</h3>
            <p className="text-sm text-gray leading-relaxed">{c.quandoB}</p>
          </div>
        </div>
        <p className="text-base text-gray leading-relaxed">
          <strong className="text-foreground">Veredito:</strong> {c.veredito}
        </p>
      </section>
    );
  }
  if (p.modelo) {
    const m = p.modelo;
    return (
      <section id="baixar" className="mb-10 scroll-mt-24">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">Prévia do modelo</h2>
        {m.formato === "planilha" && m.colunas && (
          <div className="overflow-x-auto -mx-4 sm:mx-0 mb-4">
            <table className="w-full text-xs md:text-sm border-collapse min-w-[640px]">
              <thead>
                <tr>
                  {m.colunas.map((c, j) => (
                    <th key={j} scope="col" className="text-left text-foreground border-b border-white/15 px-2 py-2 bg-white/[0.03] whitespace-nowrap">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(m.linhasExemplo ?? []).map((l, j) => (
                  <tr key={j} className="border-b border-white/5">
                    {l.map((c, k) => (
                      <td key={k} className="px-2 py-1.5 text-gray whitespace-nowrap">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {m.formato === "checklist" && m.itens && (
          <ul className="space-y-2 mb-4">
            {m.itens.map((i, j) => (
              <li key={j} className="flex gap-3 text-gray text-sm">
                <span aria-hidden="true" className="mt-0.5 inline-block w-4 h-4 border border-white/30 rounded shrink-0" />
                <span>
                  <span className="text-xs text-brand font-bold mr-2">{i.grupo}</span>
                  {i.item}
                </span>
              </li>
            ))}
          </ul>
        )}
        {m.formato === "documento" && m.documento && (
          <div className="glass-card space-y-4 mb-4">
            {m.documento.map((b, j) => (
              <div key={j}>
                <h3 className="font-bold text-foreground mb-1">{b.titulo}</h3>
                <p className="text-sm text-gray leading-relaxed whitespace-pre-line">{b.texto}</p>
              </div>
            ))}
          </div>
        )}
        <h3 className="font-bold text-foreground mt-6 mb-2">Como usar</h3>
        <ol className="list-decimal pl-6 space-y-1.5 text-gray mb-6">
          {m.comoUsar.map((c, j) => (
            <li key={j}>{c}</li>
          ))}
        </ol>
        <CapturaEmail
          iscaId="modelo-download"
          modeloSlug={p.slug}
          titulo={`Receba o arquivo editável (${m.formato === "documento" ? "texto" : "CSV para Excel e Google Sheets"})`}
          textoBotao="Enviar o modelo"
          relatorio={{
            titulo: p.h1,
            resumo: "Seu modelo está pronto para baixar. O link vale por 30 dias.",
            destaques: [],
            secoes: [{ titulo: "Como usar", itens: m.comoUsar }],
          }}
        />
      </section>
    );
  }
  return null;
}

export function PaginaConteudoView({ p }: { p: PaginaAvaliada }) {
  const cluster = getCluster(p.cluster)!;
  const hub = HUB_POR_TIPO[p.tipo];
  const links = linksNoAr(p);
  const meio = Math.ceil(p.secoes.length / 2);
  const dataPub = p.publicadoEm ?? p.revisadoEm;

  const breadcrumb = [
    { nome: "Início", url: SITE_URL },
    { nome: hub.rotulo, url: `${SITE_URL}${hub.href}` },
    { nome: p.h1, url: p.urlAbsoluta },
  ];

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${p.urlAbsoluta}#artigo`,
      headline: p.h1,
      description: p.description,
      inLanguage: "pt-BR",
      datePublished: dataPub,
      dateModified: p.revisadoEm,
      mainEntityOfPage: p.urlAbsoluta,
      image: `${SITE_URL}/og?t=${encodeURIComponent(p.h1)}&k=${encodeURIComponent(ROTULO_TIPO[p.tipo])}`,
      author: { "@type": "Person", "@id": AUTOR.id, name: AUTOR.nome, url: AUTOR.url },
      publisher: { "@type": "Organization", "@id": ORGANIZACAO.id, name: ORGANIZACAO.nome, logo: { "@type": "ImageObject", url: ORGANIZACAO.logo } },
      about: cluster.nome,
      ...(p.fontes.length ? { citation: p.fontes.filter((f) => !f.url.startsWith("/")).map((f) => f.url) } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumb.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.nome, item: b.url })),
    },
  ];
  if (p.faq.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.pergunta, acceptedAnswer: { "@type": "Answer", text: f.resposta } })),
    });
  }
  if (p.glossario) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: p.glossario.termo,
      ...(p.glossario.sigla ? { alternateName: p.glossario.sigla } : {}),
      description: p.respostaDireta,
      url: p.urlAbsoluta,
      inDefinedTermSet: { "@type": "DefinedTermSet", name: "Glossário AndersDev", url: `${SITE_URL}/glossario` },
    });
  }

  return (
    <>
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <PageNavbar links={[{ href: hub.href, label: hub.rotulo }, { href: "/ferramentas", label: "Ferramentas" }]} narrow />

      <main
        id="main-content"
        className="max-w-[860px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-14"
        data-page-type={p.tipo}
        data-cluster={p.cluster}
        data-consulta={p.consulta}
        data-isca={p.isca.id}
      >
        <nav aria-label="Trilha" className="flex items-center gap-2 text-sm text-gray mb-8 flex-wrap">
          <Link href="/" className="no-underline text-gray hover:text-brand">Início</Link>
          <span className="text-gray/50">/</span>
          <Link href={hub.href} className="no-underline text-gray hover:text-brand">{hub.rotulo}</Link>
          <span className="text-gray/50">/</span>
          <Link href={`/temas/${p.cluster}`} className="no-underline text-gray hover:text-brand">{cluster.nome}</Link>
        </nav>

        <header className="mb-8">
          <span className="text-xs font-bold tracking-[4px] text-brand uppercase mb-4 block">{ROTULO_TIPO[p.tipo]}</span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">{p.h1}</h1>
          <p className="text-lg md:text-xl text-foreground/90 leading-relaxed border-l-4 border-brand pl-4 mb-6">{p.respostaDireta}</p>
          <p className="text-sm text-gray">
            Por{" "}
            <Link href="/sobre/daniel-anders" className="text-foreground underline" rel="author">
              {AUTOR.nome}
            </Link>{" "}
            · Atualizado em <time dateTime={p.revisadoEm}>{dataBR(p.revisadoEm)}</time> ·{" "}
            <Link href="/politica-editorial" className="text-gray underline">
              Como produzimos este conteúdo
            </Link>
          </p>
        </header>

        {p.secoes.length > 2 && (
          <nav aria-label="Sumário" className="glass-card mb-10">
            <p className="text-xs font-bold tracking-[3px] text-gray uppercase mb-3">Nesta página</p>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              {p.secoes.map((s, i) => (
                <li key={i}>
                  <a href={`#${ancora(s.titulo, i)}`} className="text-gray hover:text-brand">
                    {s.titulo}
                  </a>
                </li>
              ))}
              {p.faq.length > 0 && (
                <li>
                  <a href="#perguntas-frequentes" className="text-gray hover:text-brand">Perguntas frequentes</a>
                </li>
              )}
            </ol>
          </nav>
        )}

        <BlocoTipo p={p} />

        {p.secoes.slice(0, meio).map((s, i) => (
          <SecaoView key={i} s={s} i={i} />
        ))}

        <IscaCard isca={p.isca} posicao="meio" />

        {p.secoes.slice(meio).map((s, i) => (
          <SecaoView key={i + meio} s={s} i={i + meio} />
        ))}

        {p.faq.length > 0 && (
          <section id="perguntas-frequentes" className="mb-10 scroll-mt-24">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">Perguntas frequentes</h2>
            {p.faq.map((f, i) => (
              <div key={i} className="mb-6">
                <h3 className="font-bold text-foreground mb-2">{f.pergunta}</h3>
                <p className="text-gray leading-relaxed">{f.resposta}</p>
              </div>
            ))}
          </section>
        )}

        <IscaCard isca={p.iscaSecundaria.id === p.isca.id ? p.isca : p.iscaSecundaria} posicao="fim" />

        {p.fontes.length > 0 && (
          <section className="mb-10">
            <h2 className="font-heading text-xl font-bold text-foreground mb-3">Fontes</h2>
            <ul className="space-y-1.5 text-sm text-gray">
              {p.fontes.map((f, i) => (
                <li key={i}>
                  {f.url.startsWith("/") ? (
                    <Link href={f.url} className="underline">{f.titulo}</Link>
                  ) : (
                    <a href={f.url} rel="noopener" className="underline">{f.titulo}</a>
                  )}{" "}
                  — {f.orgao}, consultado em {dataBR(f.consultadoEm)}.
                </li>
              ))}
            </ul>
          </section>
        )}

        {links.length > 0 && (
          <section className="mb-10">
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">Continue no tema</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block glass-card no-underline text-foreground hover:text-brand text-sm">
                    <span className="block text-[10px] font-bold tracking-[2px] uppercase text-gray mb-1">
                      {l.tipo === "comercial" ? "Serviço" : ROTULO_TIPO[l.tipo]}
                    </span>
                    {l.ancora}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <aside className="glass-card text-sm text-gray">
          <p>
            <strong className="text-foreground">{AUTOR.nome}</strong> — {AUTOR.cargo}. {AUTOR.resumo}{" "}
            <Link href="/sobre/daniel-anders" className="text-brand underline">Sobre o autor</Link>.
          </p>
        </aside>
        <div className="h-14 md:hidden" aria-hidden="true" />
      </main>

      <BarraIscaMobile isca={p.isca} />
      <PageFooter narrow />
    </>
  );
}

export { ROTA_POR_TIPO };
