# Prospecção direta — 3 e-mails + 3 mensagens de WhatsApp

**Para quem:** empresa do ICP (dono/sócio/diretor, 10–200 funcionários, RS ou
Brasil) que você identificou como tendo o problema. Não é disparo em massa.

**Base legal (LGPD):** contato B2B para oferta profissional se apoia em
legítimo interesse, desde que o contato seja individual, identificado, com
opção clara de não receber mais, e com dado obtido de fonte pública (site da
empresa, LinkedIn). **Nada de lista comprada ou raspada em massa.**

**Volume:** até 10 por dia, pesquisados um a um. Mais que isso vira disparo e
perde a única vantagem que esse canal tem, que é ser específico.

**UTM:** `utm_source=outbound&utm_medium=email|whatsapp&utm_campaign=<sequencia>`

---

# Sequência de e-mail

## E-mail 1 — dia 0

**Assunto:** `{{PrimeiroNome}}, uma pergunta sobre a operação da {{Empresa}}`

```
{{PrimeiroNome}}, tudo bem?

Sou o Daniel, desenvolvedor em Passo Fundo. Vi que a {{Empresa}} trabalha com {{AtividadeEspecifica}} e queria fazer uma pergunta rápida, sem rodeio comercial:

{{PerguntaDoSetor}}

Pergunto porque é o ponto onde eu mais vejo tempo e dinheiro vazarem em empresa do seu porte — e quase sempre sem ninguém perceber, porque não gera reclamação, só gera retrabalho.

Se não for o caso de vocês, me ignora tranquilo que não insisto.

Daniel Anders
andersdev.com.br
(54) 9.9964-8368
```

**Banco de `{{PerguntaDoSetor}}` — use a do setor da empresa:**

| Setor | Pergunta |
|---|---|
| Transportadora | Quanto tempo leva, hoje, entre a entrega acontecer e o canhoto assinado chegar na matriz? |
| Clínica | Vocês acompanham a taxa de falta nas consultas, ou só o faturamento? |
| Oficina | Quanto tempo um carro fica parado esperando o cliente aprovar o orçamento por telefone? |
| Contabilidade | Quantas horas por semana alguém aí gasta garimpando documento que o cliente mandou no WhatsApp? |
| Indústria | A ordem de produção hoje vive em planilha, em papel, ou no sistema? |
| Comércio | Quando o estoque muda na loja física, quanto tempo leva até o site saber? |
| Imobiliária | Quando o preço de um imóvel muda, em quantos lugares alguém precisa atualizar? |
| Engenharia | A medição de obra sai de dado registrado no canteiro ou de anotação transcrita depois? |

---

## E-mail 2 — dia 4 (sem resposta)

**Assunto:** `Re: {{PrimeiroNome}}, uma pergunta sobre a operação da {{Empresa}}`

```
{{PrimeiroNome}}, subindo este aqui uma vez só.

Enquanto isso, deixo algo que serve mesmo que a gente nunca converse:

{{LinkDaPaginaDoSetor}}

Tem os módulos que um sistema desse setor precisa ter, onde o dinheiro costuma vazar na operação, e a faixa de preço aberta — sem "a partir de" e sem precisar falar comigo pra ver o número.

Se o tema não é prioridade agora, me responde só "não é o momento" que eu paro por aqui.

Daniel
```

**`{{LinkDaPaginaDoSetor}}` — cole a do setor, com UTM:**

```
https://www.andersdev.com.br/sistema-para/transportadoras?utm_source=outbound&utm_medium=email&utm_campaign=seq-setor
https://www.andersdev.com.br/sistema-para/clinicas-e-consultorios?utm_source=outbound&utm_medium=email&utm_campaign=seq-setor
https://www.andersdev.com.br/sistema-para/oficinas-mecanicas?utm_source=outbound&utm_medium=email&utm_campaign=seq-setor
https://www.andersdev.com.br/sistema-para/escritorios-de-contabilidade?utm_source=outbound&utm_medium=email&utm_campaign=seq-setor
https://www.andersdev.com.br/sistema-para/imobiliarias?utm_source=outbound&utm_medium=email&utm_campaign=seq-setor
https://www.andersdev.com.br/sistema-para/empresas-de-engenharia?utm_source=outbound&utm_medium=email&utm_campaign=seq-setor
https://www.andersdev.com.br/sistema-para/restaurantes-e-bares?utm_source=outbound&utm_medium=email&utm_campaign=seq-setor
https://www.andersdev.com.br/sistema-para/academias?utm_source=outbound&utm_medium=email&utm_campaign=seq-setor
```

