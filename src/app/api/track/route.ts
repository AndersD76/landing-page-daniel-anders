import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { pageviews, ctaEvents } from "@/lib/db/schema";
import { rateLimit, getClientIp } from "@/lib/security";
import { NOMES_EVENTOS } from "@/lib/telemetria/eventos";
import { executar, temBanco } from "@/lib/ops/sql";
import { classificarCanal } from "@/lib/seo/taxonomia";

/**
 * Coleta de tráfego própria — destino de referência da telemetria.
 *
 * Grava pageview, evento de CTA e evento da taxonomia no mesmo banco do lead,
 * para responder "qual página gerou dinheiro" com um join em vez de
 * exportação do GA4.
 *
 * Privacidade: o IP é usado só para rate limit, em memória, e NÃO é gravado.
 * Nada aqui identifica pessoa.
 */

const curto = (n: number) => z.string().max(n).optional().nullable();

const pageviewSchema = z.object({
  tipo: z.literal("pageview"),
  path: z.string().min(1).max(500),
  landingPage: curto(500),
  referrerHost: curto(255),
  utmSource: curto(255),
  utmMedium: curto(255),
  utmCampaign: curto(255),
  canal: curto(20),
  pageType: curto(30),
  cluster: curto(40),
  sessionId: z.string().min(8).max(64),
  device: z.enum(["mobile", "desktop"]).optional(),
});

const ctaSchema = z.object({
  tipo: z.enum(["cta_visto", "cta_clicado"]),
  path: z.string().min(1).max(500),
  escopo: z.string().max(150).optional(),
  sessionId: z.string().min(8).max(64),
});

const toque = z
  .object({
    canal: curto(20),
    origem: curto(255),
    landing: curto(500),
    utmSource: curto(255),
    utmMedium: curto(255),
    utmCampaign: curto(255),
    em: curto(40),
  })
  .nullable()
  .optional();

const eventoSchema = z.object({
  tipo: z.literal("evento"),
  nome: z.enum(NOMES_EVENTOS as [string, ...string[]]),
  path: z.string().min(1).max(500),
  pageType: curto(30),
  cluster: curto(40),
  consultaAlvo: curto(200),
  iscaId: curto(60),
  props: z.record(z.union([z.string().max(300), z.number(), z.boolean(), z.null()])).optional(),
  sessionId: z.string().min(8).max(64),
  device: z.enum(["mobile", "desktop"]).optional(),
  lt: toque,
  ft: toque,
});

const corpoSchema = z.union([pageviewSchema, ctaSchema, eventoSchema]);

export async function POST(req: NextRequest) {
  // IP só para limitar abuso; não é gravado em lugar nenhum.
  const ip = getClientIp(req);
  if (!rateLimit(`track:${ip}`, 180, 60_000)) {
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
      const canal =
        d.canal ?? classificarCanal({ referrerHost: d.referrerHost, utmSource: d.utmSource, utmMedium: d.utmMedium, hostProprio: "www.andersdev.com.br" });
      const [pv] = await db
        .insert(pageviews)
        .values({
          path: d.path,
          landingPage: d.landingPage ?? null,
          referrerHost: d.referrerHost ?? null,
          utmSource: d.utmSource ?? null,
          utmMedium: d.utmMedium ?? null,
          utmCampaign: d.utmCampaign ?? null,
          sessionId: d.sessionId,
          device: d.device ?? null,
        })
        .returning({ id: pageviews.id });
      // Colunas novas fora do schema Drizzle legado (migração 2026-11-18).
      if (temBanco() && pv) {
        await executar(`UPDATE pageviews SET canal = $1, page_type = $2, cluster = $3 WHERE id = $4`, [
          canal,
          d.pageType ?? null,
          d.cluster ?? null,
          pv.id,
        ]).catch(() => {});
      }
    } else if (d.tipo === "evento") {
      await executar(
        `INSERT INTO eventos (nome, path, page_type, cluster, consulta_alvo, isca_id, session_id, canal, props,
           ft_canal, ft_origem, ft_landing, ft_utm_source, ft_utm_medium, ft_utm_campaign, ft_em,
           lt_canal, lt_origem, lt_landing, lt_utm_source, lt_utm_medium, lt_utm_campaign, device)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)`,
        [
          d.nome,
          d.path,
          d.pageType ?? null,
          d.cluster ?? null,
          d.consultaAlvo ?? null,
          d.iscaId ?? null,
          d.sessionId,
          d.lt?.canal ?? null,
          d.props ? JSON.stringify(d.props) : null,
          d.ft?.canal ?? null,
          d.ft?.origem ?? null,
          d.ft?.landing ?? null,
          d.ft?.utmSource ?? null,
          d.ft?.utmMedium ?? null,
          d.ft?.utmCampaign ?? null,
          d.ft?.em ? new Date(d.ft.em) : null,
          d.lt?.canal ?? null,
          d.lt?.origem ?? null,
          d.lt?.landing ?? null,
          d.lt?.utmSource ?? null,
          d.lt?.utmMedium ?? null,
          d.lt?.utmCampaign ?? null,
          d.device ?? null,
        ]
      );
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
