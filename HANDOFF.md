# HANDOFF — Segurança (andersdev.com.br)

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
