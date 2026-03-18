"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AdminHeader } from "@/components/layout";
import { Button, Input, Textarea, FormField, Spinner } from "@/components/ui";
import { useCreateSaleItem } from "@/lib/hooks";
import { toast } from "sonner";

export default function NovoItemPage() {
  const router = useRouter();
  const create = useCreateSaleItem();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const item = await create.mutateAsync({
        ...data,
        price: Number(data.price),
        active: true,
      });
      toast.success("Item criado com sucesso");
      router.push(`/admin/itens/${item.id}`);
    } catch {
      toast.error("Erro ao criar item");
    }
  };

  return (
    <>
      <AdminHeader title="Novo Item" />
      <div className="mx-auto max-w-2xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <FormField label="Nome" required error={errors.name?.message as string}>
              <Input {...register("name", { required: "Nome obrigatório" })} placeholder="Nome do item" />
            </FormField>
            <FormField label="Descrição" required error={errors.description?.message as string}>
              <Textarea {...register("description", { required: "Descrição obrigatória" })} rows={4} placeholder="Descreva o item..." />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Preço (R$)" required error={errors.price?.message as string}>
                <Input type="number" step="0.01" {...register("price", { required: "Preço obrigatório" })} placeholder="0,00" />
              </FormField>
              <FormField label="Entrega Estimada">
                <Input {...register("estimatedDelivery")} placeholder="Ex: 7-10 dias úteis" />
              </FormField>
            </div>
            <FormField label="Email de Notificação">
              <Input type="email" {...register("notificationEmail")} placeholder="Deixe vazio para usar o padrão" />
            </FormField>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? <Spinner size="sm" /> : "Criar Item"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
