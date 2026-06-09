import { Metadata } from "next";
import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";

export const metadata: Metadata = {
  title: "Desenvolvimento pra Startups — Do MVP à Escala",
  description:
    "Desenvolvedor full-stack especializado em startups. MVP funcional em 2-6 semanas com Next.js, TypeScript e PostgreSQL. Entendo de negócio, não só de código. Agende uma call gratuita.",
  keywords: [
    "desenvolvedor para startups",
    "MVP desenvolvimento",
    "CTO técnico startup",
    "saas mvp brasil",
    "co-founder técnico",
    "startup developer brazil",
    "next.js mvp",
    "desenvolvimento ágil startup",
  ],
  openGraph: {
    title: "Desenvolvimento pra Startups — Do MVP à Escala",
    description:
      "MVP funcional em 2-6 semanas. Entendo de negócio, penso como co-founder, entrego como sênior. Agende uma call gratuita de 15 minutos.",
    url: "https://www.andersdev.com.br/para-startups",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Daniel Anders — Desenvolvimento pra Startups",
      },
    ],
  },
  alternates: {
    canonical: "https://www.andersdev.com.br/para-startups",
  },
};

const faqs = [
  {
    question: "Quanto tempo leva pra ter um MVP funcionando?",
    answer:
      "Depende do escopo, mas a maioria dos MVPs fica pronta em 2 a 6 semanas. Um MVP simples com landing page, autenticação e CRUD leva 2-3 semanas. Um MVP completo com pagamentos, dashboard e multi-tenancy leva 4-6 semanas. Na call de discovery a gente define o cronograma exato com milestones semanais — sem surpresas.",
  },
  {
    question: "Você aceita equity como pagamento?",
    answer:
      "Não aceito equity como forma de pagamento principal. Trabalho com preço fixo definido no discovery, com possibilidade de parcelamento por milestone. Em casos muito específicos posso discutir modelos de revenue share complementares, mas o desenvolvimento precisa ser pago. Isso protege os dois lados: você tem entrega garantida e eu tenho previsibilidade.",
  },
  {
    question: "O código é meu depois do projeto?",
    answer:
      "100% seu. Você recebe o repositório completo no GitHub, com toda a documentação, acesso ao deploy, e credenciais de todos os serviços. Se amanhã quiser trocar de desenvolvedor ou contratar um time interno, eles pegam o projeto e continuam sem precisar reescrever nada. Zero lock-in.",
  },
  {
    question: "Consigo escalar depois sem reescrever tudo?",
    answer:
      "Sim. A arquitetura é pensada desde o dia um pra escalar. Next.js escala horizontal no Vercel automaticamente, PostgreSQL no Neon escala sob demanda, e o código segue padrões que permitem adicionar features sem refatorar a base. Já tive clientes que foram de 0 a milhares de usuários sem precisar mexer na infraestrutura.",
  },
  {
    question: "Você ajuda a definir o que entra no MVP e o que fica pra depois?",
    answer:
      "Esse é um dos pontos mais importantes do meu trabalho. Na fase de discovery, passamos por cada feature e aplicamos o filtro: 'O usuário consegue resolver o problema central sem isso?' Se sim, vai pra v2. Minha experiência de 15 anos em negócios ajuda a separar o que gera valor imediato do que é nice-to-have. Muitos founders querem colocar tudo no MVP e acabam nunca lançando.",
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
  name: "Desenvolvimento para Startups — MVP e Escala",
  description:
    "Desenvolvimento full-stack de MVPs e produtos digitais para startups early-stage. Next.js, TypeScript, PostgreSQL. MVP funcional em 2-6 semanas.",
  provider: {
    "@type": "Person",
    name: "Daniel Anders",
    url: "https://www.andersdev.com.br",
    jobTitle: "Full-Stack Developer & Business Consultant",
  },
  areaServed: { "@type": "Country", name: "Brazil" },
  url: "https://www.andersdev.com.br/para-startups",
  serviceType: "MVP Development",
  offers: {
    "@type": "Offer",
    priceCurrency: "BRL",
    price: "5000",
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "BRL",
      price: "5000",
      description: "A partir de R$ 5.000 para MVP simples",
    },
  },
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
      name: "Para Startups",
      item: "https://www.andersdev.com.br/para-startups",
    },
  ],
};

