import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { saleItemImages } from "./sale-item-image";
import { saleItemFields } from "./sale-item-field";
import { orders } from "./order";
import { landingItems } from "./landing-item";

export const saleItems = pgTable("sale_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  estimatedDelivery: varchar("estimated_delivery", { length: 100 }),
  notificationEmail: varchar("notification_email", { length: 255 }),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const saleItemsRelations = relations(saleItems, ({ many }) => ({
  images: many(saleItemImages),
  fields: many(saleItemFields),
  orders: many(orders),
  landingItems: many(landingItems),
}));
