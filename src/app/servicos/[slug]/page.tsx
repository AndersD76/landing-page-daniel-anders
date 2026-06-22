import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import { services, getServiceBySlug, getServiceSlugs } from "@/data/services";
import { getRelatedPostsForService } from "@/data/interlinks";

export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.metaDescription,
    openGraph: {
      title: service.title,
      description: service.metaDescription,
      url: `https://www.andersdev.com.br/servicos/${service.slug}`,
    },
    alternates: {
      canonical: `https://www.andersdev.com.br/servicos/${service.slug}`,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = service.relatedServices
    .map((slug) => services.find((s) => s.slug === slug))
    .filter(Boolean);

  const relatedPosts = getRelatedPostsForService(service.slug);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.metaDescription,
    provider: {
      "@type": "Person",
      name: "Daniel Anders",
      url: "https://www.andersdev.com.br",
    },
    areaServed: "Worldwide",
    url: `https://www.andersdev.com.br/servicos/${service.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <PageNavbar cta={{ href: "#contato", label: "FALAR COMIGO" }} narrow />

      <main className="max-w-[900px] mx-auto px-8 py-16">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm text-gray mb-8">
          <Link href="/" className="hover:text-brand transition-colors no-underline text-gray">
            Início
          </Link>
          <span>/</span>
          <Link href="/#services" className="hover:text-brand transition-colors no-underline text-gray">
            Serviços
          </Link>
          <span>/</span>
          <span className="text-foreground">{service.keyword}</span>
        </div>

        {/* HERO */}
        <section className="mb-16">
          <span className="section-label">SERVIÇO</span>
          <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-6">
            {service.title}
          </h1>
          <p className="text-xl text-gray leading-relaxed mb-8">
            {service.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://cal.com/daniel-anders-emx5kl"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              AGENDAR CALL GRATUITA
            </a>
            <Link
              href="#contato"
              className="inline-flex items-center px-8 py-5 border border-white/10 rounded-full text-sm font-bold text-foreground no-underline hover:border-brand/30 transition-colors"
            >
              ENVIAR MENSAGEM
            </Link>
          </div>
        </section>

        {/* CONTENT SECTIONS */}
        {service.sections.map((section, i) => (
          <section key={i} className="mb-14">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
              {section.heading}
            </h2>
            {section.content && (
              <div className="text-gray leading-relaxed whitespace-pre-line mb-6">
                {section.content}
              </div>
            )}
            {section.subsections?.map((sub, j) => (
              <div key={j} className="mb-6 pl-6 border-l-2 border-brand/20">
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {sub.heading}
                </h3>
                <p className="text-gray leading-relaxed">{sub.content}</p>
              </div>
            ))}

            {/* MID-SECTION CTA */}
            {i === 1 && (
              <div className="glass-card text-center py-8 my-8">
                <p className="text-foreground font-medium mb-3">
                  {service.ctaText}
                </p>
                <a
                  href="https://cal.com/daniel-anders-emx5kl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-brand hover:text-brand-bright transition-colors"
                >
                  Agendar call gratuita →
                </a>
              </div>
            )}
          </section>
        ))}

        {/* TECH STACK */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl font-bold mb-6">
            Stack técnica
          </h2>
          <div className="flex flex-wrap gap-2">
            {service.techStack.map((tech) => (
              <span
                key={tech}
                className="text-sm text-brand/80 bg-brand/[0.08] px-4 py-2 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* RELATED CASE */}
        {service.relatedCase && (
          <section className="mb-14">
            <h2 className="font-heading text-2xl font-bold mb-6">
              Projeto relacionado
            </h2>
            <div className="glass-card">
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                {service.relatedCase.title}
              </h3>
              <p className="text-sm text-brand/70">
                {service.relatedCase.metrics}
              </p>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl font-bold mb-8">
            Perguntas frequentes
          </h2>
          <div className="flex flex-col gap-4">
            {service.faqs.map((faq, i) => (
              <details
                key={i}
                className="glass-card group cursor-pointer"
              >
                <summary className="font-heading font-bold text-foreground list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-brand group-open:rotate-45 transition-transform text-xl ml-4">
                    +
                  </span>
                </summary>
                <p className="text-gray leading-relaxed mt-4 pt-4 border-t border-white/[0.06]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* RELATED SERVICES */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl font-bold mb-6">
            Serviços relacionados
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {related.map(
              (svc) =>
                svc && (
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
                )
            )}
          </div>
        </section>

        {/* RELATED BLOG POSTS */}
        {relatedPosts.length > 0 && (
          <section className="mb-14">
            <h2 className="font-heading text-2xl font-bold mb-6">
              Artigos relacionados
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="glass-card no-underline group"
                >
                  <h3 className="font-heading text-sm font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray line-clamp-2">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FINAL CTA */}
        <section className="text-center py-16" id="contato">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Pronto pra <span className="text-brand">começar?</span>
          </h2>
          <p className="text-gray text-lg mb-2">{service.ctaText}</p>
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
              AGENDAR CALL GRATUITA →
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
