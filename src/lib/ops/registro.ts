/**
 * Espelha no banco o estado do conteúdo e dos dados operacionais versionados
 * no repositório: registro de páginas, resultado do portão de qualidade,
 * ondas, mapa de buscas, alvos de link, artigos e fila de distribuição.
 *
 * Idempotente. Roda na inicialização do servidor e no job diário.
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { carregarConteudo, dataLiberacao, estaNoAr } from "@/lib/conteudo";
import { lerMapa } from "@/lib/seo/mapa-arquivo";
import { montarUtm, type ClusterId } from "@/lib/seo/taxonomia";
import { todasUrlsIndexaveis } from "@/data/urls";
import { anotar, consultar, executar, inserirEmLote } from "./sql";
import { avisarIndexNow } from "./externos";
import ondasConfig from "@/data/seo/ondas.json";

function hashDe(v: unknown): string {
  return createHash("sha1").update(JSON.stringify(v)).digest("hex").slice(0, 16);
}

/** Roda a semente só se o arquivo mudou desde a última carga. */
async function seMudou(chave: string, dado: unknown, fn: () => Promise<void>) {
  const ref = `semente:${chave}:${hashDe(dado)}`;
  const ja = await consultar(`SELECT 1 FROM anotacoes WHERE referencia = $1`, [ref]);
  if (ja.length) return;
  await fn();
  await anotar("semente", `Carga de ${chave} atualizada`, undefined, ref);
}

function lerJson<T>(rel: string): T | null {
  const p = join(process.cwd(), rel);
  return existsSync(p) ? (JSON.parse(readFileSync(p, "utf8")) as T) : null;
}

export async function sincronizarMapaBuscas() {
  const mapa = lerMapa();
  await seMudou("mapa-buscas", mapa.length + (mapa[0]?.consulta ?? ""), async () => {
    await inserirEmLote(
      "mapa_buscas",
      mapa.map((c) => ({
        consulta: c.consulta.slice(0, 200),
        intencao: c.intencao,
        cluster: c.cluster,
        tipo_pagina: c.tipoPagina,
        isca_id: c.iscaId,
        volume: c.volume,
        volume_fonte: c.volumeFonte,
        posicao_autocomplete: c.posicaoAutocomplete,
        prioridade: c.prioridade,
        fonte: c.fonte,
        semente: c.semente?.slice(0, 200) ?? null,
        coletado_em: c.coletadoEm,
      })),
      `ON CONFLICT (consulta) DO UPDATE SET intencao = EXCLUDED.intencao, cluster = EXCLUDED.cluster, tipo_pagina = EXCLUDED.tipo_pagina,
         isca_id = EXCLUDED.isca_id, prioridade = EXCLUDED.prioridade, atualizado_em = now()`
    );
  });
}

