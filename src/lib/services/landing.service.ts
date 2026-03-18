"use server";

import { db } from "@/lib/db";
import {
  landingSections,
  landingItems,
} from "@/../drizzle/schema";
import { eq, asc, and, inArray } from "drizzle-orm";
import { slugify } from "@/lib/utils";
import { createAuditLog } from "./audit-log.service";
import { auth } from "@/lib/auth";

export async function getSections() {
  return db.query.landingSections.findMany({
    orderBy: [asc(landingSections.order)],
    with: {
      items: {
        orderBy: [asc(landingItems.order)],
      },
    },
  });
}

export async function getVisibleSections() {
  return db.query.landingSections.findMany({
    where: and(
      eq(landingSections.visible, true),
      eq(landingSections.status, "ACTIVE")
    ),
    orderBy: [asc(landingSections.order)],
    with: {
      items: {
        where: eq(landingItems.visible, true),
        orderBy: [asc(landingItems.order)],
      },
    },
  });
}

export async function createSection(data: {
  title: string;
  description?: string;
  layout: "CAROUSEL" | "GRID" | "HIGHLIGHT" | "BANNER" | "TEXT";
  status?: "ACTIVE" | "INACTIVE" | "DRAFT";
  config?: Record<string, unknown> | null;
  order?: number;
  visible?: boolean;
}) {
  const slug = slugify(data.title);
  const [section] = await db
    .insert(landingSections)
    .values({
      title: data.title,
      slug,
      description: data.description || null,
      layout: data.layout,
      status: data.status || "DRAFT",
      config: data.config || null,
      order: data.order ?? 0,
      visible: data.visible ?? true,
    })
    .returning();

  const session = await auth();
  if (session?.user) {
    createAuditLog({
      userId: session.user.id,
      username: session.user.name || "admin",
      action: "CREATE",
      entity: "landing_section",
      entityId: section.id,
      details: { title: data.title, layout: data.layout },
    }).catch(() => {});
  }

  return section;
}

export async function updateSection(id: string, data: Record<string, unknown>) {
  const values: Record<string, unknown> = { ...data, updatedAt: new Date() };
  if (typeof data.title === "string") values.slug = slugify(data.title);
  const [section] = await db
    .update(landingSections)
    .set(values)
    .where(eq(landingSections.id, id))
    .returning();
  return section;
}

export async function deleteSection(id: string) {
  await db.delete(landingSections).where(eq(landingSections.id, id));

  const session = await auth();
  if (session?.user) {
    createAuditLog({
      userId: session.user.id,
      username: session.user.name || "admin",
      action: "DELETE",
      entity: "landing_section",
      entityId: id,
    }).catch(() => {});
  }
}

export async function reorderSections(orderedIds: string[]) {
  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(landingSections)
      .set({ order: i })
      .where(eq(landingSections.id, orderedIds[i]));
  }
}

export async function createLandingItem(data: {
  sectionId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  saleItemId?: string;
  order?: number;
  visible?: boolean;
}) {
  const [item] = await db
    .insert(landingItems)
    .values({
      ...data,
      imageUrl: data.imageUrl || null,
      linkUrl: data.linkUrl || null,
      saleItemId: data.saleItemId || null,
      order: data.order ?? 0,
      visible: data.visible ?? true,
    })
    .returning();
  return item;
}

export async function updateLandingItem(id: string, data: Record<string, unknown>) {
  const [item] = await db
    .update(landingItems)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(landingItems.id, id))
    .returning();
  return item;
}

export async function deleteLandingItem(id: string) {
  await db.delete(landingItems).where(eq(landingItems.id, id));
}

export async function reorderLandingItems(sectionId: string, orderedIds: string[]) {
  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(landingItems)
      .set({ order: i })
      .where(
        and(eq(landingItems.id, orderedIds[i]), eq(landingItems.sectionId, sectionId))
      );
  }
}
