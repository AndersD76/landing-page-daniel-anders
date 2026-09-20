/**
 * Teste de contrato dos formulários.
 *
 * Cada caso envia EXATAMENTE o payload que a tela monta — copiado do
 * componente, não um payload ideal. Se o servidor recusar, o teste falha.
 *
 * Existe por causa de um erro real: uma API exigia `name` enquanto a
 * calculadora só pedia e-mail. 100% dos leads da isca principal eram
 * recusados, e o pop-up de saída escondia o erro e agradecia.
 *
 * Rodar: npm run test:contrato
 */

import { leadFormSchema, leadMagnetSchema, suggestEmailFix } from "../src/lib/validations";

interface Caso {
  nome: string;
  schema: typeof leadFormSchema | typeof leadMagnetSchema;
  payload: Record<string, unknown>;
  deveAceitar: boolean;
}

/* Payloads copiados dos componentes. Ao mudar um formulário, mude aqui. */

// src/components/calculadora/CalculadoraWizard.tsx — handleLeadSubmit
const calculadora = {
  name: "Ana Souza",
  email: "ana@empresa.com.br",
  honeypot: undefined,
};

// src/components/custos/CtaContextual.tsx — handleSubmit
const ctaContextual = {
  name: "Carlos Lima",
  email: "carlos@empresa.com.br",
  phone: "54999999999",
  role: "Dono / sócio",
  scope: "ecommerce/com-pagamento-online",
  deadline: "agora",
  message: "Página: E-commerce com pagamento online | Faixa exibida: R$ 1 a R$ 2",
  source: "quanto-custa:ecommerce/com-pagamento-online",
  honeypot: undefined,
  landingPage: "/quanto-custa/ecommerce?utm_source=google",
  formPage: "/quanto-custa/ecommerce/com-pagamento-online",
  utmSource: "google",
  utmMedium: "organic",
  utmCampaign: undefined,
};

// src/components/forms/ContactForm.tsx — handleSubmit
const contato = {
  name: "Joana Reis",
  email: "joana@empresa.com.br",
  message: "Quero um orçamento",
  honeypot: undefined,
  source: "contact-form",
};

// CTA contextual sem os campos opcionais (usuário não preencheu WhatsApp)
const ctaMinimo = {
  name: "Rita Alves",
  email: "rita@empresa.com.br",
  phone: undefined,
  role: "Marketing",
  scope: "mvp-saas",
  deadline: "avaliando",
  message: "Página: MVP SaaS | Faixa exibida: R$ 1 a R$ 2",
  source: "quanto-custa:mvp-saas",
  honeypot: undefined,
  landingPage: "/quanto-custa/mvp-saas",
  formPage: "/quanto-custa/mvp-saas",
};

const casos: Caso[] = [
  { nome: "Calculadora (site/app) -> /api/lead", schema: leadFormSchema, payload: calculadora, deveAceitar: true },
  { nome: "Calculadora -> leadMagnetSchema (validação client)", schema: leadMagnetSchema, payload: calculadora, deveAceitar: true },
  { nome: "CTA contextual completo -> /api/lead", schema: leadFormSchema, payload: ctaContextual, deveAceitar: true },
  { nome: "CTA contextual sem opcionais -> /api/lead", schema: leadFormSchema, payload: ctaMinimo, deveAceitar: true },
  { nome: "Formulário de contato -> /api/lead", schema: leadFormSchema, payload: contato, deveAceitar: true },

  // Regressões que já custaram lead.
  { nome: "REGRESSÃO: e-mail sem domínio completo é recusado", schema: leadFormSchema, payload: { ...contato, email: "fulano@gmail" }, deveAceitar: false },
  { nome: "REGRESSÃO: e-mail sem TLD é recusado", schema: leadFormSchema, payload: { ...contato, email: "teste@teste" }, deveAceitar: false },
  { nome: "REGRESSÃO: prazo fora do enum é recusado", schema: leadFormSchema, payload: { ...ctaContextual, deadline: "semana-que-vem" }, deveAceitar: false },
  { nome: "REGRESSÃO: honeypot preenchido é recusado", schema: leadFormSchema, payload: { ...contato, honeypot: "bot" }, deveAceitar: false },
];

let falhas = 0;

console.log("\nContrato tela -> servidor\n" + "-".repeat(60));

for (const caso of casos) {
  const r = caso.schema.safeParse(caso.payload);
  const ok = r.success === caso.deveAceitar;
  if (!ok) falhas++;
  const motivo =
    !r.success && caso.deveAceitar
      ? ` -> servidor recusou: ${r.error.issues[0].path.join(".")}: ${r.error.issues[0].message}`
      : r.success && !caso.deveAceitar
        ? " -> servidor aceitou o que deveria recusar"
        : "";
  console.log(`${ok ? "PASSA " : "FALHA "} ${caso.nome}${motivo}`);
}

/* Sugestão de correção de e-mail (o "fulano@gmail" que nunca recebia nada). */
console.log("\nSugestão de correção de domínio\n" + "-".repeat(60));
const sugestoes: Array<[string, string | null]> = [
  ["ana@gmail.co", "ana@gmail.com"],
  ["joao@hotmail.con", "joao@hotmail.com"],
  ["rita@uol.com", "rita@uol.com.br"],
  ["valido@empresa.com.br", null],
];
for (const [entrada, esperado] of sugestoes) {
  const obtido = suggestEmailFix(entrada);
  const ok = obtido === esperado;
  if (!ok) falhas++;
  console.log(
    `${ok ? "PASSA " : "FALHA "} ${entrada} -> ${obtido ?? "sem sugestão"}${ok ? "" : ` (esperado ${esperado ?? "sem sugestão"})`}`
  );
}

console.log("-".repeat(60));
if (falhas > 0) {
  console.error(`\n${falhas} falha(s) de contrato.\n`);
  process.exit(1);
}
console.log("\nTodos os contratos conferem.\n");
