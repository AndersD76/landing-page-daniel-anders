/**
 * Eixo de SETOR (CNAE).
 *
 * O dado de mercado vem do CEMPRE/IBGE, carregado por scripts/carregar-cempre.mjs
 * para setores-cempre.json. O preço vem de calcularEstimativa(). Nada aqui é
 * digitado à mão exceto o conteúdo editorial — e o conteúdo editorial é
 * justamente o que precisa ser diferente por setor.
 *
 * Teste da entrada: troque "clínica" por "oficina" no texto. Se continuar
 * fazendo sentido, a entrada está errada. O que uma clínica precisa (prontuário,
 * confirmação de consulta, dado sensível de saúde) não é o que uma oficina
 * precisa (ordem de serviço, aprovação de orçamento, histórico por placa).
 */

import type { FAQ } from "./custos-tipos";

export interface SetorConteudo {
  slug: string;
  nome: string;
  /** como aparece no meio de uma frase, minúsculo */
  nomeFrase: string;
  h1: string;
  title: string;
  metaDesc: (empresas: string, faixa: string) => string;
  intro: string[];
  /** módulos que o sistema desse setor precisa ter — específicos */
  oQueOSistemaPrecisa: string[];
  /** a dor operacional concreta que o software resolve nesse setor */
  ondeODinheiroVaza: string;
  /** projeto de referência para a faixa de preço */
  projeto: {
    variante: "site" | "app";
    tipoId: string;
    volumeId: string;
    integracaoIds: string[];
    /** página do eixo de custo para onde este setor aponta */
    custoSlug: string[];
  };
  faqs: FAQ[];
}

