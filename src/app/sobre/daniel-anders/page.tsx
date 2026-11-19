import Link from "next/link";
import type { Metadata } from "next";
import { PaginaInstitucional } from "@/components/institucional/PaginaInstitucional";
import { AUTOR, personJsonLd } from "@/data/autor";

export const metadata: Metadata = {
  title: { absolute: "Daniel Anders — desenvolvedor em Passo Fundo | AndersDev" },
  description:
    "Daniel Anders: engenheiro eletricista de formação, mais de 15 anos entre tecnologia e gestão, desenvolve sites, sistemas e apps para PMEs.",
  alternates: { canonical: AUTOR.url },
};

export default function Page() {
  return (
    <PaginaInstitucional
      h1="Daniel Anders"
      rotulo="Autor"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: AUTOR.url,
          mainEntity: personJsonLd(),
        },
      ]}
    >
      <p>
        <strong>{AUTOR.cargo}.</strong> {AUTOR.resumo}
      </p>
      <h2>Formação e trajetória</h2>
      <ul>
        <li>Formação em {AUTOR.formacao}.</li>
        <li>Fundou uma empresa de consultoria empresarial antes de se dedicar ao desenvolvimento de software.</li>
        <li>Mais de {AUTOR.experienciaAnos} anos entre tecnologia e gestão de negócios.</li>
        <li>Base em {AUTOR.cidade}/{AUTOR.uf}, com atendimento presencial na região e remoto para o Brasil.</li>
      </ul>
      <h2>Áreas de atuação</h2>
      <ul>
        {AUTOR.areas.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <h2>O que ele assina neste site</h2>
      <p>
        Daniel é o responsável editorial por todo o conteúdo do site: guias, perguntas, modelos, glossário,
        leis explicadas, comparativos e ferramentas. Como o conteúdo é produzido e revisado está descrito na{" "}
        <Link href="/politica-editorial">política editorial</Link>.
      </p>
      <h2>Contato e perfis</h2>
      <ul>
        {AUTOR.sameAs.map((u) => (
          <li key={u}>
            <a href={u} rel="me noopener">{u.replace("https://", "")}</a>
          </li>
        ))}
        <li>
          <Link href="/sobre">Dados da empresa, endereço e contato</Link>
        </li>
      </ul>
    </PaginaInstitucional>
  );
}
