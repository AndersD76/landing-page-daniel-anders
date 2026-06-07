"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string).trim();

    if (!email) {
      setStatus("error");
      setErrorMsg("Informe seu email");
      return;
    }

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Erro ao inscrever");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erro ao inscrever");
    }
  }

  if (status === "success") {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-green-400 font-medium">
          Inscrito com sucesso! Fique de olho no seu email.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
    >
      <input
        type="email"
        name="email"
        required
        placeholder="Seu melhor email"
        className="flex-1 px-5 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-gray-700 focus:border-brand/30 focus:outline-none transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="cta-btn whitespace-nowrap justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{status === "loading" ? "Enviando..." : "Inscrever-se"}</span>
      </button>

      {status === "error" && (
        <p className="text-red-400 text-sm sm:absolute sm:bottom-[-24px] sm:left-0">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
