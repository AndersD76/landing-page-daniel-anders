const translations = {
  en: {
    nav_services: "Services",
    nav_stack: "Stack",
    nav_process: "Process",
    nav_about: "About",
    nav_cta: "LET'S TALK →",

    hero_eyebrow: "FULL-STACK DEVELOPER",
    hero_h1_1: "I BUILD",
    hero_h1_2: "MODERN WEB",
    hero_h1_3: "APPLICATIONS",
    hero_sub: 'that solve <strong>real business problems.</strong>',
    hero_tagline: 'From idea to production. <span class="green">Code that ships and scales.</span>',
    hero_cta: "START A PROJECT",

    what_label: "WHAT I DO",
    what_h2: 'Your idea deserves<br>a builder who <span class="green">gets it.</span>',
    what_01: 'You need a developer who understands business, not just code. Someone who asks "why" before writing a single line.',
    what_02: "You need clean, production-ready code that ships fast and scales without breaking.",
    what_03: "You need clear communication, real deadlines, and zero ghosting. Every week, you see progress.",
    what_04: "You need a partner for the long run, not a freelancer who disappears after delivery.",

    big_h2: 'I take your <span class="green">vision</span>,<br>build the <span class="green">product</span>,<br>and deliver it ready to <span class="green">launch</span>.',
    big_sub: "SaaS MVPs. Dashboards. API integrations. Full-stack web apps. From Figma to production.",

    svc_label: "SERVICES",
    svc_h2: 'What I <span class="green">build</span>',
    svc_sub: "Every project gets the same treatment: clean architecture, modern stack, shipped on time.",
    svc_1_h: "Full-Stack Web Applications",
    svc_1_p: "Complete web apps from database to UI. Authentication, payments, dashboards, admin panels. Built to scale from day one.",
    svc_2_h: "React & Next.js Apps",
    svc_2_p: "High-fidelity UI from Figma designs. Responsive layouts, smooth animations, pixel-perfect implementation.",
    svc_3_h: "APIs & Integrations",
    svc_3_p: "RESTful APIs, third-party integrations, payment processing, webhook systems. Clean, documented, tested.",
    svc_4_h: "Dashboards & Analytics",
    svc_4_p: "Real-time dashboards, KPI tracking, data visualization. Turn your data into actionable insights.",
    svc_5_h: "AI-Powered Features",
    svc_5_p: "LLM integrations, intelligent automation, chatbots, document processing. AI that solves real problems.",
    svc_6_h: "Stripe & Payment Systems",
    svc_6_p: "Checkout flows, subscription billing, invoice management, webhook processing. Revenue infrastructure that works.",
    svc_7_h: "Cloud & DevOps",
    svc_7_p: "CI/CD pipelines, containerization, cloud deployment. Your app running reliably in production.",
    svc_8_h: "Business & Tech Strategy",
    svc_8_p: "15+ years of business management experience. I help you make the right technical decisions for your business goals.",
    svc_yours_h: "Your Project Here",
    svc_yours_p: "Have an idea that needs building? Tell me about it. If it can be solved with code, I'll build it.",
    svc_yours_cta: "LET'S TALK →",

    proc_label: "HOW I WORK",
    proc_h2: 'From idea to production in <span class="green">4 steps</span>',
    proc_1_h: "Discovery",
    proc_1_p: "We talk about your project, goals, and constraints. I ask the right questions so I build the right thing. <strong>No commitment. No cost.</strong>",
    proc_2_h: "Architecture & Planning",
    proc_2_p: "Tech stack, data model, milestones, timeline. You know exactly what you're getting and when. No surprises.",
    proc_3_h: "Build & Ship",
    proc_3_p: "Weekly demos, async updates, clean commits. You see progress every week. I ship fast without cutting corners.",
    proc_4_h: "Launch & Support",
    proc_4_p: "Deploy to production, documentation, handoff. I don't disappear after delivery. Your success is my success.",

    why_label: "WHY ME",
    why_h2: 'Not just a developer.<br>Your <span class="green">technical partner</span>.',
    why_1_h: "Fast Delivery",
    why_1_p: "Modern tools and AI-assisted development. Weeks, not months.",
    why_2_h: "Clean Code",
    why_2_p: "TypeScript, tests, documentation. Code your next developer will thank you for.",
    why_3_h: "Full-Stack",
    why_3_p: "Frontend to backend to deploy. One developer, zero coordination overhead.",
    why_4_h: "Business Mindset",
    why_4_p: "15+ years in business management. I understand ROI, not just React.",
    why_5_h: "Clear Communication",
    why_5_p: "Weekly updates, honest timelines, no jargon. You always know where things stand.",
    why_6_h: "Long-Term Partner",
    why_6_p: "I build for maintainability. After launch, I'm still here for iterations and support.",

    stack_label: "TECH STACK",
    stack_h2: 'Built with <span class="green">modern tools</span>',
    stack_sub: "Production-tested technologies. No experiments on your project.",
    stack_r1: "Fast, responsive, accessible UIs that look great on every device and screen size.",
    stack_r2: "Scalable APIs that handle thousands of requests. Clean, documented, easy to extend.",
    stack_r3: "Reliable data layer with migrations, type safety, and optimized queries.",
    stack_r4: "Zero-downtime deployments, auto-scaling, monitoring. Your app is always running.",
    stack_r5: "Intelligent features that automate workflows and create real business value.",

    bts_label: "HOW I BUILD",
    bts_h2: 'Behind the <span class="green">scenes</span>',
    bts_sub: "Transparent process. You know what's happening at every step.",
    bts_1_h: "TypeScript Everything",
    bts_1_p: "End-to-end type safety. Fewer bugs, better developer experience, easier maintenance.",
    bts_2_h: "Automated Testing",
    bts_2_p: "Tests run on every commit. Linting, type checking, CI/CD. Nothing breaks silently.",
    bts_3_h: "API-First Design",
    bts_3_p: "Clean REST endpoints, documented, versioned. Ready for mobile apps and future integrations.",
    bts_4_h: "Git-Based Workflow",
    bts_4_p: "Feature branches, pull requests, code reviews. Full history, zero lost work.",
    bts_5_h: "Mobile-First Design",
    bts_5_p: "Responsive from the start. Your app works perfectly on phones, tablets, and desktops.",
    bts_6_h: "Fast Response Time",
    bts_6_p: "Messages answered within 24 hours. Weekly progress demos. No communication blackholes.",

    about_label: "ABOUT",
    about_role: "Full-Stack Developer · Business Consultant · Engineer",
    about_p1: "15+ years building systems that solve real problems. Started as an Electrical Engineer, founded a business consulting company, and evolved into a full-stack developer building modern web applications.",
    about_p2: "I bring an engineering mindset and business experience to every project. I don't just write code — I understand the problem behind it and build solutions that generate real value.",
    about_p3: "Currently available for freelance projects worldwide. I work best with startups and small teams who need a reliable developer that thinks like a business owner.",
    about_v1_h: "Quality",
    about_v1_p: "ISO 9001 background. Process, evidence, and continuous improvement.",
    about_v2_h: "Modern Stack",
    about_v2_p: "React, Next.js, TypeScript, Python. Always up to date.",
    about_v3_h: "Business First",
    about_v3_p: "Every line of code serves a business goal. No overengineering.",
    about_s1: "years in tech & business",
    about_s2: "systems delivered",
    about_s3: "industries served",
    about_loc: "Passo Fundo, Brazil",
    about_loc_sub: "Working remotely with clients worldwide",

    cta_h2: 'Ready to build<br><span class="green">something great?</span>',
    cta_p: "Whether it's an MVP, a dashboard, an API integration, or a complete web application — I'm here to make it happen.",
    cta_big: "Let's turn your idea into <strong>working software</strong>.",
    cta_btn: "START A PROJECT →",

    form_label: "LET'S TALK",
    form_h2: 'Tell me about<br><span class="green">your project.</span>',
    form_p: "No commitment. I'll review your project scope and get back to you within 24 hours with an honest assessment and a plan.",
    form_t1: "// Free initial consultation",
    form_t2: "// Response within 24h",
    form_t3: "// No commitment required",
    form_t4: "// NDA available on request",
    form_name: "Your name",
    form_email: "Your email",
    form_phone: "Phone / WhatsApp (optional)",
    form_type: "Project type (e.g., SaaS MVP, Dashboard, API...)",
    form_idea: "Tell me about your project in a few words...",
    form_btn: "SEND MESSAGE",

    footer_tagline: "Building modern web applications. Available worldwide.",
  },

  pt: {
    nav_services: "Servicos",
    nav_stack: "Stack",
    nav_process: "Processo",
    nav_about: "Sobre",
    nav_cta: "FALAR COMIGO →",

    hero_eyebrow: "DESENVOLVEDOR FULL-STACK",
    hero_h1_1: "EU CONSTRUO",
    hero_h1_2: "APLICACOES WEB",
    hero_h1_3: "MODERNAS",
    hero_sub: 'que resolvem <strong>problemas reais de negocio.</strong>',
    hero_tagline: 'Da ideia a producao. <span class="green">Codigo que funciona e escala.</span>',
    hero_cta: "INICIAR PROJETO",

    what_label: "O QUE EU FACO",
    what_h2: 'Sua ideia merece<br>um builder que <span class="green">entende.</span>',
    what_01: 'Voce precisa de um desenvolvedor que entende negocios, nao so codigo. Alguem que pergunta "por que" antes de escrever uma linha.',
    what_02: "Voce precisa de codigo limpo, pronto pra producao, que entrega rapido e escala sem quebrar.",
    what_03: "Voce precisa de comunicacao clara, prazos reais e zero sumiaco. Toda semana, voce ve progresso.",
    what_04: "Voce precisa de um parceiro de longo prazo, nao um freelancer que desaparece depois da entrega.",

    big_h2: 'Eu pego sua <span class="green">visao</span>,<br>construo o <span class="green">produto</span>,<br>e entrego pronto pra <span class="green">lancar</span>.',
    big_sub: "MVPs SaaS. Dashboards. Integracoes de API. Apps web full-stack. Do Figma a producao.",

    svc_label: "SERVICOS",
    svc_h2: 'O que eu <span class="green">construo</span>',
    svc_sub: "Todo projeto recebe o mesmo tratamento: arquitetura limpa, stack moderna, entregue no prazo.",
    svc_1_h: "Aplicacoes Web Full-Stack",
    svc_1_p: "Apps completos do banco de dados a interface. Autenticacao, pagamentos, dashboards, paineis admin. Construido pra escalar desde o dia um.",
    svc_2_h: "Apps React & Next.js",
    svc_2_p: "UI de alta fidelidade a partir de designs Figma. Layouts responsivos, animacoes suaves, implementacao pixel-perfect.",
    svc_3_h: "APIs & Integracoes",
    svc_3_p: "APIs RESTful, integracoes com terceiros, processamento de pagamentos, sistemas de webhook. Limpo, documentado, testado.",
    svc_4_h: "Dashboards & Analytics",
    svc_4_p: "Dashboards em tempo real, acompanhamento de KPIs, visualizacao de dados. Transforme seus dados em insights acionaveis.",
    svc_5_h: "Recursos com IA",
    svc_5_p: "Integracoes com LLMs, automacao inteligente, chatbots, processamento de documentos. IA que resolve problemas reais.",
    svc_6_h: "Stripe & Sistemas de Pagamento",
    svc_6_p: "Fluxos de checkout, cobranca por assinatura, gestao de faturas, processamento de webhooks. Infraestrutura de receita que funciona.",
    svc_7_h: "Cloud & DevOps",
    svc_7_p: "Pipelines CI/CD, containerizacao, deploy em nuvem. Seu app rodando de forma confiavel em producao.",
    svc_8_h: "Estrategia de Negocios & Tech",
    svc_8_p: "15+ anos de experiencia em gestao empresarial. Ajudo voce a tomar as decisoes tecnicas certas para seus objetivos de negocio.",
    svc_yours_h: "Seu Projeto Aqui",
    svc_yours_p: "Tem uma ideia que precisa ser construida? Me conta. Se da pra resolver com codigo, eu construo.",
    svc_yours_cta: "FALAR COMIGO →",

    proc_label: "COMO EU TRABALHO",
    proc_h2: 'Da ideia a producao em <span class="green">4 passos</span>',
    proc_1_h: "Descoberta",
    proc_1_p: "Conversamos sobre seu projeto, objetivos e restricoes. Faco as perguntas certas pra construir a coisa certa. <strong>Sem compromisso. Sem custo.</strong>",
    proc_2_h: "Arquitetura & Planejamento",
    proc_2_p: "Stack tecnica, modelo de dados, marcos, cronograma. Voce sabe exatamente o que vai receber e quando. Sem surpresas.",
    proc_3_h: "Construir & Entregar",
    proc_3_p: "Demos semanais, atualizacoes assincronas, commits limpos. Voce ve progresso toda semana. Entrego rapido sem cortar caminho.",
    proc_4_h: "Lancamento & Suporte",
    proc_4_p: "Deploy em producao, documentacao, handoff. Nao desapareco depois da entrega. Seu sucesso e meu sucesso.",

    why_label: "POR QUE EU",
    why_h2: 'Nao sou so um dev.<br>Sou seu <span class="green">parceiro tecnico</span>.',
    why_1_h: "Entrega Rapida",
    why_1_p: "Ferramentas modernas e desenvolvimento assistido por IA. Semanas, nao meses.",
    why_2_h: "Codigo Limpo",
    why_2_p: "TypeScript, testes, documentacao. Codigo que o proximo dev vai agradecer.",
    why_3_h: "Full-Stack",
    why_3_p: "Do frontend ao backend ao deploy. Um desenvolvedor, zero overhead de coordenacao.",
    why_4_h: "Visao de Negocio",
    why_4_p: "15+ anos em gestao empresarial. Entendo ROI, nao so React.",
    why_5_h: "Comunicacao Clara",
    why_5_p: "Atualizacoes semanais, prazos honestos, sem jargao. Voce sempre sabe como as coisas estao.",
    why_6_h: "Parceiro de Longo Prazo",
    why_6_p: "Construo pensando em manutencao. Depois do lancamento, continuo aqui pra iteracoes e suporte.",

    stack_label: "TECH STACK",
    stack_h2: 'Construido com <span class="green">ferramentas modernas</span>',
    stack_sub: "Tecnologias testadas em producao. Nenhum experimento no seu projeto.",
    stack_r1: "UIs rapidas, responsivas e acessiveis que ficam otimas em qualquer dispositivo e tamanho de tela.",
    stack_r2: "APIs escalaveis que processam milhares de requisicoes. Limpas, documentadas, faceis de estender.",
    stack_r3: "Camada de dados confiavel com migrations, type safety e queries otimizadas.",
    stack_r4: "Deploys sem downtime, auto-scaling, monitoramento. Seu app esta sempre rodando.",
    stack_r5: "Recursos inteligentes que automatizam fluxos de trabalho e criam valor real para o negocio.",

    bts_label: "COMO EU CONSTRUO",
    bts_h2: 'Por dentro dos <span class="green">bastidores</span>',
    bts_sub: "Processo transparente. Voce sabe o que esta acontecendo em cada etapa.",
    bts_1_h: "TypeScript em Tudo",
    bts_1_p: "Type safety de ponta a ponta. Menos bugs, melhor experiencia de dev, manutencao mais facil.",
    bts_2_h: "Testes Automatizados",
    bts_2_p: "Testes rodam em cada commit. Linting, type checking, CI/CD. Nada quebra silenciosamente.",
    bts_3_h: "Design API-First",
    bts_3_p: "Endpoints REST limpos, documentados, versionados. Prontos pra apps mobile e integracoes futuras.",
    bts_4_h: "Workflow baseado em Git",
    bts_4_p: "Feature branches, pull requests, code reviews. Historico completo, zero trabalho perdido.",
    bts_5_h: "Design Mobile-First",
    bts_5_p: "Responsivo desde o inicio. Seu app funciona perfeitamente em celulares, tablets e desktops.",
    bts_6_h: "Tempo de Resposta Rapido",
    bts_6_p: "Mensagens respondidas em ate 24 horas. Demos semanais de progresso. Sem buracos negros de comunicacao.",

    about_label: "SOBRE",
    about_role: "Desenvolvedor Full-Stack · Consultor Empresarial · Engenheiro",
    about_p1: "15+ anos construindo sistemas que resolvem problemas reais. Comecei como Engenheiro Eletricista, fundei uma empresa de consultoria empresarial e evolui para desenvolvedor full-stack construindo aplicacoes web modernas.",
    about_p2: "Trago mentalidade de engenheiro e experiencia em negocios para cada projeto. Nao apenas escrevo codigo — entendo o problema por tras dele e construo solucoes que geram valor real.",
    about_p3: "Atualmente disponivel para projetos freelance no mundo todo. Trabalho melhor com startups e equipes pequenas que precisam de um desenvolvedor confiavel que pensa como dono de negocio.",
    about_v1_h: "Qualidade",
    about_v1_p: "Background em ISO 9001. Processo, evidencia e melhoria continua.",
    about_v2_h: "Stack Moderna",
    about_v2_p: "React, Next.js, TypeScript, Python. Sempre atualizado.",
    about_v3_h: "Negocio Primeiro",
    about_v3_p: "Cada linha de codigo serve um objetivo de negocio. Sem overengineering.",
    about_s1: "anos em tech & negocios",
    about_s2: "sistemas entregues",
    about_s3: "setores atendidos",
    about_loc: "Passo Fundo, Brasil",
    about_loc_sub: "Trabalhando remotamente com clientes no mundo todo",

    cta_h2: 'Pronto pra construir<br><span class="green">algo incrivel?</span>',
    cta_p: "Seja um MVP, um dashboard, uma integracao de API ou uma aplicacao web completa — estou aqui pra fazer acontecer.",
    cta_big: "Vamos transformar sua ideia em <strong>software funcionando</strong>.",
    cta_btn: "INICIAR PROJETO →",

    form_label: "VAMOS CONVERSAR",
    form_h2: 'Me conte sobre<br><span class="green">seu projeto.</span>',
    form_p: "Sem compromisso. Vou analisar o escopo do seu projeto e retornar em ate 24 horas com uma avaliacao honesta e um plano.",
    form_t1: "// Consulta inicial gratuita",
    form_t2: "// Resposta em ate 24h",
    form_t3: "// Sem compromisso",
    form_t4: "// NDA disponivel sob solicitacao",
    form_name: "Seu nome",
    form_email: "Seu email",
    form_phone: "Telefone / WhatsApp (opcional)",
    form_type: "Tipo de projeto (ex: MVP SaaS, Dashboard, API...)",
    form_idea: "Me conte sobre seu projeto em poucas palavras...",
    form_btn: "ENVIAR MENSAGEM",

    footer_tagline: "Construindo aplicacoes web modernas. Disponivel no mundo todo.",
  }
};

let currentLang = localStorage.getItem("lang") || "pt";

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  const t = translations[lang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (!t[key]) return;

    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = t[key];
    } else {
      el.innerHTML = t[key];
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
  setLang(currentLang);
});
