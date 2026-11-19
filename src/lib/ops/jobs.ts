/**
 * Jobs agendados (chamados por /api/cron/* — agendador: GitHub Actions).
 *
 * diário:  ondas + IndexNow, ingestão (GSC, Bing, GA4), posições, inspeção de
 *          indexação, validação de rastreadores, linha de base, filas de
 *          produção/frescor/oportunidade e alertas.
 * semanal: SERP das 50 prioritárias, expansão do mapa de buscas, avaliação das
 *          ondas (regra dos 50% em 21 dias) e resumo por e-mail.
 *
 * Cada etapa é independente: sem credencial, registra "pulado" e segue.
 */

import { carregarConteudo } from "@/lib/conteudo";
import { classificarCluster, classificarIntencao, classificarTipoPagina, calcularPrioridade, getCluster } from "@/lib/seo/taxonomia";
import { todasUrlsIndexaveis } from "@/data/urls";
import { enviarAlertaInterno, SITE } from "@/lib/email-crescimento";
import { escapeHtml } from "@/lib/security";
import { anotar, consultar, executar, inserirEmLote, registrarExecucao } from "./sql";
import { ga4Diario, gscDesempenho, gscEnviarSitemap, gscInspecionar, temGoogle } from "./google";
import { bingConsultas, bingPaginas, checarSerp, temBing, temSerp } from "./externos";
import { baixarFaixas, ipNaFaixa } from "./crawlers";
import { anunciarNovidades, sincronizarConteudo, sincronizarDistribuicao } from "./registro";

type Resultado = Record<string, string>;

async function etapa(job: string, nome: string, out: Resultado, fn: () => Promise<string | number | void>) {
  try {
    const r = await fn();
    out[nome] = r === undefined ? "ok" : String(r);
    await registrarExecucao(`${job}:${nome}`, true, out[nome]);
  } catch (e) {
    out[nome] = `erro: ${e instanceof Error ? e.message : String(e)}`.slice(0, 300);
    await registrarExecucao(`${job}:${nome}`, false, out[nome]);
  }
}

const dia = (offset: number) => new Date(Date.now() + offset * 86400_000).toISOString().slice(0, 10);

/* ------------------------------------------------------------- ingestões */

async function ingerirGsc(): Promise<string> {
  if (!temGoogle()) return "pulado: GOOGLE_SERVICE_ACCOUNT_JSON ausente";
  const [{ n }] = await consultar<{ n: number }>(`SELECT count(*)::int AS n FROM gsc_desempenho`);
  // Primeira carga: 90 dias. Depois: os últimos 5 (o GSC consolida com ~2–3 dias de atraso).
  const linhas = await gscDesempenho(dia(n ? -5 : -90), dia(-1));
  await inserirEmLote(
    "gsc_desempenho",
    linhas.map((l) => ({
      data: l.keys[0],
      pagina: l.keys[1].slice(0, 500),
      consulta: l.keys[2].slice(0, 300),
      dispositivo: l.keys[3],
      cliques: l.clicks,
      impressoes: l.impressions,
      ctr: l.ctr,
      posicao: l.position,
    })),
    `ON CONFLICT (data, pagina, consulta, dispositivo) DO UPDATE SET cliques = EXCLUDED.cliques, impressoes = EXCLUDED.impressoes, ctr = EXCLUDED.ctr, posicao = EXCLUDED.posicao`
  );
  // Posição diária das consultas-alvo (as que estão no mapa de buscas).
  await executar(
    `INSERT INTO posicoes (data, consulta, pagina, posicao, impressoes, cliques, fonte)
     SELECT g.data, g.consulta, g.pagina, sum(g.posicao * g.impressoes) / NULLIF(sum(g.impressoes), 0), sum(g.impressoes), sum(g.cliques), 'gsc'
       FROM gsc_desempenho g JOIN mapa_buscas m ON m.consulta = g.consulta
      WHERE g.data >= $1
      GROUP BY g.data, g.consulta, g.pagina
     ON CONFLICT (data, consulta, pagina, fonte) DO UPDATE SET posicao = EXCLUDED.posicao, impressoes = EXCLUDED.impressoes, cliques = EXCLUDED.cliques`,
    [dia(n ? -5 : -90)]
  );
  // Consultas reais do GSC que ainda não estão no mapa entram nele.
  const novas = await consultar<{ consulta: string; posicao: number }>(
    `SELECT g.consulta, avg(g.posicao) AS posicao FROM gsc_desempenho g
      LEFT JOIN mapa_buscas m ON m.consulta = g.consulta
      WHERE m.id IS NULL AND g.consulta <> '' AND g.data >= $1 GROUP BY g.consulta HAVING sum(g.impressoes) >= 3 LIMIT 2000`,
    [dia(-28)]
  );
  if (novas.length) {
    await inserirEmLote(
      "mapa_buscas",
      novas.map((c) => {
        const intencao = classificarIntencao(c.consulta);
        const cluster = classificarCluster(c.consulta);
        return {
          consulta: c.consulta.slice(0, 200),
          intencao,
          cluster,
          tipo_pagina: classificarTipoPagina(c.consulta, intencao),
          isca_id: getCluster(cluster)?.isca ?? null,
          prioridade: calcularPrioridade(intencao, cluster, null) + 10,
          fonte: "gsc",
          volume_fonte: "gsc",
          coletado_em: dia(0),
        };
      }),
      `ON CONFLICT (consulta) DO NOTHING`
    );
  }
  return `${linhas.length} linhas, ${novas.length} consultas novas no mapa`;
}

