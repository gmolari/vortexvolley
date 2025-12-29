import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "MEMBER", // 0
  "ADMIN", // 1
  "OWNER", // 2
]);
