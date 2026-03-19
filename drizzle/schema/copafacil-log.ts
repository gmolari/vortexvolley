import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

export const copafacilLogs = pgTable("copafacil_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  method: varchar("method", { length: 10 }).notNull().default("GET"),
  path: varchar("path", { length: 500 }).notNull(),
  statusCode: integer("status_code"),
  durationMs: integer("duration_ms"),
  success: boolean("success").notNull().default(false),
  error: text("error"),
  responsePreview: text("response_preview"),
  context: varchar("context", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
