"use client";

import { useForm } from "react-hook-form";
import { Button, Input, Textarea, FormField, Spinner } from "@/components/ui";
import { useUpdateSaleItem } from "@/lib/hooks";
import { toast } from "sonner";

export function InfoTab({ item }: { item: any }) {
  const update = useUpdateSaleItem();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: item.name,
      description: item.description,
      price: Number(item.price),
      estimatedDelivery: item.estimatedDelivery || "",
      notificationEmail: item.notificationEmail || "",
      active: item.active,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await update.mutateAsync({ id: item.id, data: { ...data, price: Number(data.price) } });
      toast.success("Item atualizado");
    } catch {
      toast.error("Erro ao atualizar");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4 pt-4">
      <FormField label="Nome" required>
        <Input {...register("name")} />
      </FormField>
      <FormField label="Descrição" required>
        <Textarea {...register("description")} rows={4} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Preço (R$)" required>
          <Input type="number" step="0.01" {...register("price")} />
        </FormField>
        <FormField label="Entrega Estimada">
          <Input {...register("estimatedDelivery")} />
        </FormField>
      </div>
      <FormField label="Email de Notificação">
        <Input type="email" {...register("notificationEmail")} />
      </FormField>
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("active")} className="rounded" />
        <span className="text-sm">Ativo</span>
      </label>
      <Button type="submit" disabled={update.isPending}>
        {update.isPending ? <Spinner size="sm" /> : "Salvar Alterações"}
      </Button>
    </form>
  );
}
