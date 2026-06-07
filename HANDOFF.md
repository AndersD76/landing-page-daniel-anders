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
