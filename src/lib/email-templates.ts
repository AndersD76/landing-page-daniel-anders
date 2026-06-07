// Nurture email templates for lead magnet sequence
// Each template returns an HTML string with branding for andersdev.com.br

import { escapeHtml } from "./security";

const BRAND_RED = "#e63946";
const BRAND_NAVY = "#0a1929";
const SITE_URL = "https://andersdev.com.br";
const CAL_URL = "https://cal.com/danielanders/15min";

function layout(content: string, unsubscribeUrl: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND_NAVY};padding:24px 32px;">
              <a href="${SITE_URL}" style="color:#ffffff;font-size:20px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">
                anders<span style="color:${BRAND_RED};">dev</span>.com.br
              </a>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;color:#333333;font-size:16px;line-height:1.6;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #eee;text-align:center;">
              <p style="color:#999;font-size:12px;margin:0 0 8px;">
                Daniel Anders &mdash; Consultoria em Software &amp; Apps
              </p>
              <p style="color:#999;font-size:12px;margin:0 0 8px;">
                <a href="${SITE_URL}" style="color:${BRAND_RED};text-decoration:none;">${SITE_URL}</a>
              </p>
              <p style="margin:0;">
                <a href="${unsubscribeUrl}" style="color:#999;font-size:11px;text-decoration:underline;">
                  Cancelar inscrição
                </a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(text: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;padding:14px 28px;background-color:${BRAND_RED};color:#ffffff;font-weight:700;text-decoration:none;border-radius:8px;margin:16px 0;font-size:16px;">${text}</a>`;
}

// Email 1 — Day 0: Welcome + template usage tips
function nurtureEmail1(name: string, unsubscribeUrl: string): string {
  return layout(
    `<h2 style="color:${BRAND_NAVY};margin:0 0 16px;">Olá ${escapeHtml(name)}, bem-vindo(a)! \u{1F44B}</h2>
    <p>Obrigado por baixar o <strong>Template de Especificação de App para Startup</strong>. Vou te enviar algumas dicas nos próximos dias para você tirar o máximo do template.</p>
    <p>Aqui vão <strong>3 dicas rápidas</strong> para começar:</p>
    <ol style="padding-left:20px;">
      <li style="margin-bottom:8px;"><strong>Preencha a seção de "Problema"</strong> antes de qualquer outra. Se você não consegue descrever o problema em 2 frases, o app ainda não está maduro o suficiente.</li>
      <li style="margin-bottom:8px;"><strong>Liste os usuários por perfil</strong>, não por cargo. "Gestor que precisa aprovar orçamentos" é melhor que "gerente".</li>
      <li style="margin-bottom:8px;"><strong>Priorize funcionalidades</strong> usando MoSCoW (Must / Should / Could / Won't). Isso evita o clássico "quero tudo pro MVP".</li>
    </ol>
    <p>Se tiver dúvidas, é só responder este email. Eu leio todas as respostas pessoalmente.</p>
    <p style="margin-top:24px;">
      ${ctaButton("Agendar call gratuita de 15 min", CAL_URL)}
    </p>
    <p style="color:#666;font-size:14px;">Até o próximo email,<br><strong>Daniel Anders</strong></p>`,
    unsubscribeUrl,
  );
}

// Email 2 — Day 3: "3 erros que fundadores cometem ao especificar o app"
function nurtureEmail2(name: string, unsubscribeUrl: string): string {
  return layout(
    `<h2 style="color:${BRAND_NAVY};margin:0 0 16px;">${escapeHtml(name)}, 3 erros fatais na especificação de apps</h2>
    <p>Depois de ajudar dezenas de startups a tirar apps do papel, percebi que os mesmos 3 erros se repetem:</p>

    <div style="background-color:#f8f9fa;border-left:4px solid ${BRAND_RED};padding:16px;margin:16px 0;border-radius:0 8px 8px 0;">
      <h3 style="color:${BRAND_RED};margin:0 0 8px;">Erro #1: Especificar soluções em vez de problemas</h3>
      <p style="margin:0;color:#555;">"Quero um botão que faça X" em vez de "O usuário precisa resolver Y". Quando você foca no problema, a solução pode ser mais simples (e barata) do que imaginava.</p>
    </div>

    <div style="background-color:#f8f9fa;border-left:4px solid ${BRAND_RED};padding:16px;margin:16px 0;border-radius:0 8px 8px 0;">
      <h3 style="color:${BRAND_RED};margin:0 0 8px;">Erro #2: MVP com 47 funcionalidades</h3>
      <p style="margin:0;color:#555;">MVP é o <strong>Mínimo</strong> Viável. Se tem mais de 5-7 features no core, não é um MVP. É um produto completo disfarcçado &mdash; e vai custar como tal.</p>
    </div>

    <div style="background-color:#f8f9fa;border-left:4px solid ${BRAND_RED};padding:16px;margin:16px 0;border-radius:0 8px 8px 0;">
      <h3 style="color:${BRAND_RED};margin:0 0 8px;">Erro #3: Ignorar o fluxo do usuário</h3>
      <p style="margin:0;color:#555;">Listar telas não é suficiente. O dev precisa saber: de onde o usuário vem, o que faz, e para onde vai. Sem isso, cada tela é uma ilha.</p>
    </div>

    <p>O template que você baixou já te guia para evitar esses erros. Já começou a preencher?</p>
    <p style="margin-top:24px;">
      ${ctaButton("Precisa de ajuda? Fale comigo", CAL_URL)}
    </p>
    <p style="color:#666;font-size:14px;">Abraço,<br><strong>Daniel Anders</strong></p>`,
    unsubscribeUrl,
  );
}

