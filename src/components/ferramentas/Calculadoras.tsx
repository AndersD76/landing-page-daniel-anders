"use client";

import { useState } from "react";
import { CapturaEmail } from "@/components/iscas/CapturaEmail";
import { CtaResultado } from "./FerramentaLayout";
import { brl, Campo, useEstadoNaUrl } from "./useIsca";

/**
 * Faixas da tabela pública (src/lib/calculadora.ts), passadas pela página
 * servidora — a ferramenta nunca digita preço.
 */
export interface Faixa {
  rotulo: string;
  min: number;
  max: number;
  href: string;
}

/* ------------------------------------------------ custo da planilha (ROI) */

export function CustoDaPlanilha({ faixa }: { faixa: Faixa }) {
  const { estado: e, alterar, concluir } = useEstadoNaUrl("custo-da-planilha", {
    pessoas: 3,
    horasSemana: 6,
    custoMensal: 4500,
    horasMes: 220,
    retrabalho: 10,
    reducao: 60,
  });
  const [mostrar, setMostrar] = useState(false);

  const custoHora = e.horasMes > 0 ? e.custoMensal / e.horasMes : 0;
  const horasMes = e.pessoas * e.horasSemana * (52 / 12) * (1 + e.retrabalho / 100);
  const custoMes = horasMes * custoHora;
  const custoAno = custoMes * 12;
  const economiaMes = custoMes * (e.reducao / 100);
  const paybackMin = economiaMes > 0 ? faixa.min / economiaMes : Infinity;
  const paybackMax = economiaMes > 0 ? faixa.max / economiaMes : Infinity;
  const meses = (n: number) => (Number.isFinite(n) ? `${Math.ceil(n)} meses` : "não se paga com estes números");

  const relatorio = {
    titulo: "Quanto o processo manual custa",
    resumo: `${Math.round(horasMes)} horas por mês em trabalho manual, ${brl(custoAno)} por ano. Com ${e.reducao}% de redução, um ${faixa.rotulo.toLowerCase()} (${brl(faixa.min)} a ${brl(faixa.max)}) se paga em ${meses(paybackMin)} a ${meses(paybackMax)}.`,
    destaques: [
      { rotulo: "Horas manuais por mês (com retrabalho)", valor: `${Math.round(horasMes)} h` },
      { rotulo: "Custo por hora", valor: brl(custoHora) },
      { rotulo: "Custo por mês", valor: brl(custoMes) },
      { rotulo: "Custo por ano", valor: brl(custoAno) },
      { rotulo: `Economia mensal com ${e.reducao}% de redução`, valor: brl(economiaMes) },
      { rotulo: "Retorno do investimento", valor: `${meses(paybackMin)} a ${meses(paybackMax)}` },
    ],
    secoes: [
      {
        titulo: "Projeção de 12 meses (economia acumulada − investimento)",
        itens: [3, 6, 9, 12].map(
          (m) => `Mês ${m}: economia de ${brl(economiaMes * m)}; saldo de ${brl(economiaMes * m - faixa.max)} no teto da faixa e ${brl(economiaMes * m - faixa.min)} no piso.`
        ),
      },
      {
        titulo: "Premissas que você informou",
        itens: [
          `${e.pessoas} pessoa(s), ${e.horasSemana} h por semana cada em tarefas manuais`,
          `Custo mensal por pessoa (salário + encargos): ${brl(e.custoMensal)}, sobre ${e.horasMes} h/mês`,
          `Retrabalho/correção de erros: +${e.retrabalho}% de tempo`,
          `Redução esperada com sistema: ${e.reducao}% (ajuste conforme o processo)`,
          `Faixa do investimento: tabela pública de preços da AndersDev (${faixa.rotulo})`,
        ],
      },
    ],
  };

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Campo rotulo="Pessoas envolvidas no processo manual" valor={e.pessoas} onChange={(v) => alterar("pessoas", v)} />
        <Campo rotulo="Horas por semana, por pessoa" ajuda="Digitação, conferência, copiar de um lugar para outro, procurar informação" valor={e.horasSemana} onChange={(v) => alterar("horasSemana", v)} sufixo="h" />
        <Campo rotulo="Custo mensal de cada pessoa" ajuda="Salário + encargos e benefícios" valor={e.custoMensal} onChange={(v) => alterar("custoMensal", v)} passo={100} sufixo="R$" />
        <Campo rotulo="Horas trabalhadas por mês" ajuda="220 é o usual para 44 h semanais; ajuste à sua jornada" valor={e.horasMes} onChange={(v) => alterar("horasMes", v)} sufixo="h" />
        <Campo rotulo="Retrabalho e correção de erros" valor={e.retrabalho} onChange={(v) => alterar("retrabalho", v)} max={200} sufixo="%" />
        <Campo rotulo="Quanto um sistema reduziria esse tempo" ajuda="Premissa sua. 100% é raro; comece conservador" valor={e.reducao} onChange={(v) => alterar("reducao", v)} max={100} sufixo="%" />
      </div>
      <button
        className="mt-6 text-sm font-bold text-white bg-brand px-6 py-3 rounded-lg"
        onClick={() => {
          setMostrar(true);
          concluir({ custo_ano: Math.round(custoAno) });
        }}
      >
        Calcular
      </button>

      {mostrar && (
        <div className="mt-8 space-y-4" aria-live="polite">
          <div className="glass-card">
            <p className="text-xs font-bold tracking-[3px] text-gray uppercase">O processo manual custa</p>
            <p className="font-heading text-4xl md:text-5xl font-bold text-foreground my-2">{brl(custoAno)} <span className="text-xl text-gray">por ano</span></p>
            <p className="text-gray">
              {Math.round(horasMes)} horas por mês. Com {e.reducao}% de redução, um {faixa.rotulo.toLowerCase()} na faixa de {brl(faixa.min)} a {brl(faixa.max)} se paga em{" "}
              <strong className="text-foreground">{meses(paybackMin)} a {meses(paybackMax)}</strong>.
            </p>
          </div>
          <CapturaEmail iscaId="custo-da-planilha" relatorio={relatorio} entrada={e} titulo="Receba a projeção de 12 meses e as premissas por e-mail" />
          <CtaResultado iscaId="custo-da-planilha" href={faixa.href} texto="Quer saber o escopo e o preço do sistema que tira esse processo da planilha?" />
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------- taxa de marketplace */

export function TaxaMarketplace({ faixa }: { faixa: Faixa }) {
  const { estado: e, alterar, concluir } = useEstadoNaUrl("taxa-marketplace", {
    pedidos: 400,
    ticket: 80,
    comissao: 20,
    migracao: 30,
    custoProprio: 3,
    mensalidade: 300,
  });
  const [mostrar, setMostrar] = useState(false);

  const faturamento = e.pedidos * e.ticket;
  const comissaoMes = faturamento * (e.comissao / 100);
  const migrado = faturamento * (e.migracao / 100);
  const economiaMes = migrado * ((e.comissao - e.custoProprio) / 100) - e.mensalidade;
  const virada = (inv: number) => (economiaMes > 0 ? `${Math.ceil(inv / economiaMes)} meses` : "não se paga com estes números");

  const relatorio = {
    titulo: "Comissão de marketplace × canal próprio",
    resumo: `Você paga ${brl(comissaoMes * 12)} por ano em comissão. Levando ${e.migracao}% dos pedidos para um canal próprio, a economia é de ${brl(economiaMes)} por mês e o investimento (${brl(faixa.min)} a ${brl(faixa.max)}) volta em ${virada(faixa.min)} a ${virada(faixa.max)}.`,
    destaques: [
      { rotulo: "Faturamento mensal no marketplace", valor: brl(faturamento) },
      { rotulo: "Comissão por mês", valor: brl(comissaoMes) },
      { rotulo: "Comissão por ano", valor: brl(comissaoMes * 12) },
      { rotulo: "Economia mensal com a migração", valor: brl(economiaMes) },
      { rotulo: "Ponto de virada", valor: `${virada(faixa.min)} a ${virada(faixa.max)}` },
    ],
    secoes: [
      {
        titulo: "Premissas",
        itens: [
          `${e.pedidos} pedidos/mês, ticket médio de ${brl(e.ticket)}`,
          `Comissão informada: ${e.comissao}% (use a do seu contrato)`,
          `Pedidos que migrariam para o canal próprio: ${e.migracao}%`,
          `Custo do canal próprio sobre a venda (meio de pagamento etc.): ${e.custoProprio}%`,
          `Custo fixo mensal do canal próprio (hospedagem, manutenção): ${brl(e.mensalidade)}`,
          `Investimento: tabela pública de preços da AndersDev (${faixa.rotulo})`,
        ],
      },
      {
        titulo: "Antes de decidir",
        itens: [
          "O marketplace traz cliente novo; o canal próprio funciona melhor para quem já comprou de você.",
          "Comece migrando os recorrentes: cupom no pacote, cartão de fidelidade, QR code na embalagem.",
          "Reavalie a conta com os números reais depois de 3 meses.",
        ],
      },
    ],
  };

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Campo rotulo="Pedidos por mês no marketplace" valor={e.pedidos} onChange={(v) => alterar("pedidos", v)} />
        <Campo rotulo="Ticket médio" valor={e.ticket} onChange={(v) => alterar("ticket", v)} sufixo="R$" />
        <Campo rotulo="Comissão que você paga" ajuda="A do seu contrato, somando taxas de pagamento cobradas pela plataforma" valor={e.comissao} onChange={(v) => alterar("comissao", v)} max={60} passo={0.5} sufixo="%" />
        <Campo rotulo="Pedidos que iriam para o canal próprio" ajuda="Premissa: comece com os clientes recorrentes" valor={e.migracao} onChange={(v) => alterar("migracao", v)} max={100} sufixo="%" />
        <Campo rotulo="Custo variável do canal próprio" ajuda="Taxa do meio de pagamento que você usaria" valor={e.custoProprio} onChange={(v) => alterar("custoProprio", v)} max={20} passo={0.1} sufixo="%" />
        <Campo rotulo="Custo fixo mensal do canal próprio" ajuda="Hospedagem, manutenção, ferramentas" valor={e.mensalidade} onChange={(v) => alterar("mensalidade", v)} passo={50} sufixo="R$" />
      </div>
      <button
        className="mt-6 text-sm font-bold text-white bg-brand px-6 py-3 rounded-lg"
        onClick={() => {
          setMostrar(true);
          concluir({ comissao_ano: Math.round(comissaoMes * 12) });
        }}
      >
        Simular
      </button>
      {mostrar && (
        <div className="mt-8 space-y-4" aria-live="polite">
          <div className="glass-card">
            <p className="text-xs font-bold tracking-[3px] text-gray uppercase">Comissão paga por ano</p>
            <p className="font-heading text-4xl md:text-5xl font-bold text-foreground my-2">{brl(comissaoMes * 12)}</p>
            <p className="text-gray">
              Levando {e.migracao}% dos pedidos para o canal próprio, você economiza <strong className="text-foreground">{brl(economiaMes)} por mês</strong>. Um canal próprio ({faixa.rotulo.toLowerCase()}, {brl(faixa.min)} a {brl(faixa.max)}) se paga em{" "}
              <strong className="text-foreground">{virada(faixa.min)} a {virada(faixa.max)}</strong>.
            </p>
          </div>
          <CapturaEmail iscaId="taxa-marketplace" relatorio={relatorio} entrada={e} titulo="Receba a simulação completa por e-mail" />
          <CtaResultado iscaId="taxa-marketplace" href={faixa.href} texto="Quer ver o escopo de um canal próprio que caiba nessa conta?" />
        </div>
      )}
    </div>
  );
}
