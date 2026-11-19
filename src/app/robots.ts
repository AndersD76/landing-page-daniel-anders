import type { MetadataRoute } from "next";

/**
 * robots.txt
 *
 * Buscadores e rastreadores de BUSCA das IAs (os que citam e mandam visita)
 * ficam liberados explicitamente. Rastreadores que só coletam para TREINO de
 * modelo são uma decisão de negócio do dono do site — ficam aqui, num lugar
 * só, com o estado que já estava em produção até ele decidir.
 */

const BLOQUEIOS = ["/admin/", "/api/", "/cursos/meus-cursos", "/cursos/player/"];

const BUSCA = [
  "Googlebot",
  "Bingbot",
  "Applebot",
  "DuckDuckBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
];

/** DECISÃO PENDENTE DO DONO (lista de tarefas): true = permite treino. */
const TREINO: Record<string, boolean> = {
  GPTBot: true,
  ClaudeBot: true,
  "Google-Extended": true,
  "Applebot-Extended": true,
  "meta-externalagent": false,
  CCBot: false,
  Bytespider: false,
};

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: BLOQUEIOS },
      ...BUSCA.map((ua) => ({ userAgent: ua, allow: "/", disallow: BLOQUEIOS })),
      ...Object.entries(TREINO).map(([ua, permite]) =>
        permite ? { userAgent: ua, allow: "/", disallow: BLOQUEIOS } : { userAgent: ua, disallow: "/" }
      ),
    ],
    sitemap: "https://www.andersdev.com.br/sitemap.xml",
    host: "https://www.andersdev.com.br",
  };
}
