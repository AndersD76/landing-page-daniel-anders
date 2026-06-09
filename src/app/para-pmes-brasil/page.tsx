import { Metadata } from "next";
import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";

export const metadata: Metadata = {
  title: "Desenvolvimento Web pra PMEs — Modernize Sua Empresa",
  description:
    "Desenvolvimento web sob medida para pequenas e médias empresas. Substitua planilhas por sistemas, automatize processos e aumente a eficiência. Experiência com ISO 9001 e gestão empresarial.",
  keywords: [
    "desenvolvimento web pme",
    "sistema para empresa",
    "modernização empresa",
    "automação processos",
    "sistema gestão",
    "desenvolvedor pme brasil",
    "substituir planilha por sistema",
    "dashboard empresarial",
    "transformação digital pme",
  ],
  openGraph: {
    title: "Desenvolvimento Web pra PMEs — Modernize Sua Empresa",
    description:
      "Transforme planilhas em sistemas, automatize processos e tome decisões com dados reais. 15+ anos de experiência em negócios e tecnologia.",
    url: "https://www.andersdev.com.br/para-pmes-brasil",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Daniel Anders — Desenvolvimento Web pra PMEs",
      },
    ],
  },
  alternates: {
    canonical: "https://www.andersdev.com.br/para-pmes-brasil",
  },
};

const faqs = [
  {
    question: "Preciso parar minha operação pra implementar o sistema novo?",
    answer:
      "Não. A implementação é feita em paralelo com a operação existente. O sistema novo entra em funcionamento gradualmente — primeiro em uma área ou processo, depois expande. Seus colaboradores continuam usando as ferramentas atuais até o sistema novo estar 100% validado e o time treinado. Zero interrupção na operação.",
  },
  {
    question: "Meus funcionários não são bons com tecnologia. O sistema vai ser complicado?",
    answer:
      "Construo interfaces pensando em quem vai usar, não em quem vai demonstrar. Se o operador do chão de fábrica precisa usar, a interface vai ser simples o suficiente pra ele usar sem treinamento de 3 dias. Telas limpas, fluxos intuitivos, e só as informações que cada função precisa ver. Já implementei sistemas em indústrias onde 80% dos usuários nunca tinham usado nada além de WhatsApp e Excel.",
  },
  {
    question: "Quanto tempo leva pra ter retorno sobre o investimento?",
    answer:
      "Depende do processo automatizado, mas a maioria dos clientes vê retorno em 2-4 meses. Um sistema que elimina 20 horas semanais de trabalho manual de um funcionário que custa R$ 4.000/mês está economizando R$ 2.000/mês. Em 3-6 meses o sistema se pagou. Fora os ganhos intangíveis: menos erros, mais velocidade, dados pra decisão.",
  },
  {
    question: "Consigo integrar com o ERP/sistema que já uso?",
    answer:
      "Se o sistema atual tem API ou banco de dados acessível, sim. Já integrei com Totvs, SAP, Bling, Tiny, Omie, e vários ERPs nacionais. Mesmo que o sistema antigo não tenha API, geralmente consigo criar uma ponte via banco de dados ou importação/exportação automatizada. Na call de discovery eu avalio a viabilidade técnica.",
  },
  {
    question: "E se eu precisar de mudanças depois que o sistema estiver pronto?",
    answer:
      "Mudanças são normais e esperadas. Ofereço pacotes de manutenção mensal (a partir de R$ 2.000/mês) pra ajustes, novas features e suporte contínuo. Pra mudanças pontuais, orçamos por demanda. O importante é que o código é limpo e documentado — se você preferir outro dev no futuro, ele consegue dar manutenção sem problemas.",
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
  name: "Desenvolvimento Web para PMEs — Modernização Empresarial",
  description:
    "Desenvolvimento de sistemas web sob medida para pequenas e médias empresas. Dashboards, automação de processos, integração com ERPs e substituição de planilhas por sistemas profissionais.",
  provider: {
    "@type": "Person",
    name: "Daniel Anders",
    url: "https://www.andersdev.com.br",
    jobTitle: "Full-Stack Developer & Business Consultant",
  },
  areaServed: { "@type": "Country", name: "Brazil" },
  url: "https://www.andersdev.com.br/para-pmes-brasil",
  serviceType: "Custom Web Development for SMBs",
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
      name: "Para PMEs",
      item: "https://www.andersdev.com.br/para-pmes-brasil",
    },
  ],
};

