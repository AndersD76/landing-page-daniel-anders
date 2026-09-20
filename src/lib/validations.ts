import { z } from "zod";

/**
 * Campos de atribuição e qualificação.
 *
 * TODOS opcionais de propósito. O servidor nunca exige um campo que alguma
 * tela não pede — foi assim que 100% dos leads da isca principal do Redutto
 * foram recusados em silêncio. Quem valida obrigatoriedade é o formulário.
 */
const attributionFields = {
  source: z.string().max(100).optional(),
  utmSource: z.string().max(255).optional(),
  utmMedium: z.string().max(255).optional(),
  utmCampaign: z.string().max(255).optional(),
  landingPage: z.string().max(500).optional(),
  formPage: z.string().max(500).optional(),
};

const qualificationFields = {
  role: z.string().max(100).optional(),
  scope: z.string().max(100).optional(),
  deadline: z.enum(["agora", "90-dias", "avaliando"]).optional(),
};

export const leadFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(255),
  email: z.string().email("Email inválido").max(255),
  phone: z.string().max(30).optional(),
  company: z.string().max(255).optional(),
  message: z.string().max(5000).optional(),
  ...attributionFields,
  ...qualificationFields,
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export const leadMagnetSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(255),
  email: z.string().email("Email inválido").max(255),
  ...attributionFields,
  ...qualificationFields,
  honeypot: z.string().max(0, "Bot detected").optional(),
});

/**
 * Sugestão de correção para erro de digitação óbvio no domínio.
 * Retorna null quando não há sugestão confiável.
 *
 * Nota: o `.email()` do Zod 3.23 já rejeita domínio sem TLD ("fulano@gmail"),
 * então aqui tratamos só o caso do domínio escrito errado.
 */
const DOMINIOS_COMUNS: Record<string, string> = {
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "hotmail.co": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "outlook.co": "outlook.com",
  "outlok.com": "outlook.com",
  "yahoo.co": "yahoo.com",
  "uol.com": "uol.com.br",
  "bol.com": "bol.com.br",
  "terra.com": "terra.com.br",
};

export function suggestEmailFix(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 0) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase().trim();
  const fixed = DOMINIOS_COMUNS[domain];
  return fixed ? `${local}@${fixed}` : null;
}

export type LeadFormData = z.infer<typeof leadFormSchema>;
export type LeadMagnetFormData = z.infer<typeof leadMagnetSchema>;
