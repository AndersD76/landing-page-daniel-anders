/**
 * Barras horizontais de uma série só (magnitude por categoria, ordenadas).
 * Uma cor (a da marca), marca fina com ponta arredondada de 4px ancorada na
 * base, rótulo só nos 3 maiores, valor de cada barra no <title> (tooltip ao
 * passar o mouse) e tabela equivalente fora do gráfico. Renderizado no
 * servidor: aparece sem JavaScript e dentro do iframe de embed.
 */
export function GraficoBarras({
  titulo,
  linhas,
  formatar,
}: {
  titulo: string;
  linhas: Array<{ rotulo: string; valor: number }>;
  formatar: (n: number) => string;
}) {
  const largura = 720;
  const esquerda = 210;
  const direita = 90;
  const alturaBarra = 14;
  const passo = 26;
  const topo = 8;
  const altura = topo + linhas.length * passo + 8;
  const max = Math.max(...linhas.map((l) => l.valor), 1);
  const escala = (v: number) => ((largura - esquerda - direita) * v) / max;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${largura} ${altura}`}
        role="img"
        aria-label={titulo}
        className="w-full h-auto"
        style={{ fontFamily: "inherit" }}
      >
        <line x1={esquerda} x2={esquerda} y1={0} y2={altura} stroke="currentColor" strokeOpacity={0.18} strokeWidth={1} />
        {linhas.map((l, i) => {
          const y = topo + i * passo;
          const w = Math.max(escala(l.valor), 2);
          return (
            <g key={l.rotulo}>
              <title>{`${l.rotulo}: ${formatar(l.valor)}`}</title>
              {/* área de toque maior que a barra */}
              <rect x={0} y={y - 5} width={largura} height={passo} fill="transparent" />
              <text x={esquerda - 10} y={y + alturaBarra - 3} textAnchor="end" fontSize={12.5} fill="currentColor" fillOpacity={0.78}>
                {l.rotulo.length > 30 ? `${l.rotulo.slice(0, 29)}…` : l.rotulo}
              </text>
              <path
                d={`M${esquerda},${y} h${w - 4} a4,4 0 0 1 4,4 v${alturaBarra - 8} a4,4 0 0 1 -4,4 h${-(w - 4)} z`}
                fill="#e63946"
              />
              {i < 3 && (
                <text x={esquerda + w + 8} y={y + alturaBarra - 3} fontSize={12.5} fill="currentColor" fillOpacity={0.9}>
                  {formatar(l.valor)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="sr-only">{titulo}</figcaption>
    </figure>
  );
}
