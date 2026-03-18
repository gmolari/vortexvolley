import { Calendar, Users, MapPin } from "lucide-react";
import { SectionWrapper } from "../section-wrapper";
import type { Championship } from "@/types/copafacil";

const statusMap: Record<string, { label: string; classes: string }> = {
  active: { label: "Em andamento", classes: "bg-success/10 text-success" },
  upcoming: { label: "Próximo", classes: "bg-warning/10 text-warning" },
  finished: { label: "Finalizado", classes: "bg-muted text-muted-foreground" },
};

interface ChampionshipsSectionProps {
  championships: Championship[];
}

export function ChampionshipsSection({ championships }: ChampionshipsSectionProps) {
  if (championships.length === 0) return null;

  return (
    <SectionWrapper id="campeonatos" title="Campeonatos" className="bg-muted/30">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {championships.map((c) => {
          const status = statusMap[c.status] || statusMap.upcoming;
          return (
            <div
              key={c.id}
              className="rounded-xl border border-border/50 bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-foreground">{c.name}</h3>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.classes}`}>
                  {status.label}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {c.startDate}
                    {c.endDate && ` — ${c.endDate}`}
                  </span>
                </div>
                {c.teamsCount && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{c.teamsCount} equipes</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
