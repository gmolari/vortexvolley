"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2, ShoppingBag } from "lucide-react";
import { AdminHeader } from "@/components/layout";
import { Button, Spinner, EmptyState, Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui";
import { InlineStatusSelect } from "@/components/ui/inline-status-select";
import { useSaleItems, useDeleteSaleItem, useUpdateSaleItem } from "@/lib/hooks";
import { toast } from "sonner";

const itemStatuses = ["ACTIVE", "INACTIVE", "EXPIRED", "NEAR", "DRAFT"];

export default function ItensPage() {
  const { data: items, isLoading } = useSaleItems();
  const deleteItem = useDeleteSaleItem();
  const updateItem = useUpdateSaleItem();

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este item?")) return;
    await deleteItem.mutateAsync(id);
    toast.success("Item excluído");
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateItem.mutateAsync({ id, data: { status: status as any } });
      toast.success("Status atualizado");
    } catch {
      toast.error("Erro ao atualizar status");
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  return (
    <>
      <AdminHeader title="Itens" />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">Gerencie os itens disponíveis para venda</p>
          <Link href="/admin/itens/novo">
            <Button><Plus className="mr-2 h-4 w-4" /> Novo Item</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : !items || items.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="Nenhum item" description="Crie o primeiro item da loja" />
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Imagens</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>R$ {Number(item.price).toFixed(2).replace(".", ",")}</TableCell>
                    <TableCell>
                      <InlineStatusSelect
                        value={item.status || (item.active ? "ACTIVE" : "INACTIVE")}
                        options={itemStatuses}
                        onChange={(status) => handleStatusChange(item.id, status)}
                      />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(item.startsAt)} → {formatDate(item.expiresAt)}
                    </TableCell>
                    <TableCell>{item.images?.length || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/itens/${item.id}`}>
                          <button className="rounded p-1.5 hover:bg-accent transition-colors"><Pencil className="h-4 w-4 text-muted-foreground" /></button>
                        </Link>
                        <button onClick={() => handleDelete(item.id)} className="rounded p-1.5 hover:bg-destructive/10 transition-colors">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
