"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/components/analytics/Analytics";
import { attributionPayload } from "@/lib/attribution";
import { leadFormSchema, suggestEmailFix } from "@/lib/validations";

interface CtaContextualProps {
  /** recorte da página: vai pré-preenchido e viaja com o lead */
  escopo: string;
  /** rótulo legível do recorte, para o texto da tela */
  escopoLabel: string;
  /** faixa calculada desta página — entra na mensagem do lead */
  faixa: string;
  source: string;
}

const PAPEIS = [
  "Dono / sócio",
  "Diretor / gerente",
  "Marketing",
  "Tecnologia",
  "Outro",
];

const PRAZOS = [
  { id: "agora", label: "Quero começar agora" },
  { id: "90-dias", label: "Nos próximos 90 dias" },
  { id: "avaliando", label: "Ainda avaliando" },
];

export function CtaContextual({
  escopo,
  escopoLabel,
  faixa,
  source,
}: CtaContextualProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [erro, setErro] = useState("");
  const [sugestao, setSugestao] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const jaVisto = useRef(false);

  /* CTA visto — sem esse denominador não dá para saber se a oferta não
     convence ou se ninguém chegou a ver. */
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !jaVisto.current) {
            jaVisto.current = true;
            trackEvent("cta_visto", { source, escopo });
            obs.disconnect();
          }
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [source, escopo]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setSugestao(null);

    const fd = new FormData(e.currentTarget);
    const email = ((fd.get("email") as string) || "").trim();

    const fix = suggestEmailFix(email);
    if (fix) {
      setSugestao(fix);
      setErro(`Você quis dizer ${fix}?`);
      return;
    }

    const payload = {
      name: ((fd.get("name") as string) || "").trim(),
      email,
      phone: ((fd.get("phone") as string) || "").trim() || undefined,
      role: (fd.get("role") as string) || undefined,
      scope: escopo,
      deadline: (fd.get("deadline") as string) || undefined,
      message: `Página: ${escopoLabel} | Faixa exibida: ${faixa}`,
      source,
      honeypot: ((fd.get("website") as string) || "") || undefined,
      ...attributionPayload(),
    };

    // Mesma validação que o servidor aplica, antes de gastar a viagem.
    const parsed = leadFormSchema.safeParse(payload);
    if (!parsed.success) {
      setStatus("error");
      setErro(parsed.error.issues[0].message);
      return;
    }

    setStatus("loading");
    trackEvent("cta_clicado", { source, escopo });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      // Só confirma na tela o que o servidor confirmou ter gravado.
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Não consegui registrar seu pedido.");
      }

      setStatus("success");
      trackEvent("lead_enviado", {
        source,
        escopo,
        prazo: String(payload.deadline || "nao-informado"),
      });
    } catch (err) {
      setStatus("error");
      setErro(
        err instanceof Error
          ? err.message
          : "Não consegui registrar seu pedido. Tente de novo."
      );
    }
  }

  if (status === "success") {
    return (
      <div ref={boxRef} className="glass-card text-center py-10">
        <p className="font-heading text-xl font-bold text-foreground mb-2">
          Recebido. Vou preparar o detalhamento.
        </p>
        <p className="text-sm text-gray mb-6">
          Você recebe por e-mail o escopo aberto para {escopoLabel.toLowerCase()},
          com o que entra em cada faixa. Quer adiantar?
        </p>
        <a
          href={`https://wa.me/5554999648368?text=${encodeURIComponent(
            `Olá! Vi a página de ${escopoLabel} e quero conversar sobre o projeto.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn"
        >
          CHAMAR NO WHATSAPP
        </a>
      </div>
    );
  }

  return (
    <div ref={boxRef} className="glass-card" id="orcamento">
      <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2">
        Receber o escopo aberto de {escopoLabel.toLowerCase()}
      </h2>
      <p className="text-sm text-gray mb-6">
        Quatro campos. Eu respondo com o detalhamento do que entra em cada faixa
        desta página — sem compromisso e sem proposta genérica.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            name="name"
            required
            minLength={2}
            placeholder="Seu nome"
            className="px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-gray focus:border-brand/30 focus:outline-none transition-colors text-sm"
          />
          <input
            ref={emailRef}
            type="email"
            name="email"
            required
            placeholder="Seu melhor e-mail"
            className="px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-gray focus:border-brand/30 focus:outline-none transition-colors text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            name="role"
            required
            defaultValue=""
            className="px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground focus:border-brand/30 focus:outline-none transition-colors text-sm"
          >
            <option value="" disabled>
              Seu papel na decisão
            </option>
            {PAPEIS.map((p) => (
              <option key={p} value={p} className="bg-[#0c0c0c]">
                {p}
              </option>
            ))}
          </select>

          <input
            type="tel"
            name="phone"
            placeholder="WhatsApp (opcional)"
            className="px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-gray focus:border-brand/30 focus:outline-none transition-colors text-sm"
          />
        </div>

        <fieldset className="mt-1">
          <legend className="text-xs font-bold tracking-wide text-gray uppercase mb-2">
            Prazo de decisão
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRAZOS.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-2 px-3 py-2.5 border border-white/[0.08] rounded-xl cursor-pointer hover:border-brand/30 transition-colors text-sm text-gray has-[:checked]:border-brand/50 has-[:checked]:text-foreground"
              >
                <input
                  type="radio"
                  name="deadline"
                  value={p.id}
                  required
                  className="accent-brand"
                />
                {p.label}
              </label>
            ))}
          </div>
        </fieldset>

        {erro && (
          <p className="text-sm text-brand" role="alert">
            {erro}{" "}
            {sugestao && (
              <button
                type="button"
                onClick={() => {
                  if (emailRef.current) emailRef.current.value = sugestao;
                  setSugestao(null);
                  setErro("");
                }}
                className="underline font-bold"
              >
                Usar {sugestao}
              </button>
            )}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="cta-btn justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        >
          {status === "loading" ? "ENVIANDO..." : "QUERO O ESCOPO ABERTO"}
        </button>

        <p className="text-xs text-gray text-center">
          Seus dados ficam comigo e você só recebe e-mail porque preencheu este
          formulário. Descadastro em um clique.
        </p>
      </form>
    </div>
  );
}
