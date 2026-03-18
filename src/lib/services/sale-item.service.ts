"use server";

import { db } from "@/lib/db";
import {
  saleItems,
  saleItemImages,
  saleItemFields,
  saleItemFieldOptions,
} from "@/../drizzle/schema";
import { eq, asc, and, inArray } from "drizzle-orm";
import { slugify } from "@/lib/utils";

export async function getSaleItems() {
  return db.query.saleItems.findMany({
    orderBy: [asc(saleItems.name)],
    with: { images: { orderBy: [asc(saleItemImages.order)] } },
  });
}

export async function getActiveSaleItems() {
  return db.query.saleItems.findMany({
    where: and(
      eq(saleItems.active, true),
      inArray(saleItems.status, ["ACTIVE", "EXPIRED", "NEAR"])
    ),
    orderBy: [asc(saleItems.name)],
    with: { images: { orderBy: [asc(saleItemImages.order)] } },
  });
}

export async function getSaleItemBySlug(slug: string) {
  return db.query.saleItems.findFirst({
    where: eq(saleItems.slug, slug),
    with: {
      images: { orderBy: [asc(saleItemImages.order)] },
      fields: {
        orderBy: [asc(saleItemFields.order)],
        with: { options: { orderBy: [asc(saleItemFieldOptions.order)] } },
      },
    },
  });
}

export async function getSaleItemById(id: string) {
  return db.query.saleItems.findFirst({
    where: eq(saleItems.id, id),
    with: {
      images: { orderBy: [asc(saleItemImages.order)] },
      fields: {
        orderBy: [asc(saleItemFields.order)],
        with: { options: { orderBy: [asc(saleItemFieldOptions.order)] } },
      },
    },
  });
}

export async function createSaleItem(data: {
  name: string;
  description: string;
  price: number;
  estimatedDelivery?: string;
  notificationEmail?: string;
  status?: "ACTIVE" | "INACTIVE" | "EXPIRED" | "NEAR" | "DRAFT";
  startsAt?: string;
  expiresAt?: string;
  active?: boolean;
}) {
  const slug = slugify(data.name);
  const [item] = await db
    .insert(saleItems)
    .values({
      name: data.name,
      slug,
      description: data.description,
      price: String(data.price),
      notificationEmail: data.notificationEmail || null,
      estimatedDelivery: data.estimatedDelivery || null,
      status: data.status || "DRAFT",
      startsAt: data.startsAt ? new Date(data.startsAt) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      active: data.active ?? true,
    })
    .returning();
  return item;
}

export async function updateSaleItem(id: string, data: Record<string, unknown>) {
  const values: Record<string, unknown> = { ...data, updatedAt: new Date() };
  if (typeof data.name === "string") values.slug = slugify(data.name);
  if (data.price !== undefined) values.price = String(data.price);
  if (typeof data.startsAt === "string") values.startsAt = data.startsAt ? new Date(data.startsAt as string) : null;
  if (typeof data.expiresAt === "string") values.expiresAt = data.expiresAt ? new Date(data.expiresAt as string) : null;
  const [item] = await db
    .update(saleItems)
    .set(values)
    .where(eq(saleItems.id, id))
    .returning();
  return item;
}

export async function deleteSaleItem(id: string) {
  await db.delete(saleItems).where(eq(saleItems.id, id));
}

export async function addImage(saleItemId: string, url: string, alt: string | null, order: number) {
  const [img] = await db
    .insert(saleItemImages)
    .values({ saleItemId, url, alt, order })
    .returning();
  return img;
}

export async function removeImage(id: string) {
  await db.delete(saleItemImages).where(eq(saleItemImages.id, id));
}

export async function reorderImages(orderedIds: string[]) {
  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(saleItemImages)
      .set({ order: i })
      .where(eq(saleItemImages.id, orderedIds[i]));
  }
}

export async function addField(data: {
  saleItemId: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  order: number;
  options?: { label: string; value: string }[];
}) {
  const { options, ...fieldData } = data;
  const [field] = await db
    .insert(saleItemFields)
    .values({
      ...fieldData,
      type: fieldData.type as "TEXT" | "NUMBER" | "SELECT" | "CHECKBOX" | "TEXTAREA" | "EMAIL" | "PHONE" | "SIZE",
      placeholder: fieldData.placeholder || null,
    })
    .returning();

  if (options && options.length > 0) {
    await db.insert(saleItemFieldOptions).values(
      options.map((opt, i) => ({
        fieldId: field.id,
        label: opt.label,
        value: opt.value,
        order: i,
      }))
    );
  }

  return field;
}

export async function updateField(
  id: string,
  data: { label?: string; type?: string; required?: boolean; placeholder?: string; order?: number }
) {
  const { type, ...rest } = data;
  const setData: Record<string, unknown> = { ...rest };
  if (type) {
    setData.type = type as "TEXT" | "NUMBER" | "SELECT" | "CHECKBOX" | "TEXTAREA" | "EMAIL" | "PHONE" | "SIZE";
  }
  const [field] = await db
    .update(saleItemFields)
    .set(setData)
    .where(eq(saleItemFields.id, id))
    .returning();
  return field;
}

export async function deleteField(id: string) {
  await db.delete(saleItemFields).where(eq(saleItemFields.id, id));
}

export async function addFieldOption(fieldId: string, label: string, value: string, order: number) {
  const [opt] = await db
    .insert(saleItemFieldOptions)
    .values({ fieldId, label, value, order })
    .returning();
  return opt;
}

export async function removeFieldOption(id: string) {
  await db.delete(saleItemFieldOptions).where(eq(saleItemFieldOptions.id, id));
}
