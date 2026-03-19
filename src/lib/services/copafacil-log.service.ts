"use server";

import { db } from "@/lib/db";
import { copafacilLogs } from "@/../drizzle/schema";
import { desc, sql } from "drizzle-orm";

export async function createCopafacilLog(data: {
  method?: string;
  path: string;
  statusCode?: number | null;
  durationMs?: number | null;
  success: boolean;
  error?: string | null;
  responsePreview?: string | null;
  context?: string | null;
}) {
  try {
    await db.insert(copafacilLogs).values({
      method: data.method ?? "GET",
      path: data.path,
      statusCode: data.statusCode ?? null,
      durationMs: data.durationMs ?? null,
      success: data.success,
      error: data.error ?? null,
      responsePreview: data.responsePreview ?? null,
      context: data.context ?? null,
    });
  } catch {
    // Don't let logging failures break the app
    console.error("[CopFacil Log] Failed to save log for:", data.path);
  }
}

export async function getCopafacilLogs(limit = 100, offset = 0) {
  return db
    .select()
    .from(copafacilLogs)
    .orderBy(desc(copafacilLogs.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getCopafacilLogStats() {
  const [stats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      success: sql<number>`count(*) filter (where success = true)::int`,
      failed: sql<number>`count(*) filter (where success = false)::int`,
      avgDuration: sql<number>`coalesce(round(avg(duration_ms)), 0)::int`,
    })
    .from(copafacilLogs);

  return stats;
}

export async function clearCopafacilLogs() {
  await db.delete(copafacilLogs);
}
