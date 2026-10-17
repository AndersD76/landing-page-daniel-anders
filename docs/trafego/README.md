# Tráfego orgânico — o que foi feito e o que falta

Última atualização: 17/10/2026.

---

## Antes e depois

| | Diagnóstico (12/09) | Hoje (17/10) |
|---|---|---|
| URLs no sitemap | 30 | **183** |
| Sitemaps | 1 | 1 índice + 7 filhos |
| Páginas respondendo busca de preço | 0 | 30 |
| Páginas respondendo busca de setor | 0 | 12 |
| Páginas respondendo busca local | 0 | 100 |
| Páginas de comparação | 0 | 5 |
| Ferramentas gratuitas sem login | 2 | 3 |
| Medição de CTA visto → clicado | não existia | funil completo |
| Origem gravada no próprio lead | não existia | sim |

**153 páginas indexáveis novas**, todas estáticas, todas com dado próprio e
fonte carimbada.

O diagnóstico apontava "zero URLs indexadas" e "preços só dentro do JSON-LD,
invisíveis ao visitante". As duas coisas foram corrigidas.

---

## Commits

| Commit | O que entrou |
|---|---|
| `8c4065f` | Eixo de custo (30 páginas), quality gate, atribuição de lead, sitemap segmentado |
| `7d214ae` | `/llms.txt` gerado do dado em vez de mantido à mão |
| `770690d` | Preço em JSON-LD passa a vir da calculadora + auditoria que trava regressão |
| `23397b9` | Script de IndexNow a partir dos sitemaps publicados |
| `f7e7001` | **seo: destravar indexação** — `/cursos` fora do índice, host canônico, ESLint de verdade, contexto |
| `c9b9304` | Eixo geográfico — 100 municípios do RS com CEMPRE/IBGE |
| `77d0425` | Eixo de comparação — 5 páginas "alternativa a X" com ponto de virada |
| `3dbc31b` | Medição própria de tráfego + painel `/admin/trafego` |
| `2abfbee` | Kit de distribuição + 2 posts fechando lacunas de conteúdo |

---

## Os quatro eixos

Cada um existe porque tem **dado próprio** que muda de página para página. O
quality gate reprova o que não tiver — página reprovada sai com `noindex` e
fica fora do sitemap.

### 1. Custo — `/quanto-custa` (30)
Tipo de projeto e tipo × integração. A faixa vem de `calcularEstimativa()`
sobre a tabela de preços. Nenhum preço é digitado na página.

### 2. Setor — `/sistema-para` (12)
Mercado (CEMPRE/IBGE) + preço (calculadora) + conteúdo editorial próprio do
setor. O que uma clínica precisa não é o que uma oficina precisa.

### 3. Geográfico — `/sites-e-sistemas` (100)
**O eixo mais arriscado, e vale dizer por quê:** o preço de um site não muda em
Carazinho. O que justifica a página é a sobre-representação setorial — Gramado
tem hospedagem a 3,2x a média do RS, Caxias tem indústria a 1,59x. A página diz
explicitamente que o preço não varia por cidade.

### 4. Comparação — `/alternativa-a` (5)
**Nenhum preço de concorrente é publicado.** Mensalidade de plataforma muda sem
aviso e publicar número desatualizado seria inventar dado. O visitante informa
o que paga e a página calcula o ponto de virada.

---

## Como verificar que continua de pé

```bash
npm.cmd run verificar
```

Roda quatro checagens: contrato dos formulários (payload literal de cada tela),
quality gate dos quatro eixos, auditoria de preço escrito à mão em JSON-LD, e
SEO sobre o HTML gerado (título/description/H1/canonical únicos, JSON-LD
parseável, carimbo de fonte, coerência entre `noindex` e sitemap).

```bash
npm.cmd run build && npm.cmd run lint   # antes de qualquer commit
npm.cmd run carregar:cempre             # quando o IBGE publicar ano novo
npm.cmd run carregar:cidades            # idem, eixo geográfico
npm.cmd run avisar:indexnow             # DEPOIS do deploy, nunca antes
```

> Use `npm.cmd`, não `npm`: a política de execução do PowerShell bloqueia o
> wrapper `npm.ps1`. Para resolver de vez:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

---

## O que SÓ VOCÊ pode fazer

Em ordem de retorno. Os três primeiros valem mais que todo o resto somado.

### Hoje — 50 minutos

| # | O quê | Tempo | Por quê |
|---|---|---|---|
| 1 | **Google Search Console**: adicionar `www.andersdev.com.br`, enviar `sitemap.xml`, pedir indexação de `/quanto-custa`, `/sistema-para`, `/sites-e-sistemas`, `/alternativa-a` | 15 min | O Google não participa do IndexNow e desativou o ping de sitemap em 2023. Sem isso, as 153 páginas novas podem levar meses para serem descobertas. **É o maior gargalo que existe agora.** |
| 2 | **Google Business Profile**: criar o perfil | 20 min + espera | Único item que coloca você no mapa e no bloco local. Para "desenvolvedor Passo Fundo", vale mais que qualquer backlink. A verificação demora dias — comece hoje. |
| 3 | **Bing Webmaster Tools**: importar do Search Console | 5 min | Um clique depois do item 1. Alimenta Bing e Copilot. |
| 4 | **Rotacionar a senha do Neon** | 10 min | A credencial atual passou por chat e deve ser considerada comprometida. |

