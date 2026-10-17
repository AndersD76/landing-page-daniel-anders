import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { pageviews, ctaEvents } from "@/lib/db/schema";
import { rateLimit, getClientIp } from "@/lib/security";

/**
 * Coleta de tráfego própria.
 *
 * Grava pageview e evento de CTA no mesmo banco do lead, para responder
 * "qual página gerou dinheiro" com um join em vez de exportação do GA4.
 *
 * Privacidade: o IP é usado só para rate limit, em memória, e NÃO é gravado.
 * Nada aqui identifica pessoa.
 */

const pageviewSchema = z.object({
  tipo: z.literal("pageview"),
  path: z.string().min(1).max(500),
  landingPage: z.string().max(500).optional(),
  referrerHost: z.string().max(255).optional(),
  utmSource: z.string().max(255).optional(),
  utmMedium: z.string().max(255).optional(),
  utmCampaign: z.string().max(255).optional(),
  sessionId: z.string().min(8).max(64),
  device: z.enum(["mobile", "desktop"]).optional(),
});

const ctaSchema = z.object({
  tipo: z.enum(["cta_visto", "cta_clicado"]),
  path: z.string().min(1).max(500),
  escopo: z.string().max(150).optional(),
  sessionId: z.string().min(8).max(64),
});

const corpoSchema = z.union([pageviewSchema, ctaSchema]);

export async function POST(req: NextRequest) {
  // IP só para limitar abuso; não é gravado em lugar nenhum.
  const ip = getClientIp(req);
  if (!rateLimit(`track:${ip}`, 120, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = corpoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const d = parsed.data;
    if (d.tipo === "pageview") {
      await db.insert(pageviews).values({
        path: d.path,
        landingPage: d.landingPage ?? null,
        referrerHost: d.referrerHost ?? null,
        utmSource: d.utmSource ?? null,
        utmMedium: d.utmMedium ?? null,
        utmCampaign: d.utmCampaign ?? null,
        sessionId: d.sessionId,
        device: d.device ?? null,
      });
    } else {
      await db.insert(ctaEvents).values({
        tipo: d.tipo === "cta_visto" ? "visto" : "clicado",
        path: d.path,
        escopo: d.escopo ?? null,
        sessionId: d.sessionId,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Falha de coleta nunca pode afetar a navegação de quem está lendo.
    console.error("track error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
