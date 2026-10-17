import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pageviews, ctaEvents, leads } from "@/lib/db/schema";
import { sql, gte, desc, countDistinct } from "drizzle-orm";
import { verifyToken, verifyAdminCookie, rateLimit, getClientIp } from "@/lib/security";

/** Janela padrão do painel, em dias. */
const DIAS_PADRAO = 30;

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`admin-trafego:${ip}`, 30, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  const bearer = req.headers.get("authorization")?.replace("Bearer ", "");
  const cookie = req.cookies.get("admin_session")?.value;
  if (!verifyAdminCookie(cookie) && !verifyToken(bearer, process.env.ADMIN_PASSWORD)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dias = Math.min(
    Math.max(Number(req.nextUrl.searchParams.get("dias")) || DIAS_PADRAO, 1),
    365
  );
  const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);

  try {
    const [porDia, porPagina, porOrigem, porEntrada, cta, leadsPorEntrada, totais] =
      await Promise.all([
        db
          .select({
            dia: sql<string>`to_char(${pageviews.createdAt}, 'YYYY-MM-DD')`,
            views: sql<number>`count(*)::int`,
            sessoes: countDistinct(pageviews.sessionId),
          })
          .from(pageviews)
          .where(gte(pageviews.createdAt, desde))
          .groupBy(sql`1`)
          .orderBy(sql`1`),

        db
          .select({
            path: pageviews.path,
            views: sql<number>`count(*)::int`,
            sessoes: countDistinct(pageviews.sessionId),
          })
          .from(pageviews)
          .where(gte(pageviews.createdAt, desde))
          .groupBy(pageviews.path)
          .orderBy(desc(sql`count(*)`))
          .limit(30),

        db
          .select({
            origem: sql<string>`coalesce(${pageviews.utmSource}, ${pageviews.referrerHost}, 'direto')`,
            medium: sql<string>`coalesce(${pageviews.utmMedium}, '-')`,
            sessoes: countDistinct(pageviews.sessionId),
          })
          .from(pageviews)
          .where(gte(pageviews.createdAt, desde))
          .groupBy(sql`1`, sql`2`)
          .orderBy(desc(countDistinct(pageviews.sessionId)))
          .limit(20),

        db
          .select({
            landingPage: pageviews.landingPage,
            sessoes: countDistinct(pageviews.sessionId),
          })
          .from(pageviews)
          .where(gte(pageviews.createdAt, desde))
          .groupBy(pageviews.landingPage)
          .orderBy(desc(countDistinct(pageviews.sessionId)))
          .limit(20),

        db
          .select({
            tipo: ctaEvents.tipo,
            sessoes: countDistinct(ctaEvents.sessionId),
          })
          .from(ctaEvents)
          .where(gte(ctaEvents.createdAt, desde))
          .groupBy(ctaEvents.tipo),

        // É este join que responde qual página gera dinheiro.
        db
          .select({
            landingPage: leads.landingPage,
            total: sql<number>`count(*)::int`,
          })
          .from(leads)
          .where(gte(leads.createdAt, desde))
          .groupBy(leads.landingPage)
          .orderBy(desc(sql`count(*)`))
          .limit(20),

        db
          .select({
            views: sql<number>`count(*)::int`,
            sessoes: countDistinct(pageviews.sessionId),
          })
          .from(pageviews)
          .where(gte(pageviews.createdAt, desde)),
      ]);

    const vistos = cta.find((c) => c.tipo === "visto")?.sessoes ?? 0;
    const clicados = cta.find((c) => c.tipo === "clicado")?.sessoes ?? 0;
    const sessoes = totais[0]?.sessoes ?? 0;

    const [{ totalLeads }] = await db
      .select({ totalLeads: sql<number>`count(*)::int` })
      .from(leads)
      .where(gte(leads.createdAt, desde));

    return NextResponse.json({
      dias,
      totais: {
        views: totais[0]?.views ?? 0,
        sessoes,
        ctaVisto: vistos,
        ctaClicado: clicados,
        leads: totalLeads,
      },
      // Funil por sessão distinta, cada taxa sobre a etapa anterior.
      funil: {
        sessoes,
        ctaVisto: vistos,
        ctaClicado: clicados,
        leads: totalLeads,
        taxaVistoSobreSessao: sessoes ? (vistos / sessoes) * 100 : null,
        taxaClicadoSobreVisto: vistos ? (clicados / vistos) * 100 : null,
        taxaLeadSobreClicado: clicados ? (totalLeads / clicados) * 100 : null,
      },
      porDia,
      porPagina,
      porOrigem,
      porEntrada,
      leadsPorEntrada,
    });
  } catch (err) {
    console.error("admin/trafego error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
