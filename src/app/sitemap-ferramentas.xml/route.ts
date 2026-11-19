import { construirUrlset, respostaXml } from "@/lib/sitemap";
import { urlsFerramentasEHubs } from "@/data/urls";

export const dynamic = "force-static";

export function GET() {
  return respostaXml(construirUrlset(urlsFerramentasEHubs()));
}
