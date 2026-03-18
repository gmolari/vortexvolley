"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Trophy } from "lucide-react";
import { AdminHeader } from "@/components/layout";
import { Button, Input, FormField, EmptyState, Spinner } from "@/components/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { useTournaments, useCreateTournament, useUpdateTournament, useDeleteTournament } from "@/lib/hooks";
import { toast } from "sonner";

export default function CampeonatosPage() {
  const { data: tournaments, isLoading } = useTournaments();
  const create = useCreateTournament();
  const update = useUpdateTournament();
  const remove = useDeleteTournament();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ copafacilId: "", name: "", order: 0 });

  const openNew = () => {
    setEditing(null);
    setForm({ copafacilId: "", name: "", order: 0 });
    setShowForm(true);
  };

  const openEdit = (t: any) => {
    setEditing(t);
    setForm({ copafacilId: t.copafacilId, name: t.name, order: t.order });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.copafacilId.trim() || !form.name.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, data: form });
        toast.success("Campeonato atualizado");
      } else {
        await create.mutateAsync(form);
        toast.success("Campeonato adicionado");
      }
      setShowForm(false);
    } catch {
      toast.error("Erro ao salvar");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este campeonato?")) return;
    await remove.mutateAsync(id);
    toast.success("Campeonato removido");
  };

  const toggleVisibility = async (t: any) => {
    try {
      await update.mutateAsync({ id: t.id, data: { visible: !t.visible } });
      toast.success(t.visible ? "Campeonato ocultado" : "Campeonato visível");
    } catch {
      toast.error("Erro ao atualizar");
    }
  };

  return (
    <>
      <AdminHeader title="Campeonatos" />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            Gerencie os campeonatos do CopFacil exibidos no site
          </p>
          <Button onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Campeonato
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : !tournaments || tournaments.length === 0 ? (
          <EmptyState
            title="Nenhum campeonato"
            description="Adicione o ID de um torneio do CopFacil para exibir no site"
          />
        ) : (
          <div className="space-y-3">
            {tournaments.map((t: any) => (
              <div
                key={t.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
              >
                <Trophy className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ID CopFacil: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{t.copafacilId}</code>
                  </p>
                </div>
                <button
                  onClick={() => toggleVisibility(t)}
                  className="rounded p-1.5 hover:bg-accent transition-colors"
                  title={t.visible ? "Ocultar" : "Tornar visível"}
                >
                  {t.visible
                    ? <Eye className="h-4 w-4 text-success" />
                    : <EyeOff className="h-4 w-4 text-muted-foreground" />
                  }
                </button>
                <button
                  onClick={() => openEdit(t)}
                  className="rounded p-1.5 hover:bg-accent transition-colors"
                >
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="rounded p-1.5 hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar Campeonato" : "Adicionar Campeonato"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Nome do Campeonato" required>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Copa Londrina de Vôlei 2025"
                />
              </FormField>
              <FormField label="ID do Torneio no CopFacil" required>
                <Input
                  value={form.copafacilId}
                  onChange={(e) => setForm({ ...form, copafacilId: e.target.value })}
                  placeholder="ID numérico do torneio"
                />
              </FormField>
              <FormField label="Ordem">
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </FormField>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={create.isPending || update.isPending}>
                  {(create.isPending || update.isPending) ? (
                    <Spinner size="sm" />
                  ) : editing ? (
                    "Salvar"
                  ) : (
                    "Adicionar"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
