import { cookies } from "next/headers";
import Link from "next/link";
import { verifyAdminCookie } from "@/lib/security";
import { consultar, temBanco, type Linha } from "@/lib/ops/sql";
import { CLUSTERS } from "@/lib/seo/taxonomia";
import { ISCAS } from "@/data/iscas";
import { TIPOS_CONTEUDO } from "@/lib/conteudo/schema";
import { mudarStatusAlvo, mudarStatusDistribuicao, mudarStatusFila, registrarVenda } from "./acoes";

/**
 * Painel de crescimento orgânico. Lê só do banco local (espelho de GSC, Bing,
 * GA4, eventos, rastreadores, leads e filas). Filtros por janela, cluster,
 * tipo de página, isca e página — tudo por query string, sem JavaScript.
 */
export const dynamic = "force-dynamic";

/** Data ISO de N dias atrás (fora do render para o lint de pureza). */
function diasAtras(dias: number): string {
  return new Date(Date.now() - dias * 86400_000).toISOString().slice(0, 10);
}

type Filtros = { dias: number; cluster: string; tipo: string; isca: string; pagina: string; aba: string };

async function q<T extends Linha = Linha>(sql: string, params: unknown[] = []): Promise<T[]> {
  try {
    return await consultar<T>(sql, params);
  } catch {
    return [];
  }
}

