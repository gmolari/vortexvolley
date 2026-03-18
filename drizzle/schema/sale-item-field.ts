import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { fieldTypeEnum } from "./enums/field-type.enum";
import { saleItems } from "./sale-item";
import { saleItemFieldOptions } from "./sale-item-field-option";
import { orderValues } from "./order-value";

export const saleItemFields = pgTable("sale_item_fields", {
  id: uuid("id").defaultRandom().primaryKey(),
  saleItemId: uuid("sale_item_id")
    .notNull()
    .references(() => saleItems.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 255 }).notNull(),
  type: fieldTypeEnum("type").notNull(),
  required: boolean("required").notNull().default(false),
  placeholder: varchar("placeholder", { length: 255 }),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const saleItemFieldsRelations = relations(
  saleItemFields,
  ({ one, many }) => ({
    saleItem: one(saleItems, {
      fields: [saleItemFields.saleItemId],
      references: [saleItems.id],
    }),
    options: many(saleItemFieldOptions),
    orderValues: many(orderValues),
  })
);
