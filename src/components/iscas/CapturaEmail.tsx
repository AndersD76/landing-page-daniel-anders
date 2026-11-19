"use client";

import { useState } from "react";
import { attributionPayload, lerSessao } from "@/lib/attribution";
import { contextoDaPagina, rastrear } from "@/lib/telemetria/cliente";
import type { RelatorioIsca } from "@/lib/email-crescimento";

/**
 * Formulário único de captura das iscas.
 *
 * O resultado completo vai por e-mail — é o que a pessoa pediu. O opt-in de
 * marketing é outra caixa, desmarcada, com texto explícito: sem ela, ninguém
 * entra em sequência.
 */
export function CapturaEmail(props: {
  iscaId: string;
  relatorio: RelatorioIsca;
  entrada?: Record<string, unknown>;
  modeloSlug?: string;
  textoBotao?: string;
  titulo?: string;
  onSucesso?: (r: { linkDownload?: string }) => void;
}) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [optin, setOptin] = useState(false);
  const [estado, setEstado] = useState<"ocioso" | "enviando" | "ok" | "erro">("ocioso");
  const [erro, setErro] = useState("");
  const [link, setLink] = useState<string | undefined>();

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const honeypot = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value;
    setEstado("enviando");
    setErro("");
    const ctx = contextoDaPagina();
    const attr = attributionPayload();
    try {
      const res = await fetch("/api/isca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          iscaId: props.iscaId,
          nome,
          email,
          empresa: empresa || null,
          optinMarketing: optin,
          relatorio: props.relatorio,
          entrada: props.entrada,
          modeloSlug: props.modeloSlug,
          pagina: window.location.pathname,
          pageType: ctx.page_type,
          cluster: ctx.cluster,
          consultaAlvo: ctx.consulta_alvo,
          landingPage: attr.landingPage,
          utmSource: attr.utmSource,
          utmMedium: attr.utmMedium,
          utmCampaign: attr.utmCampaign,
          canal: attr.canal,
          atribuicao: attr.atribuicao,
          sessionId: lerSessao()?.sessionId,
          honeypot: honeypot || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.erro || "Não consegui enviar agora.");
      setEstado("ok");
      setLink(json.linkDownload);
      rastrear("lead_capturado", { isca_id: props.iscaId, optin: optin });
      props.onSucesso?.({ linkDownload: json.linkDownload });
    } catch (err) {
      setEstado("erro");
      setErro(err instanceof Error ? err.message : "Erro ao enviar.");
    }
  }

  if (estado === "ok") {
    return (
      <div className="glass-card border border-emerald-500/30" role="status">
        <p className="font-bold text-foreground mb-1">Enviado para {email}.</p>
        <p className="text-sm text-gray">
          Confira a caixa de entrada (e o spam, na primeira vez).
          {optin ? " Você também vai receber a série de conteúdos — dá para cancelar em 1 clique em qualquer e-mail." : ""}
        </p>
        {link && (
          <a
            href={link}
            className="inline-block mt-4 text-sm font-bold text-white bg-brand px-5 py-2.5 rounded-lg no-underline"
            onClick={() => rastrear("modelo_baixado", { isca_id: props.iscaId, slug: props.modeloSlug ?? "" })}
          >
            Baixar agora
          </a>
        )}
      </div>
    );
  }

  const campo =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-gray/60 focus:outline-none focus:border-brand";

  return (
    <form onSubmit={enviar} className="glass-card space-y-3" aria-label={props.titulo ?? "Receber o resultado completo"}>
      <p className="font-bold text-foreground">{props.titulo ?? "Receba o resultado completo por e-mail"}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <input className={campo} required minLength={2} placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" data-pii />
        <input className={campo} required type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" data-pii />
      </div>
      <input className={campo} placeholder="Empresa (opcional)" value={empresa} onChange={(e) => setEmpresa(e.target.value)} autoComplete="organization" data-pii />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex items-start gap-2 text-xs text-gray cursor-pointer">
        <input type="checkbox" checked={optin} onChange={(e) => setOptin(e.target.checked)} className="mt-0.5" />
        <span>Quero receber uma série curta de conteúdos sobre este tema (5 e-mails). Opcional — cancelo quando quiser.</span>
      </label>
      <button
        type="submit"
        disabled={estado === "enviando"}
        className="w-full sm:w-auto text-sm font-bold text-white bg-brand px-6 py-3 rounded-lg disabled:opacity-60"
      >
        {estado === "enviando" ? "Enviando…" : props.textoBotao ?? "Enviar para meu e-mail"}
      </button>
      {erro && <p className="text-sm text-red-400" role="alert">{erro}</p>}
      <p className="text-[11px] text-gray/80">
        Usamos seu e-mail para enviar este resultado. Detalhes na <a href="/privacidade" className="underline">política de privacidade</a>.
      </p>
    </form>
  );
}
