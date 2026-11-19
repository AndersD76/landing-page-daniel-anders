import { NextResponse, type NextProxy } from "next/server";
import { neon } from "@neondatabase/serverless";
import { identificarBot } from "@/lib/ops/crawlers";

/**
 * Monitor de rastreadores: registra cada acesso de Googlebot, Bingbot e
 * rastreadores de IA por página. Só bots são gravados (gente nunca) e o
 * registro sai depois da resposta (waitUntil) — não atrasa ninguém.
 *
 * O IP do bot é gravado para a validação diária contra as faixas publicadas
 * pelo provedor; é IP de infraestrutura de empresa, não de pessoa.
 */
export const proxy: NextProxy = (request, event) => {
  const ua = request.headers.get("user-agent");
  const bot = identificarBot(ua);
  if (bot && process.env.DATABASE_URL) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const path = request.nextUrl.pathname.slice(0, 500);
    event.waitUntil(
      neon(process.env.DATABASE_URL)
        .query(`INSERT INTO crawler_hits (bot, familia, path, ip, user_agent) VALUES ($1, $2, $3, $4, $5)`, [
          bot.nome,
          bot.familia,
          path,
          ip,
          (ua ?? "").slice(0, 400),
        ])
        .then(() => undefined)
        .catch(() => undefined)
    );
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/|favicon|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|css|js|woff2?)$).*)"],
};
