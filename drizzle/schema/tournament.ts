import {
  pgTable,
  uuid,
  varchar,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const tournaments = pgTable("tournaments", {
  id: uuid("id").defaultRandom().primaryKey(),
  copafacilId: varchar("copafacil_id", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  visible: boolean("visible").notNull().default(true),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
