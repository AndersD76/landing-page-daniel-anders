import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { emailSubscribers, leadEvents, leads } from "@/lib/db/schema";
import { ISCAS, getIsca } from "@/data/iscas";
import { getCluster } from "@/lib/seo/taxonomia";
import { rateLimit, getClientIp } from "@/lib/security";
import { sendLeadNotification, sendWebhookNotification } from "@/lib/email";
import { enviarResultadoIsca, SITE, type RelatorioIsca } from "@/lib/email-crescimento";
import { executar, temBanco } from "@/lib/ops/sql";
import { assinarDownload } from "@/lib/download";

/**
 * Captura de lead das iscas.
 *
 * Grava a origem completa (página, consulta-alvo, UTM, canal, first/last
 * touch, isca), envia o resultado completo por e-mail (transacional), alerta o
 * Daniel na hora e — SÓ se o opt-in de marketing foi marcado — inscreve na
 * sequência de 5 e-mails do cluster.
 */

const texto = (n: number) => z.string().max(n).optional().nullable();

const relatorioSchema = z.object({
  titulo: z.string().max(200),
  resumo: z.string().max(1200),
  destaques: z.array(z.object({ rotulo: z.string().max(120), valor: z.string().max(200) })).max(20),
  secoes: z.array(z.object({ titulo: z.string().max(160), itens: z.array(z.string().max(600)).max(60) })).max(15),
});

const toque = z.record(z.union([z.string().max(500), z.null()])).nullable().optional();

