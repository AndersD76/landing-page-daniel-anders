import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  numeric,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";

export const eadCourses = pgTable("ead_courses", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  titulo: varchar("titulo", { length: 500 }).notNull(),
  subtitulo: varchar("subtitulo", { length: 500 }),
  descricao: text("descricao"),
  cargaHoraria: varchar("carga_horaria", { length: 20 }),
  preco: numeric("preco", { precision: 10, scale: 2 }).default("0"),
  precoOriginal: numeric("preco_original", { precision: 10, scale: 2 }),
  imagem: varchar("imagem", { length: 500 }),
  publico: text("publico"),
  prerequisito: text("prerequisito"),
  objetivo: text("objetivo"),
  ativo: boolean("ativo").default(true),
  ordem: integer("ordem").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eadModules = pgTable("ead_modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .references(() => eadCourses.id)
    .notNull(),
  titulo: varchar("titulo", { length: 500 }).notNull(),
  descricao: text("descricao"),
  ordem: integer("ordem").default(0),
});

export const eadLessons = pgTable("ead_lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id")
    .references(() => eadModules.id)
    .notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  titulo: varchar("titulo", { length: 500 }).notNull(),
  duracao: varchar("duracao", { length: 20 }),
  conteudo: text("conteudo"),
  entregavelTitulo: varchar("entregavel_titulo", { length: 500 }),
  entregavelUrl: varchar("entregavel_url", { length: 500 }),
  ordem: integer("ordem").default(0),
});

export const eadQuizQuestions = pgTable("ead_quiz_questions", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => eadModules.id),
  courseId: integer("course_id")
    .references(() => eadCourses.id)
    .notNull(),
  pergunta: text("pergunta").notNull(),
  alternativas: jsonb("alternativas").notNull(),
  respostaCorreta: integer("resposta_correta").notNull(),
  explicacao: text("explicacao"),
  isFinal: boolean("is_final").default(false),
});

export const eadUsers = pgTable("ead_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  senhaHash: varchar("senha_hash", { length: 255 }).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 50 }),
  empresa: varchar("empresa", { length: 255 }),
  ativo: boolean("ativo").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eadOrders = pgTable("ead_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => eadUsers.id)
    .notNull(),
  courseId: integer("course_id")
    .references(() => eadCourses.id)
    .notNull(),
  valor: numeric("valor", { precision: 10, scale: 2 }).notNull(),
  metodo: varchar("metodo", { length: 50 }),
  status: varchar("status", { length: 50 }).default("pendente"),
  mpPreferenceId: varchar("mp_preference_id", { length: 255 }),
  mpPaymentId: varchar("mp_payment_id", { length: 255 }),
  pixQrCode: text("pix_qr_code"),
  pixQrCodeBase64: text("pix_qr_code_base64"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  paidAt: timestamp("paid_at"),
});

export const eadEnrollments = pgTable(
  "ead_enrollments",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => eadUsers.id)
      .notNull(),
    courseId: integer("course_id")
      .references(() => eadCourses.id)
      .notNull(),
    orderId: integer("order_id").references(() => eadOrders.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.courseId)],
);

export const eadProgress = pgTable(
  "ead_progress",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => eadUsers.id)
      .notNull(),
    lessonId: integer("lesson_id")
      .references(() => eadLessons.id)
      .notNull(),
    completed: boolean("completed").default(false),
    completedAt: timestamp("completed_at"),
  },
  (t) => [unique().on(t.userId, t.lessonId)],
);

export const eadQuizAttempts = pgTable("ead_quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => eadUsers.id)
    .notNull(),
  courseId: integer("course_id")
    .references(() => eadCourses.id)
    .notNull(),
  moduleId: integer("module_id"),
  isFinal: boolean("is_final").default(false),
  score: numeric("score", { precision: 5, scale: 2 }),
  totalQuestions: integer("total_questions"),
  correctAnswers: integer("correct_answers"),
  passed: boolean("passed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eadCertificates = pgTable(
  "ead_certificates",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => eadUsers.id)
      .notNull(),
    courseId: integer("course_id")
      .references(() => eadCourses.id)
      .notNull(),
    code: varchar("code", { length: 100 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.courseId)],
);

export type EadCourse = typeof eadCourses.$inferSelect;
export type EadUser = typeof eadUsers.$inferSelect;
export type EadEnrollment = typeof eadEnrollments.$inferSelect;
export type EadProgress = typeof eadProgress.$inferSelect;
export type EadCertificate = typeof eadCertificates.$inferSelect;