const n = (v: unknown) => (typeof v === "number" ? v.toLocaleString("pt-BR") : v === null || v === undefined ? "—" : String(v));
const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1)}%` : "—");

function Tabela({ titulo, linhas, colunas, vazio }: { titulo: string; linhas: Linha[]; colunas?: string[]; vazio?: string }) {
  const cols = colunas ?? (linhas[0] ? Object.keys(linhas[0]) : []);
  return (
    <section className="mb-10">
      <h3 className="font-heading text-lg font-bold text-foreground mb-3">{titulo}</h3>
      {linhas.length === 0 ? (
        <p className="text-sm text-gray">{vazio ?? "Sem dados ainda."}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                {cols.map((c) => (
                  <th key={c} className="text-left text-gray border-b border-white/10 px-2 py-1.5 whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linhas.map((l, i) => (
                <tr key={i} className="border-b border-white/5">
                  {cols.map((c) => (
                    <td key={c} className="px-2 py-1.5 text-foreground/90 align-top max-w-[420px] break-words">
                      {typeof l[c] === "object" && l[c] !== null ? JSON.stringify(l[c]).slice(0, 200) : n(l[c])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Kpi({ rotulo, valor, nota }: { rotulo: string; valor: string; nota?: string }) {
  return (
    <div className="glass-card">
      <p className="text-[11px] uppercase tracking-[2px] text-gray">{rotulo}</p>
      <p className="font-heading text-2xl font-bold text-foreground">{valor}</p>
      {nota && <p className="text-[11px] text-gray">{nota}</p>}
    </div>
  );
}

const ABAS = ["seo", "geo", "conversao", "top", "filas", "conteudo", "linha-do-tempo"] as const;

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sessao = (await cookies()).get("admin_session")?.value;
  if (!verifyAdminCookie(sessao)) {
    return (
      <main className="max-w-xl mx-auto p-10 text-center">
        <p className="text-gray mb-4">Faça login para ver o painel.</p>
        <Link href="/admin" className="text-brand underline">Entrar em /admin</Link>
      </main>
    );
  }
  if (!temBanco()) return <main className="p-10 text-gray">DATABASE_URL não configurada.</main>;

  const sp = await searchParams;
  const f: Filtros = {
    dias: Math.min(Math.max(Number(sp.dias) || 28, 1), 365),
    cluster: sp.cluster ?? "",
    tipo: sp.tipo ?? "",
    isca: sp.isca ?? "",
    pagina: sp.pagina ?? "",
    aba: ABAS.includes((sp.aba ?? "") as (typeof ABAS)[number]) ? (sp.aba as string) : "seo",
  };
  const desde = diasAtras(f.dias);
  const base = [desde, f.cluster, f.tipo, f.pagina];

  const link = (mudar: Partial<Filtros>) => {
    const p = new URLSearchParams({ ...Object.fromEntries(Object.entries(f).map(([k, v]) => [k, String(v)])), ...Object.fromEntries(Object.entries(mudar).map(([k, v]) => [k, String(v)])) });
    return `/admin/crescimento?${p.toString()}`;
  };

  const [status] = await q<{ publicadas: number; no_sitemap: number; enviadas: number; indexadas: number; verificadas: number; indexnow: number }>(
    `SELECT count(*) FILTER (WHERE status = 'publicada')::int publicadas, count(*) FILTER (WHERE no_sitemap)::int no_sitemap,
            count(*) FILTER (WHERE sitemap_enviado_em IS NOT NULL)::int enviadas, count(*) FILTER (WHERE indexada)::int indexadas,
            count(*) FILTER (WHERE verificada_em IS NOT NULL)::int verificadas, count(*) FILTER (WHERE indexnow_em IS NOT NULL)::int indexnow
       FROM paginas_registro pr
      WHERE ($1 = '' OR pr.cluster = $1) AND ($2 = '' OR pr.tipo = $2) AND ($3 = '' OR pr.url ILIKE '%' || $3 || '%')`,
    [f.cluster, f.tipo, f.pagina]
  );
  const [gsc] = await q<{ cliques: number; impressoes: number; posicao: number | null }>(
    `SELECT coalesce(sum(g.cliques),0)::int cliques, coalesce(sum(g.impressoes),0)::int impressoes, sum(g.posicao*g.impressoes)/NULLIF(sum(g.impressoes),0) posicao
       FROM gsc_desempenho g LEFT JOIN paginas_registro pr ON pr.url = g.pagina WHERE g.data >= $1 AND ($2 = '' OR pr.cluster = $2) AND ($3 = '' OR pr.tipo = $3) AND ($4 = '' OR g.pagina ILIKE '%' || $4 || '%')`,
    base
  );
  const integracoes = await q(
    `SELECT DISTINCT ON (job) job, ok, detalhe, to_char(created_at, 'DD/MM HH24:MI') AS quando FROM integracoes_execucoes ORDER BY job, created_at DESC`
  );

  return (
    <main className="max-w-[1300px] mx-auto px-4 md:px-8 py-8" data-page-type="admin">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Crescimento orgânico</h1>
        <div className="flex gap-3 text-sm">
          <Link href="/admin" className="text-gray underline">Leads</Link>
          <Link href="/admin/trafego" className="text-gray underline">Tráfego</Link>
        </div>
      </div>

      <form className="flex flex-wrap gap-2 mb-6 text-sm" method="get">
        <input type="hidden" name="aba" value={f.aba} />
        <select name="dias" defaultValue={String(f.dias)} className="bg-white/5 border border-white/10 rounded px-2 py-1.5">
          {[7, 28, 90, 180, 365].map((d) => <option key={d} value={d}>{d} dias</option>)}
        </select>
        <select name="cluster" defaultValue={f.cluster} className="bg-white/5 border border-white/10 rounded px-2 py-1.5">
          <option value="">Todos os clusters</option>
          {CLUSTERS.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <select name="tipo" defaultValue={f.tipo} className="bg-white/5 border border-white/10 rounded px-2 py-1.5">
          <option value="">Todos os tipos</option>
          {[...TIPOS_CONTEUDO, "existente"].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select name="isca" defaultValue={f.isca} className="bg-white/5 border border-white/10 rounded px-2 py-1.5">
          <option value="">Todas as iscas</option>
          {ISCAS.map((i) => <option key={i.id} value={i.id}>{i.nome}</option>)}
        </select>
        <input name="pagina" defaultValue={f.pagina} placeholder="filtrar página (trecho da URL)" className="bg-white/5 border border-white/10 rounded px-2 py-1.5 min-w-[220px]" />
        <button className="bg-brand text-white font-bold rounded px-4 py-1.5">Filtrar</button>
      </form>

      <nav className="flex flex-wrap gap-2 mb-8 text-sm">
        {ABAS.map((a) => (
          <Link key={a} href={link({ aba: a })} className={`px-3 py-1.5 rounded no-underline ${f.aba === a ? "bg-brand text-white" : "bg-white/5 text-gray"}`}>
            {{ seo: "SEO", geo: "GEO / IA", conversao: "Conversão", top: "Top 20", filas: "Filas", conteudo: "Conteúdo e qualidade", "linha-do-tempo": "Linha do tempo" }[a]}
          </Link>
        ))}
      </nav>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-10">
        <Kpi rotulo="Publicadas" valor={n(status?.publicadas ?? 0)} />
        <Kpi rotulo="No sitemap" valor={n(status?.no_sitemap ?? 0)} nota={`${n(status?.enviadas ?? 0)} enviadas ao GSC`} />
        <Kpi rotulo="Indexadas" valor={n(status?.indexadas ?? 0)} nota={`de ${n(status?.verificadas ?? 0)} inspecionadas`} />
        <Kpi rotulo="Impressões" valor={n(gsc?.impressoes ?? 0)} nota={`${f.dias} dias`} />
        <Kpi rotulo="Cliques" valor={n(gsc?.cliques ?? 0)} nota={`CTR ${pct(gsc?.cliques ?? 0, gsc?.impressoes ?? 0)}`} />
        <Kpi rotulo="Posição média" valor={gsc?.posicao ? gsc.posicao.toFixed(1) : "—"} />
      </div>

      {f.aba === "seo" && <AbaSeo base={base} />}
      {f.aba === "geo" && <AbaGeo desde={desde} pagina={f.pagina} />}
      {f.aba === "conversao" && <AbaConversao desde={desde} f={f} />}
      {f.aba === "top" && <AbaTop desde={desde} />}
      {f.aba === "filas" && <AbaFilas />}
      {f.aba === "conteudo" && <AbaConteudo f={f} />}
      {f.aba === "linha-do-tempo" && <AbaLinhaTempo />}

      <Tabela titulo="Saúde das integrações (última execução de cada job)" linhas={integracoes} vazio="Nenhum job rodou ainda — confira o agendador (GitHub Actions) e o CRON_SECRET." />
    </main>
  );
}

async function AbaSeo({ base }: { base: unknown[] }) {
  const porCluster = await q(
    `SELECT coalesce(pr.cluster, '(sem cluster)') AS cluster, sum(g.impressoes)::int AS impressoes, sum(g.cliques)::int AS cliques,
            round((sum(g.cliques)::numeric / NULLIF(sum(g.impressoes),0)) * 100, 2) AS "ctr_%", round((sum(g.posicao*g.impressoes)/NULLIF(sum(g.impressoes),0))::numeric, 1) AS posicao
       FROM gsc_desempenho g LEFT JOIN paginas_registro pr ON pr.url = g.pagina
      WHERE g.data >= $1 AND ($2 = '' OR pr.cluster = $2) AND ($3 = '' OR pr.tipo = $3) AND ($4 = '' OR g.pagina ILIKE '%' || $4 || '%')
      GROUP BY 1 ORDER BY 2 DESC NULLS LAST`,
    base
  );
  const porTipo = await q(
    `SELECT tipo, count(*) FILTER (WHERE status = 'publicada')::int publicadas, count(*) FILTER (WHERE sitemap_enviado_em IS NOT NULL)::int enviadas,
            count(*) FILTER (WHERE indexada)::int indexadas, count(*) FILTER (WHERE verificada_em IS NOT NULL)::int inspecionadas
       FROM paginas_registro GROUP BY tipo ORDER BY 2 DESC`
  );
  const novas = await q(
    `SELECT g.consulta, sum(g.impressoes)::int impressoes, round((sum(g.posicao*g.impressoes)/NULLIF(sum(g.impressoes),0))::numeric,1) posicao, min(g.data) primeira_vez
       FROM gsc_desempenho g WHERE g.consulta <> '' GROUP BY g.consulta HAVING min(g.data) >= $1 ORDER BY 2 DESC LIMIT 25`,
    [base[0]]
  );
  const faixa415 = await q(
    `SELECT g.pagina, sum(g.impressoes)::int impressoes, sum(g.cliques)::int cliques, round((sum(g.posicao*g.impressoes)/NULLIF(sum(g.impressoes),0))::numeric,1) posicao
       FROM gsc_desempenho g WHERE g.data >= $1 GROUP BY g.pagina HAVING sum(g.posicao*g.impressoes)/NULLIF(sum(g.impressoes),0) BETWEEN 4 AND 15 ORDER BY 2 DESC LIMIT 25`,
    [base[0]]
  );
  const ctrBaixo = await q(
    `SELECT g.pagina, sum(g.impressoes)::int impressoes, round((sum(g.cliques)::numeric/NULLIF(sum(g.impressoes),0))*100,2) "ctr_%", round((sum(g.posicao*g.impressoes)/NULLIF(sum(g.impressoes),0))::numeric,1) posicao
       FROM gsc_desempenho g WHERE g.data >= $1 GROUP BY g.pagina
     HAVING sum(g.impressoes) >= 100 AND sum(g.posicao*g.impressoes)/NULLIF(sum(g.impressoes),0) < 5 AND sum(g.cliques)::float/NULLIF(sum(g.impressoes),0) < 0.05 ORDER BY 2 DESC LIMIT 25`,
    [base[0]]
  );
  const semImpressao = await q(
    `SELECT pr.url, pr.tipo, pr.publicada_em FROM paginas_registro pr
      WHERE pr.status = 'publicada' AND pr.publicada_em <= current_date - 30
        AND NOT EXISTS (SELECT 1 FROM gsc_desempenho g WHERE g.pagina = pr.url AND g.impressoes > 0) ORDER BY pr.publicada_em LIMIT 50`
  );
  const posicoes = await q(
    `SELECT consulta, round(avg(posicao)::numeric,1) posicao, sum(impressoes)::int impressoes, max(data) ultima FROM posicoes WHERE data >= $1 GROUP BY consulta ORDER BY 3 DESC LIMIT 30`,
    [base[0]]
  );
  return (
    <>
      <Tabela titulo="Publicadas × enviadas × indexadas, por tipo" linhas={porTipo} />
      <Tabela titulo="Impressões, cliques, CTR e posição por cluster" linhas={porCluster} vazio="Sem dados do Search Console — configure GOOGLE_SERVICE_ACCOUNT_JSON e GSC_SITE_URL." />
      <Tabela titulo="Posição das consultas-alvo" linhas={posicoes} />
      <Tabela titulo="Consultas novas na janela" linhas={novas} />
      <Tabela titulo="Páginas em 4–15 (reforçar)" linhas={faixa415} />
      <Tabela titulo="CTR abaixo do esperado para a posição (reescrever title)" linhas={ctrBaixo} />
      <Tabela titulo="Publicadas há 30+ dias sem nenhuma impressão" linhas={semImpressao} />
    </>
  );
}

async function AbaGeo({ desde, pagina }: { desde: string; pagina: string }) {
  const bots = await q(
    `SELECT bot, familia, count(*)::int acessos, count(*) FILTER (WHERE verificado)::int "ip_confirmado", count(*) FILTER (WHERE verificado = false)::int "ip_falso", count(DISTINCT path)::int paginas, to_char(max(created_at),'DD/MM HH24:MI') ultimo
       FROM crawler_hits WHERE created_at >= $1 AND ($2 = '' OR path ILIKE '%' || $2 || '%') GROUP BY bot, familia ORDER BY 3 DESC`,
    [desde, pagina]
  );
  const porPagina = await q(
    `SELECT path, count(*) FILTER (WHERE familia = 'busca')::int busca, count(*) FILTER (WHERE familia = 'ia-busca')::int "ia_busca", count(*) FILTER (WHERE familia = 'ia-treino')::int "ia_treino"
       FROM crawler_hits WHERE created_at >= $1 AND ($2 = '' OR path ILIKE '%' || $2 || '%') GROUP BY path ORDER BY 3 DESC, 2 DESC LIMIT 40`,
    [desde, pagina]
  );
  const visitasIa = await q(
    `SELECT coalesce(referrer_host, utm_source) origem, count(DISTINCT session_id)::int sessoes, count(*)::int pageviews
       FROM pageviews WHERE created_at >= $1 AND canal = 'ia' GROUP BY 1 ORDER BY 2 DESC`,
    [desde]
  );
  const citacoes = await q(
    `SELECT consulta, data, ai_overview, citado_no_ai_overview "citados_nós", nossa_posicao, jsonb_array_length(coalesce(citados,'[]'::jsonb)) "n_citados", top3
       FROM serp_checagens WHERE data >= $1 ORDER BY data DESC, consulta LIMIT 60`,
    [desde]
  );
  return (
    <>
      <Tabela titulo="Rastreadores (busca e IA) — validados por IP quando o provedor publica faixas" linhas={bots} vazio="Nenhum acesso de rastreador registrado ainda." />
      <Tabela titulo="Rastreadores por página" linhas={porPagina} />
      <Tabela titulo="Visitas vindas de IAs (ChatGPT, Perplexity, Gemini, Copilot, Claude…)" linhas={visitasIa} />
      <Tabela titulo="SERP das 50 prioritárias: AI Overview e quem é citado" linhas={citacoes} vazio="Sem checagem de SERP — configure SERPAPI_KEY." />
    </>
  );
}

async function AbaConversao({ desde, f }: { desde: string; f: Filtros }) {
  const funil = await q(
    `SELECT coalesce(e.page_type, '(sem tipo)') page_type,
            count(DISTINCT e.session_id) FILTER (WHERE e.nome = 'isca_vista')::int vista,
            count(DISTINCT e.session_id) FILTER (WHERE e.nome = 'isca_iniciada')::int iniciada,
            count(DISTINCT e.session_id) FILTER (WHERE e.nome = 'isca_concluida')::int concluida,
            count(*) FILTER (WHERE e.nome = 'lead_capturado' AND e.origem_registro = 'servidor')::int leads,
            count(*) FILTER (WHERE e.nome = 'cta_produto_clicado')::int cta_produto
       FROM eventos e WHERE e.created_at >= $1 AND ($2 = '' OR e.cluster = $2) AND ($3 = '' OR e.isca_id = $3) AND ($4 = '' OR e.path ILIKE '%' || $4 || '%')
      GROUP BY 1 ORDER BY 2 DESC`,
    [desde, f.cluster, f.isca, f.pagina]
  );
  const [org] = await q<{ sessoes: number }>(
    `SELECT count(DISTINCT session_id)::int sessoes FROM pageviews WHERE created_at >= $1 AND canal IN ('organico','ia')`,
    [desde]
  );
  const porIsca = await q(
    `SELECT isca_id, count(DISTINCT session_id) FILTER (WHERE nome='isca_vista')::int vista, count(DISTINCT session_id) FILTER (WHERE nome='isca_concluida')::int concluida,
            count(*) FILTER (WHERE nome='lead_capturado' AND origem_registro='servidor')::int leads
       FROM eventos WHERE created_at >= $1 AND isca_id IS NOT NULL GROUP BY 1 ORDER BY 4 DESC, 2 DESC`,
    [desde]
  );
  const receita = await q(
    `SELECT coalesce(cluster,'(sem)') cluster, coalesce(atribuicao->'ft'->>'canal', canal, '(?)') "first_touch", coalesce(atribuicao->'lt'->>'canal', canal, '(?)') "last_touch",
            count(*)::int leads, count(*) FILTER (WHERE valor_fechado IS NOT NULL)::int vendas, coalesce(sum(valor_fechado),0)::float receita
       FROM leads WHERE created_at >= $1 GROUP BY 1,2,3 ORDER BY receita DESC, leads DESC`,
    [desde]
  );
  const abertos = await q<{ id: number; nome: string; email: string; origem: string; landing: string; criado: string }>(
    `SELECT id, name nome, email, coalesce(isca_id, source) origem, landing_page landing, to_char(created_at,'DD/MM') criado
       FROM leads WHERE valor_fechado IS NULL AND created_at >= $1 ORDER BY created_at DESC LIMIT 30`,
    [desde]
  );
  return (
    <>
      <p className="text-sm text-gray mb-4">
        Visitas orgânicas (busca + IA) na janela: <strong className="text-foreground">{n(org?.sessoes ?? 0)}</strong>. Funil: visita → isca vista → concluída → lead → venda.
      </p>
      <Tabela titulo="Funil por tipo de página" linhas={funil} vazio="Sem eventos de isca ainda." />
      <Tabela titulo="Funil por isca" linhas={porIsca} />
      <Tabela titulo="Leads e receita por cluster (first-touch × last-touch)" linhas={receita} />
      <section className="mb-10">
        <h3 className="font-heading text-lg font-bold text-foreground mb-3">Registrar venda (servidor)</h3>
        {abertos.length === 0 ? (
          <p className="text-sm text-gray">Nenhum lead aberto na janela.</p>
        ) : (
          <ul className="space-y-2 text-xs">
            {abertos.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-2">
                <span className="text-foreground">#{l.id} {l.nome}</span>
                <span className="text-gray">{l.email} · {l.origem} · {l.landing ?? "—"} · {l.criado}</span>
                <form action={registrarVenda} className="flex gap-1">
                  <input type="hidden" name="id" value={l.id} />
                  <input name="valor" placeholder="valor R$" className="bg-white/5 border border-white/10 rounded px-2 py-1 w-24" />
                  <button className="bg-emerald-600 text-white rounded px-2 py-1">fechou</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

async function AbaTop({ desde }: { desde: string }) {
  const porLead = await q(
    `SELECT coalesce(landing_page, form_page) pagina, count(*)::int leads, count(*) FILTER (WHERE valor_fechado IS NOT NULL)::int vendas, coalesce(sum(valor_fechado),0)::float receita
       FROM leads WHERE created_at >= $1 GROUP BY 1 ORDER BY 2 DESC LIMIT 20`,
    [desde]
  );
  const porReceita = await q(
    `SELECT coalesce(landing_page, form_page) pagina, coalesce(sum(valor_fechado),0)::float receita, count(*) FILTER (WHERE valor_fechado IS NOT NULL)::int vendas
       FROM leads WHERE created_at >= $1 GROUP BY 1 HAVING sum(valor_fechado) > 0 ORDER BY 2 DESC LIMIT 20`,
    [desde]
  );
  const visitaSemLead = await q(
    `SELECT p.landing_page pagina, count(DISTINCT p.session_id)::int sessoes
       FROM pageviews p WHERE p.created_at >= $1 AND p.landing_page IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM leads l WHERE l.landing_page = p.landing_page AND l.created_at >= $1)
      GROUP BY 1 ORDER BY 2 DESC LIMIT 20`,
    [desde]
  );
  return (
    <>
      <Tabela titulo="Top 20 páginas de entrada por lead" linhas={porLead} />
      <Tabela titulo="Top 20 por receita" linhas={porReceita} vazio="Nenhuma venda registrada na janela." />
      <Tabela titulo="Top 20 por visita sem nenhum lead (onde a isca não converte)" linhas={visitaSemLead} />
    </>
  );
}

async function AbaFilas() {
  const revisao = await q<{ id: number; consulta: string; tipo: string; status: string; motivo: string }>(
    `SELECT id, consulta, tipo, status, motivo FROM fila_conteudo WHERE status IN ('revisao','reprovada','oportunidade','atualizar') ORDER BY prioridade DESC, atualizado_em DESC LIMIT 80`
  );
  const producao = await q(`SELECT status, tipo, count(*)::int n FROM fila_conteudo GROUP BY 1,2 ORDER BY 1,2`);
  const alvos = await q<{ id: number; nome: string; url: string | null; tipo: string; regiao: string | null; pagina_alvo: string | null; ativo: string | null; mensagem: string | null; status: string }>(
    `SELECT id, nome, url, tipo, regiao, pagina_alvo, ativo, mensagem, status FROM alvos_link ORDER BY status = 'novo' DESC, tipo, nome LIMIT 150`
  );
  const artigos = await q<{ titulo: string; veiculo_sugerido: string | null; link_para: string | null; corpo: string }>(
    `SELECT titulo, veiculo_sugerido, link_para, corpo FROM artigos_convidado ORDER BY id`
  );
  const dist = await q<{ id: number; url: string; canal: string; texto: string; status: string }>(
    `SELECT id, url, canal, texto, status FROM distribuicao_fila WHERE status IN ('rascunho','aprovado') ORDER BY created_at DESC, canal LIMIT 60`
  );
  const botao = "text-[11px] border border-white/15 rounded px-2 py-0.5 text-gray hover:text-foreground";
  return (
    <>
      <Tabela titulo="Fila de produção (por status e tipo)" linhas={producao} />
      <section className="mb-10">
        <h3 className="font-heading text-lg font-bold text-foreground mb-3">Revisão de conteúdo, oportunidades e atualizações</h3>
        {revisao.length === 0 ? <p className="text-sm text-gray">Fila vazia.</p> : (
          <ul className="space-y-2 text-xs">
            {revisao.map((r) => (
              <li key={r.id} className="border-b border-white/5 pb-2">
                <span className="text-foreground">{r.consulta}</span> <span className="text-gray">[{r.tipo} · {r.status}]</span>
                <p className="text-gray">{r.motivo}</p>
                <div className="flex gap-2 mt-1">
                  {["aprovada", "descartada"].map((s) => (
                    <form key={s} action={mudarStatusFila}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value={s} /><button className={botao}>{s}</button></form>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mb-10">
        <h3 className="font-heading text-lg font-bold text-foreground mb-3">Alvos de link ({alvos.length})</h3>
        <ul className="space-y-3 text-xs">
          {alvos.map((a) => (
            <li key={a.id} className="border-b border-white/5 pb-2">
              <span className="text-foreground font-bold">{a.nome}</span> <span className="text-gray">[{a.tipo}{a.regiao ? ` · ${a.regiao}` : ""} · {a.status}]</span>{" "}
              {a.url ? <a href={a.url} className="text-brand underline" target="_blank" rel="noopener noreferrer">site</a> : <span className="text-amber-400">URL a confirmar</span>}
              <p className="text-gray">Página: {a.pagina_alvo ?? "—"} · Ativo: {a.ativo ?? "—"}</p>
              {a.mensagem && <details><summary className="text-gray cursor-pointer">mensagem pronta</summary><p className="whitespace-pre-line text-foreground/90 mt-1">{a.mensagem}</p></details>}
              <div className="flex gap-2 mt-1">
                {["contatado", "respondeu", "publicado", "recusado"].map((s) => (
                  <form key={s} action={mudarStatusAlvo}><input type="hidden" name="id" value={a.id} /><input type="hidden" name="status" value={s} /><button className={botao}>{s}</button></form>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-10">
        <h3 className="font-heading text-lg font-bold text-foreground mb-3">Artigos de convidado prontos ({artigos.length})</h3>
        {artigos.map((a) => (
          <details key={a.titulo} className="mb-2 text-xs">
            <summary className="cursor-pointer text-foreground">{a.titulo} <span className="text-gray">— {a.veiculo_sugerido ?? ""} → {a.link_para ?? ""}</span></summary>
            <p className="whitespace-pre-line text-foreground/90 mt-2">{a.corpo}</p>
          </details>
        ))}
      </section>
      <section className="mb-10">
        <h3 className="font-heading text-lg font-bold text-foreground mb-3">Distribuição: LinkedIn e vídeo curto (aprovar antes de publicar)</h3>
        <ul className="space-y-3 text-xs">
          {dist.map((d) => (
            <li key={d.id} className="border-b border-white/5 pb-2">
              <span className="text-gray">[{d.canal} · {d.status}]</span> <span className="text-foreground">{d.url}</span>
              <pre className="whitespace-pre-wrap text-foreground/90 mt-1 font-sans">{d.texto}</pre>
              <div className="flex gap-2 mt-1">
                {["aprovado", "publicado", "descartado"].map((s) => (
                  <form key={s} action={mudarStatusDistribuicao}><input type="hidden" name="id" value={d.id} /><input type="hidden" name="status" value={s} /><button className={botao}>{s}</button></form>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

async function AbaConteudo({ f }: { f: Filtros }) {
  const qualidade = await q(
    `SELECT qr.tipo, count(*)::int total, count(*) FILTER (WHERE qr.aprovado)::int aprovadas, count(*) FILTER (WHERE qr.aprovado AND NOT qr.publicavel)::int rascunhos,
            count(*) FILTER (WHERE NOT qr.aprovado)::int reprovadas, round(avg(qr.palavras))::int palavras_media, round(avg(qr.similaridade_max)::numeric, 2) similaridade_media
       FROM qualidade_resultados qr JOIN paginas_registro pr ON pr.url = qr.url WHERE ($1 = '' OR pr.cluster = $1) GROUP BY 1 ORDER BY 2 DESC`,
    [f.cluster]
  );
  const reprovadas = await q(
    `SELECT qr.url, qr.reprovacoes FROM qualidade_resultados qr WHERE NOT qr.publicavel ORDER BY qr.avaliado_em DESC LIMIT 60`
  );
  const ondas = await q(`SELECT numero, libera_em, paginas, por_tipo, status, indexadas, taxa_indexacao FROM ondas ORDER BY numero`);
  const mapa = await q(
    `SELECT cluster, tipo_pagina, count(*)::int consultas, count(*) FILTER (WHERE status = 'com_pagina')::int com_pagina, max(prioridade) prioridade_max
       FROM mapa_buscas WHERE ($1 = '' OR cluster = $1) GROUP BY 1,2 ORDER BY 3 DESC`,
    [f.cluster]
  );
  const prioritarias = await q(
    `SELECT consulta, intencao, tipo_pagina, prioridade, posicao_autocomplete, status, url_alvo FROM mapa_buscas
      WHERE ($1 = '' OR cluster = $1) ORDER BY prioridade DESC, posicao_autocomplete NULLS LAST LIMIT 50`,
    [f.cluster]
  );
  return (
    <>
      <Tabela titulo="Portão de qualidade por tipo" linhas={qualidade} />
      <Tabela titulo="Ondas de publicação (regra: < 50% indexado em 21 dias pausa o tipo)" linhas={ondas} />
      <Tabela titulo="Reprovadas e rascunhos (motivos)" linhas={reprovadas} vazio="Nenhuma." />
      <Tabela titulo="Mapa de buscas por cluster e tipo de página (volume = estimativa pelo autocomplete até haver GSC/Keyword Planner)" linhas={mapa} />
      <Tabela titulo="50 consultas de maior prioridade" linhas={prioritarias} />
    </>
  );
}

async function AbaLinhaTempo() {
  const eventos = await q(
    `SELECT to_char(created_at,'DD/MM/YYYY HH24:MI') quando, tipo, titulo, left(coalesce(detalhe,''), 160) detalhe FROM anotacoes ORDER BY created_at DESC LIMIT 100`
  );
  const base = await q(`SELECT data, metricas, fontes_ausentes FROM linha_base ORDER BY data LIMIT 3`);
  return (
    <>
      <Tabela titulo="Linha de base" linhas={base} vazio="A linha de base é gravada pelo primeiro job diário." />
      <Tabela titulo="Deploys, ondas, IndexNow e alertas" linhas={eventos} />
    </>
  );
}
