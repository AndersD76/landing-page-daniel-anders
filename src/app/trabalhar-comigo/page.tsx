import { Metadata } from "next";
import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";

export const metadata: Metadata = {
  title: "Como Trabalhar Comigo — Processo em 4 Fases",
  description:
    "Conheça o processo de desenvolvimento em 4 fases: Discovery, Arquitetura, Build e Launch. Saiba o que esperar, o que preparar e como funciona cada semana de trabalho.",
  keywords: [
    "processo desenvolvimento web",
    "como contratar desenvolvedor",
    "fases desenvolvimento software",
    "metodologia desenvolvimento",
    "trabalhar com desenvolvedor freelancer",
    "processo mvp",
    "discovery sprint",
    "processo ágil freelancer",
  ],
  openGraph: {
    title: "Como Trabalhar Comigo — Processo em 4 Fases",
    description:
      "Discovery, Arquitetura, Build, Launch. 4 fases claras com entregáveis definidos, demos semanais e transparência total. Conheça o processo.",
    url: "https://www.andersdev.com.br/trabalhar-comigo",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Daniel Anders — Como Trabalhar Comigo",
      },
    ],
  },
  alternates: {
    canonical: "https://www.andersdev.com.br/trabalhar-comigo",
  },
};

const faqs = [
  {
    question: "Preciso ter tudo definido antes de começar?",
    answer:
      "Não. A fase de Discovery existe exatamente pra isso — juntos definimos escopo, prioridades e cronograma. Você pode chegar com uma ideia na cabeça, um rabisco no caderno, ou um Figma completo. Qualquer ponto de partida funciona. O que eu preciso é que você tenha clareza sobre o problema que quer resolver e o público que quer atingir. O resto a gente constrói junto.",
  },
  {
    question: "E se eu precisar mudar algo no meio do projeto?",
    answer:
      "Mudanças pequenas fazem parte do processo e são absorvidas naturalmente nas sprints semanais. Mudanças de escopo maiores (adicionar um módulo inteiro, por exemplo) a gente renegocia prazo e valor antes de implementar. O importante é que nenhuma mudança acontece sem alinhamento prévio — sem surpresas na fatura, sem atrasos não comunicados. Transparência total.",
  },
  {
    question: "Qual o seu horário de trabalho e tempo de resposta?",
    answer:
      "Trabalho em horário comercial brasileiro (9h-18h, segunda a sexta). Mensagens são respondidas em até 4 horas durante o expediente. Pra urgências em produção (bug crítico, sistema fora do ar), tenho disponibilidade estendida. Não trabalho fins de semana exceto em situações excepcionais previamente combinadas.",
  },
  {
    question: "Posso acompanhar o progresso em tempo real?",
    answer:
      "Sim. Todo o código é commitado em repositório Git com acesso compartilhado. Cada feature é deployada em ambiente de staging assim que fica pronta. Além das demos semanais formais, você pode acessar o staging a qualquer momento e ver o estado atual do projeto. Uso Slack ou WhatsApp pra comunicação rápida e Google Meet pra calls.",
  },
  {
    question: "O que acontece se você ficar doente ou indisponível?",
    answer:
      "Trabalho solo, então indisponibilidades são comunicadas imediatamente. O código está sempre em repositório, documentado e organizado — qualquer dev sênior consegue pegar de onde parei. Em 15 anos de carreira, nunca perdi um deadline por questão de saúde. Mas se acontecer, você tem acesso total ao código e ao ambiente, e eu te ajudo a encontrar um substituto se necessário.",
  },
  {
    question: "Você emite nota fiscal?",
    answer:
      "Sim. Emito NFS-e (nota fiscal de serviço eletrônica) pra todos os projetos. Pagamento via PIX, transferência bancária ou boleto. Pra clientes internacionais, aceito transferência via Wise ou PayPal. Contrato formal disponível pra quem preferir.",
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

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Como trabalhar com Daniel Anders — Processo de desenvolvimento em 4 fases",
  description:
    "Processo de desenvolvimento web em 4 fases: Discovery, Arquitetura, Build e Launch. Do briefing ao produto em produção.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Discovery",
      text: "Mapeamento de funcionalidades, definição de escopo, análise de concorrentes e modelo de negócio. Resultado: documento de escopo com cronograma e preço fechado.",
      url: "https://www.andersdev.com.br/trabalhar-comigo#discovery",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Arquitetura",
      text: "Definição de modelo de dados, estrutura de API, stack técnica e infraestrutura. Validação do cliente antes de iniciar o código.",
      url: "https://www.andersdev.com.br/trabalhar-comigo#arquitetura",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Build",
      text: "Desenvolvimento iterativo com demos semanais. Cada semana uma entrega funcional em ambiente de staging. Feedback incorporado em tempo real.",
      url: "https://www.andersdev.com.br/trabalhar-comigo#build",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Launch",
      text: "Deploy final em produção, testes de carga, documentação completa, treinamento e handoff. 30 dias de suporte pós-lançamento incluídos.",
      url: "https://www.andersdev.com.br/trabalhar-comigo#launch",
    },
  ],
  totalTime: "P6W",
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
      name: "Trabalhar Comigo",
      item: "https://www.andersdev.com.br/trabalhar-comigo",
    },
  ],
};

