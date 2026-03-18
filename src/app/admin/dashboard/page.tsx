import Link from "next/link";
import { ClipboardList, ShoppingBag, Layout, Clock, PackageCheck } from "lucide-react";
import { AdminHeader } from "@/components/layout";
import { db } from "@/lib/db";
import { orders, saleItems, landingSections } from "@/../drizzle/schema";
import { sql, eq, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [itemsCount, ordersCount, pendingCount, deliveredCount, sectionsCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(saleItems),
    db.select({ count: sql<number>`count(*)` }).from(orders),
    db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, "PENDING")),
    db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, "DELIVERED")),
    db.select({ count: sql<number>`count(*)` }).from(landingSections),
  ]);

  const stats = [
    { label: "Total de Itens", value: Number(itemsCount[0].count), icon: ShoppingBag, color: "text-primary", href: "/admin/itens" },
    { label: "Total de Pedidos", value: Number(ordersCount[0].count), icon: ClipboardList, color: "text-success", href: "/admin/pedidos" },
    { label: "Pedidos Pendentes", value: Number(pendingCount[0].count), icon: Clock, color: "text-warning", href: "/admin/pedidos?status=PENDING" },
    { label: "Entregues", value: Number(deliveredCount[0].count), icon: PackageCheck, color: "text-primary", href: "/admin/pedidos?status=DELIVERED" },
    { label: "Seções Landing", value: Number(sectionsCount[0].count), icon: Layout, color: "text-accent-foreground", href: "/admin/landing" },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md hover:border-primary/30"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">{s.value}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
