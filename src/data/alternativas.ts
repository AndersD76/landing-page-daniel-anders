/**
 * Eixo COMPARAÇÃO — "alternativa a X".
 *
 * Regra que molda este eixo: nenhum preço de concorrente é publicado aqui.
 * Mensalidade de plataforma muda sem aviso, varia por plano e por país, e
 * publicar um número desatualizado seria inventar dado — exatamente o que
 * estas páginas não podem fazer.
 *
 * Em vez disso, o VISITANTE informa o que paga hoje e a página calcula o
 * ponto de virada contra a faixa real da calculadora. O número que aparece é
 * sempre verdadeiro porque metade dele vem de quem está lendo.
 *
 * O conteúdo qualitativo se limita ao que é estrutural e estável — modelo de
 * cobrança, propriedade do código, caminho de saída — não a funcionalidade de
 * versão, que muda a cada release.
 */

import type { FAQ } from "./custos-tipos";

export interface Alternativa {
  slug: string;
  /** como a plataforma é chamada na busca */
  nome: string;
  categoria: string;
  h1: string;
  title: string;
  metaDesc: (faixa: string) => string;
  intro: string[];
  /** o que a plataforma genuinamente resolve — honestidade constrói confiança */
  ondeElaGanha: string[];
  /** limites estruturais, não de funcionalidade de versão */
  ondeTrava: string[];
  /** sinal concreto de que chegou a hora de trocar */
  sinalDeTroca: string;
  /** tipo de projeto da calculadora usado na comparação */
  projeto: { variante: "site" | "app"; tipoId: string; volumeId: string };
  /** rótulo do custo recorrente que o visitante vai informar */
  labelCustoAtual: string;
  faqs: FAQ[];
}