const corpoSchema = z.object({
  iscaId: z.enum(ISCAS.map((i) => i.id) as [string, ...string[]]),
  nome: z.string().min(2).max(120),
  email: z.string().email().max(255),
  empresa: texto(200),
  optinMarketing: z.boolean(),
  relatorio: relatorioSchema,
  entrada: z.record(z.unknown()).optional(),
  /** slug do modelo, quando a isca é download */
  modeloSlug: z.string().regex(/^[a-z0-9-]+$/).max(120).optional(),
  pagina: z.string().max(500),
  pageType: texto(30),
  cluster: texto(40),
  consultaAlvo: texto(200),
  landingPage: texto(500),
  utmSource: texto(255),
  utmMedium: texto(255),
  utmCampaign: texto(255),
  canal: texto(20),
  atribuicao: z.object({ ft: toque, lt: toque }).optional(),
  sessionId: texto(64),
  honeypot: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`isca:${ip}`, 6, 60_000)) {
    return NextResponse.json({ erro: "Muitas tentativas. Tente de novo em 1 minuto." }, { status: 429 });
  }

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: "Requisição inválida" }, { status: 400 });
  }
  if ((corpo as { honeypot?: string })?.honeypot) return NextResponse.json({ ok: true });

  const r = corpoSchema.safeParse(corpo);
  if (!r.success) {
    return NextResponse.json({ erro: r.error.issues[0]?.message ?? "Dados inválidos" }, { status: 400 });
  }
  const d = r.data;
  const isca = getIsca(d.iscaId)!;
  const clusterId = d.cluster ?? isca.clusters[0] ?? "contratacao-projeto";
  const cluster = getCluster(clusterId);

  let linkDownload: string | undefined;
  if (d.modeloSlug) {
    const expira = Date.now() + 30 * 24 * 3600_000;
    linkDownload = `${SITE}/api/modelos/${d.modeloSlug}?e=${expira}&t=${assinarDownload(d.modeloSlug, expira)}`;
  }

  try {
    const [lead] = await db
      .insert(leads)
      .values({
        name: d.nome,
        email: d.email,
        company: d.empresa || null,
        source: `isca:${d.iscaId}`,
        message: `${isca.nome} — ${d.relatorio.titulo}: ${d.relatorio.resumo}`.slice(0, 4000),
        utmSource: d.utmSource || null,
        utmMedium: d.utmMedium || null,
        utmCampaign: d.utmCampaign || null,
        landingPage: d.landingPage || null,
        formPage: d.pagina,
        scope: d.iscaId,
      })
      .returning({ id: leads.id });

    if (temBanco()) {
      await executar(
        `UPDATE leads SET isca_id = $1, cluster = $2, canal = $3, atribuicao = $4, optin_marketing = $5, optin_em = $6 WHERE id = $7`,
        [
          d.iscaId,
          clusterId,
          d.canal ?? null,
          JSON.stringify({ ...d.atribuicao, consultaAlvo: d.consultaAlvo ?? null, pageType: d.pageType ?? null }),
          d.optinMarketing,
          d.optinMarketing ? new Date() : null,
          lead.id,
        ]
      );
      await executar(
        `INSERT INTO eventos (nome, path, page_type, cluster, consulta_alvo, isca_id, session_id, canal, props, origem_registro)
         VALUES ('lead_capturado', $1, $2, $3, $4, $5, $6, $7, $8, 'servidor')`,
        [d.pagina, d.pageType ?? null, clusterId, d.consultaAlvo ?? null, d.iscaId, d.sessionId ?? null, d.canal ?? null, JSON.stringify({ lead_id: lead.id, optin: d.optinMarketing })]
      );
      // Mini-curso: o pedido É a série de 5 aulas (finalidade específica).
      // Demais iscas: sequência do cluster só com o opt-in marcado.
      const sequencia = d.iscaId === "mini-curso-sistema" ? "mini-curso-sistema" : d.optinMarketing ? clusterId : null;
      if (sequencia) {
        await executar(
          `INSERT INTO sequencias_inscricoes (email, nome, cluster, lead_id, passo, proximo_envio_em, status)
           VALUES ($1, $2, $3, $4, 0, now() + ($5 || ' days')::interval, 'ativa')
           ON CONFLICT (email, cluster) DO UPDATE SET status = 'ativa' WHERE sequencias_inscricoes.status <> 'concluida'`,
          [d.email, d.nome, sequencia, lead.id, sequencia === "mini-curso-sistema" ? "0" : "2"]
        );
      }
    }

    await db.insert(leadEvents).values({
      leadId: lead.id,
      eventType: "isca_concluida",
      payload: { isca: d.iscaId, entrada: d.entrada ?? null, relatorio: d.relatorio as RelatorioIsca, optin: d.optinMarketing },
    });

    if (d.optinMarketing) {
      await db
        .insert(emailSubscribers)
        .values({ email: d.email, name: d.nome, source: `isca:${d.iscaId}`, tags: [clusterId, d.iscaId], status: "confirmed", confirmedAt: new Date() })
        .onConflictDoNothing();
    }

    await enviarResultadoIsca({
      para: d.email,
      nome: d.nome,
      relatorio: d.relatorio,
      cta: { texto: cluster?.paginaComercial.rotulo ?? "Conheça o serviço", href: `${SITE}${cluster?.paginaComercial.href ?? "/"}` },
      linkDownload,
    });

    // Alerta imediato para o Daniel — com a origem que importa para a venda.
    void sendLeadNotification({
      name: d.nome,
      email: d.email,
      company: d.empresa ?? undefined,
      source: `isca:${d.iscaId}`,
      scope: `${clusterId} · ${d.canal ?? "canal?"}${d.consultaAlvo ? ` · "${d.consultaAlvo}"` : ""}`,
      message: `${d.relatorio.titulo} — ${d.relatorio.resumo}${d.optinMarketing ? " [opt-in marketing: SIM]" : ""}`,
      landingPage: d.landingPage ?? d.pagina,
    });
    void sendWebhookNotification({ name: d.nome, email: d.email, source: `isca:${d.iscaId}` });

    return NextResponse.json({ ok: true, linkDownload });
  } catch (err) {
    console.error("isca error:", err);
    return NextResponse.json({ erro: "Não consegui registrar agora. Tente de novo em instantes." }, { status: 500 });
  }
}
