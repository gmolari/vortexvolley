"use server";

import { db } from "@/lib/db";
import { auditLogs } from "@/../drizzle/schema";
import { desc } from "drizzle-orm";

export async function createAuditLog(data: {
  userId?: string;
  username: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
}) {
  const [log] = await db
    .insert(auditLogs)
    .values({
      userId: data.userId || null,
      username: data.username,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId || null,
      details: data.details || null,
    })
    .returning();
  return log;
}

export async function getAuditLogs(limit = 50, offset = 0) {
  return db.query.auditLogs.findMany({
    orderBy: [desc(auditLogs.createdAt)],
    limit,
    offset,
  });
}
