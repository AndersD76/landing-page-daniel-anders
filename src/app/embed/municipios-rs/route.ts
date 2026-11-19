import { cidadesRanking, FONTE_CIDADES } from "@/data/dados-proprios";
import { htmlEmbed, respostaEmbed } from "@/lib/dados/embed";

export const dynamic = "force-static";

export function GET() {
  return respostaEmbed(
    htmlEmbed(
      `Municípios do RS com mais empresas (IBGE/CEMPRE ${FONTE_CIDADES.ano})`,
      cidadesRanking(20).map((c) => ({ rotulo: c.nome, valor: c.empresas })),
      `IBGE/CEMPRE ${FONTE_CIDADES.ano}`
    )
  );
}
