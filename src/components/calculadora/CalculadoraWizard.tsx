"use client";

import { useState } from "react";
import { trackEvent } from "@/components/analytics/Analytics";
import { leadMagnetSchema } from "@/lib/validations";
import {
  calcularEstimativa,
  formatBRL,
  getConfig,
  resumoSelecao,
  type Estimativa,
} from "@/lib/calculadora";

interface CalculadoraWizardProps {
  variante: "site" | "app";
}

const stepLabels = ["Tipo", "Escopo", "Integrações", "Prazo"];

export function CalculadoraWizard({ variante }: CalculadoraWizardProps) {
  const config = getConfig(variante);

  const [step, setStep] = useState(0);
  const [tipoId, setTipoId] = useState<string | null>(null);
  const [volumeId, setVolumeId] = useState<string | null>(null);
  const [integracaoIds, setIntegracaoIds] = useState<string[]>([]);
  const [prazoId, setPrazoId] = useState<string | null>(null);
  const [estimativa, setEstimativa] = useState<Estimativa | null>(null);

  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [formError, setFormError] = useState("");

  function toggleIntegracao(id: string) {
    setIntegracaoIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function calcular(finalPrazoId: string) {
    if (!tipoId || !volumeId) return;
    const result = calcularEstimativa(config, {
      tipoId,
      volumeId,
      integracaoIds,
      prazoId: finalPrazoId,
    });
    setEstimativa(result);
    trackEvent("calculadora_resultado", {
      source: config.slug,
      tipo: tipoId,
      value: result.min,
    });
  }

  function reiniciar() {
    setStep(0);
    setTipoId(null);
    setVolumeId(null);
    setIntegracaoIds([]);
    setPrazoId(null);
    setEstimativa(null);
    setFormStatus("idle");
    setFormError("");
  }

  async function handleLeadSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!estimativa || !tipoId || !volumeId || !prazoId) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      honeypot: (formData.get("website") as string) || undefined,
    };

    const parsed = leadMagnetSchema.safeParse(data);
    if (!parsed.success) {
      setFormStatus("error");
      setFormError(parsed.error.issues[0].message);
      return;
    }

    setFormStatus("loading");
    setFormError("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          source: config.slug,
          message: resumoSelecao(
            config,
            { tipoId, volumeId, integracaoIds, prazoId },
            estimativa
          ),
          honeypot: data.honeypot,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Erro ao enviar");
      }

      setFormStatus("success");
      trackEvent("generate_lead", {
        source: config.slug,
        value: estimativa.min,
        currency: "BRL",
      });
    } catch (err) {
      setFormStatus("error");
      setFormError(err instanceof Error ? err.message : "Erro ao enviar");
    }
  }

  const optionClass = (selected: boolean) =>
    `w-full text-left px-5 py-4 rounded-xl border transition-colors cursor-pointer ${
      selected
        ? "border-brand bg-brand/10 text-foreground"
        : "border-white/[0.08] bg-white/[0.03] text-gray hover:border-brand/40"
    }`;

  /* ── RESULTADO ── */
  if (estimativa) {
    const whatsappMsg = encodeURIComponent(
      `Olá Daniel! Usei a ${
        variante === "site" ? "calculadora de site" : "calculadora de app"
      } no seu site e cheguei numa estimativa de ${formatBRL(
        estimativa.min
      )} a ${formatBRL(estimativa.max)}. Quero conversar sobre o projeto.`
    );

    return (
      <div className="glass-card !p-6 md:!p-8" data-testid="resultado">
        <p className="text-xs font-bold tracking-[3px] text-brand uppercase mb-2">
          Estimativa do seu projeto
        </p>
        <p className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-1">
          {formatBRL(estimativa.min)}{" "}
          <span className="text-gray font-normal text-2xl">a</span>{" "}
          {formatBRL(estimativa.max)}
        </p>
        <p className="text-sm text-gray mb-6">
          Faixa realista pro mercado brasileiro em 2026. O valor exato depende
          do detalhamento do escopo.
        </p>

        {/* Breakdown */}
        <div className="border border-white/[0.08] rounded-xl overflow-hidden mb-8">
          <table className="w-full text-sm">
            <tbody>
              {estimativa.breakdown.map((linha, i) => (
                <tr
                  key={i}
                  className="border-b border-white/[0.06] last:border-0"
                >
                  <td className="px-4 py-3 text-gray">{linha.label}</td>
                  <td className="px-4 py-3 text-right text-foreground whitespace-nowrap">
                    {linha.min < 0
                      ? `- ${formatBRL(Math.abs(linha.min))}`
                      : formatBRL(linha.min)}{" "}
                    <span className="text-gray">a</span>{" "}
                    {linha.max < 0
                      ? `- ${formatBRL(Math.abs(linha.max))}`
                      : formatBRL(linha.max)}
                  </td>
                </tr>
              ))}
              <tr className="bg-brand/5">
                <td className="px-4 py-3 font-bold text-foreground">Total</td>
                <td className="px-4 py-3 text-right font-bold text-foreground whitespace-nowrap">
                  {formatBRL(estimativa.min)}{" "}
                  <span className="text-gray font-normal">a</span>{" "}
                  {formatBRL(estimativa.max)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Captura de e-mail */}
        {formStatus === "success" ? (
          <div className="text-center py-6">
            <p className="font-heading text-xl font-bold text-foreground mb-2">
              Recebido! Vou preparar seu orçamento detalhado.
            </p>
            <p className="text-sm text-gray mb-6">
              Você recebe no seu e-mail em até 1 dia útil, com o breakdown
              completo do escopo. Quer adiantar? Me chame agora:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/5554999648368?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                data-track="contact"
                data-track-source={`${config.slug}-whatsapp`}
                className="cta-btn"
              >
                CHAMAR NO WHATSAPP
              </a>
              <a
                href="https://cal.com/daniel-anders-emx5kl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-brand hover:text-brand-bright transition-colors no-underline"
              >
                ou agendar call gratuita de 15 min
              </a>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">
              Receber orçamento detalhado
            </h3>
            <p className="text-sm text-gray mb-4">
              Deixe seu e-mail e eu te envio um orçamento com o breakdown
              completo dessa estimativa, sem compromisso.
            </p>
            <form
              onSubmit={handleLeadSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <input
                type="text"
                name="name"
                required
                placeholder="Seu nome"
                className="flex-1 px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-gray focus:border-brand/30 focus:outline-none transition-colors text-sm"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-gray focus:border-brand/30 focus:outline-none transition-colors text-sm"
              />
              <button
                type="submit"
                disabled={formStatus === "loading"}
                className="cta-btn justify-center disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {formStatus === "loading" ? "Enviando..." : "QUERO O ORÇAMENTO"}
              </button>
            </form>
            {formStatus === "error" && (
              <p className="text-red-400 text-sm mt-3">{formError}</p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={reiniciar}
          className="text-xs text-gray hover:text-brand transition-colors mt-6 bg-transparent border-0 cursor-pointer p-0"
        >
          Refazer simulação
        </button>
      </div>
    );
  }

  /* ── WIZARD ── */
  return (
    <div className="glass-card !p-6 md:!p-8" data-testid="wizard">
      {/* Progresso */}
      <div className="flex items-center gap-2 mb-8">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={`h-1 rounded-full mb-2 ${
                i <= step ? "bg-brand" : "bg-white/[0.08]"
              }`}
            />
            <p
              className={`text-[0.65rem] font-bold uppercase tracking-wider ${
                i <= step ? "text-brand" : "text-gray"
              }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Passo 1 — Tipo */}
      {step === 0 && (
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-5">
            Que tipo de projeto você precisa?
          </h3>
          <div className="flex flex-col gap-3">
            {config.tipos.map((tipo) => (
              <button
                key={tipo.id}
                type="button"
                onClick={() => {
                  setTipoId(tipo.id);
                  setStep(1);
                }}
                className={optionClass(tipoId === tipo.id)}
              >
                <span className="block font-bold text-foreground text-sm mb-1">
                  {tipo.label}
                </span>
                <span className="block text-xs text-gray">{tipo.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Passo 2 — Volume */}
      {step === 1 && (
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-5">
            {config.unidadeLabel}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {config.volumes.map((vol) => (
              <button
                key={vol.id}
                type="button"
                onClick={() => {
                  setVolumeId(vol.id);
                  setStep(2);
                }}
                className={optionClass(volumeId === vol.id)}
              >
                <span className="block font-bold text-foreground text-sm">
                  {vol.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Passo 3 — Integrações */}
      {step === 2 && (
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">
            Precisa de alguma integração?
          </h3>
          <p className="text-sm text-gray mb-5">
            Marque todas que se aplicam — ou nenhuma.
          </p>
          <div className="flex flex-col gap-3 mb-6">
            {config.integracoes.map((integ) => (
              <button
                key={integ.id}
                type="button"
                onClick={() => toggleIntegracao(integ.id)}
                className={optionClass(integracaoIds.includes(integ.id))}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-bold text-foreground text-sm">
                    {integ.label}
                  </span>
                  <span className="text-xs text-gray whitespace-nowrap">
                    +{Math.round(integ.pct * 100)}%
                  </span>
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStep(3)}
            className="cta-btn w-full justify-center"
          >
            CONTINUAR
          </button>
        </div>
      )}

      {/* Passo 4 — Prazo */}
      {step === 3 && (
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-5">
            Pra quando você precisa?
          </h3>
          <div className="flex flex-col gap-3">
            {config.prazos.map((prazo) => (
              <button
                key={prazo.id}
                type="button"
                onClick={() => {
                  setPrazoId(prazo.id);
                  calcular(prazo.id);
                }}
                className={optionClass(prazoId === prazo.id)}
              >
                <span className="block font-bold text-foreground text-sm">
                  {prazo.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voltar */}
      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="text-xs text-gray hover:text-brand transition-colors mt-6 bg-transparent border-0 cursor-pointer p-0"
        >
          &larr; Voltar
        </button>
      )}
    </div>
  );
}
