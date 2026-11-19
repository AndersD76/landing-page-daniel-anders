import Link from "next/link";
import type { Metadata } from "next";
import { PaginaInstitucional } from "@/components/institucional/PaginaInstitucional";
import { AUTOR, ORGANIZACAO, organizationJsonLd } from "@/data/autor";

export const metadata: Metadata = {
  title: { absolute: "Sobre a AndersDev: empresa, endereço e contato" },
  description:
    "AndersDev: desenvolvimento de sites, sistemas, apps e automação para pequenas e médias empresas, em Passo Fundo/RS. Endereço, contato e responsável.",
  alternates: { canonical: "https://www.andersdev.com.br/sobre" },
};

export default function Page() {
  const e = ORGANIZACAO.endereco;
  return (
    <PaginaInstitucional
      h1="Sobre a AndersDev"
      rotulo="Sobre"
      jsonLd={[{ "@context": "https://schema.org", "@type": "AboutPage", url: "https://www.andersdev.com.br/sobre", mainEntity: organizationJsonLd() }]}
    >
      <p>
        A AndersDev desenvolve sites, lojas virtuais, aplicativos, sistemas sob medida, automações e integrações
        para pequenas e médias empresas. O trabalho é conduzido por <Link href="/sobre/daniel-anders">{AUTOR.nome}</Link>,
        do primeiro contato à entrega e à manutenção.
      </p>
      <h2>Dados da empresa</h2>
      <ul>
        <li>
          <strong>Nome:</strong> {ORGANIZACAO.nome}
        </li>
        {ORGANIZACAO.cnpj && (
          <li>
            <strong>CNPJ:</strong> {ORGANIZACAO.cnpj}
          </li>
        )}
        <li>
          <strong>Endereço:</strong> {e.rua}, {e.cidade}/{e.uf}, CEP {e.cep}
        </li>
        <li>
          <strong>Telefone e WhatsApp:</strong> <a href="https://wa.me/5554999648368">(54) 99964-8368</a>
        </li>
        <li>
          <strong>E-mail:</strong> <a href={`mailto:${ORGANIZACAO.email}`}>{ORGANIZACAO.email}</a>
        </li>
        <li>
          <strong>Atendimento:</strong> segunda a sexta, das 9h às 18h. Presencial em Passo Fundo e região; remoto para todo o Brasil.
        </li>
      </ul>
      <h2>Como os preços são definidos</h2>
      <p>
        As faixas de preço publicadas no site saem de uma tabela pública de escopo, a mesma usada pelas{" "}
        <Link href="/calculadora-site">calculadoras</Link>. Nenhuma página digita preço à mão. Veja todas em{" "}
        <Link href="/quanto-custa">quanto custa</Link>.
      </p>
      <h2>Conteúdo e privacidade</h2>
      <ul>
        <li>
          <Link href="/politica-editorial">Política editorial</Link>: como o conteúdo é produzido, revisado e corrigido.
        </li>
        <li>
          <Link href="/privacidade">Política de privacidade</Link>: que dados o site coleta e como pedir acesso ou exclusão.
        </li>
      </ul>
    </PaginaInstitucional>
  );
}
