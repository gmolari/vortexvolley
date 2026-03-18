import { pgEnum } from "drizzle-orm/pg-core";

export const saleItemStatusEnum = pgEnum("sale_item_status", [
  "ACTIVE",
  "INACTIVE",
  "EXPIRED",
  "NEAR",
  "DRAFT",
]);
