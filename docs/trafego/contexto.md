# Contexto de tráfego — AndersDev

Base para as páginas programáticas e para o kit de distribuição.
Levantado em 17/10/2026, a partir do código e do schema do próprio repositório.

## O que o app faz

Site de captação de um desenvolvedor full-stack solo (Daniel Anders, Passo Fundo/RS)
que constrói sites, e-commerces, apps e sistemas sob medida. A isca principal são
duas calculadoras de custo que mostram a faixa de preço na tela, sem cadastro, e só
então pedem e-mail para enviar o orçamento detalhado. O lead cai no Postgres e dispara
notificação ao dono.

## ICP concreto

| Dimensão | Definição |
|---|---|
| **Cargo** | Dono, sócio ou diretor. Em empresa acima de ~50 funcionários, também gerente de operações ou de TI. É quem assina o cheque — não há departamento de compras no meio. |
| **Setor** | Comércio varejista, indústria leve (metalmecânica, alimentos, móveis), transporte rodoviário de carga, serviços profissionais (contabilidade, advocacia, engenharia), saúde (clínicas). |
| **Porte** | 10 a 200 funcionários. Faturamento que comporta um projeto de R$ 10 mil a R$ 60 mil sem precisar de comitê. |
| **Região** | Primária: Passo Fundo e Planalto Médio/RS (atendimento presencial possível). Secundária: Serra Gaúcha, Missões, Grande Porto Alegre. Terciária: Brasil inteiro, remoto. |
| **Maturidade digital** | Tem site antigo ou nenhum. Opera no WhatsApp e em planilha. Já tentou plataforma pronta e esbarrou em limite. |

## Dor principal

Duas, e são diferentes:

1. **Operacional** — o processo vive em planilha e grupo de WhatsApp. Pedido se perde,
   ninguém sabe o status, e a pessoa que "sabe como funciona" é gargalo. Dói todo dia.
2. **Comercial** — não aparece no Google. Quem busca pelo serviço encontra o concorrente.
   Dói todo mês, quando o pipeline está vazio.

O ICP raramente busca por "desenvolvedor". Ele busca pelo problema ("sistema de ordem
de serviço para oficina") ou pelo preço ("quanto custa fazer um site").

## Ação de conversão

Calculadora → resultado na tela → e-mail → orçamento detalhado.
Atalhos: WhatsApp (resposta no mesmo dia) e Cal.com (call de 15 min).

A ordem importa e já está implementada: o número aparece **antes** de pedir contato.

---

## 20 buscas reais do ICP

Agrupadas por intenção. A coluna "coberto por" aponta a página que responde —
o que estiver vazio é lacuna a preencher.

### Intenção de preço (fundo de funil, alta conversão)

| # | Busca | Coberto por |
|---|---|---|
| 1 | quanto custa fazer um site para empresa | `/quanto-custa/site-institucional` |
| 2 | quanto custa criar um e-commerce | `/quanto-custa/ecommerce` |
| 3 | quanto custa desenvolver um aplicativo | `/quanto-custa/app-mobile` |
| 4 | quanto custa um sistema sob medida para empresa | `/quanto-custa/mvp-saas` |
| 5 | preço de site institucional 2026 | `/calculadora-site` |
| 6 | quanto custa site em Passo Fundo | **lacuna — geo** |

### Intenção local (baixo volume, altíssima conversão, pouca concorrência)

| # | Busca | Coberto por |
|---|---|---|
| 7 | criação de sites em Passo Fundo | **lacuna — geo** |
| 8 | desenvolvedor de sistemas Passo Fundo | **lacuna — geo** |
| 9 | empresa de software Erechim | **lacuna — geo** |
| 10 | criar site Carazinho | **lacuna — geo** |

### Intenção de problema (meio de funil)

| # | Busca | Coberto por |
|---|---|---|
| 11 | sistema para controlar ordem de serviço de oficina | `/sistema-para/oficinas-mecanicas` |
| 12 | sistema de agendamento para clínica | `/sistema-para/clinicas-e-consultorios` |
| 13 | como sair da planilha na minha empresa | **lacuna — conteúdo** |
| 14 | programa para controlar entregas da transportadora | `/sistema-para/transportadoras` |
| 15 | como fugir da taxa do iFood | `/sistema-para/restaurantes-e-bares` (parcial) |
| 16 | meu site não aparece no Google o que fazer | **lacuna — conteúdo** |

### Intenção de comparação (fundo de funil, alta intenção)

| # | Busca | Coberto por |
|---|---|---|
| 17 | wix ou site próprio qual melhor | **lacuna — comparação** |
| 18 | vale a pena usar WordPress ou mandar fazer | **lacuna — comparação** |
| 19 | freelancer ou agência para fazer site | `/blog/contratar-dev-freelancer-agencia-cto-guia` |
| 20 | shopify ou loja própria qual compensa | **lacuna — comparação** |

---

## Lacunas identificadas → o que foi construído

| Lacuna | Resposta |
|---|---|
| Buscas 6-10 (local) | Eixo geográfico com dado real do CEMPRE/IBGE por município |
| Buscas 17, 18, 20 (comparação) | Eixo "alternativa a" com conta de ponto de virada |
| Buscas 13, 16 (problema) | Páginas de conteúdo com CTA para calculadora |

## Fontes de dado disponíveis no repositório

| Fonte | Onde | O que entrega |
|---|---|---|
| Modelo de precificação | `src/lib/calculadora.ts` | Faixa por tipo, volume, integração e prazo |
| CEMPRE / IBGE — setor | `src/data/setores-cempre.json` | Empresas por CNAE, Brasil e UF |
| CEMPRE / IBGE — município | `src/data/cidades-cempre.json` | Empresas e setores por cidade (497 municípios do RS disponíveis) |
| Leads | tabela `leads` | Origem, página de entrada, prazo de decisão |

**Nenhuma estatística, depoimento ou cliente foi inventado.** Todo número publicado
vem de uma das fontes acima, com carimbo e ano de referência na própria página.