export default function TrabalharComigoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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
          <span className="text-foreground">Trabalhar Comigo</span>
        </div>

        {/* HERO */}
        <section className="mb-16">
          <span className="section-label">PROCESSO</span>
          <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-6">
            Como Trabalhar Comigo
            <br />
            <span className="text-brand">Processo em 4 Fases</span>
          </h1>
          <p className="text-xl text-gray leading-relaxed mb-8">
            Da primeira conversa ao produto em produção, cada passo é
            transparente e previsível. Sem caixa preta, sem surpresas, sem
            &quot;confia em mim&quot;. Você sabe exatamente o que está
            acontecendo a cada semana.
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
              href="/para-startups"
              className="inline-flex items-center px-8 py-5 border border-white/10 rounded-full text-sm font-bold text-foreground no-underline hover:border-brand/30 transition-colors"
            >
              SOU STARTUP
            </Link>
          </div>
        </section>

        {/* OVERVIEW */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Visão geral — do briefing ao produto rodando
          </h2>
          <div className="text-gray leading-relaxed space-y-4">
            <p>
              Meu processo é dividido em 4 fases sequenciais. Cada fase tem
              entregáveis claros e aprovação do cliente antes de avançar. Não
              existe &quot;vou sumir por 3 semanas e aparecer com o projeto
              pronto&quot;. Cada semana tem entrega visível — você acompanha
              o progresso em tempo real e dá feedback que é incorporado
              imediatamente.
            </p>
            <p>
              Esse processo funciona pra qualquer tipo de projeto: MVP pra
              startup, sistema pra PME, desenvolvimento white-label pra
              agência. A duração de cada fase varia, mas a estrutura é a
              mesma. Previsibilidade é o que permite entregar no prazo e no
              custo — sem heroísmo de última hora.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-8">
            {[
              { num: "01", name: "Discovery", time: "2-3 dias" },
              { num: "02", name: "Arquitetura", time: "2-3 dias" },
              { num: "03", name: "Build", time: "2-8 semanas" },
              { num: "04", name: "Launch", time: "2-3 dias" },
            ].map((phase) => (
              <div
                key={phase.num}
                className="glass-card text-center py-4 px-2"
              >
                <span className="text-brand font-heading text-sm font-bold block">
                  {phase.num}
                </span>
                <span className="text-foreground font-heading text-sm font-bold block mt-1">
                  {phase.name}
                </span>
                <span className="text-xs text-gray block mt-1">
                  {phase.time}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* PHASE 1: DISCOVERY */}
        <section className="mb-14" id="discovery">
          <div className="flex items-center gap-4 mb-6">
            <div className="shrink-0 w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-heading text-lg font-bold">
              01
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold">
                Fase 1 — Discovery
              </h2>
              <p className="text-sm text-gray">
                Duração: 2-3 dias | Custo: incluído no projeto
              </p>
            </div>
          </div>
          <div className="text-gray leading-relaxed space-y-4 mb-6">
            <p>
              A fase de Discovery é onde tudo começa. É uma conversa
              estruturada onde eu entendo profundamente o problema que você
              quer resolver, o público-alvo, o modelo de negócio e as
              restrições (prazo, budget, técnicas). O objetivo é sair dessa
              fase com um documento de escopo que os dois concordam — sem
              ambiguidades.
            </p>
            <p>
              Não é uma call de vendas. É uma sessão de trabalho. Eu faço
              perguntas, questiono premissas, e ajudo a separar o que é
              essencial do que é desejável. Muitos clientes chegam com uma
              lista de 30 features e saem com 8 que realmente importam pro
              MVP. Essa curadoria é tão valiosa quanto o código.
            </p>
          </div>
          <div className="glass-card mb-6">
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              O que fazemos na Discovery
            </h3>
            <div className="flex flex-col gap-3">
              {[
                "Entendimento do problema e do público-alvo",
                "Mapeamento de funcionalidades (must-have vs. nice-to-have)",
                "Análise de concorrentes e referências",
                "Definição do escopo do MVP (ou do projeto)",
                "Escolha de stack técnica e justificativa",
                "Estimativa de prazo e custo com milestones",
                "Definição de critérios de aceite pra cada entrega",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-brand mt-0.5 shrink-0">&#10003;</span>
                  <span className="text-gray text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card border-brand/10">
            <h3 className="font-heading text-lg font-bold text-foreground mb-3">
              O que você precisa preparar
            </h3>
            <div className="text-gray text-sm leading-relaxed space-y-2">
              <p>
                <strong className="text-foreground">Essencial:</strong>{" "}
                Descrição do problema que quer resolver e quem é o usuário
                final. Pode ser um parágrafo, um pitch deck, ou uma
                explicação verbal — qualquer formato serve.
              </p>
              <p>
                <strong className="text-foreground">Ideal:</strong>{" "}
                Referências visuais de produtos similares, lista inicial de
                features desejadas, e noção de budget. Quanto mais contexto
                você trouxer, mais produtiva a Discovery.
              </p>
              <p>
                <strong className="text-foreground">Opcional:</strong>{" "}
                Wireframes, protótipos no Figma, documentos de requisito.
                Se você tem isso pronto, ótimo — aceleramos a fase. Se não,
                construímos juntos durante a Discovery.
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 border border-white/[0.06] rounded-xl bg-white/[0.02]">
            <p className="text-sm text-gray">
              <strong className="text-foreground">Resultado:</strong>{" "}
              Documento de escopo com lista de funcionalidades, cronograma
              com milestones semanais, preço total, e contrato. Ambas as
              partes assinam antes de avançar.
            </p>
          </div>
        </section>

        {/* PHASE 2: ARCHITECTURE */}
        <section className="mb-14" id="arquitetura">
          <div className="flex items-center gap-4 mb-6">
            <div className="shrink-0 w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-heading text-lg font-bold">
              02
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold">
                Fase 2 — Arquitetura
              </h2>
              <p className="text-sm text-gray">
                Duração: 2-3 dias | Inclui setup de infra
              </p>
            </div>
          </div>
          <div className="text-gray leading-relaxed space-y-4 mb-6">
            <p>
              Antes de escrever a primeira linha de código, defino a
              arquitetura técnica completa. Isso inclui modelo de dados,
              estrutura de APIs, organização de pastas, e configuração de
              infraestrutura (banco de dados, deploy, CI/CD). Você recebe
              um overview técnico em linguagem acessível pra validar.
            </p>
            <p>
              Essa fase existe pra evitar o problema mais comum em projetos
              de software: começar a codar sem planejamento e ter que
              refatorar tudo na semana 3. Duas horas de planejamento aqui
              economizam dias de retrabalho depois.
            </p>
          </div>
          <div className="glass-card mb-6">
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              O que é definido na Arquitetura
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Modelo de dados",
                  desc: "Tabelas, relacionamentos, índices. Pensado pra performance e pra escalar sem rewrite.",
                },
                {
                  title: "Estrutura de API",
                  desc: "Endpoints, autenticação, validação. Documentação OpenAPI quando aplicável.",
                },
                {
                  title: "Organização do código",
                  desc: "Pastas, módulos, convenções de naming. Padrões que qualquer dev sênior reconhece.",
                },
                {
                  title: "Infraestrutura",
                  desc: "Banco de dados, hosting, CI/CD, domínio, SSL. Tudo configurado antes do Build começar.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <h4 className="font-heading text-sm font-bold text-foreground mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 p-4 border border-white/[0.06] rounded-xl bg-white/[0.02]">
            <p className="text-sm text-gray">
              <strong className="text-foreground">Resultado:</strong>{" "}
              Repositório configurado, banco de dados criado, pipeline de
              deploy funcionando, e ambiente de staging acessível. Tudo
              pronto pra começar a construir.
            </p>
          </div>
        </section>

        {/* PHASE 3: BUILD */}
        <section className="mb-14" id="build">
          <div className="flex items-center gap-4 mb-6">
            <div className="shrink-0 w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-heading text-lg font-bold">
              03
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold">
                Fase 3 — Build
              </h2>
              <p className="text-sm text-gray">
                Duração: 2-8 semanas | Demos semanais
              </p>
            </div>
          </div>
          <div className="text-gray leading-relaxed space-y-4 mb-6">
            <p>
              Essa é a fase principal — onde o produto ganha forma. O
              desenvolvimento é feito em ciclos semanais: cada semana eu
              entrego um conjunto de funcionalidades que você pode testar em
              ambiente de staging. Nada fica no escuro por mais de 7 dias.
            </p>
            <p>
              O ciclo semanal é simples e eficiente: no início da semana eu
              comunico o que vai ser construído. Durante a semana, codifico
              com commits frequentes no repositório. No final da semana,
              fazemos uma demo ao vivo onde você vê a funcionalidade rodando,
              dá feedback, e definimos ajustes pra semana seguinte.
            </p>
          </div>
          <div className="glass-card mb-6">
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              O que esperar a cada semana
            </h3>
            <div className="flex flex-col gap-4">
              {[
                {
                  day: "Segunda",
                  desc: "Comunicação do plano semanal: quais features vão ser implementadas, quais são os bloqueios potenciais.",
                },
                {
                  day: "Terça a Quinta",
                  desc: "Desenvolvimento ativo. Código commitado diariamente no repo. Deploy automático em staging. Disponível pra dúvidas e alinhamentos rápidos.",
                },
                {
                  day: "Sexta",
                  desc: "Demo ao vivo (30-45min). Mostro o que foi construído, você testa, dá feedback. Definimos prioridades pra semana seguinte. Tudo gravado pra referência.",
                },
              ].map((item) => (
                <div key={item.day} className="flex gap-4">
                  <span className="text-brand font-heading text-sm font-bold shrink-0 w-24">
                    {item.day}
                  </span>
                  <p className="text-sm text-gray">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="glass-card">
              <h3 className="font-heading text-base font-bold text-foreground mb-2">
                O que você precisa fazer durante o Build
              </h3>
              <ul className="text-sm text-gray space-y-2">
                {[
                  "Participar das demos semanais (30-45min/semana)",
                  "Dar feedback claro sobre as entregas",
                  "Responder dúvidas em até 24h",
                  "Fornecer conteúdo/dados quando solicitado",
                  "Testar funcionalidades no staging",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-brand mt-0.5 shrink-0">
                      &#10003;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card">
              <h3 className="font-heading text-base font-bold text-foreground mb-2">
                O que eu me comprometo a fazer
              </h3>
              <ul className="text-sm text-gray space-y-2">
                {[
                  "Entregar funcionalidade testável toda semana",
                  "Comunicar bloqueios imediatamente",
                  "Manter código limpo, tipado e documentado",
                  "Deploy automático em staging a cada merge",
                  "Responder mensagens em até 4h (horário comercial)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-brand mt-0.5 shrink-0">
                      &#10003;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 border border-white/[0.06] rounded-xl bg-white/[0.02]">
            <p className="text-sm text-gray">
              <strong className="text-foreground">Resultado:</strong>{" "}
              Produto completo rodando em staging, testado, com todas as
              funcionalidades do escopo implementadas e aprovadas pelo
              cliente.
            </p>
          </div>
        </section>

        {/* MID CTA */}
        <div className="glass-card text-center py-8 my-8 border-brand/10">
          <p className="text-foreground font-medium mb-3">
            Quer ver esse processo na prática? A call de Discovery é o
            primeiro passo.
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

        {/* PHASE 4: LAUNCH */}
        <section className="mb-14" id="launch">
          <div className="flex items-center gap-4 mb-6">
            <div className="shrink-0 w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-heading text-lg font-bold">
              04
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold">
                Fase 4 — Launch
              </h2>
              <p className="text-sm text-gray">
                Duração: 2-3 dias | + 30 dias de suporte
              </p>
            </div>
          </div>
          <div className="text-gray leading-relaxed space-y-4 mb-6">
            <p>
              A fase de Launch é o momento onde o produto sai do staging e
              vai pro mundo real. Não é só apertar um botão — é um processo
              cuidadoso de verificação, teste de carga, configuração de
              domínio e monitoramento. O objetivo é que o primeiro dia em
              produção seja tão estável quanto o último dia em staging.
            </p>
            <p>
              Depois do lançamento, fico disponível por 30 dias pra
              ajustes, correção de bugs que apareçam em produção, e pequenas
              otimizações. Não é o tipo de suporte que some depois do
              deploy — é acompanhamento real até o produto estar rodando
              liso.
            </p>
          </div>
          <div className="glass-card mb-6">
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              O que acontece no Launch
            </h3>
            <div className="flex flex-col gap-3">
              {[
                "Deploy final em produção (Vercel, Railway, ou infra do cliente)",
                "Configuração de domínio customizado e SSL",
                "Testes de carga e stress test básico",
                "Configuração de monitoramento e alertas",
                "Documentação técnica completa (README, variáveis, arquitetura)",
                "Handoff do repositório e acessos",
                "Treinamento de uso pra equipe do cliente (quando aplicável)",
                "Backup da base de dados e plano de disaster recovery",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-brand mt-0.5 shrink-0">&#10003;</span>
                  <span className="text-gray text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card border-brand/10">
            <h3 className="font-heading text-lg font-bold text-foreground mb-3">
              30 dias de suporte pós-launch
            </h3>
            <div className="text-gray text-sm leading-relaxed space-y-2">
              <p>
                Nos primeiros 30 dias após o lançamento, estou disponível
                pra:
              </p>
              <ul className="space-y-1 ml-4">
                <li>
                  - Correção de bugs encontrados em produção (prioridade
                  máxima)
                </li>
                <li>- Ajustes finos de UI/UX baseados em uso real</li>
                <li>
                  - Otimizações de performance baseadas em dados reais
                </li>
                <li>
                  - Dúvidas técnicas da equipe que vai manter o sistema
                </li>
              </ul>
              <p className="mt-3">
                Depois dos 30 dias, ofereço pacotes de manutenção mensal
                pra quem precisar de suporte contínuo, novas features, ou
                evolução do produto.
              </p>
            </div>
          </div>
        </section>

        {/* TIMELINE EXAMPLES */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Exemplos de timeline típica
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                project: "Landing page com formulário",
                total: "1-2 semanas",
                breakdown:
                  "Discovery: 1 dia | Arquitetura: 1 dia | Build: 5-8 dias | Launch: 1 dia",
              },
              {
                project: "MVP com auth + CRUD + deploy",
                total: "3-4 semanas",
                breakdown:
                  "Discovery: 2 dias | Arquitetura: 2 dias | Build: 2-3 semanas | Launch: 2 dias",
              },
              {
                project: "SaaS com pagamentos e dashboard",
                total: "6-8 semanas",
                breakdown:
                  "Discovery: 3 dias | Arquitetura: 3 dias | Build: 4-6 semanas | Launch: 3 dias",
              },
              {
                project: "Sistema empresarial completo",
                total: "8-12 semanas",
                breakdown:
                  "Discovery: 3-5 dias | Arquitetura: 3-5 dias | Build: 6-10 semanas | Launch: 3-5 dias",
              },
            ].map((example) => (
              <div key={example.project} className="glass-card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {example.project}
                  </h3>
                  <span className="text-sm font-bold text-brand">
                    {example.total}
                  </span>
                </div>
                <p className="text-xs text-gray">{example.breakdown}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TOOLS AND COMMUNICATION */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Ferramentas e comunicação
          </h2>
          <div className="text-gray leading-relaxed mb-6">
            <p>
              Me adapto às ferramentas que o cliente já usa. Mas se não há
              preferência, esse é o setup padrão que funciona pra 95% dos
              projetos.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                category: "Código e versionamento",
                tools: "GitHub (repo privado, PRs, issues)",
              },
              {
                category: "Comunicação rápida",
                tools: "Slack, WhatsApp ou Discord",
              },
              {
                category: "Video calls e demos",
                tools: "Google Meet (demos gravadas)",
              },
              {
                category: "Gestão de tarefas",
                tools: "GitHub Issues ou Notion",
              },
              {
                category: "Design e protótipos",
                tools: "Figma (se o cliente fornecer)",
              },
              {
                category: "Deploy e staging",
                tools: "Vercel (auto-deploy por branch)",
              },
            ].map((item) => (
              <div
                key={item.category}
                className="flex items-center gap-4 py-3 border-b border-white/[0.04]"
              >
                <span className="text-sm font-bold text-foreground w-48 shrink-0">
                  {item.category}
                </span>
                <span className="text-sm text-gray">{item.tools}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CROSS LINKS */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Qual seu perfil?
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                href: "/para-startups",
                title: "Sou founder de startup",
                desc: "Preciso de um MVP rápido, com alguém que entenda de negócio e tecnologia.",
              },
              {
                href: "/para-pmes-brasil",
                title: "Sou empresário de PME",
                desc: "Quero modernizar minha operação e substituir planilhas por sistemas.",
              },
              {
                href: "/agencias-parceiras",
                title: "Tenho uma agência",
                desc: "Preciso de um dev full-stack confiável pra projetos técnicos dos meus clientes.",
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="glass-card no-underline group"
              >
                <h3 className="font-heading text-sm font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
                  {link.title}
                </h3>
                <p className="text-xs text-gray">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* RELATED SERVICES */}
        <section className="mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Serviços disponíveis
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                slug: "desenvolvimento-saas-mvp",
                title: "SaaS e MVP",
                desc: "Do zero à produção com autenticação, pagamentos e dashboard.",
              },
              {
                slug: "dashboards-analytics",
                title: "Dashboards e Analytics",
                desc: "Visualize dados da operação em tempo real com KPIs.",
              },
              {
                slug: "desenvolvimento-react-next-js",
                title: "React e Next.js",
                desc: "Interfaces modernas, rápidas e responsivas.",
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
            Perguntas frequentes sobre o processo
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
            Pronto pra <span className="text-brand">começar?</span>
          </h2>
          <p className="text-gray text-lg mb-2">
            O primeiro passo é uma conversa de 15 minutos. Sem compromisso,
            sem pitch — só pra entender o seu projeto e ver se faz sentido
            trabalharmos juntos.
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
