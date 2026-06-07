import { Metadata } from "next";
import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import { getAllPosts, getAllCategories, type BlogPost } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog | Daniel Anders Dev",
  description:
    "Artigos sobre desenvolvimento de software, SaaS, startups e tecnologia. Dicas práticas pra fundadores e donos de negócio que querem construir produtos digitais.",
  openGraph: {
    title: "Blog | Daniel Anders Dev",
    description:
      "Artigos sobre desenvolvimento de software, SaaS, startups e tecnologia.",
    url: "https://andersdev.com.br/blog",
  },
  alternates: {
    canonical: "https://andersdev.com.br/blog",
  },
};

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
    month: "short",
    year: "numeric",
  });
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="glass-card no-underline group flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[post.category]}`}
        >
          {categoryLabels[post.category]}
        </span>
        <span className="text-xs text-gray">{post.readingTime} min de leitura</span>
      </div>

      <h2 className="font-heading text-lg font-bold text-foreground leading-snug mb-3 group-hover:text-brand transition-colors">
        {post.title}
      </h2>

      <p className="text-sm text-gray leading-relaxed mb-4 flex-1">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <span className="text-xs text-gray">{formatDate(post.publishedAt)}</span>
        <span className="text-xs font-bold text-brand group-hover:translate-x-1 transition-transform">
          Ler artigo &rarr;
        </span>
      </div>
    </Link>
  );
}

function CategoryTabs({
  categories,
}: {
  categories: BlogPost["category"][];
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-12">
      <Link
        href="/blog"
        className="text-xs font-bold tracking-[1px] uppercase px-5 py-2.5 rounded-full no-underline transition-all bg-brand text-white shadow-brand-glow"
      >
        Todos
      </Link>
      {categories.map((cat) => (
        <span
          key={cat}
          className="text-xs font-bold tracking-[1px] uppercase px-5 py-2.5 rounded-full transition-all bg-white/[0.06] border border-white/10 text-gray cursor-default"
        >
          {categoryLabels[cat]}
        </span>
      ))}
    </div>
  );
}

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog | Daniel Anders Dev",
    description:
      "Artigos sobre desenvolvimento de software, SaaS, startups e tecnologia.",
    url: "https://andersdev.com.br/blog",
    author: {
      "@type": "Person",
      name: "Daniel Anders",
      url: "https://andersdev.com.br",
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      url: `https://andersdev.com.br/blog/${post.slug}`,
      author: {
        "@type": "Person",
        name: "Daniel Anders",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <PageNavbar
        links={[
          { href: "/", label: "Home" },
          { href: "/#services", label: "Serviços" },
        ]}
        cta={{ href: "/#contact", label: "FALAR COMIGO" }}
      />

      <main className="container-main py-16">
        {/* HEADER */}
        <section className="mb-12">
          <span className="section-label">BLOG</span>
          <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-4">
            Artigos sobre{" "}
            <span className="text-brand">desenvolvimento</span>,{" "}
            negócios e tech
          </h1>
          <p className="text-lg text-gray max-w-2xl">
            Conteúdo prático pra fundadores e donos de negócio que querem
            construir produtos digitais sem enrolação.
          </p>
        </section>

        {/* CATEGORY TABS */}
        <CategoryTabs categories={categories} />

        {/* POST GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {/* CTA */}
        <section className="text-center py-20 mt-12 border-t border-white/[0.04]">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Tem um projeto em mente?
          </h2>
          <p className="text-gray text-lg mb-8 max-w-lg mx-auto">
            Agende uma conversa gratuita de 15 minutos e descubra como
            transformar sua ideia em produto.
          </p>
          <a
            href="https://cal.com/danielanders/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn"
          >
            AGENDAR CALL GRATUITA &rarr;
          </a>
        </section>
      </main>

      <PageFooter />
    </>
  );
}
