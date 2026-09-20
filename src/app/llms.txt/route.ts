/**
 * /llms.txt — gerado dos mesmos dados que alimentam as páginas.
 *
 * Era um arquivo estático em public/, mantido à mão, e tinha envelhecido:
 * anunciava "a partir de R$ 2.500" enquanto a calculadora já dizia R$ 1.500,
 * e não conhecia os eixos novos. Preço escrito à mão diverge do dado — é
 * questão de tempo. Agora ele sai de calcularEstimativa() e do quality gate,
 * como todo o resto.
 */

import { paginasIndexaveis } from "@/data/custos";
import { setoresIndexaveis, fonteMercado } from "@/data/setores-paginas";
import { BASE_URL } from "@/data/urls";
import { configSite, formatDataCarga, FONTE_PRECIFICACAO } from "@/lib/calculadora";
import { getAllPosts } from "@/data/blog";

export const dynamic = "force-static";

export function GET() {
  const tipos = paginasIndexaveis.filter((p) => p.kind === "tipo");
  const setores = [...setoresIndexaveis].sort(
    (a, b) => b.dado.empresasBrasil - a.dado.empresasBrasil
  );
  const posts = getAllPosts().slice(0, 10);

  const faixas = tipos
    .map((p) => `- ${p.tipo.nome}: ${p.preco.faixa} — ${p.url}`)
    .join("\n");

  const porSetor = setores
    .map(
      (p) =>
        `- ${p.conteudo.nome} (CNAE ${p.dado.cnae}): ` +
        `${p.dado.empresasBrasil.toLocaleString("pt-BR")} empresas no Brasil, ` +
        `projeto típico ${p.preco.faixa} — ${p.url}`
    )
    .join("\n");

  const artigos = posts
    .map((p) => `- ${p.title}: ${BASE_URL}/blog/${p.slug}`)
    .join("\n");

  const corpo = `# AndersDev — Desenvolvimento de Software | Passo Fundo RS

## Sobre
AndersDev é a marca de desenvolvimento de software de Daniel Anders,
desenvolvedor full-stack com mais de 15 anos de experiência em tecnologia e
negócios. Sede em Passo Fundo, RS, Brasil. Atende empresas de todo o Brasil.

## Ação principal
Calcular o custo de um projeto em cerca de 2 minutos, sem cadastro para ver o
resultado:
- Site e e-commerce: ${BASE_URL}/calculadora-site
- App e sistema: ${BASE_URL}/calculadora-app

## Faixas de preço por tipo de projeto
Valores do modelo de precificação próprio, não são "a partir de".
Fonte: ${FONTE_PRECIFICACAO} — atualizado em ${formatDataCarga(configSite.atualizadoEm)}.

${faixas}

Índice completo, incluindo o efeito de cada integração no valor:
${BASE_URL}/quanto-custa

## O que muda no sistema de cada setor
Dado de mercado: ${fonteMercado.nome}, ano de referência ${fonteMercado.anoReferencia}.
Carga em ${fonteMercado.carregadoEm}. Fonte: ${fonteMercado.url}

${porSetor}

Índice completo: ${BASE_URL}/sistema-para

## Serviços
- Sites institucionais e landing pages
- Aplicativos mobile iOS e Android
- Sistemas web sob medida (SaaS, dashboards, automação)
- E-commerce e lojas virtuais
- MVP em 2 a 6 semanas
- Integração de APIs (Stripe, WhatsApp, ERPs)
- Consultoria em tecnologia e processos (ISO 9001)

## Tecnologias
React, Next.js, TypeScript, Tailwind CSS, Node.js, FastAPI, Python,
PostgreSQL, NeonDB, Drizzle ORM, Stripe, Resend, Vercel, Railway, Docker,
AWS, OpenAI, Claude

## Artigos
${artigos}

## Outras páginas
- Homepage: ${BASE_URL}
- Blog: ${BASE_URL}/blog
- Apps e MVPs: ${BASE_URL}/apps
- Para startups: ${BASE_URL}/para-startups
- Para PMEs: ${BASE_URL}/para-pmes-brasil
- Para agências: ${BASE_URL}/agencias-parceiras
- Trabalhar comigo: ${BASE_URL}/trabalhar-comigo

## Contato
- Agendar conversa gratuita: https://cal.com/daniel-anders-emx5kl
- WhatsApp: (54) 9.9964-8368
- E-mail: danielanders76@gmail.com
- LinkedIn: https://linkedin.com/in/danielandersbrrs
- GitHub: https://github.com/AndersD76

## Endereço
Rua Uruguai, 679 - Sala 201
Passo Fundo - RS, 99010-112, Brasil

## Idioma
Primário: português (pt-BR)
Secundário: inglês (en)
`;

  return new Response(corpo, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
