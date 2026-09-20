/**
 * Distribuição do setor pelas 5 maiores UFs.
 *
 * Decisões de visualização:
 * - Uma série só (número de empresas), então UMA cor para todas as barras.
 *   Variar o tom por posição seria cor seguindo ranking, que mascara o dado:
 *   o comprimento da barra já codifica a magnitude.
 * - Rótulo direto em cada barra. São 5 valores — mostrar todos é mais legível
 *   que esconder atrás de hover, e mantém o número no HTML para leitor de tela
 *   e para o buscador.
 * - Sem legenda: série única, o título já a nomeia.
 * - Eixo recessivo; o dado tem o contraste, a moldura não.
 */

interface DistribuicaoUfProps {
  titulo: string;
  linhas: Array<{ uf: string; empresas: number }>;
  totalBrasil: number;
}

export function DistribuicaoUf({
  titulo,
  linhas,
  totalBrasil,
}: DistribuicaoUfProps) {
  const maior = Math.max(...linhas.map((l) => l.empresas), 1);

  return (
    <figure className="m-0">
      <figcaption className="text-sm font-bold text-foreground mb-1">
        {titulo}
      </figcaption>
      <p className="text-xs text-gray mb-5">
        Número de empresas por unidade da federação, das cinco maiores.
      </p>

      <div className="flex flex-col gap-[2px]">
        {linhas.map((linha) => {
          const largura = (linha.empresas / maior) * 100;
          const share = ((linha.empresas / totalBrasil) * 100).toFixed(1);
          return (
            <div key={linha.uf} className="flex items-center gap-3">
              <span className="text-xs text-gray w-[112px] shrink-0 text-right">
                {linha.uf}
              </span>
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <div
                  className="h-5 bg-brand rounded-[4px] shrink-0"
                  style={{ width: `${Math.max(largura, 1.5)}%` }}
                  role="img"
                  aria-label={`${linha.uf}: ${linha.empresas.toLocaleString("pt-BR")} empresas, ${share}% do total do país`}
                />
                <span className="text-xs text-foreground whitespace-nowrap tabular-nums">
                  {linha.empresas.toLocaleString("pt-BR")}
                </span>
                <span className="text-xs text-gray whitespace-nowrap">
                  {share}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
