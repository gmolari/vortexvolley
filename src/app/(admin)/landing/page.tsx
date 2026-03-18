"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react";
import { AdminHeader } from "@/components/layout";
import { Button, Badge, EmptyState, Spinner } from "@/components/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui";
import { useSections, useDeleteSection, useDeleteLandingItem } from "@/lib/hooks";
import { SectionForm } from "./components/section-form";
import { ItemForm } from "./components/item-form";
import { toast } from "sonner";

export default function LandingPage() {
  const { data: sections, isLoading } = useSections();
  const deleteSection = useDeleteSection();
  const deleteItem = useDeleteLandingItem();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ id?: string; sectionId: string } | null>(null);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm("Excluir esta seção e todos os seus itens?")) return;
    await deleteSection.mutateAsync(id);
    toast.success("Seção excluída");
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Excluir este item?")) return;
    await deleteItem.mutateAsync(id);
    toast.success("Item excluído");
  };

  return (
    <>
      <AdminHeader title="Landing Page" />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">Gerencie as seções e conteúdos da página inicial</p>
          <Button onClick={() => { setEditingSection(null); setShowSectionForm(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Nova Seção
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : !sections || sections.length === 0 ? (
          <EmptyState title="Nenhuma seção" description="Crie a primeira seção da landing page" />
        ) : (
          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.id} className="rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 p-4">
                  <GripVertical className="h-5 w-5 text-muted-foreground/50 cursor-grab" />
                  <button onClick={() => toggleExpand(section.id)} className="text-muted-foreground">
                    {expandedSections.has(section.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  <div className="flex-1">
                    <span className="font-semibold text-foreground">{section.title}</span>
                    <Badge className="ml-2">{section.layout}</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{section.items?.length || 0} itens</span>
                  {section.visible ? (
                    <Eye className="h-4 w-4 text-success" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <button onClick={() => { setEditingSection(section.id); setShowSectionForm(true); }} className="rounded p-1.5 hover:bg-accent">
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => handleDeleteSection(section.id)} className="rounded p-1.5 hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>

                {expandedSections.has(section.id) && (
                  <div className="border-t border-border p-4 space-y-2">
                    {section.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                        )}
                        <span className="flex-1 text-sm font-medium">{item.title}</span>
                        <button onClick={() => setEditingItem({ id: item.id, sectionId: section.id })} className="rounded p-1 hover:bg-accent">
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                        <button onClick={() => handleDeleteItem(item.id)} className="rounded p-1 hover:bg-destructive/10">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => setEditingItem({ sectionId: section.id })}>
                      <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar Item
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Dialog open={showSectionForm} onOpenChange={setShowSectionForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSection ? "Editar Seção" : "Nova Seção"}</DialogTitle>
            </DialogHeader>
            <SectionForm
              sectionId={editingSection}
              onClose={() => setShowSectionForm(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem?.id ? "Editar Item" : "Novo Item"}</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <ItemForm
                itemId={editingItem.id}
                sectionId={editingItem.sectionId}
                onClose={() => setEditingItem(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
