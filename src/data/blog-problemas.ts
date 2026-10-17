/**
 * Posts de intenção PROBLEMA/SOLUÇÃO.
 *
 * O blog existente responde bem a busca de preço ("quanto custa X"). Estas
 * duas entradas cobrem as lacunas que sobraram no levantamento de contexto:
 * a busca 13 ("como sair da planilha na minha empresa") e a 16 ("meu site não
 * aparece no Google o que fazer") — ver docs/trafego/contexto.md.
 *
 * Arquivo separado para não fazer cirurgia num blog.ts de 70 KB.
 */

import type { BlogPost } from "./blog";

export const postsProblemas: BlogPost[] = [
  {
    slug: "como-sair-da-planilha-na-empresa",
    title: "Como sair da planilha sem parar a empresa",
    excerpt:
      "A planilha não é o problema — é o sintoma. Um método em quatro passos para identificar qual processo migrar primeiro, o que deixar na planilha, e como trocar sem interromper a operação.",
    category: "negócios",
    tags: ["processos", "sistemas", "gestão", "automação"],
    publishedAt: "2026-10-17",
    readingTime: 9,
    content: `Quase toda empresa que me procura começa a conversa do mesmo jeito: "a gente controla tudo em planilha e já não dá mais". E quase sempre a planilha não é o problema. É o sintoma de outra coisa.

Vale separar as duas, porque trocar a planilha errada custa dinheiro e não resolve nada.

## A planilha funciona até três coisas acontecerem

Planilha é uma ferramenta excelente. Flexível, barata, todo mundo sabe usar, muda em segundos. Ela aguenta muito mais do que as pessoas imaginam.

O que quebra uma planilha não é volume de dados. É uma destas três situações:

**Duas pessoas editando ao mesmo tempo.** Enquanto uma pessoa é dona do arquivo, está tudo bem. Quando duas mexem, começam as versões paralelas, o "me manda a mais atualizada", e a descoberta de que o dado certo estava no arquivo que ninguém salvou.

**Alguém precisa ver só uma parte.** Planilha não tem permissão por linha. Ou a pessoa vê tudo — incluindo margem, custo e salário — ou não vê nada. Isso trava a delegação: o dono não consegue passar a operação adiante sem abrir o que não quer abrir.

**O processo tem etapas com responsável.** Quando algo precisa passar de uma pessoa para outra, com status e prazo, a planilha vira um quadro que ninguém atualiza. Não porque a equipe é desleixada, mas porque atualizar não traz benefício imediato para quem atualiza.

Se nenhuma dessas três acontece com você, não troque nada. Investir em sistema para substituir uma planilha que funciona é a forma mais comum de gastar dinheiro com tecnologia sem retorno.

## O custo que ninguém mede

Antes de decidir, vale fazer uma conta que quase ninguém faz.

Pegue o processo que mais incomoda e estime:

- Quantas horas por semana alguém gasta **digitando** dado que já existe em outro lugar
- Quantas horas por mês alguém gasta **procurando** informação que deveria estar à mão
- Quantas vezes por trimestre um erro de digitação gerou retrabalho, e quanto cada um custou

Multiplique pelo custo da hora dessa pessoa. O número que sai costuma surpreender — e é ele, não o desconforto, que justifica ou não o investimento.

Se der menos que alguns milhares de reais por ano, a resposta honesta é continuar na planilha e investir em outra coisa.

## Qual processo migrar primeiro

Esta é a decisão que mais erra. A tentação é começar pelo processo mais importante. Quase sempre é a escolha errada.

Comece pelo processo que atende os três critérios ao mesmo tempo:

**É repetitivo.** Acontece muitas vezes por semana, do mesmo jeito. Processo que acontece uma vez por mês não gera economia suficiente para pagar o sistema.

**Tem regra clara.** Se as pessoas discordam sobre como o processo funciona, o problema não é a planilha — é que o processo não está definido. Automatizar um processo indefinido só deixa a confusão mais rápida.

**Tem dono.** Uma pessoa que sofre com o problema e vai cobrar que o sistema seja usado. Sistema sem dono interno vira software caro que ninguém abre.

Falta qualquer um dos três e vale esperar.

## Não migre tudo de uma vez

O erro mais caro que vejo nessa transição é a virada de chave: parar a planilha numa sexta e começar o sistema na segunda.

O que acontece é previsível. Na primeira semana aparece um caso que ninguém previu. A equipe, sob pressão de entregar, volta para a planilha "só nesse caso". Em duas semanas existem dois sistemas rodando em paralelo, com dados diferentes, e aí o problema ficou pior do que era.

O caminho que funciona é por fatias:

1. **Um processo só**, o escolhido acima, rodando no sistema enquanto todo o resto segue na planilha.
2. **Duas a quatro semanas em uso real**, com ajustes conforme os casos que ninguém previu aparecem — e eles vão aparecer.
3. **Só então** o segundo processo.

Cada fatia precisa gerar valor sozinha. Se a fatia um só faz sentido depois que a fatia três existir, o recorte está errado.

## O que deixar na planilha para sempre

Nem tudo deve sair. Planilha continua sendo a melhor ferramenta para:

- **Análise exploratória** — quando você ainda não sabe que pergunta está fazendo
- **Simulação e cenário** — "e se o custo subir 8%?"
- **Processo que muda toda hora** — enquanto a regra não estabilizou, planilha é mais barata de mudar que código
- **Coisa que acontece uma vez por ano** — fechamento, inventário, orçamento anual

Sistema é bom em processo repetido com regra estável. Planilha é boa em pergunta nova. Empresa madura usa os dois, cada um no lugar certo.

## Os quatro passos, resumidos

1. **Confirme que é hora.** Se não há edição simultânea, necessidade de permissão parcial nem fluxo entre pessoas, não troque.
2. **Faça a conta.** Horas de digitação, de busca e de retrabalho, multiplicadas pelo custo da hora. Esse é o seu orçamento.
3. **Escolha um processo** que seja repetitivo, com regra clara e com dono interno.
4. **Migre por fatias**, com cada fatia gerando valor sozinha, nunca com virada de chave.

## Quanto custa, na prática

Depende inteiramente do recorte, e é por isso que eu publico as faixas abertas em vez de responder "depende".

Um sistema que resolve um processo específico — ordem de serviço, agendamento, controle de entrega — costuma ficar na faixa de MVP. Um sistema que coordena vários papéis dentro da operação é outro patamar.

Você pode dimensionar isso sozinho, sem falar comigo, na calculadora: ela pergunta tipo de projeto, escopo, integrações e prazo, e devolve a faixa com o detalhamento do que compõe o valor.

E se o seu setor estiver entre os que já mapeei — clínica, oficina, transportadora, contabilidade, imobiliária, engenharia, restaurante, academia —, vale olhar a página do setor antes: ela lista os módulos que aquele tipo de operação costuma precisar e onde o dinheiro costuma vazar. Pode poupar algumas reuniões.`,
  },

  {
    slug: "meu-site-nao-aparece-no-google",
    title: "Meu site não aparece no Google: o diagnóstico em 6 verificações",
    excerpt:
      "Antes de contratar SEO, rode estas seis verificações. Elas levam cerca de 20 minutos, não custam nada, e na maioria dos casos explicam o problema inteiro.",
    category: "desenvolvimento",
    tags: ["SEO", "Google", "indexação", "marketing"],
    publishedAt: "2026-10-17",
    readingTime: 10,
    content: `"Meu site não aparece no Google" quase sempre significa uma de duas coisas muito diferentes: ou o Google não conhece o site, ou conhece e não considera que ele mereça aparecer. As soluções não têm nada a ver uma com a outra, e tratar a segunda quando o problema é a primeira é jogar dinheiro fora.

Estas seis verificações separam os dois casos. Levam cerca de vinte minutos e não custam nada.

## Verificação 1 — O Google conhece o seu site?

Busque no Google, exatamente assim, trocando pelo seu domínio:

    site:seudominio.com.br

Se voltar vazio, o Google não indexou nenhuma página. Esse é o problema inteiro, e nada de conteúdo ou link vai resolver enquanto ele existir.

Se voltar algumas páginas, conte. O número que aparece é aproximado, mas serve: se você tem 40 páginas e aparecem 3, o problema é de indexação, não de posicionamento.

## Verificação 2 — Você está bloqueando o Google?

Abra no navegador:

    seudominio.com.br/robots.txt

Procure por estas duas linhas juntas:

    User-agent: *
    Disallow: /

Se estiverem lá, você está pedindo ao Google para ignorar o site inteiro. Acontece com frequência: o arquivo entra assim durante o desenvolvimento, para o site de teste não ser indexado, e ninguém lembra de tirar na hora de publicar.

Confira também se existe a linha que aponta o sitemap:

    Sitemap: https://seudominio.com.br/sitemap.xml

## Verificação 3 — Existe a tag que esconde a página?

No site, clique com o botão direito e escolha "exibir código-fonte". Procure por:

    noindex

Se aparecer dentro de uma meta tag de robots, essa página está explicitamente pedindo para ficar fora do índice. Mesma história do item anterior: costuma ser resquício de ambiente de teste.

Vale checar em mais de uma página. É comum o problema existir só na home, ou só nas internas.

## Verificação 4 — O conteúdo chega no HTML?

Esta é a verificação que mais pega gente desprevenida, e a mais difícil de perceber a olho nu.

Veja o código-fonte da página e procure por um texto que você sabe que está visível na tela. Se você vê o texto no navegador mas **não** encontra no código-fonte, o conteúdo está sendo montado por JavaScript depois do carregamento.

O Google até consegue processar isso, mas com atraso e sem garantia. Em site pequeno e novo, é uma aposta ruim.

A correção é renderizar no servidor, o que entrega o HTML já com o conteúdo dentro. Não é ajuste de configuração — é decisão de arquitetura, e às vezes implica refazer parte do site.

## Verificação 5 — Existe sitemap, e ele foi enviado?

Abra:

    seudominio.com.br/sitemap.xml

Se der erro, não existe sitemap. Se existir, confira se as URLs listadas são as que você quer que apareçam, e se o número bate com o tamanho real do site.

Agora a parte que quase todo mundo esquece: **ter sitemap não é o mesmo que enviar**. Ele precisa ser cadastrado no Google Search Console. Sem isso, o Google pode levar meses para descobrir páginas novas, principalmente em site sem links de fora apontando para ele.

O Search Console é gratuito. Adicionar o domínio e enviar o sitemap leva uns quinze minutos, e é a ação de maior retorno desta lista inteira.

## Verificação 6 — Você tem páginas que respondem a alguma busca?

Se as cinco primeiras verificações passaram, o Google conhece o seu site e não está bloqueado. Então o problema mudou de natureza: ele conhece e não considera que você mereça aparecer.

Aqui a pergunta é desconfortável: **quantas páginas do seu site respondem a uma pergunta que alguém digita no Google?**

Na maioria dos sites institucionais a resposta é zero. Home, sobre, serviços e contato não respondem pergunta nenhuma — elas falam sobre a empresa. E ninguém busca pela sua empresa antes de conhecer a sua empresa.

Quem busca digita o problema ("sistema para controlar ordem de serviço"), o preço ("quanto custa fazer um site"), ou a comparação ("vale a pena usar plataforma pronta"). Um site com cinco páginas sobre si mesmo não tem onde ranquear, por melhor que seja o SEO técnico.

## O que fazer com o resultado

**Se falhou nas verificações 1 a 5:** você tem um problema técnico, com correção conhecida e prazo curto. Não contrate consultoria de SEO ainda — corrija isso primeiro, porque nenhum trabalho de conteúdo rende enquanto o site estiver bloqueado ou invisível.

**Se passou em todas e caiu na verificação 6:** o problema é de conteúdo, e a correção é mais lenta. Não existe atalho: é preciso criar páginas que respondam perguntas específicas que o seu cliente digita.

A boa notícia é que a conta de volume é mais fácil do que parece. Cada página útil é uma porta de entrada. Um site com cinquenta páginas respondendo cinquenta perguntas tem cinquenta chances de ser encontrado; um site com cinco páginas sobre si mesmo tem zero.

## Um aviso sobre volume

Existe um jeito errado de aplicar isso, e ele é comum: gerar centenas de páginas quase idênticas, trocando só o nome da cidade ou do serviço.

Isso costumava funcionar e hoje faz o oposto. Conteúdo raso em escala derruba a avaliação do domínio inteiro, inclusive das páginas boas que você já tinha.

A régua é simples e vale aplicar antes de publicar qualquer página gerada: **se duas páginas ficariam com o mesmo texto e só o nome mudando, o recorte está errado.** Página em escala precisa carregar dado próprio — número, comparação, exemplo — que só existe nela.

## Prazo realista

Correção técnica: de dias a poucas semanas, e o efeito aparece rápido depois que o Google rastreia de novo.

Conteúdo: de três a seis meses até a primeira página começar a trazer visita com alguma constância. Não é rápido, e quem promete rápido está vendendo outra coisa.

Se quiser ir além do diagnóstico, a calculadora do site estima o custo de corrigir a parte técnica junto com a reconstrução, caso seja esse o caminho — sem precisar pedir orçamento para ninguém.`,
  },
];
