import { Metadata } from "next";
import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";
import { CalculadoraWizard } from "@/components/calculadora/CalculadoraWizard";

const BASE_URL = "https://www.andersdev.com.br";

export const metadata: Metadata = {
  title: "Calculadora: Quanto Custa Desenvolver um App em 2026? Simule Grátis",
  description:
    "Descubra em 1 minuto quanto custa desenvolver seu app ou SaaS: MVP, app mobile ou sistema completo com backend. Faixa de preço realista do mercado brasileiro 2026 com breakdown. Grátis.",
  keywords: [
    "quanto custa desenvolver um app",
    "calculadora preço aplicativo",
    "quanto custa fazer um aplicativo",
    "quanto custa um saas",
    "custo mvp 2026",
    "preço desenvolvimento app brasil",
    "orçamento aplicativo",
  ],
  openGraph: {
    title: "Calculadora: Quanto Custa Desenvolver um App em 2026?",
    description:
      "Simule em 1 minuto o custo do seu app ou SaaS com faixas de preço reais do mercado brasileiro. MVP, mobile ou sistema completo.",
    url: `${BASE_URL}/calculadora-app`,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Calculadora de custo de app — AndersDev",
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/calculadora-app`,
  },
};

const faq = [
  {
    q: "Quanto custa desenvolver um aplicativo em 2026?",
    a: "No mercado freelancer brasileiro em 2026, um app mobile simples custa entre R$ 12.000 e R$ 30.000, um MVP SaaS entre R$ 15.000 e R$ 40.000 e um app completo com backend e painel admin entre R$ 25.000 e R$ 60.000. Integrações com pagamento, IA ou ERP somam de 15% a 30% cada uma sobre o valor base.",
  },
  {
    q: "O que encarece o desenvolvimento de um app?",
    a: "Os maiores fatores de custo são: backend próprio com API e painel administrativo, número de telas acima de 12, integrações externas (pagamento soma cerca de 20%, IA 25% e ERP até 30%), publicação nas duas lojas (App Store e Google Play) e prazo apertado, que pode adicionar 25% pelo regime de dedicação exclusiva.",
  },
  {
    q: "Por que a faixa de preço de um app é tão ampla?",
    a: "Porque 'app' descreve escopos muito diferentes. Um catálogo com 5 telas e um marketplace com pagamento dividido, notificações e painel admin são projetos com semanas de diferença de trabalho. A calculadora estreita a faixa ao considerar tipo, número de telas, integrações e prazo do seu caso específico.",
  },
  {
    q: "Vale mais a pena começar por um MVP?",
    a: "Na maioria dos casos, sim. Um MVP com o núcleo do produto funcionando custa uma fração do produto completo, valida a ideia com usuários reais em 4 a 8 semanas e evita gastar R$ 60.000 numa hipótese. As funcionalidades seguintes são priorizadas com dados de uso, não com achismo.",
  },
  {
    q: "A estimativa da calculadora é um orçamento fechado?",
    a: "Não. É uma faixa realista baseada no mercado brasileiro de 2026 para você planejar o investimento. O orçamento fechado sai depois de uma conversa gratuita de 15 minutos para detalhar o escopo — e aí o valor vira compromisso, com entregas semanais demonstráveis.",
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
    name: "Como estimar o custo do seu app em 1 minuto",
    description:
      "Use a calculadora gratuita da AndersDev para descobrir a faixa de preço realista do seu app ou SaaS no mercado brasileiro de 2026.",
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
        name: "Escolha o tipo de app",
        text: "Selecione entre app mobile simples, MVP SaaS ou app completo com backend — cada tipo tem uma faixa de preço base diferente.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Informe o número de telas",
        text: "Quanto mais telas, maior o escopo de design e desenvolvimento. Apps com mais de 12 telas têm ajuste proporcional.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Marque as integrações",
        text: "Pagamento, IA, ERP e notificações push/WhatsApp somam de 15% a 30% cada uma sobre o valor base.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Escolha o prazo",
        text: "Prazos com menos de 6 semanas adicionam 25% pelo regime de dedicação exclusiva. Prazos flexíveis reduzem o valor.",
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
        name: "Calculadora de custo de app",
        item: `${BASE_URL}/calculadora-app`,
      },
    ],
  },
];

export default function CalculadoraAppPage() {
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
          <span className="text-foreground">Calculadora de custo de app</span>
        </div>

        {/* HEADER */}
        <header className="mb-10">
          <span className="text-xs font-bold tracking-[4px] text-brand uppercase mb-4 block">
            FERRAMENTA GRATUITA
          </span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5">
            Quanto custa desenvolver um app em 2026?{" "}
            <span className="text-brand">Calcule em 1 minuto</span>
          </h1>
          <p className="text-lg text-gray leading-relaxed">
            Responda 4 perguntas e receba uma faixa de preço realista pro
            mercado brasileiro — com breakdown do que compõe o valor. Sem
            cadastro pra ver o resultado, sem orçamento inflado de agência.
          </p>
        </header>

        {/* WIZARD */}
        <section className="mb-16" id="calculadora">
          <CalculadoraWizard variante="app" />
        </section>

        {/* CONTEUDO */}
        <section className="mb-16 space-y-5">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
            Como essa calculadora chega no preço
          </h2>
          <p className="text-gray leading-relaxed">
            As faixas partem dos valores praticados no mercado freelancer
            brasileiro em 2026 — os mesmos que eu pratico nos meus projetos.
            Um app mobile simples, tipo catálogo, agendamento ou cartão
            fidelidade, fica entre R$ 12.000 e R$ 30.000. Um MVP SaaS — o
            produto web mínimo com login, assinatura e o núcleo do negócio
            funcionando — vai de R$ 15.000 a R$ 40.000. Um app completo com
            backend próprio, API e painel administrativo, como marketplace,
            delivery ou logística, fica entre R$ 25.000 e R$ 60.000. Sobre
            essa base, a calculadora aplica ajustes por número de telas,
            integrações e prazo — os três fatores que mais mexem no orçamento
            na prática.
          </p>

          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground pt-4">
            O que encarece um app (e o que não deveria)
          </h2>
          <p className="text-gray leading-relaxed">
            A regra geral: cada sistema externo que o app precisa conversar
            adiciona custo — e não é pouco. Pagamento (Pix, cartão,
            assinatura, split entre vendedores) soma em torno de 20% do valor
            base, porque envolve gateway, webhooks, estorno e testes de ponta
            a ponta. Funcionalidades de IA, como chatbot, recomendação ou
            leitura de documentos, somam cerca de 25%. Integração com ERP ou
            sistemas internos da empresa é a mais cara, até 30%, porque cada
            sistema legado tem sua API (ou a falta dela). Notificações push e
            WhatsApp somam uns 15%.
          </p>
          <p className="text-gray leading-relaxed">
            O número de telas importa mais do que parece: cada tela é design,
            estado, validação e teste. E o prazo pesa — entregar em menos de 6
            semanas exige dedicação exclusiva e adiciona 25%. O que{" "}
            <em>não</em> deveria encarecer: reuniões semanais de demo,
            pequenos ajustes de fluxo durante o desenvolvimento e correção de
            bugs no primeiro mês. Isso é parte de um trabalho profissional,
            não hora extra.
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
                    R$ 12.000 – 30.000
                  </td>
                  <td className="px-4 py-3">
                    App de agendamento pra clínica ou barbearia: 6-10 telas,
                    login, notificações push, painel simples pro dono.
                  </td>
                </tr>
                <tr className="border-t border-white/[0.06]">
                  <td className="px-4 py-3 whitespace-nowrap font-bold text-foreground">
                    R$ 15.000 – 40.000
                  </td>
                  <td className="px-4 py-3">
                    MVP SaaS B2B: web app com login, assinatura via cartão,
                    dashboard e a funcionalidade central do negócio validável
                    em 4-8 semanas.
                  </td>
                </tr>
                <tr className="border-t border-white/[0.06]">
                  <td className="px-4 py-3 whitespace-nowrap font-bold text-foreground">
                    R$ 25.000 – 60.000
                  </td>
                  <td className="px-4 py-3">
                    Marketplace ou delivery completo: app do cliente, painel
                    do vendedor, pagamento com split, notificações e admin.
                    Integração com ERP leva ao topo da faixa.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray leading-relaxed">
            Quer o breakdown completo, incluindo custos de infraestrutura e a
            comparação entre freelancer, agência e equipe própria? Leia o guia{" "}
            <Link
              href="/blog/quanto-custa-desenvolver-app-saas-2026"
              className="text-brand hover:text-brand-bright transition-colors"
            >
              Quanto custa desenvolver um app SaaS em 2026
            </Link>
            . E se o seu projeto é um site ou e-commerce, use a{" "}
            <Link
              href="/calculadora-site"
              className="text-brand hover:text-brand-bright transition-colors"
            >
              calculadora de custo de site
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
