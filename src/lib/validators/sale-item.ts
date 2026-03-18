import { z } from "zod";

export const createSaleItemSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  price: z.number().positive("Preço deve ser positivo"),
  estimatedDelivery: z.string().optional(),
  notificationEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  active: z.boolean().default(true),
});

export const updateSaleItemSchema = createSaleItemSchema.partial();

export type CreateSaleItemInput = z.infer<typeof createSaleItemSchema>;
export type UpdateSaleItemInput = z.infer<typeof updateSaleItemSchema>;
