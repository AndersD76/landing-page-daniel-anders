import { construirUrlset, respostaXml } from "@/lib/sitemap";
import { urlsSetores } from "@/data/urls";

export const dynamic = "force-static";

export function GET() {
  return respostaXml(construirUrlset(urlsSetores()));
}
