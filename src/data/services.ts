export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceData {
  slug: string;
  title: string;
  metaDescription: string;
  keyword: string;
  heroSubtitle: string;
  sections: Array<{
    heading: string;
    content: string;
    subsections?: Array<{ heading: string; content: string }>;
  }>;
  techStack: string[];
  relatedCase?: { title: string; metrics: string; link?: string };
  faqs: ServiceFAQ[];
  relatedServices: string[];
  ctaText: string;
}

export const services: ServiceData[] = [
  {
    slug: "desenvolvimento-saas-mvp",
    title: "Desenvolvimento de SaaS e MVP — Do Zero à Produção",
    metaDescription:
      "Desenvolvimento de SaaS e MVP com Next.js, TypeScript e PostgreSQL. MVP funcional em 2-6 semanas com autenticação, pagamentos e dashboard. Consulta gratuita.",
    keyword: "desenvolvimento saas mvp",
    heroSubtitle:
      "MVP funcional em 2-6 semanas. Autenticação, pagamentos, dashboard — tudo pronto pra escalar desde o dia um.",
    sections: [
      {
        heading: "Por que construir um MVP antes de investir tudo",
        content:
          "A maioria das startups que fracassa não tem um problema de produto — tem um problema de timing. Investem meses e milhares de reais construindo uma versão completa antes de validar se alguém realmente quer pagar por aquilo. Um MVP bem construído resolve isso: entrega valor real pro usuário com o mínimo de funcionalidades, gera dados concretos sobre product-market fit, e dá uma base técnica sólida pra iterar rápido.\n\nMeu processo de MVP não é sobre cortar qualidade — é sobre cortar escopo. Cada feature passa por um filtro simples: 'O usuário consegue resolver o problema central sem isso?' Se sim, fica pra v2. O resultado é um produto enxuto que funciona, escala, e não precisa ser reescrito quando crescer.",
      },
      {
        heading: "O que está incluído no desenvolvimento de MVP",
        content:
          "Cada MVP que construo inclui a infraestrutura que um SaaS real precisa pra funcionar em produção, não só um protótipo descartável.",
        subsections: [
          {
            heading: "Autenticação e gestão de usuários",
            content:
              "Login com email/senha, OAuth social (Google, GitHub), recuperação de senha, verificação de email. Multi-tenancy quando necessário. Tudo com NextAuth.js ou Clerk, dependendo do caso.",
          },
          {
            heading: "Pagamentos e assinaturas",
            content:
              "Integração completa com Stripe: checkout, assinaturas recorrentes, portal do cliente, webhooks pra processar eventos. Suporte a planos free, trial e paid. Funciona com cartão internacional e PIX via Stripe Brasil.",
          },
          {
            heading: "Dashboard e painel admin",
            content:
              "Interface administrativa pra gerenciar usuários, visualizar métricas, configurar o produto. Gráficos interativos, filtros avançados, exportação de dados. Construído com React + Tailwind + Recharts.",
          },
          {
            heading: "API robusta e documentada",
            content:
              "API RESTful com validação de entrada (Zod), autenticação JWT, rate limiting, e logs estruturados. Documentada e pronta pra consumo por apps mobile ou integrações futuras.",
          },
        ],
      },
      {
        heading: "Stack técnica: por que Next.js + TypeScript + PostgreSQL",
        content:
          "Essa combinação não é modinha — é a stack que oferece o melhor custo-benefício pra startups em 2026. Next.js dá SSR, API routes, e deploy no Vercel com zero configuração. TypeScript previne bugs antes de chegarem em produção. PostgreSQL é o banco mais confiável do mercado, e com NeonDB você tem serverless sem gerenciar infra.\n\nNão uso frameworks proprietários ou soluções low-code que parecem rápidos no início mas travam quando você precisa customizar. Cada linha de código é sua, documentada, e transferível. Se amanhã você contratar um time interno, eles pegam o projeto e continuam sem rewrite.",
      },
      {
        heading: "Processo de desenvolvimento: 4 fases claras",
        content:
          "Fase 1 — Discovery (2-3 dias): Mapeamos funcionalidades, definimos o que entra no MVP e o que fica pra v2. Saímos com um documento de escopo e cronograma.\n\nFase 2 — Arquitetura (2-3 dias): Defino modelo de dados, estrutura de API, e configuração de infraestrutura. Você valida antes de começar a codar.\n\nFase 3 — Build (2-4 semanas): Desenvolvimento iterativo com demos semanais. Cada semana você vê funcionalidade nova em produção.\n\nFase 4 — Launch (2-3 dias): Deploy final, testes de carga, documentação, e handoff. Suporte pós-lançamento incluído por 30 dias.",
      },
      {
        heading: "Quanto custa e quanto tempo leva",
        content:
          "MVP simples (landing + auth + CRUD + deploy): 2-3 semanas, a partir de R$ 5.000.\n\nMVP completo (auth + payments + dashboard + API + admin): 4-6 semanas, a partir de R$ 12.000.\n\nSaaS completo (multi-tenant + billing + analytics + email): 6-10 semanas, a partir de R$ 25.000.\n\nTodos os valores incluem código-fonte completo, documentação, deploy em produção, e 30 dias de suporte. Pagamento pode ser parcelado por milestone.",
      },
    ],
    techStack: [
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Drizzle ORM",
      "Stripe",
      "Vercel",
      "NextAuth.js",
    ],
    relatedCase: {
      title: "Distribuição de Conteúdo Multi-Marca",
      metrics: "5 marcas gerenciadas · 80% menos trabalho manual · 1 operador pra tudo",
    },
    faqs: [
      {
        question: "Quanto tempo leva pra ter um MVP funcionando?",
        answer:
          "MVPs simples ficam prontos em 2-3 semanas. Projetos com pagamentos, dashboard e multi-tenancy levam 4-6 semanas. Cada caso é diferente — na call de discovery a gente define o cronograma exato.",
      },
      {
        question: "O código é meu depois?",
        answer:
          "100%. Código-fonte completo, repositório GitHub, documentação, e acesso ao deploy. Você é dono de tudo. Se quiser trocar de dev amanhã, o projeto está organizado pra isso.",
      },
      {
        question: "Consigo escalar depois sem reescrever?",
        answer:
          "Sim. A arquitetura é pensada pra isso: Next.js escala horizontal no Vercel, PostgreSQL no Neon escala automático, e o código segue padrões que permitem adicionar features sem refatorar tudo.",
      },
      {
        question: "Você trabalha com equity ou só por projeto?",
        answer:
          "Trabalho por projeto com preço fixo definido no discovery. Não aceito equity como forma de pagamento, mas posso discutir modelos de revenue share em casos específicos.",
      },
      {
        question: "E se eu precisar mudar o escopo no meio do projeto?",
        answer:
          "Mudanças pequenas fazem parte do processo. Mudanças grandes a gente renegocia prazo e valor antes de implementar. Transparência total — sem surpresas na fatura.",
      },
    ],
    relatedServices: [
      "dashboards-analytics",
      "integracoes-api-stripe",
      "desenvolvimento-react-next-js",
    ],
    ctaText: "Tem uma ideia de SaaS? Vamos conversar sobre como transformar em produto.",
  },
  {
    slug: "dashboards-analytics",
    title: "Dashboards e Analytics em Tempo Real — Visualize Seus Dados",
    metaDescription:
      "Desenvolvimento de dashboards e analytics em tempo real com React, Next.js e PostgreSQL. KPIs, gráficos interativos e relatórios automatizados. Consulta gratuita.",
    keyword: "dashboards analytics tempo real",
    heroSubtitle:
      "Transforme dados brutos em decisões inteligentes. Dashboards interativos, KPIs em tempo real, relatórios automatizados.",
    sections: [
      {
        heading: "Seus dados estão lá — mas você não está vendo",
        content:
          "A maioria das empresas tem dados valiosos espalhados em planilhas, ERPs e bancos de dados que ninguém consulta. Um dashboard bem construído não é decoração — é a ferramenta que transforma números em ação. Quando o gerente de operações vê que a taxa de conversão caiu 15% na última hora, ele age. Quando vê em um relatório mensal, já perdeu.\n\nConstruo dashboards que mostram o que importa, quando importa, pra quem importa. Sem ruído, sem vanity metrics, sem gráficos bonitos que não dizem nada.",
      },
      {
        heading: "O que eu construo",
        content: "",
        subsections: [
          {
            heading: "Dashboards executivos",
            content:
              "Visão geral de KPIs do negócio: receita, churn, MRR, CAC, LTV. Filtros por período, segmento, produto. Atualização em tempo real ou near-real-time.",
          },
          {
            heading: "Dashboards operacionais",
            content:
              "Monitoramento de processos em tempo real: filas, pedidos, tickets, SLAs. Alertas automáticos quando métricas saem do threshold. Integração com Slack/WhatsApp.",
          },
          {
            heading: "Relatórios automatizados",
            content:
              "Geração e envio automático de relatórios diários/semanais/mensais por email. PDF ou link interativo. Cada stakeholder recebe o que é relevante pra ele.",
          },
          {
            heading: "Visualização de dados IoT",
            content:
              "Dashboards pra dados de sensores, telemetria, monitoramento ambiental. WebSocket pra atualização em tempo real. Histórico e análise de tendências.",
          },
        ],
      },
      {
        heading: "Stack técnica pra dashboards",
        content:
          "React + Next.js pra interface responsiva e rápida. Recharts ou Tremor pra gráficos interativos. PostgreSQL + TimescaleDB pra séries temporais. WebSocket ou Server-Sent Events pra tempo real. TanStack Table pra tabelas com ordenação, filtro e paginação.\n\nPra integrações: REST APIs, webhooks, e conectores customizados pros seus sistemas existentes (ERP, CRM, planilhas, bancos de dados).",
      },
      {
        heading: "Quanto custa",
        content:
          "Dashboard simples (3-5 painéis, dados de uma fonte): 2-3 semanas, a partir de R$ 6.000.\n\nDashboard completo (10+ painéis, múltiplas fontes, alertas): 4-6 semanas, a partir de R$ 15.000.\n\nPlataforma de analytics (multi-tenant, white-label, API): 6-10 semanas, a partir de R$ 30.000.",
      },
    ],
    techStack: [
      "React",
      "Next.js",
      "TypeScript",
      "Recharts",
      "PostgreSQL",
      "WebSocket",
      "TanStack Table",
      "Tailwind CSS",
    ],
    relatedCase: {
      title: "Monitoramento IoT em Tempo Real",
      metrics: "24/7 monitoramento · <2s latência · 99.9% uptime",
    },
    faqs: [
      {
        question: "Consigo conectar com meu ERP/CRM atual?",
        answer:
          "Sim. Construo conectores customizados pra qualquer sistema que tenha API ou banco de dados acessível. Já integrei com SAP, Totvs, Salesforce, HubSpot, e vários ERPs nacionais.",
      },
      {
        question: "Funciona em celular?",
        answer:
          "Todos os dashboards são responsivos. Funcionam em desktop, tablet e celular. Gráficos se adaptam ao tamanho da tela automaticamente.",
      },
      {
        question: "Os dados ficam seguros?",
        answer:
          "Autenticação obrigatória, controle de acesso por role (admin, viewer, editor), logs de auditoria, e dados criptografados em trânsito e em repouso.",
      },
    ],
    relatedServices: [
      "desenvolvimento-saas-mvp",
      "integracoes-api-stripe",
      "aplicacoes-ia-llm",
    ],
    ctaText: "Precisa visualizar seus dados de forma inteligente? Vamos conversar.",
  },
  {
    slug: "integracoes-api-stripe",
    title: "Integrações de API e Stripe — Conecte Seus Sistemas",
    metaDescription:
      "Integração de APIs, Stripe, pagamentos e webhooks. Conecte sistemas, automatize processos e processe pagamentos de forma segura. Consulta gratuita.",
    keyword: "integração api stripe pagamentos",
    heroSubtitle:
      "APIs limpas, integrações robustas, pagamentos que funcionam. Conecte seus sistemas sem gambiarras.",
    sections: [
      {
        heading: "Sistemas que não conversam custam caro",
        content:
          "Cada vez que alguém copia dados de um sistema pra outro manualmente, é tempo perdido e erro garantido. Integrações bem feitas eliminam trabalho repetitivo, reduzem erros, e fazem seus sistemas trabalharem juntos de forma automática.\n\nConstruo integrações que são confiáveis, monitoradas, e fáceis de manter — não scripts soltos que quebram silenciosamente.",
      },
      {
        heading: "Serviços de integração",
        content: "",
        subsections: [
          {
            heading: "APIs RESTful customizadas",
            content:
              "Construção de APIs do zero: design de endpoints, validação, autenticação, rate limiting, documentação OpenAPI. Pronta pra consumo por frontend, mobile, ou terceiros.",
          },
          {
            heading: "Integração Stripe completa",
            content:
              "Checkout, assinaturas, cobranças recorrentes, portal do cliente, processamento de webhooks, conciliação financeira. Funciona com Stripe Brasil (PIX, boleto) e internacional.",
          },
          {
            heading: "Webhooks e event-driven",
            content:
              "Sistemas baseados em eventos: receba e processe webhooks de qualquer serviço, dispare ações automáticas, mantenha sistemas sincronizados em tempo real.",
          },
          {
            heading: "Integrações com terceiros",
            content:
              "Conecte com qualquer serviço que tenha API: ERPs, CRMs, plataformas de email, gateways de pagamento, serviços de logística, APIs do governo (Receita Federal, SEFAZ).",
          },
        ],
      },
      {
        heading: "Quanto custa",
        content:
          "Integração simples (1 API, webhook básico): 1-2 semanas, a partir de R$ 3.000.\n\nIntegração Stripe completa (checkout + subscriptions + webhooks): 2-3 semanas, a partir de R$ 8.000.\n\nPlataforma de integrações (múltiplas APIs, fila de eventos, dashboard): 4-8 semanas, a partir de R$ 18.000.",
      },
    ],
    techStack: [
      "Node.js",
      "TypeScript",
      "Stripe SDK",
      "REST APIs",
      "Webhooks",
      "PostgreSQL",
      "Redis",
      "Next.js API Routes",
    ],
    faqs: [
      {
        question: "Stripe funciona no Brasil?",
        answer:
          "Sim. Stripe Brasil suporta cartão de crédito internacional, PIX e boleto. Eu configuro tudo: checkout, portal do cliente, webhooks pra processar pagamentos e assinaturas.",
      },
      {
        question: "Consigo integrar com meu sistema legado?",
        answer:
          "Se tem API ou banco de dados acessível, sim. Já integrei com sistemas em PHP, Java, .NET, e até planilhas Google. O importante é ter algum ponto de acesso aos dados.",
      },
      {
        question: "E se a API do terceiro mudar?",
        answer:
          "Construo camadas de abstração que isolam seu código da API externa. Se a API mudar, só preciso ajustar o conector — seu sistema continua funcionando.",
      },
    ],
    relatedServices: [
      "desenvolvimento-saas-mvp",
      "sistemas-pagamento",
      "dashboards-analytics",
    ],
    ctaText: "Precisa conectar sistemas ou processar pagamentos? Vamos resolver.",
  },
  {
    slug: "aplicacoes-ia-llm",
    title: "Aplicações com IA e LLM — Inteligência que Resolve Problemas Reais",
    metaDescription:
      "Desenvolvimento de aplicações com IA, LLMs (GPT, Claude), RAG, chatbots e automação inteligente. Soluções de IA que geram valor real. Consulta gratuita.",
    keyword: "aplicações ia llm inteligência artificial",
    heroSubtitle:
      "IA que resolve problemas reais de negócio. Chatbots, processamento de documentos, automação inteligente — não só demos bonitos.",
    sections: [
      {
        heading: "IA de verdade vs IA de PowerPoint",
        content:
          "A maioria dos projetos de IA morre no protótipo porque ninguém pensa em como colocar em produção. Meu foco é diferente: construo aplicações de IA que funcionam no mundo real, com dados reais, em escala, e com custo previsível.\n\nNão vendo IA como solução mágica. Uso quando faz sentido — quando automatiza trabalho repetitivo, extrai insights de dados não estruturados, ou cria experiências que seriam impossíveis sem ela.",
      },
      {
        heading: "O que eu construo com IA",
        content: "",
        subsections: [
          {
            heading: "Chatbots e assistentes inteligentes",
            content:
              "Assistentes especializados que conhecem seu negócio: respondem dúvidas de clientes, ajudam na navegação do produto, qualificam leads. Integrados ao seu site, WhatsApp, ou app.",
          },
          {
            heading: "Processamento de documentos",
            content:
              "Extração automática de dados de PDFs, contratos, notas fiscais, formulários. OCR + LLM pra entender contexto, não só ler texto. Classificação, resumo, e análise automatizada.",
          },
          {
            heading: "RAG (Retrieval Augmented Generation)",
            content:
              "Sistemas que consultam sua base de conhecimento (docs, wiki, banco de dados) antes de responder. A IA não inventa — busca na sua fonte de verdade e responde com contexto.",
          },
          {
            heading: "Automação inteligente",
            content:
              "Fluxos que usam IA pra tomar decisões: classificar tickets, rotear emails, priorizar tarefas, gerar relatórios narrativos. Substituem trabalho manual repetitivo com supervisão humana.",
          },
        ],
      },
      {
        heading: "Quanto custa",
        content:
          "Chatbot simples (FAQ + base de conhecimento): 2-3 semanas, a partir de R$ 8.000.\n\nSistema RAG completo (ingestão + busca + geração): 4-6 semanas, a partir de R$ 18.000.\n\nPlataforma de IA (múltiplos modelos + dashboard + analytics): 6-10 semanas, a partir de R$ 35.000.\n\nCusto de API (OpenAI/Claude) varia por uso — tipicamente R$ 50-500/mês dependendo do volume.",
      },
    ],
    techStack: [
      "OpenAI API",
      "Claude API",
      "LangChain",
      "Pinecone/Chroma",
      "Python",
      "FastAPI",
      "Next.js",
      "TypeScript",
    ],
    faqs: [
      {
        question: "Preciso de muitos dados pra começar?",
        answer:
          "Depende do caso. Pra chatbots e RAG, sua documentação existente já é suficiente. Pra modelos customizados de classificação, sim, dados de treino são necessários.",
      },
      {
        question: "Qual modelo usar: GPT ou Claude?",
        answer:
          "Depende do caso de uso. GPT é melhor pra tarefas criativas e geração de código. Claude é melhor pra análise de documentos longos e raciocínio complexo. Faço a recomendação no discovery.",
      },
      {
        question: "Os dados ficam seguros?",
        answer:
          "Sim. Dados sensíveis podem ser processados localmente sem enviar pra APIs externas (usando modelos open-source). Quando usamos APIs cloud, seguimos as políticas de privacidade de cada provider.",
      },
    ],
    relatedServices: [
      "desenvolvimento-saas-mvp",
      "dashboards-analytics",
      "integracoes-api-stripe",
    ],
    ctaText: "Quer usar IA de verdade no seu negócio? Vamos avaliar o caso juntos.",
  },
  {
    slug: "sistemas-pagamento",
    title: "Sistemas de Pagamento — Checkout, Assinaturas e Billing",
    metaDescription:
      "Implementação de sistemas de pagamento com Stripe: checkout, assinaturas, PIX, boleto, webhooks e billing automatizado. Consulta gratuita.",
    keyword: "sistemas pagamento stripe checkout assinaturas",
    heroSubtitle:
      "Checkout que converte, billing que não falha, reconciliação que funciona sozinha. Infraestrutura de receita profissional.",
    sections: [
      {
        heading: "Pagamentos mal implementados custam receita",
        content:
          "Checkout com fricção perde venda. Webhook que falha silenciosamente perde assinatura. Billing sem reconciliação gera disputa. Um sistema de pagamento mal feito é um vazamento de receita invisível.\n\nImplemento sistemas de pagamento que funcionam end-to-end: do momento que o cliente clica em 'comprar' até o dinheiro cair na sua conta, com cada evento rastreado e processado.",
      },
      {
        heading: "O que está incluído",
        content: "",
        subsections: [
          {
            heading: "Checkout otimizado",
            content:
              "Fluxo de pagamento com mínimo de fricção. Stripe Checkout ou checkout customizado integrado ao seu design. Suporte a cartão, PIX, boleto (via Stripe Brasil).",
          },
          {
            heading: "Assinaturas e billing recorrente",
            content:
              "Planos free/trial/paid, upgrade/downgrade, cancelamento, pausa. Portal do cliente pra gerenciar assinatura. Webhooks pra processar cada evento do ciclo de vida.",
          },
          {
            heading: "Webhooks e reconciliação",
            content:
              "Processamento robusto de webhooks com retry, idempotency, e dead letter queue. Reconciliação automática entre Stripe e seu banco de dados. Alertas pra discrepâncias.",
          },
          {
            heading: "Métricas financeiras",
            content:
              "Dashboard com MRR, ARR, churn, LTV, refunds. Integração com sistemas contábeis. Relatórios pra contador e pra investidor.",
          },
        ],
      },
      {
        heading: "Quanto custa",
        content:
          "Checkout simples (pagamento único + webhook): 1-2 semanas, a partir de R$ 4.000.\n\nSistema de assinaturas completo (plans + portal + webhooks): 3-4 semanas, a partir de R$ 12.000.\n\nBilling platform (multi-product + metered + invoicing): 6-8 semanas, a partir de R$ 25.000.",
      },
    ],
    techStack: [
      "Stripe",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Webhooks",
      "Node.js",
      "React",
      "Tailwind CSS",
    ],
    faqs: [
      {
        question: "Stripe é a melhor opção pro Brasil?",
        answer:
          "Pra SaaS e e-commerce com clientes internacionais, sim. Stripe Brasil suporta PIX, boleto e cartão. Pra casos puramente nacionais, posso integrar com Pagar.me, Asaas, ou outros gateways locais.",
      },
      {
        question: "Preciso de CNPJ pra usar Stripe?",
        answer:
          "Sim, Stripe Brasil exige CNPJ. Pra Stripe internacional, dá pra criar uma conta como pessoa física em alguns países. Eu ajudo com a configuração.",
      },
    ],
    relatedServices: [
      "desenvolvimento-saas-mvp",
      "integracoes-api-stripe",
      "dashboards-analytics",
    ],
    ctaText: "Precisa implementar pagamentos no seu produto? Vamos resolver.",
  },
  {
    slug: "dashboards-tempo-real",
    title: "Dashboards em Tempo Real — Monitoramento e Alertas 24/7",
    metaDescription:
      "Dashboards de monitoramento em tempo real com WebSocket, alertas automáticos e integração IoT. Monitore operações 24/7. Consulta gratuita.",
    keyword: "dashboard tempo real monitoramento alertas",
    heroSubtitle:
      "Monitore operações em tempo real com alertas automáticos. WebSocket, IoT, sensores — dados chegando ao vivo no seu dashboard.",
    sections: [
      {
        heading: "Quando segundos fazem diferença",
        content:
          "Algumas operações não podem esperar um relatório diário. Temperatura de câmara fria, status de produção, filas de atendimento, disponibilidade de servidores — tudo isso precisa de visibilidade imediata.\n\nConstruo dashboards que recebem dados ao vivo via WebSocket, processam em tempo real, e disparam alertas automáticos quando algo sai do normal. O operador vê o problema acontecendo, não o rastro dele.",
      },
      {
        heading: "Casos de uso",
        content: "",
        subsections: [
          {
            heading: "Monitoramento industrial / IoT",
            content:
              "Sensores de temperatura, pressão, umidade, vibração. Integração com ESP32, Arduino, gateways LoRa. Dashboard com histórico, tendências e alertas configuráveis.",
          },
          {
            heading: "Monitoramento de infraestrutura",
            content:
              "Uptime de servidores, latência de APIs, uso de recursos, erros em produção. Integração com AWS CloudWatch, Datadog, ou métricas customizadas.",
          },
          {
            heading: "Operações em tempo real",
            content:
              "Filas de atendimento, pedidos em andamento, entregas em rota, status de produção. Visão operacional que permite ação imediata.",
          },
        ],
      },
      {
        heading: "Quanto custa",
        content:
          "Dashboard de monitoramento simples (1 fonte, 5 métricas, alertas): 2-3 semanas, a partir de R$ 8.000.\n\nPlataforma de monitoramento completa (múltiplas fontes, histórico, relatórios): 4-6 semanas, a partir de R$ 18.000.\n\nSistema IoT end-to-end (hardware + firmware + backend + dashboard): 6-10 semanas, a partir de R$ 30.000.",
      },
    ],
    techStack: [
      "React",
      "WebSocket",
      "FastAPI",
      "PostgreSQL",
      "TimescaleDB",
      "MQTT",
      "ESP32",
      "Next.js",
    ],
    relatedCase: {
      title: "Monitoramento IoT em Tempo Real",
      metrics: "24/7 monitoramento · <2s latência · 99.9% uptime",
    },
    faqs: [
      {
        question: "Funciona com hardware que eu já tenho?",
        answer:
          "Se o hardware envia dados via WiFi, 4G, LoRa, ou qualquer protocolo de rede, dá pra integrar. Já trabalhei com ESP32, Raspberry Pi, gateways industriais, e PLCs.",
      },
      {
        question: "Qual a latência dos alertas?",
        answer:
          "Tipicamente menos de 2 segundos entre o evento e o alerta. Pra aplicações críticas, pode chegar a sub-segundo com arquitetura otimizada.",
      },
    ],
    relatedServices: [
      "dashboards-analytics",
      "integracoes-api-stripe",
      "desenvolvimento-saas-mvp",
    ],
    ctaText: "Precisa monitorar operações em tempo real? Vamos desenhar a solução.",
  },
  {
    slug: "migracao-stack-legado",
    title: "Migração de Stack Legado — Modernize Sem Parar a Operação",
    metaDescription:
      "Migração de sistemas legados para stack moderna: PHP/jQuery para React/Next.js, monolito para microserviços, on-premise para cloud. Consulta gratuita.",
    keyword: "migração stack legado modernização sistemas",
    heroSubtitle:
      "Migre de PHP, jQuery, ou qualquer stack legada pra tecnologias modernas — sem parar a operação e sem perder dados.",
    sections: [
      {
        heading: "Seu sistema legado está te segurando",
        content:
          "O sistema funciona — mas cada feature nova leva 3x mais tempo, ninguém quer mexer naquele código, o dev que construiu já saiu, e a performance tá degradando. Você sabe que precisa modernizar, mas tem medo de quebrar o que funciona.\n\nMigração bem feita não é reescrever tudo do zero. É uma transição gradual onde o sistema novo assume aos poucos, com rollback possível a cada passo. O negócio continua rodando enquanto a migração acontece.",
      },
      {
        heading: "Migrações que eu faço",
        content: "",
        subsections: [
          {
            heading: "Frontend: jQuery/PHP → React/Next.js",
            content:
              "Migração progressiva de interfaces legadas pra React. Pode começar com uma página de cada vez. Mantém backend existente enquanto o frontend moderniza.",
          },
          {
            heading: "Backend: monolito → APIs modernas",
            content:
              "Extração de funcionalidades do monolito em APIs independentes. FastAPI ou Node.js. Cada módulo migra separadamente com testes de integração.",
          },
          {
            heading: "Banco de dados: MySQL/Access → PostgreSQL",
            content:
              "Migração de dados com zero downtime. Schema redesign, migração de dados, validação automática, e período de dual-write pra garantir integridade.",
          },
          {
            heading: "Infra: on-premise → cloud",
            content:
              "Migração pra Vercel, Railway, AWS, ou GCP. Containerização com Docker, CI/CD automatizado, monitoramento, e backup.",
          },
        ],
      },
      {
        heading: "Quanto custa",
        content:
          "Migração de frontend (5-10 telas): 3-4 semanas, a partir de R$ 10.000.\n\nMigração backend + banco de dados: 4-8 semanas, a partir de R$ 18.000.\n\nMigração completa (frontend + backend + infra): 8-12 semanas, a partir de R$ 35.000.\n\nCada projeto começa com um assessment gratuito onde mapeio o estado atual e proponho um plano de migração por fases.",
      },
    ],
    techStack: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "Vercel",
      "FastAPI",
    ],
    faqs: [
      {
        question: "Preciso parar o sistema durante a migração?",
        answer:
          "Não. A migração é feita em paralelo — o sistema novo vai assumindo aos poucos enquanto o legado continua rodando. Só desliga o antigo quando o novo está 100% validado.",
      },
      {
        question: "E se algo der errado?",
        answer:
          "Cada fase tem rollback planejado. Se algo falha, voltamos pro estado anterior em minutos. Zero risco de perda de dados ou downtime não planejado.",
      },
      {
        question: "Quanto tempo demora tipicamente?",
        answer:
          "Depende do tamanho do sistema. Sistemas pequenos (5-10 telas, 1 banco): 4-6 semanas. Sistemas médios (20+ telas, múltiplos bancos): 8-12 semanas. A gente define no assessment.",
      },
    ],
    relatedServices: [
      "desenvolvimento-react-next-js",
      "desenvolvimento-saas-mvp",
      "integracoes-api-stripe",
    ],
    ctaText: "Sistema legado te segurando? Vamos planejar a migração.",
  },
  {
    slug: "desenvolvimento-react-next-js",
    title: "Desenvolvimento React e Next.js — Interfaces Modernas e Performáticas",
    metaDescription:
      "Desenvolvimento frontend com React e Next.js. Interfaces responsivas, SSR, performance otimizada, integração com qualquer backend. Consulta gratuita.",
    keyword: "desenvolvimento react next.js frontend",
    heroSubtitle:
      "Interfaces rápidas, responsivas e pixel-perfect. React + Next.js + TypeScript — a stack frontend que domina o mercado.",
    sections: [
      {
        heading: "Frontend que faz diferença no negócio",
        content:
          "A interface é a primeira coisa que seu cliente vê. Um frontend lento, feio, ou confuso perde venda antes de você saber. Construo interfaces que carregam rápido, funcionam em qualquer dispositivo, e guiam o usuário até a ação que importa pro seu negócio.\n\nNão faço páginas bonitas que não convertem. Faço interfaces que combinam design, performance e UX pra gerar resultado.",
      },
      {
        heading: "O que eu construo",
        content: "",
        subsections: [
          {
            heading: "Landing pages e sites institucionais",
            content:
              "Sites rápidos com SEO otimizado, animações suaves, formulários inteligentes. SSG pra performance máxima, ISR pra conteúdo dinâmico.",
          },
          {
            heading: "Aplicações web complexas (SPAs)",
            content:
              "Dashboards, painéis admin, ferramentas internas. State management, data fetching, cache, real-time updates. A complexidade fica no código, não na UX.",
          },
          {
            heading: "Design system e component library",
            content:
              "Biblioteca de componentes reutilizáveis com Storybook. Garante consistência visual e acelera desenvolvimento futuro. Baseado em Tailwind + shadcn/ui.",
          },
          {
            heading: "Integração com qualquer backend",
            content:
              "React funciona com qualquer API — Node.js, Python, Java, .NET, Go. Se o backend tem endpoint, o frontend consome. REST, GraphQL, ou WebSocket.",
          },
        ],
      },
      {
        heading: "Quanto custa",
        content:
          "Landing page (5-8 seções, responsiva, SEO): 1-2 semanas, a partir de R$ 4.000.\n\nSite institucional (5-10 páginas, blog, formulários): 2-3 semanas, a partir de R$ 8.000.\n\nAplicação web (dashboard, CRUD, autenticação): 3-6 semanas, a partir de R$ 12.000.\n\nDesign system (componentes, Storybook, docs): 3-4 semanas, a partir de R$ 10.000.",
      },
    ],
    techStack: [
      "React",
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Zustand",
      "TanStack Query",
      "Framer Motion",
    ],
    relatedCase: {
      title: "Site Institucional — Indústria",
      metrics: "3x mais leads orgânicos · 0.8s load time · 14d até produção",
    },
    faqs: [
      {
        question: "Por que Next.js e não React puro?",
        answer:
          "Next.js adiciona SSR, SSG, API routes, e otimizações automáticas que React puro não tem. Pra SEO e performance, é a escolha certa em 2026.",
      },
      {
        question: "Consigo usar com meu backend existente?",
        answer:
          "Sim. Next.js se integra com qualquer backend via API. Seu backend em Python, Java, PHP — não importa. O frontend consome a API normalmente.",
      },
      {
        question: "E manutenção depois?",
        answer:
          "Código em TypeScript com componentes organizados é fácil de manter. Qualquer dev React pega o projeto sem rewrite. Documentação incluída.",
      },
    ],
    relatedServices: [
      "desenvolvimento-saas-mvp",
      "dashboards-analytics",
      "migracao-stack-legado",
    ],
    ctaText: "Precisa de uma interface moderna e performática? Vamos conversar.",
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}
