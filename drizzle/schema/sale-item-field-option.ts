import { pgTable, uuid, varchar, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { saleItemFields } from "./sale-item-field";

export const saleItemFieldOptions = pgTable("sale_item_field_options", {
  id: uuid("id").defaultRandom().primaryKey(),
  fieldId: uuid("field_id")
    .notNull()
    .references(() => saleItemFields.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  order: integer("order").notNull().default(0),
});

export const saleItemFieldOptionsRelations = relations(
  saleItemFieldOptions,
  ({ one }) => ({
    field: one(saleItemFields, {
      fields: [saleItemFieldOptions.fieldId],
      references: [saleItemFields.id],
    }),
  })
);