// Email 3 — Day 7: Case study
function nurtureEmail3(name: string, unsubscribeUrl: string): string {
  return layout(
    `<h2 style="color:${BRAND_NAVY};margin:0 0 16px;">Como uma startup economizou 3 meses com uma boa spec</h2>
    <p>Oi ${escapeHtml(name)},</p>
    <p>Quero compartilhar um caso real (nomes alterados por privacidade):</p>

    <div style="background-color:${BRAND_NAVY};color:#ffffff;padding:24px;border-radius:8px;margin:16px 0;">
      <p style="margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:${BRAND_RED};">Case Study</p>
      <h3 style="margin:0 0 12px;color:#ffffff;">HealthTrack &mdash; App de gestão para clínicas</h3>
      <p style="margin:0 0 16px;color:#ccc;">O fundador chegou com 23 páginas de "requisitos" que eram basicamente capturas de tela de 5 concorrentes coladas num Word.</p>

      <p style="margin:0 0 8px;"><strong style="color:${BRAND_RED};">O problema:</strong> <span style="color:#ccc;">3 devs já tinham recusado o projeto por falta de clareza. Orçamentos variavam de R$50k a R$200k.</span></p>
      <p style="margin:0 0 8px;"><strong style="color:${BRAND_RED};">O que fizemos:</strong> <span style="color:#ccc;">2 sessões de 1h para preencher o template de spec juntos. Identificamos que 60% das features eram "nice to have".</span></p>
      <p style="margin:0;"><strong style="color:${BRAND_RED};">Resultado:</strong> <span style="color:#ccc;">MVP entregue em 8 semanas por R$45k em vez dos 5+ meses estimados inicialmente. App já está com 200+ usuários ativos.</span></p>
    </div>

    <p>A diferença entre gastar R$50k e R$200k muitas vezes não é o app &mdash; é a <strong>clareza da especificação</strong>.</p>
    <p style="margin-top:24px;">
      ${ctaButton("Quero clareza no meu projeto", CAL_URL)}
    </p>
    <p style="color:#666;font-size:14px;">Daniel Anders</p>`,
    unsubscribeUrl,
  );
}

// Email 4 — Day 10: Checklist
function nurtureEmail4(name: string, unsubscribeUrl: string): string {
  return layout(
    `<h2 style="color:${BRAND_NAVY};margin:0 0 16px;">Checklist: seu app está pronto pra desenvolvimento?</h2>
    <p>Oi ${escapeHtml(name)},</p>
    <p>Antes de começar a desenvolver (ou contratar um dev), passe por este checklist rápido:</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee;">
          <span style="color:${BRAND_RED};font-size:20px;margin-right:8px;">☐</span>
          <strong>Problema definido</strong> em 1-2 frases claras
        </td>
      </tr>
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee;">
          <span style="color:${BRAND_RED};font-size:20px;margin-right:8px;">☐</span>
          <strong>Público-alvo</strong> descrito com perfis específicos
        </td>
      </tr>
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee;">
          <span style="color:${BRAND_RED};font-size:20px;margin-right:8px;">☐</span>
          <strong>5-7 features core</strong> do MVP priorizadas (MoSCoW)
        </td>
      </tr>
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee;">
          <span style="color:${BRAND_RED};font-size:20px;margin-right:8px;">☐</span>
          <strong>Fluxo do usuário</strong> mapeado (de onde vem, o que faz, para onde vai)
        </td>
      </tr>
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee;">
          <span style="color:${BRAND_RED};font-size:20px;margin-right:8px;">☐</span>
          <strong>Integrações</strong> listadas (pagamento, auth, APIs externas)
        </td>
      </tr>
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee;">
          <span style="color:${BRAND_RED};font-size:20px;margin-right:8px;">☐</span>
          <strong>Critérios de sucesso</strong> definidos (como você sabe que o MVP deu certo?)
        </td>
      </tr>
      <tr>
        <td style="padding:12px;">
          <span style="color:${BRAND_RED};font-size:20px;margin-right:8px;">☐</span>
          <strong>Orçamento e timeline</strong> realistas (não "o mais barato e rápido possível")
        </td>
      </tr>
    </table>

    <p><strong>Marcou todos?</strong> Ótimo, seu projeto está maduro para desenvolvimento.</p>
    <p><strong>Faltou algum?</strong> Use o template para preencher as lacunas antes de contratar.</p>

    <p style="margin-top:24px;">
      ${ctaButton("Revisar minha spec com um especialista", CAL_URL)}
    </p>
    <p style="color:#666;font-size:14px;">Daniel Anders</p>`,
    unsubscribeUrl,
  );
}