export async function sincronizarConteudo(agora = new Date()) {
  const { todas } = carregarConteudo();
  const dado = todas.map((p) => [p.url, p.revisadoEm, p.qualidade.aprovado, p.onda, estaNoAr(p, agora)]);
  await seMudou("conteudo", dado, async () => {
    await inserirEmLote(
      "paginas_registro",
      todas.map((p) => ({
        url: p.urlAbsoluta,
        tipo: p.tipo,
        cluster: p.cluster,
        consulta: p.consulta.slice(0, 200),
        matriz: p.matriz ?? null,
        isca_id: p.isca.id,
        onda: p.onda,
        status: !p.qualidade.aprovado ? "reprovada" : p.dependeAutor ? "rascunho" : estaNoAr(p, agora) ? "publicada" : "agendada",
        gate_ok: p.qualidade.aprovado,
        palavras: p.qualidade.palavras,
        revisado_em: p.revisadoEm,
        publicada_em: estaNoAr(p, agora) ? (dataLiberacao(p.onda) ?? p.revisadoEm) : null,
        no_sitemap: estaNoAr(p, agora),
      })),
      `ON CONFLICT (url) DO UPDATE SET tipo = EXCLUDED.tipo, cluster = EXCLUDED.cluster, consulta = EXCLUDED.consulta, isca_id = EXCLUDED.isca_id,
         onda = EXCLUDED.onda, status = EXCLUDED.status, gate_ok = EXCLUDED.gate_ok, palavras = EXCLUDED.palavras,
         revisado_em = EXCLUDED.revisado_em, publicada_em = COALESCE(paginas_registro.publicada_em, EXCLUDED.publicada_em),
         no_sitemap = EXCLUDED.no_sitemap, atualizado_em = now()`
    );
    await inserirEmLote(
      "qualidade_resultados",
      todas.map((p) => ({
        url: p.urlAbsoluta,
        tipo: p.tipo,
        aprovado: p.qualidade.aprovado,
        publicavel: p.qualidade.publicavel,
        palavras: p.qualidade.palavras,
        similaridade_max: p.qualidade.similaridadeMax,
        par_similar: p.qualidade.parSimilar ?? null,
        reprovacoes: p.qualidade.checagens.filter((c) => !c.ok).map((c) => `${c.id}${c.detalhe ? `: ${c.detalhe}` : ""}`),
        checagens: p.qualidade.checagens,
      })),
      `ON CONFLICT (url) DO UPDATE SET aprovado = EXCLUDED.aprovado, publicavel = EXCLUDED.publicavel, palavras = EXCLUDED.palavras,
         similaridade_max = EXCLUDED.similaridade_max, par_similar = EXCLUDED.par_similar, reprovacoes = EXCLUDED.reprovacoes,
         checagens = EXCLUDED.checagens, avaliado_em = now()`
    );
    // Rascunhos e reprovadas vão para a fila de revisão do painel.
    const revisar = todas.filter((p) => !p.qualidade.publicavel);
    if (revisar.length) {
      await inserirEmLote(
        "fila_conteudo",
        revisar.map((p) => ({
          consulta: p.consulta.slice(0, 200),
          tipo: p.tipo,
          cluster: p.cluster,
          prioridade: 50,
          status: "revisao",
          motivo: p.dependeAutor
            ? `Depende do autor: ${p.notaAutor ?? "revisar antes de publicar"}`
            : p.qualidade.checagens.filter((c) => !c.ok).map((c) => c.id).join(", "),
          conteudo: { url: p.url, arquivo: p.arquivo },
        })),
        `ON CONFLICT (consulta, tipo) DO UPDATE SET status = CASE WHEN fila_conteudo.status IN ('publicada','descartada') THEN fila_conteudo.status ELSE 'revisao' END,
           motivo = EXCLUDED.motivo, conteudo = EXCLUDED.conteudo, atualizado_em = now()`
      );
    }
  });

  // Ondas: resumo por onda + anotação na linha do tempo quando uma onda vai ao ar.
  const ondas = (ondasConfig as { ondas: Array<{ numero: number; liberaEm: string }> }).ondas;
  for (const o of ondas) {
    const daOnda = todas.filter((p) => p.onda === o.numero && p.qualidade.publicavel);
    if (!daOnda.length) continue;
    const porTipo = Object.fromEntries([...new Set(daOnda.map((p) => p.tipo))].map((t) => [t, daOnda.filter((p) => p.tipo === t).length]));
    const liberada = daOnda.some((p) => estaNoAr(p, agora));
    await executar(
      `INSERT INTO ondas (numero, libera_em, paginas, por_tipo, status) VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (numero) DO UPDATE SET libera_em = EXCLUDED.libera_em, paginas = EXCLUDED.paginas, por_tipo = EXCLUDED.por_tipo,
         status = CASE WHEN ondas.status = 'pausada' THEN 'pausada' ELSE EXCLUDED.status END`,
      [o.numero, o.liberaEm, daOnda.length, JSON.stringify(porTipo), liberada ? "liberada" : "agendada"]
    );
    if (liberada) await anotar("onda", `Onda ${o.numero} no ar: ${daOnda.length} páginas`, JSON.stringify(porTipo), `onda:${o.numero}`);
  }
}

interface AlvoLink {
  nome: string;
  url: string | null;
  tipo: string;
  regiao?: string;
  paginaAlvo?: string;
  ativo?: string;
  mensagem?: string;
}

interface ArtigoConvidado {
  slug: string;
  titulo: string;
  veiculoSugerido?: string;
  resumo?: string;
  corpo: string;
  linkPara?: string;
}

