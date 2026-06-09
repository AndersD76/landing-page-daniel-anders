# HANDOFF — andersdev.com.br

---

# Parte 1 — Segurança

## O que foi feito

### Lote 1 — Credenciais + Injection + Timing Attack
- [x] `api/.env` com credencial NeonDB em texto plano **removido do disco**
- [x] HTML injection corrigido em todos os templates de email (escapeHtml)
- [x] Comparação de tokens trocada para `timingSafeEqual` (constant-time) em 6 rotas

### Lote 2 — Rate Limiting + Validação + Headers
- [x] Rate limiter reescrito com cleanup automático (sem memory leak)
- [x] IP detection via último hop do `x-forwarded-for` (anti-spoofing)
- [x] Rate limiting adicionado em TODAS as 6 API routes (era só 1)
- [x] `.max()` adicionado em todos os campos Zod (anti-payload abuse)
- [x] 6 security headers configurados: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [x] `X-Powered-By` desabilitado

### Lote 3 — Auth Admin + Dependências
- [x] Auth admin migrado de sessionStorage para cookie HttpOnly + SameSite=Strict
- [x] Endpoint `/api/admin/auth` (POST login, DELETE logout) com rate limiting
- [x] API routes admin aceitam cookie OU Bearer token
- [x] `drizzle-orm` atualizado para versão sem SQL injection (GHSA-gpj5-g38j-94v9)

### Lote 4 — LGPD
- [x] Endpoint `/api/newsletter/unsubscribe` criado
- [x] URL de unsubscribe usa token HMAC (email não exposto na query string)
- [x] Subscribers com status "unsubscribed" excluídos do cron de nurture

---

## O que VOCÊ precisa fazer

### Railway (deploy)
- **Rotacionar a senha do banco NeonDB** — a credencial antiga estava em `api/.env` no disco (nunca foi commitada ao git, mas esteve no OneDrive). Acesse o painel NeonDB e resete a senha, depois atualize `DATABASE_URL` no Railway.
- **Verificar `ADMIN_PASSWORD`** — use uma senha forte (20+ chars, aleatória). Atualize no Railway se a atual for fraca.
- **Verificar `CRON_SECRET`** — mesmo critério.
- **Redeploy** após o push para ativar os security headers e a nova auth.

### NeonDB
- **Rotacionar credenciais** do role `neondb_owner` (a senha `npg_gCrzq1Shf9ud` foi exposta no disco).

### DNS / Cloudflare (se aplicável)
- N/A (HSTS já configurado nos headers do app).

### Search Console / Analytics
- N/A

### Pagamento
- N/A (não há processamento de pagamento)

### E-mail (Resend)
- **Rotacionar `RESEND_API_KEY`** se desejar (não estava exposta, mas boa prática).
- **Considerar double opt-in** para newsletter quando o volume de subscribers crescer.

### Segredos
| Variável | Onde atualizar | Ação |
|---|---|---|
| `DATABASE_URL` | Railway + NeonDB | **ROTACIONAR** — credencial exposta em disco |
| `ADMIN_PASSWORD` | Railway | Verificar força (20+ chars) |
| `CRON_SECRET` | Railway | Verificar força (20+ chars) |
| `RESEND_API_KEY` | Railway | Opcional — rotacionar por boa prática |

---

## Vulnerabilidades residuais (sem fix disponível)
- `postcss <8.5.10` — dependência interna do Next.js 16, aguardar update upstream
- `esbuild <=0.24.2` — dev-only, risco apenas em ambiente de desenvolvimento local

---

# Parte 2 — Exposição / Descoberta

## O que foi feito

### Lote 1 — Fundação de descoberta
- [x] `public/llms.txt` criado — guia para motores de IA (ChatGPT, Perplexity, Claude) com serviços, páginas, contato e stack
- [x] IndexNow configurado — chave `db16d61e067044d48b75f2edbbe3fd1a` + arquivo de verificação + rota `POST /api/indexnow` (protegida por CRON_SECRET) que pinga todas as URLs do sitemap
- [x] Eventos de conversão GA4/Plausible adicionados nos 3 formulários: `lead_form_submit` (ContactForm), `newsletter_subscribe` (NewsletterForm), `lead_magnet_download` (lead magnet)
- [x] hreflang corrigido — removido `alternateLocale: "en_US"` (não existem páginas EN)

### Lote 2 — Superfície qualificada
- [x] Interlinks blog↔serviço: cada blog post mostra "Serviços relacionados" e cada service page mostra "Artigos relacionados" — mapeamento em `src/data/interlinks.ts`
- [x] Lead magnet ("E-book Grátis") adicionado na navbar (desktop + mobile) e no footer
- [x] PWA manifest (`public/manifest.json`) + `<link rel="manifest">` + `<meta name="theme-color">`
- [x] Admin pages (`/admin`, `/admin/leads`) com `noindex, nofollow` via layout metadata

---

## O que VOCÊ precisa fazer