export const alternativas: Alternativa[] = [
  {
    slug: "wix",
    nome: "Wix",
    categoria: "construtor de sites",
    h1: "Alternativa ao Wix: quando sai mais barato ter o site próprio",
    title: "Alternativa ao Wix: Quando Vale Ter Site Próprio em 2026",
    metaDesc: (faixa) =>
      `Wix cobra todo mês, para sempre. Site próprio custa ${faixa} uma vez. Calcule em quantos meses a conta vira — com o valor que você paga hoje.`,
    intro: [
      "A conta do Wix não é a mensalidade: é a mensalidade multiplicada pelos anos que o site vai ficar no ar. Um site institucional dura de três a cinco anos antes de pedir redesenho. Multiplique sua mensalidade por quarenta e oito meses e você tem o número que realmente importa na comparação.",
      "Isso não torna o Wix uma má escolha. Torna ele uma escolha com prazo de validade: excelente para validar rápido e barato, caro quando o site vira ativo permanente do negócio.",
    ],
    ondeElaGanha: [
      "No ar em horas, sem ninguém técnico envolvido",
      "Custo inicial baixo, o que importa muito quando ainda não há faturamento",
      "Hospedagem, certificado e backup resolvidos sem você pensar neles",
      "Editor visual que qualquer pessoa da equipe consegue mexer",
    ],
    ondeTrava: [
      "O código não é seu: sair da plataforma significa refazer o site, não migrar",
      "Integração com sistema interno esbarra no que a plataforma permite, e isso não se negocia",
      "Desempenho e SEO técnico têm teto, porque você não controla o que é gerado",
      "A mensalidade não para enquanto o site existir, mesmo em ano sem nenhuma mudança",
    ],
    sinalDeTroca:
      "O sinal mais claro não é o preço: é você já ter pedido algo que a plataforma não faz. Quando o limite aparece uma vez, ele volta — e cada volta custa um contorno improvisado que ninguém documentou.",
    projeto: { variante: "site", tipoId: "institucional", volumeId: "6-10" },
    labelCustoAtual: "Quanto você paga de Wix por mês?",
    faqs: [
      {
        q: "Dá para migrar meu site do Wix para um site próprio?",
        a: "O conteúdo sim — textos, imagens e estrutura de páginas são aproveitados. O código não: o Wix gera o site por conta própria e não entrega algo portável. Na prática, migrar significa reconstruir com o conteúdo que já existe, o que é mais rápido que começar do zero mas não é uma exportação.",
      },
      {
        q: "Perco meu posicionamento no Google se trocar?",
        a: "Não, se a migração mantiver as URLs ou redirecionar cada uma para a equivalente nova. Perda de posição em migração quase sempre vem de URL que mudou sem redirecionamento. É trabalho conhecido e entra no escopo.",
      },
      {
        q: "E se eu quiser continuar editando o site sozinho?",
        a: "Isso entra no escopo como painel de edição de conteúdo. Adiciona horas ao projeto e costuma se pagar rápido para quem muda texto com frequência. Quem edita duas vezes por ano normalmente prefere economizar isso e pedir o ajuste.",
      },
      {
        q: "Quanto custa manter um site próprio depois de pronto?",
        a: "Domínio fica em torno de R$ 40 por ano e hospedagem moderna vai de R$ 0 a cerca de R$ 100 por mês para a maioria dos sites institucionais. Esses custos ficam em contas no seu nome, sem intermediário, e não sobem porque o site cresceu. É a diferença estrutural para a mensalidade de plataforma: aqui o valor acompanha o consumo real, não o plano contratado.",
      },
    ],
  },

  {
    slug: "wordpress",
    nome: "WordPress",
    categoria: "CMS",
    h1: "Alternativa ao WordPress: quando o custo de manutenção passa o de construir",
    title: "Alternativa ao WordPress: Quando Trocar Compensa em 2026",
    metaDesc: (faixa) =>
      `No WordPress o custo não está na licença, está na manutenção. Site sob medida custa ${faixa}. Calcule o ponto de virada com os seus números.`,
    intro: [
      "WordPress é gratuito, e é justamente aí que a conta engana. O custo real aparece depois: plugin que quebra na atualização, tema que trava a customização, desempenho que cai conforme o site cresce e a superfície de ataque que exige atenção constante. Nada disso aparece no orçamento inicial.",
      "A pergunta útil não é WordPress ou sob medida. É quantas horas por ano alguém gasta mantendo isso de pé — e se essas horas custam mais que construir algo que não precisa delas.",
    ],
    ondeElaGanha: [
      "Ecossistema gigante: para quase tudo existe um plugin pronto",
      "Muita gente no mercado sabe mexer, o que reduz dependência de um fornecedor só",
      "O conteúdo é seu e exportável de verdade, ao contrário de plataforma fechada",
      "Para blog puro, continua sendo uma escolha difícil de bater",
    ],
    ondeTrava: [
      "Cada plugin é código de terceiro rodando no seu site, com o risco que isso carrega",
      "Atualização de plugin e de versão é manutenção recorrente, não evento isolado",
      "Desempenho degrada conforme plugins se acumulam, e a causa é difícil de isolar",
      "Customização além do que o tema prevê costuma custar mais que construir do zero",
    ],
    sinalDeTroca:
      "O sinal é o site ter quebrado mais de uma vez sem ninguém ter mexido nele. Quando uma atualização automática derruba a página, o problema deixou de ser técnico e virou de risco operacional — e risco operacional tem custo mesmo nos meses em que nada acontece.",
    projeto: { variante: "site", tipoId: "institucional", volumeId: "6-10" },
    labelCustoAtual: "Quanto você gasta por mês com manutenção, plugins e hospedagem?",
    faqs: [
      {
        q: "WordPress é inseguro?",
        a: "O núcleo é maduro e bem mantido. O risco mora nos plugins e temas de terceiros, que são código que você não escreveu rodando no seu site, e em instalação desatualizada. Site com poucos plugins e atualização em dia é seguro; o problema é que, com o tempo, quase nenhum site fica assim.",
      },
      {
        q: "Meu site WordPress está lento. Trocar resolve?",
        a: "Não necessariamente, e vale medir antes de decidir. Boa parte da lentidão vem de imagem sem otimização, excesso de plugin e hospedagem compartilhada — todos corrigíveis sem trocar de tecnologia. Reconstruir se justifica quando a lentidão vem da arquitetura, não da configuração.",
      },
      {
        q: "Consigo manter o blog se sair do WordPress?",
        a: "Sim. O conteúdo do WordPress é exportável de verdade, inclusive com as URLs, o que permite migrar posts preservando o posicionamento já conquistado. É o cenário de migração mais tranquilo desta lista.",
      },
      {
        q: "Quantos plugins são plugins demais?",
        a: "Não existe número mágico, mas existe um sinal prático: quando ninguém da equipe sabe mais para que serve cada um, já passou. Cada plugin ativo é código de terceiro com acesso ao seu banco, que pode parar de ser mantido sem aviso. O risco não é a quantidade em si — é a quantidade que ninguém consegue justificar um por um.",
      },
    ],
  },

  {
    slug: "shopify",
    nome: "Shopify",
    categoria: "plataforma de e-commerce",
    h1: "Alternativa ao Shopify: quando a taxa por venda passa o custo da loja própria",
    title: "Alternativa ao Shopify: Quando Vale Loja Própria em 2026",
    metaDesc: (faixa) =>
      `No Shopify o custo cresce com o faturamento: mensalidade, apps e taxa por venda. Loja própria custa ${faixa}. Calcule o ponto de virada.`,
    intro: [
      "Plataforma de e-commerce tem um modelo de cobrança que trabalha contra você exatamente quando dá certo: o custo cresce com o faturamento. Mensalidade é a menor parte. Somam-se as assinaturas de apps — frete, avaliação, fidelidade, relatório — e o percentual sobre cada venda.",
      "Enquanto o volume é baixo, essa conta é um bom negócio: você paga pouco e não gerencia nada. Quando o volume cresce, o percentual vira o maior item de custo de tecnologia da operação — e ele não para de crescer.",
    ],
    ondeElaGanha: [
      "Loja no ar em dias, com checkout testado por milhões de transações",
      "Ecossistema de apps que resolve caso específico sem desenvolvimento",
      "Infraestrutura que aguenta pico de Black Friday sem você pensar nisso",
      "Conformidade de pagamento e antifraude já resolvidos",
    ],
    ondeTrava: [
      "Custo cresce com o faturamento, sem teto, para sempre",
      "Cada app é outra assinatura, e elas se acumulam mais rápido do que parece",
      "Regra de negócio fora do padrão esbarra no que a plataforma permite",
      "Checkout não é seu, o que limita o que dá para fazer no momento mais crítico da venda",
    ],
    sinalDeTroca:
      "A conta vira quando a soma de mensalidade, apps e percentual por venda ultrapassa o custo de manter uma loja própria. Antes disso, trocar é só gastar dinheiro para assumir um trabalho que alguém já fazia por você.",
    projeto: { variante: "site", tipoId: "ecommerce", volumeId: "11-20" },
    labelCustoAtual: "Quanto você paga por mês somando plano, apps e taxas?",
    faqs: [
      {
        q: "Perco as integrações que já uso se sair do Shopify?",
        a: "As que são apps da plataforma, sim — elas não existem fora dela. As que são serviços externos, como gateway de pagamento, ERP ou transportadora, continuam funcionando porque a integração é com o serviço, não com a loja. Vale mapear quais são de cada tipo antes de decidir.",
      },
      {
        q: "Loja própria aguenta pico de venda?",
        a: "Aguenta, com a arquitetura certa, mas isso passa a ser responsabilidade sua em vez de estar embutido. É um custo real a considerar: ou você contrata quem monitore, ou aceita o risco de um pico não planejado. Para quem tem sazonalidade forte, isso pesa na decisão.",
      },
      {
        q: "Dá para migrar o catálogo e o histórico de pedidos?",
        a: "Catálogo e clientes sim, por exportação. Histórico de pedidos costuma ser mantido em consulta na plataforma antiga por um período, em vez de migrado, porque o esforço de trazer tudo raramente se paga. A decisão depende de quanto o histórico é usado no dia a dia.",
      },
    ],
  },

  {
    slug: "agencia",
    nome: "agência",
    categoria: "modelo de contratação",
    h1: "Alternativa a agência: o que muda contratando quem vai escrever o código",
    title: "Alternativa a Agência de Desenvolvimento: O Que Muda em 2026",
    metaDesc: (faixa) =>
      `Em agência você fala com quem vende, não com quem constrói. Projeto direto custa ${faixa}. Veja o que muda e calcule o ponto de virada do retainer.`,
    intro: [
      "A diferença entre agência e desenvolvedor direto não é preço: é quantas pessoas existem entre o que você pede e o que é construído. Em agência você conversa com atendimento, que conversa com gerente de projeto, que conversa com quem escreve o código. Cada camada é um lugar onde a informação muda de forma.",
      "Isso não é defeito de agência — é o que permite a ela atender trinta clientes ao mesmo tempo. Mas tem um custo que não aparece na proposta: o tempo entre pedir um ajuste e vê-lo rodando.",
    ],
    ondeElaGanha: [
      "Equipe inteira: se alguém sai ou adoece, o projeto continua",
      "Design, redação, mídia e desenvolvimento sob o mesmo contrato",
      "Capacidade de tocar várias frentes ao mesmo tempo",
      "Estrutura formal de contrato e processo, que importa em empresa maior",
    ],
    ondeTrava: [
      "Você é um de muitos clientes, e a prioridade segue o tamanho da conta",
      "Camadas entre o pedido e a execução alongam qualquer ajuste pequeno",
      "Retainer mensal continua correndo nos meses em que nada é entregue",
      "Quem vende não é quem constrói, e o escopo combinado na venda nem sempre sobrevive ao desenvolvimento",
    ],
    sinalDeTroca:
      "O sinal é um ajuste de dez minutos levar duas semanas. Quando isso vira rotina, você não está pagando por capacidade — está pagando pela fila. E fila é o que mais custa em projeto que precisa de iteração.",
    projeto: { variante: "app", tipoId: "mvp-saas", volumeId: "13-25" },
    labelCustoAtual: "Qual o valor do retainer mensal que você paga hoje?",
    faqs: [
      {
        q: "E se você ficar doente ou sumir no meio do projeto?",
        a: "É o risco real de contratar alguém sozinho, e a resposta honesta é estrutural, não promessa: o código fica em repositório seu desde o primeiro dia, a documentação é escrita conforme o projeto anda, e a stack é mainstream justamente para que outro desenvolvedor consiga continuar. Você não fica refém de quem escreveu.",
      },
      {
        q: "Agência não entrega mais rápido por ter equipe maior?",
        a: "Em projeto grande com frentes paralelas, sim. Em projeto de escopo focado, costuma ser o contrário: coordenação entre pessoas consome mais tempo que o trabalho em si. A pergunta que decide é se o seu projeto tem frentes que realmente correm em paralelo.",
      },
      {
        q: "Quem faz o design?",
        a: "Para interface de sistema e site institucional, eu faço, e a decisão de design é tomada junto com a de código — o que costuma acelerar. Para identidade visual de marca do zero, o honesto é dizer que não é meu trabalho: isso vale contratar designer especializado, e eu implemento o que ele entregar.",
      },
    ],
  },

  {
    slug: "no-code",
    nome: "no-code",
    categoria: "plataforma no-code",
    h1: "Alternativa a no-code: quando a plataforma vira o gargalo",
    title: "Alternativa a No-Code: Quando Migrar para Código em 2026",
    metaDesc: (faixa) =>
      `No-code é ótimo para validar e caro para escalar: o custo sobe com o uso. Sistema próprio custa ${faixa}. Calcule quando a troca se paga.`,
    intro: [
      "No-code resolve de verdade o problema mais caro de um produto novo, que é descobrir se alguém quer aquilo. Construir em dias o que levaria meses é uma vantagem enorme enquanto a pergunta em jogo é se existe mercado.",
      "O problema aparece depois da resposta ser sim. Aí o custo passa a crescer com o uso, a performance passa a depender de escolhas que não são suas, e cada regra de negócio fora do padrão vira contorno. Produto que deu certo em no-code tende a virar refém da plataforma que o viabilizou.",
    ],
    ondeElaGanha: [
      "Do zero a algo funcionando em dias, sem equipe técnica",
      "Mudar a ideia custa quase nada, que é o que importa antes do product-market fit",
      "Infraestrutura, autenticação e banco resolvidos sem configuração",
      "Permite ao fundador não técnico construir sozinho a primeira versão",
    ],
    ondeTrava: [
      "Custo cresce com uso e com número de usuários, não com valor entregue",
      "Performance tem teto e você não controla o que está por baixo",
      "Exportar não é migrar: a lógica vive na plataforma, não em código portável",
      "Integração fora do catálogo da plataforma vira gambiarra com limite de requisição",
    ],
    sinalDeTroca:
      "O sinal é a conta da plataforma crescer mais rápido que a receita. Quando cada cliente novo custa mais do que traz, o modelo deixou de funcionar — e aí a migração não é preferência técnica, é sobrevivência de margem.",
    projeto: { variante: "app", tipoId: "mvp-saas", volumeId: "13-25" },
    labelCustoAtual: "Quanto você paga por mês na plataforma hoje?",
    faqs: [
      {
        q: "Dá para migrar de no-code sem parar o produto?",
        a: "Dá, e o caminho que funciona é por partes: o sistema novo assume um fluxo de cada vez enquanto a plataforma segue com o resto, até sobrar nada. Migração de uma vez só, com virada de chave, é onde os problemas aparecem todos no mesmo dia.",
      },
      {
        q: "Perco os dados dos clientes na migração?",
        a: "Não. Dado é a parte mais fácil: praticamente toda plataforma exporta, e o que estiver estruturado é importável. O que não migra é a lógica — telas, automações e regras precisam ser reconstruídas, e é aí que está o trabalho.",
      },
      {
        q: "Quando é cedo demais para sair do no-code?",
        a: "Enquanto você ainda estiver mudando o produto toda semana. Migrar congela decisões que ainda não deveriam estar congeladas, e sai caro refazer. O momento certo é quando o núcleo parou de mudar e o que incomoda passou a ser custo ou performance.",
      },
      {
        q: "Dá para manter parte em no-code e parte em código?",
        a: "Dá, e costuma ser o arranjo mais sensato por um bom tempo. O fluxo principal, que precisa de performance e margem, vai para código; painéis internos e automações de apoio seguem na plataforma, onde mudar é barato. Tratar a decisão como tudo ou nada é o que torna a migração mais arriscada do que precisa ser.",
      },
    ],
  },
];

export function getAlternativa(slug: string): Alternativa | undefined {
  return alternativas.find((a) => a.slug === slug);
}
