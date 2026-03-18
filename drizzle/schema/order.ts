import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orderStatusEnum } from "./enums/order-status.enum";
import { saleItems } from "./sale-item";
import { orderValues } from "./order-value";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  saleItemId: uuid("sale_item_id")
    .notNull()
    .references(() => saleItems.id),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }),
  status: orderStatusEnum("status").notNull().default("PENDING"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  saleItem: one(saleItems, {
    fields: [orders.saleItemId],
    references: [saleItems.id],
  }),
  values: many(orderValues),
}));