### Google Search Console (GSC)
- **Verificar propriedade** de `andersdev.com.br` no GSC (via DNS TXT ou tag HTML)
- Após verificação: **enviar sitemap** → `https://andersdev.com.br/sitemap.xml`
- **Inspecionar URL** da homepage para forçar indexação inicial
- **Valor para DNS TXT**: obtido no painel do GSC → Configurações → Verificação de propriedade → Provedor de domínio

### Bing Webmaster Tools
- **Verificar propriedade** via DNS CNAME ou meta tag
- Enviar sitemap
- IndexNow é nativo do Bing — basta disparar `POST /api/indexnow` com `Authorization: Bearer {CRON_SECRET}` após cada deploy

### DNS — SPF / DKIM / DMARC (e-mail)
Para garantir que os emails do Resend não caiam em spam:

| Registro | Tipo | Nome | Valor |
|---|---|---|---|
| SPF | TXT | `@` ou `andersdev.com.br` | `v=spf1 include:send.resend.com ~all` |
| DKIM | CNAME | Conforme Resend | Copiar do painel Resend → Domains → andersdev.com.br |
| DMARC | TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:danielanders76@gmail.com` |

> Acesse **Resend → Domains → andersdev.com.br** para obter os valores exatos de DKIM.

### Google Tag Manager (GTM) — Server-side (opcional, recomendado)
- Criar container GTM server-side no GCP/Cloudflare Workers
- Vantagens: bypass de ad-blockers, reduz peso do client, melhora dados de conversão
- **Quando**: quando tiver volume de tráfego suficiente para justificar (~500+ sessões/mês)
- Custo: ~US$5-10/mês no GCP

### Consent Mode v2 (obrigatório para Google Ads)
- Se usar Google Ads: implementar **Consent Mode v2** com banner de consentimento (cookieyes.com ou osano.com — gratuitos até certo volume)
- Mapear `analytics_storage` e `ad_storage` como `denied` por padrão → conceder após aceite
- **Quando**: antes de rodar qualquer campanha Google Ads

### IndexNow — Automação no deploy
- Adicionar ao script de deploy (Railway) um `curl` pós-deploy:
  ```bash
  curl -X POST https://andersdev.com.br/api/indexnow \
    -H "Authorization: Bearer $CRON_SECRET" \
    -H "Content-Type: application/json"
  ```
- Alternativa: criar webhook no Railway que chame a rota após cada deploy

### GA4 — Configurar conversões
- No GA4 (admin → Events): marcar como **conversão**:
  - `lead_form_submit`
  - `newsletter_subscribe`
  - `lead_magnet_download`
- Verificar no **DebugView** que os eventos estão disparando corretamente

### Plausible Analytics
- Configurar **goals** para os mesmos 3 eventos acima

### Robots.txt — Decisão sobre crawlers de IA
- Atualmente permitidos (sem bloqueio). Se quiser bloquear/permitir seletivamente, adicionar em `src/app/robots.ts`:
  ```
  User-agent: GPTBot     # OpenAI
  User-agent: ClaudeBot   # Anthropic
  User-agent: PerplexityBot
  User-agent: Google-Extended  # Gemini training
  Allow: /                # ou Disallow: / para bloquear
  ```

---

## Resumo de ações por plataforma

| Plataforma | Ação | Prioridade |
|---|---|---|
| GSC | Verificar + enviar sitemap | **Alta** |
| Bing Webmaster | Verificar + enviar sitemap | Média |
| DNS (registrar) | SPF + DKIM + DMARC | **Alta** |
| GA4 | Marcar 3 eventos como conversão | **Alta** |
| Plausible | Configurar 3 goals | Média |
| Railway | Webhook pós-deploy → IndexNow | Média |
| GTM server-side | Migrar quando >500 sessões/mês | Baixa |
| Consent Mode v2 | Antes de Google Ads | Condicional |
| Robots/IA | Decidir política de crawlers IA | Baixa |

---

# Parte 3 — Growth / AndersDev (2026-06-08)

## O que foi feito

### SEO Local — Posicionamento AndersDev + Passo Fundo
- [x] Title tag reescrito: "AndersDev | Desenvolvimento de Sites, Apps e Sistemas | Passo Fundo RS"
- [x] Meta description reescrita em PT-BR com foco local
- [x] 14 keywords geo-targeted adicionadas ("desenvolvimento de sites passo fundo", "criar aplicativo passo fundo", etc.)
- [x] OpenGraph e Twitter Card tags reescritas em PT-BR
- [x] Sitemap.xml estatico removido (conflitava com sitemap.ts dinamico)
- [x] Sitemap.ts atualizado: /apps e /apps/calculadora adicionadas (total: 9 paginas estaticas + 8 servicos + 10 blog posts)

### Schema Markup — LocalBusiness completo
- [x] Schema `LocalBusiness` + `ProfessionalService` adicionado com:
  - Endereco completo: Rua Uruguai, 679 - Sala 201, Passo Fundo RS, 99010-112
  - Telefones: fixo (54) 3045-6478 e celular (54) 9.9964-8368
  - Coordenadas geo: -28.2625, -52.4069
  - Area de atendimento: Passo Fundo + Rio Grande do Sul
  - Horario de funcionamento: Seg-Sex 09:00-18:00
  - 8 tipos de servico em PT-BR
  - priceRange: "$$"
- [x] FAQ Schema reescrito em PT-BR com 4 perguntas locais:
  - "Quanto custa criar um site profissional em Passo Fundo?"
  - "Quanto tempo leva para desenvolver um aplicativo ou sistema?"
  - "A AndersDev atende empresas de outras cidades?"
  - "Quais servicos de desenvolvimento a AndersDev oferece?"
- [x] Reviews traduzidas para PT-BR
- [x] Brand atualizado de "AndersD76" para "AndersDev"

### Conteudo SEO — 5 artigos de blog locais
- [x] "Quanto custa criar um site profissional em 2026" (slug: quanto-custa-criar-site-profissional-2026)
- [x] "Site ou aplicativo: qual sua empresa precisa?" (slug: site-ou-aplicativo-qual-empresa-precisa)
- [x] "5 sinais de que sua empresa precisa de um sistema personalizado" (slug: 5-sinais-empresa-precisa-sistema-personalizado)
- [x] "E-commerce: como comecar a vender online" (slug: ecommerce-como-comecar-vender-online)
- [x] "Por que ter um app mobile para sua empresa" (slug: por-que-ter-app-mobile-empresa)
- [x] Interlinks blog-servicos configurados para todos os 5 artigos novos

### Infraestrutura
- [x] manifest.json atualizado para "AndersDev" (nome + descricao em PT-BR)
- [x] llms.txt reescrito em PT-BR com servicos, endereco completo, e keywords locais
- [x] Cal.com link atualizado em 14 arquivos: `cal.com/danielanders/15min` → `cal.com/daniel-anders-emx5kl`

---

## O que VOCE precisa fazer

### Railway — Deploy + GA4
- **Push para o branch principal** para triggerar deploy automatico
- **Adicionar variavel de ambiente no Railway**:
  ```
  NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
  ```
  Como descobrir o ID: GA4 → Admin → Data Streams → Web → Measurement ID (formato `G-...`, NAO e o Property ID 540463482)
- **IMPORTANTE**: Sem essa variavel, o GA4 NAO CARREGA. O componente Analytics.tsx so renderiza o script se `NEXT_PUBLIC_GA_MEASUREMENT_ID` existir. E por isso que o GA4 mostra zero.
- **Atualizar tambem**: `NEXT_PUBLIC_SITE_URL=https://www.andersdev.com.br`
- **Apos deploy**: abrir o site, ir em GA4 → Tempo Real → se aparecer 1 usuario ativo, esta funcionando
- **Verificar meta tags**: abrir `view-source:www.andersdev.com.br` e conferir title + description
- **Testar schema**: colar URL no https://search.google.com/test/rich-results

