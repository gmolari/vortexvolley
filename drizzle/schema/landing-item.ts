import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { landingSections } from "./landing-section";
import { saleItems } from "./sale-item";

export const landingItems = pgTable("landing_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => landingSections.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).default(""),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }),
  linkUrl: varchar("link_url", { length: 500 }),
  saleItemId: uuid("sale_item_id").references(() => saleItems.id, {
    onDelete: "set null",
  }),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const landingItemsRelations = relations(landingItems, ({ one }) => ({
  section: one(landingSections, {
    fields: [landingItems.sectionId],
    references: [landingSections.id],
  }),
  saleItem: one(saleItems, {
    fields: [landingItems.saleItemId],
    references: [saleItems.id],
  }),
}));
