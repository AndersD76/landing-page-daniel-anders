import { Metadata } from "next";
import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import { CalculadoraWizard } from "@/components/calculadora/CalculadoraWizard";

const BASE_URL = "https://www.andersdev.com.br";

export const metadata: Metadata = {
  title: "Calculadora: Quanto Custa Criar um Site em 2026? Simule Grátis",
  description:
    "Descubra em 1 minuto quanto custa criar seu site: landing page, site institucional ou e-commerce. Faixa de preço realista do mercado brasileiro 2026 com breakdown detalhado. Grátis.",
  keywords: [
    "quanto custa criar um site",
    "calculadora preço site",
    "quanto custa um site profissional",
    "preço site institucional",
    "quanto custa uma landing page",
    "quanto custa um e-commerce",
    "orçamento site 2026",
  ],
  openGraph: {
    title: "Calculadora: Quanto Custa Criar um Site em 2026?",
    description:
      "Simule em 1 minuto o custo do seu site com faixas de preço reais do mercado brasileiro. Landing page, institucional ou e-commerce.",
    url: `${BASE_URL}/calculadora-site`,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Calculadora de custo de site — AndersDev",
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/calculadora-site`,
  },
};

const faq = [
  {
    q: "Quanto custa criar um site profissional em 2026?",
    a: "No mercado freelancer brasileiro em 2026, uma landing page custa entre R$ 1.500 e R$ 4.000, um site institucional entre R$ 3.000 e R$ 10.000 e um e-commerce entre R$ 8.000 e R$ 25.000. O valor final depende do número de páginas, das integrações (pagamento, IA, ERP) e do prazo de entrega.",
  },
  {
    q: "O que faz um site custar mais caro?",
    a: "Os principais fatores que encarecem um site são: integrações com sistemas externos (pagamento online soma cerca de 20%, IA 25% e ERP/CRM até 30% do valor base), número de páginas acima de 10, design totalmente sob medida em vez de adaptado, conteúdo produzido do zero e prazos de entrega apertados, que podem adicionar 25% ao valor.",
  },
  {
    q: "A estimativa da calculadora é um orçamento fechado?",
    a: "Não. A calculadora entrega uma faixa realista baseada no mercado brasileiro de 2026 para você planejar o investimento. O orçamento fechado sai depois de uma conversa gratuita de 15 minutos para detalhar o escopo — e aí o valor vira compromisso, sem surpresa no final.",
  },
  {
    q: "Quanto tempo leva para criar um site?",
    a: "Uma landing page leva de 1 a 2 semanas, um site institucional de 2 a 4 semanas e um e-commerce de 4 a 8 semanas. Prazos menores são possíveis, mas exigem dedicação exclusiva e por isso custam mais.",
  },
  {
    q: "Hospedagem e domínio estão incluídos no preço?",
    a: "Normalmente não. Domínio (.com.br) custa cerca de R$ 40 por ano e hospedagem moderna (Vercel, Railway) varia de R$ 0 a R$ 100 por mês para a maioria dos sites. Eu deixo tudo configurado e documentado — os custos recorrentes ficam em contas suas, sem dependência de terceiros.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Como estimar o custo do seu site em 1 minuto",
    description:
      "Use a calculadora gratuita da AndersDev para descobrir a faixa de preço realista do seu site no mercado brasileiro de 2026.",
    totalTime: "PT1M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "BRL",
      value: "0",
    },
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Escolha o tipo de site",
        text: "Selecione entre landing page, site institucional ou e-commerce — cada tipo tem uma faixa de preço base diferente.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Informe o número de páginas",
        text: "Quanto mais páginas, maior o escopo de design e conteúdo. Sites com mais de 10 páginas têm ajuste proporcional.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Marque as integrações",
        text: "Pagamento online, IA, ERP/CRM e automação de marketing somam de 15% a 30% cada uma sobre o valor base.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Escolha o prazo",
        text: "Prazos com menos de 3 semanas adicionam 25% pelo regime de dedicação exclusiva. Prazos flexíveis reduzem o valor.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Veja a faixa de preço e receba o orçamento",
        text: "A calculadora mostra a faixa em reais com breakdown por item. Deixe seu e-mail para receber um orçamento detalhado sem compromisso.",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Calculadora de custo de site",
        item: `${BASE_URL}/calculadora-site`,
      },
    ],
  },
];

export default function CalculadoraSitePage() {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

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
          <span className="text-foreground">Calculadora de custo de site</span>
        </div>

        {/* HEADER */}
        <header className="mb-10">
          <span className="text-xs font-bold tracking-[4px] text-brand uppercase mb-4 block">
            FERRAMENTA GRATUITA
          </span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5">
            Quanto custa criar um site em 2026?{" "}
            <span className="text-brand">Calcule em 1 minuto</span>
          </h1>
          <p className="text-lg text-gray leading-relaxed">
            Responda 4 perguntas e receba uma faixa de preço realista pro
            mercado brasileiro — com breakdown do que compõe o valor. Sem
            cadastro pra ver o resultado, sem pegadinha de &quot;a partir
            de&quot;.
          </p>
        </header>

        {/* WIZARD */}
        <section className="mb-16" id="calculadora">
          <CalculadoraWizard variante="site" />
        </section>

        {/* CONTEUDO */}
        <section className="mb-16 space-y-5">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
            Como essa calculadora chega no preço
          </h2>
          <p className="text-gray leading-relaxed">
            As faixas partem dos valores praticados no mercado freelancer
            brasileiro em 2026 — os mesmos que eu pratico e que vejo em
            propostas de concorrentes sérios. Uma landing page focada em
            conversão fica entre R$ 1.500 e R$ 4.000. Um site institucional
            completo, com home, páginas de serviço, blog e contato, vai de R$
            3.000 a R$ 10.000. Um e-commerce com catálogo, carrinho e checkout
            fica entre R$ 8.000 e R$ 25.000. Sobre essa base, a calculadora
            aplica ajustes por número de páginas, integrações e prazo — os
            três fatores que mais mexem no orçamento na vida real.
          </p>

          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground pt-4">
            O que encarece um site (e o que não deveria)
          </h2>
          <p className="text-gray leading-relaxed">
            O que mais encarece um projeto de site não é o design — é a
            integração. Receber pagamento online (Pix, cartão, assinatura)
            adiciona em torno de 20% ao valor base, porque envolve gateway,
            webhooks, tratamento de erro e testes de ponta a ponta.
            Funcionalidades de IA, como chatbot treinado no seu conteúdo ou
            busca inteligente, somam cerca de 25%. Integração com ERP ou CRM é
            a mais cara, até 30%, porque cada sistema tem sua API, seus limites
            e suas surpresas. Automação de marketing (e-mail e WhatsApp
            transacional) adiciona uns 15%.
          </p>
          <p className="text-gray leading-relaxed">
            O prazo também pesa: entregar em menos de 3 semanas exige
            dedicação exclusiva e adiciona 25%. Já um cronograma flexível, de
            3 meses ou mais, permite encaixar o projeto com folga e sai um
            pouco mais barato. O que <em>não</em> deveria encarecer: reuniões
            de alinhamento, pequenos ajustes de texto e correções de bug logo
            após a entrega — isso é parte do trabalho bem feito, não
            &quot;extra&quot;.
          </p>

          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground pt-4">
            Exemplos reais por faixa de preço
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-white/[0.08] rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-white/[0.04] text-left">
                  <th className="px-4 py-3 font-bold text-foreground">
                    Faixa
                  </th>
                  <th className="px-4 py-3 font-bold text-foreground">
                    O que entra
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray">
                <tr className="border-t border-white/[0.06]">
                  <td className="px-4 py-3 whitespace-nowrap font-bold text-foreground">
                    R$ 1.500 – 4.000
                  </td>
                  <td className="px-4 py-3">
                    Landing page de captação pra clínica, advogado ou
                    infoproduto: 1 página, formulário, WhatsApp, SEO básico.
                  </td>
                </tr>
                <tr className="border-t border-white/[0.06]">
                  <td className="px-4 py-3 whitespace-nowrap font-bold text-foreground">
                    R$ 3.000 – 10.000
                  </td>
                  <td className="px-4 py-3">
                    Site institucional de 5 a 10 páginas com blog, formulários
                    e SEO estruturado. Com agendamento online ou área de
                    cliente, vai pro topo da faixa.
                  </td>
                </tr>
                <tr className="border-t border-white/[0.06]">
                  <td className="px-4 py-3 whitespace-nowrap font-bold text-foreground">
                    R$ 8.000 – 25.000
                  </td>
                  <td className="px-4 py-3">
                    E-commerce completo: catálogo, checkout com Pix e cartão,
                    painel de pedidos. Integração com ERP e frete leva ao topo
                    da faixa.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray leading-relaxed">
            Quer os números completos, com comparação entre freelancer,
            agência e plataformas prontas? Leia o guia{" "}
            <Link
              href="/blog/quanto-custa-criar-site-profissional-2026"
              className="text-brand hover:text-brand-bright transition-colors"
            >
              Quanto custa criar um site profissional em 2026
            </Link>
            . E se o seu projeto é um aplicativo ou sistema, use a{" "}
            <Link
              href="/calculadora-app"
              className="text-brand hover:text-brand-bright transition-colors"
            >
              calculadora de custo de app
            </Link>
            .
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-6">
            Perguntas frequentes
          </h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <details
                key={item.q}
                className="glass-card !p-5 group"
              >
                <summary className="font-heading font-bold text-foreground text-sm cursor-pointer list-none">
                  {item.q}
                </summary>
                <p className="text-sm text-gray leading-relaxed mt-3">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="text-center py-12">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Prefere conversar direto sobre{" "}
            <span className="text-brand">o seu projeto?</span>
          </h2>
          <p className="text-gray mb-8">
            15 minutos, sem custo. Você sai com um escopo mais claro mesmo que
            não feche comigo.
          </p>
          <a
            href="https://cal.com/daniel-anders-emx5kl"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn"
          >
            AGENDAR CALL GRATUITA &rarr;
          </a>
        </section>
      </main>

      <PageFooter narrow />
    </>
  );
}
