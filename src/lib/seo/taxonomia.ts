/**
 * Taxonomia do crescimento orgânico — fonte única.
 *
 * Clusters, tipos de página e iscas são usados por quatro consumidores que não
 * podem divergir: o mapa de buscas (classificação), os templates de página
 * (isca contextual e página comercial do cluster), a telemetria (propriedade
 * `cluster` em todo evento) e o painel (filtros). Mudou aqui, muda em todos.
 */

export type ClusterId =
  | "custo-projeto"
  | "sites"
  | "seo-google"
  | "ecommerce"
  | "aplicativos"
  | "sistemas-gestao"
  | "automacao-integracao"
  | "lgpd-legal"
  | "contratacao-projeto";

export type TipoPagina =
  | "pilar"
  | "satelite"
  | "modelo"
  | "glossario"
  | "norma"
  | "comparativo"
  | "alternativa"
  | "ferramenta"
  | "programatica"
  | "setor"
  | "custo"
  | "local"
  | "servico"
  | "blog"
  | "institucional"
  | "hub";

export type IscaId =
  | "calculadora-site"
  | "calculadora-app"
  | "diagnostico-site"
  | "custo-da-planilha"
  | "checklist-lancamento-site"
  | "checklist-lgpd-site"
  | "gerador-briefing-site"
  | "escopo-mvp"
  | "taxa-marketplace"
  | "mini-curso-sistema"
  | "spec-app-startup"
  | "modelo-download";

export interface Cluster {
  id: ClusterId;
  nome: string;
  /** frase curta usada em hubs e no e-mail */
  descricao: string;
  /** isca exibida por padrão nas páginas do cluster */
  isca: IscaId;
  /** isca secundária (fim da página) */
  iscaSecundaria: IscaId;
  /** página comercial que o cluster sustenta */
  paginaComercial: { href: string; rotulo: string };
  /** termos que puxam uma consulta para o cluster (ordem importa: o primeiro que casar vence) */
  termos: string[];
}

