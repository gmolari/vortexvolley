import { pgEnum } from "drizzle-orm/pg-core";

export const fieldTypeEnum = pgEnum("field_type", [
  "TEXT",
  "NUMBER",
  "SELECT",
  "CHECKBOX",
  "TEXTAREA",
  "EMAIL",
  "PHONE",
  "SIZE",
]);
