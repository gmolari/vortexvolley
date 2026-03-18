"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { AdminHeader } from "@/components/layout";
import { Button, Input, FormField, Spinner, Select, Checkbox } from "@/components/ui";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useCreateSaleItem } from "@/lib/hooks";
import { toast } from "sonner";

const statuses = ["ACTIVE", "INACTIVE", "EXPIRED", "NEAR", "DRAFT"] as const;
const statusLabels: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  EXPIRED: "Expirado",
  NEAR: "Em breve",
  DRAFT: "Rascunho",
};

export default function NovoItemPage() {
  const router = useRouter();
  const create = useCreateSaleItem();
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      estimatedDelivery: "",
      notificationEmail: "",
      status: "DRAFT" as const,
      startsAt: "",
      expiresAt: "",
      active: true,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const item = await create.mutateAsync({
        name: data.name,
        description: data.description,
        price: Number(data.price),
        estimatedDelivery: data.estimatedDelivery || undefined,
        notificationEmail: data.notificationEmail || undefined,
        status: data.status,
        startsAt: data.startsAt || undefined,
        expiresAt: data.expiresAt || undefined,
        active: data.active,
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
            <h3 className="text-lg font-semibold text-foreground">Informações</h3>

            <FormField label="Nome" required error={errors.name?.message as string}>
              <Input {...register("name", { required: "Nome obrigatório" })} placeholder="Nome do item" />
            </FormField>

            <FormField label="Descrição" required error={errors.description?.message as string}>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Descrição obrigatória" }}
                render={({ field }) => (
                  <RichTextEditor
                    content={field.value}
                    onChange={field.onChange}
                    placeholder="Descreva o item..."
                  />
                )}
              />
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

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Status e Datas</h3>

            <FormField label="Status">
              <Select {...register("status")}>
                {statuses.map((s) => (
                  <option key={s} value={s}>{statusLabels[s]}</option>
                ))}
              </Select>
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Data de Início">
                <Input type="datetime-local" {...register("startsAt")} />
              </FormField>
              <FormField label="Data de Expiração">
                <Input type="datetime-local" {...register("expiresAt")} />
              </FormField>
            </div>

            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="Ativo"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
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
