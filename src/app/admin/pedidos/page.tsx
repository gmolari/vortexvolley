"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Download, ClipboardList } from "lucide-react";
import { AdminHeader } from "@/components/layout";
import { Button, Input, Badge, Spinner, EmptyState, Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui";
import { useOrders, useSaleItems } from "@/lib/hooks";
import { getOrdersForExport } from "@/lib/services/order.service";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const statusMap: Record<string, { label: string; classes: string }> = {
  PENDING: { label: "Pendente", classes: "bg-warning/10 text-warning" },
  CONFIRMED: { label: "Confirmado", classes: "bg-success/10 text-success" },
  DELIVERED: { label: "Entregue", classes: "bg-primary/10 text-primary" },
  CANCELLED: { label: "Cancelado", classes: "bg-destructive/10 text-destructive" },
};

export default function PedidosPage() {
  const [filters, setFilters] = useState<{ saleItemId?: string; status?: string; search?: string; page?: number }>({});
  const { data: ordersData, isLoading } = useOrders(filters);
  const { data: items } = useSaleItems();

  const handleExport = async () => {
    try {
      const data = await getOrdersForExport(filters.saleItemId);
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Pedidos");
      XLSX.writeFile(wb, `pedidos-${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success("Exportação concluída");
    } catch {
      toast.error("Erro na exportação");
    }
  };

  return (
    <>
      <AdminHeader title="Pedidos" />
      <div className="p-6">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Input
            placeholder="Buscar por nome..."
            className="w-64"
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={filters.saleItemId || ""}
            onChange={(e) => setFilters({ ...filters, saleItemId: e.target.value || undefined, page: 1 })}
          >
            <option value="">Todos os itens</option>
            {items?.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={filters.status || ""}
            onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined, page: 1 })}
          >
            <option value="">Todos os status</option>
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="DELIVERED">Entregue</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : !ordersData || ordersData.data.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Nenhum pedido" description="Os pedidos aparecerão aqui" />
        ) : (
          <>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersData.data.map((order: any) => {
                    const status = statusMap[order.status] || statusMap.PENDING;
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                        <TableCell>{order.saleItemName}</TableCell>
                        <TableCell className="font-medium">{order.customerName}</TableCell>
                        <TableCell><Badge className={status.classes}>{status.label}</Badge></TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/pedidos/${order.id}`}>
                            <button className="rounded p-1.5 hover:bg-accent"><Eye className="h-4 w-4" /></button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {ordersData.totalPages > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: ordersData.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters({ ...filters, page: i + 1 })}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                      (filters.page || 1) === i + 1
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
