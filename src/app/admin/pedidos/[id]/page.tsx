"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, PackageCheck, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/layout";
import { Button, Badge, Spinner, Card, CardContent } from "@/components/ui";
import { useOrderById, useUpdateOrderStatus, useDeleteOrder } from "@/lib/hooks";
import { toast } from "sonner";

const statusMap: Record<string, { label: string; classes: string }> = {
  PENDING: { label: "Pendente", classes: "bg-warning/10 text-warning" },
  CONFIRMED: { label: "Confirmado", classes: "bg-success/10 text-success" },
  DELIVERED: { label: "Entregue", classes: "bg-primary/10 text-primary" },
  CANCELLED: { label: "Cancelado", classes: "bg-destructive/10 text-destructive" },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { data: order, isLoading } = useOrderById(id);
  const updateStatus = useUpdateOrderStatus();
  const removeOrder = useDeleteOrder();

  const handleStatus = async (status: "CONFIRMED" | "DELIVERED" | "CANCELLED") => {
    const labels: Record<string, string> = {
      CONFIRMED: "confirmado",
      DELIVERED: "marcado como entregue",
      CANCELLED: "cancelado",
    };
    await updateStatus.mutateAsync({ id, status });
    toast.success(`Pedido ${labels[status]}`);
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.")) return;
    await removeOrder.mutateAsync(id);
    toast.success("Pedido excluído");
    router.push("/admin/pedidos");
  };

  if (isLoading) return <><AdminHeader title="Carregando..." /><div className="flex justify-center py-20"><Spinner size="lg" /></div></>;
  if (!order) return <><AdminHeader title="Pedido não encontrado" /><div className="p-6">Pedido não encontrado.</div></>;

  const status = statusMap[order.status] || statusMap.PENDING;

  return (
    <>
      <AdminHeader title={`Pedido #${order.id.slice(0, 8)}`} />
      <div className="p-6 max-w-3xl space-y-6">
        <Link href="/admin/pedidos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Dados do Pedido</h2>
              <Badge className={status.classes}>{status.label}</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div><span className="text-muted-foreground">Item:</span> <span className="font-medium">{(order as any).saleItem?.name}</span></div>
              <div><span className="text-muted-foreground">Data:</span> {new Date(order.createdAt).toLocaleDateString("pt-BR")}</div>
              <div><span className="text-muted-foreground">Nome:</span> <span className="font-medium">{order.customerName}</span></div>
              <div><span className="text-muted-foreground">Email:</span> {order.customerEmail}</div>
              {order.customerPhone && <div><span className="text-muted-foreground">Telefone:</span> {order.customerPhone}</div>}
            </div>
            {order.notes && (
              <div className="text-sm">
                <span className="text-muted-foreground">Observações:</span>
                <p className="mt-1">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {order.values && order.values.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Detalhes</h2>
              <div className="space-y-3">
                {order.values.map((val: any) => (
                  <div key={val.id} className="flex justify-between border-b border-border pb-2 text-sm">
                    <span className="text-muted-foreground">{val.field?.label || val.fieldId}</span>
                    <span className="font-medium">{val.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
          <div className="flex flex-wrap gap-3">
            {order.status === "PENDING" && (
              <Button onClick={() => handleStatus("CONFIRMED")} disabled={updateStatus.isPending} className="bg-success text-success-foreground hover:bg-success/90">
                <CheckCircle className="mr-2 h-4 w-4" /> Confirmar
              </Button>
            )}
            {(order.status === "PENDING" || order.status === "CONFIRMED") && (
              <Button onClick={() => handleStatus("DELIVERED")} disabled={updateStatus.isPending}>
                <PackageCheck className="mr-2 h-4 w-4" /> Marcar como Entregue
              </Button>
            )}
            {order.status === "PENDING" && (
              <Button variant="outline" onClick={() => handleStatus("CANCELLED")} disabled={updateStatus.isPending} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                <XCircle className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            )}
          </div>
        )}

        {order.status === "DELIVERED" && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-primary flex items-center gap-2">
            <PackageCheck className="h-5 w-5" />
            Pedido entregue em {new Date(order.updatedAt).toLocaleDateString("pt-BR")}
          </div>
        )}

        <div className="border-t border-border pt-6">
          <Button variant="outline" onClick={handleDelete} disabled={removeOrder.isPending} className="text-destructive border-destructive/30 hover:bg-destructive/10">
            <Trash2 className="mr-2 h-4 w-4" /> Excluir Pedido
          </Button>
        </div>
      </div>
    </>
  );
}
