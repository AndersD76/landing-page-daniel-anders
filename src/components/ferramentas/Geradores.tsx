"use client";

import { useRef, useState } from "react";
import { CapturaEmail } from "@/components/iscas/CapturaEmail";
import { rastrear } from "@/lib/telemetria/cliente";
import { CtaResultado } from "./FerramentaLayout";
import { campoCls } from "./useIsca";

/* ------------------------------------------------------ briefing de site */

const PERGUNTAS_BRIEFING = [
  { id: "empresa", rotulo: "Empresa e o que ela faz", dica: "Ex.: distribuidora de autopeças em Passo Fundo, 25 funcionários" },
  { id: "objetivo", rotulo: "Objetivo principal do site", dica: "Ex.: receber pedidos de orçamento pelo WhatsApp" },
  { id: "publico", rotulo: "Quem é o cliente que deve chegar pelo site", dica: "Ex.: oficinas da região, compradores de frota" },
  { id: "paginas", rotulo: "Páginas que você imagina", dica: "Ex.: início, sobre, linhas de produto, contato" },
  { id: "funcoes", rotulo: "Funções além de páginas", dica: "Ex.: catálogo com busca, área do cliente, pagamento, blog" },
  { id: "conteudo", rotulo: "Quem fornece textos e fotos", dica: "Ex.: textos prontos; fotos precisam ser feitas" },
  { id: "referencias", rotulo: "Sites de referência (e o que gosta neles)", dica: "Cole 2 ou 3 endereços" },
  { id: "integracoes", rotulo: "Sistemas que o site precisa conversar", dica: "Ex.: ERP, CRM, planilha de estoque" },
  { id: "prazo", rotulo: "Prazo desejado e por quê", dica: "Ex.: até março, para a feira do setor" },
  { id: "orcamento", rotulo: "Faixa de investimento prevista", dica: "Ajuda a propor o escopo que cabe — pode deixar em branco" },
] as const;

