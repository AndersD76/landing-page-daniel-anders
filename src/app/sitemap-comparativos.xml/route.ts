import { construirUrlset, respostaXml } from "@/lib/sitemap";
import { urlsConteudo } from "@/data/urls";

/** Revalida de hora em hora: a onda liberada pela data entra sem novo deploy. */
export const revalidate = 3600;

export function GET() {
  return respostaXml(construirUrlset(urlsConteudo("comparativo")));
}
