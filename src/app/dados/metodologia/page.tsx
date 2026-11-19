import type { Metadata } from "next";
import { PaginaInstitucional } from "@/components/institucional/PaginaInstitucional";
import { FONTE_CIDADES, FONTE_SETORES } from "@/data/dados-proprios";

export const metadata: Metadata = {
  title: { absolute: "Metodologia dos dados de empresas (IBGE) | AndersDev" },
  description:
    "De onde vêm os números de empresas por setor e por município publicados no site: tabela do IBGE, recorte, ano de referência e atualização.",
  alternates: { canonical: "https://www.andersdev.com.br/dados/metodologia" },
};

export default function Page() {
  return (
    <PaginaInstitucional
      h1="Metodologia dos dados de empresas"
      rotulo="Metodologia"
      jsonLd={[{ "@context": "https://schema.org", "@type": "WebPage", name: "Metodologia dos dados de empresas", url: "https://www.andersdev.com.br/dados/metodologia" }]}
    >
      <h2>Fonte</h2>
      <p>
        <a href={FONTE_SETORES.url} rel="noopener">{FONTE_SETORES.nome}</a>, consultado pela API SIDRA do IBGE. Ano de referência dos
        setores: {FONTE_SETORES.ano}; dos municípios: {FONTE_CIDADES.ano}.
      </p>
      <h2>Recorte</h2>
      <ul>
        <li>Setores: uma classe CNAE representativa por setor (indicada na tabela do relatório), contagem de unidades locais de empresas e pessoal ocupado no Brasil e por UF.</li>
        <li>Municípios: unidades locais por município do Rio Grande do Sul e composição por seção da CNAE. O site publica páginas só para municípios acima de um mínimo de empresas, para que o dado de cada página seja significativo.</li>
        <li>&quot;Pessoas por empresa&quot; é a divisão simples do pessoal ocupado pelo número de empresas do recorte.</li>
      </ul>
      <h2>Atualização</h2>
      <p>
        Os scripts <code>carregar:cempre</code> e <code>carregar:cidades</code> do repositório buscam a tabela de novo quando o IBGE
        publica um ano novo. Relatório, páginas de setor e município e gráficos embutidos são gerados desse mesmo arquivo —
        não há número digitado à mão.
      </p>
      <h2>Limites</h2>
      <ul>
        <li>O CEMPRE tem defasagem de cerca de dois anos em relação à data de publicação.</li>
        <li>Classe CNAE representa o setor de forma aproximada: empresas com atividade principal em outra classe não entram.</li>
        <li>Faixas de preço citadas em outras páginas vêm da tabela pública de escopo da AndersDev, não do IBGE.</li>
      </ul>
      <h2>Reprodução</h2>
      <p>Os gráficos e tabelas podem ser reproduzidos com crédito (CC BY 4.0): &quot;AndersDev, a partir de IBGE/CEMPRE&quot;, com link para o relatório.</p>
    </PaginaInstitucional>
  );
}