export const CLUSTERS: Cluster[] = [
  {
    id: "lgpd-legal",
    nome: "LGPD e regras para sites e sistemas",
    descricao: "O que a lei pede de um site, loja ou sistema — e como provar que cumpre.",
    isca: "checklist-lgpd-site",
    iscaSecundaria: "diagnostico-site",
    paginaComercial: { href: "/servicos/desenvolvimento-react-next-js", rotulo: "Site e sistema já adequados à LGPD" },
    termos: [
      "lgpd", "política de privacidade", "politica de privacidade", "termos de uso", "termo de uso",
      "cookie", "cookies", "dados pessoais", "encarregado", "dpo", "anpd", "marco civil", "lei ",
      "decreto", "contrato de desenvolvimento", "contrato de software", "direito de arrependimento",
      "código de defesa do consumidor", "codigo de defesa do consumidor", "cdc", "inpi", "registro de software",
      "acessibilidade", "lei brasileira de inclusão", "nota fiscal", "nfe", "nf-e", "nfc-e", "multa",
      "obrigatório", "obrigatorio", "propriedade intelectual", "direito autoral", "assinatura eletrônica",
      "assinatura eletronica",
    ],
  },
  {
    id: "custo-projeto",
    nome: "Quanto custa site, app e sistema",
    descricao: "Faixas de preço calculadas a partir de uma tabela pública de escopo.",
    isca: "calculadora-site",
    iscaSecundaria: "calculadora-app",
    paginaComercial: { href: "/quanto-custa", rotulo: "Ver todas as faixas de preço" },
    termos: [
      "quanto custa", "quanto cobra", "quanto cobrar", "preço", "preco", "valor de", "valor do", "valor da",
      "valor para", "orçamento", "orcamento", "custo de", "custo para", "custo do", "tabela de preço",
      "tabela de preco", "mensalidade", "barato", "caro",
    ],
  },
  {
    id: "seo-google",
    nome: "Aparecer no Google",
    descricao: "Por que o site não aparece e o que muda a posição de verdade.",
    isca: "diagnostico-site",
    iscaSecundaria: "checklist-lancamento-site",
    paginaComercial: { href: "/servicos/desenvolvimento-react-next-js", rotulo: "Site rápido e pronto para o Google" },
    termos: [
      "google", "seo", "aparecer", "ranquear", "rankear", "primeira página", "primeira pagina",
      "search console", "indexar", "indexação", "indexacao", "palavra-chave", "palavras-chave",
      "palavra chave", "tráfego", "trafego", "marketing digital", "perfil da empresa", "meu negócio",
      "meu negocio", "anúncio", "anuncio", "ads",
    ],
  },
  {
    id: "ecommerce",
    nome: "Loja virtual e venda online",
    descricao: "Plataforma pronta, loja própria e o ponto em que a taxa vira prejuízo.",
    isca: "taxa-marketplace",
    iscaSecundaria: "calculadora-site",
    paginaComercial: { href: "/quanto-custa/ecommerce", rotulo: "Quanto custa uma loja própria" },
    termos: [
      "loja virtual", "loja online", "e-commerce", "ecommerce", "comércio eletrônico", "comercio eletronico",
      "vender pela internet", "vender online", "vender na internet", "marketplace", "nuvemshop", "shopify",
      "tray", "loja integrada", "mercado livre", "shopee", "ifood", "checkout", "frete", "gateway de pagamento",
      "pix", "carrinho",
    ],
  },
  {
    id: "aplicativos",
    nome: "Aplicativos para empresas",
    descricao: "Quando um app faz sentido, como publicar e o que encarece.",
    isca: "calculadora-app",
    iscaSecundaria: "escopo-mvp",
    paginaComercial: { href: "/quanto-custa/app-mobile", rotulo: "Quanto custa um app" },
    termos: [
      "aplicativo", "app ", " app", "apps", "android", "ios", "iphone", "play store", "app store",
      "flutter", "react native", "pwa", "mobile",
    ],
  },
  {
    id: "sistemas-gestao",
    nome: "Sistemas de gestão sob medida",
    descricao: "ERP, CRM, ordem de serviço, estoque, agenda: pronto ou sob medida.",
    isca: "custo-da-planilha",
    iscaSecundaria: "mini-curso-sistema",
    paginaComercial: { href: "/sistema-para", rotulo: "Sistemas por setor" },
    termos: [
      "sistema", "software", "erp", "crm", "gestão", "gestao", "controle de", "ordem de serviço",
      "ordem de servico", "estoque", "agendamento", "agenda", "financeiro", "fluxo de caixa", "pdv",
      "frente de caixa", "saas", "programa para", "programa de",
    ],
  },
  {
    id: "automacao-integracao",
    nome: "Automação, planilhas e integrações",
    descricao: "Do WhatsApp e da planilha para um processo que roda sozinho.",
    isca: "custo-da-planilha",
    iscaSecundaria: "mini-curso-sistema",
    paginaComercial: { href: "/servicos/integracoes-api-stripe", rotulo: "Integrações e automação" },
    termos: [
      "automação", "automacao", "automatizar", "planilha", "excel", "google sheets", "whatsapp", "api",
      "integração", "integracao", "integrar", "webhook", "chatbot", "robô", "robo", "inteligência artificial",
      "inteligencia artificial", " ia ", "chatgpt", "n8n", "zapier", "make.com", "rpa", "bot",
    ],
  },
  {
    id: "contratacao-projeto",
    nome: "Como contratar e conduzir um projeto",
    descricao: "Briefing, escopo, MVP, prazos e quem contratar.",
    isca: "gerador-briefing-site",
    iscaSecundaria: "escopo-mvp",
    paginaComercial: { href: "/trabalhar-comigo", rotulo: "Como é trabalhar comigo" },
    termos: [
      "contratar", "freelancer", "freela", "agência", "agencia", "programador", "desenvolvedor",
      "empresa de software", "fábrica de software", "fabrica de software", "briefing", "escopo", "mvp",
      "requisitos", "cronograma", "prazo", "proposta", "startup", "fornecedor", "terceirizar",
    ],
  },
  {
    id: "sites",
    nome: "Sites para empresas",
    descricao: "Site institucional, landing page, domínio e hospedagem sem enrolação.",
    isca: "checklist-lancamento-site",
    iscaSecundaria: "diagnostico-site",
    paginaComercial: { href: "/quanto-custa/site-institucional", rotulo: "Quanto custa um site institucional" },
    termos: [
      "site", "landing page", "página de vendas", "pagina de vendas", "hospedagem", "domínio", "dominio",
      "wordpress", "wix", "html", "responsivo", "portfólio", "portfolio", "blog", "webdesign", "web design",
      "ssl", "https", "registro.br",
    ],
  },
];

export const CLUSTER_POR_ID: Record<ClusterId, Cluster> = Object.fromEntries(
  CLUSTERS.map((c) => [c.id, c])
) as Record<ClusterId, Cluster>;

export function getCluster(id: string | undefined | null): Cluster | undefined {
  return id ? CLUSTER_POR_ID[id as ClusterId] : undefined;
}

/* ------------------------------------------------------------ intenção */

export type Intencao = "informacional" | "comercial" | "transacional" | "local" | "navegacional";