export default function ParaPMEsPage() {
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
          <span className="text-foreground">Para PMEs</span>
        </div>

        {/* HERO */}
        <section className="mb-16">
          <span className="section-label">PMEs</span>
          <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-6">
            Desenvolvimento Web pra PMEs
            <br />
            <span className="text-brand">Modernize Sua Empresa</span>
          </h1>
          <p className="text-xl text-gray leading-relaxed mb-8">
            Sua empresa funciona, mas depende de planilhas, processos manuais
            e informação espalhada. Eu construo sistemas sob medida que
            organizam sua operação, eliminam retrabalho e colocam dados
            reais na mão de quem decide.
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
            O custo invisível de operar com planilhas e processos manuais
          </h2>
          <div className="text-gray leading-relaxed space-y-4">
            <p>
              Você conhece a cena: o gerente comercial mantém uma planilha de
              clientes que só ele entende. O financeiro cruza dados de 3
              sistemas diferentes pra fechar o mês. O estoque está no caderno
              do almoxarifado. O relatório pro sócio leva 2 dias pra montar
              porque os dados estão espalhados em 5 lugares.
            </p>
            <p>
              Isso funciona quando a empresa tem 10 funcionários e 50
              clientes. Quando cresce, vira gargalo. Cada hora que um
              funcionário qualificado gasta copiando dados entre planilhas é
              uma hora que ele não está vendendo, atendendo ou produzindo.
              Cada decisão baseada em &quot;feeling&quot; porque os dados não
              estão disponíveis é uma decisão que poderia ser 3x melhor com
              informação.
            </p>
            <p>
              O pior é que a maioria dos empresários já sabe disso, mas adia
              porque acha que &quot;sistematizar a empresa&quot; é um projeto
              de 6 meses e R$ 200.000. Não é. Com as ferramentas certas e um
              desenvolvedor que entende de negócio, dá pra automatizar os
              processos que mais doem em 4-8 semanas, por uma fração desse
              valor.
            </p>
          </div>
        </section>

        {/* ROI EXAMPLES */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Exemplos reais de retorno sobre investimento
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                scenario: "Relatórios automáticos vs. manuais",
                before:
                  "Analista financeiro gasta 16h/mês montando relatórios em Excel. Custo: ~R$ 2.500/mês em horas improdutivas.",
                after:
                  "Dashboard automático atualizado em tempo real. Zero horas manuais. Analista realocado pra análise estratégica.",
                roi: "ROI: sistema se paga em 3 meses. Economia acumulada de R$ 30.000/ano.",
              },
              {
                scenario: "Controle de estoque digital vs. caderno",
                before:
                  "Perdas por falta de controle: ~5% do estoque/mês. Em um estoque de R$ 200.000, são R$ 10.000/mês perdidos.",
                after:
                  "Sistema com entrada/saída automatizada, alertas de mínimo, e relatório de giro. Perdas caem pra <1%.",
                roi: "ROI: sistema se paga no primeiro mês. Economia de R$ 96.000/ano.",
              },
              {
                scenario: "CRM customizado vs. planilha de clientes",
                before:
                  "Leads se perdem, follow-ups esquecem, pipeline invisível. Taxa de conversão: 8%.",
                after:
                  "Pipeline visual, alertas de follow-up, histórico completo de interações. Taxa de conversão sobe pra 15%.",
                roi: "ROI: cada ponto percentual de conversão pode representar R$ 5-50k/mês dependendo do ticket.",
              },
            ].map((example) => (
              <div key={example.scenario} className="glass-card">
                <h3 className="font-heading text-lg font-bold text-foreground mb-3">
                  {example.scenario}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div className="pl-4 border-l-2 border-white/10">
                    <span className="text-xs font-bold tracking-[2px] text-gray/60 block mb-1">
                      ANTES
                    </span>
                    <p className="text-sm text-gray">{example.before}</p>
                  </div>
                  <div className="pl-4 border-l-2 border-brand/30">
                    <span className="text-xs font-bold tracking-[2px] text-brand/60 block mb-1">
                      DEPOIS
                    </span>
                    <p className="text-sm text-gray">{example.after}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-brand">{example.roi}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHY DANIEL */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Por que um dev que entende de negócio faz diferença
          </h2>
          <div className="text-gray leading-relaxed space-y-4">
            <p>
              Antes de ser desenvolvedor, eu já era empresário. Trabalhei 15+
              anos gerenciando operações, implementando processos de qualidade
              (ISO 9001), liderando equipes e tomando decisões com dados
              imperfeitos. Sei o que é fechar um mês no vermelho, negociar com
              fornecedor, e tentar escalar uma operação que depende de 3
              planilhas e 1 pessoa que &quot;sabe de tudo&quot;.
            </p>
            <p>
              Essa experiência muda completamente como eu abordo um projeto
              de tecnologia pra PME. Não chego perguntando &quot;qual
              framework você quer?&quot; — chego perguntando &quot;qual
              processo te dá mais dor de cabeça?&quot;, &quot;onde você perde
              dinheiro sem perceber?&quot;, &quot;que informação você gostaria
              de ter na mão todo dia de manhã?&quot;.
            </p>
            <p>
              O resultado é um sistema que resolve problemas reais do negócio,
              não um sistema bonito que ninguém usa porque não foi pensado pra
              quem realmente opera. Cada tela, cada relatório, cada
              automação existe porque resolve um problema que eu entendo —
              porque já vivi esse problema do outro lado.
            </p>
          </div>
        </section>

        {/* ISO 9001 SECTION */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Background em ISO 9001 e gestão de processos
          </h2>
          <div className="text-gray leading-relaxed space-y-4 mb-6">
            <p>
              Implementar ISO 9001 em uma empresa te obriga a mapear cada
              processo, documentar cada procedimento, medir cada resultado.
              É exatamente o mesmo pensamento que aplico quando construo um
              sistema: primeiro entendo o fluxo real (não o fluxo ideal),
              depois identifico onde a tecnologia pode eliminar fricção,
              erro ou retrabalho.
            </p>
            <p>
              Isso significa que o sistema que construo não é uma camada de
              tecnologia jogada por cima de um processo quebrado. É um
              sistema que reflete o processo otimizado — e que vai ajudar
              sua equipe a seguir o processo certo por padrão, sem depender
              de memória, boa vontade ou planilha colorida.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: "//",
                title: "Mapeamento de processos",
                desc: "Antes de codar, mapeio o fluxo real da operação. Identifico gargalos, redundâncias e oportunidades de automação.",
              },
              {
                icon: "{}",
                title: "Indicadores que importam",
                desc: "Defino KPIs relevantes pro negócio, não vanity metrics. Cada número no dashboard tem ação associada.",
              },
              {
                icon: "</>",
                title: "Melhoria contínua",
                desc: "O sistema é projetado pra evoluir. Novas métricas, novos relatórios, novos processos — sem reescrever tudo.",
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

        {/* WHAT I BUILD */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            O que construo pra PMEs
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                heading: "Dashboards de gestão",
                content:
                  "Visão completa da operação em tempo real: vendas, estoque, financeiro, produção. Cada gestor vê o que é relevante pra ele. Filtros por período, filial, produto. Exportação pra PDF e Excel. Integração com seu ERP atual.",
              },
              {
                heading: "Sistemas de controle operacional",
                content:
                  "Controle de pedidos, ordens de serviço, manutenção preventiva, checklist de qualidade. Workflows configuráveis com alertas automáticos. Histórico completo e rastreabilidade pra auditorias.",
              },
              {
                heading: "CRM e gestão comercial",
                content:
                  "Pipeline de vendas visual, gestão de contatos e empresas, histórico de interações, follow-up automatizado. Relatórios de performance por vendedor, produto e período. Integração com WhatsApp e email.",
              },
              {
                heading: "Automação de processos internos",
                content:
                  "Eliminação de tarefas manuais repetitivas: geração de relatórios, envio de notificações, atualização de registros entre sistemas, processamento de documentos. O que seu time faz em 4 horas, o sistema faz em 4 segundos.",
              },
              {
                heading: "Portais de cliente e fornecedor",
                content:
                  "Área restrita onde clientes acompanham pedidos, acessam documentos e abrem chamados. Portal de fornecedor pra cotações e pedidos de compra. Reduz carga de atendimento e profissionaliza a comunicação.",
              },
              {
                heading: "Sites institucionais e landing pages",
                content:
                  "Presença digital profissional com SEO otimizado, formulários de contato inteligentes, integração com Google Analytics e WhatsApp. Design que transmite credibilidade e gera leads orgânicos.",
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
            Quer modernizar a operação da sua empresa? Vamos mapear os
            processos que mais impactam o resultado.
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

        {/* INDUSTRY EXPERIENCE */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Setores onde já atuei
          </h2>
          <div className="text-gray leading-relaxed mb-6">
            <p>
              Minha experiência abrange diferentes setores, o que me permite
              trazer soluções cruzadas — uma automação que funciona na
              indústria pode ser adaptada pro varejo, e vice-versa. Cada
              setor tem suas particularidades, mas os problemas de gestão
              são surpreendentemente parecidos.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                sector: "Indústria",
                examples:
                  "Controle de produção, monitoramento IoT, manutenção preventiva, rastreabilidade de lotes, dashboards de OEE.",
              },
              {
                sector: "Comércio e varejo",
                examples:
                  "Gestão de estoque, CRM, e-commerce B2B, portal de vendedores, integração com marketplaces.",
              },
              {
                sector: "Serviços",
                examples:
                  "Gestão de ordens de serviço, agendamento, portal do cliente, relatórios de atendimento, SLA tracking.",
              },
              {
                sector: "Agro e rural",
                examples:
                  "Monitoramento de safra, controle de insumos, rastreabilidade, dashboards de produtividade por talhão.",
              },
            ].map((item) => (
              <div key={item.sector} className="glass-card">
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {item.sector}
                </h3>
                <p className="text-sm text-gray leading-relaxed">
                  {item.examples}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Investimento — quanto custa modernizar sua operação
          </h2>
          <div className="text-gray leading-relaxed mb-6">
            <p>
              O investimento depende da complexidade do projeto. Na call de
              discovery mapeamos as necessidades e apresento um orçamento
              detalhado com cronograma. Valores de referência:
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                tier: "Projeto Pontual",
                price: "R$ 6.000",
                prefix: "a partir de",
                time: "2-4 semanas",
                items: [
                  "Dashboard ou sistema simples",
                  "1-2 integrações",
                  "Treinamento da equipe",
                  "Deploy em produção",
                  "30 dias de suporte",
                ],
                highlight: false,
              },
              {
                tier: "Projeto Completo",
                price: "R$ 18.000",
                prefix: "a partir de",
                time: "4-8 semanas",
                items: [
                  "Sistema multi-módulo",
                  "Integração com ERP",
                  "Dashboard gerencial",
                  "App mobile responsivo",
                  "60 dias de suporte",
                ],
                highlight: true,
              },
              {
                tier: "Manutenção Mensal",
                price: "R$ 2.000",
                prefix: "a partir de",
                time: "contínuo",
                items: [
                  "Novas features sob demanda",
                  "Bug fixes prioritários",
                  "Atualizações de segurança",
                  "Suporte por WhatsApp",
                  "Relatórios mensais",
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
                    MAIS COMPLETO
                  </div>
                )}
                <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                  {plan.tier}
                </h3>
                <p className="text-xs text-gray mb-2">{plan.prefix}</p>
                <p className="font-heading text-3xl font-bold text-brand mb-1">
                  {plan.price}
                </p>
                <p className="text-xs text-gray mb-4">
                  {plan.time === "contínuo" ? "/mês" : plan.time}
                </p>
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
            Todos os projetos incluem: código-fonte completo, documentação,
            deploy em produção, treinamento do time, e suporte pós-
            lançamento. Pagamento parcelado por milestone disponível.
          </p>
        </section>

        {/* RELATED SERVICES */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Serviços mais procurados por PMEs
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                slug: "dashboards-analytics",
                title: "Dashboards e Analytics",
                desc: "Visualize dados da operação em tempo real com gráficos e KPIs.",
              },
              {
                slug: "migracao-stack-legado",
                title: "Migração de Sistemas",
                desc: "Modernize sistemas antigos sem parar a operação.",
              },
              {
                slug: "integracoes-api-stripe",
                title: "Integrações e APIs",
                desc: "Conecte seus sistemas existentes e automatize fluxos entre eles.",
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
            Perguntas frequentes de empresários
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
            Pronto pra{" "}
            <span className="text-brand">modernizar sua empresa?</span>
          </h2>
          <p className="text-gray text-lg mb-2">
            Vamos conversar sobre os processos que mais pesam na sua
            operação e como a tecnologia pode resolver — de forma prática e
            com retorno mensurável.
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
