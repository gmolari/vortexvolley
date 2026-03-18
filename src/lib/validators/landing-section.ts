import { z } from "zod";

const sectionLayouts = ["CAROUSEL", "GRID", "HIGHLIGHT", "BANNER", "TEXT"] as const;

export const createLandingSectionSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
  layout: z.enum(sectionLayouts),
  order: z.number().min(0).default(0),
  visible: z.boolean().default(true),
});

export const updateLandingSectionSchema = createLandingSectionSchema.partial();

export type CreateLandingSectionInput = z.infer<typeof createLandingSectionSchema>;
export type UpdateLandingSectionInput = z.infer<typeof updateLandingSectionSchema>;
