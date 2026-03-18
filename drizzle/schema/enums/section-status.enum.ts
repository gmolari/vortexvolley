import { pgEnum } from "drizzle-orm/pg-core";

export const sectionStatusEnum = pgEnum("section_status", [
  "ACTIVE",
  "INACTIVE",
  "DRAFT",
]);
