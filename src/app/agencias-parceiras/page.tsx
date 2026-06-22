import { Metadata } from "next";
import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";

export const metadata: Metadata = {
  title: "Parceria pra Agências — Dev Full-Stack White-Label",
  description:
    "Desenvolvimento full-stack white-label para agências digitais. Capacidade de overflow, entrega confiável, comunicação profissional. Parceria B2B com SLA e preços competitivos.",
  keywords: [
    "desenvolvedor para agências",
    "white label desenvolvimento",
    "dev overflow agência",
    "parceiro técnico agência digital",
    "terceirização desenvolvimento web",
    "freelancer para agência",
    "full-stack white-label brasil",
    "agência parceira desenvolvedor",
  ],
  openGraph: {
    title: "Parceria pra Agências — Dev Full-Stack White-Label",
    description:
      "Capacidade de overflow confiável para sua agência. Entrego no prazo, na qualidade, com sua marca. Desenvolvimento full-stack com Next.js, React e TypeScript.",
    url: "https://www.andersdev.com.br/agencias-parceiras",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Daniel Anders — Parceria para Agências",
      },
    ],
  },
  alternates: {
    canonical: "https://www.andersdev.com.br/agencias-parceiras",
  },
};

const faqs = [
  {
    question: "Como funciona o modelo white-label?",
    answer:
      "Eu trabalho nos bastidores, invisível pro seu cliente. Toda comunicação passa por você (ou pelo canal que definirmos). O código é entregue no repositório da sua agência, com as convenções de código que vocês usam. O cliente nunca sabe que existe um parceiro externo — pra todos os efeitos, o trabalho é da agência. Se precisar participar de alguma call com o cliente final, entro como 'parte do time'.",
  },
  {
    question: "Qual o prazo mínimo de antecedência pra alocar um projeto?",
    answer:
      "Idealmente, 1 semana de antecedência pra projetos novos. Pra demandas urgentes (bug em produção, hotfix), consigo atender em 24-48h dependendo da minha agenda. Agências com contrato mensal têm prioridade de alocação e não precisam de antecedência — é como ter um dev on-call.",
  },
  {
    question: "Você trabalha com deadline apertado?",
    answer:
      "Sim, faz parte da rotina de agência. Se o prazo é viável, eu aceito e entrego. Se não é viável, falo na hora — antes de aceitar, não depois de perder o deadline. Transparência na avaliação de prazo é fundamental pra relação de confiança. Nunca prometo o que não consigo entregar.",
  },
  {
    question: "Aceita projetos pontuais ou só contrato mensal?",
    answer:
      "Os dois. Projetos pontuais são orçados por escopo com preço fixo. Contratos mensais têm desconto, prioridade de alocação e flexibilidade pra distribuir horas entre projetos diferentes. Agências que mandam fluxo constante geralmente preferem o mensal — é mais previsível pros dois lados.",
  },
  {
    question: "Que tipo de projeto você NÃO aceita?",
    answer:
      "Não faço design (UI/UX), não faço WordPress/Elementor, e não aceito projetos sem escopo definido. Se a agência não tem designer, posso recomendar parceiros. Meu foco é desenvolvimento web com código customizado — React, Next.js, TypeScript, Node.js, Python. Se o projeto envolve essas tecnologias, estou dentro.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Parceria para Agências — Desenvolvimento Full-Stack White-Label",
  description:
    "Desenvolvimento full-stack white-label para agências digitais. Capacidade de overflow, SLA definido, comunicação profissional e preços competitivos para parceiros B2B.",
  provider: {
    "@type": "Person",
    name: "Daniel Anders",
    url: "https://www.andersdev.com.br",
    jobTitle: "Full-Stack Developer",
  },
  areaServed: { "@type": "Country", name: "Brazil" },
  url: "https://www.andersdev.com.br/agencias-parceiras",
  serviceType: "White-Label Web Development",
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
      name: "Agências Parceiras",
      item: "https://www.andersdev.com.br/agencias-parceiras",
    },
  ],
};