### DNS — Dominio sem www
- **PROBLEMA**: `andersdev.com.br` (sem www) retorna conexao recusada. So `www.andersdev.com.br` funciona.
- **Fix**: No painel do registrador de dominio, configurar:
  - Registro A ou CNAME para `andersdev.com.br` (raiz) apontando pro Railway
  - OU redirect 301 de `andersdev.com.br` → `www.andersdev.com.br`
- **Prioridade: CRITICA** — metade das pessoas digita URL sem www, e os links antigos apontam pra la. Todas as canonical URLs do codigo agora usam `www.andersdev.com.br`.

### Cal.com
- **Verificar** se o link `https://cal.com/daniel-anders-emx5kl` esta funcionando
- Se o link antigo (`cal.com/danielanders/15min`) era o correto, reverter com busca/replace global

### Google Meu Negocio (Google Business Profile)
- **Criar perfil** em https://business.google.com com:
  - Nome: "AndersDev — Desenvolvimento de Software"
  - Categoria: "Empresa de desenvolvimento de software" + "Desenvolvimento de sites"
  - Endereco: Rua Uruguai, 679 - Sala 201, Passo Fundo - RS, 99010-112
  - Telefone: (54) 3045-6478
  - WhatsApp: (54) 9.9964-8368
  - Site: https://www.andersdev.com.br
  - Horario: Seg-Sex 09:00-18:00
- **Solicitar verificacao** (geralmente por carta ou telefone)
- **Prioridade: ALTA** — Google Meu Negocio e o fator #1 para aparecer no "Local Pack" (mapa do Google)

### Google Search Console
- **Verificar propriedade** de `www.andersdev.com.br`
- **Reenviar sitemap** apos deploy: `https://www.andersdev.com.br/sitemap.xml`
- **Solicitar indexacao** das 5 novas paginas de blog

### Pagamento
- N/A

### E-mail
- N/A

---

## Resumo de acoes (Parte 3)

| Plataforma | Acao | Prioridade |
|---|---|---|
| Railway | Adicionar `NEXT_PUBLIC_GA_MEASUREMENT_ID` + deploy | **CRITICA** |
| DNS | Corrigir dominio sem www (redirect ou CNAME) | **CRITICA** |
| Google Meu Negocio | Criar perfil completo | **Alta** |
| GSC | Verificar propriedade www + reenviar sitemap | **Alta** |
| Cal.com | Verificar link `daniel-anders-emx5kl` | Media |
| Rich Results Test | Testar schema markup | Media |