async function ingerirBing(): Promise<string> {
  if (!temBing()) return "pulado: BING_WEBMASTER_API_KEY ausente";
  const linhas = [...(await bingConsultas()), ...(await bingPaginas())];
  await inserirEmLote(
    "bing_desempenho",
    linhas.map((l) => ({ data: l.data, pagina: l.pagina, consulta: l.consulta, cliques: l.cliques, impressoes: l.impressoes, posicao: l.posicao })),
    `ON CONFLICT (data, pagina, consulta) DO UPDATE SET cliques = EXCLUDED.cliques, impressoes = EXCLUDED.impressoes, posicao = EXCLUDED.posicao`
  );
  return `${linhas.length} linhas`;
}

async function ingerirGa4(): Promise<string> {
  if (!temGoogle() || !process.env.GA4_PROPERTY_ID) return "pulado: GA4_PROPERTY_ID/conta de serviço ausentes";
  const linhas = await ga4Diario(dia(-3), dia(-1));
  await inserirEmLote(
    "ga4_diario",
    linhas.map((l) => ({ data: l.data, pagina: l.pagina, canal: l.canal, sessoes: l.sessoes, usuarios: l.usuarios, eventos_chave: l.eventosChave })),
    `ON CONFLICT (data, pagina, canal) DO UPDATE SET sessoes = EXCLUDED.sessoes, usuarios = EXCLUDED.usuarios, eventos_chave = EXCLUDED.eventos_chave`
  );
  return `${linhas.length} linhas`;
}

async function inspecionarIndexacao(): Promise<string> {
  if (!temGoogle()) return "pulado: GOOGLE_SERVICE_ACCOUNT_JSON ausente";
  // Cota da API: 2.000 inspeções/dia por propriedade. Usamos até 200.
  const alvos = await consultar<{ url: string }>(
    `SELECT url FROM paginas_registro WHERE no_sitemap AND (verificada_em IS NULL OR verificada_em < now() - interval '14 days')
      ORDER BY (tipo IN ('pilar','existente')) DESC, verificada_em NULLS FIRST LIMIT 200`
  );
  let indexadas = 0;
  for (const { url } of alvos) {
    const r = await gscInspecionar(url).catch(() => null);
    if (!r) continue;
    const ok = r.verdict === "PASS";
    if (ok) indexadas++;
    await executar(
      `UPDATE paginas_registro SET indexada = $1, cobertura = $2, ultimo_rastreio = $3, verificada_em = now() WHERE url = $4`,
      [ok, r.coverageState?.slice(0, 120) ?? null, r.lastCrawlTime ? new Date(r.lastCrawlTime) : null, url]
    );
  }
  return `${alvos.length} inspecionadas, ${indexadas} indexadas`;
}

async function enviarSitemaps(): Promise<string> {
  if (!temGoogle()) return "pulado: GOOGLE_SERVICE_ACCOUNT_JSON ausente";
  await gscEnviarSitemap(`${SITE}/sitemap.xml`);
  await executar(`UPDATE paginas_registro SET sitemap_enviado_em = now() WHERE no_sitemap`);
  return "sitemap.xml enviado";
}