export function GeradorBriefing() {
  const [r, setR] = useState<Record<string, string>>({});
  const [pronto, setPronto] = useState(false);
  const iniciou = useRef(false);

  const preenchidas = PERGUNTAS_BRIEFING.filter((p) => (r[p.id] ?? "").trim().length >= 3);
  const completude = Math.round((preenchidas.length / PERGUNTAS_BRIEFING.length) * 100);
  const faltando = PERGUNTAS_BRIEFING.filter((p) => !preenchidas.includes(p));

  const relatorio = {
    titulo: "Briefing do site",
    resumo: `Briefing ${completude}% completo. Envie este texto igual para cada fornecedor: propostas sobre o mesmo escopo são comparáveis.`,
    destaques: [{ rotulo: "Completude", valor: `${completude}%` }],
    secoes: [
      { titulo: "Respostas", itens: PERGUNTAS_BRIEFING.map((p) => `${p.rotulo}: ${(r[p.id] ?? "").trim() || "(a definir)"}`) },
      ...(faltando.length ? [{ titulo: "Defina antes de pedir orçamento", itens: faltando.map((p) => p.rotulo) }] : []),
      {
        titulo: "Peça em toda proposta",
        itens: [
          "Escopo por página e por função, com o que NÃO está incluído",
          "Prazo por etapa e o que depende de você",
          "Quem fica com domínio, hospedagem e código-fonte",
          "Custo mensal depois da entrega (hospedagem, manutenção, licenças)",
          "Como funcionam ajustes e mudanças de escopo",
        ],
      },
    ],
  };

  return (
    <div>
      <div className="space-y-4">
        {PERGUNTAS_BRIEFING.map((p) => (
          <label key={p.id} className="block">
            <span className="block text-sm font-bold text-foreground mb-1">{p.rotulo}</span>
            <textarea
              className={`${campoCls} min-h-[64px]`}
              placeholder={p.dica}
              value={r[p.id] ?? ""}
              onChange={(ev) => {
                if (!iniciou.current) {
                  iniciou.current = true;
                  rastrear("isca_iniciada", { isca_id: "gerador-briefing-site" });
                }
                setR((a) => ({ ...a, [p.id]: ev.target.value }));
              }}
            />
          </label>
        ))}
      </div>
      <button
        className="mt-6 text-sm font-bold text-white bg-brand px-6 py-3 rounded-lg"
        onClick={() => {
          setPronto(true);
          rastrear("isca_concluida", { isca_id: "gerador-briefing-site", completude });
        }}
      >
        Montar o briefing
      </button>
      {pronto && (
        <div className="mt-8 space-y-4" aria-live="polite">
          <div className="glass-card">
            <p className="text-xs font-bold tracking-[3px] text-gray uppercase">Briefing</p>
            <p className="font-heading text-4xl font-bold text-foreground my-2">{completude}% completo</p>
            <p className="text-gray">
              {faltando.length
                ? `Faltam: ${faltando.slice(0, 3).map((f) => f.rotulo.toLowerCase()).join("; ")}${faltando.length > 3 ? "…" : ""}.`
                : "Tudo respondido — pronto para enviar a fornecedores."}
            </p>
          </div>
          <CapturaEmail iscaId="gerador-briefing-site" relatorio={relatorio} entrada={r} titulo="Receba o briefing formatado, pronto para enviar a fornecedores" />
          <CtaResultado iscaId="gerador-briefing-site" href="/calculadora-site" texto="Com o briefing em mãos, veja a faixa de preço do seu site." />
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------- escopo de MVP */

type Importancia = "essencial" | "importante" | "desejavel";
type Esforco = "P" | "M" | "G";
const PONTOS: Record<Esforco, number> = { P: 1, M: 3, G: 8 };

interface Funcao {
  nome: string;
  importancia: Importancia;
  esforco: Esforco;
}

export function PriorizadorMvp() {
  const [funcoes, setFuncoes] = useState<Funcao[]>([
    { nome: "Cadastro e login", importancia: "essencial", esforco: "M" },
    { nome: "", importancia: "essencial", esforco: "M" },
    { nome: "", importancia: "importante", esforco: "M" },
  ]);
  const [pronto, setPronto] = useState(false);
  const iniciou = useRef(false);

  function mudar(i: number, f: Partial<Funcao>) {
    if (!iniciou.current) {
      iniciou.current = true;
      rastrear("isca_iniciada", { isca_id: "escopo-mvp" });
    }
    setFuncoes((a) => a.map((x, j) => (j === i ? { ...x, ...f } : x)));
  }

  const validas = funcoes.filter((f) => f.nome.trim());
  const total = validas.reduce((s, f) => s + PONTOS[f.esforco], 0);
  const mvp = validas.filter((f) => f.importancia === "essencial");
  const pontosMvp = mvp.reduce((s, f) => s + PONTOS[f.esforco], 0);
  const fatia = total ? Math.round((pontosMvp / total) * 100) : 0;
  const grandesEssenciais = mvp.filter((f) => f.esforco === "G");

  const relatorio = {
    titulo: "Escopo priorizado do MVP",
    resumo: `${mvp.length} de ${validas.length} funções entram na primeira versão — ${fatia}% do esforço total estimado.`,
    destaques: [
      { rotulo: "Funções no MVP", valor: String(mvp.length) },
      { rotulo: "Esforço do MVP / total", valor: `${pontosMvp} de ${total} pontos (${fatia}%)` },
    ],
    secoes: [
      { titulo: "Primeira versão (essenciais)", itens: mvp.map((f) => `${f.nome} — esforço ${f.esforco}`) },
      { titulo: "Segunda versão (importantes)", itens: validas.filter((f) => f.importancia === "importante").map((f) => `${f.nome} — esforço ${f.esforco}`) },
      { titulo: "Depois de validar (desejáveis)", itens: validas.filter((f) => f.importancia === "desejavel").map((f) => `${f.nome} — esforço ${f.esforco}`) },
      {
        titulo: "Pontos de atenção",
        itens: [
          ...(fatia > 60 ? ["O MVP concentra mais de 60% do esforço: rebaixe para 'importante' o que não impede o primeiro cliente de usar."] : []),
          ...grandesEssenciais.map((f) => `"${f.nome}" é essencial e grande: existe versão manual ou mais simples para começar?`),
          "Pontos de esforço são relativos (P=1, M=3, G=8) e servem para comparar funções entre si, não para estimar prazo.",
        ],
      },
    ].filter((s) => s.itens.length),
  };

  return (
    <div>
      <div className="space-y-3">
        {funcoes.map((f, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_150px_110px] gap-2">
            <input className={campoCls} placeholder={`Função ${i + 1} (ex.: agenda de horários)`} value={f.nome} onChange={(e) => mudar(i, { nome: e.target.value })} />
            <select className={campoCls} value={f.importancia} onChange={(e) => mudar(i, { importancia: e.target.value as Importancia })} aria-label="Importância">
              <option value="essencial">Essencial</option>
              <option value="importante">Importante</option>
              <option value="desejavel">Desejável</option>
            </select>
            <select className={campoCls} value={f.esforco} onChange={(e) => mudar(i, { esforco: e.target.value as Esforco })} aria-label="Esforço">
              <option value="P">Esforço P</option>
              <option value="M">Esforço M</option>
              <option value="G">Esforço G</option>
            </select>
          </div>
        ))}
      </div>
      {funcoes.length < 20 && (
        <button className="mt-3 text-sm text-brand underline" onClick={() => setFuncoes((a) => [...a, { nome: "", importancia: "importante", esforco: "M" }])}>
          + adicionar função
        </button>
      )}
      <div>
        <button
          className="mt-6 text-sm font-bold text-white bg-brand px-6 py-3 rounded-lg"
          onClick={() => {
            setPronto(true);
            rastrear("isca_concluida", { isca_id: "escopo-mvp", funcoes: validas.length });
          }}
        >
          Priorizar
        </button>
      </div>
      {pronto && validas.length > 0 && (
        <div className="mt-8 space-y-4" aria-live="polite">
          <div className="glass-card">
            <p className="text-xs font-bold tracking-[3px] text-gray uppercase">Primeira versão</p>
            <p className="font-heading text-4xl font-bold text-foreground my-2">{mvp.length} funções · {fatia}% do esforço</p>
            <p className="text-gray">{mvp.map((f) => f.nome).join(", ") || "Nenhuma função marcada como essencial."}</p>
          </div>
          <CapturaEmail iscaId="escopo-mvp" relatorio={relatorio} entrada={{ funcoes: validas }} titulo="Receba o escopo priorizado em 3 versões, com os pontos de atenção" />
          <CtaResultado iscaId="escopo-mvp" href="/calculadora-app" texto="Com o MVP definido, veja a faixa de preço da primeira versão." />
        </div>
      )}
    </div>
  );
}
