"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Footer } from "@/components/layout/Footer";
import { RevealOnScroll } from "@/components/effects/RevealOnScroll";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { useI18n } from "@/lib/i18n/context";

const TECH_MARQUEE = [
  "REACT", "NEXT.JS", "TYPESCRIPT", "PYTHON", "FASTAPI", "NODE.JS",
  "POSTGRESQL", "TAILWIND CSS", "PRISMA", "DOCKER", "VERCEL", "RAILWAY", "AWS", "STRIPE", "REST APIs",
];

const SERVICES: Array<{
  key: string;
  sector: string;
  tag: string;
  badge?: string;
  featured?: boolean;
}> = [
  { key: "1", sector: "SaaS MVPs", tag: "Next.js + Node.js + PostgreSQL", badge: "CORE", featured: true },
  { key: "2", sector: "FRONTEND", tag: "React + TypeScript + Tailwind CSS" },
  { key: "3", sector: "BACKEND", tag: "Python + FastAPI + Node.js" },
  { key: "4", sector: "DATA", tag: "React + Charts + PostgreSQL" },
  { key: "5", sector: "AI", tag: "OpenAI + Claude + RAG", badge: "HOT", featured: true },
  { key: "6", sector: "ECOMMERCE", tag: "Stripe + Next.js + Webhooks" },
  { key: "7", sector: "DEPLOY", tag: "Vercel + Railway + Docker + AWS" },
  { key: "8", sector: "CONSULTING", tag: "ISO 9001 + Process Optimization" },
];

const CASES = [
  {
    type: "WEB APP", year: "2025", key: "1",
    tags: ["Next.js 14", "Prisma", "NeonDB", "Railway"],
    metrics: [{ value: "3x", key: "m1" }, { value: "0.8s", key: "m2" }, { value: "14d", key: "m3" }],
  },
  {
    type: "IoT + DASHBOARD", year: "2025", key: "2",
    tags: ["FastAPI", "React", "WebSocket", "ESP32"],
    metrics: [{ value: "24/7", key: "m1" }, { value: "<2s", key: "m2" }, { value: "99.9%", key: "m3" }],
  },
  {
    type: "SAAS + AUTOMATION", year: "2025", key: "3",
    tags: ["Next.js", "FastAPI", "NeonDB", "Telegram Bot"],
    metrics: [{ value: "5", key: "m1" }, { value: "80%", key: "m2" }, { value: "1", key: "m3" }],
  },
];

const PROCESS = [
  { num: "01", key: "1" },
  { num: "02", key: "2" },
  { num: "03", key: "3" },
  { num: "04", key: "4" },
];

const WHY_ICONS = ["//", "{}", "</>", "$_", "--", "+1"];

const TESTIMONIALS = [
  { key: "1", initials: "RM", featured: false },
  { key: "2", initials: "CS", featured: true },
  { key: "3", initials: "AL", featured: false },
];

const STACK_SECTIONS = [
  { tag: "FRONTEND", items: "React, Next.js 14, TypeScript, Tailwind CSS, Zustand, TanStack Query, shadcn/ui", resultKey: "stack_r1" },
  { tag: "BACKEND", items: "Python, FastAPI, Node.js, Express, REST APIs, GraphQL, WebSockets", resultKey: "stack_r2" },
  { tag: "DATABASE", items: "PostgreSQL, Prisma, Drizzle ORM, Redis, Supabase, NeonDB", resultKey: "stack_r3" },
  { tag: "DEPLOY", items: "Vercel, Railway, AWS, Docker, GitHub Actions, CI/CD", resultKey: "stack_r4" },
  { tag: "AI / ML", items: "OpenAI, Claude, LangChain, RAG, Whisper, Vision AI", resultKey: "stack_r5" },
];

const BTS_ITEMS = [
  { icon: "</>", hKey: "bts_1_h" as const, pKey: "bts_1_p" as const },
  { icon: "CI", hKey: "bts_2_h" as const, pKey: "bts_2_p" as const },
  { icon: "API", hKey: "bts_3_h" as const, pKey: "bts_3_p" as const },
  { icon: "GIT", hKey: "bts_4_h" as const, pKey: "bts_4_p" as const },
  { icon: "UX", hKey: "bts_5_h" as const, pKey: "bts_5_p" as const },
  { icon: "24h", hKey: "bts_6_h" as const, pKey: "bts_6_p" as const },
];

