import { Metadata } from "next";
import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";

export const metadata: Metadata = {
  title: "MVPs Prontos pra Customizar — Apps e Sistemas",
  description:
    "Catálogo de aplicações pré-construídas prontas para customizar: CRM, PDV, Dashboard, Agendamentos, SaaS e Landing Pages. Lançamento rápido com código profissional. A partir de R$3.500.",
  keywords: [
    "mvp pronto",
    "sistema pronto customizar",
    "crm simples",
    "pdv ponto de venda",
    "dashboard monitoramento",
    "saas starter kit",
    "landing page premium",
    "plataforma agendamentos",
    "aplicativos prontos brasil",
    "desenvolvimento rápido mvp",
  ],
  openGraph: {
    title: "MVPs Prontos pra Customizar — Apps e Sistemas",
    description:
      "Catálogo de aplicações pré-construídas: CRM, PDV, Dashboard, SaaS e mais. Customização rápida com código profissional. A partir de R$3.500.",
    url: "https://www.andersdev.com.br/apps",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Daniel Anders — MVPs Prontos pra Customizar",
      },
    ],
  },
  alternates: {
    canonical: "https://www.andersdev.com.br/apps",
  },
};

const apps = [
  {
    icon: "📋",
    title: "CRM Simples",
    description:
      "Gestão de contatos, pipeline de vendas e acompanhamento de leads. Interface limpa e intuitiva pra equipes pequenas que precisam organizar o comercial sem complexidade.",
    stack: ["Next.js", "PostgreSQL", "Tailwind"],
    price: "R$ 4.000",
    features: [
      "Cadastro de contatos e empresas",
      "Pipeline de vendas drag-and-drop",
      "Histórico de interações",
      "Dashboard de métricas comerciais",
      "Filtros e busca avançada",
      "Exportação CSV/Excel",
    ],
  },
  {
    icon: "🛒",
    title: "PDV / Ponto de Venda",
    description:
      "Sistema de ponto de venda completo com controle de estoque, caixa e relatórios. Pronto pra rodar em tablet ou desktop no balcão.",
    stack: ["React", "Node.js", "PostgreSQL"],
    price: "R$ 6.000",
    features: [
      "Cadastro de produtos e categorias",
      "Controle de estoque em tempo real",
      "Abertura e fechamento de caixa",
      "Relatórios de vendas diários/mensais",
      "Impressão de cupom (térmica)",
      "Multi-usuário com permissões",
    ],
  },
  {
    icon: "📊",
    title: "Dashboard de Monitoramento",
    description:
      "Painel em tempo real com gráficos interativos, alertas e indicadores. Ideal pra monitorar IoT, infraestrutura, KPIs ou qualquer fonte de dados.",
    stack: ["React", "WebSocket", "Node.js"],
    price: "R$ 8.000",
    features: [
      "Gráficos em tempo real (WebSocket)",
      "Alertas configuráveis por threshold",
      "Múltiplos dashboards customizáveis",
      "Exportação de relatórios PDF",
      "Histórico de dados com filtros",
      "API para integração de sensores/dados",
    ],
  },
  {
    icon: "📅",
    title: "Plataforma de Agendamentos",
    description:
      "Sistema de agendamento online com calendário inteligente, confirmações automáticas e gestão de disponibilidade. Integrado com Cal.com.",
    stack: ["Next.js", "Cal.com", "PostgreSQL"],
    price: "R$ 5.000",
    features: [
      "Calendário interativo com slots",
      "Confirmação por email automática",
      "Gestão de disponibilidade",
      "Painel admin com agenda do dia",
      "Integração Google Calendar",
      "Lembretes automáticos (email/WhatsApp)",
    ],
  },
  {
    icon: "🚀",
    title: "SaaS Starter Kit",
    description:
      "Kit completo pra lançar um SaaS: autenticação, pagamentos recorrentes, dashboard multi-tenant e billing. A base que você precisa pra focar nas features do seu produto.",
    stack: ["Next.js", "Stripe", "PostgreSQL", "Auth"],
    price: "R$ 12.000",
    features: [
      "Autenticação completa (email + OAuth)",
      "Pagamentos recorrentes (Stripe)",
      "Multi-tenancy com isolamento de dados",
      "Dashboard admin e do usuário",
      "Billing portal e gerenciamento de planos",
      "API RESTful documentada",
    ],
  },
  {
    icon: "🎯",
    title: "Landing Page Premium",
    description:
      "Landing page de alta conversão com SEO avançado, formulário de captura de leads, analytics e design responsivo. Perfeita pra lançar um produto ou serviço.",
    stack: ["Next.js", "SEO", "Tailwind"],
    price: "R$ 3.500",
    features: [
      "Design responsivo e animações",
      "SEO técnico avançado (Schema.org, OG)",
      "Formulário de captura de leads",
      "Integração com email marketing",
      "Analytics e tracking configurados",
      "Performance 90+ no Lighthouse",
    ],
  },
];

const productSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "MVPs Prontos pra Customizar",
  description:
    "Catálogo de aplicações pré-construídas prontas para customização rápida.",
  url: "https://www.andersdev.com.br/apps",
  numberOfItems: apps.length,
  itemListElement: apps.map((app, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: app.title,
      description: app.description,
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        price: app.price.replace(/[^\d]/g, ""),
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "BRL",
          price: app.price.replace(/[^\d]/g, ""),
          description: `A partir de ${app.price}`,
        },
        availability: "https://schema.org/InStock",
      },
      brand: { "@type": "Brand", name: "AndersD76" },
    },
  })),
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
      name: "Apps & MVPs",
      item: "https://www.andersdev.com.br/apps",
    },
  ],
};

export default function AppsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageNavbar links={[{ href: "/apps/calculadora", label: "Calculadora" }]} />

      <main>
        {/* BREADCRUMB */}
        <div className="container-main pt-8">
          <div className="flex items-center gap-2 text-sm text-gray mb-8">
            <Link
              href="/"
              className="hover:text-brand transition-colors no-underline text-gray"
            >
              Início
            </Link>
            <span>/</span>
            <span className="text-foreground">Apps & MVPs</span>
          </div>
        </div>

        {/* HERO */}
        <section className="container-main pt-8 pb-16">
          <span className="section-label">CATÁLOGO DE APPS</span>
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            MVPs Prontos pra{" "}
            <span className="text-brand">Customizar</span>
          </h1>
          <p className="text-xl text-gray leading-relaxed max-w-2xl mb-8">
            Aplicações pré-construídas com código profissional, arquitetura
            escalável e stack moderna. Escolha a base, customize pro seu
            negócio e lance em semanas — não meses.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#catalogo" className="cta-btn">
              VER CATÁLOGO
            </a>
            <Link
              href="/apps/calculadora"
              className="inline-flex items-center px-8 py-5 border border-white/10 rounded-full text-sm font-bold text-foreground no-underline hover:border-brand/30 transition-colors tracking-widest uppercase"
            >
              CALCULAR INVESTIMENTO
            </Link>
          </div>
        </section>

        {/* WHY PRE-BUILT */}
        <section className="container-main pb-16">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">
            Por que partir de um MVP pronto?
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: "//",
                title: "Lançamento 3x mais rápido",
                desc: "A base já está pronta — autenticação, CRUD, deploy. Você customiza as regras de negócio e lança em semanas.",
              },
              {
                icon: "{}",
                title: "Código profissional desde o dia 1",
                desc: "TypeScript tipado, testes, CI/CD, documentação. Não é protótipo descartável — é produção de verdade.",
              },
              {
                icon: "$_",
                title: "Custo previsível",
                desc: "Preço fixo baseado na customização necessária. Sem surpresas, sem scope creep, sem cobranças por hora.",
              },
            ].map((item) => (
              <div key={item.title} className="glass-card">
                <div className="text-2xl font-mono text-brand/30 mb-3">
                  {item.icon}
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CATALOG */}
        <section className="container-main pb-20" id="catalogo">
          <span className="section-label">APLICAÇÕES DISPONÍVEIS</span>
          <h2 className="font-heading text-2xl md:text-4xl font-bold mb-4">
            Escolha a base do seu projeto
          </h2>
          <p className="text-gray text-lg mb-12 max-w-2xl">
            Cada aplicação inclui código-fonte completo, deploy configurado e
            documentação. Customize pro seu negócio ou use como ponto de
            partida.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <div
                key={app.title}
                className="glass-card flex flex-col h-full"
              >
                {/* Icon + Title */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl" role="img" aria-label={app.title}>
                    {app.icon}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground leading-tight">
                      {app.title}
                    </h3>
                    <p className="text-xs text-gray mt-0.5">a partir de</p>
                    <p className="font-heading text-xl font-bold text-brand">
                      {app.price}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray leading-relaxed mb-4">
                  {app.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {app.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[0.65rem] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-brand/10 text-brand border border-brand/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Features */}
                <ul className="text-sm text-gray space-y-1.5 mb-6 flex-1">
                  {app.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="text-brand mt-0.5 shrink-0 text-xs">
                        &#10003;
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="https://cal.com/daniel-anders-emx5kl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-sm font-bold text-white bg-brand/90 hover:bg-brand px-6 py-3 rounded-full no-underline transition-all hover:scale-[1.02] hover:shadow-brand-sm"
                >
                  QUERO ESSE APP
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* CALCULATOR CTA */}
        <section className="container-main pb-16">
          <div className="glass-card text-center py-10 border-brand/10 bg-brand/[0.02]">
            <span className="section-label">QUANTO VAI CUSTAR?</span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              Precisa de algo <span className="text-brand">diferente?</span>
            </h2>
            <p className="text-gray text-lg mb-8 max-w-xl mx-auto">
              Se nenhum app do catálogo atende 100%, use a calculadora pra
              estimar o investimento de um projeto sob medida.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/apps/calculadora" className="cta-btn">
                ABRIR CALCULADORA
              </Link>
              <a
                href="https://cal.com/daniel-anders-emx5kl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-brand hover:text-brand-bright transition-colors no-underline"
              >
                ou agende uma call gratuita →
              </a>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="container-main pb-16">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">
            Como funciona a customização
          </h2>
          <div className="flex flex-col gap-6">
            {[
              {
                num: "01",
                title: "Escolha a base",
                desc: "Selecione o app que mais se aproxima do que você precisa. A base já vem com autenticação, deploy e infraestrutura configurada.",
              },
              {
                num: "02",
                title: "Discovery rápido",
                desc: "Em uma call de 30 minutos, mapeamos as customizações necessárias: regras de negócio, integrações, design e funcionalidades extras.",
              },
              {
                num: "03",
                title: "Customização e entrega",
                desc: "Implemento as mudanças com demos semanais. Você acompanha cada passo e recebe o código-fonte completo ao final.",
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-heading text-sm font-bold">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES CROSS-LINK */}
        <section className="container-main pb-16">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Serviços relacionados
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                slug: "desenvolvimento-saas-mvp",
                title: "SaaS e MVP",
                desc: "Desenvolvimento do zero com autenticação, pagamentos e dashboard completo.",
              },
              {
                slug: "integracoes-api-stripe",
                title: "Integrações e Stripe",
                desc: "APIs, webhooks, pagamentos recorrentes e integrações com sistemas externos.",
              },
              {
                slug: "sites-landing-pages-seo",
                title: "Sites e Landing Pages",
                desc: "Landing pages de alta conversão com SEO técnico e captura de leads.",
              },
            ].map((svc) => (
              <Link
                key={svc.slug}
                href={`/servicos/${svc.slug}`}
                className="glass-card no-underline group"
              >
                <h3 className="font-heading text-sm font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
                  {svc.title}
                </h3>
                <p className="text-xs text-gray">{svc.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="container-main text-center py-20">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Pronto pra lançar seu{" "}
            <span className="text-brand">produto?</span>
          </h2>
          <p className="text-gray text-lg mb-2 max-w-xl mx-auto">
            Escolha um app do catálogo ou conte o que precisa. Em 15 minutos
            a gente define escopo, prazo e investimento.
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
              AGENDAR CALL GRATUITA
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

      <PageFooter />
    </>
  );
}