---

## E-mail 3 — dia 11 (encerramento)

**Assunto:** `Fechando o assunto, {{PrimeiroNome}}`

```
{{PrimeiroNome}}, este é o último — não quero virar ruído na sua caixa.

Deixo duas coisas que ficam de pé sozinhas:

1. A calculadora de custo, caso em algum momento vocês precisem dimensionar um projeto sem pedir orçamento pra ninguém:
https://www.andersdev.com.br/calculadora-site?utm_source=outbound&utm_medium=email&utm_campaign=seq-encerramento

2. O perfil econômico de {{Cidade}}, puxado do IBGE — quantas empresas existem aí e em que a cidade foge da média do estado. Serve pra entender o próprio mercado, independente de tecnologia:
{{LinkDaCidade}}

Se mudar alguma coisa, meu número é (54) 9.9964-8368.

Boa sorte com a {{Empresa}}.

Daniel
```

**`{{LinkDaCidade}}`:** `https://www.andersdev.com.br/sites-e-sistemas/{{slug-da-cidade}}?utm_source=outbound&utm_medium=email&utm_campaign=seq-encerramento`
(Slugs disponíveis em `/sites-e-sistemas` — 100 municípios do RS.)

---

# Sequência de WhatsApp

Use **depois** do e-mail 1 sem resposta, nunca antes. WhatsApp sem contato
prévio queima o número e queima a marca.

## WhatsApp 1 — dia 2

```
Oi {{PrimeiroNome}}, aqui é o Daniel Anders, desenvolvedor de Passo Fundo. Te mandei um e-mail essa semana sobre {{AssuntoDoSetor}} e sei que e-mail some.

Pergunta objetiva: {{PerguntaDoSetor}}

Se não for dor aí, sem problema nenhum, só me avisa que eu não insisto.
```

## WhatsApp 2 — dia 6

```
{{PrimeiroNome}}, sem cobrar resposta — só deixando algo que pode ser útil mesmo que a gente não trabalhe junto.

Montei uma página com os módulos que um sistema de {{Setor}} precisa ter e onde o dinheiro costuma vazar na operação. Tem a faixa de preço aberta, sem cadastro:

{{LinkDaPaginaDoSetor}}

Se quiser conversar, meu horário é flexível. Se não, tudo certo.
```

## WhatsApp 3 — dia 12 (encerramento)

```
{{PrimeiroNome}}, último toque meu.

Deixo a calculadora, que serve pra dimensionar projeto sem precisar pedir orçamento pra ninguém:
https://www.andersdev.com.br/calculadora-site?utm_source=outbound&utm_medium=whatsapp&utm_campaign=seq-encerramento

Guardo seu contato e não mando mais nada. Se precisar um dia, é só chamar.

Abraço!
```

---

## Como medir

Cada link leva UTM, então em `/admin/trafego` (coluna Origem) aparece
`outbound / email` e `outbound / whatsapp`. O que interessa olhar:

| Pergunta | Onde |
|---|---|
| Quantos abriram alguma página? | Sessões com origem `outbound` |
| Qual sequência trouxe mais? | Campanha `seq-setor` vs `seq-encerramento` |
| Alguém virou lead? | Coluna "Leads" na tabela "Qual página gera lead" |

Meta realista para prospecção fria bem feita: 1 a 3 respostas a cada 20
contatos. Abaixo disso, o problema está na pergunta do e-mail 1 — ela precisa
ser específica do setor a ponto de a pessoa pensar "como ele sabe disso?".

## Regras

**Nunca mais de 10 por dia.** Acima disso você está disparando, não prospectando,
e o retorno cai junto com a reputação do domínio.

**Pare na primeira negativa.** "Não é o momento" encerra a sequência. Insistir
depois disso custa a chance futura.

**Nunca mande para lista comprada.** Queima o domínio de envio, derruba junto os
e-mails transacionais que você precisa que cheguem, e não tem base legal.
