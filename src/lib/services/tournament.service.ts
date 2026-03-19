import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { tournaments } from "../../../drizzle/schema";
import { auth } from "@/lib/auth";
import { createAuditLog } from "./audit-log.service";

export async function getTournaments() {
  return db.select().from(tournaments).orderBy(asc(tournaments.order));
}

export async function getTournamentById(id: string) {
  const [row] = await db
    .select()
    .from(tournaments)
    .where(eq(tournaments.id, id))
    .limit(1);
  return row || null;
}

export async function getVisibleTournaments() {
  return db
    .select()
    .from(tournaments)
    .where(eq(tournaments.visible, true))
    .orderBy(asc(tournaments.order));
}

export async function createTournament(data: {
  copafacilId: string;
  name: string;
  visible?: boolean;
  order?: number;
}) {
  const [row] = await db
    .insert(tournaments)
    .values({
      copafacilId: data.copafacilId,
      name: data.name,
      visible: data.visible ?? true,
      order: data.order ?? 0,
    })
    .returning();

  const session = await auth();
  if (session?.user) {
    createAuditLog({
      userId: session.user.id,
      username: session.user.name || "admin",
      action: "CREATE",
      entity: "tournament",
      entityId: row.id,
      details: { name: data.name, copafacilId: data.copafacilId },
    }).catch(() => {});
  }

  return row;
}

export async function updateTournament(
  id: string,
  data: Partial<{
    copafacilId: string;
    name: string;
    visible: boolean;
    order: number;
  }>
) {
  const [row] = await db
    .update(tournaments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tournaments.id, id))
    .returning();

  const session = await auth();
  if (session?.user) {
    createAuditLog({
      userId: session.user.id,
      username: session.user.name || "admin",
      action: "UPDATE",
      entity: "tournament",
      entityId: id,
      details: { changes: Object.keys(data) },
    }).catch(() => {});
  }

  return row;
}

export async function deleteTournament(id: string) {
  const tournament = await getTournamentById(id);
  await db.delete(tournaments).where(eq(tournaments.id, id));

  const session = await auth();
  if (session?.user) {
    createAuditLog({
      userId: session.user.id,
      username: session.user.name || "admin",
      action: "DELETE",
      entity: "tournament",
      entityId: id,
      details: { name: tournament?.name },
    }).catch(() => {});
  }
}