async function validarRastreadores(): Promise<string> {
  const pendentes = await consultar<{ id: number; bot: string; ip: string | null }>(
    `SELECT id, bot, ip FROM crawler_hits WHERE verificado IS NULL AND created_at > now() - interval '3 days' LIMIT 5000`
  );
  if (!pendentes.length) return "nada pendente";
  const faixas = await baixarFaixas();
  let validos = 0;
  for (const h of pendentes) {
    const cidrs = faixas.get(h.bot);
    if (!cidrs || !h.ip) continue; // provedor sem faixa publicada: fica sem verificação
    const ok = cidrs.some((c) => ipNaFaixa(h.ip!, c));
    if (ok) validos++;
    await executar(`UPDATE crawler_hits SET verificado = $1 WHERE id = $2`, [ok, h.id]);
  }
  // IP só serve para a validação: depois de 30 dias, sai.
  await executar(`UPDATE crawler_hits SET ip = NULL WHERE created_at < now() - interval '30 days' AND ip IS NOT NULL`);
  return `${pendentes.length} verificados, ${validos} confirmados pelo IP`;
}

/* ------------------------------------------------------------ linha de base */

export async function gravarLinhaBase(): Promise<string> {
  const hoje = dia(0);
  const existe = await consultar(`SELECT 1 FROM linha_base LIMIT 1`);
  const ausentes: string[] = [];
  const [gsc] = await consultar<{ cliques: number; impressoes: number; posicao: number | null }>(
    `SELECT coalesce(sum(cliques),0)::int AS cliques, coalesce(sum(impressoes),0)::int AS impressoes,
            sum(posicao * impressoes) / NULLIF(sum(impressoes),0) AS posicao
       FROM gsc_desempenho WHERE data >= $1`,
    [dia(-28)]
  );
  if (!temGoogle()) ausentes.push("Search Console (impressões, cliques, CTR, posição, indexadas)");
  const [idx] = await consultar<{ verificadas: number; indexadas: number }>(
    `SELECT count(*) FILTER (WHERE verificada_em IS NOT NULL)::int AS verificadas, count(*) FILTER (WHERE indexada)::int AS indexadas FROM paginas_registro`
  );
  const [org] = await consultar<{ sessoes: number }>(
    `SELECT count(DISTINCT session_id)::int AS sessoes FROM pageviews WHERE created_at > now() - interval '28 days' AND canal IN ('organico','ia')`
  );
  const [leads] = await consultar<{ total: number; organicos: number; vendas: number; receita: number }>(
    `SELECT count(*)::int AS total,
            count(*) FILTER (WHERE canal IN ('organico','ia') OR atribuicao->'ft'->>'canal' IN ('organico','ia'))::int AS organicos,
            count(*) FILTER (WHERE valor_fechado IS NOT NULL AND (canal IN ('organico','ia') OR atribuicao->'ft'->>'canal' IN ('organico','ia')))::int AS vendas,
            coalesce(sum(valor_fechado) FILTER (WHERE canal IN ('organico','ia') OR atribuicao->'ft'->>'canal' IN ('organico','ia')),0)::float AS receita
       FROM leads WHERE created_at > now() - interval '28 days'`
  );
  const metricas = {
    janela: "últimos 28 dias",
    urls_no_sitemap: todasUrlsIndexaveis().length,
    paginas_indexadas_verificadas: idx?.indexadas ?? 0,
    paginas_inspecionadas: idx?.verificadas ?? 0,
    impressoes: gsc?.impressoes ?? 0,
    cliques: gsc?.cliques ?? 0,
    ctr: gsc && gsc.impressoes ? gsc.cliques / gsc.impressoes : null,
    posicao_media: gsc?.posicao ?? null,
    visitas_organicas: org?.sessoes ?? 0,
    leads_organicos: leads?.organicos ?? 0,
    vendas_organicas: leads?.vendas ?? 0,
    receita_organica: leads?.receita ?? 0,
  };
  await executar(
    `INSERT INTO linha_base (data, metricas, fontes_ausentes) VALUES ($1, $2, $3)
     ON CONFLICT (data) DO UPDATE SET metricas = EXCLUDED.metricas, fontes_ausentes = EXCLUDED.fontes_ausentes, gravada_em = now()`,
    [hoje, JSON.stringify(metricas), JSON.stringify(ausentes)]
  );
  if (!existe.length) await anotar("linha-base", "Linha de base gravada", JSON.stringify(metricas), `linha-base:${hoje}`);
  return JSON.stringify(metricas).slice(0, 280);
}

