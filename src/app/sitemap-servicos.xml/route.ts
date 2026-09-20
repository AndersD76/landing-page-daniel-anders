import { construirUrlset, respostaXml } from "@/lib/sitemap";
import { urlsServicos } from "@/data/urls";

export const dynamic = "force-static";

export function GET() {
  return respostaXml(construirUrlset(urlsServicos()));
}
