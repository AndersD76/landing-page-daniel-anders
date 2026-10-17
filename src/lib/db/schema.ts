import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
]);

/**
 * Prazo de decisão declarado pelo lead. É o campo que ordena a fila
 * comercial — "agora" vem antes de "avaliando", sempre.
 */
export const leadDeadlineEnum = pgEnum("lead_deadline", [
  "agora",
  "90-dias",
  "avaliando",
]);

export const subscriberStatusEnum = pgEnum("subscriber_status", [
  "pending",
  "confirmed",
  "unsubscribed",
]);

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  message: text("message"),
  source: varchar("source", { length: 100 }).default("website"),
  utmSource: varchar("utm_source", { length: 255 }),
  utmMedium: varchar("utm_medium", { length: 255 }),
  utmCampaign: varchar("utm_campaign", { length: 255 }),

  /**
   * Página de ENTRADA da sessão (não a do formulário). É a única forma de
   * saber qual página gera dinheiro. Gravada no lead, não só no evento.
   */
  landingPage: varchar("landing_page", { length: 500 }),
  /** Página onde o formulário foi efetivamente enviado. */
  formPage: varchar("form_page", { length: 500 }),

  /* --- qualificação --- */
  role: varchar("role", { length: 100 }),
  scope: varchar("scope", { length: 100 }),
  deadline: leadDeadlineEnum("deadline"),

  status: leadStatusEnum("status").default("new"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leadEvents = pgTable("lead_events", {
  id: serial("id").primaryKey(),
  leadId: serial("lead_id")
    .references(() => leads.id)
    .notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emailSubscribers = pgTable("email_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  source: varchar("source", { length: 100 }),
  tags: text("tags").array(),
  status: subscriberStatusEnum("status").default("pending"),
  confirmedAt: timestamp("confirmed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  body: text("body").notNull(),
  sentAt: timestamp("sent_at"),
  stats: jsonb("stats"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emailSends = pgTable("email_sends", {
  id: serial("id").primaryKey(),
  campaignId: serial("campaign_id")
    .references(() => emailCampaigns.id)
    .notNull(),
  subscriberId: serial("subscriber_id")
    .references(() => emailSubscribers.id)
    .notNull(),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  bouncedAt: timestamp("bounced_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Espelho local de tráfego.
 *
 * Existe porque GA4 responde "quantas sessões" e não responde "qual página
 * gerou aquele lead" sem exportação. Aqui o dado fica no mesmo banco do lead,
 * então o join é uma query.
 *
 * Sem PII por desenho: nada de IP, nada de user-agent cru, nada de e-mail.
 * O sessionId é aleatório, vive só no sessionStorage do visitante e morre com
 * a aba — não identifica pessoa e não persiste entre visitas.
 */
export const pageviews = pgTable(
  "pageviews",
  {
    id: serial("id").primaryKey(),
    path: varchar("path", { length: 500 }).notNull(),
    /** página de ENTRADA da sessão, repetida em toda linha para facilitar o corte */
    landingPage: varchar("landing_page", { length: 500 }),
    /** só o host do referrer: o caminho completo pode conter dado de terceiro */
    referrerHost: varchar("referrer_host", { length: 255 }),
    utmSource: varchar("utm_source", { length: 255 }),
    utmMedium: varchar("utm_medium", { length: 255 }),
    utmCampaign: varchar("utm_campaign", { length: 255 }),
    /** aleatório, por aba, sem vínculo com pessoa */
    sessionId: varchar("session_id", { length: 64 }).notNull(),
    device: varchar("device", { length: 20 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("pageviews_created_at_idx").on(t.createdAt),
    index("pageviews_path_idx").on(t.path),
    index("pageviews_session_idx").on(t.sessionId),
  ]
);

/**
 * Eventos de CTA. Sem o denominador (visto) não dá para saber se a oferta não
 * convence ou se ninguém chegou a ver o botão.
 */
export const ctaEvents = pgTable(
  "cta_events",
  {
    id: serial("id").primaryKey(),
    /** "visto" | "clicado" */
    tipo: varchar("tipo", { length: 20 }).notNull(),
    path: varchar("path", { length: 500 }).notNull(),
    escopo: varchar("escopo", { length: 150 }),
    sessionId: varchar("session_id", { length: 64 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("cta_events_created_at_idx").on(t.createdAt),
    index("cta_events_tipo_idx").on(t.tipo),
  ]
);

export type Pageview = typeof pageviews.$inferSelect;
export type CtaEvent = typeof ctaEvents.$inferSelect;

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type EmailSubscriber = typeof emailSubscribers.$inferSelect;
export type NewEmailSubscriber = typeof emailSubscribers.$inferInsert;
