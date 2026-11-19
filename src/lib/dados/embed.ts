/**
 * Gráfico embutível (iframe) em HTML puro: sem layout do site, sem script,
 * com crédito e link de atribuição para o relatório.
 */

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function htmlEmbed(titulo: string, linhas: Array<{ rotulo: string; valor: number }>, fonte: string): string {
  const fmt = (n: number) => n.toLocaleString("pt-BR");
  const largura = 720, esquerda = 210, direita = 90, alturaBarra = 14, passo = 26, topo = 8;
  const altura = topo + linhas.length * passo + 8;
  const max = Math.max(...linhas.map((l) => l.valor), 1);
  const barras = linhas
    .map((l, i) => {
      const y = topo + i * passo;
      const w = Math.max(((largura - esquerda - direita) * l.valor) / max, 2);
      const rot = l.rotulo.length > 30 ? `${l.rotulo.slice(0, 29)}…` : l.rotulo;
      return `<g><title>${esc(l.rotulo)}: ${fmt(l.valor)}</title><rect x="0" y="${y - 5}" width="${largura}" height="${passo}" fill="transparent"/><text x="${esquerda - 10}" y="${y + alturaBarra - 3}" text-anchor="end" font-size="12.5" fill="currentColor" fill-opacity=".78">${esc(rot)}</text><path d="M${esquerda},${y} h${w - 4} a4,4 0 0 1 4,4 v${alturaBarra - 8} a4,4 0 0 1 -4,4 h${-(w - 4)} z" fill="#e63946"/>${i < 3 ? `<text x="${esquerda + w + 8}" y="${y + alturaBarra - 3}" font-size="12.5" fill="currentColor">${fmt(l.valor)}</text>` : ""}</g>`;
    })
    .join("");
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(titulo)}</title>
<style>:root{color-scheme:light dark}body{margin:0;padding:12px 14px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#fff;color:#1a202c}@media (prefers-color-scheme:dark){body{background:#0b1020;color:#e2e8f0}}h1{font-size:15px;margin:0 0 8px}svg{width:100%;height:auto}p{font-size:11.5px;margin:6px 0 0;opacity:.8}a{color:inherit}</style></head>
<body><h1>${esc(titulo)}</h1><svg viewBox="0 0 ${largura} ${altura}" role="img" aria-label="${esc(titulo)}"><line x1="${esquerda}" x2="${esquerda}" y1="0" y2="${altura}" stroke="currentColor" stroke-opacity=".18"/>${barras}</svg>
<p>Fonte: ${esc(fonte)}. Gráfico: <a href="https://www.andersdev.com.br/dados/empresas-por-setor" target="_blank" rel="noopener">AndersDev</a> (CC BY 4.0).</p></body></html>`;
}

export function respostaEmbed(html: string): Response {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors *",
      "X-Robots-Tag": "noindex",
    },
  });
}
