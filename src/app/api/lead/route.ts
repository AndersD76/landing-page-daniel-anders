import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads, leadEvents } from "@/lib/db/schema";
import { leadFormSchema } from "@/lib/validations";
import { sendLeadNotification, sendWebhookNotification } from "@/lib/email";

const RATE_LIMIT_MAP = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = RATE_LIMIT_MAP.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  RATE_LIMIT_MAP.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
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
      })
      .returning();

    await db.insert(leadEvents).values({
      leadId: lead.id,
      eventType: "form_submitted",
      payload: { ip, userAgent: req.headers.get("user-agent") },
    });

    sendLeadNotification({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      message: data.message,
      source: data.source,
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