### Esta semana — 2h30

| # | O quê | Tempo |
|---|---|---|
| 5 | **GA4**: marcar `cta_clicado` e `lead_enviado` como eventos-chave | 15 min |
| 6 | **Configurar o DNS do apex** `andersdev.com.br` apontando para o app (hoje não resolve; o redirect para `www` já está no código) | 20 min |
| 7 | **Publicar os 3 primeiros posts** de `distribuicao/linkedin.md` | 30 min |
| 8 | **Cadastrar nos 5 primeiros** de `distribuicao/diretorios.md` | 1h |
| 9 | **Gravar os 5 Shorts** de `distribuicao/youtube-shorts.md` no mesmo dia | 1h |

### Próximas duas semanas

| # | O quê | Tempo |
|---|---|---|
| 10 | Diretórios 6 a 10 | 2h |
| 11 | Primeira leva de outbound: 10 contatos/dia, pesquisados um a um | 30 min/dia |
| 12 | Mensagens de WhatsApp, um grupo por dia no máximo | 10 min/dia |
| 13 | Decidir o que fazer com `/cursos`: publicar um curso real ou manter fora do índice | 1h |

### Decisão de precificação pendente

`services.ts` anuncia "MVP simples a partir de R$ 5.000" e a calculadora parte
de **R$ 15.000** para MVP SaaS. Ou são escopos diferentes e falta deixar isso
claro, ou um dos dois está defasado. É decisão sua — está registrada no commit
`770690d` desde setembro.

Além disso, `npm run auditar:precos` lista **39 preços escritos à mão** em
páginas de marketing (`para-pmes-brasil`, `para-startups`, `apps`,
`agencias-parceiras`). Não quebram nada hoje, mas envelhecem sozinhos quando a
tabela mudar. Candidatos a usar `faixaDoTipo()`.

---

## Rotina diária de 30 minutos — 4 semanas

Uma tarefa por dia. Não acumule: distribuição é constância, não volume.

### Semana 1 — fundação

| Dia | 30 minutos |
|---|---|
| Seg | Search Console + Bing Webmaster (itens 1 e 3) |
| Ter | Google Business Profile (item 2) |
| Qua | LinkedIn post 1 + responder comentários |
| Qui | Diretórios: LinkedIn empresa + GitHub |
| Sex | LinkedIn post 2 + conferir `/admin/trafego` (7 dias) |

### Semana 2 — presença local

| Dia | 30 minutos |
|---|---|
| Seg | LinkedIn post 3 |
| Ter | Sebrae RS + CDL Passo Fundo |
| Qua | LinkedIn post 4 + 1 grupo de WhatsApp |
| Qui | ACISA + Clutch |
| Sex | LinkedIn post 5 + revisar o funil em `/admin/trafego` |

### Semana 3 — conteúdo e vídeo

| Dia | 30 minutos |
|---|---|
| Seg | Gravar 2 Shorts |
| Ter | LinkedIn post 6 + publicar Short 1 |
| Qua | Gravar 3 Shorts restantes |
| Qui | LinkedIn post 7 + 1 grupo de WhatsApp |
| Sex | LinkedIn post 8 + publicar Short 2 |

### Semana 4 — prospecção

| Dia | 30 minutos |
|---|---|
| Seg | Outbound: 10 contatos pesquisados, e-mail 1 |
| Ter | LinkedIn post 9 + WhatsApp 1 para quem não respondeu |
| Qua | Outbound: e-mail 2 da leva anterior + 10 contatos novos |
| Qui | LinkedIn post 10 + publicar Short 3 |
| Sex | **Revisão do mês**: funil em `/admin/trafego` (30 dias) |

### O que olhar na revisão de sexta

Em `/admin/trafego`, nesta ordem:

1. **Sessões subiram?** Se não, o problema é distribuição — mais volume.
2. **Qual origem trouxe mais?** Dobre o que funcionou.
3. **Taxa de "viram o CTA" sobre sessões.** Baixa significa que as pessoas saem
   antes de chegar lá: o CTA está fundo demais na página.
4. **Taxa de "clicaram" sobre "viram".** Baixa significa que a oferta não
   convence — mexa no texto, não na posição.
5. **Tabela "qual página gera lead".** É a única que diz onde está o dinheiro.

Sem o passo 3 não dá para distinguir "a oferta não convence" de "ninguém chegou
a ver o botão". São problemas opostos com soluções opostas.

---

## Expectativa honesta de prazo

| Quando | O que esperar |
|---|---|
| Semana 1–2 | Google começa a rastrear. Impressões no Search Console, quase nenhum clique. |
| Semana 3–6 | Primeiras páginas indexadas aparecem para busca de cauda longa. Visitas em unidades. |
| Mês 2–3 | Páginas de cidade e de setor começam a ranquear para busca local, que tem pouca concorrência. Primeiros leads orgânicos. |
| Mês 4–6 | Páginas de preço disputam termos com volume. É quando o investimento começa a aparecer de verdade. |

**Nada disso acontece se o item 1 não for feito.** O Google precisa receber o
sitemap. Tudo o mais nesta lista depende disso.
