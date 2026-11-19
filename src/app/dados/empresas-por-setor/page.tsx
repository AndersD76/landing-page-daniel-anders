import type { Metadata } from "next";
import Link from "next/link";
import { PaginaInstitucional } from "@/components/institucional/PaginaInstitucional";
import { GraficoBarras } from "@/components/dados/GraficoBarras";
import { IscaCard } from "@/components/iscas/IscaContextual";
import { getIsca } from "@/data/iscas";
import { cidadesRanking, FONTE_CIDADES, FONTE_SETORES, fmt, setoresRanking } from "@/data/dados-proprios";

const URL = "https://www.andersdev.com.br/dados/empresas-por-setor";

export const metadata: Metadata = {
  title: { absolute: "Empresas por setor no Brasil e no RS (IBGE) | AndersDev" },
  description: `Quantas empresas existem em 12 setores no Brasil e nos 20 maiores municípios do RS, com dado do IBGE (CEMPRE ${FONTE_SETORES.ano}). Gráficos para embutir.`,
  alternates: { canonical: URL },
};

export default function Page() {
  const setores = setoresRanking();
  const cidades = cidadesRanking(20);
  const embed = (caminho: string, alt: number) =>
    `<iframe src="https://www.andersdev.com.br/embed/${caminho}" width="100%" height="${alt}" style="border:0" loading="lazy" title="Empresas por setor — AndersDev"></iframe>`;

  return (
    <PaginaInstitucional
      h1="Empresas por setor no Brasil e no Rio Grande do Sul"
      rotulo="Dados"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Empresas por setor no Brasil e por município no RS",
          description: `Número de empresas e pessoal ocupado em 12 setores (CNAE) no Brasil e nos municípios do RS, a partir do Cadastro Central de Empresas (CEMPRE) do IBGE, ano de referência ${FONTE_SETORES.ano}.`,
          url: URL,
          creator: { "@type": "Organization", name: "AndersDev", url: "https://www.andersdev.com.br" },
          isBasedOn: FONTE_SETORES.url,
          temporalCoverage: FONTE_SETORES.ano,
          spatialCoverage: "Brasil; Rio Grande do Sul",
          license: "https://creativecommons.org/licenses/by/4.0/",
          dateModified: FONTE_SETORES.carregadoEm,
          inLanguage: "pt-BR",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "https://www.andersdev.com.br" },
            { "@type": "ListItem", position: 2, name: "Dados", item: URL },
          ],
        },
      ]}
    >
      <p>
        São {fmt(FONTE_SETORES.totalBrasil)} empresas no Brasil segundo o Cadastro Central de Empresas do IBGE (ano de referência{" "}
        {FONTE_SETORES.ano}). Abaixo, os 12 setores que mais procuram sistemas sob medida e os 20 municípios gaúchos com mais
        empresas. Os números são recarregados da API do IBGE quando há ano novo — veja a <Link href="/dados/metodologia">metodologia</Link>.
      </p>

      <h2>Empresas por setor no Brasil</h2>
      <GraficoBarras titulo={`Empresas por setor no Brasil (IBGE/CEMPRE ${FONTE_SETORES.ano})`} linhas={setores.map((s) => ({ rotulo: s.nome, valor: s.empresas }))} formatar={fmt} />
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left text-foreground">
              <th className="py-2 pr-3">Setor</th>
              <th className="py-2 pr-3">CNAE</th>
              <th className="py-2 pr-3 text-right">Empresas</th>
              <th className="py-2 pr-3 text-right">Pessoal ocupado</th>
              <th className="py-2 pr-3 text-right">Pessoas por empresa</th>
              <th className="py-2">UF com mais empresas</th>
            </tr>
          </thead>
          <tbody>
            {setores.map((s) => (
              <tr key={s.slug} className="border-t border-white/10">
                <td className="py-2 pr-3"><Link href={`/sistema-para/${s.slug}`}>{s.nome}</Link></td>
                <td className="py-2 pr-3">{s.cnae}</td>
                <td className="py-2 pr-3 text-right">{fmt(s.empresas)}</td>
                <td className="py-2 pr-3 text-right">{s.pessoal ? fmt(s.pessoal) : "—"}</td>
                <td className="py-2 pr-3 text-right">{s.pessoasPorEmpresa ?? "—"}</td>
                <td className="py-2">{s.ufLider ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Os 20 municípios do RS com mais empresas</h2>
      <GraficoBarras titulo={`Municípios do RS com mais empresas (IBGE/CEMPRE ${FONTE_CIDADES.ano})`} linhas={cidades.map((c) => ({ rotulo: c.nome, valor: c.empresas }))} formatar={fmt} />
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[420px]">
          <thead>
            <tr className="text-left text-foreground">
              <th className="py-2 pr-3">Município</th>
              <th className="py-2 pr-3 text-right">Empresas</th>
              <th className="py-2 text-right">Pessoal ocupado</th>
            </tr>
          </thead>
          <tbody>
            {cidades.map((c) => (
              <tr key={c.slug} className="border-t border-white/10">
                <td className="py-2 pr-3"><Link href={`/sites-e-sistemas/${c.slug}`}>{c.nome}</Link></td>
                <td className="py-2 pr-3 text-right">{fmt(c.empresas)}</td>
                <td className="py-2 text-right">{c.pessoal ? fmt(c.pessoal) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Use estes gráficos no seu site</h2>
      <p>Livre para reproduzir, com o crédito que já vem no gráfico (licença CC BY 4.0). Copie o código:</p>
      <pre className="text-xs bg-white/5 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">{embed("empresas-por-setor", 420)}</pre>
      <pre className="text-xs bg-white/5 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">{embed("municipios-rs", 600)}</pre>

      <p className="text-sm">
        Fonte: <a href={FONTE_SETORES.url} rel="noopener">{FONTE_SETORES.nome}</a>, ano de referência {FONTE_SETORES.ano}, carregado em{" "}
        {FONTE_SETORES.carregadoEm.split("-").reverse().join("/")}.
      </p>
      <IscaCard isca={getIsca("custo-da-planilha")!} posicao="fim" />
    </PaginaInstitucional>
  );
}
