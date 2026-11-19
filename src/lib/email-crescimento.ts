/**
 * E-mails do crescimento orgânico: resultado de isca (transacional), sequência
 * por cluster (marketing, só com opt-in) e alertas internos.
 *
 * Sem RESEND_API_KEY nada é enviado e nada quebra — a função devolve false e
 * quem chama registra.
 */

import { Resend } from "resend";
import { escapeHtml, generateUnsubscribeToken } from "./security";

const FROM = "Daniel Anders <contato@andersdev.com.br>";
export const SITE = "https://www.andersdev.com.br";
export const EMAIL_ALERTA = process.env.ALERTA_EMAIL || "danielanders76@gmail.com";

export interface RelatorioIsca {
  titulo: string;
  resumo: string;
  destaques: Array<{ rotulo: string; valor: string }>;
  secoes: Array<{ titulo: string; itens: string[] }>;
}

function resend(): Resend | null {
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
}

export function urlDescadastro(email: string): string {
  return `${SITE}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${generateUnsubscribeToken(email)}`;
}

function moldura(conteudo: string, rodape: string): string {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#1a202c;line-height:1.6">
${conteudo}
<hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0 16px">
<p style="color:#718096;font-size:12px;margin:0">${rodape}</p>
</div>`;
}

export function htmlRelatorio(r: RelatorioIsca): string {
  const destaques = r.destaques
    .map(
      (d) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #edf2f7;color:#4a5568">${escapeHtml(d.rotulo)}</td><td style="padding:8px 12px;border-bottom:1px solid #edf2f7;font-weight:bold">${escapeHtml(d.valor)}</td></tr>`
    )
    .join("");
  const secoes = r.secoes
    .map(
      (s) =>
        `<h3 style="font-size:16px;margin:24px 0 8px">${escapeHtml(s.titulo)}</h3><ul style="padding-left:20px;margin:0">${s.itens
          .map((i) => `<li style="margin-bottom:6px">${escapeHtml(i)}</li>`)
          .join("")}</ul>`
    )
    .join("");
  return `<h2 style="color:#e63946;margin:0 0 8px">${escapeHtml(r.titulo)}</h2>
<p style="margin:0 0 16px">${escapeHtml(r.resumo)}</p>
${destaques ? `<table style="border-collapse:collapse;width:100%;margin-bottom:8px">${destaques}</table>` : ""}
${secoes}`;
}

/** Resultado completo da isca. Transacional: a pessoa pediu este e-mail. */
export async function enviarResultadoIsca(p: {
  para: string;
  nome: string;
  relatorio: RelatorioIsca;
  cta: { texto: string; href: string };
  linkDownload?: string;
}): Promise<boolean> {
  const r = resend();
  if (!r) return false;
  const download = p.linkDownload
    ? `<p><a href="${p.linkDownload}" style="display:inline-block;padding:12px 22px;background:#e63946;color:#fff;font-weight:bold;text-decoration:none;border-radius:8px">Baixar o arquivo</a></p>`
    : "";
  const html = moldura(
    `<p>Olá, ${escapeHtml(p.nome.split(" ")[0])}!</p>${htmlRelatorio(p.relatorio)}${download}
<p style="margin-top:24px">${escapeHtml(p.cta.texto)}: <a href="${p.cta.href}" style="color:#e63946">${p.cta.href.replace(SITE, "andersdev.com.br")}</a></p>
<p>Se quiser conversar sobre o resultado, é só responder este e-mail.</p><p>— Daniel Anders</p>`,
    `Você recebeu este e-mail porque pediu este resultado em andersdev.com.br. Ele não inscreve você em nenhuma lista.`
  );
  try {
    await r.emails.send({ from: FROM, to: p.para, subject: `Seu resultado: ${p.relatorio.titulo}`, html, replyTo: EMAIL_ALERTA });
    return true;
  } catch (e) {
    console.error("enviarResultadoIsca:", e);
    return false;
  }
}

/** E-mail de sequência: só para quem marcou o opt-in. Descadastro em 1 clique. */
export async function enviarEmailSequencia(p: { para: string; assunto: string; corpoHtml: string }): Promise<boolean> {
  const r = resend();
  if (!r) return false;
  const descadastro = urlDescadastro(p.para);
  const html = moldura(
    p.corpoHtml,
    `Você recebe esta série porque marcou "quero receber conteúdos" em andersdev.com.br. <a href="${descadastro}" style="color:#718096">Cancelar inscrição em 1 clique</a>.`
  );
  try {
    await r.emails.send({
      from: FROM,
      to: p.para,
      subject: p.assunto,
      html,
      replyTo: EMAIL_ALERTA,
      headers: {
        "List-Unsubscribe": `<${descadastro}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
    return true;
  } catch (e) {
    console.error("enviarEmailSequencia:", e);
    return false;
  }
}

export async function enviarAlertaInterno(assunto: string, html: string): Promise<boolean> {
  const r = resend();
  if (!r) return false;
  try {
    await r.emails.send({ from: FROM, to: EMAIL_ALERTA, subject: assunto, html: moldura(html, "Alerta automático do painel /admin/crescimento.") });
    return true;
  } catch (e) {
    console.error("enviarAlertaInterno:", e);
    return false;
  }
}
