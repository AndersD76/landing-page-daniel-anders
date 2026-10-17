"use client";

import { useMemo, useState } from "react";
import { trackEvent } from "@/components/analytics/Analytics";
import { formatBRL } from "@/lib/calculadora";

/**
 * Calculadora de ponto de virada.
 *
 * Nenhum preço de concorrente é publicado: quem informa a mensalidade é o
 * visitante. Assim o número que aparece é sempre verdadeiro, porque metade
 * dele vem de quem está lendo — e não envelhece quando a plataforma muda de
 * tabela.
 *
 * O resultado aparece na tela sem pedir nada. Pedir e-mail antes de mostrar o
 * número mata a conversão e destrói a confiança no número.
 */

interface PontoDeViradaProps {
  nomePlataforma: string;
  label: string;
  projetoMin: number;
  projetoMax: number;
  source: string;
}

const HORIZONTES = [12, 24, 36, 48];

export function PontoDeVirada({
  nomePlataforma,
  label,
  projetoMin,
  projetoMax,
  source,
}: PontoDeViradaProps) {
  const [mensal, setMensal] = useState("");
  const [jaMediu, setJaMediu] = useState(false);

  const valor = Number(String(mensal).replace(/[^\d]/g, ""));
  const valido = Number.isFinite(valor) && valor > 0;

  const resultado = useMemo(() => {
    if (!valido) return null;
    return {
      mesesMin: Math.ceil(projetoMin / valor),
      mesesMax: Math.ceil(projetoMax / valor),
      horizontes: HORIZONTES.map((meses) => {
        const acumulado = valor * meses;
        return {
          meses,
          acumulado,
          // positivo = o projeto próprio sai mais barato nesse horizonte
          economiaMin: acumulado - projetoMax,
          economiaMax: acumulado - projetoMin,
        };
      }),
    };
  }, [valido, valor, projetoMin, projetoMax]);

  function aoMudar(v: string) {
    setMensal(v);
    const n = Number(v.replace(/[^\d]/g, ""));
    if (n > 0 && !jaMediu) {
      setJaMediu(true);
      trackEvent("ponto_de_virada_calculado", { source, plataforma: nomePlataforma });
    }
  }

  return (
    <div className="glass-card">
      <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2">
        Em quantos meses a conta vira?
      </h2>
      <p className="text-sm text-gray mb-6">
        Eu não publico o preço do {nomePlataforma} aqui — ele muda sem aviso e
        varia por plano, e eu estaria chutando. Informe o que{" "}
        <strong className="text-foreground">você</strong> paga e a conta sai com
        o seu número contra a faixa real de um projeto próprio.
      </p>

      <label className="block mb-6">
        <span className="text-sm text-foreground block mb-2">{label}</span>
        <div className="flex items-center gap-2 max-w-[260px]">
          <span className="text-gray text-sm">R$</span>
          <input
            type="text"
            inputMode="numeric"
            value={mensal}
            onChange={(e) => aoMudar(e.target.value)}
            placeholder="0"
            aria-label={label}
            className="flex-1 px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground placeholder:text-gray focus:border-brand/30 focus:outline-none transition-colors text-sm tabular-nums"
          />
          <span className="text-gray text-sm whitespace-nowrap">/mês</span>
        </div>
      </label>

      {!resultado && (
        <p className="text-sm text-gray">
          Um projeto próprio equivalente fica entre{" "}
          <strong className="text-foreground">{formatBRL(projetoMin)}</strong> e{" "}
          <strong className="text-foreground">{formatBRL(projetoMax)}</strong>,
          pago uma vez.
        </p>
      )}

      {resultado && (
        <div>
          <div className="border border-brand/25 bg-brand/[0.06] rounded-xl p-5 mb-6">
            <p className="text-sm text-gray mb-1">Ponto de virada</p>
            <p className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              {resultado.mesesMin === resultado.mesesMax
                ? `${resultado.mesesMin} meses`
                : `${resultado.mesesMin} a ${resultado.mesesMax} meses`}
            </p>
            <p className="text-sm text-gray mt-2">
              É quanto tempo de {nomePlataforma} custa o mesmo que construir o
              seu, considerando a faixa de {formatBRL(projetoMin)} a{" "}
              {formatBRL(projetoMax)}. Depois disso, cada mês é diferença
              líquida.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-white/[0.08] rounded-xl overflow-hidden">
              <caption className="sr-only">
                Custo acumulado e diferença por horizonte de tempo
              </caption>
              <thead>
                <tr className="bg-white/[0.04] text-left">
                  <th className="px-4 py-3 font-bold text-foreground">Em</th>
                  <th className="px-4 py-3 font-bold text-foreground text-right">
                    Você terá pago
                  </th>
                  <th className="px-4 py-3 font-bold text-foreground text-right">
                    Diferença
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray">
                {resultado.horizontes.map((h) => {
                  const positivo = h.economiaMin > 0;
                  return (
                    <tr key={h.meses} className="border-t border-white/[0.06]">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {h.meses} meses
                      </td>
                      <td className="px-4 py-3 text-right text-foreground whitespace-nowrap tabular-nums">
                        {formatBRL(h.acumulado)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right whitespace-nowrap tabular-nums ${
                          positivo ? "text-brand font-bold" : "text-gray"
                        }`}
                      >
                        {positivo
                          ? `+ ${formatBRL(h.economiaMin)} a ${formatBRL(h.economiaMax)}`
                          : "ainda não virou"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray mt-4">
            A coluna de diferença compara o acumulado contra a faixa do projeto
            próprio, do teto ao piso. Não inclui hospedagem e domínio do site
            próprio, que ficam entre R$ 0 e cerca de R$ 100 por mês e vão para
            contas suas — nem o custo de manutenção evolutiva, que depende de
            quanto o sistema muda depois de pronto.
          </p>
        </div>
      )}
    </div>
  );
}
