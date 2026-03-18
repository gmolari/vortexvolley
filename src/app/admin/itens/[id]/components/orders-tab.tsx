"use client";

import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
import { Badge, Spinner, EmptyState, Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui";
import { useOrdersBySaleItem, useDeleteOrder } from "@/lib/hooks";
import { toast } from "sonner";

const statusMap: Record<string, { label: string; classes: string }> = {
  PENDING: { label: "Pendente", classes: "bg-warning/10 text-warning" },
  CONFIRMED: { label: "Confirmado", classes: "bg-success/10 text-success" },
  DELIVERED: { label: "Entregue", classes: "bg-primary/10 text-primary" },
  CANCELLED: { label: "Cancelado", classes: "bg-destructive/10 text-destructive" },
};

export function OrdersTab({ saleItemId }: { saleItemId: string }) {
  const { data: orders, isLoading } = useOrdersBySaleItem(saleItemId);
  const deleteOrder = useDeleteOrder();

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;
    await deleteOrder.mutateAsync(id);
    toast.success("Pedido excluído");
  };

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
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/pedidos/${order.id}`}>
                      <button className="rounded p-1.5 hover:bg-accent"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                    </Link>
                    <button onClick={() => handleDelete(order.id)} className="rounded p-1.5 hover:bg-destructive/10" disabled={deleteOrder.isPending}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
