"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AdminHeader } from "@/components/layout";
import { Button, Badge, Spinner } from "@/components/ui";
import {
  getCopafacilLogsAction,
  getCopafacilLogStatsAction,
  clearCopafacilLogsAction,
} from "@/lib/actions/copafacil-log.actions";
import { toast } from "sonner";

interface LogEntry {
  id: string;
  method: string;
  path: string;
  statusCode: number | null;
  durationMs: number | null;
  success: boolean;
  error: string | null;
  responsePreview: string | null;
  context: string | null;
  createdAt: string | Date;
}

interface Stats {
  total: number;
  success: number;
  failed: number;
  avgDuration: number;
}

function LogRow({ log }: { log: LogEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted/30 transition-colors"
      >
        {/* Status icon */}
        {log.success ? (
          <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
        ) : (
          <XCircle className="h-4 w-4 text-destructive shrink-0" />
        )}

        {/* Status code */}
        <Badge
          className={`shrink-0 tabular-nums ${
            log.statusCode && log.statusCode >= 200 && log.statusCode < 300
              ? "bg-success/10 text-success"
              : log.statusCode && log.statusCode >= 400
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {log.statusCode ?? "ERR"}
        </Badge>

        {/* Method */}
        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          {log.method}
        </span>

        {/* Path */}
        <span className="flex-1 font-mono text-xs truncate text-foreground">
          {log.path}
        </span>

        {/* Context */}
        {log.context && (
          <Badge variant="outline" className="shrink-0 text-xs">
            {log.context}
          </Badge>
        )}

        {/* Duration */}
        {log.durationMs !== null && (
          <span className="shrink-0 tabular-nums text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {log.durationMs}ms
          </span>
        )}

        {/* Timestamp */}
        <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
          {new Date(log.createdAt).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>

        {/* Expand */}
        {(log.error || log.responsePreview) &&
          (expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          ))}
      </button>

      {/* Expanded details */}
      {expanded && (log.error || log.responsePreview) && (
        <div className="px-4 pb-3 space-y-2">
          {log.error && (
            <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3">
              <p className="text-xs font-semibold text-destructive mb-1">
                Erro
              </p>
              <pre className="text-xs text-destructive/80 whitespace-pre-wrap break-all font-mono">
                {log.error}
              </pre>
            </div>
          )}
          {log.responsePreview && (
            <div className="rounded-lg bg-muted/50 border border-border p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                Response
              </p>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-all font-mono max-h-40 overflow-y-auto">
                {tryFormatJson(log.responsePreview)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function tryFormatJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

export default function CopafacilLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "success" | "error">("all");

  const load = async () => {
    setLoading(true);
    try {
      const [logsData, statsData] = await Promise.all([
        getCopafacilLogsAction(200),
        getCopafacilLogStatsAction(),
      ]);
      setLogs(logsData as LogEntry[]);
      setStats(statsData);
    } catch {
      toast.error("Erro ao carregar logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleClear = async () => {
    if (!confirm("Limpar todos os logs da CopFacil?")) return;
    try {
      await clearCopafacilLogsAction();
      setLogs([]);
      setStats({ total: 0, success: 0, failed: 0, avgDuration: 0 });
      toast.success("Logs limpos");
    } catch {
      toast.error("Erro ao limpar logs");
    }
  };

  const filtered = logs.filter((log) => {
    if (filter === "success") return log.success;
    if (filter === "error") return !log.success;
    return true;
  });

  return (
    <>
      <AdminHeader title="Logs CopFacil API" />
      <div className="p-6">
        {/* Back link */}
        <Link
          href="/admin/campeonatos"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos Campeonatos
        </Link>

        {/* Stats cards */}
        {stats && (
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {stats.total}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-success" /> Sucesso
              </p>
              <p className="text-2xl font-bold text-success tabular-nums">
                {stats.success}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <XCircle className="h-3 w-3 text-destructive" /> Erros
              </p>
              <p className="text-2xl font-bold text-destructive tabular-nums">
                {stats.failed}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Activity className="h-3 w-3" /> Tempo Médio
              </p>
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {stats.avgDuration}
                <span className="text-sm font-normal text-muted-foreground">
                  ms
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Actions bar */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-border bg-muted p-1">
            {(["all", "success", "error"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "Todos" : f === "success" ? "Sucesso" : "Erros"}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={logs.length === 0}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>

        {/* Logs list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
            {filter === "all"
              ? "Nenhum log registrado ainda. Os requests para a API CopFacil serão logados automaticamente."
              : filter === "error"
                ? "Nenhum erro registrado."
                : "Nenhum request com sucesso."}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {filtered.map((log) => (
              <LogRow key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
