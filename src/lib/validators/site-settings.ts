import { z } from "zod";

export const updateSettingsSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export const globalEmailSchema = z.object({
  email: z.string().email("Email inválido"),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type GlobalEmailInput = z.infer<typeof globalEmailSchema>;
