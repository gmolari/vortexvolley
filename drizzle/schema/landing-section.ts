import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sectionLayoutEnum } from "./enums/section-layout.enum";
import { sectionStatusEnum } from "./enums/section-status.enum";
import { landingItems } from "./landing-item";

export const landingSections = pgTable("landing_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  layout: sectionLayoutEnum("layout").notNull(),
  status: sectionStatusEnum("status").notNull().default("DRAFT"),
  config: jsonb("config").$type<Record<string, unknown>>(),
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