export default function AgenciasParceirasPage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageNavbar narrow />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm text-gray mb-8">
          <Link
            href="/"
            className="hover:text-brand transition-colors no-underline text-gray"
          >
            Início
          </Link>
          <span>/</span>
          <span className="text-foreground">Agências Parceiras</span>
        </div>

        {/* HERO */}
        <section className="mb-16">
          <span className="section-label">AGÊNCIAS</span>
          <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-6">
            Parceria pra Agências
            <br />
            <span className="text-brand">Dev Full-Stack White-Label</span>
          </h1>
          <p className="text-xl text-gray leading-relaxed mb-8">
            Sua agência vende, eu desenvolvo. White-label, no prazo, na
            qualidade, com sua marca. Capacidade de overflow quando o time
            interno não dá conta, ou parceria fixa pra projetos técnicos
            que exigem código customizado.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://cal.com/daniel-anders-emx5kl"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              AGENDAR CALL DE PARCERIA
            </a>
            <Link
              href="/trabalhar-comigo"
              className="inline-flex items-center px-8 py-5 border border-white/10 rounded-full text-sm font-bold text-foreground no-underline hover:border-brand/30 transition-colors"
            >
              VER PROCESSO
            </Link>
          </div>
        </section>

        {/* THE PROBLEM */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            O dilema de toda agência que cresce
          </h2>
          <div className="text-gray leading-relaxed space-y-4">
            <p>
              Sua agência está crescendo. Os projetos estão ficando mais
              técnicos — clientes querem dashboards, integrações, apps
              customizados, não só sites em WordPress. Mas contratar um dev
              sênior CLT custa R$ 15-25k/mês com encargos, e freelancers
              genéricos entregam código que vira dívida técnica em 3 meses.
            </p>
            <p>
              O resultado é previsível: ou a agência recusa projetos
              técnicos (e perde receita), ou aceita e entrega com
              qualidade inconsistente (e perde o cliente depois). Nos dois
              cenários, a agência está deixando dinheiro na mesa.
            </p>
            <p>
              Uma parceria com um dev full-stack sênior resolve isso. Você
              mantém o relacionamento com o cliente, a gestão do projeto e a
              margem. Eu entrego o código — limpo, testado, documentado, no
              prazo. Sem surpresas, sem ghosting, sem retrabalho.
            </p>
          </div>
        </section>

        {/* HOW PARTNERSHIP WORKS */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Como a parceria funciona na prática
          </h2>
          <div className="flex flex-col gap-6">
            {[
              {
                num: "01",
                title: "Briefing e escopo",
                desc: "Você me passa o briefing do projeto (pode ser o mesmo que recebeu do cliente). Eu avalio viabilidade, estimo prazo e custo, e devolvo uma proposta técnica que você pode usar como base pro orçamento ao cliente. Tempo: 24-48h.",
              },
              {
                num: "02",
                title: "Alinhamento técnico",
                desc: "Definimos stack, repositório, convenções de código, e canal de comunicação. Se a agência tem padrões próprios, eu sigo. Se não tem, sugiro. Tudo fica documentado antes de começar.",
              },
              {
                num: "03",
                title: "Desenvolvimento",
                desc: "Desenvolvimento com updates regulares (diários ou semanais, como preferir). Código commitado no repo da agência, com PRs revisáveis. Deploy em staging pra validação antes de produção.",
              },
              {
                num: "04",
                title: "Entrega e handoff",
                desc: "Código entregue com documentação. Se a agência tem time interno pra manter, faço o handoff técnico. Se não tem, ofereço manutenção contínua. O cliente nunca sabe que eu existo.",
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

        {/* WHAT I DELIVER */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            O que eu entrego pra agências
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                heading: "Sites e landing pages de alta performance",
                content:
                  "Next.js com SSG/ISR, Tailwind CSS, animações suaves, SEO técnico perfeito. Performance 90+ no Lighthouse. Responsivo, acessível, rápido. O tipo de site que faz o cliente da agência falar 'nossa, ficou incrível'.",
              },
              {
                heading: "Aplicações web customizadas",
                content:
                  "Dashboards, painéis admin, portais de cliente, ferramentas internas. React + TypeScript + PostgreSQL. Autenticação, CRUD, integrações, deploy. Tudo que vai além do WordPress e precisa de código real.",
              },
              {
                heading: "Integrações e automações",
                content:
                  "Conectar o site do cliente com CRM, ERP, gateway de pagamento, email marketing. Webhooks, APIs customizadas, sincronização de dados. O tipo de projeto que o dev júnior da agência não consegue resolver.",
              },
              {
                heading: "MVPs e produtos digitais",
                content:
                  "Quando o cliente da agência quer ir além do site e construir um produto (SaaS, app, marketplace). Eu construo a parte técnica, a agência mantém o design e o relacionamento.",
              },
              {
                heading: "Manutenção e evolução",
                content:
                  "Projetos que a agência entregou mas não tem braço pra manter. Bug fixes, novas features, atualizações de segurança, otimização de performance. Pego o código existente e dou continuidade.",
              },
            ].map((item) => (
              <div
                key={item.heading}
                className="pl-6 border-l-2 border-brand/20"
              >
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {item.heading}
                </h3>
                <p className="text-gray leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SLA AND COMMUNICATION */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            SLA e comunicação — o que você pode esperar
          </h2>
          <div className="text-gray leading-relaxed space-y-4 mb-6">
            <p>
              Agência vive de prazo e reputação. Um parceiro técnico que
              atrasa ou some destrói os dois. Por isso trabalho com SLA
              definido e comunicação transparente — se algo muda, você sabe
              antes do cliente perceber.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            {[
              {
                title: "Resposta em 4h (horário comercial)",
                desc: "Mensagens respondidas em até 4 horas durante horário comercial (9h-18h, seg-sex). Urgências em até 2h. Sem ghosting, sem 'vou ver e te retorno'.",
              },
              {
                title: "Updates regulares sem pedir",
                desc: "Status do projeto enviado proativamente — diário ou semanal, como preferir. Você não precisa cobrar update. Se há bloqueio ou risco de atraso, eu aviso antes.",
              },
              {
                title: "Código revisável a qualquer momento",
                desc: "Todo código em repositório Git com commits organizados e PRs descritivos. Seu tech lead pode revisar a qualquer momento. Nada de 'código no meu computador'.",
              },
              {
                title: "Prazo é prazo",
                desc: "Se combinei sexta-feira, entrego sexta-feira. Se percebo que o prazo está em risco, aviso com antecedência e proponho solução — não espero o deadline passar pra dar a má notícia.",
              },
              {
                title: "Confidencialidade total",
                desc: "NDA disponível. Nunca menciono projetos de agência no meu portfólio sem autorização explícita. Seu cliente é seu cliente — eu sou invisível.",
              },
              {
                title: "Flexibilidade de comunicação",
                desc: "Slack, Discord, WhatsApp, email, Google Meet — uso o canal que a agência preferir. Me adapto ao workflow de vocês, não o contrário.",
              },
            ].map((item) => (
              <div key={item.title} className="glass-card">
                <h3 className="font-heading text-base font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* MID CTA */}
        <div className="glass-card text-center py-8 my-8 border-brand/10">
          <p className="text-foreground font-medium mb-3">
            Quer testar a parceria com um projeto piloto? Vamos conversar.
          </p>
          <a
            href="https://cal.com/daniel-anders-emx5kl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-brand hover:text-brand-bright transition-colors"
          >
            Agendar call de 15 min →
          </a>
        </div>

        {/* WHY ME */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Por que agências preferem trabalhar comigo
          </h2>
          <div className="text-gray leading-relaxed space-y-4">
            <p>
              Diferente de freelancers que pegam qualquer projeto e vivem
              atrasando, ou devs juniores que precisam de supervisão
              constante, eu funciono como uma extensão senior do time da
              agência. Pego o briefing, faço as perguntas certas, e entrego
              sem precisar de microgerenciamento.
            </p>
            <p>
              Minha experiência com gestão empresarial e ISO 9001 significa
              que entendo de prazo, escopo, e gestão de expectativas — não
              sou o dev que vive pedindo &quot;mais uma semana&quot;. Se o
              escopo muda no meio do projeto (e em agência sempre muda), eu
              avalio o impacto, comunico rápido, e proponho alternativas.
            </p>
            <p>
              Além disso, entendo a dinâmica de agência: margem apertada,
              clientes exigentes, prazos curtos, escopo fluido. Não fico
              chocado quando o cliente muda de ideia na quarta-feira e o
              delivery é sexta. Avalio, proponho, executo.
            </p>
          </div>
        </section>

        {/* PRICING */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Modelo de preços pra agências
          </h2>
          <div className="text-gray leading-relaxed mb-6">
            <p>
              Ofereço dois modelos de precificação. Agências podem escolher
              o que faz mais sentido pro volume de projetos.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            {[
              {
                tier: "Por Projeto",
                price: "Preço fixo",
                desc: "Ideal pra projetos pontuais ou pra testar a parceria",
                items: [
                  "Orçamento fechado por escopo",
                  "Pagamento por milestone",
                  "Sem compromisso mensal",
                  "Ideal pra começar a relação",
                  "Landing pages a partir de R$ 3.000",
                  "Aplicações a partir de R$ 8.000",
                ],
                highlight: false,
              },
              {
                tier: "Contrato Mensal",
                price: "A partir de R$ 6.000/mês",
                desc: "Ideal pra agências com fluxo constante de projetos",
                items: [
                  "Banco de horas flexível",
                  "Prioridade de alocação",
                  "Desconto de 15-20% vs. por projeto",
                  "Distribuir horas entre projetos",
                  "Suporte prioritário",
                  "Planning mensal conjunto",
                ],
                highlight: true,
              },
            ].map((plan) => (
              <div
                key={plan.tier}
                className={`glass-card ${
                  plan.highlight ? "border-brand/20 bg-brand/[0.03]" : ""
                }`}
              >
                {plan.highlight && (
                  <div className="inline-block text-[0.6rem] font-bold tracking-[2px] text-brand bg-brand/10 px-3 py-1 rounded-full mb-3">
                    RECOMENDADO
                  </div>
                )}
                <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                  {plan.tier}
                </h3>
                <p className="font-heading text-lg font-bold text-brand mb-2">
                  {plan.price}
                </p>
                <p className="text-sm text-gray mb-4">{plan.desc}</p>
                <ul className="text-sm text-gray space-y-2">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-brand mt-0.5 shrink-0">
                        &#10003;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray mt-4">
            Valores de referência para agências. NDA e contrato formal
            disponíveis. Primeira reunião de alinhamento é por minha conta.
          </p>
        </section>

        {/* STACK */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Stack técnica
          </h2>
          <div className="text-gray leading-relaxed mb-4">
            <p>
              Trabalho com a stack que o mercado mais demanda e que oferece
              melhor custo-benefício pra projetos web em 2026.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "React",
              "Next.js 14",
              "TypeScript",
              "Tailwind CSS",
              "Node.js",
              "Python",
              "FastAPI",
              "PostgreSQL",
              "Prisma",
              "Drizzle ORM",
              "Stripe",
              "Vercel",
              "Docker",
              "GitHub Actions",
              "shadcn/ui",
              "Recharts",
            ].map((tech) => (
              <span
                key={tech}
                className="text-sm text-brand/80 bg-brand/[0.08] px-4 py-2 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* RELATED SERVICES */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Serviços mais procurados por agências
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            {[
              {
                slug: "desenvolvimento-react-next-js",
                title: "React e Next.js",
                desc: "Sites e aplicações de alta performance com a stack mais demandada.",
              },
              {
                slug: "desenvolvimento-saas-mvp",
                title: "SaaS e MVP",
                desc: "Quando o cliente da agência quer construir um produto digital.",
              },
              {
                slug: "integracoes-api-stripe",
                title: "Integrações e APIs",
                desc: "Conectar sistemas do cliente, pagamentos, automações.",
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

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">
            Perguntas frequentes de agências
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <details key={i} className="glass-card group cursor-pointer">
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

        {/* FINAL CTA */}
        <section className="text-center py-16" id="contato">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Vamos construir uma{" "}
            <span className="text-brand">parceria que funciona?</span>
          </h2>
          <p className="text-gray text-lg mb-2">
            Uma conversa de 15 minutos pra entender o volume de projetos,
            o tipo de trabalho, e como posso complementar o time da sua
            agência.
          </p>
          <p className="text-foreground font-heading font-bold text-xl mb-8">
            Sem compromisso. Sem pitch de venda. Só alinhamento.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://cal.com/daniel-anders-emx5kl"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              AGENDAR CALL DE PARCERIA →
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
