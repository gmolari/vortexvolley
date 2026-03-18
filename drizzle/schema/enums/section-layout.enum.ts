import { pgEnum } from "drizzle-orm/pg-core";

export const sectionLayoutEnum = pgEnum("section_layout", [
  "CAROUSEL",
  "GRID",
  "HIGHLIGHT",
  "BANNER",
  "TEXT",
]);
