-- aplicar-no-boot
--
-- Crescimento orgânico: telemetria com first/last-touch, monitores (GSC, Bing,
-- GA4, posições, SERP, crawlers), conteúdo (mapa de buscas, fila, qualidade,
-- registro de páginas, ondas), iscas e sequências, alvos de link e
-- distribuição.
--
-- Só ADITIVO e idempotente: CREATE ... IF NOT EXISTS e ADD COLUMN IF NOT
-- EXISTS. Aplicado automaticamente na inicialização do servidor
-- (src/lib/ops/boot.ts) e registrado em _migracoes. Pode rodar à mão também:
--   DATABASE_URL="..." node scripts/aplicar-migracao.mjs drizzle/manual/2026-11-18-crescimento-organico.sql
--
-- Toda tabela é espelho migrável: colunas simples, sem tipo exótico, para sair
-- daqui com INSERT ... SELECT para qualquer outro Postgres/warehouse.

CREATE TABLE IF NOT EXISTS "_migracoes" (
  "arquivo"     varchar(255) PRIMARY KEY,
  "aplicada_em" timestamp DEFAULT now() NOT NULL
);

-- ---------------------------------------------------------------- telemetria

CREATE TABLE IF NOT EXISTS "eventos" (
  "id"             bigserial PRIMARY KEY,
  "nome"           varchar(60) NOT NULL,
  "path"           varchar(500),
  "page_type"      varchar(30),
  "cluster"        varchar(40),
  "consulta_alvo"  varchar(200),
  "isca_id"        varchar(60),
  "session_id"     varchar(64),
  "canal"          varchar(20),
  "props"          jsonb,
  "ft_canal"       varchar(20),
  "ft_origem"      varchar(255),
  "ft_landing"     varchar(500),
  "ft_utm_source"  varchar(255),
  "ft_utm_medium"  varchar(255),
  "ft_utm_campaign" varchar(255),
  "ft_em"          timestamp,
  "lt_canal"       varchar(20),
  "lt_origem"      varchar(255),
  "lt_landing"     varchar(500),
  "lt_utm_source"  varchar(255),
  "lt_utm_medium"  varchar(255),
  "lt_utm_campaign" varchar(255),
  "device"         varchar(20),
  "origem_registro" varchar(20) DEFAULT 'navegador' NOT NULL,
  "created_at"     timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "eventos_created_idx" ON "eventos" ("created_at");
CREATE INDEX IF NOT EXISTS "eventos_nome_idx" ON "eventos" ("nome", "created_at");
CREATE INDEX IF NOT EXISTS "eventos_path_idx" ON "eventos" ("path");
CREATE INDEX IF NOT EXISTS "eventos_isca_idx" ON "eventos" ("isca_id");
CREATE INDEX IF NOT EXISTS "eventos_session_idx" ON "eventos" ("session_id");

ALTER TABLE "pageviews" ADD COLUMN IF NOT EXISTS "canal" varchar(20);
ALTER TABLE "pageviews" ADD COLUMN IF NOT EXISTS "page_type" varchar(30);
ALTER TABLE "pageviews" ADD COLUMN IF NOT EXISTS "cluster" varchar(40);
CREATE INDEX IF NOT EXISTS "pageviews_canal_idx" ON "pageviews" ("canal");

-- Lead carrega a origem completa e o consentimento de marketing, separado.
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "isca_id" varchar(60);
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "cluster" varchar(40);
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "canal" varchar(20);
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "atribuicao" jsonb;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "optin_marketing" boolean DEFAULT false NOT NULL;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "optin_em" timestamp;
-- Venda registrada no servidor (painel), nunca pelo navegador.
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "valor_fechado" numeric(12, 2);
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "fechado_em" timestamp;
CREATE INDEX IF NOT EXISTS "leads_isca_idx" ON "leads" ("isca_id");

-- ------------------------------------------------------------ mapa de buscas

CREATE TABLE IF NOT EXISTS "mapa_buscas" (
  "id"               serial PRIMARY KEY,
  "consulta"         varchar(200) NOT NULL UNIQUE,
  "intencao"         varchar(20) NOT NULL,
  "cluster"          varchar(40) NOT NULL,
  "tipo_pagina"      varchar(30) NOT NULL,
  "isca_id"          varchar(60),
  "volume"           integer,
  "volume_fonte"     varchar(40),
  "dificuldade"      integer,
  "dificuldade_fonte" varchar(40),
  "posicao_autocomplete" integer,
  "prioridade"       integer NOT NULL DEFAULT 0,
  "fonte"            varchar(20) NOT NULL,
  "semente"          varchar(200),
  "url_alvo"         varchar(500),
  "status"           varchar(20) NOT NULL DEFAULT 'sem_pagina',
  "coletado_em"      date,
  "atualizado_em"    timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "mapa_buscas_cluster_idx" ON "mapa_buscas" ("cluster", "prioridade");
CREATE INDEX IF NOT EXISTS "mapa_buscas_status_idx" ON "mapa_buscas" ("status", "prioridade");

-- ------------------------------------------------- conteúdo, gate e ondas

CREATE TABLE IF NOT EXISTS "paginas_registro" (
  "url"              varchar(500) PRIMARY KEY,
  "tipo"             varchar(30) NOT NULL,
  "cluster"          varchar(40),
  "consulta"         varchar(200),
  "matriz"           varchar(60),
  "isca_id"          varchar(60),
  "onda"             integer,
  "status"           varchar(20) NOT NULL,
  "gate_ok"          boolean,
  "palavras"         integer,
  "revisado_em"      date,
  "publicada_em"     date,
  "no_sitemap"       boolean DEFAULT false NOT NULL,
  "indexnow_em"      timestamp,
  "sitemap_enviado_em" timestamp,
  "indexada"         boolean,
  "cobertura"        varchar(120),
  "ultimo_rastreio"  timestamp,
  "verificada_em"    timestamp,
  "atualizado_em"    timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "paginas_registro_tipo_idx" ON "paginas_registro" ("tipo", "status");

CREATE TABLE IF NOT EXISTS "qualidade_resultados" (
  "url"              varchar(500) PRIMARY KEY,
  "tipo"             varchar(30),
  "aprovado"         boolean NOT NULL,
  "publicavel"       boolean NOT NULL,
  "palavras"         integer,
  "similaridade_max" real,
  "par_similar"      varchar(500),
  "reprovacoes"      jsonb,
  "checagens"        jsonb,
  "avaliado_em"      timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "fila_conteudo" (
  "id"           serial PRIMARY KEY,
  "consulta"     varchar(200) NOT NULL,
  "tipo"         varchar(30) NOT NULL,
  "cluster"      varchar(40) NOT NULL,
  "matriz"       varchar(60),
  "celula"       jsonb,
  "prioridade"   integer DEFAULT 0 NOT NULL,
  "status"       varchar(20) DEFAULT 'pendente' NOT NULL,
  "motivo"       text,
  "conteudo"     jsonb,
  "tentativas"   integer DEFAULT 0 NOT NULL,
  "criado_em"    timestamp DEFAULT now() NOT NULL,
  "atualizado_em" timestamp DEFAULT now() NOT NULL,
  UNIQUE ("consulta", "tipo")
);
CREATE INDEX IF NOT EXISTS "fila_conteudo_status_idx" ON "fila_conteudo" ("status", "prioridade");

CREATE TABLE IF NOT EXISTS "ondas" (
  "numero"        integer PRIMARY KEY,
  "libera_em"     date NOT NULL,
  "paginas"       integer DEFAULT 0 NOT NULL,
  "por_tipo"      jsonb,
  "indexadas"     integer,
  "taxa_indexacao" real,
  "avaliada_em"   timestamp,
  "status"        varchar(20) DEFAULT 'agendada' NOT NULL
);

-- ---------------------------------------------------------- monitores

CREATE TABLE IF NOT EXISTS "gsc_desempenho" (
  "data"        date NOT NULL,
  "pagina"      varchar(500) NOT NULL,
  "consulta"    varchar(300) NOT NULL DEFAULT '',
  "dispositivo" varchar(20) NOT NULL DEFAULT '',
  "cliques"     integer NOT NULL,
  "impressoes"  integer NOT NULL,
  "ctr"         real,
  "posicao"     real,
  PRIMARY KEY ("data", "pagina", "consulta", "dispositivo")
);
CREATE INDEX IF NOT EXISTS "gsc_desempenho_consulta_idx" ON "gsc_desempenho" ("consulta");

CREATE TABLE IF NOT EXISTS "bing_desempenho" (
  "data"       date NOT NULL,
  "pagina"     varchar(500) NOT NULL DEFAULT '',
  "consulta"   varchar(300) NOT NULL DEFAULT '',
  "cliques"    integer NOT NULL,
  "impressoes" integer NOT NULL,
  "posicao"    real,
  PRIMARY KEY ("data", "pagina", "consulta")
);

CREATE TABLE IF NOT EXISTS "ga4_diario" (
  "data"       date NOT NULL,
  "pagina"     varchar(500) NOT NULL,
  "canal"      varchar(60) NOT NULL,
  "sessoes"    integer,
  "usuarios"   integer,
  "eventos_chave" integer,
  PRIMARY KEY ("data", "pagina", "canal")
);

CREATE TABLE IF NOT EXISTS "posicoes" (
  "data"       date NOT NULL,
  "consulta"   varchar(300) NOT NULL,
  "pagina"     varchar(500) NOT NULL DEFAULT '',
  "posicao"    real,
  "impressoes" integer,
  "cliques"    integer,
  "fonte"      varchar(20) NOT NULL DEFAULT 'gsc',
  PRIMARY KEY ("data", "consulta", "pagina", "fonte")
);

CREATE TABLE IF NOT EXISTS "serp_checagens" (
  "id"          serial PRIMARY KEY,
  "data"        date NOT NULL,
  "consulta"    varchar(300) NOT NULL,
  "top3"        jsonb,
  "recursos"    jsonb,
  "ai_overview" boolean,
  "citados"     jsonb,
  "nossa_posicao" integer,
  "citado_no_ai_overview" boolean,
  "fonte"       varchar(40),
  UNIQUE ("data", "consulta")
);

CREATE TABLE IF NOT EXISTS "crawler_hits" (
  "id"          bigserial PRIMARY KEY,
  "bot"         varchar(40) NOT NULL,
  "familia"     varchar(20) NOT NULL,
  "path"        varchar(500) NOT NULL,
  "ip"          varchar(64),
  "user_agent"  varchar(400),
  "verificado"  boolean,
  "created_at"  timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "crawler_hits_created_idx" ON "crawler_hits" ("created_at");
CREATE INDEX IF NOT EXISTS "crawler_hits_bot_idx" ON "crawler_hits" ("bot", "created_at");
CREATE INDEX IF NOT EXISTS "crawler_hits_path_idx" ON "crawler_hits" ("path");

CREATE TABLE IF NOT EXISTS "anotacoes" (
  "id"         serial PRIMARY KEY,
  "tipo"       varchar(20) NOT NULL,
  "titulo"     varchar(300) NOT NULL,
  "detalhe"    text,
  "referencia" varchar(200) UNIQUE,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "linha_base" (
  "data"     date PRIMARY KEY,
  "metricas" jsonb NOT NULL,
  "fontes_ausentes" jsonb,
  "gravada_em" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "integracoes_execucoes" (
  "id"         serial PRIMARY KEY,
  "job"        varchar(60) NOT NULL,
  "ok"         boolean NOT NULL,
  "detalhe"    text,
  "linhas"     integer,
  "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "integracoes_execucoes_job_idx" ON "integracoes_execucoes" ("job", "created_at");

CREATE TABLE IF NOT EXISTS "alertas_enviados" (
  "chave"      varchar(200) PRIMARY KEY,
  "enviado_em" timestamp DEFAULT now() NOT NULL
);

-- --------------------------------------------------------- iscas e e-mail

CREATE TABLE IF NOT EXISTS "sequencias_inscricoes" (
  "id"            serial PRIMARY KEY,
  "email"         varchar(255) NOT NULL,
  "nome"          varchar(255),
  "cluster"       varchar(40) NOT NULL,
  "lead_id"       integer,
  "passo"         integer DEFAULT 0 NOT NULL,
  "proximo_envio_em" timestamp,
  "status"        varchar(20) DEFAULT 'ativa' NOT NULL,
  "created_at"    timestamp DEFAULT now() NOT NULL,
  UNIQUE ("email", "cluster")
);
CREATE INDEX IF NOT EXISTS "sequencias_proximo_idx" ON "sequencias_inscricoes" ("status", "proximo_envio_em");

-- ------------------------------------------------------ off-page e distribuição

CREATE TABLE IF NOT EXISTS "alvos_link" (
  "id"            serial PRIMARY KEY,
  "nome"          varchar(200) NOT NULL UNIQUE,
  "url"           varchar(500),
  "tipo"          varchar(40) NOT NULL,
  "regiao"        varchar(60),
  "pagina_alvo"   varchar(500),
  "ativo"         varchar(300),
  "mensagem"      text,
  "status"        varchar(20) DEFAULT 'novo' NOT NULL,
  "observacao"    text,
  "contatado_em"  timestamp,
  "atualizado_em" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "artigos_convidado" (
  "id"            serial PRIMARY KEY,
  "slug"          varchar(120) NOT NULL UNIQUE,
  "titulo"        varchar(300) NOT NULL,
  "veiculo_sugerido" varchar(300),
  "resumo"        text,
  "corpo"         text NOT NULL,
  "link_para"     varchar(500),
  "status"        varchar(20) DEFAULT 'pronto' NOT NULL,
  "atualizado_em" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "distribuicao_fila" (
  "id"         serial PRIMARY KEY,
  "url"        varchar(500) NOT NULL,
  "canal"      varchar(20) NOT NULL,
  "texto"      text NOT NULL,
  "url_utm"    varchar(800) NOT NULL,
  "status"     varchar(20) DEFAULT 'rascunho' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "atualizado_em" timestamp DEFAULT now() NOT NULL,
  UNIQUE ("url", "canal")
);
