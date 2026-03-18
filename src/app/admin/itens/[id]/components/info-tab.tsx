"use client";

import { useForm, Controller } from "react-hook-form";
import { Button, Input, FormField, Spinner, Select, Checkbox } from "@/components/ui";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useUpdateSaleItem } from "@/lib/hooks";
import { toast } from "sonner";

const statuses = ["ACTIVE", "INACTIVE", "EXPIRED", "NEAR", "DRAFT"] as const;
const statusLabels: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  EXPIRED: "Expirado",
  NEAR: "Em breve",
  DRAFT: "Rascunho",
};

function formatDateForInput(date: string | Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
}

export function InfoTab({ item }: { item: any }) {
  const update = useUpdateSaleItem();
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: item.name,
      description: item.description,
      price: Number(item.price),
      estimatedDelivery: item.estimatedDelivery || "",
      notificationEmail: item.notificationEmail || "",
      status: item.status || "DRAFT",
      startsAt: formatDateForInput(item.startsAt),
      expiresAt: formatDateForInput(item.expiresAt),
      active: item.active,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await update.mutateAsync({
        id: item.id,
        data: {
          ...data,
          price: Number(data.price),
          startsAt: data.startsAt || null,
          expiresAt: data.expiresAt || null,
        },
      });
      toast.success("Item atualizado");
    } catch {
      toast.error("Erro ao atualizar");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6 pt-4">
      <div className="space-y-4">
        <FormField label="Nome" required>
          <Input {...register("name")} />
        </FormField>

        <FormField label="Descrição" required>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                content={field.value}
                onChange={field.onChange}
              />
            )}
          />
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
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Status e Datas</h3>

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

      <Button type="submit" disabled={update.isPending}>
        {update.isPending ? <Spinner size="sm" /> : "Salvar Alterações"}
      </Button>
    </form>
  );
}
