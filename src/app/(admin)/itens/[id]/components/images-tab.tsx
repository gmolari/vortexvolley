"use client";

import { useState } from "react";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import { Button, Input, FormField, Spinner, EmptyState } from "@/components/ui";
import { useAddImage, useRemoveImage } from "@/lib/hooks";
import { toast } from "sonner";

export function ImagesTab({ item }: { item: any }) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const addImage = useAddImage();
  const removeImage = useRemoveImage();

  const handleAdd = async () => {
    if (!url) return;
    await addImage.mutateAsync({ saleItemId: item.id, url, alt: alt || null, order: item.images?.length || 0 });
    setUrl("");
    setAlt("");
    toast.success("Imagem adicionada");
  };

  const handleRemove = async (id: string) => {
    await removeImage.mutateAsync(id);
    toast.success("Imagem removida");
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex gap-3 items-end">
        <FormField label="URL da Imagem" className="flex-1">
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        </FormField>
        <FormField label="Alt" className="w-40">
          <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Descrição" />
        </FormField>
        <Button onClick={handleAdd} disabled={!url || addImage.isPending}>
          {addImage.isPending ? <Spinner size="sm" /> : <><Plus className="mr-1 h-4 w-4" /> Adicionar</>}
        </Button>
      </div>

      {!item.images || item.images.length === 0 ? (
        <EmptyState icon={ImageIcon} title="Nenhuma imagem" description="Adicione imagens ao item" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {item.images.map((img: any) => (
            <div key={img.id} className="group relative rounded-xl border border-border overflow-hidden">
              <img src={img.url} alt={img.alt || ""} className="aspect-square w-full object-cover" />
              <button
                onClick={() => handleRemove(img.id)}
                className="absolute top-2 right-2 rounded-full bg-destructive p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