/* ------------------------------------------------- filas de produção e melhoria */

async function encherFilaProducao(): Promise<string> {
  // Marca no mapa o que já tem página no ar.
  const { todas } = carregarConteudo();
  const comPagina = todas.filter((p) => p.qualidade.publicavel).flatMap((p) => [p.consulta, ...p.consultasSecundarias].map((c) => ({ c, url: p.urlAbsoluta })));
  for (let i = 0; i < comPagina.length; i += 300) {
    const parte = comPagina.slice(i, i + 300);
    await executar(
      `UPDATE mapa_buscas m SET status = 'com_pagina', url_alvo = v.url FROM (SELECT unnest($1::text[]) AS c, unnest($2::text[]) AS url) v WHERE m.consulta = v.c`,
      [parte.map((x) => x.c), parte.map((x) => x.url)]
    );
  }
  // Próximas 100 consultas sem página, nos tipos que o gerador sabe produzir.
  const r = await consultar<{ n: number }>(
    `WITH escolha AS (
       SELECT consulta, tipo_pagina, cluster, prioridade FROM mapa_buscas
        WHERE status = 'sem_pagina' AND tipo_pagina IN ('glossario','satelite','modelo','comparativo','norma') AND intencao <> 'navegacional'
        ORDER BY prioridade DESC, posicao_autocomplete NULLS LAST LIMIT 100)
     , ins AS (
       INSERT INTO fila_conteudo (consulta, tipo, cluster, prioridade, status)
       SELECT consulta, tipo_pagina, cluster, prioridade, 'pendente' FROM escolha
       ON CONFLICT (consulta, tipo) DO NOTHING RETURNING 1)
     SELECT count(*)::int AS n FROM ins`
  );
  return `${r[0]?.n ?? 0} consultas novas na fila de produção`;
}

async function filasDeMelhoria(): Promise<string> {
  // Oportunidade: posição média 4–15 com impressões → reforço da página.
  const op = await consultar<{ n: number }>(
    `WITH alvo AS (
       SELECT pagina, sum(impressoes) imp, sum(posicao*impressoes)/NULLIF(sum(impressoes),0) pos, sum(cliques) cli
         FROM gsc_desempenho WHERE data >= $1 GROUP BY pagina HAVING sum(impressoes) >= 50)
     , ins AS (
       INSERT INTO fila_conteudo (consulta, tipo, cluster, prioridade, status, motivo)
       SELECT pagina, 'reforco', '', 70, 'oportunidade',
              CASE WHEN pos BETWEEN 4 AND 15 THEN 'posição ' || round(pos::numeric,1) || ' com ' || imp || ' impressões: reforçar a página'
                   ELSE 'CTR ' || round((cli::numeric/imp)*100,1) || '% abaixo do esperado para a posição ' || round(pos::numeric,1) || ': reescrever o title' END
         FROM alvo
        WHERE pos BETWEEN 4 AND 15 OR (pos < 4 AND cli::float/imp < 0.05)
       ON CONFLICT (consulta, tipo) DO UPDATE SET motivo = EXCLUDED.motivo, atualizado_em = now() RETURNING 1)
     SELECT count(*)::int n FROM ins`,
    [dia(-28)]
  );
  // Frescor: queda de cliques > 30% (28 dias contra os 28 anteriores).
  const fr = await consultar<{ n: number }>(
    `WITH p AS (
       SELECT pagina, sum(cliques) FILTER (WHERE data >= $1) atual, sum(cliques) FILTER (WHERE data < $1 AND data >= $2) antes
         FROM gsc_desempenho WHERE data >= $2 GROUP BY pagina)
     , ins AS (
       INSERT INTO fila_conteudo (consulta, tipo, cluster, prioridade, status, motivo)
       SELECT pagina, 'frescor', '', 80, 'atualizar', 'cliques caíram de ' || antes || ' para ' || coalesce(atual,0) || ' em 28 dias'
         FROM p WHERE antes >= 10 AND coalesce(atual,0) < antes * 0.7
       ON CONFLICT (consulta, tipo) DO UPDATE SET motivo = EXCLUDED.motivo, status = 'atualizar', atualizado_em = now() RETURNING 1)
     SELECT count(*)::int n FROM ins`,
    [dia(-28), dia(-56)]
  );
  return `${op[0]?.n ?? 0} oportunidades, ${fr[0]?.n ?? 0} para atualizar`;
}

