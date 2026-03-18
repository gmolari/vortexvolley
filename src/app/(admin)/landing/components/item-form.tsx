"use client";

import { useForm } from "react-hook-form";
import { Button, Input, Textarea, FormField, Spinner } from "@/components/ui";
import { useCreateLandingItem, useUpdateLandingItem } from "@/lib/hooks";
import { toast } from "sonner";

interface ItemFormProps {
  itemId?: string;
  sectionId: string;
  onClose: () => void;
}

export function ItemForm({ itemId, sectionId, onClose }: ItemFormProps) {
  const create = useCreateLandingItem();
  const update = useUpdateLandingItem();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      if (itemId) {
        await update.mutateAsync({ id: itemId, data });
        toast.success("Item atualizado");
      } else {
        await create.mutateAsync({ ...data, sectionId, order: 0 });
        toast.success("Item criado");
      }
      onClose();
    } catch {
      toast.error("Erro ao salvar item");
    }
  };

  const loading = create.isPending || update.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Título" required error={errors.title?.message as string}>
        <Input {...register("title", { required: "Título obrigatório" })} />
      </FormField>
      <FormField label="Descrição">
        <Textarea {...register("description")} rows={3} />
      </FormField>
      <FormField label="URL da Imagem">
        <Input {...register("imageUrl")} placeholder="https://..." />
      </FormField>
      <FormField label="URL do Link">
        <Input {...register("linkUrl")} placeholder="https://..." />
      </FormField>
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("visible")} defaultChecked className="rounded" />
        <span className="text-sm">Visível</span>
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" /> : itemId ? "Salvar" : "Criar"}
        </Button>
      </div>
    </form>
  );
}
