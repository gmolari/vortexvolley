import { defineConfig } from "drizzle-kit";
import { env } from "./config/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema/**/*",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});
