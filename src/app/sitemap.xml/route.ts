import { construirIndice, respostaXml, type UrlSitemap } from "@/lib/sitemap";
import { BASE_URL } from "@/data/custos";
import {
  TIPOS_SITEMAP,
  urlsAlternativas,
  urlsBlog,
  urlsCidades,
  urlsConteudo,
  urlsCustos,
  urlsFerramentasEHubs,
  urlsFixas,
  urlsServicos,
  urlsSetores,
} from "@/data/urls";

/**
 * Índice de sitemaps, um filho por tipo de página. lastmod do filho = a maior
 * data real de revisão das URLs dele (omitido quando nenhuma tem data).
 */
export const revalidate = 3600;

function maisRecente(urls: UrlSitemap[]): string | undefined {
  const datas = urls.map((u) => u.lastmod).filter((d): d is string => !!d).sort();
  return datas.at(-1);
}

export function GET() {
  const filhos: Array<[string, UrlSitemap[]]> = [
    ["sitemap-paginas.xml", urlsFixas()],
    ["sitemap-servicos.xml", urlsServicos()],
    ["sitemap-blog.xml", urlsBlog()],
    ["sitemap-custos.xml", urlsCustos()],
    ["sitemap-setores.xml", urlsSetores()],
    ["sitemap-cidades.xml", urlsCidades()],
    ["sitemap-alternativas.xml", urlsAlternativas()],
    ["sitemap-ferramentas.xml", urlsFerramentasEHubs()],
    ...TIPOS_SITEMAP.map((t) => [t.arquivo, urlsConteudo(t.tipo)] as [string, UrlSitemap[]]),
  ];
  return respostaXml(
    construirIndice(
      filhos.filter(([, urls]) => urls.length > 0).map(([f, urls]) => ({ loc: `${BASE_URL}/${f}`, lastmod: maisRecente(urls) }))
    )
  );
}
