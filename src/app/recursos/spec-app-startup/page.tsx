"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { leadMagnetSchema } from "@/lib/validations";

export default function LeadMagnetPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      honeypot: (formData.get("website") as string) || undefined,
    };

    const parsed = leadMagnetSchema.safeParse(data);
    if (!parsed.success) {
      setStatus("error");
      setErrorMsg(parsed.error.issues[0].message);
      return;
    }

    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Erro ao enviar");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erro ao enviar");
    }
  }

  if (status === "success") {
    return (
      <main className="min-h-screen bg-surface-black text-foreground flex items-center justify-center px-8">
        <div className="max-w-lg text-center">
          <div className="text-6xl mb-6">&#10003;</div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Template enviado pro seu email!
          </h1>
          <p className="text-[#666] mb-8">
            Cheque sua caixa de entrada (e o spam, por via das dúvidas). O PDF
            vai chegar em menos de 5 minutos.
          </p>
          <div className="glass-card p-8 mb-8">
            <h2 className="font-heading text-xl font-bold mb-3">
              Quer ir mais rápido?
            </h2>
            <p className="text-sm text-[#666] mb-4">
              Agende uma call gratuita de 15 minutos. Eu te ajudo a preencher o
              template e a definir o escopo do seu MVP.
            </p>
            <a
              href="https://cal.com/danielanders/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              AGENDAR CALL GRATUITA
            </a>
          </div>
          <Link
            href="/"
            className="text-sm text-[#555] hover:text-brand transition-colors"
          >
            &larr; Voltar ao site
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-black text-foreground">
      <nav className="py-6">
        <div className="max-w-container mx-auto px-8">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <img src="/logo.png" alt="Anders Dev" className="w-8 h-8" />
            <span className="font-heading text-lg font-bold text-foreground tracking-tight">
              anders<span className="text-brand">dev</span>
            </span>
          </Link>
        </div>
      </nav>

      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold tracking-[4px] text-brand uppercase mb-4 block">
              RECURSO GRATUITO
            </span>
            <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-6">
              Template de Especificação de App pra Startup
              <span className="text-brand"> — pronto pra preencher</span>
            </h1>
            <p className="text-lg text-[#666] mb-8">
              O mesmo modelo que eu uso com meus clientes pra definir escopo,
              funcionalidades e stack antes de escrever uma linha de código. 15
              páginas, direto ao ponto.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {[
                "Checklist de funcionalidades essenciais vs nice-to-have",
                "Template de user stories prontas pra preencher",
                "Guia de decisão de stack técnica",
                "Modelo de cronograma e milestones",
                "Estimativa de custo por tipo de projeto",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-brand mt-1 shrink-0">&#10003;</span>
                  <p className="text-sm text-[#888]">{item}</p>
                </div>
              ))}
            </div>

            {/* Preview mockup */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((page) => (
                <div
                  key={page}
                  className="aspect-[3/4] bg-white/[0.03] border border-white/[0.06] rounded-lg flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-16 h-1 bg-brand/20 rounded mx-auto mb-2" />
                    <div className="w-12 h-1 bg-white/10 rounded mx-auto mb-1" />
                    <div className="w-14 h-1 bg-white/10 rounded mx-auto mb-1" />
                    <div className="w-10 h-1 bg-white/10 rounded mx-auto mb-3" />
                    <div className="w-8 h-1 bg-brand/10 rounded mx-auto" />
                  </div>
                  <span className="absolute bottom-2 text-[0.5rem] text-[#333]">
                    p.{page}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="glass-card p-8">
              <h2 className="font-heading text-2xl font-bold mb-2">
                Baixe grátis
              </h2>
              <p className="text-sm text-[#666] mb-6">
                Preencha seu nome e email. O PDF chega na sua caixa em menos de
                5 minutos.
              </p>

              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Seu nome"
                  className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-[#444] focus:border-brand/30 focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Seu melhor email"
                  className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-[#444] focus:border-brand/30 focus:outline-none transition-colors"
                />

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="cta-btn w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Enviando..." : "QUERO O TEMPLATE GRÁTIS"}
                </button>

                {status === "error" && (
                  <p className="text-red-400 text-sm text-center">{errorMsg}</p>
                )}
              </form>

              <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-white/[0.06]">
                <p className="text-[0.65rem] text-[#444]">
                  &#128274; Seus dados estão seguros. Não envio spam.
                </p>
                <p className="text-[0.65rem] text-[#444]">
                  +50 fundadores já baixaram este template.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
