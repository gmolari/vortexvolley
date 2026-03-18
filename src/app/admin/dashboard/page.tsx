import { ClipboardList, ShoppingBag, Layout, Clock } from "lucide-react";
import { AdminHeader } from "@/components/layout";
import { db } from "@/lib/db";
import { orders, saleItems, landingSections } from "@/../drizzle/schema";
import { sql, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [itemsCount, ordersCount, pendingCount, sectionsCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(saleItems),
    db.select({ count: sql<number>`count(*)` }).from(orders),
    db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, "PENDING")),
    db.select({ count: sql<number>`count(*)` }).from(landingSections),
  ]);

  const stats = [
    { label: "Total de Itens", value: Number(itemsCount[0].count), icon: ShoppingBag, color: "text-primary" },
    { label: "Total de Pedidos", value: Number(ordersCount[0].count), icon: ClipboardList, color: "text-success" },
    { label: "Pedidos Pendentes", value: Number(pendingCount[0].count), icon: Clock, color: "text-warning" },
    { label: "Seções Landing", value: Number(sectionsCount[0].count), icon: Layout, color: "text-accent-foreground" },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
