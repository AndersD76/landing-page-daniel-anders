import Link from "next/link";
import type { Metadata } from "next";
import { PaginaInstitucional } from "@/components/institucional/PaginaInstitucional";
import { AUTOR } from "@/data/autor";
import { LIMITES } from "@/lib/conteudo/gate";

export const metadata: Metadata = {
  title: { absolute: "Política editorial: como o conteúdo é feito | AndersDev" },
  description:
    "Como o conteúdo da AndersDev é produzido com apoio de IA, conferido por um portão de qualidade, baseado em fontes oficiais e corrigido.",
  alternates: { canonical: "https://www.andersdev.com.br/politica-editorial" },
};

export default function Page() {
  return (
    <PaginaInstitucional
      h1="Política editorial"
      rotulo="Política editorial"
      jsonLd={[{ "@context": "https://schema.org", "@type": "WebPage", name: "Política editorial", url: "https://www.andersdev.com.br/politica-editorial" }]}
    >
      <p>
        Esta página explica quem escreve o conteúdo do site, como ele é produzido e conferido, de onde vêm os
        fatos e como pedir correção. O responsável editorial é <Link href="/sobre/daniel-anders">{AUTOR.nome}</Link>.
      </p>
      <h2>Por que o conteúdo existe</h2>
      <p>
        Para responder as dúvidas reais de quem vai contratar ou conduzir um projeto de site, loja, app ou sistema.
        As pautas saem de buscas reais (sugestões do Google e, quando disponíveis, dados do Search Console), e cada
        página precisa trazer algo útil que não seja só repetição: tabela, passo a passo, checklist, modelo pronto,
        exemplo prático ou cálculo com dado próprio.
      </p>
      <h2>Como é produzido</h2>
      <p>
        Os textos são redigidos com apoio de ferramentas de inteligência artificial a partir de um modelo de página,
        da pauta e dos dados próprios do site. Nenhuma página vai ao ar sem passar por um portão automático de
        qualidade, e páginas que dependem de opinião, experiência ou validação jurídica do autor ficam em revisão
        até ele aprovar.
      </p>
      <h2>O portão de qualidade</h2>
      <ul>
        <li>A resposta aparece nas duas primeiras frases, em {LIMITES.respostaMin} a {LIMITES.respostaMax} palavras.</li>
        <li>Há um elemento de valor próprio verificável (tabela, modelo, checklist, passo a passo, exemplo ou cálculo).</li>
        <li>Afirmação legal tem fonte em domínio oficial (.gov.br, .jus.br, .leg.br); afirmação técnica tem a documentação de quem define a regra. Toda fonte é conferida automaticamente.</li>
        <li>Preço só da tabela pública de escopo, a mesma das calculadoras. Preço de terceiros não é publicado.</li>
        <li>Textos com estatística sem fonte, caso de cliente, depoimento ou experiência atribuída ao autor são reprovados.</li>
        <li>Páginas parecidas demais com outra do site (similaridade acima de {LIMITES.similaridadeMax * 100}%) são reprovadas e fundidas.</li>
        <li>Título, descrição e H1 únicos; links internos de entrada e saída; dados estruturados coerentes com o que está na tela.</li>
      </ul>
      <p>Página reprovada não é publicada. A data de atualização visível em cada página é a data da última revisão.</p>
      <h2>Fontes</h2>
      <p>
        Leis no Planalto e no Diário Oficial; dados de mercado do IBGE (Cadastro Central de Empresas), com ano de
        referência na página; regras de plataformas na documentação oficial delas. Cada página lista as fontes que
        usou, com a data de consulta.
      </p>
      <h2>Correções</h2>
      <p>
        Achou um erro? Escreva para <a href="mailto:contato@andersdev.com.br">contato@andersdev.com.br</a> com o
        endereço da página. A correção é feita e a data de revisão da página é atualizada.
      </p>
      <h2>O que este conteúdo não é</h2>
      <p>
        Páginas sobre leis são informativas e não substituem parecer jurídico. Faixas de preço são referência para
        planejamento; o valor final depende do escopo.
      </p>
    </PaginaInstitucional>
  );
}