export async function sincronizarOffPage() {
  const alvos = lerJson<AlvoLink[]>("src/data/seo/alvos-link.json");
  if (alvos?.length) {
    await seMudou("alvos-link", alvos, async () => {
      await inserirEmLote(
        "alvos_link",
        alvos.map((a) => ({
          nome: a.nome.slice(0, 200),
          url: a.url?.slice(0, 500) ?? null,
          tipo: a.tipo.slice(0, 40),
          regiao: a.regiao?.slice(0, 60) ?? null,
          pagina_alvo: a.paginaAlvo?.slice(0, 500) ?? null,
          ativo: a.ativo?.slice(0, 300) ?? null,
          mensagem: a.mensagem ?? null,
        })),
        `ON CONFLICT (nome) DO UPDATE SET url = EXCLUDED.url, tipo = EXCLUDED.tipo, regiao = EXCLUDED.regiao, pagina_alvo = EXCLUDED.pagina_alvo,
           ativo = EXCLUDED.ativo, mensagem = EXCLUDED.mensagem, atualizado_em = now()`
      );
    });
  }
  const artigos = lerJson<ArtigoConvidado[]>("src/data/seo/artigos-convidado.json");
  if (artigos?.length) {
    await seMudou("artigos-convidado", artigos, async () => {
      await inserirEmLote(
        "artigos_convidado",
        artigos.map((a) => ({
          slug: a.slug.slice(0, 120),
          titulo: a.titulo.slice(0, 300),
          veiculo_sugerido: a.veiculoSugerido?.slice(0, 300) ?? null,
          resumo: a.resumo ?? null,
          corpo: a.corpo,
          link_para: a.linkPara?.slice(0, 500) ?? null,
        })),
        `ON CONFLICT (slug) DO UPDATE SET titulo = EXCLUDED.titulo, veiculo_sugerido = EXCLUDED.veiculo_sugerido, resumo = EXCLUDED.resumo,
           corpo = EXCLUDED.corpo, link_para = EXCLUDED.link_para, atualizado_em = now()`
      );
    });
  }
}

/**
 * Fila de distribuição: cada página nova no ar gera 1 post de LinkedIn e 1
 * roteiro de vídeo curto, com UTM. Ficam como rascunho para aprovação.
 */
export async function sincronizarDistribuicao(agora = new Date()) {
  const noAr = carregarConteudo().todas.filter((p) => estaNoAr(p, agora) && p.tipo !== "glossario");
  if (!noAr.length) return;
  const linhas = noAr.flatMap((p) => {
    const li = montarUtm(p.urlAbsoluta, { source: "linkedin", medium: "social", cluster: p.cluster as ClusterId, slug: p.slug, data: agora });
    const yt = montarUtm(p.urlAbsoluta, { source: "youtube", medium: "video", cluster: p.cluster as ClusterId, slug: p.slug, data: agora });
    const pontos = (p.secoes.find((s) => s.lista?.length)?.lista ?? p.secoes.map((s) => s.titulo)).slice(0, 3);
    const primeira = p.respostaDireta.split(/(?<=[.!?])\s/)[0];
    return [
      {
        url: p.urlAbsoluta,
        canal: "linkedin",
        texto: `${p.h1}\n\n${primeira}\n\n${pontos.map((x) => `→ ${x}`).join("\n")}\n\nTexto completo, com ${p.valorProprio.descricao.toLowerCase()}:\n${li}`,
        url_utm: li,
      },
      {
        url: p.urlAbsoluta,
        canal: "video_curto",
        texto: `ROTEIRO (até 45 s)\n[0–3 s] Gancho: "${p.h1}?"\n[3–15 s] Resposta: ${primeira}\n[15–35 s] Três pontos na tela:\n${pontos.map((x, i) => `  ${i + 1}. ${x}`).join("\n")}\n[35–45 s] Chamada: "${p.isca.chamada}" — link na descrição.\nDescrição: ${yt}`,
        url_utm: yt,
      },
    ];
  });
  await inserirEmLote("distribuicao_fila", linhas, `ON CONFLICT (url, canal) DO NOTHING`);
}

/**
 * IndexNow só para o que é novo ou mudou desde o último aviso: compara a
 * lista de URLs indexáveis com paginas_registro.indexnow_em.
 */
export async function anunciarNovidades(): Promise<number> {
  if (process.env.NODE_ENV !== "production" || process.env.INDEXNOW_DESLIGADO === "1") return 0;
  const urls = todasUrlsIndexaveis();
  const avisadas = new Set(
    (await consultar<{ url: string }>(
      `SELECT url FROM paginas_registro WHERE indexnow_em IS NOT NULL AND (revisado_em IS NULL OR indexnow_em >= revisado_em)`
    )).map((r) => r.url)
  );
  const novas = urls.filter((u) => !avisadas.has(u));
  if (!novas.length) return 0;
  await avisarIndexNow(novas);
  await inserirEmLote(
    "paginas_registro",
    novas.map((u) => ({ url: u, tipo: "existente", status: "publicada", no_sitemap: true, indexnow_em: new Date() })),
    `ON CONFLICT (url) DO UPDATE SET indexnow_em = EXCLUDED.indexnow_em`
  );
  await anotar("indexnow", `IndexNow: ${novas.length} URL(s) avisadas`, novas.slice(0, 20).join("\n"));
  return novas.length;
}
