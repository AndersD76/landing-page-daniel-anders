"use client";

import { useState, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";
import { leadFormSchema } from "@/lib/validations";
import { trackEvent } from "@/components/analytics/Analytics";

export function ContactForm() {
  const { t } = useI18n();
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
      phone: (formData.get("phone") as string) || undefined,
      company: (formData.get("company") as string) || undefined,
      message: (formData.get("message") as string) || undefined,
      honeypot: (formData.get("website") as string) || undefined,
      source: "contact-form",
    };

    const parsed = leadFormSchema.safeParse(data);
    if (!parsed.success) {
      setStatus("error");
      setErrorMsg(parsed.error.issues[0].message);
      return;
    }

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Erro ao enviar");
      }

      setStatus("success");
      trackEvent("lead_form_submit", { source: "contact-form" });
      formRef.current?.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erro ao enviar");
    }
  }

  return (
    <section className="py-24" id="contact">
      <div className="container-main">
        <div className="glass-card grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12 p-5 sm:p-8 md:p-12">
          <div>
            <span className="section-label">{t("form_label")}</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
              {t("form_h2_1")}
              <br />
              <span className="text-brand">{t("form_h2_2")}</span>
            </h2>
            <p className="text-gray-500 text-lg mb-8">{t("form_p")}</p>
            <div className="flex flex-col gap-3">
              {(["form_t1", "form_t2", "form_t3", "form_t4"] as const).map(
                (key) => (
                  <div
                    key={key}
                    className="text-sm text-gray-600 font-mono tracking-wide"
                  >
                    {t(key)}
                  </div>
                )
              )}
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Honeypot */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <input
              type="text"
              name="name"
              required
              placeholder={t("form_name")}
              className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-gray-700 focus:border-brand/30 focus:outline-none transition-colors"
            />
            <input
              type="email"
              name="email"
              required
              placeholder={t("form_email")}
              className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-gray-700 focus:border-brand/30 focus:outline-none transition-colors"
            />
            <input
              type="tel"
              name="phone"
              placeholder={t("form_phone")}
              className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-gray-700 focus:border-brand/30 focus:outline-none transition-colors"
            />
            <input
              type="text"
              name="company"
              placeholder={t("form_company")}
              className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-gray-700 focus:border-brand/30 focus:outline-none transition-colors"
            />
            <textarea
              name="message"
              rows={3}
              placeholder={t("form_message")}
              className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-gray-700 focus:border-brand/30 focus:outline-none transition-colors resize-none"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="cta-btn w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {status === "loading" ? "Enviando..." : t("form_btn")}
              </span>
              {status !== "loading" && (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>

            {status === "success" && (
              <p className="text-green-400 text-sm text-center mt-2">
                {t("form_success")}
              </p>
            )}
            {status === "error" && (
              <p className="text-red-400 text-sm text-center mt-2">
                {errorMsg}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
