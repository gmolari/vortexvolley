import { z } from "zod";

const fieldTypes = [
  "TEXT",
  "NUMBER",
  "SELECT",
  "CHECKBOX",
  "TEXTAREA",
  "EMAIL",
  "PHONE",
  "SIZE",
] as const;

const optionSchema = z.object({
  label: z.string().min(1, "Label obrigatória"),
  value: z.string().min(1, "Valor obrigatório"),
});

export const createFieldSchema = z
  .object({
    saleItemId: z.string().uuid(),
    label: z.string().min(1, "Label obrigatória"),
    type: z.enum(fieldTypes),
    required: z.boolean().default(false),
    placeholder: z.string().optional(),
    order: z.number().min(0).default(0),
    options: z.array(optionSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "SELECT" || data.type === "SIZE") {
        return data.options && data.options.length > 0;
      }
      return true;
    },
    { message: "Campos do tipo SELECT e SIZE precisam de opções", path: ["options"] }
  );

export const updateFieldSchema = z.object({
  label: z.string().min(1).optional(),
  type: z.enum(fieldTypes).optional(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  order: z.number().min(0).optional(),
});

export type CreateFieldInput = z.infer<typeof createFieldSchema>;
export type UpdateFieldInput = z.infer<typeof updateFieldSchema>;