// Email 5 — Day 14: Direct CTA
function nurtureEmail5(name: string, unsubscribeUrl: string): string {
  return layout(
    `<h2 style="color:${BRAND_NAVY};margin:0 0 16px;">Vamos transformar sua spec em produto?</h2>
    <p>Oi ${escapeHtml(name)},</p>
    <p>Nas últimas duas semanas, compartilhei:</p>
    <ul style="padding-left:20px;color:#555;">
      <li style="margin-bottom:8px;">Dicas para usar o template de especificação</li>
      <li style="margin-bottom:8px;">Os 3 erros mais comuns de fundadores</li>
      <li style="margin-bottom:8px;">Um case real de economia de tempo e dinheiro</li>
      <li style="margin-bottom:8px;">Checklist completo pra validar sua spec</li>
    </ul>
    <p>Agora, uma pergunta direta: <strong>você quer tirar seu app do papel?</strong></p>

    <div style="background-color:${BRAND_NAVY};color:#ffffff;padding:24px;border-radius:8px;margin:16px 0;">
      <h3 style="color:${BRAND_RED};margin:0 0 12px;">O que eu ofereço:</h3>
      <ul style="padding-left:20px;color:#ccc;margin:0;">
        <li style="margin-bottom:8px;">Consultoria de especificação (transformar sua ideia em documento técnico)</li>
        <li style="margin-bottom:8px;">Desenvolvimento de MVP com stack moderna (Next.js, React Native, NeonDB)</li>
        <li style="margin-bottom:8px;">Acompanhamento pós-lançamento e iterações</li>
      </ul>
    </div>

    <p>O primeiro passo é uma <strong>conversa gratuita de 15 minutos</strong>. Sem compromisso, sem pitch de vendas. Só entender seu projeto e ver se faz sentido trabalharmos juntos.</p>

    <p style="text-align:center;margin-top:24px;">
      ${ctaButton("AGENDAR CONVERSA GRATUITA", CAL_URL)}
    </p>

    <p style="color:#666;font-size:14px;margin-top:24px;">
      Se agora não é o momento, sem problemas. Você continua na lista e receberá conteúdos úteis sobre desenvolvimento de apps.
    </p>
    <p style="color:#666;font-size:14px;">Abraço,<br><strong>Daniel Anders</strong><br>andersdev.com.br</p>`,
    unsubscribeUrl,
  );
}

// ---------------------------------------------------------------------------
// Exported sequence definition
// ---------------------------------------------------------------------------

export interface NurtureStep {
  delay_days: number;
  subject: string;
  template_fn: (name: string, unsubscribeUrl: string) => string;
}

export const NURTURE_SEQUENCE: NurtureStep[] = [
  {
    delay_days: 0,
    subject: "Bem-vindo! Dicas para usar o Template de Spec de App",
    template_fn: nurtureEmail1,
  },
  {
    delay_days: 3,
    subject: "3 erros que fundadores cometem ao especificar o app",
    template_fn: nurtureEmail2,
  },
  {
    delay_days: 7,
    subject: "Case study: como uma startup economizou 3 meses",
    template_fn: nurtureEmail3,
  },
  {
    delay_days: 10,
    subject: "Checklist: seu app está pronto pra desenvolvimento?",
    template_fn: nurtureEmail4,
  },
  {
    delay_days: 14,
    subject: "Vamos transformar sua spec em produto?",
    template_fn: nurtureEmail5,
  },
];