/* ---------------------------------------------------------------- alertas */

async function alertaUnico(chave: string, assunto: string, html: string): Promise<boolean> {
  const ja = await consultar(`SELECT 1 FROM alertas_enviados WHERE chave = $1`, [chave]);
  if (ja.length) return false;
  const ok = await enviarAlertaInterno(assunto, html);
  await executar(`INSERT INTO alertas_enviados (chave) VALUES ($1) ON CONFLICT DO NOTHING`, [chave]);
  await anotar("alerta", assunto, html.replace(/<[^>]+>/g, " ").slice(0, 500));
  return ok;
}

async function verificarAlertas(): Promise<string> {
  const disparados: string[] = [];
  const semana = dia(0).slice(0, 8) + String(Math.ceil(Number(dia(0).slice(8)) / 7));

  // 1. Queda > 30% de cliques semana contra semana num cluster.
  const quedas = await consultar<{ cluster: string; atual: number; antes: number }>(
    `SELECT pr.cluster, sum(g.cliques) FILTER (WHERE g.data >= $1)::int atual, sum(g.cliques) FILTER (WHERE g.data < $1)::int antes
       FROM gsc_desempenho g JOIN paginas_registro pr ON pr.url = g.pagina
      WHERE g.data >= $2 AND pr.cluster IS NOT NULL GROUP BY pr.cluster`,
    [dia(-7), dia(-14)]
  );
  for (const q of quedas.filter((x) => x.antes >= 10 && x.atual < x.antes * 0.7)) {
    if (await alertaUnico(`queda:${q.cluster}:${semana}`, `Queda de cliques no cluster ${q.cluster}`, `<p>Cliques caíram de ${q.antes} para ${q.atual} na última semana.</p>`))
      disparados.push(`queda ${q.cluster}`);
  }

  // 2. Página prioritária desindexada.
  const desindex = await consultar<{ url: string; cobertura: string }>(
    `SELECT url, cobertura FROM paginas_registro WHERE indexada = false AND verificada_em > now() - interval '1 day'
        AND (tipo IN ('pilar','existente') OR url LIKE '%/ferramentas/%' OR url LIKE '%/quanto-custa%')`
  );
  for (const d of desindex) {
    if (await alertaUnico(`desindexada:${d.url}:${semana}`, `Página prioritária fora do índice`, `<p>${escapeHtml(d.url)} — ${escapeHtml(d.cobertura ?? "")}</p>`))
      disparados.push(`desindexada ${d.url}`);
  }

  // 3. 5xx ou noindex indevido nas páginas indexáveis (amostra diária).
  const urls = todasUrlsIndexaveis();
  const amostra = urls.filter((_, i) => i % Math.max(1, Math.floor(urls.length / 40)) === 0).slice(0, 40);
  const problemas: string[] = [];
  for (const u of amostra) {
    try {
      const r = await fetch(u, { headers: { "User-Agent": "AndersDev-Monitor/1.0" }, signal: AbortSignal.timeout(15_000) });
      const html = r.status === 200 ? await r.text() : "";
      if (r.status >= 500) problemas.push(`${u} → HTTP ${r.status}`);
      else if (r.status === 200 && /<meta name="robots" content="[^"]*noindex/.test(html)) problemas.push(`${u} → noindex indevido`);
      else if (r.status === 404) problemas.push(`${u} → 404 (está no sitemap)`);
    } catch {
      problemas.push(`${u} → sem resposta`);
    }
  }
  if (problemas.length && (await alertaUnico(`saude:${dia(0)}`, `Páginas indexáveis com erro (${problemas.length})`, `<ul>${problemas.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>`)))
    disparados.push(`${problemas.length} páginas com erro`);

  // 4. Isca com conversão zero em 7 dias (vista, mas nenhum lead).
  const iscas = await consultar<{ isca_id: string; vistas: number; leads: number }>(
    `SELECT isca_id, count(*) FILTER (WHERE nome = 'isca_vista')::int vistas, count(*) FILTER (WHERE nome = 'lead_capturado')::int leads
       FROM eventos WHERE created_at > now() - interval '7 days' AND isca_id IS NOT NULL GROUP BY isca_id`
  );
  for (const i of iscas.filter((x) => x.vistas >= 30 && x.leads === 0)) {
    if (await alertaUnico(`isca-zero:${i.isca_id}:${semana}`, `Isca sem conversão em 7 dias: ${i.isca_id}`, `<p>${i.vistas} visualizações e nenhum lead. Reveja a oferta ou o texto do card.</p>`))
      disparados.push(`isca ${i.isca_id}`);
  }
  return disparados.join("; ") || "nenhum";
}

