"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Settings2 } from "lucide-react";
import { Button, Input, FormField, Spinner, EmptyState, Badge } from "@/components/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { useAddField, useDeleteField } from "@/lib/hooks";
import { toast } from "sonner";

const fieldTypes = ["TEXT", "NUMBER", "SELECT", "CHECKBOX", "TEXTAREA", "EMAIL", "PHONE", "SIZE"] as const;

export function FieldsTab({ item }: { item: any }) {
  const [showForm, setShowForm] = useState(false);
  const addField = useAddField();
  const deleteField = useDeleteField();
  const { register, handleSubmit, watch, reset } = useForm();
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [optLabel, setOptLabel] = useState("");
  const [optValue, setOptValue] = useState("");
  const type = watch("type");

  const addOption = () => {
    if (!optLabel || !optValue) return;
    setOptions([...options, { label: optLabel, value: optValue }]);
    setOptLabel("");
    setOptValue("");
  };

  const onSubmit = async (data: any) => {
    try {
      await addField.mutateAsync({
        saleItemId: item.id,
        label: data.label,
        type: data.type,
        required: data.required || false,
        placeholder: data.placeholder || undefined,
        order: item.fields?.length || 0,
        options: ["SELECT", "SIZE"].includes(data.type) ? options : undefined,
      });
      toast.success("Campo adicionado");
      reset();
      setOptions([]);
      setShowForm(false);
    } catch {
      toast.error("Erro ao adicionar campo");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este campo?")) return;
    await deleteField.mutateAsync(id);
    toast.success("Campo excluído");
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Defina os campos personalizados do formulário de pedido</p>
        <Button onClick={() => setShowForm(true)}><Plus className="mr-1 h-4 w-4" /> Novo Campo</Button>
      </div>

      {!item.fields || item.fields.length === 0 ? (
        <EmptyState icon={Settings2} title="Nenhum campo" description="Adicione campos ao formulário de pedido" />
      ) : (
        <div className="space-y-2">
          {item.fields.map((field: any) => (
            <div key={field.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
              <div className="flex-1">
                <span className="font-medium">{field.label}</span>
                <div className="flex gap-2 mt-1">
                  <Badge>{field.type}</Badge>
                  {field.required && <Badge className="bg-warning/10 text-warning">Obrigatório</Badge>}
                  {field.options?.length > 0 && (
                    <span className="text-xs text-muted-foreground">{field.options.length} opções</span>
                  )}
                </div>
              </div>
              <button onClick={() => handleDelete(field.id)} className="rounded p-1.5 hover:bg-destructive/10">
                <Trash2 className="h-4 w-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Campo</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Label" required>
              <Input {...register("label", { required: true })} placeholder="Ex: Tamanho da camiseta" />
            </FormField>
            <FormField label="Tipo" required>
              <select {...register("type")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {fieldTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Placeholder">
              <Input {...register("placeholder")} />
            </FormField>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("required")} className="rounded" />
              <span className="text-sm">Obrigatório</span>
            </label>

            {(type === "SELECT" || type === "SIZE") && (
              <div className="space-y-3 rounded-lg border border-border p-4">
                <p className="text-sm font-medium">Opções</p>
                {options.map((o, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="flex-1">{o.label}: {o.value}</span>
                    <button type="button" onClick={() => setOptions(options.filter((_, j) => j !== i))} className="text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input value={optLabel} onChange={(e) => setOptLabel(e.target.value)} placeholder="Label" className="flex-1" />
                  <Input value={optValue} onChange={(e) => setOptValue(e.target.value)} placeholder="Valor" className="flex-1" />
                  <Button type="button" variant="ghost" size="sm" onClick={addOption}>+</Button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit" disabled={addField.isPending}>
                {addField.isPending ? <Spinner size="sm" /> : "Adicionar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
