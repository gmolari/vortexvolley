"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge, Spinner, EmptyState, Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui";
import { useOrdersBySaleItem } from "@/lib/hooks";

const statusMap: Record<string, { label: string; classes: string }> = {
  PENDING: { label: "Pendente", classes: "bg-warning/10 text-warning" },
  CONFIRMED: { label: "Confirmado", classes: "bg-success/10 text-success" },
  CANCELLED: { label: "Cancelado", classes: "bg-destructive/10 text-destructive" },
};

export function OrdersTab({ saleItemId }: { saleItemId: string }) {
  const { data: orders, isLoading } = useOrdersBySaleItem(saleItemId);

  if (isLoading) return <div className="flex justify-center py-10"><Spinner /></div>;
  if (!orders || orders.length === 0) return <EmptyState title="Nenhum pedido" description="Ainda não há pedidos para este item" />;

  return (
    <div className="pt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const status = statusMap[order.status] || statusMap.PENDING;
            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.customerName}</TableCell>
                <TableCell>{order.customerEmail}</TableCell>
                <TableCell><Badge className={status.classes}>{status.label}</Badge></TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/pedidos/${order.id}`}>
                    <button className="rounded p-1.5 hover:bg-accent"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
