import { Resend } from "resend";
import { escapeHtml } from "./security";

const FROM_EMAIL = "Daniel Anders <contato@andersdev.com.br>";
const NOTIFY_EMAIL = "danielanders76@gmail.com";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface LeadNotificationData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
}

export async function sendLeadNotification(lead: LeadNotificationData) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `Novo Lead: ${escapeHtml(lead.name)} — ${escapeHtml(lead.source || "website")}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #e63946;">Novo lead da landing page</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Nome</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(lead.name)}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(lead.email)}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Telefone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(lead.phone || "—")}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Empresa</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(lead.company || "—")}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Mensagem</td><td style="padding: 8px;">${escapeHtml(lead.message || "—")}</td></tr>
          </table>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send lead notification:", err);
  }
}

export async function sendLeadMagnetEmail(to: string, name: string) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Seu Template de Especificação de App — Download",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e63946;">Olá ${escapeHtml(name)}!</h2>
          <p>Obrigado por baixar o <strong>Template de Especificação de App para Startup</strong>.</p>
          <p>Clique no botão abaixo para fazer o download:</p>
          <a href="https://www.andersdev.com.br/downloads/spec-app-startup.pdf"
             style="display: inline-block; padding: 14px 28px; background: #e63946; color: #030303; font-weight: 700; text-decoration: none; border-radius: 8px; margin: 16px 0;">
            BAIXAR TEMPLATE (PDF)
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 24px;">
            Precisa de ajuda pra preencher? Agende uma call gratuita de 15 minutos:
            <a href="https://cal.com/daniel-anders-emx5kl" style="color: #e63946;">Agendar agora</a>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="color: #999; font-size: 12px;">Daniel Anders — andersdev.com.br</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send lead magnet email:", err);
  }
}

export async function sendWebhookNotification(lead: LeadNotificationData) {
  const slackUrl = process.env.SLACK_WEBHOOK_URL;
  if (slackUrl) {
    try {
      await fetch(slackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🚀 Novo lead: *${escapeHtml(lead.name)}* (${escapeHtml(lead.email)}) — ${escapeHtml(lead.source || "website")}`,
        }),
      });
    } catch (err) {
      console.error("Slack webhook failed:", err);
    }
  }
}
