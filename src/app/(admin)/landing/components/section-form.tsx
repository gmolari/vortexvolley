"use client";

import { useForm } from "react-hook-form";
import { Button, Input, FormField, Spinner } from "@/components/ui";
import { useCreateSection, useUpdateSection } from "@/lib/hooks";
import { toast } from "sonner";

const layouts = ["CAROUSEL", "GRID", "HIGHLIGHT", "BANNER", "TEXT"] as const;

interface SectionFormProps {
  sectionId?: string | null;
  onClose: () => void;
}

export function SectionForm({ sectionId, onClose }: SectionFormProps) {
  const create = useCreateSection();
  const update = useUpdateSection();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { title: "", layout: "GRID" as const, visible: true },
  });

  const onSubmit = async (data: any) => {
    try {
      if (sectionId) {
        await update.mutateAsync({ id: sectionId, data });
        toast.success("Seção atualizada");
      } else {
        await create.mutateAsync({ ...data, order: 0 });
        toast.success("Seção criada");
      }
      onClose();
    } catch {
      toast.error("Erro ao salvar seção");
    }
  };

  const loading = create.isPending || update.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Título" required error={errors.title?.message}>
        <Input {...register("title", { required: "Título obrigatório" })} placeholder="Nome da seção" />
      </FormField>

      <FormField label="Layout" required>
        <select
          {...register("layout")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {layouts.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </FormField>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("visible")} className="rounded" defaultChecked />
        <span className="text-sm">Visível</span>
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" /> : sectionId ? "Salvar" : "Criar"}
        </Button>
      </div>
    </form>
  );
}
