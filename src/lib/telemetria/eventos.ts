/**
 * Taxonomia de eventos — padrão objeto_ação, registrada em código.
 *
 * Todo evento leva as propriedades de contexto obrigatórias (page_type,
 * cluster, consulta_alvo, isca_id). O cliente preenche a partir do <main> da
 * página; o servidor recusa nome fora desta lista.
 *
 * Destinos: tabela local `eventos` (sempre, sem PII), GA4 e PostHog (só com
 * consentimento de analytics). A tabela local é a cópia de referência.
 */

export const EVENTOS = {
  pagina_vista: "Página carregada (vai para a tabela pageviews)",
  cta_visto: "CTA de orçamento entrou na tela (tabela cta_events)",
  cta_clicado: "CTA de orçamento clicado (tabela cta_events)",
  isca_vista: "Card ou ferramenta de isca entrou na tela",
  isca_iniciada: "Primeira interação com a isca (campo preenchido, item marcado)",
  isca_concluida: "Resultado parcial exibido na tela",
  lead_capturado: "E-mail enviado pela isca e gravado (registrado também no servidor)",
  cta_produto_clicado: "Clique no CTA do serviço no momento do resultado",
  modelo_baixado: "Download de modelo depois do e-mail",
  orcamento_solicitado: "Formulário de orçamento/contato enviado (equivale a 'cadastro')",
  whatsapp_clicado: "Clique em link do WhatsApp",
  call_clicada: "Clique para agendar call",
  venda_registrada: "Venda marcada no painel (servidor; equivale a 'compra')",
  descadastro_concluido: "Descadastro de e-mail em 1 clique (servidor)",
} as const;

export type NomeEvento = keyof typeof EVENTOS;

export const NOMES_EVENTOS = Object.keys(EVENTOS) as NomeEvento[];

/** Marcar como evento-chave (conversão) no GA4 — Admin > Eventos. */
export const EVENTOS_CHAVE_GA4: NomeEvento[] = [
  "isca_concluida",
  "lead_capturado",
  "orcamento_solicitado",
  "venda_registrada",
];

/** Propriedades obrigatórias em todo evento (vazias viram null, nunca somem). */
export const PROPRIEDADES_OBRIGATORIAS = ["page_type", "cluster", "consulta_alvo", "isca_id"] as const;

export function ehEventoValido(nome: string): nome is NomeEvento {
  return nome in EVENTOS;
}
