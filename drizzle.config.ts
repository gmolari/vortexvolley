import { defineConfig } from "drizzle-kit";
import { env } from "./config/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infra/db/schema/**/*",
  out: "./src/infra/db/migrations",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});
