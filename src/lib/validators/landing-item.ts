import { z } from "zod";

export const createLandingItemSchema = z.object({
  sectionId: z.string().uuid(),
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  imageUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  linkUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  saleItemId: z.string().uuid().optional().or(z.literal("")),
  order: z.number().min(0).default(0),
  visible: z.boolean().default(true),
});

export const updateLandingItemSchema = createLandingItemSchema.partial();

export type CreateLandingItemInput = z.infer<typeof createLandingItemSchema>;
export type UpdateLandingItemInput = z.infer<typeof updateLandingItemSchema>;
