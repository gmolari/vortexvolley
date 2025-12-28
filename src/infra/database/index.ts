import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "../../../config/env";

const client = postgres(env.DATABASE_URL, {
  ssl: "require",
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const database = drizzle(client, {
  schema: {},
  logger: env.NODE_ENV === "development",
});