/** Municípios do RS e capitais: busca com cidade é intenção local. */
const MARCADORES_LOCAIS = [
  "passo fundo", "erechim", "carazinho", "porto alegre", "caxias", "santa maria", "pelotas",
  "canoas", "novo hamburgo", "são leopoldo", "sao leopoldo", "gravataí", "gravatai", "santa cruz do sul",
  "lajeado", "bento gonçalves", "bento goncalves", "ijuí", "ijui", "santo ângelo", "santo angelo",
  "cruz alta", "rs", "rio grande do sul", "perto de mim", "próximo", "proximo", "na minha cidade",
  "são paulo", "sao paulo", "curitiba", "florianópolis", "florianopolis", "belo horizonte",
];

const MARCAS = [
  "wix", "wordpress", "shopify", "nuvemshop", "tray", "loja integrada", "hostinger", "locaweb",
  "hostgator", "godaddy", "bling", "omie", "conta azul", "tiny", "rd station", "hubspot",
  "pipedrive", "trello", "notion", "bubble", "flutterflow", "glide", "ifood", "mercado livre", "shopee",
];

export function classificarIntencao(consulta: string): Intencao {
  const q = ` ${consulta.toLowerCase()} `;
  if (MARCADORES_LOCAIS.some((m) => q.includes(` ${m} `) || q.endsWith(` ${m} `))) return "local";
  if (/(quanto custa|preço|preco|valor|orçamento|orcamento|contratar|empresa de|agência de|agencia de|comprar|assinar|plano|mensalidade|barato)/.test(q))
    return "transacional";
  if (/( vs |versus| ou | x |melhor|melhores|alternativa|comparativo|comparação|comparacao|qual escolher|vale a pena|top )/.test(q))
    return "comercial";
  if (MARCAS.some((m) => q.trim() === m || q.includes(` ${m} login`) || q.includes(` ${m} entrar`)))
    return "navegacional";
  return "informacional";
}

/* -------------------------------------------------------- tipo de página */

export function classificarTipoPagina(consulta: string, intencao: Intencao): TipoPagina {
  const q = consulta.toLowerCase();
  // `\b` não funciona depois de "é" (não é caractere de palavra em regex JS):
  // a fronteira é espaço ou fim de texto.
  if (
    /^(o que é|o que e|o que são|o que sao|o que significa|significado|definição|definicao|conceito de|para que serve)(?=\s|$)/.test(q) ||
    /(^|\s)(o que é|o que e)(?=\s|$)/.test(q)
  )
    return "glossario";
  if (/(modelo|template|planilha|checklist|check list|exemplo de|exemplos de|formulário|formulario|roteiro|pdf|word|docx)/.test(q))
    return "modelo";
  if (/(lei |lgpd|decreto|artigo|art\.|norma|resolução|resolucao|portaria|obrigatório|obrigatorio|multa)/.test(q))
    return "norma";
  if (/(calculadora|simulador|calcular|gerador|gerar |teste de|diagnóstico|diagnostico|verificar)/.test(q))
    return "ferramenta";
  if (/(alternativa|alternativas)/.test(q)) return "alternativa";
  if (/( vs |versus| ou | x |melhor|melhores|comparativo|comparação|comparacao|diferença entre|diferenca entre)/.test(q))
    return "comparativo";
  if (/(para |pra )(clínica|clinica|restaurante|oficina|loja|academia|salão|salao|escritório|escritorio|imobiliária|imobiliaria|transportadora|indústria|industria|farmácia|farmacia|pet|escola|igreja|hotel|pousada|consultório|consultorio|construtora|contabilidade|advogado|advocacia|dentista|mercado|padaria|distribuidora)/.test(q))
    return "setor";
  if (intencao === "local") return "local";
  if (/(quanto custa|preço|preco|valor)/.test(q)) return "custo";
  if (/^(guia|tudo sobre|como funciona)/.test(q)) return "pilar";
  return "satelite";
}

/* ----------------------------------------------------------- cluster */

export function classificarCluster(consulta: string): ClusterId {
  const q = ` ${consulta.toLowerCase()} `;
  for (const c of CLUSTERS) {
    if (c.termos.some((t) => q.includes(t))) return c.id;
  }
  return "contratacao-projeto";
}

/* ---------------------------------------------------------- prioridade */

const PESO_INTENCAO: Record<Intencao, number> = {
  transacional: 40,
  local: 35,
  comercial: 30,
  informacional: 15,
  navegacional: 0,
};

/** Clusters mais próximos da venda do serviço pesam mais. */
const PESO_CLUSTER: Record<ClusterId, number> = {
  "custo-projeto": 30,
  "sistemas-gestao": 28,
  "automacao-integracao": 24,
  aplicativos: 22,
  ecommerce: 22,
  sites: 20,
  "contratacao-projeto": 18,
  "seo-google": 14,
  "lgpd-legal": 12,
};

