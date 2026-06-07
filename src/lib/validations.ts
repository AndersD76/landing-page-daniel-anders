import { z } from "zod";

export const leadFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(255),
  email: z.string().email("Email inválido").max(255),
  phone: z.string().max(30).optional(),
  company: z.string().max(255).optional(),
  message: z.string().max(5000).optional(),
  source: z.string().max(100).optional(),
  utmSource: z.string().max(255).optional(),
  utmMedium: z.string().max(255).optional(),
  utmCampaign: z.string().max(255).optional(),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export const leadMagnetSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(255),
  email: z.string().email("Email inválido").max(255),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
export type LeadMagnetFormData = z.infer<typeof leadMagnetSchema>;
