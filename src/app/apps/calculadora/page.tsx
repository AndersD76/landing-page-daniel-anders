"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageNavbar } from "@/components/layout/PageNavbar";
import { PageFooter } from "@/components/layout/PageFooter";

/* ------------------------------------------------------------------ */
/*  PRICING DATA                                                       */
/* ------------------------------------------------------------------ */

const projectTypes = [
  { id: "landing", label: "Landing Page", baseMin: 3000, baseMax: 5000 },
  { id: "webapp", label: "Web App", baseMin: 6000, baseMax: 10000 },
  { id: "saas", label: "SaaS MVP", baseMin: 10000, baseMax: 18000 },
  { id: "dashboard", label: "Dashboard", baseMin: 7000, baseMax: 12000 },
  { id: "ecommerce", label: "E-commerce", baseMin: 8000, baseMax: 15000 },
  { id: "api", label: "API / Integração", baseMin: 4000, baseMax: 8000 },
] as const;

const features = [
  { id: "auth", label: "Autenticação (login, OAuth, recuperação de senha)", costMin: 800, costMax: 1500 },
  { id: "payments", label: "Pagamentos / Stripe (checkout, assinaturas)", costMin: 1500, costMax: 3000 },
  { id: "admin", label: "Dashboard admin (métricas, gestão de usuários)", costMin: 1200, costMax: 2500 },
  { id: "email", label: "Email automation (transacional, campanhas)", costMin: 600, costMax: 1200 },
  { id: "external_api", label: "Integração com API externa", costMin: 800, costMax: 2000 },
  { id: "responsive", label: "Design responsivo (mobile-first)", costMin: 500, costMax: 1000 },
  { id: "i18n", label: "i18n multi-idioma", costMin: 600, costMax: 1200 },
  { id: "chat", label: "Chat / suporte ao vivo", costMin: 1000, costMax: 2500 },
] as const;

const deadlines = [
  { id: "2w", label: "2 semanas", multiplier: 1.5 },
  { id: "4w", label: "4 semanas", multiplier: 1.2 },
  { id: "6w", label: "6 semanas", multiplier: 1.0 },
  { id: "8w", label: "8+ semanas", multiplier: 0.95 },
] as const;

