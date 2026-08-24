"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Footer } from "@/components/layout/Footer";
import { RevealOnScroll } from "@/components/effects/RevealOnScroll";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { useI18n } from "@/lib/i18n/context";

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

const TESTIMONIALS = [
  { key: "1", initials: "RM", featured: false },
  { key: "2", initials: "CS", featured: true },
  { key: "3", initials: "AL", featured: false },
];

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      <CursorGlow />
      <Navbar />
      <main id="main-content">
      <Hero />

      {/* SOCIAL PROOF BAR */}
      <div className="border-y border-white/[0.04] bg-white/[0.02]">
        <div className="container-main flex items-center justify-center gap-6 md:gap-10 py-4 flex-wrap text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="text-yellow-400">★★★★★</span>
            <span className="font-bold text-foreground">{t("proof_rating")}</span>
          </span>
          <span className="hidden sm:inline text-white/10">|</span>
          <span>{t("proof_projects")}</span>
          <span className="hidden sm:inline text-white/10">|</span>
          <span>{t("proof_years")}</span>
          <span className="hidden sm:inline text-white/10">|</span>
          <span>{t("proof_location")}</span>
        </div>
      </div>


      {/* 3 CAMINHOS */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <RevealOnScroll>
            <span className="section-label">{t("paths_label")}</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-12">
              {t("paths_h2_1")}
              <span className="text-brand">{t("paths_h2_2")}</span>
            </h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {[
              {
                num: "01",
                h: t("path_1_h"),
                p: t("path_1_p"),
                cta: t("path_1_cta"),
                href: "/calculadora-site",
                track: "path_click_calculator",
              },
              {
                num: "02",
                h: t("path_2_h"),
                p: t("path_2_p"),
                cta: t("path_2_cta"),
                href: "/apps",
                track: "path_click_mvps",
              },
              {
                num: "03",
                h: t("path_3_h"),
                p: t("path_3_p"),
                cta: t("path_3_cta"),
                href: "#contact",
                track: "path_click_processo",
              },
            ].map((path) => (
              <RevealOnScroll key={path.num}>
                <Link
                  href={path.href}
                  data-track={path.track}
                  className="glass-card no-underline group flex flex-col h-full hover:!border-brand/30 transition-colors"
                >
                  <span className="text-xs font-mono text-brand/40 mb-3">
                    {path.num}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-brand transition-colors">
                    {path.h}
                  </h3>
                  <p className="text-sm text-gray leading-relaxed mb-5 flex-1">
                    {path.p}
                  </p>
                  <span className="text-sm font-bold text-brand">
                    {path.cta} &rarr;
                  </span>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>



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

    </>
  );
}