/* ------------------------------------------------------------- jobs públicos */

export async function jobDiario(): Promise<Resultado> {
  const out: Resultado = {};
  await etapa("diario", "conteudo-e-ondas", out, async () => {
    await sincronizarConteudo();
    await sincronizarDistribuicao();
  });
  await etapa("diario", "indexnow", out, async () => `${await anunciarNovidades()} URLs`);
  await etapa("diario", "gsc", out, ingerirGsc);
  await etapa("diario", "sitemap-gsc", out, enviarSitemaps);
  await etapa("diario", "inspecao", out, inspecionarIndexacao);
  await etapa("diario", "bing", out, ingerirBing);
  await etapa("diario", "ga4", out, ingerirGa4);
  await etapa("diario", "rastreadores", out, validarRastreadores);
  await etapa("diario", "fila-producao", out, encherFilaProducao);
  await etapa("diario", "filas-melhoria", out, filasDeMelhoria);
  await etapa("diario", "linha-base", out, gravarLinhaBase);
  await etapa("diario", "alertas", out, verificarAlertas);
  return out;
}

async function checarSerpPrioritarias(): Promise<string> {
  if (!temSerp()) return "pulado: SERPAPI_KEY ausente";
  const alvo = await consultar<{ consulta: string }>(
    `SELECT consulta FROM mapa_buscas WHERE intencao IN ('transacional','comercial','local') ORDER BY prioridade DESC, posicao_autocomplete NULLS LAST LIMIT 50`
  );
  for (const { consulta } of alvo) {
    const s = await checarSerp(consulta).catch(() => null);
    if (!s) continue;
    await executar(
      `INSERT INTO serp_checagens (data, consulta, top3, recursos, ai_overview, citados, nossa_posicao, citado_no_ai_overview, fonte)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'serpapi') ON CONFLICT (data, consulta) DO NOTHING`,
      [dia(0), consulta, JSON.stringify(s.top3), JSON.stringify(s.recursos), s.aiOverview, JSON.stringify(s.citados), s.nossaPosicao, s.citadoNoAiOverview]
    );
  }
  return `${alvo.length} consultas`;
}

async function avaliarOndas(): Promise<string> {
  const r = await consultar<{ numero: number; tipo: string; total: number; indexadas: number }>(
    `SELECT o.numero, pr.tipo, count(*)::int total, count(*) FILTER (WHERE pr.indexada)::int indexadas
       FROM ondas o JOIN paginas_registro pr ON pr.onda = o.numero
      WHERE o.libera_em <= current_date - 21 AND pr.status = 'publicada' AND pr.verificada_em IS NOT NULL
      GROUP BY o.numero, pr.tipo`
  );
  const abaixo = r.filter((x) => x.total >= 10 && x.indexadas / x.total < 0.5);
  for (const x of r) {
    await executar(`UPDATE ondas SET indexadas = $1, taxa_indexacao = $2, avaliada_em = now() WHERE numero = $3`, [x.indexadas, x.indexadas / x.total, x.numero]);
  }
  for (const a of abaixo) {
    await alertaUnico(
      `onda-baixa:${a.numero}:${a.tipo}`,
      `Onda ${a.numero}: ${a.tipo} com ${Math.round((a.indexadas / a.total) * 100)}% indexado em 21 dias`,
      `<p>Regra: abaixo de 50% em 21 dias, pausar o tipo e reforçar o template antes da próxima onda.</p>
       <p>O job de produção adiciona "${a.tipo}" em <code>tiposPausados</code> (src/data/seo/ondas.json) na próxima execução.</p>`
    );
  }
  return abaixo.length ? `pausar: ${abaixo.map((a) => a.tipo).join(", ")}` : `${r.length} grupos avaliados, nenhum abaixo de 50%`;
}

