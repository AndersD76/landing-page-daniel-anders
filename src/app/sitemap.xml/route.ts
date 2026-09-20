import { construirIndice, respostaXml } from "@/lib/sitemap";
import { BASE_URL } from "@/data/custos";

export const dynamic = "force-static";

const FILHOS = [
  "sitemap-paginas.xml",
  "sitemap-servicos.xml",
  "sitemap-blog.xml",
  "sitemap-custos.xml",
  "sitemap-setores.xml",
];

export function GET() {
  const hoje = new Date().toISOString().slice(0, 10);
  return respostaXml(
    construirIndice(
      FILHOS.map((f) => ({ loc: `${BASE_URL}/${f}`, lastmod: hoje }))
    )
  );
}
