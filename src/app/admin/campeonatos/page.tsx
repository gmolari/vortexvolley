"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Trophy,
  ArrowUp,
  ArrowDown,
  Wifi,
  WifiOff,
  Loader2,
  ExternalLink,
  ScrollText,
} from "lucide-react";
import { AdminHeader } from "@/components/layout";
import { Button, Input, FormField, EmptyState, Spinner, Badge } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import {
  useTournaments,
  useCreateTournament,
  useUpdateTournament,
  useDeleteTournament,
} from "@/lib/hooks";
import { testCopafacilConnectionAction } from "@/lib/actions/copafacil.actions";
import { toast } from "sonner";

export default function CampeonatosPage() {
  const { data: tournaments, isLoading } = useTournaments();
  const create = useCreateTournament();
  const update = useUpdateTournament();
  const remove = useDeleteTournament();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ copafacilId: "", name: "", order: 0 });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    stages: number;
    teams: number;
  } | null>(null);

  const openNew = () => {
    setEditing(null);
    setForm({ copafacilId: "", name: "", order: 0 });
    setTestResult(null);
    setShowForm(true);
  };

  const openEdit = (t: any) => {
    setEditing(t);
    setForm({ copafacilId: t.copafacilId, name: t.name, order: t.order });
    setTestResult(null);
    setShowForm(true);
  };

  const handleTest = async () => {
    if (!form.copafacilId.trim()) {
      toast.error("Informe o ID do torneio");
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testCopafacilConnectionAction(form.copafacilId.trim());
      setTestResult(result);
      if (result.ok) {
        toast.success(`Conexão OK — ${result.stages} fase(s), ${result.teams} equipe(s)`);
      } else {
        toast.error("Torneio não encontrado ou API key inválida");
      }
    } catch {
      toast.error("Erro ao testar conexão");
      setTestResult({ ok: false, stages: 0, teams: 0 });
    } finally {
      setTesting(false);
    }
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

  const moveOrder = async (t: any, direction: "up" | "down") => {
    if (!tournaments) return;
    const sorted = [...tournaments].sort((a: any, b: any) => a.order - b.order);
    const idx = sorted.findIndex((item: any) => item.id === t.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const other = sorted[swapIdx] as any;
    try {
      await Promise.all([
        update.mutateAsync({ id: t.id, data: { order: other.order } }),
        update.mutateAsync({ id: other.id, data: { order: t.order } }),
      ]);
    } catch {
      toast.error("Erro ao reordenar");
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
          <div className="flex items-center gap-2">
            <Link href="/admin/campeonatos/logs">
              <Button variant="outline">
                <ScrollText className="mr-2 h-4 w-4" /> Logs API
              </Button>
            </Link>
            <Button onClick={openNew}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Campeonato
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : !tournaments || tournaments.length === 0 ? (
          <EmptyState
            title="Nenhum campeonato"
            description="Adicione o ID de um torneio do CopFacil para exibir no site"
          />
        ) : (
          <div className="space-y-3">
            {[...tournaments]
              .sort((a: any, b: any) => a.order - b.order)
              .map((t: any, idx: number) => (
                <div
                  key={t.id}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <Trophy className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{t.name}</p>
                      {!t.visible && (
                        <Badge variant="secondary" className="text-xs">
                          Oculto
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ID CopFacil:{" "}
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                        {t.copafacilId}
                      </code>
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveOrder(t, "up")}
                      disabled={idx === 0}
                      className="rounded p-1.5 hover:bg-accent transition-colors disabled:opacity-30"
                      title="Mover para cima"
                    >
                      <ArrowUp className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => moveOrder(t, "down")}
                      disabled={idx === tournaments.length - 1}
                      className="rounded p-1.5 hover:bg-accent transition-colors disabled:opacity-30"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  <a
                    href={`/campeonatos/${t.id}`}
                    target="_blank"
                    className="rounded p-1.5 hover:bg-accent transition-colors"
                    title="Ver no site"
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>

                  <button
                    onClick={() => toggleVisibility(t)}
                    className="rounded p-1.5 hover:bg-accent transition-colors"
                    title={t.visible ? "Ocultar" : "Tornar visível"}
                  >
                    {t.visible ? (
                      <Eye className="h-4 w-4 text-success" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
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
                  placeholder="Ex: Copa Londrina de Vôlei 2026"
                />
              </FormField>
              <FormField label="ID do Torneio no CopFacil" required>
                <div className="flex gap-2">
                  <Input
                    value={form.copafacilId}
                    onChange={(e) => {
                      setForm({ ...form, copafacilId: e.target.value });
                      setTestResult(null);
                    }}
                    placeholder="ID numérico do torneio"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTest}
                    disabled={testing || !form.copafacilId.trim()}
                    className="shrink-0"
                  >
                    {testing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : testResult?.ok ? (
                      <Wifi className="h-4 w-4 text-success" />
                    ) : testResult && !testResult.ok ? (
                      <WifiOff className="h-4 w-4 text-destructive" />
                    ) : (
                      "Testar"
                    )}
                  </Button>
                </div>
                {testResult && (
                  <p
                    className={`mt-1.5 text-xs ${
                      testResult.ok ? "text-success" : "text-destructive"
                    }`}
                  >
                    {testResult.ok
                      ? `Conexão OK — ${testResult.stages} fase(s), ${testResult.teams} equipe(s)`
                      : "Torneio não encontrado ou API key inválida"}
                  </p>
                )}
              </FormField>
              <FormField label="Ordem">
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm({ ...form, order: Number(e.target.value) })
                  }
                />
              </FormField>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={create.isPending || update.isPending}
                >
                  {create.isPending || update.isPending ? (
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
