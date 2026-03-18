"use client";

import { useForm, Controller } from "react-hook-form";
import { Button, Input, FormField, Spinner, Checkbox } from "@/components/ui";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useCreateLandingItem, useUpdateLandingItem } from "@/lib/hooks";
import { toast } from "sonner";

interface ItemFormProps {
  itemId?: string;
  sectionId: string;
  defaultValues?: Record<string, unknown>;
  onClose: () => void;
}

export function ItemForm({ itemId, sectionId, defaultValues, onClose }: ItemFormProps) {
  const create = useCreateLandingItem();
  const update = useUpdateLandingItem();
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      title: (defaultValues?.title as string) || "",
      description: (defaultValues?.description as string) || "",
      imageUrl: (defaultValues?.imageUrl as string) || "",
      linkUrl: (defaultValues?.linkUrl as string) || "",
      saleItemId: (defaultValues?.saleItemId as string) || "",
      order: (defaultValues?.order as number) || 0,
      visible: defaultValues?.visible !== undefined ? defaultValues.visible as boolean : true,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        title: data.title,
        description: data.description || null,
        imageUrl: data.imageUrl?.trim() || null,
        linkUrl: data.linkUrl?.trim() || null,
        saleItemId: data.saleItemId?.trim() || null,
        order: Number(data.order) || 0,
        visible: data.visible,
      };
      if (itemId) {
        await update.mutateAsync({ id: itemId, data: payload });
        toast.success("Item atualizado");
      } else {
        await create.mutateAsync({ ...payload, sectionId });
        toast.success("Item criado");
      }
      onClose();
    } catch {
      toast.error("Erro ao salvar item");
    }
  };

  const loading = create.isPending || update.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <FormField label="Título" error={errors.title?.message as string}>
        <Input {...register("title")} placeholder="Opcional se houver imagem" />
      </FormField>

      <FormField label="Descrição">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              content={field.value}
              onChange={field.onChange}
              placeholder="Descrição do item..."
            />
          )}
        />
      </FormField>

      <FormField label="URL da Imagem">
        <Input {...register("imageUrl")} placeholder="https://..." />
      </FormField>
      <FormField label="URL do Link">
        <Input {...register("linkUrl")} placeholder="https://..." />
      </FormField>
      <FormField label="ID do Item de Venda (opcional)">
        <Input {...register("saleItemId")} placeholder="UUID do item da loja" />
      </FormField>
      <FormField label="Ordem">
        <Input type="number" {...register("order")} placeholder="0" />
      </FormField>

      <Controller
        name="visible"
        control={control}
        render={({ field }) => (
          <Checkbox
            label="Visível"
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" /> : itemId ? "Salvar" : "Criar"}
        </Button>
      </div>
    </form>
  );
}
