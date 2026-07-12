import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import {
  blogPosts,
  getPostBySlug,
  getAllPosts,
  type BlogPost,
} from "@/data/blog";
import { getRelatedServicesForPost } from "@/data/interlinks";

// ── Static params ──

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

// ── Metadata ──

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `https://www.andersdev.com.br/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: ["Daniel Anders"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `https://www.andersdev.com.br/blog/${post.slug}`,
    },
  };
}

// ── Helpers ──

const categoryLabels: Record<BlogPost["category"], string> = {
  desenvolvimento: "Desenvolvimento",
  "negócios": "Negócios",
  tech: "Tech",
};

const categoryColors: Record<BlogPost["category"], string> = {
  desenvolvimento: "bg-blue-500/15 text-blue-400",
  "negócios": "bg-emerald-500/15 text-emerald-400",
  tech: "bg-brand/15 text-brand",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getRelatedPosts(currentSlug: string, category: BlogPost["category"]): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.slug !== currentSlug)
    .filter((p) => p.category === category || p.tags.some((t) =>
      blogPosts.find((bp) => bp.slug === currentSlug)?.tags.includes(t)
    ))
    .slice(0, 3);
}

// ── Content renderer ──

// CTA das calculadoras de custo — embutido nos 2 posts de custo
interface CalculatorCtaConfig {
  href: string;
  title: string;
  desc: string;
  button: string;
}

const calculatorCtaBySlug: Record<string, CalculatorCtaConfig> = {
  "quanto-custa-criar-site-profissional-2026": {
    href: "/calculadora-site",
    title: "Calcule o custo do SEU site em 1 minuto",
    desc: "Responda 4 perguntas (tipo, páginas, integrações, prazo) e veja a faixa de preço realista do seu projeto, com breakdown do que compõe o valor.",
    button: "Abrir calculadora de site",
  },
  "quanto-custa-desenvolver-app-saas-2026": {
    href: "/calculadora-app",
    title: "Calcule o custo do SEU app em 1 minuto",
    desc: "Responda 4 perguntas (tipo, telas, integrações, prazo) e veja a faixa de preço realista do seu projeto, com breakdown do que compõe o valor.",
    button: "Abrir calculadora de app",
  },
};

function CalculatorCta({ cta }: { cta: CalculatorCtaConfig }) {
  return (
    <aside className="glass-card !border-brand/20 my-10">
      <p className="text-xs font-bold tracking-[3px] text-brand uppercase mb-2">
        FERRAMENTA GRATUITA
      </p>
      <p className="font-heading text-lg font-bold text-foreground mb-2">
        {cta.title}
      </p>
      <p className="text-sm text-gray leading-relaxed mb-5">{cta.desc}</p>
      <Link
        href={cta.href}
        data-track="blog_cta_click"
        data-track-source="calculadora-custo"
        className="inline-flex text-sm font-bold text-white bg-brand px-6 py-3 rounded-full no-underline hover:scale-105 transition-transform"
      >
        {cta.button} &rarr;
      </Link>
    </aside>
  );
}

function MidArticleCta() {
  return (
    <aside className="glass-card !border-brand/20 my-10">
      <p className="font-heading text-lg font-bold text-foreground mb-2">
        Tem uma ideia de app ou sistema?
      </p>
      <p className="text-sm text-gray leading-relaxed mb-5">
        Baixe o template de especificação e organize o escopo antes de gastar
        com desenvolvimento — ou agende uma call gratuita de 15 minutos.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/recursos/spec-app-startup"
          data-track="blog_cta_click"
          data-track-source="mid-article-template"
          className="inline-flex text-sm font-bold text-white bg-brand px-6 py-3 rounded-full no-underline hover:scale-105 transition-transform"
        >
          Baixar template grátis
        </Link>
        <a
          href="https://cal.com/daniel-anders-emx5kl"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-brand hover:text-brand-bright transition-colors no-underline"
        >
          Agendar call gratuita →
        </a>
      </div>
    </aside>
  );
}

