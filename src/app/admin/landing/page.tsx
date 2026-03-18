"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdminHeader } from "@/components/layout";
import { Button, Badge, EmptyState, Spinner } from "@/components/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { InlineStatusSelect } from "@/components/ui/inline-status-select";
import { useSections, useDeleteSection, useDeleteLandingItem, useUpdateSection, useUpdateLandingItem } from "@/lib/hooks";
import { SectionForm } from "./components/section-form";
import { ItemForm } from "./components/item-form";
import { toast } from "sonner";

const sectionStatuses = ["ACTIVE", "INACTIVE", "DRAFT"];

export default function LandingPage() {
  const { data: sections, isLoading } = useSections();
  const deleteSection = useDeleteSection();
  const deleteItem = useDeleteLandingItem();
  const updateSection = useUpdateSection();
  const updateItem = useUpdateLandingItem();
  const [editingSection, setEditingSection] = useState<{ id: string; data: any } | null>(null);
  const [editingItem, setEditingItem] = useState<{ id?: string; sectionId: string; data?: any } | null>(null);
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

  const handleSectionStatusChange = async (id: string, status: string) => {
    try {
      await updateSection.mutateAsync({ id, data: { status: status as any } });
      toast.success("Status atualizado");
    } catch {
      toast.error("Erro ao atualizar status");
    }
  };

  const handleItemVisibilityToggle = async (id: string, visible: boolean) => {
    try {
      await updateItem.mutateAsync({ id, data: { visible: !visible } });
      toast.success(visible ? "Item ocultado" : "Item visível");
    } catch {
      toast.error("Erro ao atualizar");
    }
  };

  const openEditSection = (section: any) => {
    setEditingSection({ id: section.id, data: section });
    setShowSectionForm(true);
  };

  const openNewSection = () => {
    setEditingSection(null);
    setShowSectionForm(true);
  };

  return (
    <>
      <AdminHeader title="Landing Page" />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">Gerencie as seções e conteúdos da página inicial</p>
          <Button onClick={openNewSection}>
            <Plus className="mr-2 h-4 w-4" /> Nova Seção
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : !sections || sections.length === 0 ? (
          <EmptyState title="Nenhuma seção" description="Crie a primeira seção da landing page" />
        ) : (
          <div className="space-y-3">
            {sections.map((section: any) => (
              <motion.div key={section.id} layout className="rounded-xl border border-border bg-card overflow-hidden">
                <motion.div layout="position" className="flex items-center gap-3 p-4">
                  <GripVertical className="h-5 w-5 text-muted-foreground/50 cursor-grab" />
                  <button onClick={() => toggleExpand(section.id)} className="text-muted-foreground">
                    <motion.div
                      animate={{ rotate: expandedSections.has(section.id) ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  </button>
                  <div className="flex-1 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{section.title}</span>
                    <Badge className="text-[10px]">{section.layout}</Badge>
                    <InlineStatusSelect
                      value={section.status || "DRAFT"}
                      options={sectionStatuses}
                      onChange={(status) => handleSectionStatusChange(section.id, status)}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{section.items?.length || 0} itens</span>
                  <button onClick={() => openEditSection(section)} className="rounded p-1.5 hover:bg-accent transition-colors">
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => handleDeleteSection(section.id)} className="rounded p-1.5 hover:bg-destructive/10 transition-colors">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </motion.div>

                <AnimatePresence initial={false}>
                  {expandedSections.has(section.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border p-4 space-y-2">
                        {section.items?.map((item: any, index: number) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.04 }}
                            className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted/80"
                          >
                            {item.imageUrl && (
                              <img src={item.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                            )}
                            <span className="flex-1 text-sm font-medium">{item.title}</span>
                            <button
                              onClick={() => handleItemVisibilityToggle(item.id, item.visible)}
                              className="rounded p-1 hover:bg-accent transition-colors"
                              title={item.visible ? "Ocultar item" : "Tornar visível"}
                            >
                              {item.visible
                                ? <Eye className="h-3.5 w-3.5 text-success" />
                                : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                              }
                            </button>
                            <button onClick={() => setEditingItem({ id: item.id, sectionId: section.id, data: item })} className="rounded p-1 hover:bg-accent transition-colors">
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                            <button onClick={() => handleDeleteItem(item.id)} className="rounded p-1 hover:bg-destructive/10 transition-colors">
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </button>
                          </motion.div>
                        ))}
                        <Button variant="ghost" size="sm" onClick={() => setEditingItem({ sectionId: section.id })}>
                          <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar Item
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        <Dialog open={showSectionForm} onOpenChange={setShowSectionForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSection ? "Editar Seção" : "Nova Seção"}</DialogTitle>
            </DialogHeader>
            <SectionForm
              sectionId={editingSection?.id}
              defaultValues={editingSection?.data}
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
                defaultValues={editingItem.data}
                onClose={() => setEditingItem(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