type ProjectTypeId = (typeof projectTypes)[number]["id"];
type FeatureId = (typeof features)[number]["id"];
type DeadlineId = (typeof deadlines)[number]["id"];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function CalculadoraPage() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ProjectTypeId | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<FeatureId>>(
    new Set()
  );
  const [selectedDeadline, setSelectedDeadline] = useState<DeadlineId | null>(
    null
  );

  const toggleFeature = (id: FeatureId) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const estimate = useMemo(() => {
    const type = projectTypes.find((t) => t.id === selectedType);
    if (!type) return null;

    let totalMin: number = type.baseMin;
    let totalMax: number = type.baseMax;

    for (const fId of selectedFeatures) {
      const f = features.find((feat) => feat.id === fId);
      if (f) {
        totalMin += f.costMin;
        totalMax += f.costMax;
      }
    }

    const dl = deadlines.find((d) => d.id === selectedDeadline);
    const multiplier: number = dl ? dl.multiplier : 1;

    totalMin = Math.round(totalMin * multiplier);
    totalMax = Math.round(totalMax * multiplier);

    return { min: totalMin, max: totalMax, multiplier };
  }, [selectedType, selectedFeatures, selectedDeadline]);

  const canAdvance =
    (step === 1 && selectedType !== null) ||
    (step === 2) || // features are optional
    (step === 3 && selectedDeadline !== null);

  /* ---------------------------------------------------------------- */
  /*  Schema.org                                                       */
  /* ---------------------------------------------------------------- */
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Calculadora de Investimento — Desenvolvimento Sob Medida",
    description:
      "Estime o custo do seu projeto de desenvolvimento web. Landing pages, web apps, SaaS, dashboards, e-commerce e APIs.",
    provider: {
      "@type": "Person",
      name: "Daniel Anders",
      url: "https://www.andersdev.com.br",
      jobTitle: "Full-Stack Developer & Business Consultant",
    },
    areaServed: { "@type": "Country", name: "Brazil" },
    url: "https://www.andersdev.com.br/apps/calculadora",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <PageNavbar links={[{ href: "/apps", label: "Catálogo" }]} />

      <main className="container-main py-12 md:py-16">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm text-gray mb-8">
          <Link
            href="/"
            className="hover:text-brand transition-colors no-underline text-gray"
          >
            Início
          </Link>
          <span>/</span>
          <Link
            href="/apps"
            className="hover:text-brand transition-colors no-underline text-gray"
          >
            Apps
          </Link>
          <span>/</span>
          <span className="text-foreground">Calculadora</span>
        </div>

        {/* HERO */}
        <section className="mb-12">
          <span className="section-label">CALCULADORA</span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Calculadora de Investimento
          </h1>
          <p className="text-lg text-gray leading-relaxed max-w-2xl">
            Estime o custo do seu projeto em 3 passos. Selecione o tipo,
            escolha as funcionalidades e defina o prazo. O valor é calculado
            em tempo real.
          </p>
        </section>

        {/* PROGRESS BAR */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => {
                if (s < step) setStep(s);
                if (s === 2 && selectedType) setStep(2);
                if (s === 3 && selectedType) setStep(3);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border cursor-pointer ${
                s === step
                  ? "bg-brand text-white border-brand shadow-brand-sm"
                  : s < step
                    ? "bg-brand/10 text-brand border-brand/20"
                    : "bg-white/[0.04] text-gray border-white/[0.08]"
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                {s}
              </span>
              <span className="hidden sm:inline">
                {s === 1
                  ? "Tipo de Projeto"
                  : s === 2
                    ? "Funcionalidades"
                    : "Prazo"}
              </span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* LEFT: WIZARD STEPS */}
          <div>
            {/* STEP 1 */}
            {step === 1 && (
              <section>
                <h2 className="font-heading text-xl md:text-2xl font-bold mb-2">
                  Tipo de projeto
                </h2>
                <p className="text-gray mb-6">
                  Qual tipo de aplicação você precisa? Isso define a base de
                  custo.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {projectTypes.map((pt) => (
                    <button
                      key={pt.id}
                      onClick={() => setSelectedType(pt.id)}
                      className={`glass-card text-left cursor-pointer border transition-all ${
                        selectedType === pt.id
                          ? "!border-brand/40 !bg-brand/[0.06]"
                          : ""
                      }`}
                    >
                      <h3 className="font-heading text-base font-bold text-foreground mb-1">
                        {pt.label}
                      </h3>
                      <p className="text-xs text-gray">
                        Base: {formatBRL(pt.baseMin)} — {formatBRL(pt.baseMax)}
                      </p>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <section>
                <h2 className="font-heading text-xl md:text-2xl font-bold mb-2">
                  Funcionalidades
                </h2>
                <p className="text-gray mb-6">
                  Selecione tudo que o projeto precisa. Cada feature adiciona
                  ao custo base.
                </p>
                <div className="flex flex-col gap-3">
                  {features.map((f) => {
                    const checked = selectedFeatures.has(f.id);
                    return (
                      <button
                        key={f.id}
                        onClick={() => toggleFeature(f.id)}
                        className={`glass-card text-left cursor-pointer flex items-center gap-4 border transition-all ${
                          checked
                            ? "!border-brand/40 !bg-brand/[0.06]"
                            : ""
                        }`}
                      >
                        <div
                          className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            checked
                              ? "bg-brand border-brand"
                              : "border-white/20 bg-transparent"
                          }`}
                        >
                          {checked && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M2 6L5 9L10 3"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading text-sm font-bold text-foreground">
                            {f.label}
                          </h3>
                          <p className="text-xs text-gray mt-0.5">
                            + {formatBRL(f.costMin)} — {formatBRL(f.costMax)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <section>
                <h2 className="font-heading text-xl md:text-2xl font-bold mb-2">
                  Prazo desejado
                </h2>
                <p className="text-gray mb-6">
                  Prazos mais curtos exigem dedicação exclusiva e custam mais.
                  Prazos mais longos permitem otimização de custo.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {deadlines.map((dl) => (
                    <button
                      key={dl.id}
                      onClick={() => setSelectedDeadline(dl.id)}
                      className={`glass-card text-left cursor-pointer border transition-all ${
                        selectedDeadline === dl.id
                          ? "!border-brand/40 !bg-brand/[0.06]"
                          : ""
                      }`}
                    >
                      <h3 className="font-heading text-base font-bold text-foreground mb-1">
                        {dl.label}
                      </h3>
                      <p className="text-xs text-gray">
                        {dl.multiplier > 1
                          ? `+${Math.round((dl.multiplier - 1) * 100)}% (urgência)`
                          : dl.multiplier < 1
                            ? `${Math.round((1 - dl.multiplier) * 100)}% desconto`
                            : "Prazo padrão"}
                      </p>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* NAVIGATION BUTTONS */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className={`text-sm font-bold px-6 py-3 rounded-full border transition-all cursor-pointer ${
                  step === 1
                    ? "border-white/[0.06] text-gray/50 cursor-not-allowed"
                    : "border-white/10 text-foreground hover:border-brand/30"
                }`}
              >
                VOLTAR
              </button>
              {step < 3 ? (
                <button
                  onClick={() => canAdvance && setStep(step + 1)}
                  disabled={!canAdvance}
                  className={`text-sm font-bold px-6 py-3 rounded-full transition-all cursor-pointer ${
                    canAdvance
                      ? "bg-brand text-white hover:scale-105 shadow-brand-sm"
                      : "bg-white/[0.06] text-gray/50 cursor-not-allowed"
                  }`}
                >
                  PRÓXIMO
                </button>
              ) : (
                <a
                  href="https://cal.com/daniel-anders-emx5kl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-btn text-center"
                >
                  AGENDAR CALL GRATUITA
                </a>
              )}
            </div>
          </div>

          {/* RIGHT: ESTIMATE PANEL */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="glass-card border-brand/10">
              <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                Estimativa em tempo real
              </h3>

              {/* Selected type */}
              <div className="mb-4">
                <p className="text-xs text-gray uppercase tracking-wider mb-1">
                  Tipo de projeto
                </p>
                {selectedType ? (
                  <p className="text-sm text-foreground font-semibold">
                    {projectTypes.find((t) => t.id === selectedType)?.label}
                  </p>
                ) : (
                  <p className="text-sm text-gray/50 italic">
                    Selecione na etapa 1
                  </p>
                )}
              </div>

              {/* Selected features */}
              <div className="mb-4">
                <p className="text-xs text-gray uppercase tracking-wider mb-1">
                  Funcionalidades ({selectedFeatures.size})
                </p>
                {selectedFeatures.size > 0 ? (
                  <ul className="text-sm text-foreground space-y-0.5">
                    {Array.from(selectedFeatures).map((fId) => (
                      <li key={fId} className="flex items-center gap-1.5">
                        <span className="text-brand text-xs">&#10003;</span>
                        {features.find((f) => f.id === fId)?.label.split("(")[0]}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray/50 italic">
                    Nenhuma selecionada
                  </p>
                )}
              </div>

              {/* Selected deadline */}
              <div className="mb-6">
                <p className="text-xs text-gray uppercase tracking-wider mb-1">
                  Prazo
                </p>
                {selectedDeadline ? (
                  <p className="text-sm text-foreground font-semibold">
                    {deadlines.find((d) => d.id === selectedDeadline)?.label}
                    {estimate && estimate.multiplier !== 1 && (
                      <span className="text-xs text-gray ml-2">
                        ({estimate.multiplier > 1 ? "+" : ""}
                        {Math.round((estimate.multiplier - 1) * 100)}%)
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="text-sm text-gray/50 italic">
                    Selecione na etapa 3
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-white/[0.08] my-4" />

              {/* TOTAL */}
              <div className="text-center">
                <p className="text-xs text-gray uppercase tracking-wider mb-2">
                  Investimento estimado
                </p>
                {estimate ? (
                  <p className="font-heading text-3xl font-bold text-brand">
                    {formatBRL(estimate.min)} — {formatBRL(estimate.max)}
                  </p>
                ) : (
                  <p className="font-heading text-2xl font-bold text-gray/30">
                    R$ ---
                  </p>
                )}
              </div>

              {/* CTA buttons */}
              {estimate && (
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href="https://cal.com/daniel-anders-emx5kl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-btn text-center justify-center w-full"
                  >
                    AGENDAR CALL GRATUITA
                  </a>
                  <a
                    href={`mailto:danielanders76@gmail.com?subject=Estimativa de Projeto&body=Olá Daniel,%0A%0AGostaria de discutir um projeto:%0A%0ATipo: ${projectTypes.find((t) => t.id === selectedType)?.label}%0AFuncionalidades: ${Array.from(selectedFeatures).map((fId) => features.find((f) => f.id === fId)?.label.split("(")[0].trim()).join(", ")}%0APrazo: ${deadlines.find((d) => d.id === selectedDeadline)?.label || "A definir"}%0AEstimativa: ${formatBRL(estimate.min)} — ${formatBRL(estimate.max)}%0A%0AObrigado!`}
                    className="text-center text-sm font-bold text-brand hover:text-brand-bright transition-colors no-underline py-2"
                  >
                    ENVIAR ESTIMATIVA POR EMAIL
                  </a>
                </div>
              )}
            </div>

            {/* DISCLAIMER */}
            <p className="text-xs text-gray/60 mt-4 leading-relaxed text-center">
              Valores estimados. O preco final depende do escopo detalhado
              definido na call de discovery. Todos os projetos incluem
              código-fonte, deploy e 30 dias de suporte.
            </p>
          </aside>
        </div>

        {/* WHAT'S INCLUDED */}
        <section className="mt-20 mb-16">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">
            O que está incluído em todo projeto
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            {[
              {
                icon: "//",
                title: "Código-fonte completo",
                desc: "Repositório GitHub com TypeScript tipado, testes e documentação. Sem lock-in.",
              },
              {
                icon: "{}",
                title: "Deploy em produção",
                desc: "CI/CD configurado, domínio customizado, SSL e monitoramento. Pronto pra escalar.",
              },
              {
                icon: "$_",
                title: "30 dias de suporte",
                desc: "Bug fixes, ajustes finos e dúvidas técnicas por 30 dias após o lançamento.",
              },
            ].map((item) => (
              <div key={item.title} className="glass-card">
                <div className="text-2xl font-mono text-brand/30 mb-3">
                  {item.icon}
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES CROSS-LINK */}
        <section className="mb-16">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            Explore por tipo de serviço
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            {[
              {
                slug: "desenvolvimento-saas-mvp",
                title: "SaaS e MVP",
                desc: "Do zero à produção com autenticação, pagamentos e dashboard.",
              },
              {
                slug: "integracoes-api-stripe",
                title: "Integrações e Stripe",
                desc: "APIs, webhooks, pagamentos recorrentes e integrações com terceiros.",
              },
              {
                slug: "consultoria-tecnica-cto",
                title: "Consultoria Técnica",
                desc: "Análise de arquitetura, code review e decisões de stack.",
              },
            ].map((svc) => (
              <Link
                key={svc.slug}
                href={`/servicos/${svc.slug}`}
                className="glass-card no-underline group"
              >
                <h3 className="font-heading text-sm font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
                  {svc.title}
                </h3>
                <p className="text-xs text-gray">{svc.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* BACK TO CATALOG */}
        <div className="text-center mb-8">
          <Link
            href="/apps"
            className="text-sm font-bold text-brand hover:text-brand-bright transition-colors no-underline"
          >
            ← Voltar ao catálogo de apps
          </Link>
        </div>
      </main>

      <PageFooter />
    </>
  );
}
