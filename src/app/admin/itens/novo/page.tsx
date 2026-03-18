"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Plus, Trash2, ImageIcon, Settings2 } from "lucide-react";
import { AdminHeader } from "@/components/layout";
import { Button, Input, FormField, Spinner, Select, Checkbox, Badge } from "@/components/ui";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useCreateSaleItem } from "@/lib/hooks";
import { addImage, addField } from "@/lib/services/sale-item.service";
import { toast } from "sonner";

const statuses = ["ACTIVE", "INACTIVE", "EXPIRED", "NEAR", "DRAFT"] as const;
const statusLabels: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  EXPIRED: "Expirado",
  NEAR: "Em breve",
  DRAFT: "Rascunho",
};

const fieldTypes = ["TEXT", "NUMBER", "SELECT", "CHECKBOX", "TEXTAREA", "EMAIL", "PHONE", "SIZE"] as const;

interface ImageEntry {
  url: string;
  alt: string;
}

interface FieldEntry {
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
  options: { label: string; value: string }[];
}

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

  // Images state
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [imgUrl, setImgUrl] = useState("");
  const [imgAlt, setImgAlt] = useState("");

  const handleAddImage = () => {
    if (!imgUrl) return;
    setImages([...images, { url: imgUrl, alt: imgAlt }]);
    setImgUrl("");
    setImgAlt("");
  };

  // Fields state
  const [fields, setFields] = useState<FieldEntry[]>([]);
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldType, setFieldType] = useState("TEXT");
  const [fieldRequired, setFieldRequired] = useState(false);
  const [fieldPlaceholder, setFieldPlaceholder] = useState("");
  const [fieldOptions, setFieldOptions] = useState<{ label: string; value: string }[]>([]);
  const [optLabel, setOptLabel] = useState("");
  const [optValue, setOptValue] = useState("");

  const addFieldOption = () => {
    if (!optLabel) return;
    setFieldOptions([...fieldOptions, { label: optLabel, value: optValue || optLabel }]);
    setOptLabel("");
    setOptValue("");
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFieldOption();
    }
  };

  const handleAddField = () => {
    if (!fieldLabel) return;
    setFields([...fields, {
      label: fieldLabel,
      type: fieldType,
      required: fieldRequired,
      placeholder: fieldPlaceholder,
      options: ["SELECT", "SIZE"].includes(fieldType) ? fieldOptions : [],
    }]);
    setFieldLabel("");
    setFieldType("TEXT");
    setFieldRequired(false);
    setFieldPlaceholder("");
    setFieldOptions([]);
    setShowFieldForm(false);
  };

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setSubmitting(true);
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

      // Add images
      for (let i = 0; i < images.length; i++) {
        await addImage(item.id, images[i].url, images[i].alt || null, i);
      }

      // Add fields
      for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        await addField({
          saleItemId: item.id,
          label: f.label,
          type: f.type,
          required: f.required,
          placeholder: f.placeholder || undefined,
          order: i,
          options: f.options.length > 0 ? f.options : undefined,
        });
      }

      toast.success("Item criado com sucesso");
      router.push(`/admin/itens/${item.id}`);
    } catch {
      toast.error("Erro ao criar item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AdminHeader title="Novo Item" />
      <div className="mx-auto max-w-2xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Info */}
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

          {/* Status */}
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

          {/* Images */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Imagens</h3>

            <div className="flex gap-3 items-end">
              <FormField label="URL da Imagem" className="flex-1">
                <Input value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="https://..." />
              </FormField>
              <FormField label="Alt" className="w-40">
                <Input value={imgAlt} onChange={(e) => setImgAlt(e.target.value)} placeholder="Descrição" />
              </FormField>
              <Button type="button" onClick={handleAddImage} disabled={!imgUrl}>
                <Plus className="mr-1 h-4 w-4" /> Adicionar
              </Button>
            </div>

            {images.length === 0 ? (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Nenhuma imagem adicionada
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((img, i) => (
                  <div key={i} className="group relative rounded-xl border border-border overflow-hidden">
                    <img src={img.url} alt={img.alt || ""} className="aspect-square w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, j) => j !== i))}
                      className="absolute top-2 right-2 rounded-full bg-destructive p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fields */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Campos do Formulário</h3>
              <Button type="button" onClick={() => setShowFieldForm(true)}>
                <Plus className="mr-1 h-4 w-4" /> Novo Campo
              </Button>
            </div>

            {fields.length === 0 ? (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Settings2 className="h-4 w-4" /> Nenhum campo adicionado
              </p>
            ) : (
              <div className="space-y-2">
                {fields.map((field, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
                    <div className="flex-1">
                      <span className="font-medium">{field.label}</span>
                      <div className="flex gap-2 mt-1">
                        <Badge>{field.type}</Badge>
                        {field.required && <Badge className="bg-warning/10 text-warning">Obrigatório</Badge>}
                        {field.options.length > 0 && (
                          <span className="text-xs text-muted-foreground">{field.options.length} opções</span>
                        )}
                      </div>
                    </div>
                    <button type="button" onClick={() => setFields(fields.filter((_, j) => j !== i))} className="rounded p-1.5 hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showFieldForm && (
              <div className="rounded-lg border border-border bg-background p-4 space-y-4">
                <h4 className="font-medium text-sm">Novo Campo</h4>
                <FormField label="Label" required>
                  <Input value={fieldLabel} onChange={(e) => setFieldLabel(e.target.value)} placeholder="Ex: Tamanho da camiseta" />
                </FormField>
                <FormField label="Tipo" required>
                  <select
                    value={fieldType}
                    onChange={(e) => setFieldType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {fieldTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </FormField>
                <FormField label="Placeholder">
                  <Input value={fieldPlaceholder} onChange={(e) => setFieldPlaceholder(e.target.value)} />
                </FormField>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={fieldRequired} onChange={(e) => setFieldRequired(e.target.checked)} className="rounded" />
                  <span className="text-sm">Obrigatório</span>
                </label>

                {(fieldType === "SELECT" || fieldType === "SIZE") && (
                  <div className="space-y-3 rounded-lg border border-border p-4">
                    <p className="text-sm font-medium">Opções</p>
                    {fieldOptions.map((o, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="flex-1">{o.label}: {o.value}</span>
                        <button type="button" onClick={() => setFieldOptions(fieldOptions.filter((_, j) => j !== i))} className="text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input value={optLabel} onChange={(e) => setOptLabel(e.target.value)} onKeyDown={handleOptionKeyDown} placeholder="Label (ex: P, M, G)" className="flex-1" />
                      <Input value={optValue} onChange={(e) => setOptValue(e.target.value)} onKeyDown={handleOptionKeyDown} placeholder="Valor (auto se vazio)" className="flex-1" />
                      <Button type="button" variant="ghost" size="sm" onClick={addFieldOption}>+</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Pressione Enter para adicionar rapidamente.</p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => { setShowFieldForm(false); setFieldOptions([]); }}>Cancelar</Button>
                  <Button type="button" onClick={handleAddField} disabled={!fieldLabel}>Adicionar Campo</Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Spinner size="sm" /> : "Criar Item"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
