import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailSubscribers, leadEvents, leads } from "@/lib/db/schema";
import { leadMagnetSchema } from "@/lib/validations";
import {
  sendLeadMagnetEmail,
  sendLeadNotification,
  sendWebhookNotification,
} from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!rateLimit(`magnet:${ip}`, 3, 60_000)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em 1 minuto." },
        { status: 429 },
      );
    }

    const body = await req.json();

    if (body.honeypot) {
      return NextResponse.json({ success: true });
    }

    const parsed = leadMagnetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email } = parsed.data;

    const [lead] = await db
      .insert(leads)
      .values({
        name,
        email,
        source: "lead-magnet-spec-app",
        message: "Baixou Template de Especificação de App",
      })
      .returning();

    await db.insert(leadEvents).values({
      leadId: lead.id,
      eventType: "lead_magnet_downloaded",
      payload: { magnet: "spec-app-startup" },
    });

    await db
      .insert(emailSubscribers)
      .values({
        email,
        name,
        source: "lead-magnet-spec-app",
        tags: ["lead-magnet", "spec-app"],
        status: "confirmed",
      })
      .onConflictDoNothing();

    sendLeadMagnetEmail(email, name);
    sendLeadNotification({
      name,
      email,
      source: "lead-magnet-spec-app",
      message: "Baixou Template de Especificação de App",
    });
    sendWebhookNotification({ name, email, source: "lead-magnet-spec-app" });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead magnet API error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
