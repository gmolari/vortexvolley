import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userRoleEnum } from "./enums/user-role.enum";
import { addresses } from "./address.schema";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  fullName: varchar("full_name", { length: 255 }).notNull(),

  username: varchar("username", { length: 50 }).notNull().unique(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  password: varchar("password", { length: 255 }).notNull(),

  phone: varchar("phone", { length: 20 }).notNull(),

  avatarBase64: text("avatar_base64"),

  birthDate: date("birth_date").notNull(),

  role: userRoleEnum("role").default("MEMBER").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
  address: one(addresses),
}));
