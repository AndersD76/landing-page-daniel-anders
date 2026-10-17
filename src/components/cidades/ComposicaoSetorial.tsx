/**
 * Composição setorial da cidade, com a média do estado como referência.
 *
 * Decisões de visualização:
 * - UMA série (o percentual da cidade), logo uma cor só. A média do RS entra
 *   como marca de referência sobre a mesma barra, não como segunda série —
 *   comparar contra uma referência é diferente de comparar duas categorias.
 * - Rótulo direto em todas as linhas: são 6, mostrar todas é mais legível que
 *   esconder atrás de hover, e mantém o número no HTML para leitor de tela.
 * - A razão (quantas vezes acima ou abaixo) é o que o leitor realmente quer —
 *   fica em texto, destacada só quando é atípica.
 */

interface Linha {
  nome: string;
  empresas: number;
  pctCidade: number;
  pctUf: number | null;
  razao: number | null;
}

interface ComposicaoSetorialProps {
  cidade: string;
  linhas: Linha[];
  /** acima desta razão o setor é tratado como atípico */
  limiteAtipico: number;
}

export function ComposicaoSetorial({
  cidade,
  linhas,
  limiteAtipico,
}: ComposicaoSetorialProps) {
  const maior = Math.max(...linhas.map((l) => l.pctCidade), 1);

  return (
    <figure className="m-0">
      <figcaption className="text-sm font-bold text-foreground mb-1">
        O que as empresas de {cidade} fazem
      </figcaption>
      <p className="text-xs text-gray mb-5">
        Participação de cada setor no total de empresas da cidade. O traço claro
        sobre a barra marca a média do Rio Grande do Sul no mesmo setor.
      </p>

      <div className="flex flex-col gap-[2px]">
        {linhas.map((l) => {
          const largura = (l.pctCidade / maior) * 100;
          const refer = l.pctUf !== null ? (l.pctUf / maior) * 100 : null;
          const atipico = l.razao !== null && l.razao >= limiteAtipico;

          return (
            <div key={l.nome} className="flex items-center gap-3">
              <span className="text-xs text-gray w-[150px] shrink-0 text-right leading-tight">
                {l.nome}
              </span>

              <div className="flex-1 flex items-center gap-2 min-w-0">
                <div className="relative h-5 flex-1 min-w-0">
                  <div
                    className="absolute inset-y-0 left-0 bg-brand rounded-[4px]"
                    style={{ width: `${Math.max(largura, 1.5)}%` }}
                    role="img"
                    aria-label={`${l.nome} em ${cidade}: ${l.pctCidade}% das empresas${
                      l.pctUf !== null
                        ? `, contra ${l.pctUf}% na média do Rio Grande do Sul`
                        : ""
                    }`}
                  />
                  {refer !== null && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 w-[2px] bg-foreground/45"
                      style={{ left: `${Math.min(Math.max(refer, 0), 100)}%` }}
                    />
                  )}
                </div>

                <span className="text-xs text-foreground whitespace-nowrap tabular-nums w-[46px] text-right">
                  {l.pctCidade}%
                </span>
                <span
                  className={`text-xs whitespace-nowrap tabular-nums w-[52px] text-right ${
                    atipico ? "text-brand font-bold" : "text-gray"
                  }`}
                >
                  {l.razao !== null ? `${l.razao}x` : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray mt-4">
        A última coluna é a razão entre a cidade e o estado. Acima de{" "}
        {limiteAtipico}x o setor é tratado aqui como atípico — é ele que define
        qual sistema tende a se pagar primeiro.
      </p>
    </figure>
  );
}
