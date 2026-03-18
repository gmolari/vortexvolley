import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-success/10 text-success border-success/20",
  INACTIVE: "bg-muted text-muted-foreground border-muted",
  DRAFT: "bg-warning/10 text-warning border-warning/20",
  EXPIRED: "bg-destructive/10 text-destructive border-destructive/20",
  NEAR: "bg-primary/10 text-primary border-primary/20",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  DRAFT: "Rascunho",
  EXPIRED: "Expirado",
  NEAR: "Em breve",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status] || "bg-muted text-muted-foreground",
        className
      )}
    >
      <span className={cn(
        "mr-1.5 h-1.5 w-1.5 rounded-full",
        status === "ACTIVE" && "bg-success",
        status === "INACTIVE" && "bg-muted-foreground",
        status === "DRAFT" && "bg-warning",
        status === "EXPIRED" && "bg-destructive",
        status === "NEAR" && "bg-primary",
      )} />
      {statusLabels[status] || status}
    </span>
  );
}
