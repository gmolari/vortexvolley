import { z } from "zod";

const orderStatuses = ["PENDING", "CONFIRMED", "CANCELLED"] as const;

export const createOrderSchema = z.object({
  saleItemId: z.string().uuid(),
  customerName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
  values: z.record(z.string(), z.string()),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatuses),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
