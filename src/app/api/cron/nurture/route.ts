import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailSubscribers, leadEvents, leads } from "@/lib/db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
import { NURTURE_SEQUENCE } from "@/lib/email-templates";
import { Resend } from "resend";

const FROM_EMAIL = "Daniel Anders <contato@andersdev.com.br>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://andersdev.com.br";
const BATCH_SIZE = 10; // rate limit: max emails per cron run

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

/**
 * Vercel Cron-compatible GET handler.
 * Scheduled to run daily at 9 AM (configured in vercel.json).
 *
 * Flow:
 * 1. Fetch all confirmed subscribers who came from the lead magnet
 * 2. For each subscriber, check which nurture emails they already received
 * 3. Determine which email is next based on days since signup
 * 4. Send the next email and record the event
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("CRON_SECRET env var is not set");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 },
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get all confirmed lead-magnet subscribers
    const subscribers = await db
      .select()
      .from(emailSubscribers)
      .where(
        and(
          eq(emailSubscribers.status, "confirmed"),
          eq(emailSubscribers.source, "lead-magnet-spec-app"),
        ),
      );

    if (subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No subscribers to process",
        sent: 0,
      });
    }

    // 2. Find corresponding leads (to record events)
    const subscriberEmails = subscribers.map((s) => s.email);
    const matchingLeads = await db
      .select()
      .from(leads)
      .where(inArray(leads.email, subscriberEmails));

    const leadByEmail = new Map(matchingLeads.map((l) => [l.email, l]));

    // 3. Get all nurture events already sent
    const leadIds = matchingLeads.map((l) => l.id);
    let existingEvents: { leadId: number; eventType: string }[] = [];

    if (leadIds.length > 0) {
      existingEvents = await db
        .select({
          leadId: leadEvents.leadId,
          eventType: leadEvents.eventType,
        })
        .from(leadEvents)
        .where(
          and(
            inArray(leadEvents.leadId, leadIds),
            sql`${leadEvents.eventType} LIKE 'nurture_email_%'`,
          ),
        );
    }

    // Build a set of "leadId:eventType" for fast lookup
    const sentSet = new Set(
      existingEvents.map((e) => `${e.leadId}:${e.eventType}`),
    );

    const resend = getResend();
    let sentCount = 0;
    const errors: string[] = [];
    const now = new Date();

    // 4. Process each subscriber
    for (const subscriber of subscribers) {
      if (sentCount >= BATCH_SIZE) break;

      const lead = leadByEmail.get(subscriber.email);
      if (!lead) continue;

      const daysSinceSignup = Math.floor(
        (now.getTime() - subscriber.createdAt.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Find the next email to send
      for (let i = 0; i < NURTURE_SEQUENCE.length; i++) {
        const step = NURTURE_SEQUENCE[i];
        const eventType = `nurture_email_${i + 1}`;

        // Skip if already sent
        if (sentSet.has(`${lead.id}:${eventType}`)) continue;

        // Skip if not enough days have passed
        if (daysSinceSignup < step.delay_days) break;

        // Send this email
        const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
        const html = step.template_fn(
          subscriber.name || "Fundador",
          unsubscribeUrl,
        );

        try {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: subscriber.email,
            subject: step.subject,
            html,
          });

          // Record the event
          await db.insert(leadEvents).values({
            leadId: lead.id,
            eventType,
            payload: {
              nurture_step: i + 1,
              subject: step.subject,
              sent_at: now.toISOString(),
            },
          });

          sentCount++;
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Unknown error";
          errors.push(`Failed to send to ${subscriber.email}: ${message}`);
          console.error(
            `Nurture email error for ${subscriber.email}:`,
            err,
          );
        }

        // Only send one email per subscriber per cron run
        break;
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      processed: subscribers.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("Nurture cron error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
