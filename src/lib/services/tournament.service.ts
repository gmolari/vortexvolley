import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { tournaments } from "../../../drizzle/schema";

export async function getTournaments() {
  return db.select().from(tournaments).orderBy(asc(tournaments.order));
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
  return row;
}

export async function deleteTournament(id: string) {
  await db.delete(tournaments).where(eq(tournaments.id, id));
}
