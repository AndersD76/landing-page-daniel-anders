import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads, leadEvents } from "@/lib/db/schema";
import { leadFormSchema } from "@/lib/validations";
import { sendLeadNotification, sendWebhookNotification } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/security";
import { executar, temBanco } from "@/lib/ops/sql";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    if (!rateLimit(`lead:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em 1 minuto." },
        { status: 429 }
      );
    }

    const body = await req.json();

    if (body.honeypot) {
      return NextResponse.json({ success: true, message: "Enviado" });
    }

    const parsed = leadFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const [lead] = await db
      .insert(leads)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        message: data.message || null,
        source: data.source || "website",
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
        landingPage: data.landingPage || null,
        formPage: data.formPage || null,
        role: data.role || null,
        scope: data.scope || null,
        deadline: data.deadline || null,
      })
      .returning();

    await db.insert(leadEvents).values({
      leadId: lead.id,
      eventType: "form_submitted",
      payload: {
        ip,
        userAgent: req.headers.get("user-agent"),
        landingPage: data.landingPage,
        formPage: data.formPage,
      },
    });

    // Conversão "cadastro" registrada no servidor, com a origem do lead.
    if (temBanco()) {
      await executar(
        `INSERT INTO eventos (nome, path, canal, props, lt_landing, lt_utm_source, lt_utm_medium, lt_utm_campaign, origem_registro)
         VALUES ('orcamento_solicitado', $1, $2, $3, $4, $5, $6, $7, 'servidor')`,
        [data.formPage ?? null, body.canal ?? null, JSON.stringify({ lead_id: lead.id, escopo: data.scope ?? null }), data.landingPage ?? null, data.utmSource ?? null, data.utmMedium ?? null, data.utmCampaign ?? null]
      ).catch(() => {});
      if (body.atribuicao || body.canal) {
        await executar(`UPDATE leads SET canal = $1, atribuicao = $2 WHERE id = $3`, [
          typeof body.canal === "string" ? body.canal.slice(0, 20) : null,
          body.atribuicao ? JSON.stringify(body.atribuicao).slice(0, 4000) : null,
          lead.id,
        ]).catch(() => {});
      }
    }

    sendLeadNotification({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      message: data.message,
      source: data.source,
      role: data.role,
      scope: data.scope,
      deadline: data.deadline,
      landingPage: data.landingPage,
    });

    sendWebhookNotification({
      name: data.name,
      email: data.email,
      source: data.source,
    });

    return NextResponse.json({
      success: true,
      message: "Lead salvo com sucesso",
    });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
