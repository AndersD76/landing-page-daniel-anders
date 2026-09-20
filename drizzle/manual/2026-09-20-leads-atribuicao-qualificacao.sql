-- Migração incremental: atribuição + qualificação de lead.
--
-- Por que manual: o projeto nunca teve pasta de migrações (usava db:push), então
-- `drizzle-kit generate` produziu um baseline 0000 que CRIA todas as tabelas.
-- Rodar aquele arquivo num banco que já existe falha. Este script aplica só o
-- delta e é idempotente — pode rodar mais de uma vez sem erro.
--
-- Aplicar:  psql "$DATABASE_URL" -f drizzle/manual/2026-09-20-leads-atribuicao-qualificacao.sql

BEGIN;

-- Prazo de decisão: é o campo que ordena a fila comercial.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_deadline') THEN
    CREATE TYPE "lead_deadline" AS ENUM ('agora', '90-dias', 'avaliando');
  END IF;
END
$$;

-- Página de ENTRADA da sessão, gravada no próprio lead (não só no evento).
-- Sem isso não dá para saber qual página gera dinheiro.
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "landing_page" varchar(500);

-- Página onde o formulário foi efetivamente enviado.
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "form_page" varchar(500);

-- Qualificação.
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "role" varchar(100);
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "scope" varchar(100);
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "deadline" "lead_deadline";

-- Índices para o relatório que importa: qual página gera lead, e a fila por prazo.
CREATE INDEX IF NOT EXISTS "leads_landing_page_idx" ON "leads" ("landing_page");
CREATE INDEX IF NOT EXISTS "leads_deadline_idx" ON "leads" ("deadline");
CREATE INDEX IF NOT EXISTS "leads_created_at_idx" ON "leads" ("created_at");

COMMIT;
