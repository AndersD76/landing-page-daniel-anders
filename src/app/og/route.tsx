import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

/**
 * Imagem Open Graph dinâmica por página: /og?t=<título>&k=<tipo>.
 * Cache longo — o título de uma URL muda raramente.
 */
export async function GET(req: NextRequest) {
  const titulo = (req.nextUrl.searchParams.get("t") || "AndersDev").slice(0, 110);
  const tipo = (req.nextUrl.searchParams.get("k") || "").slice(0, 40);
  const img = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#050816",
          color: "#f5f7fb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#e63946", textTransform: "uppercase" }}>{tipo}</div>
        <div style={{ display: "flex", fontSize: titulo.length > 60 ? 58 : 70, fontWeight: 700, lineHeight: 1.12 }}>{titulo}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a0aec0" }}>
          <span>andersdev.com.br</span>
          <span>Daniel Anders · Passo Fundo/RS</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
  img.headers.set("Cache-Control", "public, max-age=604800, s-maxage=604800, immutable");
  return img;
}
