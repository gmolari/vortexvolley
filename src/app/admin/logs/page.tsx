import { AdminHeader } from "@/components/layout";
import { getAuditLogs } from "@/lib/services/audit-log.service";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

const actionLabels: Record<string, { label: string; color: string }> = {
  CREATE: { label: "Criou", color: "bg-success/10 text-success" },
  UPDATE: { label: "Atualizou", color: "bg-primary/10 text-primary" },
  UPDATE_STATUS: { label: "Status", color: "bg-primary/10 text-primary" },
  DELETE: { label: "Excluiu", color: "bg-destructive/10 text-destructive" },
  LOGIN: { label: "Login", color: "bg-warning/10 text-warning" },
};

export default async function LogsPage() {
  const logs = await getAuditLogs(100).catch(() => []);

  return (
    <>
      <AdminHeader title="Logs do Sistema" />
      <div className="p-6">
        <p className="mb-6 text-muted-foreground">Histórico de alterações feitas pelos administradores</p>

        {logs.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
            Nenhum log registrado ainda.
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log: any) => {
                  const action = actionLabels[log.action] || { label: log.action, color: "bg-muted text-muted-foreground" };
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="font-medium">{log.username}</TableCell>
                      <TableCell>
                        <Badge className={action.color}>{action.label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{log.entity}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {log.details ? JSON.stringify(log.details).slice(0, 80) : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