export const setoresConteudo: SetorConteudo[] = [
  {
    slug: "clinicas-e-consultorios",
    nome: "Clínicas e consultórios",
    nomeFrase: "clínica",
    h1: "Sistema para clínicas e consultórios: o que precisa ter e quanto custa",
    title: "Sistema para Clínica: O Que Precisa Ter e Quanto Custa em 2026",
    metaDesc: (empresas, faixa) =>
      `São ${empresas} clínicas e consultórios no Brasil. Veja os módulos que um sistema do setor precisa ter, o que a LGPD exige de dado de saúde e a faixa de ${faixa}.`,
    intro: [
      "Sistema de clínica tem um indicador que decide o retorno do investimento antes de qualquer outro: a taxa de falta. Horário vago não é receita adiada, é receita perdida — o profissional ficou parado e aquele slot não volta. Toda a arquitetura do sistema deveria girar em torno de reduzir esse número.",
      "O segundo ponto que separa um sistema de clínica de um sistema genérico de agendamento é o dado. Prontuário é dado pessoal sensível na LGPD, com exigência de controle de acesso, registro de quem viu o quê e tratamento específico. Isso não é um detalhe de conformidade no fim do projeto: muda a modelagem desde o primeiro dia.",
    ],
    oQueOSistemaPrecisa: [
      "Agenda por profissional, com bloqueio de horário e encaixe",
      "Confirmação automática por WhatsApp com resposta que já desmarca ou confirma",
      "Prontuário eletrônico com registro de acesso — quem abriu, quando",
      "Fila de espera que oferece o horário liberado a quem estava aguardando",
      "Controle de convênio e particular, com valores diferentes por procedimento",
      "Lembrete de retorno e de exame periódico, que é receita recorrente parada",
    ],
    ondeODinheiroVaza:
      "A fila de espera automática é o módulo com melhor retorno e o mais esquecido. Quando alguém desmarca, o horário só é reaproveitado se a recepção ligar para a lista — o que quase nunca acontece em cima da hora. Um sistema que oferece o horário vago automaticamente a quem está esperando transforma cancelamento em atendimento, e isso aparece direto no faturamento do mês.",
    projeto: {
      variante: "app",
      tipoId: "mvp-saas",
      volumeId: "13-25",
      integracaoIds: ["push-whatsapp"],
      custoSlug: ["mvp-saas", "com-push-e-whatsapp"],
    },
    faqs: [
      {
        q: "Prontuário eletrônico precisa seguir alguma norma específica?",
        a: "Além da LGPD, que classifica dado de saúde como sensível, o Conselho Federal de Medicina tem resoluções sobre prontuário eletrônico e guarda de registro. Na prática isso exige controle de acesso por usuário, registro de quem consultou cada prontuário e política de retenção definida. Vale validar os requisitos com o conselho da categoria antes de fechar escopo.",
      },
      {
        q: "Vale integrar com o sistema do convênio?",
        a: "Depende do volume de atendimento por convênio. Se a maior parte do faturamento passa por convênio, a integração com o padrão de troca de informação em saúde reduz muito o retrabalho de digitação e glosa. Se o atendimento é majoritariamente particular, é escopo caro para pouco retorno na primeira versão.",
      },
      {
        q: "Confirmação por WhatsApp reduz falta de verdade?",
        a: "Reduz, e é o item que mais rapidamente se paga — desde que a mensagem permita desmarcar com uma resposta. Confirmação que só avisa e não abre caminho para cancelar não libera a agenda; ela apenas informa. O ganho vem de transformar a falta silenciosa em cancelamento com antecedência.",
      },
      {
        q: "Uso um sistema pronto de clínica ou mando fazer?",
        a: "Sistema pronto resolve bem a clínica com fluxo padrão, e é mais barato começar assim. Sistema sob medida passa a fazer sentido quando o procedimento tem regra própria que o pronto não acomoda, quando há integração com equipamento, ou quando a mensalidade por profissional já supera o custo de manter o seu.",
      },
    ],
  },

  {
    slug: "restaurantes-e-bares",
    nome: "Restaurantes e bares",
    nomeFrase: "restaurante",
    h1: "Sistema para restaurantes: delivery próprio, comanda e quanto custa",
    title: "Sistema para Restaurante: Delivery Próprio e Preço em 2026",
    metaDesc: (empresas, faixa) =>
      `São ${empresas} restaurantes e bares no Brasil. Veja quando delivery próprio supera a taxa do marketplace, o que o sistema precisa ter e a faixa de ${faixa}.`,
    intro: [
      "A conta que decide todo projeto de tecnologia em restaurante é a comissão do marketplace de delivery. Ela incide sobre o faturamento, não sobre o lucro, o que significa que em um setor de margem apertada ela consome uma fatia relevante do resultado. Um canal próprio não elimina o marketplace — ele existe para migrar o cliente recorrente, que é onde a comissão mais dói.",
      "O erro comum é achar que basta ter um cardápio online. Sem integração com a cozinha, o pedido do canal próprio vira alguém gritando na copa, e o serviço piora justamente no canal que deveria ser o melhor. O sistema só se paga quando o pedido entra na operação do mesmo jeito que o do marketplace.",
    ],
    oQueOSistemaPrecisa: [
      "Cardápio com preço por canal — salão, retirada e entrega têm custos diferentes",
      "Pedido do canal próprio caindo na mesma tela de produção do marketplace",
      "Comanda de mesa e controle de conta dividida",
      "Pagamento no checkout com Pix, que tem taxa muito menor que cartão",
      "Área de entrega com taxa por distância e tempo estimado honesto",
      "Cadastro de recompra: quem já pediu volta com um clique, sem repetir endereço",
    ],
    ondeODinheiroVaza:
      "O tempo estimado de entrega é o campo que mais afeta a recompra no canal próprio e o mais tratado como detalhe. Marketplace administra a expectativa do cliente com dado histórico; o canal próprio costuma chutar um número fixo. Quando o chute erra para menos, o cliente frustrado volta para o marketplace — e você paga comissão para reconquistar alguém que já era seu.",
    projeto: {
      variante: "app",
      tipoId: "completo",
      volumeId: "13-25",
      integracaoIds: ["pagamento"],
      custoSlug: ["app-completo", "com-pagamento-online"],
    },
    faqs: [
      {
        q: "Vale a pena ter delivery próprio ou só usar os aplicativos?",
        a: "Os dois, com papéis diferentes. O marketplace traz cliente novo e é caro manter cliente nele; o canal próprio é onde o cliente recorrente deve ficar. A conta vira quando a comissão que você paga por pedidos repetidos ultrapassa o custo de construir e operar o seu canal — e isso costuma acontecer antes do que se imagina.",
      },
      {
        q: "Como faço o cliente migrar do aplicativo para o meu canal?",
        a: "Com incentivo na embalagem e no próprio pedido: cupom para o próximo pedido no canal direto, preço melhor por não ter comissão, ou item exclusivo. O que não funciona é pedir que ele migre sem motivo — o aplicativo é mais conveniente por padrão, e conveniência só se vence com vantagem concreta.",
      },
      {
        q: "Preciso trocar meu sistema de PDV?",
        a: "Não necessariamente. O caminho mais barato é integrar o canal próprio ao PDV que já existe, desde que ele tenha API. Trocar o PDV durante um projeto de delivery multiplica o risco de parar a operação num horário de pico, e não é uma troca que precisa acontecer ao mesmo tempo.",
      },
      {
        q: "Quanto tempo leva para colocar o delivery próprio no ar?",
        a: "De 6 a 12 semanas para a versão com cardápio, pedido, pagamento e integração com a cozinha. O que costuma atrasar não é o código: é o cadastro do cardápio com foto e descrição, e a definição das áreas de entrega com taxa. Vale começar esses dois em paralelo ao desenvolvimento.",
      },
    ],
  },

  {
    slug: "transportadoras",
    nome: "Transportadoras",
    nomeFrase: "transportadora",
    h1: "Sistema para transportadoras: rastreamento, canhoto e quanto custa",
    title: "Sistema para Transportadora: Rastreamento e Preço em 2026",
    metaDesc: (empresas, faixa) =>
      `São ${empresas} transportadoras de carga no Brasil. Veja por que o comprovante de entrega digital paga o projeto sozinho e a faixa de ${faixa}.`,
    intro: [
      "Em transporte de carga, o documento que mais custa dinheiro é o comprovante de entrega em papel. Enquanto o canhoto assinado não volta para a matriz, a fatura não é emitida — e cada dia de atraso nesse retorno é um dia a mais de capital de giro preso. Digitalizar esse comprovante costuma pagar o projeto inteiro antes de qualquer ganho de eficiência.",
      "O segundo fator que define a arquitetura é a conexão. O motorista entrega em zona rural, galpão de concreto e subsolo, onde não há sinal. Sistema que exige internet no momento da entrega não é usado — o motorista volta para o papel e você fica com o pior dos dois mundos: pagou pelo sistema e continua esperando o canhoto.",
    ],
    oQueOSistemaPrecisa: [
      "Aplicativo do motorista funcionando offline, com fila de envio quando o sinal volta",
      "Comprovante de entrega digital com assinatura na tela, foto e geolocalização",
      "Romaneio de carga e roteiro do dia baixados antes de sair",
      "Ocorrência de entrega padronizada: recusa, ausência, avaria, endereço não localizado",
      "Rastreamento que o cliente final consulta sozinho, sem ligar para você",
      "Integração com o sistema fiscal para amarrar entrega ao documento de transporte",
    ],
    ondeODinheiroVaza:
      "A ocorrência padronizada é o que transforma o sistema em ferramenta de cobrança. Quando a recusa é registrada com foto, horário e posição, a discussão com o embarcador deixa de ser palavra contra palavra. Sem esse registro, o custo da viagem perdida quase sempre sobra para a transportadora, e esse prejuízo raramente entra na conta de retorno do projeto.",
    projeto: {
      variante: "app",
      tipoId: "completo",
      volumeId: "13-25",
      integracaoIds: ["erp-crm"],
      custoSlug: ["app-completo", "com-integracao-erp"],
    },
    faqs: [
      {
        q: "O aplicativo do motorista funciona sem internet?",
        a: "Precisa funcionar, e isso não é opcional em transporte. O roteiro é baixado antes da saída, as entregas são registradas no aparelho e a sincronização acontece quando o sinal volta. Aplicativo que trava sem rede é abandonado na primeira semana e a operação volta para o papel.",
      },
      {
        q: "Como fica a assinatura do canhoto digital? Tem validade?",
        a: "A assinatura na tela, somada a foto, horário e posição, forma um conjunto de evidências bem mais forte que o canhoto em papel. Para efeito fiscal, a regra de guarda do documento de transporte continua valendo e deve ser verificada com a contabilidade. Vale tratar o digital como comprovação da entrega, sem supor que ele dispensa a obrigação fiscal.",
      },
      {
        q: "Vale integrar com o ERP que já uso?",
        a: "Sim, e costuma ser obrigatório: o ERP é onde a fatura nasce. A integração leva a entrega confirmada de volta para liberar o faturamento e traz o romaneio para o aplicativo. Fazer o aplicativo sem essa ligação apenas move a digitação de lugar, em vez de eliminá-la.",
      },
      {
        q: "O cliente final consegue acompanhar a entrega?",
        a: "Com um link de consulta por documento ou pedido, sim, e isso reduz bastante o volume de ligações para o atendimento. É um dos módulos mais baratos de construir e um dos que mais aparecem na percepção de serviço do embarcador.",
      },
    ],
  },

  {
    slug: "imobiliarias",
    nome: "Imobiliárias",
    nomeFrase: "imobiliária",
    h1: "Sistema para imobiliárias: portais, visitas e quanto custa",
    title: "Sistema para Imobiliária: Integração com Portais e Preço 2026",
    metaDesc: (empresas, faixa) =>
      `São ${empresas} imobiliárias no Brasil. Veja por que o anúncio desatualizado nos portais custa caro, o que o sistema precisa ter e a faixa de ${faixa}.`,
    intro: [
      "O problema mais caro de uma imobiliária não é falta de site: é o mesmo imóvel anunciado com informação diferente em cada portal. O corretor atualiza o preço em um lugar, esquece do outro, e o cliente chega para a visita com uma expectativa que não existe mais. Isso queima o lead e o portal cobrou por ele de qualquer jeito.",
      "Por isso o sistema de imobiliária é, antes de tudo, um problema de sincronização. O cadastro precisa ter um dono único, e todos os canais — site próprio, portais, redes — precisam beber dessa mesma fonte. Site bonito com cadastro duplicado resolve aparência e mantém o prejuízo.",
    ],
    oQueOSistemaPrecisa: [
      "Cadastro único de imóvel alimentando site próprio e portais, sem redigitação",
      "Agendamento de visita com confirmação e aviso ao proprietário",
      "Funil por imóvel e por corretor, com origem do lead preservada",
      "Controle de exclusividade e de comissão por captação e por venda",
      "Documentos do imóvel em um lugar só, com validade e alerta de vencimento",
      "Portal do proprietário: ele vê as visitas do imóvel dele sem ligar para você",
    ],
    ondeODinheiroVaza:
      "O portal do proprietário é o módulo que menos aparece em orçamento e mais reduz atrito. Boa parte do tempo do corretor vai em responder proprietário perguntando se houve visita e por que não fechou. Dar a ele uma tela com o histórico devolve horas de trabalho comercial por semana e, na prática, segura a exclusividade por mais tempo.",
    projeto: {
      variante: "app",
      tipoId: "mvp-saas",
      volumeId: "13-25",
      integracaoIds: ["erp-crm"],
      custoSlug: ["mvp-saas", "com-integracao-erp"],
    },
    faqs: [
      {
        q: "Dá para integrar com os portais imobiliários?",
        a: "Na maioria dos casos sim, porque os portais aceitam receber um arquivo padronizado de imóveis ou têm integração própria. O esforço muda conforme o portal e o formato exigido. O ganho é sempre o mesmo: um cadastro, vários canais, sem divergência de preço e foto.",
      },
      {
        q: "Vale ter site próprio se já anuncio nos portais?",
        a: "Vale, por dois motivos. O lead do site próprio não tem custo por contato e chega com a sua marca, não a do portal. E o site é o único canal onde você controla a apresentação e consegue conteúdo que ranqueia por bairro e por tipo de imóvel, que é onde a busca realmente acontece.",
      },
      {
        q: "Como controlar comissão entre captador e vendedor?",
        a: "Com a regra de divisão registrada no próprio negócio, no momento em que ele é criado, e não combinada depois. Essa é uma das maiores fontes de atrito interno em imobiliária, e um sistema que grava o combinado no início resolve a discussão antes dela existir.",
      },
      {
        q: "O sistema substitui o CRM que uso hoje?",
        a: "Pode substituir ou conversar com ele. Se o CRM atual atende o comercial e o problema está no cadastro de imóvel e na sincronização com portais, integrar sai mais barato e menos arriscado do que migrar toda a base de contatos e histórico.",
      },
    ],
  },

  {
    slug: "escritorios-de-advocacia",
    nome: "Escritórios de advocacia",
    nomeFrase: "escritório de advocacia",
    h1: "Sistema para escritórios de advocacia: prazos, processos e custo",
    title: "Sistema para Advocacia: Controle de Prazo e Preço em 2026",
    metaDesc: (empresas, faixa) =>
      `São ${empresas} escritórios de advocacia no Brasil. Veja por que o controle de prazo define o sistema, o que ele precisa ter e a faixa de ${faixa}.`,
    intro: [
      "Em escritório de advocacia existe um evento que nenhum outro setor desta lista tem: o prazo perdido. Ele não gera um cliente insatisfeito, gera dano ao cliente, responsabilidade profissional e, em muitos casos, indenização. Por isso o sistema de um escritório é, antes de qualquer coisa, um sistema de prazo — todo o resto é acessório.",
      "Isso muda o critério de qualidade. Num CRM comum, uma notificação perdida é um incômodo. Aqui, ela precisa de redundância: mais de um canal, mais de um responsável e escalonamento automático quando ninguém reconhece o aviso. Um sistema que apenas mostra uma lista de prazos na tela não resolve o problema que motivou a compra.",
    ],
    oQueOSistemaPrecisa: [
      "Controle de prazo com responsável, redundância de aviso e escalonamento",
      "Andamento processual acompanhado por processo e por cliente",
      "Registro de horas por tarefa, base do honorário e da avaliação de rentabilidade",
      "Documentos e peças versionados, com histórico de quem alterou",
      "Portal do cliente para consultar o andamento sem ocupar o advogado",
      "Controle de honorário: contratual, êxito e reembolso de custas",
    ],
    ondeODinheiroVaza:
      "O registro de horas é o módulo que os sócios mais resistem a adotar e o que mais muda a decisão comercial. Sem ele, ninguém sabe quais causas dão prejuízo — e escritório costuma ter um punhado de clientes antigos consumindo muito mais tempo do que o honorário paga. O sistema só entrega esse diagnóstico se o apontamento for simples o bastante para acontecer no dia, não no fim do mês.",
    projeto: {
      variante: "app",
      tipoId: "mvp-saas",
      volumeId: "13-25",
      integracaoIds: ["push-whatsapp"],
      custoSlug: ["mvp-saas", "com-push-e-whatsapp"],
    },
    faqs: [
      {
        q: "O sistema consegue puxar andamento dos tribunais automaticamente?",
        a: "Existem serviços especializados que fazem esse acompanhamento e podem ser integrados. Construir essa captura do zero raramente compensa, porque cada tribunal tem seu comportamento e isso muda com frequência. O caminho usual é contratar o acompanhamento e integrar o resultado ao seu sistema.",
      },
      {
        q: "Como garantir que um prazo não seja perdido?",
        a: "Com redundância, não com uma notificação. O padrão que funciona é responsável principal e secundário, aviso em mais de um canal, e escalonamento automático para o sócio quando ninguém confirma a ciência. Lista na tela depende de alguém abrir a tela, e é exatamente isso que falha num dia atípico.",
      },
      {
        q: "Portal do cliente vale a pena num escritório pequeno?",
        a: "Vale quando o volume de ligações pedindo atualização já consome tempo relevante de advogado. Em escritório pequeno, costuma ser mais barato começar com um resumo automático periódico por e-mail do que construir um portal completo — e isso já reduz boa parte das ligações.",
      },
      {
        q: "Dado de cliente em sistema próprio é seguro do ponto de vista do sigilo?",
        a: "Pode ser, e frequentemente é mais seguro que a alternativa atual, que costuma ser pasta compartilhada e WhatsApp pessoal. O que o sistema precisa ter: acesso por usuário, registro de quem abriu cada documento, cifragem em repouso e política clara de quem enxerga o quê dentro do próprio escritório.",
      },
    ],
  },

  {
    slug: "escritorios-de-contabilidade",
    nome: "Escritórios de contabilidade",
    nomeFrase: "escritório de contabilidade",
    h1: "Sistema para escritórios de contabilidade: portal do cliente e custo",
    title: "Sistema para Contabilidade: Portal do Cliente e Preço 2026",
    metaDesc: (empresas, faixa) =>
      `São ${empresas} escritórios de contabilidade no Brasil. Veja por que o WhatsApp como canal de documento custa caro e a faixa de ${faixa}.`,
    intro: [
      "O gargalo de um escritório de contabilidade quase nunca é a apuração: é a coleta. O cliente manda a nota por WhatsApp, em foto tremida, fora de prazo, misturada com conversa pessoal. Alguém do escritório precisa garimpar, renomear e arquivar antes que o trabalho contábil comece — e esse tempo não é faturado.",
      "Um sistema de contabilidade que não ataca a coleta apenas organiza melhor o que já chegou. O retorno aparece quando o documento entra classificado, com prazo visível para o cliente e com cobrança automática de quem está devendo. É a diferença entre reduzir o trabalho e apenas transferi-lo de tela.",
    ],
    oQueOSistemaPrecisa: [
      "Portal onde o cliente sobe documento por competência, não por conversa",
      "Lista de pendências visível para o cliente, com prazo e consequência",
      "Cobrança automática de documento faltante, escalonando conforme o prazo aperta",
      "Calendário de obrigações por regime tributário e por cliente",
      "Entrega de guias e relatórios com aviso e confirmação de leitura",
      "Registro de quem pediu o quê e quando — fim da discussão sobre o que foi enviado",
    ],
    ondeODinheiroVaza:
      "A confirmação de leitura na entrega da guia parece burocracia e resolve o conflito mais comum do setor. Cliente que paga imposto em atraso costuma afirmar que não recebeu a guia, e sem registro a discussão sobra para o escritório, às vezes com pedido de ressarcimento da multa. O registro de envio e leitura encerra esse assunto antes dele virar perda de cliente.",
    projeto: {
      variante: "app",
      tipoId: "mvp-saas",
      volumeId: "13-25",
      integracaoIds: ["erp-crm"],
      custoSlug: ["mvp-saas", "com-integracao-erp"],
    },
    faqs: [
      {
        q: "Integra com o sistema contábil que já uso?",
        a: "Depende da API do sistema contábil, e isso varia bastante entre fornecedores. Quando existe, o portal alimenta o contábil direto. Quando não existe, o ganho ainda é grande: a coleta organizada já elimina a maior parte do retrabalho, mesmo com lançamento manual do outro lado.",
      },
      {
        q: "Meu cliente vai mesmo usar o portal em vez do WhatsApp?",
        a: "Usa quando o portal é mais fácil que o WhatsApp, não quando é obrigatório. Na prática, funciona ter envio por link direto, sem senha longa, e manter o WhatsApp como porta de entrada que joga o arquivo no portal automaticamente. Impor a troca sem reduzir o atrito costuma fracassar.",
      },
      {
        q: "Vale a pena construir em vez de assinar um sistema pronto?",
        a: "Sistema pronto atende bem o escritório com fluxo padrão e é mais barato começar por ele. Sob medida passa a valer quando o escritório tem um nicho com regra própria, quando a mensalidade por cliente já pesa muito no custo, ou quando o portal é parte do diferencial comercial.",
      },
      {
        q: "Como fica a responsabilidade sobre o documento enviado?",
        a: "O sistema deve registrar data, hora e quem enviou cada arquivo, e manter isso imutável. Esse registro é o que protege o escritório quando surge divergência sobre prazo, e é também exigência prática para atender pedido de titular de dado sob a LGPD.",
      },
    ],
  },

  {
    slug: "empresas-de-engenharia",
    nome: "Empresas de engenharia",
    nomeFrase: "empresa de engenharia",
    h1: "Sistema para empresas de engenharia: medição de obra e quanto custa",
    title: "Sistema para Engenharia: Medição de Obra e Preço em 2026",
    metaDesc: (empresas, faixa) =>
      `São ${empresas} empresas de serviços de engenharia no Brasil. Veja por que a medição em planilha atrasa o recebimento e a faixa de ${faixa}.`,
    intro: [
      "Em engenharia, o sistema não é sobre gestão de projeto: é sobre medição. A medição é o documento que autoriza o pagamento da etapa, e enquanto ela não é aprovada, a obra consumiu custo e não gerou receita. Encurtar o ciclo entre executar e receber é o retorno concreto do projeto.",
      "O que torna esse setor diferente é onde o dado nasce. Ele nasce no canteiro, onde há poeira, capacete, sinal ruim e ninguém vai abrir uma planilha. Se o registro depender de alguém transcrever anotação de caderno à noite, o sistema vai ter dado atrasado e errado — e medição com dado duvidoso é medição contestada.",
    ],
    oQueOSistemaPrecisa: [
      "Registro de avanço no canteiro, pelo celular, funcionando offline",
      "Diário de obra com foto datada e posicionada, que vira anexo da medição",
      "Boletim de medição gerado do avanço registrado, não digitado de novo",
      "Aprovação da etapa pelo cliente com trilha de quem aprovou e quando",
      "Comparativo entre previsto e realizado por etapa, com desvio visível cedo",
      "Controle de aditivo e de serviço extra, vinculado à autorização que o originou",
    ],
    ondeODinheiroVaza:
      "O serviço extra sem autorização registrada é o buraco clássico do setor. A obra executa porque o cliente pediu em campo, e na hora de cobrar não existe documento. Um sistema que exige registro da solicitação com identificação de quem pediu, antes da execução, converte essa perda recorrente em faturamento — e costuma ser o módulo que sozinho justifica o investimento.",
    projeto: {
      variante: "app",
      tipoId: "completo",
      volumeId: "13-25",
      integracaoIds: ["erp-crm"],
      custoSlug: ["app-completo", "com-integracao-erp"],
    },
    faqs: [
      {
        q: "O app de campo funciona sem internet no canteiro?",
        a: "Precisa funcionar. Obra em subsolo, área rural ou estrutura metálica não tem sinal confiável. O registro fica no aparelho e sobe quando a conexão volta, com regra definida para o caso de duas pessoas registrarem a mesma etapa.",
      },
      {
        q: "Dá para integrar com o software de orçamento que já usamos?",
        a: "Em geral sim, pelo menos por importação da planilha orçamentária que serve de base para as etapas. Isso evita recadastrar a estrutura da obra e mantém a medição amarrada ao orçamento aprovado, que é o que o cliente compara.",
      },
      {
        q: "O cliente da obra precisa acessar o sistema?",
        a: "Não precisa, mas ajuda muito. Quando o contratante aprova a medição dentro do sistema, a trilha fica registrada e a discussão sobre o que foi aprovado desaparece. Quando ele não quer acessar, o caminho é gerar o boletim com os anexos e registrar o aceite por e-mail.",
      },
      {
        q: "Quanto tempo leva para implantar num canteiro em andamento?",
        a: "Entre 8 e 14 semanas para a primeira versão útil, mas a adoção em obra já iniciada é mais difícil que o desenvolvimento. O caminho que funciona é entrar em uma obra nova ou em uma etapa nova, com a equipe treinada antes, em vez de trocar o processo no meio da execução.",
      },
    ],
  },

  {
    slug: "oficinas-mecanicas",
    nome: "Oficinas mecânicas",
    nomeFrase: "oficina",
    h1: "Sistema para oficinas mecânicas: ordem de serviço e quanto custa",
    title: "Sistema para Oficina Mecânica: Ordem de Serviço e Preço 2026",
    metaDesc: (empresas, faixa) =>
      `São ${empresas} oficinas de manutenção de veículos no Brasil. Veja por que a aprovação de orçamento por telefone custa caro e a faixa de ${faixa}.`,
    intro: [
      "O momento mais caro de uma oficina é a aprovação do orçamento. O carro está desmontado, o cliente não atende, e o elevador fica ocupado por um serviço que ninguém autorizou. Cada hora parada nesse limbo é hora que não pode ser vendida para outro veículo.",
      "A solução não é ligar mais: é mudar o formato da aprovação. Orçamento enviado com foto do problema, item a item, aprovável pelo celular e com registro do aceite, encurta essa espera de horas para minutos. E, como efeito colateral, aumenta o ticket — cliente que vê a peça gasta aprova mais do que cliente que só ouve um valor pelo telefone.",
    ],
    oQueOSistemaPrecisa: [
      "Ordem de serviço com checklist de entrada e registro fotográfico do estado do veículo",
      "Orçamento item a item, com foto, aprovável pelo celular e com aceite registrado",
      "Histórico por placa: o que já foi feito, quando e com qual peça",
      "Controle de peça aplicada, com custo e margem por serviço",
      "Aviso automático de revisão e de troca por quilometragem ou por tempo",
      "Controle de garantia do serviço, para separar retorno legítimo de serviço novo",
    ],
    ondeODinheiroVaza:
      "O checklist fotográfico de entrada é o módulo mais barato e o que mais evita prejuízo. Risco no para-choque, retrovisor trincado e som que sumiu são acusações comuns e difíceis de contestar sem registro. Fotografar o veículo na entrada, com data e hora, encerra a discussão antes dela começar — e vale tanto para a oficina quanto para o cliente honesto.",
    projeto: {
      variante: "app",
      tipoId: "mvp-saas",
      volumeId: "6-12",
      integracaoIds: ["push-whatsapp"],
      custoSlug: ["mvp-saas", "com-push-e-whatsapp"],
    },
    faqs: [
      {
        q: "A aprovação de orçamento pelo celular tem validade?",
        a: "O aceite registrado com identificação, data e hora é uma evidência bem mais forte que a aprovação por telefone, que não deixa rastro nenhum. Para serviço de valor alto, vale somar o envio do orçamento por um canal que comprove entrega, como e-mail, além da aprovação no sistema.",
      },
      {
        q: "Consigo controlar estoque de peças no mesmo sistema?",
        a: "Consegue, e costuma valer a pena porque o custo da peça define a margem do serviço. Para oficina pequena, um controle simples de entrada e saída já resolve. Controle completo com cotação de fornecedor e reposição automática é escopo maior e raramente precisa entrar na primeira versão.",
      },
      {
        q: "O aviso automático de revisão traz cliente de volta?",
        a: "Traz, e é a receita mais barata que a oficina tem, porque o cliente já existe e já confia. O cuidado é o intervalo: aviso cedo demais vira incômodo, tarde demais chega depois que ele já foi em outro lugar. Basear na quilometragem registrada na última visita funciona melhor que um intervalo fixo.",
      },
      {
        q: "Vale sistema próprio ou uso um pronto de oficina?",
        a: "Sistema pronto cobre bem a oficina de fluxo comum e é o começo mais barato. Sob medida passa a valer quando há especialização que o pronto não acomoda, como frota, veículo pesado ou convênio com seguradora, cada um com regra própria de aprovação e faturamento.",
      },
    ],
  },

  {
    slug: "academias",
    nome: "Academias",
    nomeFrase: "academia",
    h1: "Sistema para academias: recorrência, acesso e quanto custa",
    title: "Sistema para Academia: Cobrança Recorrente e Preço em 2026",
    metaDesc: (empresas, faixa) =>
      `São ${empresas} empresas de condicionamento físico no Brasil. Veja por que o cancelamento começa na frequência, não no financeiro, e a faixa de ${faixa}.`,
    intro: [
      "Academia é um negócio de recorrência, e em recorrência o indicador que decide o resultado não é quanta gente entra: é quanta gente sai. O detalhe que muda o projeto é que o cancelamento não começa no financeiro — começa na frequência. Aluno que parou de vir já cancelou; ele só ainda não avisou.",
      "Por isso o sistema mais útil para uma academia não é o que cobra melhor, é o que enxerga a queda de frequência a tempo de agir. Isso exige ligar o controle de acesso ao financeiro e ao contato, três coisas que costumam viver em sistemas separados e nunca conversam.",
    ],
    oQueOSistemaPrecisa: [
      "Cobrança recorrente com recobrança automática antes de suspender o acesso",
      "Controle de acesso na entrada ligado à situação financeira, em tempo real",
      "Alerta de queda de frequência, com lista de quem está sumindo esta semana",
      "Agendamento de aula com limite de vaga e lista de espera",
      "Ficha de treino acessível no celular do aluno, atualizada pelo professor",
      "Contrato com fidelidade, carência e regra de cancelamento aplicadas pelo sistema",
    ],
    ondeODinheiroVaza:
      "A recobrança automática é o item que mais devolve dinheiro e o mais cortado do escopo inicial. Uma fatia relevante do cancelamento em academia não é decisão do aluno: é cartão que falhou na renovação e ninguém avisou. Tentativas escalonadas, aviso antes do bloqueio e atualização fácil do cartão recuperam matrícula que estava sendo perdida por falha técnica, não por insatisfação.",
    projeto: {
      variante: "app",
      tipoId: "mvp-saas",
      volumeId: "13-25",
      integracaoIds: ["pagamento"],
      custoSlug: ["mvp-saas", "com-pagamento-online"],
    },
    faqs: [
      {
        q: "O sistema integra com catraca e controle de acesso?",
        a: "Integra, e é justamente essa ligação que dá valor ao resto. A catraca informa quem entrou, o que alimenta o alerta de frequência, e o financeiro define quem pode entrar. Separar esses dois sistemas é o que impede a academia de agir antes do cancelamento.",
      },
      {
        q: "Cobro no cartão recorrente ou por Pix e boleto?",
        a: "Cartão recorrente é o que sustenta renovação automática e reduz inadimplência, e por isso costuma ser a base. Pix e boleto atendem quem não tem ou não quer usar cartão, com a contrapartida de exigir ação do aluno a cada ciclo. O usual é oferecer os dois com preço diferente.",
      },
      {
        q: "Aplicativo para o aluno vale a pena?",
        a: "Vale quando ele tem função no dia a dia, como reservar aula, ver o treino e acompanhar frequência. Aplicativo que só mostra boleto não é aberto e não se paga. Em academia pequena, começar por uma área no navegador costuma entregar o mesmo valor por bem menos.",
      },
      {
        q: "Como o sistema ajuda a reduzir cancelamento?",
        a: "De duas formas mensuráveis: recuperando cobrança que falhou e apontando queda de frequência cedo, enquanto ainda dá para chamar o aluno. A segunda depende de alguém agir sobre a lista — o sistema mostra quem está saindo, mas a retenção continua sendo trabalho humano.",
      },
    ],
  },

  {
    slug: "saloes-de-beleza",
    nome: "Salões de beleza",
    nomeFrase: "salão",
    h1: "Sistema para salões de beleza: agenda, comissão e quanto custa",
    title: "Sistema para Salão de Beleza: Agenda e Comissão — Preço 2026",
    metaDesc: (empresas, faixa) =>
      `São ${empresas} salões e serviços de beleza no Brasil. Veja por que a comissão calculada na mão custa caro e a faixa de ${faixa}.`,
    intro: [
      "Salão tem uma particularidade que muda todo o desenho do sistema: o profissional costuma não ser empregado no sentido tradicional, e o faturamento é dividido. Isso faz do cálculo de comissão o centro do sistema, não um relatório secundário — e é justamente onde quase todo salão ainda usa papel ou planilha no fim do mês.",
      "O segundo ponto é a agenda, que aqui não é do salão: é de cada profissional, com duração diferente por serviço e por pessoa. Uma escova em um profissional leva metade do tempo de outro. Sistema que trata todos os horários como blocos iguais gera encaixe errado, atraso em cadeia e cliente esperando na recepção.",
    ],
    oQueOSistemaPrecisa: [
      "Agenda por profissional, com duração do serviço variando por pessoa",
      "Comissão calculada automaticamente por serviço, produto e profissional",
      "Agendamento online pelo cliente, com confirmação e política de remarcação",
      "Comanda que soma serviço e produto vendido no atendimento",
      "Pacote e sessão contratada, com saldo visível para cliente e profissional",
      "Controle de produto usado no atendimento, separado do produto vendido",
    ],
    ondeODinheiroVaza:
      "O produto consumido no atendimento é o custo que some. Tinta, condicionador e material descartável saem do estoque sem virar linha em lugar nenhum, e no fim do mês a margem do serviço não fecha com o que o caixa mostra. Registrar o consumo no momento da comanda é chato e é exatamente o que transforma faturamento aparente em margem real.",
    projeto: {
      variante: "app",
      tipoId: "mobile-simples",
      volumeId: "6-12",
      integracaoIds: ["push-whatsapp"],
      custoSlug: ["app-mobile", "com-push-e-whatsapp"],
    },
    faqs: [
      {
        q: "O cliente consegue agendar sozinho pelo celular?",
        a: "Consegue, e isso reduz bastante o tempo de recepção no telefone. O cuidado é não abrir a agenda inteira: reservar parte dos horários para encaixe e para cliente fiel evita que a agenda online preencha justamente os melhores blocos com serviços de ticket baixo.",
      },
      {
        q: "Como o sistema calcula comissão de profissional que trabalha por porcentagem?",
        a: "Pela regra cadastrada por profissional e por tipo de item, já que serviço e produto costumam ter percentuais diferentes. O cálculo acontece no fechamento da comanda, não no fim do mês, o que elimina a conferência manual e a discussão sobre o que foi atendido por quem.",
      },
      {
        q: "Vale a pena ter aplicativo próprio ou só agendamento no navegador?",
        a: "Para a maioria dos salões, agendamento no navegador resolve e custa bem menos. Aplicativo próprio começa a valer quando existe programa de fidelidade ativo e recompra frequente, porque aí o ícone no celular é o que traz o cliente de volta sem custo de mídia.",
      },
      {
        q: "Lembrete por WhatsApp reduz falta?",
        a: "Reduz de forma consistente, principalmente quando permite remarcar respondendo a própria mensagem. Em salão, o horário perdido não volta e o profissional fica parado, então liberar o horário com antecedência vale mais do que simplesmente lembrar o cliente do compromisso.",
      },
    ],
  },

  {
    slug: "clinicas-veterinarias",
    nome: "Clínicas veterinárias",
    nomeFrase: "clínica veterinária",
    h1: "Sistema para clínicas veterinárias: prontuário do pet e quanto custa",
    title: "Sistema para Clínica Veterinária: Prontuário e Preço em 2026",
    metaDesc: (empresas, faixa) =>
      `São ${empresas} estabelecimentos de atividades veterinárias no Brasil. Veja por que o cadastro tem dois sujeitos e a faixa de ${faixa}.`,
    intro: [
      "Clínica veterinária tem uma diferença estrutural em relação a qualquer clínica humana: o cadastro tem dois sujeitos. O paciente é o animal, o responsável financeiro e de contato é o tutor, e um tutor pode ter vários animais — cada um com histórico, vacina e restrição próprios. Sistema que trata isso como um cadastro só quebra na primeira família com três pets.",
      "O segundo ponto é que boa parte da receita recorrente está no calendário: vacina, vermífugo, antipulgas e retorno têm data prevista. Quando esse calendário vive em carteirinha de papel, o retorno depende da memória do tutor. Quando vive no sistema, ele vira agenda e receita previsível.",
    ],
    oQueOSistemaPrecisa: [
      "Cadastro com tutor e animais separados, permitindo vários pets por tutor",
      "Prontuário por animal, com peso, alergia, restrição e histórico de procedimento",
      "Calendário de vacina e vermífugo, com aviso automático ao tutor",
      "Internação com evolução por turno e medicação aplicada registrada",
      "Venda de produto no mesmo atendimento, separando serviço de mercadoria",
      "Receituário e atestado emitidos do próprio prontuário, com registro do responsável técnico",
    ],
    ondeODinheiroVaza:
      "O aviso automático de vacina é a receita recorrente mais previsível do setor e a mais perdida. Quando a carteirinha é de papel, o retorno depende do tutor lembrar sozinho, e boa parte não lembra. Transformar o calendário em lembrete com agendamento de um clique converte uma obrigação esquecida em consulta marcada, sem custo de mídia.",
    projeto: {
      variante: "app",
      tipoId: "mvp-saas",
      volumeId: "13-25",
      integracaoIds: ["push-whatsapp"],
      custoSlug: ["mvp-saas", "com-push-e-whatsapp"],
    },
    faqs: [
      {
        q: "O sistema precisa separar tutor e animal mesmo em clínica pequena?",
        a: "Precisa, desde o início. Unificar os dois parece simplificar e cria um problema difícil de desfazer: quando o tutor tem o segundo animal, ou quando um animal troca de tutor, a base já está errada. Separar na modelagem inicial custa pouco e evita migração dolorosa depois.",
      },
      {
        q: "Dá para vender produto e atender no mesmo sistema?",
        a: "Dá, e é o usual, porque boa parte da receita vem de ração, medicamento e acessório. O importante é separar serviço de mercadoria no registro, já que têm margem, tributação e controle de estoque diferentes. Misturar os dois numa linha só inutiliza qualquer relatório de margem.",
      },
      {
        q: "Como fica o receituário e a responsabilidade técnica?",
        a: "O receituário deve sair do prontuário com identificação do responsável técnico e ficar registrado no histórico do animal. Medicamento de controle especial tem exigência própria de escrituração, e isso precisa ser verificado com o conselho da categoria antes de definir o escopo.",
      },
      {
        q: "Vale ter aplicativo para o tutor?",
        a: "Vale quando existe recorrência: carteira de vacina digital, histórico e agendamento são as funções que fazem o tutor abrir o aplicativo. Em clínica menor, enviar a carteira digital por link e usar o WhatsApp para lembrete costuma entregar quase o mesmo resultado por uma fração do custo.",
      },
    ],
  },

  {
    slug: "produtoras-de-eventos",
    nome: "Produtoras de eventos",
    nomeFrase: "produtora de eventos",
    h1: "Sistema para produtoras de eventos: ingresso, check-in e custo",
    title: "Sistema para Eventos: Ingresso e Check-in — Preço em 2026",
    metaDesc: (empresas, faixa) =>
      `São ${empresas} empresas de organização de eventos no Brasil. Veja por que o check-in offline define o projeto e a faixa de ${faixa}.`,
    intro: [
      "Sistema de evento tem uma característica que nenhum outro desta lista tem: ele é julgado por um pico de trinta minutos. Durante meses nada acontece, e então mil pessoas chegam ao mesmo tempo na porta. Se o check-in travar nesse intervalo, o evento inteiro é lembrado pela fila — e não adianta o sistema ter funcionado bem nos três meses anteriores.",
      "É por isso que a decisão técnica central aqui é o funcionamento offline. Local de evento costuma ter internet ruim justamente quando enche, porque todo mundo está usando a mesma rede. Check-in que depende de conexão no momento da validação é o desenho errado, por mais rápido que pareça no teste com dez pessoas.",
    ],
    oQueOSistemaPrecisa: [
      "Venda de ingresso com lotes, cortesia e limite por comprador",
      "Ingresso com código único e proteção contra revenda da mesma entrada",
      "Check-in offline no celular, com sincronização entre as portas quando dá",
      "Painel ao vivo de público presente, por portaria e por setor",
      "Lista de convidados e credenciamento separados da venda",
      "Repasse automático para parceiros e produtores no momento da venda",
    ],
    ondeODinheiroVaza:
      "A sincronização entre portas é o detalhe que decide se o check-in offline funciona ou vira porta de entrada para fraude. Sem ela, o mesmo ingresso entra por duas portas diferentes e ninguém percebe até a contagem final não bater. O desenho correto valida offline e reconcilia entre os aparelhos assim que houver rede, sinalizando duplicidade em vez de ignorá-la.",
    projeto: {
      variante: "app",
      tipoId: "completo",
      volumeId: "13-25",
      integracaoIds: ["pagamento"],
      custoSlug: ["app-completo", "com-pagamento-online"],
    },
    faqs: [
      {
        q: "Por que não usar uma plataforma pronta de ingressos?",
        a: "Para a maioria dos eventos, plataforma pronta é a escolha certa: sem custo fixo e sem risco técnico. Sistema próprio passa a fazer sentido quando a taxa por ingresso já pesa mais que o custo de manter o seu, quando a produtora tem calendário recorrente, ou quando a base de compradores é um ativo que você não quer deixar na mão de terceiro.",
      },
      {
        q: "O check-in funciona sem internet no local?",
        a: "Precisa funcionar, e essa é a exigência que mais separa sistema bom de sistema ruim no setor. A lista é baixada antes da abertura, a validação acontece no aparelho e os aparelhos se reconciliam quando houver rede, apontando qualquer ingresso lido duas vezes.",
      },
      {
        q: "Como funciona o repasse para produtores parceiros?",
        a: "Pela divisão automática no momento da venda, com o percentual de cada parte definido antes. Isso evita reter dinheiro de terceiro, que é atividade regulada, e elimina a conciliação manual pós-evento — que é onde os desentendimentos entre sócios de evento normalmente nascem.",
      },
      {
        q: "Dá para evitar revenda e fraude de ingresso?",
        a: "Dá para reduzir bastante, com código único por ingresso, vínculo com o comprador e código dinâmico que muda perto do evento. Eliminar por completo não é realista, mas o conjunto dessas medidas torna a revenda difícil o suficiente para deixar de ser um problema de escala.",
      },
    ],
  },
];

export function getSetorConteudo(slug: string): SetorConteudo | undefined {
  return setoresConteudo.find((s) => s.slug === slug);
}
