import type { ConteudoFerramenta } from "@/components/ferramentas/FerramentaLayout";

const ATUALIZADO = "2026-11-18";

export const PAGINAS_FERRAMENTAS = {
  diagnostico: {
    slug: "diagnostico-de-site",
    title: "Diagnóstico de site grátis: nota de 0 a 100 | AndersDev",
    description: "Diagnóstico de site grátis: HTTPS, celular, Google, velocidade e LGPD em 17 verificações. Nota na hora e relatório completo por e-mail.",
    conteudo: {
      h1: "Diagnóstico de site grátis",
      respostaDireta:
        "O diagnóstico de site grátis confere 17 pontos técnicos que decidem se o seu site aparece no Google e passa confiança: HTTPS, adaptação ao celular, título e descrição, bloqueio de indexação, sitemap, dados estruturados e política de privacidade. A nota sai na hora; o relatório com como resolver cada item vai por e-mail.",
      comoFunciona: [
        "Nosso servidor abre a página que você informar, como um navegador faria, e lê o HTML que ela entrega. Também procura o robots.txt e o sitemap.xml no endereço padrão.",
        "Cada verificação tem um peso proporcional ao impacto: um noindex esquecido tira a página do Google, então pesa mais do que uma imagem sem texto alternativo. A nota é a soma dos pesos atendidos, de 0 a 100.",
        "É um diagnóstico técnico de superfície da página inicial. Ele não substitui o Search Console (que mostra o que o Google realmente indexou) nem mede a experiência real dos visitantes — para isso, use também o PageSpeed Insights.",
      ],
      faq: [
        { pergunta: "O diagnóstico altera alguma coisa no meu site?", resposta: "Não. Ele só lê a página pública, do mesmo jeito que qualquer visitante. Nenhum dado é enviado ao seu site e nada é gravado do lado dele." },
        { pergunta: "Por que a nota daqui é diferente da do PageSpeed?", resposta: "O PageSpeed mede velocidade e experiência de carregamento. Este diagnóstico olha sinais de SEO técnico, segurança e privacidade. São complementares: um site pode ser rápido e estar bloqueado para o Google, por exemplo." },
        { pergunta: "Posso analisar o site de um concorrente?", resposta: "Pode — a análise usa só o que a página pública mostra. É uma forma rápida de comparar o básico antes de investir em um site novo." },
        { pergunta: "Meu site é feito no Wix/WordPress. Serve?", resposta: "Serve para qualquer site público. As correções sugeridas valem para qualquer plataforma; algumas exigem acesso ao código ou a um plugin." },
      ],
      atualizadoEm: ATUALIZADO,
    } satisfies ConteudoFerramenta,
  },
  planilha: {
    slug: "custo-da-planilha",
    title: "Quanto custa a planilha: calculadora de ROI | AndersDev",
    description: "Calcule quanto o processo manual em planilha custa por ano e em quantos meses um sistema se paga. Resultado na hora, projeção por e-mail.",
    conteudo: {
      h1: "Quanto custa manter o processo na planilha",
      respostaDireta:
        "Quanto custa manter o processo na planilha depende de três números que você já tem: quantas pessoas mexem nele, quantas horas por semana cada uma gasta e quanto essa hora custa. A calculadora soma o retrabalho, mostra o custo anual e compara com a faixa de preço de um sistema para estimar em quantos meses ele se paga.",
      comoFunciona: [
        "Horas manuais por mês = pessoas × horas por semana × 4,33 semanas × (1 + retrabalho). Custo por hora = custo mensal da pessoa ÷ horas trabalhadas no mês. O custo do processo é a multiplicação dos dois.",
        "A economia mensal aplica o percentual de redução que você informar — é uma premissa sua, porque depende do processo. O investimento vem da tabela pública de preços (sistema web/MVP), sem preço digitado à mão.",
        "Retorno do investimento = faixa de preço ÷ economia mensal. Se a economia for pequena, a calculadora diz isso: nem todo processo justifica um sistema.",
      ],
      faq: [
        { pergunta: "Que custo mensal devo colocar?", resposta: "O custo total da pessoa para a empresa: salário, encargos e benefícios. Se não souber, peça ao contador o custo médio de um funcionário naquela função." },
        { pergunta: "E se o sistema eliminar só parte do trabalho?", resposta: "É o normal. Use o campo de redução com um número conservador (30% a 60%). O link da página guarda os números para você revisar depois com dados reais." },
        { pergunta: "A conta considera mensalidade de hospedagem?", resposta: "Não diretamente. Se o sistema tiver custo mensal relevante, reduza a economia mensal na mesma proporção — ou reduza o percentual de redução." },
      ],
      atualizadoEm: ATUALIZADO,
    } satisfies ConteudoFerramenta,
  },
  lancamento: {
    slug: "checklist-lancamento-de-site",
    title: "Checklist de lançamento de site: 30 itens | AndersDev",
    description: "Checklist de lançamento de site em 30 itens: domínio, HTTPS, Google, celular e LGPD. Nota na hora e lista de pendências por e-mail.",
    conteudo: {
      h1: "Checklist de lançamento de site",
      respostaDireta:
        "Este checklist de lançamento de site reúne os 30 itens que mais causam problema depois que o site vai ao ar: domínio no nome da empresa, HTTPS, formulário testado, Search Console, noindex esquecido, celular e LGPD. Marque o que já está feito, veja a nota na hora e receba as pendências explicadas por e-mail.",
      comoFunciona: [
        "Cada item tem peso 1, 2 ou 3 conforme o estrago que causa quando falta. Um domínio registrado no nome do fornecedor ou um noindex esquecido valem mais do que um texto alternativo de imagem.",
        "A nota é a soma dos pesos marcados sobre o total. As respostas ficam no endereço da página: copie o link para revisar depois ou para mandar a quem está fazendo o site.",
      ],
      faq: [
        { pergunta: "Serve para site feito em plataforma pronta?", resposta: "Serve. A maior parte dos itens é independente de tecnologia: titularidade do domínio, formulário funcionando, Search Console, celular e privacidade valem para qualquer site." },
        { pergunta: "Preciso cumprir todos os itens antes de lançar?", resposta: "Os de peso 3 sim. Os demais podem entrar na primeira semana no ar, desde que estejam anotados com responsável e prazo." },
        { pergunta: "O checklist substitui um teste técnico?", resposta: "Não. Ele organiza o que conferir. Para a parte técnica automática, rode também o diagnóstico de site gratuito e o PageSpeed Insights." },
      ],
      atualizadoEm: ATUALIZADO,
    } satisfies ConteudoFerramenta,
  },
  lgpd: {
    slug: "checklist-lgpd",
    title: "Checklist LGPD para site e sistema | AndersDev",
    description: "Checklist LGPD para site e sistema em 20 perguntas, com o artigo da lei de cada item. Nota na hora e plano de adequação por e-mail.",
    conteudo: {
      h1: "Checklist LGPD para site e sistema",
      respostaDireta:
        "Este checklist LGPD para site e sistema confere, em 20 perguntas, o que a Lei 13.709/2018 pede no dia a dia de uma pequena empresa: política de privacidade, consentimento de cookies, opt-in separado, atendimento ao titular, segurança e plano para incidentes. A nota sai na hora; o plano de adequação, com o artigo de cada item, vai por e-mail.",
      comoFunciona: [
        "Os itens seguem a LGPD e as resoluções da ANPD citadas em cada explicação. Os pesos refletem o risco: falta de canal com o titular ou de segurança básica pesa mais do que um inventário incompleto.",
        "É uma ferramenta de organização, não um parecer jurídico. Para casos com dados sensíveis (saúde, biometria) ou volume grande, procure um profissional de proteção de dados.",
      ],
      faq: [
        { pergunta: "Pequena empresa precisa cumprir a LGPD?", resposta: "Sim. A LGPD vale para qualquer empresa que trate dados pessoais. A Resolução CD/ANPD nº 2/2022 traz regras simplificadas para agentes de pequeno porte, mas não os dispensa da lei." },
        { pergunta: "Banner de cookies é obrigatório?", resposta: "A lei não fala em banner; fala em base legal para o tratamento. Para cookies de medição e publicidade, a base usual é o consentimento, e o banner é o jeito prático de pedi-lo e registrá-lo." },
        { pergunta: "Onde vejo o texto da lei?", resposta: "No Planalto: planalto.gov.br, Lei nº 13.709/2018. As páginas de leis explicadas deste site linkam cada artigo para o texto oficial." },
      ],
      atualizadoEm: ATUALIZADO,
    } satisfies ConteudoFerramenta,
  },
  briefing: {
    slug: "gerador-de-briefing",
    title: "Gerador de briefing de site: modelo pronto | AndersDev",
    description: "Monte o briefing do seu site em 10 perguntas e receba o texto pronto para enviar a fornecedores. Orçamentos comparáveis, sem retrabalho.",
    conteudo: {
      h1: "Gerador de briefing de site",
      respostaDireta:
        "O gerador de briefing de site transforma 10 respostas curtas em um documento pronto para enviar a fornecedores: objetivo, público, páginas, funções, conteúdo, integrações, prazo e faixa de investimento. Com o mesmo briefing para todos, as propostas ficam comparáveis — e você enxerga na hora o que ainda falta definir.",
      comoFunciona: [
        "Cada resposta vira uma seção do briefing. A completude mostra quantas das 10 perguntas têm resposta útil; o que estiver em branco aparece como 'a definir' e entra numa lista do que resolver antes de pedir orçamento.",
        "O texto completo inclui também o que pedir em toda proposta (escopo do que não está incluso, propriedade de domínio e código, custo mensal), para você comparar maçã com maçã.",
      ],
      faq: [
        { pergunta: "Preciso saber termos técnicos para responder?", resposta: "Não. Responda como explicaria para alguém da empresa. Quem vai orçar traduz para escopo técnico — e, se não traduzir bem, isso já diz muito sobre o fornecedor." },
        { pergunta: "Devo informar o orçamento?", resposta: "Ajuda. Sem faixa, cada fornecedor imagina um projeto diferente e as propostas variam de 1 para 10. Com faixa, eles propõem o melhor escopo que cabe nela." },
        { pergunta: "Serve para aplicativo ou sistema?", resposta: "Serve como ponto de partida. Para produto digital com várias funções, use também o priorizador de escopo de MVP." },
      ],
      atualizadoEm: ATUALIZADO,
    } satisfies ConteudoFerramenta,
  },
  mvp: {
    slug: "escopo-de-mvp",
    title: "Escopo de MVP: priorize as funções | AndersDev",
    description: "Liste as funções do seu app ou sistema, marque importância e esforço e veja o que entra na primeira versão. Escopo em 3 versões por e-mail.",
    conteudo: {
      h1: "Escopo de MVP: o que entra na primeira versão",
      respostaDireta:
        "Para definir o escopo de MVP, liste as funções do app ou sistema e marque cada uma como essencial, importante ou desejável, com esforço pequeno, médio ou grande. A primeira versão fica só com as essenciais; a ferramenta mostra quanto do esforço total elas representam e aponta funções grandes que merecem uma versão mais simples.",
      comoFunciona: [
        "Esforço vira pontos relativos (P=1, M=3, G=8) — uma escala para comparar funções entre si, não para estimar prazo. O MVP é o conjunto das essenciais; se ele passar de 60% do esforço total, provavelmente há função 'essencial' que pode esperar.",
        "O resultado em e-mail separa três versões (primeira, segunda e depois de validar) e lista os pontos de atenção. Para preço e prazo, leve esse escopo à calculadora de app.",
      ],
      faq: [
        { pergunta: "Como saber se uma função é essencial?", resposta: "Pergunte: sem ela, o primeiro cliente consegue usar o produto e pagar? Se consegue, ela não é essencial — é importante." },
        { pergunta: "Login é sempre essencial?", resposta: "Nem sempre. Um MVP pode começar com acesso por link ou cadastro manual feito pela equipe. Depende de quantos usuários e de que dados estão envolvidos." },
        { pergunta: "O que fazer com as funções desejáveis?", resposta: "Anote e espere dados reais de uso. Boa parte delas deixa de parecer necessária depois que os primeiros clientes usam o produto." },
      ],
      atualizadoEm: ATUALIZADO,
    } satisfies ConteudoFerramenta,
  },
  marketplace: {
    slug: "taxa-de-marketplace",
    title: "Taxa de marketplace: calculadora de comissão | AndersDev",
    description: "Calcule quanto a comissão do marketplace ou do app de delivery leva por ano e quando um canal próprio se paga. Simulação na hora.",
    conteudo: {
      h1: "Calculadora de taxa de marketplace",
      respostaDireta:
        "A calculadora de taxa de marketplace mostra quanto a comissão leva por ano a partir de três números seus: pedidos por mês, ticket médio e percentual cobrado. Depois simula levar parte dos pedidos para um canal próprio e calcula em quantos meses o investimento se paga, já descontando o custo do meio de pagamento e a mensalidade.",
      comoFunciona: [
        "Comissão anual = pedidos × ticket médio × comissão × 12. A economia considera só os pedidos que você acredita que migrariam, menos o custo variável do canal próprio (taxa do meio de pagamento) e o custo fixo mensal.",
        "A comissão é a do seu contrato — a calculadora não traz taxa de nenhuma plataforma, porque elas mudam e variam por plano. O investimento no canal próprio vem da tabela pública de preços.",
      ],
      faq: [
        { pergunta: "Devo sair do marketplace?", resposta: "Raramente de uma vez. O marketplace traz cliente novo; o canal próprio é melhor para quem já comprou. O caminho comum é usar os dois e levar os recorrentes para o canal próprio." },
        { pergunta: "Que percentual de migração é realista?", resposta: "Depende de quanto do seu volume é recorrente e de quanto você incentiva a troca (cupom, fidelidade). Comece conservador e refaça a conta com números reais depois de alguns meses." },
        { pergunta: "Vale para loja virtual e para delivery?", resposta: "Vale para os dois: a lógica é a mesma — comissão sobre a venda contra o custo de manter um canal próprio." },
      ],
      atualizadoEm: ATUALIZADO,
    } satisfies ConteudoFerramenta,
  },
  minicurso: {
    slug: "mini-curso-da-planilha-ao-sistema",
    title: "Mini-curso grátis: da planilha ao sistema | AndersDev",
    description: "Cinco e-mails curtos para tirar a operação da planilha sem jogar dinheiro fora: mapear, medir, priorizar, comparar propostas e começar pequeno.",
    conteudo: {
      h1: "Mini-curso: da planilha ao sistema em 5 e-mails",
      respostaDireta:
        "O mini-curso da planilha ao sistema são 5 e-mails curtos, um a cada 2 dias, para quem toca a operação em planilha e WhatsApp e quer sair disso sem desperdiçar dinheiro. Cada aula traz um exercício: mapear o processo, medir o custo manual, escolher o que automatizar primeiro, comparar propostas e começar pequeno.",
      comoFunciona: [
        "Aula 1: mapear o processo como ele é hoje. Aula 2: achar o gargalo e medir quanto ele custa. Aula 3: decidir o que automatizar primeiro. Aula 4: sistema pronto ou sob medida, e como comparar propostas. Aula 5: como começar pequeno e medir o resultado.",
        "Você recebe só as 5 aulas. A inscrição em outros conteúdos é uma caixa separada e opcional, e todo e-mail tem descadastro em 1 clique.",
      ],
      faq: [
        { pergunta: "É vendido algum produto no curso?", resposta: "O último e-mail convida para uma conversa de orçamento, para quem quiser. As aulas funcionam sozinhas, sem contratar nada." },
        { pergunta: "Quanto tempo leva cada aula?", resposta: "Leitura de 3 a 5 minutos e um exercício de 15 a 30 minutos com a sua própria operação." },
        { pergunta: "Posso cancelar no meio?", resposta: "Pode, em 1 clique no rodapé de qualquer e-mail. Nenhuma outra mensagem é enviada depois disso." },
      ],
      atualizadoEm: ATUALIZADO,
    } satisfies ConteudoFerramenta,
  },
} as const;
