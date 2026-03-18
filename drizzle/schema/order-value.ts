import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orders } from "./order";
import { saleItemFields } from "./sale-item-field";

export const orderValues = pgTable("order_values", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  fieldId: uuid("field_id")
    .notNull()
    .references(() => saleItemFields.id),
  value: text("value").notNull(),
});

export const orderValuesRelations = relations(orderValues, ({ one }) => ({
  order: one(orders, {
    fields: [orderValues.orderId],
    references: [orders.id],
  }),
  field: one(saleItemFields, {
    fields: [orderValues.fieldId],
    references: [saleItemFields.id],
  }),
}));
