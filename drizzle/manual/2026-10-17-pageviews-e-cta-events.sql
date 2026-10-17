-- Espelho local de tráfego: pageviews + eventos de CTA.
--
-- Por que no mesmo banco do lead: para responder "qual página gerou dinheiro"
-- com um join, em vez de exportar do GA4 e cruzar na planilha.
--
-- Sem PII por desenho: nada de IP, nada de user-agent cru. O session_id é
-- aleatório, vive no sessionStorage do visitante e morre com a aba.
--
-- Idempotente: pode rodar mais de uma vez.
-- Aplicar: DATABASE_URL="..." node scripts/aplicar-migracao.mjs drizzle/manual/2026-10-17-pageviews-e-cta-events.sql

BEGIN;

CREATE TABLE IF NOT EXISTS "pageviews" (
  "id"            serial PRIMARY KEY,
  "path"          varchar(500) NOT NULL,
  "landing_page"  varchar(500),
  "referrer_host" varchar(255),
  "utm_source"    varchar(255),
  "utm_medium"    varchar(255),
  "utm_campaign"  varchar(255),
  "session_id"    varchar(64) NOT NULL,
  "device"        varchar(20),
  "created_at"    timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "pageviews_created_at_idx" ON "pageviews" ("created_at");
CREATE INDEX IF NOT EXISTS "pageviews_path_idx"       ON "pageviews" ("path");
CREATE INDEX IF NOT EXISTS "pageviews_session_idx"    ON "pageviews" ("session_id");

CREATE TABLE IF NOT EXISTS "cta_events" (
  "id"         serial PRIMARY KEY,
  "tipo"       varchar(20) NOT NULL,
  "path"       varchar(500) NOT NULL,
  "escopo"     varchar(150),
  "session_id" varchar(64) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "cta_events_created_at_idx" ON "cta_events" ("created_at");
CREATE INDEX IF NOT EXISTS "cta_events_tipo_idx"       ON "cta_events" ("tipo");

COMMIT;