/**
 * Prioridade 0–100. Volume real só existe com Keyword Planner/GSC; até lá a
 * posição na lista do autocomplete (1 = mais buscada entre as sugestões) é o
 * único sinal de popularidade disponível — e fica marcada como estimativa.
 */
export function calcularPrioridade(
  intencao: Intencao,
  cluster: ClusterId,
  posicaoAutocomplete: number | null
): number {
  const pop = posicaoAutocomplete ? Math.max(0, 30 - (posicaoAutocomplete - 1) * 3) : 10;
  return Math.min(100, PESO_INTENCAO[intencao] + PESO_CLUSTER[cluster] + pop);
}

/* --------------------------------------------------------------- canais */

export type Canal =
  | "organico"
  | "ia"
  | "social"
  | "email"
  | "pago"
  | "referencia"
  | "direto"
  | "interno";

/** Hosts de busca orgânica. Subdomínios casam (www.google.com.br, br.search.yahoo.com). */
export const HOSTS_BUSCA = [
  "google.", "bing.com", "duckduckgo.com", "search.yahoo.com", "yahoo.com", "ecosia.org",
  "yandex.", "baidu.com", "search.brave.com", "startpage.com", "qwant.com",
];

/** Respostas de IA contam como canal orgânico próprio — é o GEO. */
export const HOSTS_IA = [
  "chatgpt.com", "chat.openai.com", "perplexity.ai", "gemini.google.com", "bard.google.com",
  "copilot.microsoft.com", "claude.ai", "meta.ai", "you.com", "phind.com", "poe.com",
];

export const HOSTS_SOCIAIS = [
  "linkedin.com", "lnkd.in", "facebook.com", "fb.com", "instagram.com", "l.instagram.com",
  "t.co", "x.com", "twitter.com", "youtube.com", "youtu.be", "tiktok.com", "whatsapp.com",
  "wa.me", "l.wl.co", "reddit.com", "pinterest.com", "threads.net",
];

function casaHost(host: string, lista: string[]): boolean {
  return lista.some((h) => (h.endsWith(".") ? host.includes(h) : host === h || host.endsWith(`.${h}`)));
}

/**
 * Canal de uma entrada. A ordem segue o padrão do GA4: UTM explícita vence o
 * referrer; IA vence busca (gemini.google.com não é google orgânico).
 */
export function classificarCanal(input: {
  referrerHost?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  hostProprio?: string;
}): Canal {
  const medium = (input.utmMedium || "").toLowerCase();
  const source = (input.utmSource || "").toLowerCase();
  if (medium) {
    if (/^(cpc|ppc|paid|pago|display|retargeting)/.test(medium)) return "pago";
    if (medium === "email" || medium === "e-mail" || medium === "newsletter") return "email";
    if (/^(social|social-organico|organic_social)/.test(medium)) return "social";
    if (medium === "ia" || medium === "ai") return "ia";
    if (medium === "organic" || medium === "organico") return "organico";
    if (medium === "referral" || medium === "parceiro") return "referencia";
  }
  if (source && casaHost(source, HOSTS_IA)) return "ia";
  const host = (input.referrerHost || "").toLowerCase();
  if (!host) return source ? "referencia" : "direto";
  if (input.hostProprio && (host === input.hostProprio || host.endsWith(`.${input.hostProprio}`)))
    return "interno";
  if (casaHost(host, HOSTS_IA)) return "ia";
  if (casaHost(host, HOSTS_BUSCA)) return "organico";
  if (casaHost(host, HOSTS_SOCIAIS)) return "social";
  return "referencia";
}

/* ------------------------------------------------------------------ UTM */

/**
 * Padrão de UTM do portfólio:
 *   utm_source   = rede ou veículo (linkedin, youtube, whatsapp, newsletter, <dominio-parceiro>)
 *   utm_medium   = social | email | referral | video | cpc
 *   utm_campaign = <cluster>-<aaaamm>
 *   utm_content  = <slug da página de destino>
 */
export function montarUtm(
  url: string,
  p: { source: string; medium: "social" | "email" | "referral" | "video" | "cpc"; cluster: ClusterId; slug: string; data?: Date }
): string {
  const d = p.data ?? new Date();
  const aaaamm = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  const u = new URL(url);
  u.searchParams.set("utm_source", p.source);
  u.searchParams.set("utm_medium", p.medium);
  u.searchParams.set("utm_campaign", `${p.cluster}-${aaaamm}`);
  u.searchParams.set("utm_content", p.slug);
  return u.toString();
}
