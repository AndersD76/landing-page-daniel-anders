/**
 * Eixo "quanto custa" — entidade: TIPO DE PROJETO.
 *
 * Cada entrada tem conteúdo próprio. Nenhum texto aqui funciona se você trocar
 * o nome do tipo: se funcionar, a entrada está errada e precisa ser reescrita
 * ou removida do eixo.
 *
 * Preço nunca é escrito aqui. A faixa vem de calcularEstimativa(), sobre a
 * tabela de lib/calculadora.ts, e a data do carimbo vem de config.atualizadoEm.
 */

export interface FAQ {
  q: string;
  a: string;
}

export interface TipoCusto {
  slug: string;
  variante: "site" | "app";
  /** id do tipo dentro do config da calculadora */
  tipoId: string;
  /** volume representativo desta página — a faixa mostrada parte dele */
  volumeRef: string;
  nome: string;
  h1: string;
  title: string;
  /** recebe a faixa já calculada; descrição única por página, não template */
  metaDesc: (faixa: string) => string;
  intro: string[];
  oQueEntra: string[];
  oQueNaoEntra: string[];
  prazoTipico: string;
  quandoVale: string;
  quandoNaoVale: string;
  faqs: FAQ[];
}

export const tiposCusto: TipoCusto[] = [
  {
    slug: "landing-page",
    variante: "site",
    tipoId: "landing",
    volumeRef: "ate-5",
    nome: "Landing page",
    h1: "Quanto custa uma landing page em 2026?",
    title: "Quanto Custa uma Landing Page em 2026? Faixa Real e o Que Pesa",
    metaDesc: (faixa) =>
      `Landing page de conversão fica em ${faixa} no mercado freelancer brasileiro. Veja o que entra na conta, o que encarece e em quanto tempo fica pronta.`,
    intro: [
      "Landing page é a página mais barata de construir e a mais cara de errar. Ela tem um trabalho só: transformar quem clicou em contato. Não tem menu para explorar, não tem blog para ganhar tempo, não tem segunda chance. Por isso o custo não está no número de telas, e sim na quantidade de decisão que precisa caber em uma tela.",
      "O que faz o preço subir dentro da faixa não é o design. É quantas versões de oferta a página precisa suportar, se há teste A/B, e se o formulário conversa com alguma ferramenta do outro lado. Uma landing com formulário que cai no e-mail sai perto do piso. A mesma landing com roteamento por origem, CRM e disparo automático chega no teto.",
    ],
    oQueEntra: [
      "Uma página completa de conversão: hero, prova, objeções, oferta e formulário",
      "Formulário com validação real e proteção contra bot",
      "Integração com WhatsApp e notificação no envio",
      "SEO técnico básico: title, description, Open Graph e dados estruturados",
      "Medição de CTA visto e CTA clicado, não só o envio",
      "Deploy em produção com domínio e certificado configurados",
    ],
    oQueNaoEntra: [
      "Produção do texto de venda quando ainda não existe oferta definida",
      "Tráfego pago, criativos e gestão de campanha",
      "Sessão de fotos ou produção de vídeo",
    ],
    prazoTipico: "1 a 2 semanas, do briefing ao ar.",
    quandoVale:
      "Quando você já tem uma oferta definida e precisa medir se ela converte antes de investir em site inteiro. Landing page é o jeito mais barato de descobrir que a oferta não está de pé.",
    quandoNaoVale:
      "Quando a empresa ainda não decidiu o que vende, ou quando o objetivo real é aparecer no Google organicamente. Uma página só não sustenta SEO de cauda longa — nesse caso o dinheiro rende mais em site institucional com blog.",
    faqs: [
      {
        q: "Qual a diferença entre landing page e site de uma página?",
        a: "Site de uma página tenta cumprir várias funções ao mesmo tempo: apresentar a empresa, listar serviços e ainda captar. Landing page abre mão de tudo isso para cumprir uma só. Na prática isso muda a estrutura e o preço: a landing tem menos conteúdo e mais trabalho de argumentação e medição.",
      },
      {
        q: "Preciso de mais de uma landing page?",
        a: "Se você anuncia para públicos diferentes, sim. Cada público tem uma objeção principal distinta, e a mesma página raramente responde bem às duas. A partir da segunda versão o custo marginal cai bastante, porque a estrutura e a medição já estão prontas.",
      },
      {
        q: "A landing page sozinha aparece no Google?",
        a: "Para o nome da sua marca, sim. Para termos genéricos de busca, dificilmente. Ranquear organicamente exige volume de páginas úteis respondendo perguntas específicas, e isso é trabalho de site com conteúdo, não de landing isolada.",
      },
      {
        q: "Posso editar o texto depois sem chamar o desenvolvedor?",
        a: "Sim, se isso entrar no escopo desde o início. Deixar os textos editáveis por painel adiciona algumas horas ao projeto, mas costuma se pagar rápido para quem roda campanha e muda oferta com frequência.",
      },
    ],
  },

  {
    slug: "site-institucional",
    variante: "site",
    tipoId: "institucional",
    volumeRef: "6-10",
    nome: "Site institucional",
    h1: "Quanto custa um site institucional em 2026?",
    title: "Quanto Custa um Site Institucional em 2026? Preço e Escopo Real",
    metaDesc: (faixa) =>
      `Site institucional de 6 a 10 páginas custa ${faixa}. Veja o que compõe o valor, quanto pesa o blog e por que o número de páginas importa menos do que parece.`,
    intro: [
      "Site institucional é o tipo de projeto onde o cliente mais paga por coisa que não precisa e mais economiza no que traria retorno. O número de páginas, primeira pergunta de todo orçamento, é justamente o fator que menos mexe no preço: ir de cinco para dez páginas adiciona pouco, porque a estrutura já está feita.",
      "O que realmente move o valor é a existência de blog com arquitetura de SEO de verdade, área logada e formulários que conversam com sistemas internos. Um site bonito de cinco páginas sem blog sai perto do piso da faixa e não traz um cliente pelo Google. Um site de oito páginas com blog estruturado, dados estruturados e malha de links internos custa mais e trabalha sozinho por anos.",
    ],
    oQueEntra: [
      "Home, sobre, páginas de serviço, contato e política de privacidade",
      "Blog com categorias, páginas de post e malha de links internos",
      "Sitemap segmentado e robots configurados para indexação",
      "Dados estruturados de organização, breadcrumb e FAQ onde faz sentido",
      "Formulários com validação e notificação no envio",
      "Painel simples para publicar post sem depender de desenvolvedor",
    ],
    oQueNaoEntra: [
      "Redação contínua do blog depois da entrega",
      "Tradução para outros idiomas",
      "Migração de conteúdo de plataforma antiga com mais de 100 URLs",
    ],
    prazoTipico: "2 a 4 semanas para 6 a 10 páginas com blog.",
    quandoVale:
      "Quando a empresa quer ser encontrada por quem busca a solução e ainda não sabe o nome dela. O site institucional com blog é o único formato desta lista que gera demanda em vez de só receber.",
    quandoNaoVale:
      "Quando o negócio depende de catálogo com preço, estoque e checkout. Nesse caso o institucional vira remendo e a conversa certa é e-commerce.",
    faqs: [
      {
        q: "Quantas páginas meu site institucional precisa ter?",
        a: "Menos do que você imagina, no começo. Home, sobre, uma página por serviço que você realmente vende, contato e privacidade já cobrem a maioria dos casos. Páginas extras rendem mais quando nascem do blog, respondendo perguntas reais de quem busca, do que quando nascem do menu.",
      },
      {
        q: "Vale a pena ter blog no site?",
        a: "Vale quando existe alguém para alimentar. Blog abandonado não prejudica, mas também não devolve o investimento. Se não há quem escreva com alguma regularidade, é mais honesto tirar o blog do escopo e reduzir o custo do projeto.",
      },
      {
        q: "Dá para usar WordPress e ficar mais barato?",
        a: "O custo inicial pode ser menor, sim. O que costuma aparecer depois é o custo de manutenção: plugin que quebra em atualização, tema que trava customização e desempenho que cai conforme o site cresce. A escolha honesta depende de quem vai manter o site no ano seguinte.",
      },
      {
        q: "Quanto custa manter o site depois de pronto?",
        a: "Domínio fica em torno de R$ 40 por ano e a hospedagem moderna vai de R$ 0 a cerca de R$ 100 por mês para a maioria dos sites institucionais. Esses custos ficam em contas suas, no seu nome, sem intermediário.",
      },
    ],
  },

  {
    slug: "ecommerce",
    variante: "site",
    tipoId: "ecommerce",
    volumeRef: "11-20",
    nome: "E-commerce",
    h1: "Quanto custa criar um e-commerce em 2026?",
    title: "Quanto Custa um E-commerce em 2026? Preço Real e o Que Encarece",
    metaDesc: (faixa) =>
      `E-commerce sob medida custa ${faixa}. Entenda o que pesa no orçamento — checkout, antifraude, estoque e frete — e quando plataforma pronta sai melhor.`,
    intro: [
      "E-commerce é o único projeto desta lista onde um bug custa dinheiro na hora. Um checkout que falha em 3% das tentativas não gera um chamado de suporte: gera 3% de faturamento perdido, todo dia, silenciosamente. Por isso a faixa é mais larga e o piso é mais alto que o dos outros tipos.",
      "O que decide onde você cai dentro da faixa não é a quantidade de produtos. É quantos sistemas precisam concordar entre si. Loja com produto simples, um meio de pagamento e frete por tabela fica perto do piso. Loja com variação de grade, estoque vindo de ERP, múltiplas transportadoras e regra fiscal por estado vai ao teto — e a maior parte desse custo está em tratamento de erro, não em tela.",
    ],
    oQueEntra: [
      "Catálogo com categorias, busca e páginas de produto",
      "Carrinho e checkout com Pix e cartão, incluindo tratamento de recusa",
      "Painel de pedidos com status, busca e exportação",
      "Cálculo de frete e prazo na página de produto e no checkout",
      "Webhooks de pagamento com reprocessamento quando o provedor falha",
      "Relatório de vendas por período e por produto",
    ],
    oQueNaoEntra: [
      "Cadastro e fotografia do catálogo inicial de produtos",
      "Emissão fiscal (NF-e) sem um emissor já contratado",
      "Gestão de marketplace (Mercado Livre, Shopee) na primeira entrega",
    ],
    prazoTipico: "4 a 8 semanas, dependendo das integrações fiscais e de estoque.",
    quandoVale:
      "Quando a operação já vende e esbarra no limite da plataforma pronta: regra de preço que ela não faz, integração que não existe, ou taxa por transação que já pesa mais que o custo de um sistema próprio.",
    quandoNaoVale:
      "Quando ainda não há venda validada. Começar em plataforma pronta custa uma fração disso e responde primeiro a pergunta que importa: alguém compra? Sistema sob medida é resposta para problema de escala, não de validação.",
    faqs: [
      {
        q: "E-commerce próprio ou plataforma pronta como Shopify e Nuvemshop?",
        a: "Plataforma pronta ganha no início: custo baixo, no ar em dias, sem equipe técnica. Sistema próprio passa a fazer sentido quando a taxa por transação já supera o custo de manter o seu, ou quando a operação precisa de regra que a plataforma não permite. A conta vira quando o volume cresce, não antes.",
      },
      {
        q: "O que mais encarece um e-commerce?",
        a: "Integração com ERP para estoque e preço, que pode somar até 30% sobre a base, e regra fiscal. Depois vêm variação de produto com grade, múltiplas transportadoras e antifraude. Design costuma ser a menor parte da conta, ao contrário do que a maioria espera.",
      },
      {
        q: "As taxas de pagamento estão incluídas no preço do projeto?",
        a: "Não. Gateway e adquirente cobram por transação, direto de você, e variam por meio de pagamento e volume. O valor do projeto cobre a construção e a integração — as taxas ficam em contrato seu com o provedor, sem intermediário.",
      },
      {
        q: "Quanto tempo leva para colocar uma loja no ar?",
        a: "De 4 a 8 semanas para loja sob medida. O que estica o prazo quase sempre está fora do código: cadastro de produto, definição de regra fiscal e homologação com o provedor de pagamento. Vale começar esses três em paralelo ao desenvolvimento.",
      },
    ],
  },

  {
    slug: "app-mobile",
    variante: "app",
    tipoId: "mobile-simples",
    volumeRef: "ate-5",
    nome: "App mobile simples",
    h1: "Quanto custa desenvolver um app mobile simples em 2026?",
    title: "Quanto Custa um App Mobile em 2026? Faixa Real por Escopo",
    metaDesc: (faixa) =>
      `App mobile simples custa ${faixa}. Veja o que entra, quanto pesa publicar nas lojas e por que o número de telas explica menos do orçamento do que se imagina.`,
    intro: [
      "App mobile simples é o projeto onde mais se subestima o que acontece depois do código. Construir cinco telas é rápido. Publicar na App Store e no Google Play, passar pela revisão, lidar com conta de desenvolvedor, política de privacidade exigida pelas lojas e atualização obrigatória de SDK é o que consome o tempo que ninguém orça.",
      "Dentro da faixa, o que move o preço é se o app precisa funcionar offline, se tem login e se guarda dado do usuário. App de catálogo que só lê conteúdo fica no piso. App com cadastro, sincronização e notificação sobe rápido, porque cada um desses itens traz um caso de erro que precisa ser tratado na mão.",
    ],
    oQueEntra: [
      "App para Android e iOS a partir de uma base de código única",
      "Telas do fluxo principal com navegação e estados de erro",
      "Publicação nas duas lojas, incluindo ficha e material de listagem",
      "Política de privacidade e formulário de dados exigido pelas lojas",
      "Backend mínimo para o conteúdo do app, quando necessário",
      "Build de produção documentado para você conseguir publicar atualização",
    ],
    oQueNaoEntra: [
      "Contas de desenvolvedor Apple e Google, que são pagas e ficam no seu nome",
      "Design de ícone e identidade visual do zero",
      "Funcionalidade offline completa com sincronização de conflito",
    ],
    prazoTipico: "4 a 8 semanas, incluindo o tempo de revisão das lojas.",
    quandoVale:
      "Quando o uso é recorrente e depende de estar no bolso: agendamento, fidelidade, pedido recorrente. App só se paga quando a pessoa volta sozinha.",
    quandoNaoVale:
      "Quando a pessoa usaria uma vez por ano. Nesse caso o site responde melhor e não exige instalação. A pergunta que decide é simples: alguém instalaria isso para usar de novo mês que vem?",
    faqs: [
      {
        q: "Preciso de dois apps, um para Android e um para iPhone?",
        a: "Não necessariamente. Uma base de código única atende as duas lojas na maioria dos casos e é o padrão para app simples. Código nativo separado só se justifica quando o app depende de recurso pesado de câmera, sensor ou desempenho gráfico.",
      },
      {
        q: "Quanto custa manter o app publicado?",
        a: "A conta de desenvolvedor Apple custa cerca de US$ 99 por ano e a do Google Play tem taxa única de cerca de US$ 25. Além disso, as lojas exigem atualização periódica de versão de SDK, o que significa algumas horas de manutenção por ano mesmo sem mudar nada no app.",
      },
      {
        q: "Quanto tempo a loja demora para aprovar?",
        a: "Normalmente de 1 a 7 dias por envio. O que mais atrasa não é a fila: é reprovação por política de privacidade incompleta ou por funcionalidade que a Apple considera insuficiente para justificar um app. Vale prever pelo menos um ciclo de reenvio no cronograma.",
      },
      {
        q: "Dá para transformar meu site em app?",
        a: "Dá, empacotando o site em um app, e isso sai bem mais barato. Mas a Apple reprova apps que são apenas um site embrulhado sem funcionalidade própria. Se a ideia é só ter presença na loja, costuma ser melhor investir em site rápido e instalável do que brigar com a revisão.",
      },
    ],
  },

  {
    slug: "mvp-saas",
    variante: "app",
    tipoId: "mvp-saas",
    volumeRef: "6-12",
    nome: "MVP SaaS",
    h1: "Quanto custa desenvolver um MVP de SaaS em 2026?",
    title: "Quanto Custa um MVP de SaaS em 2026? Preço e o Que Cortar",
    metaDesc: (faixa) =>
      `MVP de SaaS custa ${faixa}. Veja o que precisa existir na v1, o que pode esperar e por que assinatura recorrente é a parte mais subestimada do orçamento.`,
    intro: [
      "MVP de SaaS tem um inimigo específico: a tentação de construir a versão completa. Quase todo orçamento que estoura começa com alguém dizendo que determinada funcionalidade é simples e pode entrar agora. O que define o custo aqui não é o que você constrói, é o que você consegue deixar de fora sem inviabilizar a cobrança.",
      "Dentro da faixa, o item mais subestimado é assinatura recorrente. Cobrar uma vez é fácil. Cobrar todo mês envolve trial, upgrade no meio do ciclo, downgrade, cartão recusado, tentativa de recobrança e cancelamento com acesso até o fim do período pago. Cada um desses é um caminho que precisa existir antes do primeiro cliente pagante, não depois.",
    ],
    oQueEntra: [
      "Cadastro, login e recuperação de senha",
      "O núcleo do produto: a funcionalidade pela qual o cliente paga",
      "Assinatura recorrente com trial, upgrade, downgrade e cancelamento",
      "Painel administrativo para ver contas, uso e cobrança",
      "Separação de dados por conta, para um cliente nunca ver o do outro",
      "Medição de ativação: quem se cadastrou, quem usou e quem pagou",
    ],
    oQueNaoEntra: [
      "App mobile nativo na primeira versão",
      "Integrações com ferramentas de terceiros fora do fluxo principal",
      "Relatórios avançados e exportação personalizada",
    ],
    prazoTipico: "6 a 10 semanas até o primeiro cliente pagante.",
    quandoVale:
      "Quando já existe gente pagando por uma solução manual e você quer transformar isso em produto. Planilha compartilhada com clientes reais é o melhor sinal de que um SaaS tem mercado.",
    quandoNaoVale:
      "Quando a hipótese ainda não foi testada com ninguém. Vender o serviço na mão por alguns meses custa quase nada e descobre coisas que nenhum MVP descobriria. Código é a forma mais cara de fazer uma pergunta.",
    faqs: [
      {
        q: "O que pode ficar de fora do MVP sem prejudicar o lançamento?",
        a: "Quase tudo que não está entre o cadastro e o pagamento. Relatório avançado, personalização visual, integração com ferramenta de terceiro e app mobile costumam esperar. O filtro é sempre o mesmo: o cliente consegue resolver o problema central e pagar sem isso?",
      },
      {
        q: "Por que a cobrança recorrente encarece tanto o projeto?",
        a: "Porque não é uma tela, é um conjunto de caminhos de erro. Cartão que recusa na renovação, cliente que sobe de plano no meio do mês, cancelamento com acesso até o fim do período pago, reembolso. Cada caminho desse precisa ser tratado, e são eles que geram suporte quando ficam de fora.",
      },
      {
        q: "O código do MVP serve quando o produto crescer?",
        a: "Serve se a arquitetura foi pensada para isso desde o início. MVP enxuto não é MVP mal feito: cortar escopo é saudável, cortar qualidade cobra juros. O que costuma exigir reescrita não é o volume de usuários, e sim decisão de modelagem de dados tomada com pressa.",
      },
      {
        q: "Quanto custa manter um SaaS rodando por mês?",
        a: "Para os primeiros clientes, a infraestrutura costuma ficar entre R$ 100 e R$ 400 por mês, somando banco, hospedagem e envio de e-mail. O provedor de pagamento cobra percentual por transação, direto de você. O custo que cresce antes da infraestrutura é o de suporte.",
      },
    ],
  },

  {
    slug: "app-completo",
    variante: "app",
    tipoId: "completo",
    volumeRef: "13-25",
    nome: "App completo com backend",
    h1: "Quanto custa um app completo com backend em 2026?",
    title: "Quanto Custa um App Completo com Backend em 2026? Preço Real",
    metaDesc: (faixa) =>
      `App completo com backend e painel admin custa ${faixa}. Marketplace, delivery, logística: veja o que compõe o valor e por que são três produtos, não um.`,
    intro: [
      "App completo com backend é onde quase todo orçamento amador erra por um motivo estrutural: o cliente pede um app e recebe a conta de três produtos. Marketplace tem o app de quem compra, o painel de quem vende e a operação de quem administra. Delivery tem cliente, entregador e restaurante. Cada lado tem regra própria, tela própria e caso de erro próprio.",
      "Por isso a faixa começa alta. E por isso o fator que mais move o preço não é o número de telas, é o número de papéis distintos no sistema. Somar um papel novo custa mais do que somar dez telas ao papel que já existe, porque papel novo traz permissão, notificação e fluxo de dinheiro próprios.",
    ],
    oQueEntra: [
      "App mobile para o papel principal, publicado nas duas lojas",
      "API própria com autenticação, permissão por papel e registro de operação",
      "Painel administrativo com gestão de usuários, pedidos e conteúdo",
      "Fluxo de dinheiro quando aplicável: cobrança, repasse e conciliação",
      "Notificação push e por WhatsApp nos eventos que importam",
      "Ambiente de homologação separado do de produção",
    ],
    oQueNaoEntra: [
      "App nativo separado por papel na primeira entrega",
      "Operação e suporte ao usuário final depois do lançamento",
      "Certificação de pagamento como facilitador, quando o modelo exigir",
    ],
    prazoTipico: "10 a 16 semanas para a primeira versão em produção.",
    quandoVale:
      "Quando o negócio já opera de forma manual ou improvisada e o gargalo é a coordenação entre as pontas. Sistema que substitui planilha e grupo de WhatsApp tem retorno mensurável desde o primeiro mês.",
    quandoNaoVale:
      "Quando ainda não existe nenhuma das pontas. Marketplace sem vendedor e sem comprador é o caso clássico de projeto caro que nunca sai do lugar. Vale começar atendendo um lado só, mesmo que na mão.",
    faqs: [
      {
        q: "Por que app com backend custa várias vezes mais que app simples?",
        a: "Porque você não está comprando um app, e sim três sistemas que precisam concordar: o app, a API e o painel. E porque dado que fica só no celular é simples, enquanto dado compartilhado entre pessoas traz permissão, concorrência e conflito. Essa é a parte cara, e ela não aparece em nenhuma tela.",
      },
      {
        q: "Dá para lançar por partes e diluir o investimento?",
        a: "Dá, e costuma ser o caminho mais seguro. O padrão que funciona é começar pelo painel administrativo com a operação rodando na mão, depois o app do papel principal, e só então os demais. Assim cada etapa já gera valor antes da seguinte existir.",
      },
      {
        q: "Como funciona o repasse de dinheiro num marketplace?",
        a: "Pela divisão automática no momento do pagamento, oferecida pelos provedores como funcionalidade de split. Isso evita que o dinheiro passe pela sua conta, o que traria obrigações regulatórias pesadas. A modelagem correta disso precisa ser decidida antes do desenvolvimento, não durante.",
      },
      {
        q: "Quanto custa manter um sistema desse porte?",
        a: "A infraestrutura costuma partir de R$ 300 a R$ 800 por mês no início e cresce com o uso. O custo maior é de evolução: sistema com vários papéis gera pedido de ajuste contínuo vindo de cada lado. Vale prever orçamento mensal de manutenção desde o começo.",
      },
    ],
  },
];

export function getTipoCusto(slug: string): TipoCusto | undefined {
  return tiposCusto.find((t) => t.slug === slug);
}