function ArticleContent({
  content,
  calculatorCta,
}: {
  content: string;
  calculatorCta?: CalculatorCtaConfig;
}) {
  const blocks = content.split("\n\n");

  // CTA inserido antes do H2 mais proximo da metade do artigo
  const headingIndexes = blocks
    .map((b, i) => (b.trim().startsWith("## ") ? i : -1))
    .filter((i) => i > 0);
  const half = Math.floor(blocks.length / 2);
  const ctaIndex =
    headingIndexes.length > 1
      ? headingIndexes.reduce((best, i) =>
          Math.abs(i - half) < Math.abs(best - half) ? i : best
        )
      : -1;

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        const cta =
          i === ctaIndex ? (
            calculatorCta ? (
              <CalculatorCta key={`cta-${i}`} cta={calculatorCta} />
            ) : (
              <MidArticleCta key={`cta-${i}`} />
            )
          ) : null;

        // H2 headings (o CTA de meio de artigo entra antes do H2 central)
        if (trimmed.startsWith("## ")) {
          return (
            <div key={i}>
              {cta}
              <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mt-10 mb-2">
                {trimmed.replace("## ", "")}
              </h2>
            </div>
          );
        }

        // H3 headings
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="font-heading text-lg font-bold text-foreground mt-8 mb-1"
            >
              {trimmed.replace("### ", "")}
            </h3>
          );
        }

        // Numbered or bulleted lists
        if (/^(\d+\.|-)/.test(trimmed)) {
          const items = trimmed.split("\n").filter(Boolean);
          const isOrdered = /^\d+\./.test(items[0]);
          const Tag = isOrdered ? "ol" : "ul";
          return (
            <Tag
              key={i}
              className={`text-gray leading-relaxed space-y-2 pl-6 ${
                isOrdered ? "list-decimal" : "list-disc"
              }`}
            >
              {items.map((item, j) => (
                <li key={j}>{item.replace(/^(\d+\.\s?|-\s?)/, "")}</li>
              ))}
            </Tag>
          );
        }

        // Regular paragraph
        return (
          <p key={i} className="text-gray leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

// ── Page ──

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, post.category);
  const relatedServices = getRelatedServicesForPost(post.slug);

  const postSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Daniel Anders",
      jobTitle: "Full-Stack Developer",
      url: "https://www.andersdev.com.br",
    },
    publisher: {
      "@type": "Organization",
      name: "Anders Dev",
      url: "https://www.andersdev.com.br",
      logo: {
        "@type": "ImageObject",
        url: "https://www.andersdev.com.br/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.andersdev.com.br/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    articleSection: categoryLabels[post.category],
    wordCount: post.content.split(/\s+/).length,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: "https://www.andersdev.com.br",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.andersdev.com.br/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://www.andersdev.com.br/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageNavbar
        links={[{ href: "/blog", label: "Blog" }]}
        cta={{ href: "/#contact", label: "FALAR COMIGO" }}
        narrow
      />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm text-gray mb-8 flex-wrap">
          <Link
            href="/"
            className="hover:text-brand transition-colors no-underline text-gray"
          >
            Início
          </Link>
          <span className="text-gray/50">/</span>
          <Link
            href="/blog"
            className="hover:text-brand transition-colors no-underline text-gray"
          >
            Blog
          </Link>
          <span className="text-gray/50">/</span>
          <span className="text-foreground line-clamp-1">{post.title}</span>
        </div>

        {/* ARTICLE HEADER */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[post.category]}`}
            >
              {categoryLabels[post.category]}
            </span>
            <span className="text-xs text-gray">
              {post.readingTime} min de leitura
            </span>
          </div>

          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg text-gray leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 pb-8 border-b border-white/[0.06]">
            <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand font-heading font-bold text-sm">
              DA
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Daniel Anders
              </p>
              <p className="text-xs text-gray">
                {formatDate(post.publishedAt)}
              </p>
            </div>
          </div>
        </header>

        {/* CTA CALCULADORA (posts de custo) */}
        {calculatorCtaBySlug[post.slug] && (
          <CalculatorCta cta={calculatorCtaBySlug[post.slug]} />
        )}

        {/* ARTICLE CONTENT */}
        <article className="mb-16">
          <ArticleContent
            content={post.content}
            calculatorCta={calculatorCtaBySlug[post.slug]}
          />
        </article>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mb-12 pb-8 border-b border-white/[0.06]">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* AUTHOR BLOCK */}
        <section className="glass-card mb-16">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center text-brand font-heading font-bold text-xl shrink-0">
              DA
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                Daniel Anders
              </h3>
              <p className="text-sm text-brand mb-3">
                Full-Stack Developer &amp; Business Consultant
              </p>
              <p className="text-sm text-gray leading-relaxed">
                Mais de 15 anos combinando tecnologia e negócios. Construo
                MVPs, SaaS e dashboards pra startups e empresas usando
                Next.js, TypeScript, Python e FastAPI. Baseado em Passo
                Fundo/RS, atendendo clientes no mundo todo.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <a
                  href="https://linkedin.com/in/danielandersbrrs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray hover:text-brand transition-colors no-underline"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/AndersD76"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray hover:text-brand transition-colors no-underline"
                >
                  GitHub
                </a>
                <a
                  href="https://www.andersdev.com.br"
                  className="text-xs text-gray hover:text-brand transition-colors no-underline"
                >
                  andersdev.com.br
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* RELATED POSTS */}
        {related.length > 0 && (
          <section className="mb-16">
            <h2 className="font-heading text-2xl font-bold mb-6">
              Artigos relacionados
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              {related.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="glass-card no-underline group"
                >
                  <span
                    className={`text-[0.65rem] font-bold px-2.5 py-0.5 rounded-full inline-block mb-3 ${categoryColors[rp.category]}`}
                  >
                    {categoryLabels[rp.category]}
                  </span>
                  <h3 className="font-heading text-sm font-bold text-foreground leading-snug mb-2 group-hover:text-brand transition-colors">
                    {rp.title}
                  </h3>
                  <p className="text-xs text-gray line-clamp-2">
                    {rp.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* RELATED SERVICES */}
        {relatedServices.length > 0 && (
          <section className="mb-16">
            <h2 className="font-heading text-2xl font-bold mb-6">
              Serviços relacionados
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              {relatedServices.map((svc) => (
                <Link
                  key={svc.slug}
                  href={`/servicos/${svc.slug}`}
                  className="glass-card no-underline group"
                >
                  <h3 className="font-heading text-sm font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
                    {svc.title.split("—")[0].trim()}
                  </h3>
                  <p className="text-xs text-gray line-clamp-2">
                    {svc.heroSubtitle}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center py-16" id="contato">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Pronto pra <span className="text-brand">construir?</span>
          </h2>
          <p className="text-gray text-lg mb-2">
            Transforme sua ideia em produto real com quem entende de
            tecnologia e negócios.
          </p>
          <p className="text-foreground font-heading font-bold text-xl mb-8">
            15 minutos. Sem custo. Sem compromisso.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://cal.com/daniel-anders-emx5kl"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              AGENDAR CALL GRATUITA &rarr;
            </a>
            <Link
              href="/#contact"
              className="text-sm text-gray hover:text-brand transition-colors no-underline"
            >
              ou envie uma mensagem
            </Link>
          </div>
        </section>
      </main>

      <PageFooter narrow />
    </>
  );
}
