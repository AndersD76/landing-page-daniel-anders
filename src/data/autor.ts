/**
 * Autor e organização — fonte única para a página de autor, o Sobre, o
 * JSON-LD (Person/Organization) e a assinatura das páginas.
 *
 * Só entra aqui o que o próprio site já declara sobre o Daniel. Credencial
 * nova (formação com instituição e ano, certificações, CNPJ) é dado que só
 * ele pode fornecer — fica em variável de ambiente ou na lista de tarefas.
 */

export const SITE_URL = "https://www.andersdev.com.br";

export const AUTOR = {
  id: `${SITE_URL}/sobre/daniel-anders#pessoa`,
  nome: "Daniel Anders",
  url: `${SITE_URL}/sobre/daniel-anders`,
  cargo: "Desenvolvedor full-stack e consultor empresarial",
  resumo:
    "Engenheiro eletricista de formação, fundou uma consultoria empresarial e há mais de 15 anos trabalha entre tecnologia e gestão. Hoje desenvolve sites, sistemas, apps e automações para pequenas e médias empresas a partir de Passo Fundo (RS).",
  formacao: "Engenharia Elétrica",
  experienciaAnos: 15,
  areas: [
    "Desenvolvimento web (React, Next.js, TypeScript)",
    "Back-end e APIs (Python, FastAPI, Node.js)",
    "Banco de dados PostgreSQL",
    "Sistemas de gestão e automação de processos",
    "Gestão empresarial e ISO 9001",
  ],
  cidade: "Passo Fundo",
  uf: "RS",
  sameAs: ["https://github.com/AndersD76", "https://linkedin.com/in/danielandersbrrs"],
};

export const ORGANIZACAO = {
  id: `${SITE_URL}/#organizacao`,
  nome: "AndersDev",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  telefone: "+55-54-99964-8368",
  email: "contato@andersdev.com.br",
  endereco: {
    rua: "Rua Uruguai, 679 - Sala 201",
    cidade: "Passo Fundo",
    uf: "RS",
    cep: "99010-112",
    pais: "BR",
  },
  /** CNPJ é dado do titular: vem do ambiente (NEXT_PUBLIC_CNPJ) ou não aparece. */
  cnpj: process.env.NEXT_PUBLIC_CNPJ || null,
};

export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": AUTOR.id,
    name: AUTOR.nome,
    url: AUTOR.url,
    jobTitle: AUTOR.cargo,
    description: AUTOR.resumo,
    knowsAbout: AUTOR.areas,
    address: { "@type": "PostalAddress", addressLocality: AUTOR.cidade, addressRegion: AUTOR.uf, addressCountry: "BR" },
    worksFor: { "@id": ORGANIZACAO.id },
    sameAs: AUTOR.sameAs,
  };
}

export function organizationJsonLd() {
  return {
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": ORGANIZACAO.id,
    name: ORGANIZACAO.nome,
    url: ORGANIZACAO.url,
    logo: ORGANIZACAO.logo,
    image: `${SITE_URL}/og-image.jpg`,
    telephone: ORGANIZACAO.telefone,
    email: ORGANIZACAO.email,
    ...(ORGANIZACAO.cnpj ? { taxID: ORGANIZACAO.cnpj } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: ORGANIZACAO.endereco.rua,
      addressLocality: ORGANIZACAO.endereco.cidade,
      addressRegion: ORGANIZACAO.endereco.uf,
      postalCode: ORGANIZACAO.endereco.cep,
      addressCountry: ORGANIZACAO.endereco.pais,
    },
    founder: { "@id": AUTOR.id },
    areaServed: [
      { "@type": "City", name: "Passo Fundo" },
      { "@type": "State", name: "Rio Grande do Sul" },
      { "@type": "Country", name: "Brasil" },
    ],
    sameAs: AUTOR.sameAs,
  };
}
