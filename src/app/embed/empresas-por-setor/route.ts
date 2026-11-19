import { FONTE_SETORES, setoresRanking } from "@/data/dados-proprios";
import { htmlEmbed, respostaEmbed } from "@/lib/dados/embed";

export const dynamic = "force-static";

export function GET() {
  return respostaEmbed(
    htmlEmbed(
      `Empresas por setor no Brasil (IBGE/CEMPRE ${FONTE_SETORES.ano})`,
      setoresRanking().map((s) => ({ rotulo: s.nome, valor: s.empresas })),
      `IBGE/CEMPRE ${FONTE_SETORES.ano}`
    )
  );
}