async function expandirMapa(): Promise<string> {
  // Consultas reais novas do GSC já entram no diário; aqui o autocomplete das
  // 40 consultas mais promissoras sem página gera cauda longa nova.
  const sementes = await consultar<{ consulta: string }>(
    `SELECT consulta FROM mapa_buscas WHERE status = 'sem_pagina' AND fonte IN ('gsc','autocomplete') ORDER BY prioridade DESC LIMIT 40`
  );
  const novas: Array<Record<string, unknown>> = [];
  for (const { consulta } of sementes) {
    try {
      const r = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&hl=pt-BR&gl=br&ie=utf-8&oe=utf-8&q=${encodeURIComponent(consulta + " ")}`, {
        signal: AbortSignal.timeout(10_000),
      });
      const [, lista] = (await r.json()) as [string, string[]];
      lista.forEach((s, i) => {
        const q = s.toLowerCase().trim();
        if (q.length < 6 || q.length > 90) return;
        const intencao = classificarIntencao(q);
        const cluster = classificarCluster(q);
        novas.push({
          consulta: q,
          intencao,
          cluster,
          tipo_pagina: classificarTipoPagina(q, intencao),
          isca_id: getCluster(cluster)?.isca ?? null,
          posicao_autocomplete: i + 1,
          prioridade: calcularPrioridade(intencao, cluster, i + 1),
          fonte: "autocomplete",
          volume_fonte: "estimativa-autocomplete",
          semente: consulta.slice(0, 200),
          coletado_em: dia(0),
        });
      });
      await new Promise((ok) => setTimeout(ok, 300));
    } catch {
      /* segue */
    }
  }
  await inserirEmLote("mapa_buscas", novas, `ON CONFLICT (consulta) DO NOTHING`);
  return `${novas.length} sugestões processadas`;
}

export async function resumoSemanal(): Promise<string> {
  const [pub] = await consultar<{ n: number }>(`SELECT count(*)::int n FROM paginas_registro WHERE publicada_em >= current_date - 7`);
  const sobe = await consultar<{ pagina: string; delta: number }>(
    `SELECT pagina, (sum(cliques) FILTER (WHERE data >= $1) - sum(cliques) FILTER (WHERE data < $1))::int delta
       FROM gsc_desempenho WHERE data >= $2 GROUP BY pagina ORDER BY delta DESC LIMIT 5`,
    [dia(-7), dia(-14)]
  );
  const iscas = await consultar<{ isca_id: string; vistas: number; leads: number }>(
    `SELECT isca_id, count(*) FILTER (WHERE nome = 'isca_vista')::int vistas, count(*) FILTER (WHERE nome = 'lead_capturado')::int leads
       FROM eventos WHERE created_at > now() - interval '7 days' AND isca_id IS NOT NULL GROUP BY isca_id ORDER BY leads DESC, vistas DESC`
  );
  const fila = await consultar<{ status: string; n: number }>(`SELECT status, count(*)::int n FROM fila_conteudo GROUP BY status`);
  const acoes = await consultar<{ motivo: string; consulta: string }>(
    `SELECT motivo, consulta FROM fila_conteudo WHERE status IN ('oportunidade','atualizar','revisao') ORDER BY prioridade DESC, atualizado_em DESC LIMIT 5`
  );
  const lista = (itens: string[]) => (itens.length ? `<ul>${itens.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>` : "<p>—</p>");
  const html = `<h2>Resumo da semana</h2>
<p><strong>${pub?.n ?? 0}</strong> páginas publicadas nos últimos 7 dias.</p>
<h3>O que mais subiu / caiu (cliques, semana × semana)</h3>${lista(sobe.map((s) => `${s.pagina}: ${s.delta >= 0 ? "+" : ""}${s.delta}`))}
<h3>Iscas (7 dias)</h3>${lista(iscas.map((i) => `${i.isca_id}: ${i.vistas} vistas → ${i.leads} leads`))}
<h3>Filas</h3>${lista(fila.map((f) => `${f.status}: ${f.n}`))}
<h3>5 próximas ações</h3>${lista(acoes.map((a) => `${a.consulta} — ${a.motivo}`))}
<p><a href="${SITE}/admin/crescimento">Abrir o painel</a></p>`;
  await enviarAlertaInterno(`Resumo semanal — ${dia(0).split("-").reverse().join("/")}`, html);
  return "enviado";
}

export async function jobSemanal(): Promise<Resultado> {
  const out: Resultado = {};
  await etapa("semanal", "serp", out, checarSerpPrioritarias);
  await etapa("semanal", "expansao-mapa", out, expandirMapa);
  await etapa("semanal", "ondas", out, avaliarOndas);
  await etapa("semanal", "resumo", out, resumoSemanal);
  return out;
}
