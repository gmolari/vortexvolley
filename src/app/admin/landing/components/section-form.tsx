"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import { Button, Input, FormField, Spinner, Select, Checkbox } from "@/components/ui";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useCreateSection, useUpdateSection, useCreateLandingItem } from "@/lib/hooks";
import { toast } from "sonner";

const layouts = ["CAROUSEL", "GRID", "HIGHLIGHT", "BANNER", "TEXT"] as const;
const statuses = ["ACTIVE", "INACTIVE", "DRAFT"] as const;
const statusLabels: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  DRAFT: "Rascunho",
};

interface CarouselItem {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
}

interface SectionFormProps {
  sectionId?: string | null;
  defaultValues?: Record<string, unknown>;
  onClose: () => void;
}

export function SectionForm({ sectionId, defaultValues, onClose }: SectionFormProps) {
  const create = useCreateSection();
  const update = useUpdateSection();
  const createItem = useCreateLandingItem();
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: (defaultValues?.title as string) || "",
      description: (defaultValues?.description as string) || "",
      layout: (defaultValues?.layout as string) || "GRID",
      status: (defaultValues?.status as string) || "DRAFT",
      order: (defaultValues?.order as number) || 0,
      visible: defaultValues?.visible !== undefined ? defaultValues.visible as boolean : true,
      configColumns: ((defaultValues?.config as any)?.columns as number) || 3,
      configRows: ((defaultValues?.config as any)?.rows as number) || 0,
      configItemsPerSlide: ((defaultValues?.config as any)?.itemsPerSlide as number) || 3,
      configAutoplayDelay: ((defaultValues?.config as any)?.autoplayDelay as number) || 5000,
    },
  });

  const layout = watch("layout");

  // Carousel items management (only for new sections)
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [newItem, setNewItem] = useState<CarouselItem>({ title: "", description: "", imageUrl: "", linkUrl: "" });

  const addCarouselItem = () => {
    if (!newItem.title.trim()) return;
    setCarouselItems([...carouselItems, { ...newItem }]);
    setNewItem({ title: "", description: "", imageUrl: "", linkUrl: "" });
  };

  const removeCarouselItem = (index: number) => {
    setCarouselItems(carouselItems.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    try {
      const config: Record<string, unknown> = {};
      if (data.layout === "GRID") {
        config.columns = Number(data.configColumns) || 3;
        if (Number(data.configRows) > 0) config.rows = Number(data.configRows);
      }
      if (data.layout === "CAROUSEL") {
        config.itemsPerSlide = Number(data.configItemsPerSlide) || 3;
        config.autoplayDelay = Number(data.configAutoplayDelay) || 5000;
      }

      const payload = {
        title: data.title,
        description: data.description || null,
        layout: data.layout,
        status: data.status,
        config: Object.keys(config).length > 0 ? config : null,
        order: Number(data.order) || 0,
        visible: data.visible,
      };

      if (sectionId) {
        await update.mutateAsync({ id: sectionId, data: payload });
        toast.success("Seção atualizada");
      } else {
        const section = await create.mutateAsync(payload);

        // Create carousel items if any
        if (carouselItems.length > 0) {
          for (let i = 0; i < carouselItems.length; i++) {
            const ci = carouselItems[i];
            await createItem.mutateAsync({
              sectionId: section.id,
              title: ci.title,
              description: ci.description || undefined,
              imageUrl: ci.imageUrl || undefined,
              linkUrl: ci.linkUrl || undefined,
              order: i,
              visible: true,
            });
          }
        }

        toast.success("Seção criada" + (carouselItems.length > 0 ? ` com ${carouselItems.length} itens` : ""));
      }
      onClose();
    } catch {
      toast.error("Erro ao salvar seção");
    }
  };

  const loading = create.isPending || update.isPending || createItem.isPending;
  const isNew = !sectionId;
  const showItemsBuilder = isNew && (layout === "CAROUSEL" || layout === "GRID" || layout === "HIGHLIGHT");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
      <FormField label="Título" required error={errors.title?.message}>
        <Input {...register("title", { required: "Título obrigatório" })} placeholder="Nome da seção" />
      </FormField>

      <FormField label="Descrição">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              content={field.value}
              onChange={field.onChange}
              placeholder="Descrição da seção..."
            />
          )}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Layout" required>
          <Select {...register("layout")}>
            {layouts.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </Select>
        </FormField>

        <FormField label="Status">
          <Select {...register("status")}>
            {statuses.map((s) => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </Select>
        </FormField>
      </div>

      {layout === "GRID" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Colunas">
            <Input type="number" min={1} max={6} {...register("configColumns")} />
          </FormField>
          <FormField label="Linhas (0 = auto)">
            <Input type="number" min={0} {...register("configRows")} />
          </FormField>
        </div>
      )}

      {layout === "CAROUSEL" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Itens por slide">
            <Input type="number" min={1} max={4} {...register("configItemsPerSlide")} />
          </FormField>
          <FormField label="Autoplay (ms)">
            <Input type="number" min={0} step={500} {...register("configAutoplayDelay")} />
          </FormField>
        </div>
      )}

      <FormField label="Ordem">
        <Input type="number" {...register("order")} placeholder="0" />
      </FormField>

      <Controller
        name="visible"
        control={control}
        render={({ field }) => (
          <Checkbox
            label="Visível na landing page"
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {/* Inline items builder for new sections */}
      {showItemsBuilder && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">
              Itens da seção ({carouselItems.length})
            </h4>
          </div>

          {carouselItems.length > 0 && (
            <div className="space-y-2">
              {carouselItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-background border border-border p-3 group">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="h-10 w-10 rounded object-cover shrink-0" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground truncate">{item.description.replace(/<[^>]*>/g, "")}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCarouselItem(i)}
                    className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
            <p className="text-xs font-medium text-muted-foreground">Adicionar item</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Título *"
                className="text-sm"
              />
              <Input
                value={newItem.imageUrl}
                onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                placeholder="URL da imagem"
                className="text-sm"
              />
            </div>
            <Input
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Descrição"
              className="text-sm"
            />
            <Input
              value={newItem.linkUrl}
              onChange={(e) => setNewItem({ ...newItem, linkUrl: e.target.value })}
              placeholder="URL do link"
              className="text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addCarouselItem}
              disabled={!newItem.title.trim()}
              className="w-full"
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" /> : sectionId ? "Salvar" : "Criar"}
        </Button>
      </div>
    </form>
  );
}
