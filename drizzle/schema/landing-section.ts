import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sectionLayoutEnum } from "./enums/section-layout.enum";
import { landingItems } from "./landing-item";

export const landingSections = pgTable("landing_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  layout: sectionLayoutEnum("layout").notNull(),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const landingSectionsRelations = relations(
  landingSections,
  ({ many }) => ({
    items: many(landingItems),
  })
);
