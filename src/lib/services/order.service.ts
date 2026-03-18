"use server";

import { db } from "@/lib/db";
import {
  orders,
  orderValues,
  saleItems,
  saleItemFields,
} from "@/../drizzle/schema";
import { eq, desc, and, like, sql } from "drizzle-orm";
import { sendOrderNotification } from "./email.service";
import { getSetting } from "./settings.service";
import { createAuditLog } from "./audit-log.service";
import { auth } from "@/lib/auth";

export async function createOrder(data: {
  saleItemId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
  values: Record<string, string>;
}) {
  const item = await db.query.saleItems.findFirst({
    where: eq(saleItems.id, data.saleItemId),
  });
  if (!item) throw new Error("Item não encontrado");

  const [order] = await db
    .insert(orders)
    .values({
      saleItemId: data.saleItemId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone || null,
      notes: data.notes || null,
    })
    .returning();

  if (data.values && Object.keys(data.values).length > 0) {
    const valueEntries = Object.entries(data.values).map(([fieldId, value]) => ({
      orderId: order.id,
      fieldId,
      value: String(value),
    }));
    await db.insert(orderValues).values(valueEntries);
  }

  // Send email notification (non-blocking)
  const notifyEmail =
    item.notificationEmail || (await getSetting("global_notification_email"));
  if (notifyEmail) {
    const fields = await db.query.saleItemFields.findMany({
      where: eq(saleItemFields.saleItemId, data.saleItemId),
    });
    sendOrderNotification(order, item, data.values, fields, notifyEmail).catch((err) =>
      console.error("[Order] Email notification failed:", err)
    );
  }

  return order;
}

export async function getOrders(filters?: {
  saleItemId?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (filters?.saleItemId) {
    conditions.push(eq(orders.saleItemId, filters.saleItemId));
  }
  if (filters?.status) {
    conditions.push(
      eq(orders.status, filters.status as "PENDING" | "CONFIRMED" | "CANCELLED")
    );
  }
  if (filters?.search) {
    conditions.push(like(orders.customerName, `%${filters.search}%`));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, countResult] = await Promise.all([
    db.query.orders.findMany({
      where,
      orderBy: [desc(orders.createdAt)],
      limit,
      offset,
      with: {
        saleItem: { columns: { name: true, slug: true } },
      },
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(where),
  ]);

  return {
    data: data.map((o) => ({
      ...o,
      saleItemName: o.saleItem.name,
    })),
    total: Number(countResult[0].count),
    page,
    totalPages: Math.ceil(Number(countResult[0].count) / limit),
  };
}

export async function getOrderById(id: string) {
  return db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      saleItem: { columns: { name: true, slug: true } },
      values: {
        with: {
          field: { columns: { label: true, type: true } },
        },
      },
    },
  });
}

export async function getOrdersBySaleItem(saleItemId: string) {
  return db.query.orders.findMany({
    where: eq(orders.saleItemId, saleItemId),
    orderBy: [desc(orders.createdAt)],
    with: {
      values: {
        with: {
          field: { columns: { label: true, type: true } },
        },
      },
    },
  });
}

export async function updateOrderStatus(
  id: string,
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED"
) {
  const [order] = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning();

  const session = await auth();
  if (session?.user) {
    createAuditLog({
      userId: session.user.id,
      username: session.user.name || "admin",
      action: "UPDATE_STATUS",
      entity: "order",
      entityId: id,
      details: { status },
    }).catch(() => {});
  }

  return order;
}

export async function deleteOrder(id: string) {
  const existing = await db.query.orders.findFirst({ where: eq(orders.id, id) });
  await db.delete(orderValues).where(eq(orderValues.orderId, id));
  await db.delete(orders).where(eq(orders.id, id));

  const session = await auth();
  if (session?.user) {
    createAuditLog({
      userId: session.user.id,
      username: session.user.name || "admin",
      action: "DELETE",
      entity: "order",
      entityId: id,
      details: existing ? { customerName: existing.customerName } : undefined,
    }).catch(() => {});
  }
}

export async function getOrdersForExport(saleItemId?: string) {
  const where = saleItemId ? eq(orders.saleItemId, saleItemId) : undefined;

  const data = await db.query.orders.findMany({
    where,
    orderBy: [desc(orders.createdAt)],
    with: {
      saleItem: { columns: { name: true } },
      values: {
        with: {
          field: { columns: { label: true } },
        },
      },
    },
  });

  return data.map((order) => {
    const row: Record<string, unknown> = {
      ID: order.id.slice(0, 8),
      Item: order.saleItem.name,
      Nome: order.customerName,
      Email: order.customerEmail,
      Telefone: order.customerPhone || "",
      Status: order.status,
      Data: order.createdAt.toLocaleDateString("pt-BR"),
    };
    for (const val of order.values) {
      row[val.field.label] = val.value;
    }
    return row;
  });
}
