import { construirUrlset, respostaXml } from "@/lib/sitemap";
import { urlsBlog } from "@/data/urls";

export const dynamic = "force-static";

export function GET() {
  return respostaXml(construirUrlset(urlsBlog()));
}