export default function HomePage() {
  const { t, locale } = useI18n();

  return (
    <>
      <CursorGlow />
      <Navbar />
      <main id="main-content">
      <Hero />

      {/* MARQUEE */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...TECH_MARQUEE, ...TECH_MARQUEE].map((tech, i) => (
            <span key={i}>
              {tech}
              <span className="marquee-dot ml-8">&#9670;</span>
            </span>
          ))}
        </div>
      </div>

      {/* WHAT I DO */}
      <section className="py-24">
        <div className="container-main">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
            <RevealOnScroll>
              <span className="section-label">{t("what_label")}</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                {t("what_h2_1")}
                <br />
                {t("what_h2_2")}
                <span className="text-brand">{t("what_h2_3")}</span>
              </h2>
            </RevealOnScroll>
            <RevealOnScroll className="flex flex-col gap-8">
              {(["what_01", "what_02", "what_03", "what_04"] as const).map(
                (key, i) => (
                  <div key={key} className="flex gap-6">
                    <span className="text-brand/30 font-heading text-sm font-bold tracking-wider shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-gray-400 leading-relaxed">{t(key)}</p>
                  </div>
                )
              )}
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* BIG STATEMENT */}
      <section className="py-24 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
        <div className="container-main">
          <RevealOnScroll className="text-center">
            <h2 className="font-heading text-4xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
              {t("big_h2_1")}
              <span className="text-brand">{t("big_h2_2")}</span>
              {t("big_h2_3")}
              <span className="text-brand">{t("big_h2_4")}</span>
              {t("big_h2_5")}
              <span className="text-brand">{t("big_h2_6")}</span>
              {t("big_h2_7")}
            </h2>
            <p className="text-xl text-gray-500 mt-6 max-w-2xl mx-auto">
              {t("big_sub")}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* MINI CTA */}
      <div className="border-y border-white/[0.04] bg-white/[0.02]">
        <div className="container-main flex items-center justify-between py-5 flex-wrap gap-4">
          <p className="text-gray-500">{t("minicta_text")}</p>
          <a
            href="https://cal.com/daniel-anders-emx5kl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-brand hover:text-brand-bright transition-colors"
          >
            {t("minicta_btn")}
          </a>
        </div>
      </div>

      {/* SERVICES */}
      <section className="py-24" id="services">
        <div className="container-main">
          <RevealOnScroll>
            <span className="section-label">{t("svc_label")}</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              {t("svc_h2_1")}
              <span className="text-brand">{t("svc_h2_2")}</span>
            </h2>
            <p className="section-sub">{t("svc_sub")}</p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {SERVICES.map((svc) => (
              <RevealOnScroll key={svc.key}>
                <div
                  className={`glass-card h-full ${
                    svc.featured ? "border-brand/10" : ""
                  }`}
                >
                  {svc.badge && (
                    <div className="inline-block text-[0.6rem] font-bold tracking-[2px] text-brand bg-brand/10 px-3 py-1 rounded-full mb-3">
                      {svc.badge}
                    </div>
                  )}
                  <div className="text-[0.65rem] font-bold tracking-[3px] text-gray-700 uppercase mb-2">
                    {svc.sector}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-3">
                    {t(`svc_${svc.key}_h` as any)}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {t(`svc_${svc.key}_p` as any)}
                  </p>
                  <span className="text-xs text-gray-700 font-mono">
                    {svc.tag}
                  </span>
                </div>
              </RevealOnScroll>
            ))}

            {/* YOUR PROJECT */}
            <RevealOnScroll>
              <div className="glass-card h-full border-brand/20 bg-brand/[0.03] flex flex-col justify-center items-center text-center">
                <h3 className="font-heading text-lg font-bold text-foreground mb-3">
                  {t("svc_yours_h")}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {t("svc_yours_p")}
                </p>
                <Link href="#contact" className="text-sm font-bold text-brand tracking-wider hover:text-brand-bright transition-colors">
                  {t("svc_yours_cta")}
                </Link>
              </div>
            </RevealOnScroll>
          </div>

          {/* APPS ROUTER */}
          <RevealOnScroll className="mt-5">
            <div className="glass-card text-center py-12 px-7 border-brand/10">
              <div className="inline-block text-[0.6rem] font-bold tracking-[2px] text-brand bg-brand/10 px-3 py-1 rounded-full mb-3">
                NOVO
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                {t("apps_router_h")}
              </h3>
              <p className="text-sm text-gray-500 max-w-[500px] mx-auto mb-4">
                {t("apps_router_p")}
              </p>
              <Link href="/apps" className="text-sm font-bold text-brand tracking-wider hover:text-brand-bright transition-colors">
                {t("apps_router_cta")}
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* CASES */}
      <section className="py-24 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent" id="cases">
        <div className="container-main">
          <RevealOnScroll>
            <span className="section-label">{t("cases_label")}</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              {t("cases_h2_1")}
              <span className="text-brand">{t("cases_h2_2")}</span>
            </h2>
            <p className="section-sub">{t("cases_sub")}</p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {CASES.map((c) => (
              <RevealOnScroll key={c.key}>
                <div className="glass-card h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[0.65rem] font-bold tracking-[2px] text-brand/60">
                      {c.type}
                    </span>
                    <span className="text-xs text-gray-700">{c.year}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-3">
                    {t(`case_${c.key}_h` as any)}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {t(`case_${c.key}_p` as any)}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[0.65rem] text-brand/70 bg-brand/[0.06] px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-white/[0.06]">
                    {c.metrics.map((m) => (
                      <div key={m.key} className="text-center">
                        <span className="block font-heading text-xl font-bold text-brand">
                          {m.value}
                        </span>
                        <span className="text-[0.65rem] text-gray-600">
                          {t(`case_${c.key}_${m.key}` as any)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll className="text-center mt-12">
            <p className="text-gray-500 mb-4">{t("cases_cta")}</p>
            <a
              href="https://cal.com/daniel-anders-emx5kl"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              {t("cases_btn")}
            </a>
          </RevealOnScroll>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent" id="process">
        <div className="container-main">
          <RevealOnScroll>
            <span className="section-label">{t("proc_label")}</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-16">
              {t("proc_h2_1")}
              <span className="text-brand">{t("proc_h2_2")}</span>
            </h2>
          </RevealOnScroll>

          <div className="flex flex-col gap-6 md:gap-12 relative before:absolute before:left-[23px] before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-brand/20 before:via-brand/10 before:to-transparent md:before:left-[23px]">
            {PROCESS.map((step) => (
              <RevealOnScroll key={step.key} className="flex gap-4 md:gap-8">
                <div className="shrink-0 w-12 h-12 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-heading text-sm font-bold z-10">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                    {t(`proc_${step.key}_h` as any)}
                  </h3>
                  <p className="text-gray-500 leading-relaxed max-w-lg">
                    {t(`proc_${step.key}_p` as any)}
                    {step.key === "1" && (
                      <strong className="text-foreground block mt-1">
                        {t("proc_1_p2")}
                      </strong>
                    )}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* WHY ME */}
      <section className="py-24">
        <div className="container-main">
          <RevealOnScroll>
            <span className="section-label">{t("why_label")}</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8 md:mb-16">
              {t("why_h2_1")}
              <br />
              {t("why_h2_2")}
              <span className="text-brand">{t("why_h2_3")}</span>
              {t("why_h2_4")}
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <RevealOnScroll key={i}>
                <div className="glass-card h-full">
                  <div className="text-2xl font-mono text-brand/30 mb-4">
                    {WHY_ICONS[i - 1]}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    {t(`why_${i}_h` as any)}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {t(`why_${i}_p` as any)}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-24 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
        <div className="container-main">
          <RevealOnScroll>
            <span className="section-label">{locale === "en" ? "TECH STACK" : "TECNOLOGIAS"}</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-16">
              {locale === "en" ? "Built with " : "Construído com "}
              <span className="text-brand">
                {locale === "en" ? "modern tools" : "ferramentas modernas"}
              </span>
            </h2>
          </RevealOnScroll>

          <div className="flex flex-col gap-5">
            {STACK_SECTIONS.map((s) => (
              <RevealOnScroll key={s.tag}>
                <div className="glass-card grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-6 items-center">
                  <div>
                    <span className="text-[0.6rem] font-bold tracking-[2px] text-brand/60 mb-2 block">
                      {s.tag}
                    </span>
                    <p className="text-sm text-gray-400">{s.items}</p>
                  </div>
                  <div className="text-brand/30 font-mono text-xl hidden md:block">
                    //
                  </div>
                  <div>
                    <span className="text-[0.6rem] font-bold tracking-[2px] text-brand mb-2 block">
                      {locale === "en" ? "RESULT" : "RESULTADO"}
                    </span>
                    <p className="text-sm text-gray-500">{t(s.resultKey as any)}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* BEHIND THE SCENES */}
      <section className="py-24">
        <div className="container-main">
          <RevealOnScroll>
            <span className="section-label">
              {locale === "en" ? "HOW I BUILD" : "COMO EU CONSTRUO"}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-16">
              {locale === "en" ? (
                <>Behind the <span className="text-brand">scenes</span></>
              ) : (
                <>Por dentro dos <span className="text-brand">bastidores</span></>
              )}
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {BTS_ITEMS.map((item) => (
              <RevealOnScroll key={item.hKey}>
                <div className="glass-card h-full flex gap-5">
                  <div className="text-brand/40 font-mono font-bold text-sm shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground mb-2">
                      {t(item.hKey)}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {t(item.pKey)}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
        <div className="container-main">
          <RevealOnScroll>
            <span className="section-label">{t("test_label")}</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-16">
              {t("test_h2_1")}
              <span className="text-brand">{t("test_h2_2")}</span>
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {TESTIMONIALS.map((test) => (
              <RevealOnScroll key={test.key}>
                <div
                  className={`glass-card h-full ${
                    test.featured ? "border-brand/15 bg-brand/[0.02]" : ""
                  }`}
                >
                  <div className="text-5xl text-brand/20 font-heading leading-none mb-4">
                    &ldquo;
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-8">
                    {t(`test_${test.key}_p` as any)}
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand text-xs font-bold">
                      {test.initials}
                    </div>
                    <div>
                      <strong className="text-sm text-foreground block">
                        {t(`test_${test.key}_name` as any)}
                      </strong>
                      <span className="text-xs text-gray-600">
                        {t(`test_${test.key}_role` as any)}
                      </span>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent" id="about">
        <div className="container-main">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_0.8fr] md:gap-16">
            <RevealOnScroll>
              <span className="section-label">{t("about_label")}</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                Daniel <span className="text-brand">Anders</span>
              </h2>
              <p className="text-sm text-brand/60 font-medium mb-6">
                {t("about_role")}
              </p>
              <div className="flex flex-col gap-4 text-gray-400 leading-relaxed mb-8">
                <p>{t("about_p1")}</p>
                <p>{t("about_p2")}</p>
                <p>{t("about_p3")}</p>
              </div>
              <div className="flex flex-col gap-3">
                <a href="mailto:danielanders76@gmail.com" className="text-sm text-gray-600 hover:text-brand transition-colors">
                  danielanders76@gmail.com
                </a>
                <a href="https://github.com/AndersD76" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-brand transition-colors">
                  github.com/AndersD76
                </a>
                <a href="https://linkedin.com/in/danielandersbrrs" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-brand transition-colors">
                  linkedin.com/in/danielandersbrrs
                </a>
              </div>
            </RevealOnScroll>

            <RevealOnScroll className="flex flex-col gap-4">
              {[
                { number: "+15", label: t("about_s1") },
                { number: "+50", label: t("about_s2") },
                { number: "5+", label: t("about_s3") },
              ].map((stat) => (
                <div key={stat.label} className="glass-card flex items-center gap-4 py-5">
                  <span className="text-3xl font-heading font-bold text-brand">
                    {stat.number}
                  </span>
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </div>
              ))}
              <div className="glass-card border-brand/10 bg-brand/[0.02]">
                <span className="text-sm text-foreground font-medium block">
                  {t("about_loc")}
                </span>
                <span className="text-xs text-gray-600">
                  {t("about_loc_sub")}
                </span>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24">
        <div className="container-main">
          <RevealOnScroll className="text-center">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-6">
              {t("cta_h2_1")}
              <br />
              <span className="text-brand">{t("cta_h2_2")}</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-4">
              {t("cta_p")}
            </p>
            <p className="text-xl font-heading font-bold text-foreground mb-8">
              {t("cta_big")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://cal.com/daniel-anders-emx5kl"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn"
              >
                {t("cta_btn")}
              </a>
              <Link
                href="#contact"
                className="text-sm text-gray-500 hover:text-brand transition-colors"
              >
                {t("cta_or")}
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <ContactForm />
      </main>
      <Footer />

      {/* FLOATING WHATSAPP */}
      <a
        href="https://wa.me/5554999648368?text=Oi%20Daniel%2C%20vim%20pelo%20site%20andersdev%20e%20quero%20conversar%20sobre%20um%20projeto."
        target="_blank"
        rel="noopener noreferrer"
        className="fab-whatsapp"
        aria-label="WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}
