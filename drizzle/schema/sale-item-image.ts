import { pgTable, uuid, varchar, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { saleItems } from "./sale-item";

export const saleItemImages = pgTable("sale_item_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  saleItemId: uuid("sale_item_id")
    .notNull()
    .references(() => saleItems.id, { onDelete: "cascade" }),
  url: varchar("url", { length: 500 }).notNull(),
  alt: varchar("alt", { length: 255 }),
  order: integer("order").notNull().default(0),
});

export const saleItemImagesRelations = relations(
  saleItemImages,
  ({ one }) => ({
    saleItem: one(saleItems, {
      fields: [saleItemImages.saleItemId],
      references: [saleItems.id],
    }),
  })
);