export default function ParaStartupsPage() {
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

      <main className="max-w-[900px] mx-auto px-8 py-16">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm text-gray mb-8">
          <Link
            href="/"
            className="hover:text-brand transition-colors no-underline text-gray"
          >
            Início
          </Link>
          <span>/</span>
          <span className="text-foreground">Para Startups</span>
        </div>

        {/* HERO */}
        <section className="mb-16">
          <span className="section-label">STARTUPS</span>
          <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-6">
            Desenvolvimento pra Startups
            <br />
            <span className="text-brand">Do MVP à Escala</span>
          </h1>
          <p className="text-xl text-gray leading-relaxed mb-8">
            Você tem a visão do produto. Eu tenho a execução técnica e a
            experiência de negócio pra transformar isso em algo real. MVP
            funcional em 2-6 semanas, com arquitetura que escala quando os
            usuários chegarem.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://cal.com/daniel-anders-emx5kl"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              AGENDAR CALL DE 15 MIN
            </a>
            <Link
              href="/trabalhar-comigo"
              className="inline-flex items-center px-8 py-5 border border-white/10 rounded-full text-sm font-bold text-foreground no-underline hover:border-brand/30 transition-colors"
            >
              COMO FUNCIONA
            </Link>
          </div>
        </section>

        {/* PAIN POINTS */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Se você é founder, já passou por isso
          </h2>
          <div className="text-gray leading-relaxed mb-6">
            <p className="mb-4">
              Toda startup early-stage enfrenta os mesmos problemas na hora de
              construir o produto. Eu sei porque já vi dezenas de founders
              passarem exatamente por isso — e porque eu mesmo já estive do
              outro lado da mesa, tocando negócios e entendendo que tempo é o
              recurso mais escasso que existe.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {[
              {
                title: "Contratar um time inteiro é caro demais",
                desc: "Um CTO + 2 devs + 1 designer custa R$ 40-60k/mês em salários. Pra uma startup pre-seed, isso queima o runway em 3 meses antes de validar qualquer coisa. Um dev full-stack sênior entrega o mesmo resultado por uma fração do custo, sem CLT, sem escritório, sem gestão de equipe.",
              },
              {
                title: "O freelancer anterior entregou um código que ninguém mantém",
                desc: "Já vi isso centenas de vezes: o founder contrata o dev mais barato, recebe um código espaguete sem testes, sem documentação, sem padrão. Dois meses depois precisa reescrever tudo. Meu código é limpo, tipado, documentado e organizado pra qualquer dev React/Next.js pegar e continuar.",
              },
              {
                title: "Você não sabe se a ideia vai funcionar — e não quer investir 6 meses pra descobrir",
                desc: "MVP não é sobre construir o produto dos sonhos. É sobre construir o mínimo necessário pra validar a hipótese central. Se o mercado responder, a gente itera. Se não responder, você perdeu semanas, não meses. Essa disciplina de escopo é o que separa startups que lançam de startups que ficam no Figma.",
              },
              {
                title: "O dev não entende do negócio — só quer codar",
                desc: "A maioria dos desenvolvedores é excelente em código e péssima em contexto de negócio. Eu sou diferente: tenho 15+ anos de experiência operando empresas, implementando ISO 9001, gerenciando equipes. Quando você me explica o modelo de negócio, eu entendo. Quando sugiro cortar uma feature do MVP, é porque entendo o impacto no CAC, não só no sprint.",
              },
            ].map((pain) => (
              <div
                key={pain.title}
                className="glass-card"
              >
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {pain.title}
                </h3>
                <p className="text-sm text-gray leading-relaxed">
                  {pain.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* WHY DANIEL */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Por que founders escolhem trabalhar comigo
          </h2>
          <div className="text-gray leading-relaxed space-y-4">
            <p>
              Não sou um dev que pega briefing e some por 4 semanas. Sou um
              parceiro técnico que entende que startup é sobre velocidade,
              validação e iteração. Meu papel vai além de escrever código — é
              ajudar você a tomar as decisões técnicas certas pra não queimar
              dinheiro em infraestrutura prematura ou features que ninguém pediu.
            </p>
            <p>
              Com 15 anos de experiência em negócios e tecnologia, já passei
              por indústria, varejo, serviços e tech. Implementei processos
              ISO 9001, gerenciei equipes, operei negócios. Quando entro no
              seu projeto, não preciso de 3 semanas pra entender o que é
              churn, MRR ou unit economics — já é vocabulário do meu dia a dia.
            </p>
            <p>
              Isso muda tudo na dinâmica do projeto. Em vez de traduzir
              requisitos de negócio pra linguagem técnica, a gente conversa no
              mesmo nível. Quando você diz &quot;preciso reduzir o CAC&quot;, eu
              sei que o caminho passa por automação de onboarding, não por
              uma feature nova. Quando você diz &quot;o investidor quer ver
              tração&quot;, eu sei que a prioridade é analytics e métricas
              exportáveis, não UI polish.
            </p>
          </div>
        </section>

        {/* DIFFERENTIALS */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            O que me diferencia de um dev &quot;comum&quot;
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: "//",
                title: "Penso como co-founder",
                desc: "Não codifico features — resolvo problemas de negócio. Cada decisão técnica passa pelo filtro: isso ajuda o founder a validar mais rápido ou não?",
              },
              {
                icon: "{}",
                title: "Entrego rápido, sem cortar qualidade",
                desc: "MVP em 2-6 semanas com código limpo, tipado e testado. Não é protótipo descartável — é a base real do seu produto.",
              },
              {
                icon: "</>",
                title: "Stack moderna que escala",
                desc: "Next.js, TypeScript, PostgreSQL, Stripe. A mesma stack que startups de sucesso usam. Zero vendor lock-in.",
              },
              {
                icon: "$_",
                title: "Comunicação de negócio",
                desc: "Demos semanais com funcionalidade rodando em produção. Você vê progresso real toda semana, não relatórios de sprint.",
              },
              {
                icon: "--",
                title: "Preço fixo, sem surpresas",
                desc: "Escopo definido no discovery, preço fechado antes de começar. Se o escopo muda, a gente renegocia antes — transparência total.",
              },
              {
                icon: "+1",
                title: "30 dias de suporte pós-launch",
                desc: "Depois do lançamento, fico disponível por 30 dias pra ajustes, bug fixes e otimizações. Não abandono o projeto na sexta-feira do deploy.",
              },
            ].map((diff) => (
              <div key={diff.title} className="glass-card">
                <div className="text-2xl font-mono text-brand/30 mb-3">
                  {diff.icon}
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {diff.title}
                </h3>
                <p className="text-sm text-gray leading-relaxed">
                  {diff.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            O que está incluído no desenvolvimento do seu MVP
          </h2>
          <div className="text-gray leading-relaxed space-y-4 mb-6">
            <p>
              Cada MVP que construo inclui a infraestrutura que um produto
              real precisa pra funcionar em produção. Não é um protótipo no
              Figma ou uma demo que quebra — é software de verdade, com
              deploy, banco de dados, autenticação e tudo que você precisa
              pra colocar na frente de usuários reais e começar a validar.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {[
              {
                heading: "Autenticação e gestão de usuários",
                content:
                  "Login com email/senha, OAuth social (Google, GitHub), recuperação de senha, verificação de email. Multi-tenancy quando o modelo de negócio exigir. Implementado com NextAuth.js ou Clerk, dependendo do caso de uso.",
              },
              {
                heading: "Pagamentos e assinaturas",
                content:
                  "Integração completa com Stripe: checkout, assinaturas recorrentes, portal do cliente, webhooks pra processar eventos. Suporte a planos free, trial e paid. Funciona com cartão internacional e PIX via Stripe Brasil.",
              },
              {
                heading: "Dashboard e painel admin",
                content:
                  "Interface administrativa pra gerenciar usuários, visualizar métricas, configurar o produto. Gráficos interativos, filtros avançados, exportação de dados. Tudo responsivo e rápido.",
              },
              {
                heading: "API robusta e documentada",
                content:
                  "API RESTful com validação de entrada (Zod), autenticação JWT, rate limiting e logs estruturados. Documentada e pronta pra consumo por apps mobile ou integrações futuras com parceiros.",
              },
              {
                heading: "Deploy e infraestrutura",
                content:
                  "Deploy automatizado no Vercel com CI/CD via GitHub Actions. Banco de dados PostgreSQL no Neon (serverless, escala automático). Domínio customizado, SSL, e monitoramento básico incluídos.",
              },
              {
                heading: "Código-fonte e documentação",
                content:
                  "Repositório GitHub com código limpo, tipado e organizado. README com instruções de setup, variáveis de ambiente documentadas, e arquitetura explicada. Qualquer dev sênior pega e continua.",
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

        {/* MID CTA */}
        <div className="glass-card text-center py-8 my-8 border-brand/10">
          <p className="text-foreground font-medium mb-3">
            Tem uma ideia de produto? Vamos conversar sobre como transformar
            em MVP.
          </p>
          <a
            href="https://cal.com/daniel-anders-emx5kl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-brand hover:text-brand-bright transition-colors"
          >
            Agendar call gratuita de 15 min →
          </a>
        </div>

        {/* PRICING */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Investimento — quanto custa construir seu MVP
          </h2>
          <div className="text-gray leading-relaxed mb-6">
            <p>
              Preços transparentes, sem asterisco. O valor final é definido
              na call de discovery, depois de entender o escopo real do
              projeto. Os valores abaixo servem como referência pra você
              planejar.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                tier: "MVP Simples",
                price: "R$ 5.000",
                prefix: "a partir de",
                time: "2-3 semanas",
                items: [
                  "Landing page",
                  "Autenticação",
                  "CRUD principal",
                  "Deploy em produção",
                  "Código-fonte completo",
                ],
                highlight: false,
              },
              {
                tier: "MVP Completo",
                price: "R$ 12.000",
                prefix: "a partir de",
                time: "4-6 semanas",
                items: [
                  "Tudo do MVP Simples",
                  "Pagamentos (Stripe)",
                  "Dashboard admin",
                  "API documentada",
                  "30 dias de suporte",
                ],
                highlight: true,
              },
              {
                tier: "SaaS Completo",
                price: "R$ 25.000",
                prefix: "a partir de",
                time: "6-10 semanas",
                items: [
                  "Tudo do MVP Completo",
                  "Multi-tenancy",
                  "Billing avançado",
                  "Analytics integrado",
                  "Automação de emails",
                ],
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.tier}
                className={`glass-card text-center ${
                  plan.highlight ? "border-brand/20 bg-brand/[0.03]" : ""
                }`}
              >
                {plan.highlight && (
                  <div className="inline-block text-[0.6rem] font-bold tracking-[2px] text-brand bg-brand/10 px-3 py-1 rounded-full mb-3">
                    MAIS POPULAR
                  </div>
                )}
                <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                  {plan.tier}
                </h3>
                <p className="text-xs text-gray mb-2">{plan.prefix}</p>
                <p className="font-heading text-3xl font-bold text-brand mb-1">
                  {plan.price}
                </p>
                <p className="text-xs text-gray mb-4">{plan.time}</p>
                <ul className="text-left text-sm text-gray space-y-2">
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
            Todos os planos incluem: código-fonte completo, repositório
            GitHub, documentação, deploy em produção, e 30 dias de suporte
            pós-lançamento. Pagamento pode ser parcelado por milestone.
          </p>
        </section>

        {/* TESTIMONIALS REFERENCE */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            O que founders dizem sobre trabalhar comigo
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                quote:
                  "Entregou o projeto antes do prazo com qualidade acima das expectativas. Entende de negócio, não só de código. Foi como ter um co-founder técnico por 4 semanas.",
                name: "Rafael M.",
                role: "Founder, SaaS B2B",
                initials: "RM",
              },
              {
                quote:
                  "Comunicação impecável. Toda semana tinha demo funcional. Nunca trabalhei com um dev que entendesse tão bem do negócio. Recomendo pra qualquer founder que precisa de velocidade sem abrir mão de qualidade.",
                name: "Ana L.",
                role: "CEO, EdTech Startup",
                initials: "AL",
              },
            ].map((test) => (
              <div key={test.name} className="glass-card">
                <div className="text-3xl text-brand/20 font-heading leading-none mb-3">
                  &ldquo;
                </div>
                <p className="text-sm text-gray leading-relaxed mb-6">
                  {test.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand text-xs font-bold">
                    {test.initials}
                  </div>
                  <div>
                    <strong className="text-sm text-foreground block">
                      {test.name}
                    </strong>
                    <span className="text-xs text-gray">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RELATED SERVICES */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Serviços que founders mais pedem
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                slug: "desenvolvimento-saas-mvp",
                title: "SaaS e MVP",
                desc: "Do zero à produção com autenticação, pagamentos e dashboard.",
              },
              {
                slug: "integracoes-api-stripe",
                title: "Integrações e Stripe",
                desc: "APIs, webhooks, pagamentos recorrentes e integrações com terceiros.",
              },
              {
                slug: "aplicacoes-ia-llm",
                title: "IA e LLM",
                desc: "Chatbots, RAG, automação inteligente e processamento de documentos.",
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
            Perguntas frequentes de founders
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

        {/* PROCESS OVERVIEW */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Como funciona o processo
          </h2>
          <div className="text-gray leading-relaxed space-y-4 mb-6">
            <p>
              Meu processo de desenvolvimento é dividido em 4 fases claras,
              cada uma com entregáveis definidos e aprovação do founder antes
              de avançar. Sem caixa preta, sem surpresas.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {[
              {
                num: "01",
                title: "Discovery",
                time: "2-3 dias",
                desc: "Mapeamos funcionalidades, definimos o que entra no MVP e o que fica pra v2. Analisamos concorrentes, público-alvo e modelo de negócio. Saímos com um documento de escopo, cronograma e preço fechado.",
              },
              {
                num: "02",
                title: "Arquitetura",
                time: "2-3 dias",
                desc: "Defino modelo de dados, estrutura de API, configuração de infraestrutura e stack técnica. Você valida antes de começar a codar. Nenhuma linha de código é escrita antes dessa fase estar aprovada.",
              },
              {
                num: "03",
                title: "Build",
                time: "2-6 semanas",
                desc: "Desenvolvimento iterativo com demos semanais. Cada semana você vê funcionalidade nova rodando em produção. Feedback incorporado em tempo real. É aqui que o MVP ganha forma.",
              },
              {
                num: "04",
                title: "Launch",
                time: "2-3 dias",
                desc: "Deploy final, testes de carga, documentação completa e handoff. Treinamento de uso se necessário. Suporte pós-lançamento por 30 dias incluído.",
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-heading text-sm font-bold">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                    {step.title}{" "}
                    <span className="text-sm font-normal text-gray">
                      ({step.time})
                    </span>
                  </h3>
                  <p className="text-gray leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/trabalhar-comigo"
              className="text-sm font-bold text-brand hover:text-brand-bright transition-colors no-underline"
            >
              Ver processo detalhado →
            </Link>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="text-center py-16" id="contato">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Pronto pra tirar a ideia do{" "}
            <span className="text-brand">papel?</span>
          </h2>
          <p className="text-gray text-lg mb-2">
            Vamos conversar sobre o seu produto, o seu mercado e como
            construir o MVP certo — sem perder tempo com o que não importa
            agora.
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
