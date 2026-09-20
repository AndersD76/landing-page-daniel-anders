/**
 * Eixo "quanto custa" — entidade: TIPO DE PROJETO × INTEGRAÇÃO.
 *
 * Regra da entrada: o texto tem que deixar de fazer sentido se você trocar o
 * tipo ou a integração. "Pagamento em landing page" é link de pagamento de um
 * produto só; "pagamento em MVP SaaS" é assinatura recorrente com dunning;
 * "pagamento em app mobile" esbarra na regra de compra dentro do app das
 * lojas. São três assuntos diferentes, não o mesmo texto com o nome trocado.
 *
 * Preço nunca é escrito aqui — vem de calcularEstimativa().
 */

import type { FAQ } from "./custos-tipos";

export interface ComboCusto {
  tipoSlug: string;
  /** id da integração no config da calculadora */
  integracaoId: string;
  /** último segmento da URL */
  slug: string;
  nomeCurto: string;
  h1: string;
  title: string;
  /** recebe faixa e acréscimo já calculados */
  metaDesc: (faixa: string, acrescimo: string) => string;
  intro: string[];
  oQueMuda: string[];
  ondeTravaCaro: string;
  faqs: FAQ[];
}

export const combosCusto: ComboCusto[] = [
  /* ---------------------------------------------------------------- SITE */

  {
    tipoSlug: "landing-page",
    integracaoId: "pagamento",
    slug: "com-pagamento-online",
    nomeCurto: "pagamento online",
    h1: "Quanto custa uma landing page com pagamento online?",
    title: "Landing Page com Pagamento Online: Quanto Custa em 2026",
    metaDesc: (faixa, acrescimo) =>
      `Landing page que vende direto, sem carrinho, custa ${faixa} — o pagamento soma cerca de ${acrescimo}. Veja o que muda no escopo e onde o projeto costuma travar.`,
    intro: [
      "Landing page com pagamento é venda direta sem loja: um produto, um preço, um botão. Não existe carrinho, não existe catálogo, não existe conta de cliente. Isso mantém o custo bem abaixo de um e-commerce e é o formato certo para curso, ingresso, consultoria e produto único.",
      "O trabalho extra não está em cobrar — está em decidir o que acontece depois de cobrar. Liberar acesso, enviar o arquivo, avisar a equipe, registrar a venda em algum lugar. É esse pedaço, invisível no briefing, que define se o acréscimo fica no piso ou no teto.",
    ],
    oQueMuda: [
      "Checkout de produto único com Pix e cartão, sem carrinho",
      "Webhook de confirmação: a venda só vale quando o provedor confirma, não quando o cliente clica",
      "Entrega automática do que foi comprado (acesso, arquivo ou e-mail com instrução)",
      "Página de retorno para pagamento aprovado, recusado e pendente — o Pix não confirma na hora",
      "Registro da venda com a origem da sessão, para saber qual anúncio pagou",
    ],
    ondeTravaCaro:
      "O erro caro aqui é tratar Pix como cartão. Pix pode levar minutos e o cliente sai da página antes de confirmar. Se a liberação depender do retorno na tela em vez do webhook, você vai ter gente que pagou e não recebeu — e vai descobrir pelo suporte, não pelo sistema.",
    faqs: [
      {
        q: "Preciso de CNPJ para receber pagamento na landing page?",
        a: "Para a maioria dos provedores de pagamento brasileiros, sim, ou ao menos MEI. Alguns aceitam pessoa física com limites menores e taxas maiores. Vale confirmar com o provedor antes de fechar o escopo, porque isso muda qual integração é possível.",
      },
      {
        q: "Dá para usar só um link de pagamento em vez de integrar?",
        a: "Dá, e é a opção mais barata: o provedor gera o link e você o coloca no botão. A limitação é que você perde a entrega automática e a amarração entre a venda e a origem do clique. Funciona bem em volume baixo e trava rápido quando cresce.",
      },
      {
        q: "Quanto o provedor de pagamento cobra por venda?",
        a: "Varia por meio e por volume, e é cobrado direto de você pelo provedor. Pix costuma ser bem mais barato que cartão, e cartão parcelado é o mais caro. Nenhuma dessas taxas está no valor do projeto — elas ficam em contrato seu, sem intermediário.",
      },
    ],
  },

  {
    tipoSlug: "landing-page",
    integracaoId: "ia",
    slug: "com-inteligencia-artificial",
    nomeCurto: "inteligência artificial",
    h1: "Quanto custa uma landing page com inteligência artificial?",
    title: "Landing Page com IA: Quanto Custa e Quando Vale em 2026",
    metaDesc: (faixa, acrescimo) =>
      `Landing page com IA custa ${faixa}, sendo cerca de ${acrescimo} da camada de IA. Veja onde ela aumenta conversão de verdade e onde só adiciona custo.`,
    intro: [
      "IA em landing page quase sempre é uma de duas coisas: um chat que responde objeção antes do formulário, ou uma ferramenta que devolve um resultado personalizado na tela. A segunda converte muito mais, porque entrega valor antes de pedir qualquer coisa — é o mesmo princípio de uma calculadora que mostra o número antes do e-mail.",
      "O que encarece não é chamar o modelo. É a trava. IA solta numa página de vendas inventa preço, promete prazo e cria expectativa que você vai ter que honrar ou desmentir. Fazer direito significa limitar o que ela pode dizer, e essa limitação é a maior parte do trabalho.",
    ],
    oQueMuda: [
      "Camada de IA com escopo fechado: ela responde sobre o seu conteúdo, não sobre o mundo",
      "Trava de saída antes de exibir: número fora dos dados, menção a preço ou promessa reprovam o texto",
      "Texto fixo de fallback quando a checagem reprova — a página nunca fica sem resposta",
      "Limite de uso por visitante, para custo por token não virar surpresa",
      "Registro das conversas para você ver quais objeções aparecem de verdade",
    ],
    ondeTravaCaro:
      "O custo que ninguém orça é o da IA que fala o que não devia. Um chat que cita um preço que você não pratica cria uma obrigação comercial que nasceu de uma alucinação. Por isso o parágrafo gerado tem que usar só números passados no prompt, e convite, link e qualquer promessa precisam ser texto fixo.",
    faqs: [
      {
        q: "A IA pode inventar informação sobre meu serviço?",
        a: "Pode, se ela for solta. A forma de impedir é dupla: restringir o que ela vê ao seu próprio conteúdo e checar a saída antes de exibir. Se o texto trouxer número que não está nos dados, ou mencionar preço, ele é descartado e entra um texto fixo no lugar.",
      },
      {
        q: "Quanto custa por mês manter a IA rodando?",
        a: "Depende do volume de conversas e do tamanho das respostas. Em landing page com tráfego moderado, costuma ficar em poucas dezenas de reais por mês. O que estoura orçamento é uso sem limite por visitante, e por isso o limite entra desde o primeiro dia.",
      },
      {
        q: "Chatbot aumenta conversão em landing page?",
        a: "Aumenta quando responde a objeção que estava travando a decisão, e atrapalha quando vira obstáculo entre a pessoa e o formulário. Vale medir com o CTA visto e o CTA clicado antes e depois: sem esse denominador não dá para saber se ele ajudou ou não.",
      },
    ],
  },

  {
    tipoSlug: "landing-page",
    integracaoId: "erp-crm",
    slug: "com-integracao-erp",
    nomeCurto: "integração com CRM",
    h1: "Quanto custa uma landing page integrada ao CRM?",
    title: "Landing Page Integrada ao CRM: Quanto Custa em 2026",
    metaDesc: (faixa, acrescimo) =>
      `Landing page que joga o lead direto no CRM custa ${faixa}, com cerca de ${acrescimo} de integração. Veja o que muda e o erro que faz o lead sumir em silêncio.`,
    intro: [
      "Integrar a landing ao CRM resolve um problema real: lead que chega por e-mail vira lead perdido. No CRM ele entra com origem, dono e etapa, e aparece na fila de alguém. Sem isso, o time comercial trabalha por memória.",
      "A integração em si é simples. O que custa é combinar dois contratos: o que a tela pede e o que o CRM exige. Toda vez que esses dois discordam, o lead é recusado — e quase sempre em silêncio, porque a página já agradeceu antes de saber a resposta.",
    ],
    oQueMuda: [
      "Envio do lead ao CRM com origem, campanha e página de entrada preenchidas",
      "Mapeamento campo a campo entre o formulário e o CRM, validado com envio real",
      "Fila de reenvio quando o CRM está fora do ar — o lead nunca depende de uma tentativa só",
      "Alerta para você quando um envio é recusado, em vez de falhar calado",
      "Teste automatizado que manda exatamente o que a tela manda, não um payload ideal",
    ],
    ondeTravaCaro:
      "Este é o ponto exato onde um projeto real perdeu 100% dos leads da isca principal: a API exigia um campo que o formulário não pedia, e o aviso de saída agradecia antes da resposta chegar. Por isso o teste de contrato não é opcional aqui — ele envia o payload literal da tela e falha se o servidor recusar.",
    faqs: [
      {
        q: "Funciona com qualquer CRM?",
        a: "Com qualquer um que tenha API ou webhook, o que cobre praticamente todos os CRMs usados no Brasil. O que muda o esforço é a qualidade da documentação e se o CRM exige campos obrigatórios que o formulário não coleta. Isso precisa ser mapeado antes, não durante.",
      },
      {
        q: "E se o CRM estiver fora do ar na hora do envio?",
        a: "O lead é gravado do nosso lado primeiro e o envio ao CRM entra numa fila com nova tentativa. A ordem importa: gravar primeiro, integrar depois. Quem integra primeiro perde o lead junto com a indisponibilidade.",
      },
      {
        q: "Consigo saber qual anúncio gerou cada lead dentro do CRM?",
        a: "Sim, desde que os UTMs e a página de entrada viajem junto com o lead. É isso que permite responder qual página gera dinheiro, e não apenas quantos leads chegaram. Sem gravar a origem no próprio registro, o relatório não se sustenta.",
      },
    ],
  },

  {
    tipoSlug: "landing-page",
    integracaoId: "automacao",
    slug: "com-automacao-de-marketing",
    nomeCurto: "automação de marketing",
    h1: "Quanto custa uma landing page com automação de marketing?",
    title: "Landing Page com Automação de E-mail e WhatsApp: Preço 2026",
    metaDesc: (faixa, acrescimo) =>
      `Landing page com sequência automática de e-mail e WhatsApp custa ${faixa}, sendo cerca de ${acrescimo} da automação. Veja o que entra e o que a LGPD exige.`,
    intro: [
      "Automação numa landing page serve para uma coisa: não perder quem demonstrou interesse e não fechou na hora. A maior parte das pessoas que preenche um formulário não está pronta para comprar naquele minuto, e sem sequência elas simplesmente somem.",
      "O trabalho não está em disparar e-mail. Está em ligar o disparo ao contexto: quem veio da página de e-commerce recebe assunto diferente de quem veio da página de app. É isso que separa automação que converte de automação que vira spam.",
    ],
    oQueMuda: [
      "Sequência de e-mails disparada pelo envio do formulário, com conteúdo por origem",
      "Mensagem de WhatsApp usando modelo aprovado, quando o contato autorizou",
      "Descadastro em um clique em todo e-mail, como a LGPD exige",
      "Registro de qual sequência cada contato recebeu, para não duplicar disparo",
      "Corte automático da sequência quando a pessoa responde ou fecha",
    ],
    ondeTravaCaro:
      "A regra que não se negocia: só recebe quem preencheu formulário. Base importada, lista comprada ou contato raspado queima o domínio de envio e não tem base legal na LGPD. Um domínio queimado leva meses para recuperar e derruba junto os e-mails transacionais que você precisa que cheguem.",
    faqs: [
      {
        q: "Posso importar minha lista de contatos antiga para a automação?",
        a: "Não sem consentimento registrado. Além do risco legal, base antiga gera marcação de spam, e isso derruba a entrega de todos os seus e-mails, inclusive os transacionais. A saída honesta é fazer uma campanha de reconsentimento pelo canal onde esses contatos já falam com você.",
      },
      {
        q: "Quantos e-mails deve ter a sequência?",
        a: "Três a cinco costumam cobrir o essencial: entrega do que foi prometido, aprofundamento, prova e convite. Sequência longa sem conteúdo novo desgasta mais do que ajuda. O sinal para parar é a taxa de abertura caindo a cada envio.",
      },
      {
        q: "WhatsApp automático pode? Não é invasivo?",
        a: "Pode, com autorização explícita e usando modelo aprovado pela plataforma. Envio fora dessas regras derruba o número. Na prática, funciona melhor como aviso pontual e útil do que como sequência longa — o WhatsApp é canal de resposta, não de campanha.",
      },
    ],
  },

  {
    tipoSlug: "site-institucional",
    integracaoId: "pagamento",
    slug: "com-pagamento-online",
    nomeCurto: "pagamento online",
    h1: "Quanto custa um site institucional com pagamento online?",
    title: "Site Institucional com Pagamento Online: Quanto Custa em 2026",
    metaDesc: (faixa, acrescimo) =>
      `Site institucional que recebe pagamento custa ${faixa}, com cerca de ${acrescimo} da camada de cobrança. Mensalidade, área do cliente e segunda via — veja o que muda.`,
    intro: [
      "Pagamento em site institucional raramente é venda de produto. Quase sempre é mensalidade, anuidade ou serviço recorrente: escola, associação, academia, clínica, escritório. O que muda em relação a uma loja é que o cliente é conhecido, volta todo mês e precisa ver o histórico.",
      "Por isso o custo aqui não está no checkout, está na área do cliente. Segunda via, comprovante, histórico e situação de inadimplência são as telas que geram suporte quando faltam — e o suporte é justamente o que o sistema deveria eliminar.",
    ],
    oQueMuda: [
      "Área do cliente com login, histórico de pagamento e segunda via",
      "Cobrança recorrente por assinatura ou geração de boleto e Pix por período",
      "Conciliação automática: o sistema sabe quem pagou sem alguém conferir extrato",
      "Aviso de vencimento e de pagamento confirmado por e-mail",
      "Relatório de inadimplência por período, exportável",
    ],
    ondeTravaCaro:
      "A conciliação é o item que mais escapa do orçamento. Receber é fácil; saber com certeza quem pagou, quando, e casar isso com a mensalidade certa é onde o trabalho está. Sem conciliação automática, alguém vai continuar conferindo extrato na mão e o sistema não terá resolvido o problema que motivou a compra.",
    faqs: [
      {
        q: "Dá para cobrar mensalidade sem ser uma plataforma de assinatura?",
        a: "Dá, gerando cobrança por período via Pix ou boleto, o que evita a dependência de cartão. É o formato mais comum em escola e associação no Brasil. A contrapartida é a inadimplência maior, porque exige uma ação do cliente a cada ciclo.",
      },
      {
        q: "O cliente precisa criar conta para pagar?",
        a: "Para pagamento avulso, não. Para mensalidade, sim — é a conta que sustenta histórico e segunda via. Uma saída intermediária que funciona bem é o acesso por link único enviado por e-mail, sem senha, para quem só quer a segunda via.",
      },
      {
        q: "Como fica a emissão de nota fiscal?",
        a: "Se você já tem emissor contratado, a integração é possível e entra no escopo. Se não tem, a nota continua sendo emitida como você emite hoje. Montar emissão fiscal do zero é um projeto próprio e não cabe dentro de um site institucional.",
      },
      {
        q: "E quem prefere continuar pagando presencialmente?",
        a: "O sistema precisa conviver com isso, e essa é a parte que mais se esquece. Alguém vai continuar pagando no caixa ou por transferência, e esse pagamento tem que entrar no mesmo histórico, lançado manualmente pela secretaria. Sem essa tela de lançamento manual, o histórico do cliente fica incompleto e a segunda via passa a mostrar débito de quem já pagou.",
      },
    ],
  },

  {
    tipoSlug: "site-institucional",
    integracaoId: "ia",
    slug: "com-inteligencia-artificial",
    nomeCurto: "inteligência artificial",
    h1: "Quanto custa um site institucional com inteligência artificial?",
    title: "Site Institucional com IA: Busca Inteligente e Chat — Preço 2026",
    metaDesc: (faixa, acrescimo) =>
      `Site institucional com IA custa ${faixa}, sendo cerca de ${acrescimo} da camada de IA. Busca semântica no conteúdo e atendimento — veja o que compensa.`,
    intro: [
      "Em site institucional, a IA que devolve retorno de verdade não é o chat que fica no canto da tela: é a busca. Quando o site tem blog com dezenas de artigos, a busca por palavra exata falha justamente com quem descreve o problema em vez de usar o termo técnico — e essa pessoa é o cliente.",
      "O segundo uso que se paga é o atendimento sobre conteúdo próprio: responder o que já está escrito no site, com link para a página que aprofunda. Isso reduz e-mail repetido e, de quebra, leva o visitante para a página que converte.",
    ],
    oQueMuda: [
      "Busca semântica sobre o conteúdo do site, entendendo o problema descrito",
      "Assistente restrito ao seu próprio conteúdo, sempre citando a página de origem",
      "Trava de saída: sem número fora dos dados, sem preço, sem promessa",
      "Resposta fixa de fallback quando a checagem reprova o texto gerado",
      "Relatório do que as pessoas perguntam — pauta de blog vinda de demanda real",
    ],
    ondeTravaCaro:
      "O relatório de perguntas costuma valer mais que o chat em si. Ele mostra, em palavras do cliente, quais dúvidas travam a decisão — e cada dúvida recorrente é uma página que ainda não existe. É assim que o eixo de conteúdo cresce a partir de dado real em vez de achismo.",
    faqs: [
      {
        q: "A IA consegue responder só com base no meu conteúdo?",
        a: "Consegue, quando a busca é restrita ao seu material e a instrução impede resposta fora dele. Na dúvida, a resposta correta é dizer que não sabe e oferecer contato. Assistente que chuta para não parecer limitado gera muito mais problema do que resolve.",
      },
      {
        q: "Isso substitui o atendimento humano?",
        a: "Não, e não deveria. Ele cobre a pergunta repetida que já está respondida no site e encaminha o resto. O ganho é liberar tempo de quem atende, não cortar o atendimento — quem corta costuma perder o cliente que estava quase fechando.",
      },
      {
        q: "Vale a pena ter IA num site com poucas páginas?",
        a: "Raramente. Com menos de vinte páginas de conteúdo, um menu bem feito e uma busca comum resolvem. A IA começa a se pagar quando o volume de conteúdo passa do ponto em que a pessoa consegue encontrar sozinha.",
      },
    ],
  },

  {
    tipoSlug: "site-institucional",
    integracaoId: "erp-crm",
    slug: "com-integracao-erp",
    nomeCurto: "integração com ERP",
    h1: "Quanto custa um site institucional integrado ao ERP?",
    title: "Site Institucional Integrado ao ERP: Quanto Custa em 2026",
    metaDesc: (faixa, acrescimo) =>
      `Site institucional integrado ao ERP custa ${faixa}, com cerca de ${acrescimo} de integração. Área do cliente com dado real do sistema — veja o que muda.`,
    intro: [
      "Integrar um site institucional ao ERP muda o que o site é: ele deixa de ser folheto e vira canal de autoatendimento. O cliente entra e vê o pedido dele, a segunda via dele, o contrato dele — dado que hoje sai por telefone ou WhatsApp com alguém da sua equipe.",
      "O retorno aparece na redução de atendimento repetitivo. O custo aparece na natureza do ERP: cada um tem sua API, seus limites de consulta e suas surpresas. É a integração mais cara da lista justamente porque o lado de lá não foi feito para você.",
    ],
    oQueMuda: [
      "Área do cliente lendo dado direto do ERP, sem digitação paralela",
      "Cache das consultas, para o site não cair quando o ERP fica lento",
      "Camada de tradução entre os campos do ERP e o que o site mostra",
      "Permissão por cliente: cada um vê só o que é dele",
      "Monitoramento da integração, com aviso quando o ERP para de responder",
    ],
    ondeTravaCaro:
      "O que estoura prazo aqui quase nunca é o código do site: é o acesso. Conseguir credencial de homologação, descobrir o limite de chamadas e entender por que um campo vem diferente do documentado costuma levar semanas. Vale começar essa conversa com o fornecedor do ERP antes do desenvolvimento começar, não depois.",
    faqs: [
      {
        q: "Meu ERP não tem API. Ainda dá para integrar?",
        a: "Em geral dá, por caminhos menos elegantes: exportação agendada de arquivo, leitura direta de banco em réplica, ou uma camada intermediária. Funciona, mas custa mais e é mais frágil. Se houver plano de trocar de ERP, vale decidir isso antes de investir na integração.",
      },
      {
        q: "O site fica fora do ar se o ERP cair?",
        a: "Não, quando a integração é feita com cache e degradação controlada. As páginas públicas continuam no ar e a área do cliente mostra o último dado conhecido com aviso claro. Site que cai junto com o ERP é integração mal feita, não consequência inevitável.",
      },
      {
        q: "Quanto tempo leva uma integração dessas?",
        a: "De duas a seis semanas, e a variação quase toda vem do lado do ERP. Documentação boa e ambiente de homologação disponível puxam para o piso. Acesso demorado e campo indocumentado puxam para o teto.",
      },
    ],
  },

  {
    tipoSlug: "site-institucional",
    integracaoId: "automacao",
    slug: "com-automacao-de-marketing",
    nomeCurto: "automação de marketing",
    h1: "Quanto custa um site institucional com automação de marketing?",
    title: "Site Institucional com Automação de Marketing: Preço 2026",
    metaDesc: (faixa, acrescimo) =>
      `Site institucional com newsletter e nutrição automática custa ${faixa}, sendo cerca de ${acrescimo} da automação. Veja como o blog vira fila de contato.`,
    intro: [
      "Num site institucional com blog, a automação tem uma função específica: transformar leitor em contato antes que ele esqueça o seu nome. Quem chega por busca resolve a dúvida e vai embora — a menos que exista um motivo para deixar o e-mail e uma sequência que mantenha a conversa viva.",
      "O que faz isso funcionar não é o volume de disparo, é a relevância por origem. Quem leu sobre custo de e-commerce tem interesse diferente de quem leu sobre MVP. Segmentar pela página de entrada é o que separa nutrição de lista de transmissão.",
    ],
    oQueMuda: [
      "Captura de e-mail no blog com oferta ligada ao assunto do artigo",
      "Segmentação automática pela página de entrada da sessão",
      "Sequência de nutrição por segmento, não uma fila única para todo mundo",
      "Aviso interno quando um contato demonstra intenção de compra",
      "Descadastro em um clique e registro de consentimento, conforme a LGPD",
    ],
    ondeTravaCaro:
      "A automação só rende se a página de entrada estiver gravada no próprio contato, não apenas no evento de analytics. É esse campo que permite dizer qual artigo gerou negócio — e é exatamente o que costuma faltar, transformando o relatório num agregado que não orienta nenhuma decisão.",
    faqs: [
      {
        q: "Preciso de uma ferramenta paga de e-mail marketing?",
        a: "Para volume baixo, o próprio site dá conta com um provedor de envio transacional, e o custo é pequeno. Ferramenta dedicada começa a valer quando a base cresce e você precisa de editor visual, testes e relatório sem depender de desenvolvedor.",
      },
      {
        q: "Com que frequência devo enviar?",
        a: "Menos do que a maioria imagina. Um envio útil por mês supera quatro envios sem conteúdo novo. O indicador para ajustar é a taxa de descadastro: subiu de forma consistente, a frequência ou a relevância estão erradas.",
      },
      {
        q: "Como sei se a automação está trazendo cliente?",
        a: "Comparando a origem gravada no contato com os negócios fechados. Sem isso, você mede abertura e clique, que não pagam conta. A pergunta que importa é quantos contratos vieram de contatos que entraram por conteúdo, e ela só se responde com a origem no registro.",
      },
    ],
  },

  {
    tipoSlug: "ecommerce",
    integracaoId: "pagamento",
    slug: "com-pagamento-online",
    nomeCurto: "pagamento online",
    h1: "Quanto custa um e-commerce com pagamento online completo?",
    title: "E-commerce com Checkout Pix e Cartão: Quanto Custa em 2026",
    metaDesc: (faixa, acrescimo) =>
      `E-commerce com checkout completo custa ${faixa}, sendo cerca de ${acrescimo} da camada de pagamento. Pix, cartão, antifraude e estorno — veja o que muda.`,
    intro: [
      "Num e-commerce, o pagamento não é uma funcionalidade: é o produto. Todo o resto existe para levar a pessoa até ali. Por isso o trabalho não se mede pela tela de checkout, e sim pela quantidade de caminhos que não terminam em sucesso — e são a maioria.",
      "Cartão recusado por limite, recusado por antifraude, Pix gerado e não pago, pagamento aprovado depois do estoque acabar, cliente que paga duas vezes, estorno parcial. Cada um desses é uma regra de negócio com consequência em dinheiro, e é aí que mora o custo real.",
    ],
    oQueMuda: [
      "Checkout com Pix e cartão, incluindo parcelamento e mensagem clara de recusa",
      "Reserva de estoque no início do checkout, liberada se o pagamento não confirmar",
      "Webhook com reprocessamento e proteção contra evento duplicado do provedor",
      "Fluxo de estorno total e parcial ligado ao status do pedido",
      "Antifraude com regra de revisão manual para pedido de valor alto",
    ],
    ondeTravaCaro:
      "O evento duplicado é o defeito silencioso mais caro desta lista. Provedores reenviam notificação quando não recebem confirmação, e um sistema que processa o mesmo evento duas vezes libera pedido em dobro ou estorna duas vezes. O tratamento disso não aparece em nenhuma tela e precisa estar no escopo desde o início.",
    faqs: [
      {
        q: "Pix ou cartão: qual priorizar no checkout?",
        a: "Pix tem taxa menor e confirmação rápida, e no Brasil já responde por boa parte das vendas. Cartão é indispensável para ticket alto, por causa do parcelamento. A recomendação prática é lançar com os dois: o Pix melhora a margem e o cartão amplia o teto de venda.",
      },
      {
        q: "Preciso de antifraude desde o primeiro dia?",
        a: "Depende do ticket e do produto. Produto digital e ticket alto atraem fraude rápido. Para começar, a regra de revisão manual acima de um valor já protege bastante, e o antifraude dedicado entra quando o volume justifica o custo por análise.",
      },
      {
        q: "O que acontece se o cliente pagar e o produto tiver acabado?",
        a: "Com reserva de estoque no início do checkout, isso praticamente não ocorre. Quando ocorre, o sistema precisa de um caminho explícito: estorno automático com aviso ao cliente ou contato para troca. Sem esse caminho definido, vira atendimento manual e reclamação pública.",
      },
    ],
  },

  {
    tipoSlug: "ecommerce",
    integracaoId: "ia",
    slug: "com-inteligencia-artificial",
    nomeCurto: "inteligência artificial",
    h1: "Quanto custa um e-commerce com inteligência artificial?",
    title: "E-commerce com IA: Busca e Recomendação — Quanto Custa em 2026",
    metaDesc: (faixa, acrescimo) =>
      `E-commerce com IA custa ${faixa}, sendo cerca de ${acrescimo} da camada de IA. Busca que entende o cliente e recomendação — veja o que devolve margem.`,
    intro: [
      "Em loja virtual, a IA que paga a conta é a busca. Cliente que usa a busca converte muito mais que quem navega por categoria, e busca que não encontra é venda perdida com o produto em estoque. Quem procura por descrição em vez do nome exato não acha nada — e vai embora sem avisar.",
      "O segundo uso que se sustenta é recomendação ligada ao comportamento real da loja, não a uma lista fixa de relacionados. A diferença aparece no ticket médio, que é onde o investimento se mede.",
    ],
    oQueMuda: [
      "Busca semântica: encontra o produto pela descrição do problema, não só pelo nome",
      "Recomendação a partir do comportamento real de navegação e compra",
      "Geração assistida de descrição de produto, com revisão humana antes de publicar",
      "Relatório de buscas sem resultado — lista pronta do que falta no catálogo",
      "Limite de custo por sessão, para o gasto de IA não crescer sem controle",
    ],
    ondeTravaCaro:
      "Descrição gerada por IA precisa de revisão antes de publicar, sempre. Texto de produto com especificação inventada não é só um problema de qualidade: é informação incorreta ao consumidor, com consequência legal e devolução. A IA acelera o rascunho, não substitui a conferência.",
    faqs: [
      {
        q: "A busca com IA funciona com catálogo pequeno?",
        a: "Com menos de cem produtos, a busca tradicional bem configurada costuma resolver, e por um custo bem menor. A busca semântica passa a compensar quando o catálogo cresce, tem variação de nomenclatura ou quando o cliente descreve o produto de um jeito diferente do seu.",
      },
      {
        q: "Recomendação aumenta o ticket médio de verdade?",
        a: "Aumenta quando é baseada em comportamento real e colocada no ponto certo do fluxo, normalmente no carrinho e na página de produto. Lista fixa de relacionados, escolhida na mão, rende pouco. O jeito de saber é medir ticket médio antes e depois, não confiar na impressão.",
      },
      {
        q: "Quanto custa manter a IA de uma loja por mês?",
        a: "Varia com o tráfego, porque o custo é por uso. Loja de porte médio costuma ficar na casa de uma centena de reais por mês. O limite por sessão existe justamente para o pico de visita não virar uma fatura inesperada.",
      },
    ],
  },

  {
    tipoSlug: "ecommerce",
    integracaoId: "erp-crm",
    slug: "com-integracao-erp",
    nomeCurto: "integração com ERP",
    h1: "Quanto custa um e-commerce integrado ao ERP?",
    title: "E-commerce Integrado ao ERP: Quanto Custa Integrar em 2026",
    metaDesc: (faixa, acrescimo) =>
      `E-commerce integrado ao ERP custa ${faixa}, com cerca de ${acrescimo} de integração. Estoque, preço e pedido em duas vias — a integração mais cara da lista.`,
    intro: [
      "Esta é a integração mais cara que existe nesta lista, e por um motivo que raramente é explicado: ela é bidirecional. O ERP manda estoque e preço para a loja, e a loja manda pedido de volta para o ERP. Duas direções significam dois conjuntos de erro, e erro de estoque tem consequência imediata em venda.",
      "Vender o que não existe é o problema clássico. Se a loja atualiza estoque a cada hora e o produto acabou na loja física há quarenta minutos, você vendeu o que não tem. Resolver isso exige decidir quem manda em cada dado e com que frequência a verdade é sincronizada.",
    ],
    oQueMuda: [
      "Sincronização de estoque e preço do ERP para a loja, com frequência definida por criticidade",
      "Envio do pedido para o ERP com cliente, itens, pagamento e frete",
      "Definição explícita da fonte da verdade para cada campo, evitando sobrescrita cruzada",
      "Fila com nova tentativa: pedido nunca se perde porque o ERP estava fora",
      "Painel de divergência mostrando o que não sincronizou e por quê",
    ],
    ondeTravaCaro:
      "O painel de divergência é o item que o cliente corta do orçamento e depois pede com urgência. Sem ele, a sincronização falha em silêncio e a descoberta vem por reclamação de cliente que comprou um produto indisponível. Integração sem visibilidade de erro é integração que você não sabe se está funcionando.",
    faqs: [
      {
        q: "De quanto em quanto tempo o estoque precisa sincronizar?",
        a: "Depende do giro. Produto de alto giro e estoque baixo pede sincronização em minutos ou sob demanda no checkout. Produto de baixo giro suporta intervalo de horas. Sincronizar tudo no menor intervalo possível estoura o limite de chamadas do ERP sem trazer ganho.",
      },
      {
        q: "Quem manda no preço: a loja ou o ERP?",
        a: "Precisa ser decidido campo a campo, antes de começar. O padrão que funciona é preço e estoque vindo do ERP, e conteúdo de marketing vivendo na loja. Sem essa definição explícita, os dois lados se sobrescrevem e alguém perde trabalho.",
      },
      {
        q: "Vale a pena integrar ou manter o cadastro manual?",
        a: "A conta é direta: quantas horas por semana alguém gasta digitando pedido e ajustando estoque. Quando isso passa de algumas horas semanais, a integração se paga em poucos meses. Abaixo disso, costuma ser mais barato manter manual e investir em outra coisa.",
      },
    ],
  },

  {
    tipoSlug: "ecommerce",
    integracaoId: "automacao",
    slug: "com-automacao-de-marketing",
    nomeCurto: "automação de marketing",
    h1: "Quanto custa um e-commerce com automação de marketing?",
    title: "E-commerce com Carrinho Abandonado e Pós-venda: Preço 2026",
    metaDesc: (faixa, acrescimo) =>
      `E-commerce com automação custa ${faixa}, sendo cerca de ${acrescimo} dela. Carrinho abandonado e pós-compra são as duas que se pagam — veja como.`,
    intro: [
      "Em loja virtual, automação tem o retorno mais direto de medir de todo este eixo, porque a ação final é uma compra com valor. Duas sequências pagam o investimento sozinhas: carrinho abandonado e pós-compra.",
      "Carrinho abandonado recupera venda que já estava quase fechada — a pessoa escolheu, colocou no carrinho e travou. Pós-compra ataca o número que define a saúde da loja no longo prazo, que é a segunda compra. Adquirir cliente novo custa muito mais que fazer o mesmo cliente voltar.",
    ],
    oQueMuda: [
      "Sequência de carrinho abandonado por e-mail e, com autorização, WhatsApp",
      "Pós-compra: confirmação, acompanhamento de entrega e convite à recompra",
      "Aviso de volta ao estoque para quem demonstrou interesse no produto",
      "Corte automático da sequência quando a compra acontece",
      "Receita atribuída por sequência, para saber qual se paga",
    ],
    ondeTravaCaro:
      "O detalhe que estraga a sequência de carrinho abandonado é não cortá-la na hora da compra. Cliente que já pagou e recebe um lembrete perguntando se esqueceu algo perde a confiança na loja inteira. Esse corte precisa ser imediato e testado, não configurado e esquecido.",
    faqs: [
      {
        q: "Quanto tempo depois do abandono devo enviar o primeiro e-mail?",
        a: "Entre uma e quatro horas costuma funcionar melhor: cedo o suficiente para a intenção ainda existir, tarde o suficiente para não parecer vigilância. A partir do segundo envio, espaçar por dias. Mais de três tentativas raramente acrescenta.",
      },
      {
        q: "Posso mandar carrinho abandonado por WhatsApp?",
        a: "Com autorização explícita e modelo aprovado, sim, e a taxa de resposta é alta. Sem autorização, o número é denunciado e derrubado. A regra é a mesma do e-mail: só recebe quem consentiu, sem exceção.",
      },
      {
        q: "Como saber quanto a automação trouxe de receita?",
        a: "Atribuindo o pedido à sequência que o antecedeu e comparando com um grupo que não recebeu. Sem essa separação, qualquer número reportado inclui vendas que aconteceriam de qualquer forma — e a automação leva crédito por receita que não gerou.",
      },
      {
        q: "Vale mandar aviso de volta ao estoque?",
        a: "Vale, e costuma ser a sequência com melhor taxa de conversão de todas, porque a pessoa pediu explicitamente para ser avisada. O cuidado é disparar para todos da fila ao mesmo tempo quando repõe pouca quantidade: quem corre e não encontra fica com a sensação de ter sido enganado. Avisar em lotes, proporcional ao estoque reposto, resolve.",
      },
    ],
  },

  /* ----------------------------------------------------------------- APP */

  {
    tipoSlug: "app-mobile",
    integracaoId: "pagamento",
    slug: "com-pagamento-online",
    nomeCurto: "pagamento no app",
    h1: "Quanto custa um app mobile com pagamento?",
    title: "App Mobile com Pagamento: Quanto Custa e a Regra das Lojas",
    metaDesc: (faixa, acrescimo) =>
      `App mobile com pagamento custa ${faixa}, sendo cerca de ${acrescimo} da cobrança. A regra de compra dentro do app muda tudo — entenda antes de orçar.`,
    intro: [
      "Pagamento em app mobile tem uma particularidade que não existe em nenhum outro item desta lista: as lojas cobram comissão sobre conteúdo digital vendido dentro do app, e exigem que essa venda passe pelo sistema de compra delas. Essa regra decide a arquitetura do projeto inteiro.",
      "Bem digital consumido no app normalmente cai nessa regra. Bem ou serviço do mundo físico, como comida, transporte ou consulta, em geral não cai, e pode usar pagamento próprio com taxa muito menor. Descobrir em qual lado você está é a primeira decisão, e ela precisa vir antes do orçamento.",
    ],
    oQueMuda: [
      "Definição do modelo de cobrança conforme a política das lojas, antes de codar",
      "Compra dentro do app quando o conteúdo é digital, com validação de recibo no servidor",
      "Pagamento próprio com Pix e cartão quando o produto é físico ou serviço presencial",
      "Restauração de compra, exigida pela Apple em app com compra dentro do app",
      "Tratamento de cancelamento e reembolso feitos pela loja, fora do seu controle",
    ],
    ondeTravaCaro:
      "O retrabalho clássico é construir o pagamento próprio, submeter à loja e ser reprovado por contornar a regra de compra dentro do app. Isso custa semanas e uma refação inteira da camada de cobrança. Por isso a classificação do seu produto na política das lojas entra antes da primeira linha de código.",
    faqs: [
      {
        q: "Quanto as lojas cobram de comissão?",
        a: "A comissão padrão é alta e existem faixas reduzidas para desenvolvedores de menor faturamento e para assinatura renovada após o primeiro ano. Como os percentuais e as condições mudam com frequência, vale confirmar na política vigente de cada loja no momento do projeto.",
      },
      {
        q: "Meu app vende serviço presencial. Preciso usar a compra da loja?",
        a: "Em geral não. Serviço consumido fora do app, como uma consulta, uma corrida ou uma refeição, normalmente pode usar pagamento próprio. A fronteira é o consumo, não o tipo do pagamento — e casos de dúvida devem ser checados na política antes de fechar escopo.",
      },
      {
        q: "Dá para vender pelo site e liberar no app?",
        a: "Essa é uma prática comum, mas a política das lojas tem regras específicas sobre direcionar o usuário para pagamento externo, e elas mudaram nos últimos anos. É uma decisão que precisa ser verificada na política vigente antes de virar arquitetura.",
      },
    ],
  },

  {
    tipoSlug: "app-mobile",
    integracaoId: "ia",
    slug: "com-inteligencia-artificial",
    nomeCurto: "inteligência artificial",
    h1: "Quanto custa um app mobile com inteligência artificial?",
    title: "App Mobile com IA: Quanto Custa em 2026 e o Custo por Uso",
    metaDesc: (faixa, acrescimo) =>
      `App mobile com IA custa ${faixa}, sendo cerca de ${acrescimo} da camada de IA. O detalhe decisivo é o custo por uso, que cresce com a base — entenda.`,
    intro: [
      "IA em app mobile traz um problema de modelo de negócio que não existe em site: o custo cresce com o uso, mas a receita de um app simples geralmente não. Se o app é gratuito ou de compra única e cada usuário consome IA todo dia, a conta piora conforme o app dá certo.",
      "Por isso o trabalho aqui não é só integrar o modelo. É desenhar o limite: quanto cada usuário pode consumir, o que acontece quando ele passa disso e como o app se comporta sem internet. Esses três pontos definem se o recurso é sustentável.",
    ],
    oQueMuda: [
      "Chamada de IA sempre pelo servidor, nunca com chave dentro do app",
      "Limite de uso por usuário e por período, com mensagem clara ao atingir",
      "Comportamento definido para uso offline e para falha do provedor",
      "Resposta em fluxo para o usuário não olhar tela parada",
      "Painel de custo por usuário, para acompanhar a margem conforme a base cresce",
    ],
    ondeTravaCaro:
      "Chave de API embutida no app é a falha de segurança mais comum neste cenário. App publicado pode ser inspecionado, a chave extraída e usada por terceiros na sua conta — e você descobre pela fatura. A chamada precisa passar pelo seu servidor, sempre, sem exceção.",
    faqs: [
      {
        q: "A IA roda no celular ou no servidor?",
        a: "Na maioria dos casos, no servidor: modelos grandes não cabem no aparelho e a chave não pode ficar exposta. Modelos pequenos rodando no próprio celular fazem sentido para tarefas simples e uso offline, mas ampliam o tamanho do app e o esforço do projeto.",
      },
      {
        q: "Como impedir que um usuário gere custo alto demais?",
        a: "Com limite por usuário e por período aplicado no servidor, nunca no app. Limite que vive só no aplicativo pode ser contornado. Também vale alerta de consumo anômalo, para detectar abuso antes de virar fatura.",
      },
      {
        q: "O app funciona sem internet se tiver IA?",
        a: "As funções de IA não, a menos que o modelo rode localmente. O que precisa estar definido é o comportamento: mostrar o último resultado, enfileirar a solicitação ou avisar com clareza. App que trava em tela de carregamento sem rede é reprovado na revisão das lojas.",
      },
    ],
  },

  {
    tipoSlug: "app-mobile",
    integracaoId: "erp-crm",
    slug: "com-integracao-erp",
    nomeCurto: "integração com sistema interno",
    h1: "Quanto custa um app mobile integrado ao sistema interno?",
    title: "App Mobile Integrado ao ERP: Quanto Custa em 2026",
    metaDesc: (faixa, acrescimo) =>
      `App mobile integrado ao sistema interno custa ${faixa}, com cerca de ${acrescimo} de integração. Equipe em campo e dado offline — veja o que muda.`,
    intro: [
      "App integrado a sistema interno quase sempre é app de equipe, não de cliente: vendedor externo, técnico em campo, entregador, vistoriador. Isso muda a prioridade do projeto por completo — a tela importa menos, e o que importa é funcionar onde a internet é ruim.",
      "É por isso que este par tem uma dificuldade própria: dado precisa existir no aparelho e ser enviado depois. E dado enviado depois entra em conflito com o que mudou no ERP nesse meio-tempo. Resolver esse conflito é o coração do orçamento.",
    ],
    oQueMuda: [
      "Sincronização em duas vias entre app e sistema interno, com resolução de conflito",
      "Funcionamento offline com fila de envio quando a conexão volta",
      "Autenticação por usuário com permissão espelhando a do sistema interno",
      "Registro de quem alterou o quê e quando, para auditoria",
      "Camada intermediária entre o app e o ERP, isolando o app de mudança no ERP",
    ],
    ondeTravaCaro:
      "O conflito de sincronização é o que separa o orçamento realista do otimista. Dois técnicos editam o mesmo registro offline e sobem os dois. Alguém tem que decidir quem vence, e essa regra é de negócio, não técnica. Projeto que não define isso antes acaba sobrescrevendo dado de alguém em silêncio.",
    faqs: [
      {
        q: "O app precisa funcionar sem internet?",
        a: "Se a equipe trabalha em campo, sim, e isso não é opcional. App que exige conexão em lugar sem sinal não é usado, e a equipe volta para o papel. Offline aumenta o custo, mas é justamente o que torna o projeto viável.",
      },
      {
        q: "Dá para reaproveitar o sistema interno que já temos?",
        a: "Sim, e é o caminho recomendado. O app consome o que o sistema já expõe, por meio de uma camada intermediária que traduz e protege. Reescrever o sistema para acomodar o app quase nunca se justifica.",
      },
      {
        q: "Como fica o controle de quem pode ver o quê?",
        a: "A permissão deve espelhar a do sistema interno, nunca ser recriada no app. Permissão duplicada em dois lugares diverge com o tempo, e a divergência aparece na forma de alguém vendo dado que não deveria.",
      },
      {
        q: "Quanto dado o app deve guardar no aparelho?",
        a: "Só o necessário para o trabalho do dia, e por tempo limitado. Celular de equipe se perde, é trocado e às vezes é vendido com dado dentro. Guardar o histórico inteiro no aparelho aumenta o risco sem ganho operacional, e cria uma obrigação a mais sob a LGPD. O padrão seguro é baixar o roteiro do período, sincronizar e limpar.",
      },
    ],
  },

  {
    tipoSlug: "app-mobile",
    integracaoId: "push-whatsapp",
    slug: "com-push-e-whatsapp",
    nomeCurto: "push e WhatsApp",
    h1: "Quanto custa um app mobile com push e WhatsApp?",
    title: "App Mobile com Push e WhatsApp: Quanto Custa em 2026",
    metaDesc: (faixa, acrescimo) =>
      `App mobile com notificação push e WhatsApp custa ${faixa}, sendo cerca de ${acrescimo} das notificações. Veja o que muda e por que push mal feito desinstala app.`,
    intro: [
      "Notificação é o que faz um app simples ser reaberto — e é também o que mais causa desinstalação. Os dois efeitos vêm do mesmo mecanismo, e a diferença entre eles está inteiramente no critério de quando disparar.",
      "Tecnicamente, push é barato. O que custa é a camada em volta: pedir permissão na hora certa, respeitar horário, agrupar mensagens para não bombardear, e ter um caminho quando a pessoa nega a permissão — o que acontece com boa parte dos usuários no iPhone.",
    ],
    oQueMuda: [
      "Push para Android e iOS com pedido de permissão em momento de valor, não na abertura",
      "Preferência de notificação por tipo, para o usuário desligar sem desinstalar",
      "WhatsApp com modelo aprovado como alternativa para quem negou o push",
      "Agrupamento e janela de silêncio, evitando disparo em horário indevido",
      "Medição de entrega, abertura e desinstalação por tipo de notificação",
    ],
    ondeTravaCaro:
      "Pedir permissão de push na primeira abertura é o erro mais comum e o mais caro: a pessoa nega, e no iPhone essa negativa é praticamente definitiva. Recuperar exige levar o usuário até os ajustes do sistema, e quase ninguém vai. O pedido precisa vir depois do primeiro momento de valor.",
    faqs: [
      {
        q: "Push é gratuito?",
        a: "O envio em si é gratuito nas plataformas padrão de Android e iOS. O custo está na construção do agendamento, da segmentação e das preferências. WhatsApp, ao contrário, é cobrado por conversa e exige modelo aprovado.",
      },
      {
        q: "Quantas notificações posso enviar por semana?",
        a: "Não há limite técnico, e é por isso que a pergunta certa é outra: a notificação é útil para quem recebe? Aviso ligado a uma ação da pessoa quase sempre é bem-vindo. Comunicado genérico de marketing é o que mais gera desinstalação.",
      },
      {
        q: "Vale usar WhatsApp em vez de push?",
        a: "Vale como complemento, principalmente para quem negou o push e para mensagem que não pode ser perdida. Como custa por conversa e é um canal mais pessoal, funciona melhor em aviso transacional do que em campanha.",
      },
      {
        q: "Como medir se a notificação está ajudando ou afastando?",
        a: "Acompanhando três números juntos por tipo de mensagem: quantos abriram o app depois dela, quantos desligaram aquele tipo nas preferências e quantos desinstalaram nos dias seguintes. Olhar só a abertura engana, porque a notificação que mais gera abertura pode ser exatamente a que mais gera desinstalação no mês seguinte.",
      },
    ],
  },

  {
    tipoSlug: "mvp-saas",
    integracaoId: "pagamento",
    slug: "com-pagamento-online",
    nomeCurto: "assinatura recorrente",
    h1: "Quanto custa um MVP de SaaS com assinatura recorrente?",
    title: "MVP SaaS com Assinatura Recorrente: Quanto Custa em 2026",
    metaDesc: (faixa, acrescimo) =>
      `MVP de SaaS com cobrança recorrente custa ${faixa}, sendo cerca de ${acrescimo} da assinatura. Trial, upgrade e cartão recusado — o que ninguém orça.`,
    intro: [
      "Assinatura recorrente é a parte do MVP de SaaS que mais consome orçamento e menos aparece na demonstração. A tela de checkout é meia hora de trabalho. O que consome semanas é tudo que acontece nos meses seguintes, sozinho, sem ninguém olhando.",
      "Trial que termina, cartão que expira, cliente que sobe de plano no dia 12 e precisa de cobrança proporcional, cliente que cancela e mantém acesso até o fim do período pago, renovação recusada que precisa de novas tentativas antes de bloquear. Cada um é uma regra com efeito direto em receita.",
    ],
    oQueMuda: [
      "Planos com trial, upgrade e downgrade, incluindo cálculo proporcional",
      "Recobrança automática com tentativas escalonadas antes de suspender o acesso",
      "Aviso de cartão prestes a expirar e de falha na renovação",
      "Cancelamento com acesso preservado até o fim do período já pago",
      "Painel de receita recorrente, cancelamento e inadimplência",
    ],
    ondeTravaCaro:
      "A recobrança é o item que mais devolve dinheiro e o mais cortado do escopo inicial. Uma fatia relevante do cancelamento em SaaS não é decisão do cliente: é cartão que falhou. Sem tentativas escalonadas e aviso, esse cliente é perdido sem nunca ter decidido sair.",
    faqs: [
      {
        q: "Preciso de trial no lançamento?",
        a: "Não necessariamente. Trial faz sentido quando o produto demonstra valor sozinho em poucos dias. Quando exige configuração ou acompanhamento, uma demonstração guiada costuma converter melhor e evita a fila de contas abandonadas que nunca viraram cliente.",
      },
      {
        q: "Cobro cartão ou boleto e Pix?",
        a: "Cartão é o que viabiliza renovação automática, e é o padrão em SaaS. Pix e boleto reduzem atrito no Brasil, mas exigem ação do cliente a cada ciclo e elevam a inadimplência. Em venda para empresa, vale prever também cobrança por fatura.",
      },
      {
        q: "O que acontece com os dados de quem cancela?",
        a: "Precisa estar definido e escrito antes do lançamento: por quanto tempo os dados ficam disponíveis, como o cliente exporta e quando são eliminados. É exigência da LGPD e é também o que permite reativar uma conta sem perda, o que acontece com mais frequência do que se imagina.",
      },
    ],
  },

  {
    tipoSlug: "mvp-saas",
    integracaoId: "ia",
    slug: "com-inteligencia-artificial",
    nomeCurto: "inteligência artificial",
    h1: "Quanto custa um MVP de SaaS com inteligência artificial?",
    title: "MVP SaaS com IA: Quanto Custa e Como Não Perder Margem",
    metaDesc: (faixa, acrescimo) =>
      `MVP de SaaS com IA custa ${faixa}, sendo cerca de ${acrescimo} da camada de IA. O risco real não é técnico: é margem que some com cliente de uso pesado.`,
    intro: [
      "SaaS com IA tem um problema que SaaS tradicional não tem: custo variável por cliente. No modelo clássico, um cliente a mais custa quase nada. Com IA, cada uso tem preço — e se o plano é mensal fixo enquanto o custo é por uso, existe um volume a partir do qual o cliente dá prejuízo.",
      "Por isso, neste par, a decisão mais importante não é técnica, é de precificação. Quanto custa servir o cliente médio, quanto custa o cliente pesado, e onde entra o limite. Sem essa conta, o produto cresce e a margem encolhe ao mesmo tempo.",
    ],
    oQueMuda: [
      "Medição de consumo de IA por conta, desde o primeiro dia",
      "Limite por plano com comportamento definido ao atingir o teto",
      "Cache de resultado repetido, que costuma cortar uma fatia grande do custo",
      "Escolha de modelo por tarefa: o mais caro só onde realmente muda o resultado",
      "Painel de margem por cliente, cruzando receita e custo de IA",
    ],
    ondeTravaCaro:
      "Medir consumo por conta parece detalhe e é o que segura o negócio. Sem isso você só descobre o cliente que dá prejuízo pela fatura agregada do provedor, sem saber qual conta causou. E aí a correção vira mudança de preço para todo mundo, que é a pior conversa possível com a base.",
    faqs: [
      {
        q: "Como precificar um SaaS com custo de IA variável?",
        a: "Os formatos que funcionam são plano com franquia de uso, cobrança por consumo, ou híbrido com mensalidade e excedente. O que não funciona é ilimitado com custo por uso: sempre aparece o cliente que torna a conta negativa, e ele costuma ser o mais engajado.",
      },
      {
        q: "Dá para reduzir o custo de IA sem piorar o produto?",
        a: "Dá, e bastante. Cache de resultado repetido, prompt mais enxuto e uso do modelo caro apenas onde ele muda o resultado costumam cortar uma parte relevante da conta sem que o cliente perceba diferença.",
      },
      {
        q: "Preciso avisar que o produto usa IA?",
        a: "Sim, por transparência e porque muitos clientes corporativos exigem saber onde o dado deles trafega. Vale deixar explícito na política de privacidade qual provedor é usado e se o conteúdo é utilizado para treinamento — essa é uma pergunta comum em contrato B2B.",
      },
    ],
  },

  {
    tipoSlug: "mvp-saas",
    integracaoId: "erp-crm",
    slug: "com-integracao-erp",
    nomeCurto: "integração com ERP do cliente",
    h1: "Quanto custa um MVP de SaaS integrado ao ERP do cliente?",
    title: "MVP SaaS com Integração a ERP: Quanto Custa em 2026",
    metaDesc: (faixa, acrescimo) =>
      `MVP de SaaS que integra ao ERP do cliente custa ${faixa}, com cerca de ${acrescimo} de integração. A armadilha: cada cliente tem um ERP diferente.`,
    intro: [
      "Aqui existe uma armadilha que só aparece neste par. Num projeto sob medida, você integra com um ERP. Num SaaS, cada cliente tem o seu — e o segundo cliente pede outro. Se a primeira integração foi feita grudada no produto, a segunda vira quase o mesmo trabalho de novo.",
      "O que decide o custo de longo prazo não é integrar, é a arquitetura da integração. Construir um formato interno único, com um conector por ERP, custa mais na primeira vez e transforma cada novo ERP em trabalho pequeno. É a diferença entre um produto e uma sequência de projetos.",
    ],
    oQueMuda: [
      "Modelo interno único de dados, independente de qualquer ERP específico",
      "Conector isolado por ERP, sem contaminar o núcleo do produto",
      "Credencial por cliente, armazenada de forma cifrada e isolada",
      "Painel do cliente mostrando o estado da própria integração e os erros dela",
      "Processo de homologação para habilitar um novo cliente sem alterar código",
    ],
    ondeTravaCaro:
      "A decisão cara é tomada na primeira integração, quando ainda parece cedo para abstrair. Amarrar o produto ao primeiro ERP economiza algumas semanas e cobra isso de volta em cada cliente seguinte. Vale pagar a abstração já na primeira, se a estratégia comercial inclui atender clientes com sistemas diferentes.",
    faqs: [
      {
        q: "Devo integrar com ERP já no MVP?",
        a: "Só se a integração for o motivo pelo qual o cliente compra. Se for conveniência, adiar é mais sensato: importação por planilha resolve os primeiros clientes e adia uma decisão arquitetural cara para quando houver mais informação sobre quais ERPs realmente aparecem.",
      },
      {
        q: "Quanto custa adicionar suporte a um novo ERP depois?",
        a: "Com a arquitetura de conector isolado, costuma ser uma fração da primeira integração, porque só o conector muda. Sem ela, tende a custar quase o mesmo da primeira — e esse é exatamente o custo que a abstração evita.",
      },
      {
        q: "Como guardar a credencial do ERP de cada cliente com segurança?",
        a: "Cifrada em repouso, com chave gerenciada fora do banco, isolada por cliente e com acesso registrado. Além de ser exigência de qualquer contrato corporativo sério, é o tipo de item que, se ficar para depois, exige migração dolorosa com clientes já ativos.",
      },
    ],
  },

  {
    tipoSlug: "mvp-saas",
    integracaoId: "push-whatsapp",
    slug: "com-push-e-whatsapp",
    nomeCurto: "notificações e WhatsApp",
    h1: "Quanto custa um MVP de SaaS com notificações e WhatsApp?",
    title: "MVP SaaS com Notificação e WhatsApp: Quanto Custa em 2026",
    metaDesc: (faixa, acrescimo) =>
      `MVP de SaaS com notificações e WhatsApp custa ${faixa}, sendo cerca de ${acrescimo} delas. Notificação é o que traz o usuário de volta — e o que cancela assinatura.`,
    intro: [
      "Em SaaS, notificação não é um detalhe de conveniência: é o mecanismo que traz o usuário de volta ao produto. Cliente que não volta não percebe valor, e cliente que não percebe valor cancela na renovação. Boa parte do cancelamento começa em desuso, não em insatisfação.",
      "O ponto específico deste par é que SaaS tem muitos eventos e vários usuários por conta. Sem agrupamento e sem preferência por usuário, o produto vira fonte de ruído e a pessoa desliga tudo — inclusive o aviso que faria ela voltar.",
    ],
    oQueMuda: [
      "Preferência de notificação por usuário e por tipo de evento, não por conta",
      "Resumo agrupado em vez de uma mensagem por evento",
      "WhatsApp com modelo aprovado para o que é urgente e não pode ser perdido",
      "E-mail transacional com domínio autenticado, para não cair em spam",
      "Medição de quais notificações trazem o usuário de volta ao produto",
    ],
    ondeTravaCaro:
      "Autenticar o domínio de envio é barato e costuma ficar de fora até o dia em que os e-mails somem na caixa de spam do cliente. Como o aviso de falha de cobrança viaja pelo mesmo canal, um domínio mal configurado deixa de avisar sobre pagamento recusado — e isso vira cancelamento involuntário.",
    faqs: [
      {
        q: "E-mail ou WhatsApp para avisar o cliente?",
        a: "E-mail para o que é registro e pode esperar; WhatsApp para o que é urgente e tem custo se for ignorado, como falha de pagamento ou prazo prestes a vencer. Como o WhatsApp é cobrado por conversa, usá-lo para tudo encarece rápido e incomoda.",
      },
      {
        q: "Como evitar que meus e-mails caiam em spam?",
        a: "Autenticando o domínio de envio com os registros padrão, separando e-mail transacional de marketing e mantendo a base limpa de endereços que não existem. A maioria dos problemas de entrega vem de configuração ausente, não de conteúdo.",
      },
      {
        q: "Devo deixar o cliente desligar todas as notificações?",
        a: "Das notificações de produto, sim. As transacionais críticas, como falha de cobrança e alteração de segurança, não devem ser desligáveis — elas protegem o cliente e você. A separação entre esses dois grupos precisa existir desde o início.",
      },
      {
        q: "Notificação ajuda a reduzir cancelamento?",
        a: "Ajuda quando avisa sobre algo que o cliente perderia, e atrapalha quando vira lembrete genérico de que o produto existe. O aviso que mais segura assinatura é o de falha de cobrança, porque uma parte relevante do cancelamento é cartão recusado e não decisão. Depois dele, vêm os avisos ligados a trabalho pendente dentro do produto.",
      },
    ],
  },

  {
    tipoSlug: "app-completo",
    integracaoId: "pagamento",
    slug: "com-pagamento-online",
    nomeCurto: "pagamento com repasse",
    h1: "Quanto custa um app completo com pagamento e repasse?",
    title: "App com Pagamento e Repasse (Split): Quanto Custa em 2026",
    metaDesc: (faixa, acrescimo) =>
      `App completo com pagamento e repasse custa ${faixa}, sendo cerca de ${acrescimo} da camada financeira. Split, conciliação e o risco de reter dinheiro de terceiro.`,
    intro: [
      "Quando o app tem mais de um lado, o pagamento deixa de ser cobrança e vira fluxo financeiro. O dinheiro entra de um, precisa chegar em outro, e a plataforma fica com uma parte. Isso traz uma consequência que muita gente descobre tarde: reter dinheiro de terceiro é atividade regulada.",
      "A forma de resolver sem virar instituição de pagamento é usar a divisão automática no momento da transação, oferecida pelos provedores. O dinheiro nunca passa pela sua conta — vai direto para cada destino, com sua comissão separada na origem. Essa decisão precisa ser tomada antes da modelagem de dados.",
    ],
    oQueMuda: [
      "Divisão automática no momento do pagamento, com comissão separada na origem",
      "Cadastro e verificação dos recebedores exigidos pelo provedor",
      "Painel de repasse por recebedor, com valores, datas e status",
      "Tratamento de estorno quando o valor já foi repassado",
      "Conciliação entre pedidos do sistema e movimentação do provedor",
    ],
    ondeTravaCaro:
      "O estorno depois do repasse é o caso que quebra sistema mal modelado. O cliente pede reembolso, mas o dinheiro já foi para o vendedor. Quem cobre? Isso é regra de negócio com efeito contratual, precisa estar decidida e escrita antes de virar código — e precisa aparecer nos termos de uso do app.",
    faqs: [
      {
        q: "Preciso ser instituição de pagamento para operar um marketplace?",
        a: "Se você usar a divisão automática do provedor, normalmente não, porque o dinheiro não fica retido com você. Se decidir receber tudo e repassar depois por conta própria, entra em terreno regulado. É uma decisão que merece validação jurídica antes do desenvolvimento, e eu não fecho escopo de marketplace sem esse parecer na mão.",
      },
      {
        q: "Quando o vendedor recebe o dinheiro?",
        a: "Depende do provedor e do meio de pagamento, e costuma haver prazo maior para cartão do que para Pix. O importante é que a regra seja explícita no app: recebedor que não sabe quando recebe abre chamado, e esse atendimento recai sobre você.",
      },
      {
        q: "Como lidar com o estorno de um pedido já repassado?",
        a: "As saídas usuais são reter uma reserva de cada repasse, descontar do próximo, ou assumir o prejuízo como plataforma. Qualquer uma funciona, desde que esteja definida antes e conste dos termos aceitos pelo recebedor. O que não funciona é decidir isso no primeiro caso real.",
      },
    ],
  },

  {
    tipoSlug: "app-completo",
    integracaoId: "ia",
    slug: "com-inteligencia-artificial",
    nomeCurto: "inteligência artificial",
    h1: "Quanto custa um app completo com inteligência artificial?",
    title: "App Completo com IA: Roteamento e Previsão — Preço 2026",
    metaDesc: (faixa, acrescimo) =>
      `App completo com IA custa ${faixa}, sendo cerca de ${acrescimo} da camada de IA. Em operação com vários papéis, a IA que se paga é a que reduz decisão manual.`,
    intro: [
      "Em sistema com vários papéis, a IA que devolve dinheiro não é a que conversa: é a que decide. Distribuir entrega entre entregadores, prever demanda por região, priorizar chamado, detectar pedido suspeito. São decisões que hoje alguém toma na mão, muitas vezes por dia, e nem sempre bem.",
      "O ganho é direto de medir, porque existe um antes e um depois com número: tempo médio de atendimento, quilômetro rodado, fila parada. É o cenário desta lista em que o retorno da IA é mais fácil de provar — e por isso o que mais justifica o investimento.",
    ],
    oQueMuda: [
      "Modelo de decisão aplicado ao fluxo operacional, com regra de segurança em volta",
      "Possibilidade de o operador humano sobrepor a decisão automática, sempre",
      "Registro de cada decisão automática para auditoria e ajuste",
      "Comparação contínua entre a decisão automática e a manual, com número",
      "Retorno controlado ao modo manual quando o modelo falha ou fica indisponível",
    ],
    ondeTravaCaro:
      "O item inegociável é o botão que devolve a decisão para o humano. Operação real tem exceção que nenhum modelo previu, e sistema que não permite sobrepor trava a operação inteira quando erra. Esse caminho de escape é barato de construir antes e caríssimo de improvisar no meio de um incidente.",
    faqs: [
      {
        q: "Preciso de muitos dados para usar IA na operação?",
        a: "Para modelo próprio de previsão, sim, e normalmente alguns meses de histórico. Para tarefas de classificação e extração, modelos prontos funcionam desde o primeiro dia. Vale começar por onde não depende de histórico enquanto o dado se acumula.",
      },
      {
        q: "E se a IA tomar uma decisão errada na operação?",
        a: "Precisa haver limite do que ela pode decidir sozinha, sobreposição humana disponível e registro de tudo. Decisão de alto impacto deve exigir confirmação. O objetivo não é eliminar erro, é garantir que erro seja percebido e revertido rápido.",
      },
      {
        q: "Como provar que a IA melhorou a operação?",
        a: "Medindo o mesmo indicador antes e depois, e de preferência rodando os dois métodos em paralelo por um período. Sem essa comparação, sobra impressão — e impressão não sustenta a decisão de manter um custo recorrente.",
      },
      {
        q: "A equipe aceita decisão tomada por sistema?",
        a: "Aceita quando entende o critério e consegue discordar. Sistema que distribui trabalho sem explicar por quê gera resistência rápida, e a resistência aparece como gente contornando o sistema por fora. Mostrar o motivo da decisão na tela e permitir a sobreposição registrada custa pouco e é o que faz a adoção acontecer.",
      },
    ],
  },

  {
    tipoSlug: "app-completo",
    integracaoId: "erp-crm",
    slug: "com-integracao-erp",
    nomeCurto: "integração com ERP",
    h1: "Quanto custa um app completo integrado ao ERP?",
    title: "App Completo Integrado ao ERP: Quanto Custa em 2026",
    metaDesc: (faixa, acrescimo) =>
      `App completo integrado ao ERP custa ${faixa}, com cerca de ${acrescimo} de integração. Vários papéis gravando no ERP ao mesmo tempo — veja o que isso exige.`,
    intro: [
      "Integrar um sistema de vários papéis ao ERP é diferente de integrar um site. No site, a integração é quase sempre de leitura. Aqui, várias pessoas gravam ao mesmo tempo, de lugares diferentes, com permissões diferentes — e o ERP não foi feito esperando isso.",
      "O limite prático costuma ser o próprio ERP: número de chamadas por minuto, bloqueio de registro em uso, operação que não pode rodar em paralelo. A arquitetura precisa proteger o ERP do seu sistema, e não apenas conversar com ele.",
    ],
    oQueMuda: [
      "Fila de gravação, para o ERP receber em ritmo que aguenta",
      "Idempotência: a mesma operação reenviada não duplica registro",
      "Camada intermediária isolando o app das mudanças do ERP",
      "Registro completo de cada troca, para auditar divergência depois",
      "Modo degradado: a operação continua e sincroniza quando o ERP volta",
    ],
    ondeTravaCaro:
      "O modo degradado é o que decide se uma indisponibilidade do ERP para a empresa inteira. Operação com entregador em rua e cliente esperando não pode parar porque um sistema de retaguarda caiu. Construir isso significa aceitar trabalhar com dado temporariamente dessincronizado, e essa é uma decisão de negócio que precisa ser tomada de forma consciente.",
    faqs: [
      {
        q: "O ERP aguenta o volume de um app com muitos usuários?",
        a: "Muitas vezes não, e essa é a descoberta mais comum em homologação. Por isso a fila de gravação e o cache entram desde o início: eles existem para proteger o ERP. Levantar o limite de chamadas antes de desenhar a arquitetura evita retrabalho caro.",
      },
      {
        q: "Dá para a operação continuar se o ERP cair?",
        a: "Dá, com modo degradado: o sistema segue registrando e sincroniza depois. A contrapartida é conviver com dado temporariamente fora de sincronia, o que exige regra clara de conflito e aceite explícito de quem opera.",
      },
      {
        q: "Vale a pena substituir o ERP em vez de integrar?",
        a: "Quase nunca durante o projeto do app. Trocar ERP é um projeto próprio, longo e arriscado, e juntar os dois multiplica a chance de falhar. Se a troca estiver no horizonte, o caminho seguro é integrar por uma camada intermediária que sobreviva à troca.",
      },
    ],
  },

  {
    tipoSlug: "app-completo",
    integracaoId: "push-whatsapp",
    slug: "com-push-e-whatsapp",
    nomeCurto: "push e WhatsApp",
    h1: "Quanto custa um app completo com push e WhatsApp?",
    title: "App Completo com Push e WhatsApp: Quanto Custa em 2026",
    metaDesc: (faixa, acrescimo) =>
      `App completo com notificações custa ${faixa}, sendo cerca de ${acrescimo} delas. Com vários papéis, cada evento dispara mensagens diferentes — veja o custo.`,
    intro: [
      "Num sistema com vários papéis, notificação deixa de ser aviso e passa a ser o mecanismo que coordena a operação. Um pedido feito precisa avisar a loja, depois o entregador, depois o cliente. Um evento, três mensagens, três conteúdos, três momentos.",
      "É isso que torna este par mais caro que o mesmo recurso num app simples: a matriz de evento por papel cresce rápido, e cada célula tem canal, texto e urgência próprios. Sem uma camada central que organize isso, a regra de notificação se espalha pelo código e vira impossível de manter.",
    ],
    oQueMuda: [
      "Matriz de evento por papel, definindo quem é avisado, por qual canal e quando",
      "Camada única de notificação, em vez de disparo espalhado pelo código",
      "Escalonamento: se o entregador não responde em X minutos, avisa a operação",
      "WhatsApp com modelo aprovado por tipo de evento e por papel",
      "Registro de entrega e leitura, para resolver a disputa de quem foi avisado",
    ],
    ondeTravaCaro:
      "O escalonamento é o que separa um sistema que avisa de um sistema que garante. Pedido parado porque o entregador não viu a notificação precisa virar alerta para a operação humana depois de um tempo definido. Sem isso, o gargalo só aparece quando o cliente liga reclamando — e aí o prejuízo já aconteceu.",
    faqs: [
      {
        q: "Quanto custa o WhatsApp por mensagem?",
        a: "A cobrança é por conversa iniciada, com preço que varia por categoria e por país, e é paga direto à plataforma. Por isso vale reservar o WhatsApp para eventos em que o custo de não avisar é maior que o da mensagem, e usar push para o restante.",
      },
      {
        q: "Todos os papéis precisam de app próprio para receber notificação?",
        a: "Não. É comum o papel principal ter app e os demais usarem painel web com notificação do navegador ou WhatsApp. Isso reduz bastante o custo inicial sem prejudicar a operação, e permite lançar por partes.",
      },
      {
        q: "Como saber se a notificação chegou de verdade?",
        a: "Registrando entrega e leitura por mensagem. Em operação com várias pontas, a pergunta sobre quem foi avisado e quando aparece toda semana, normalmente em conflito entre duas partes. Sem registro, não há como responder — e a discussão sobra para você.",
      },
    ],
  },
];

export function getComboCusto(
  tipoSlug: string,
  comboSlug: string
): ComboCusto | undefined {
  return combosCusto.find(
    (c) => c.tipoSlug === tipoSlug && c.slug === comboSlug
  );
}

export function getCombosDoTipo(tipoSlug: string): ComboCusto[] {
  return combosCusto.filter((c) => c.tipoSlug === tipoSlug);
}
