"use server";

import { database } from "@/infra/database";

export async function testDbConnection() {
  try {
    const result = await database.execute("select 1 as ok");

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error("DB connection error:", error);

    return {
      success: false,
      error: "Failed to connect to database",
    };
  }
}
