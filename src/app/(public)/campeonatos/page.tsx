import Link from "next/link";
import { Trophy, Users, ChevronRight } from "lucide-react";
import { SectionWrapper } from "@/components/landing";
import { getAllTournamentsData } from "@/lib/services/copafacil.service";
import type { TournamentData, CopafacilMatch } from "@/types/copafacil";

export const dynamic = "force-dynamic";

function MatchRow({ match }: { match: CopafacilMatch }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 text-sm">
      <div className="flex-1 text-right font-medium text-foreground truncate">
        {match.teams.team_1.name}
      </div>
      <div className="shrink-0 rounded-md bg-card border border-border px-3 py-1 text-center font-bold tabular-nums min-w-[60px]">
        {match.result.pts1} - {match.result.pts2}
      </div>
      <div className="flex-1 font-medium text-foreground truncate">
        {match.teams.team_2.name}
      </div>
    </div>
  );
}

function TournamentCard({ data }: { data: TournamentData }) {
  const { tournament, classification, recentMatches, teamsCount, stages } = data;

  return (
    <Link
      href={`/campeonatos/${tournament.id}`}
      className="group block rounded-xl border border-border/50 bg-card overflow-hidden transition-shadow hover:shadow-lg hover:border-border"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border p-5">
        <Trophy className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {tournament.name}
          </h3>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            {teamsCount > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {teamsCount} equipes
              </span>
            )}
            {stages.length > 0 && (
              <span>
                {stages.length} fase{stages.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      <div className="p-5 space-y-4">
        {/* Classification preview - top 5 */}
        {classification && classification.teams.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Classificação
            </h4>
            <div className="space-y-1.5">
              {classification.teams.slice(0, 5).map((team) => (
                <div
                  key={team.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="w-5 text-center text-xs text-muted-foreground font-medium">
                    {team.position}
                  </span>
                  <span className="flex-1 truncate text-foreground font-medium">
                    {team.name}
                  </span>
                  {team.tableData[0] && (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {team.tableData[0].value} pts
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent matches preview */}
        {recentMatches.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Últimos Jogos
            </h4>
            <div className="space-y-2">
              {recentMatches.slice(0, 3).map((match) => (
                <MatchRow key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {/* No data */}
        {!classification && recentMatches.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Dados do campeonato ainda não disponíveis
          </p>
        )}
      </div>
    </Link>
  );
}

export default async function CampeonatosPage() {
  const tournamentsData = await getAllTournamentsData().catch(() => []);

  return (
    <SectionWrapper title="Campeonatos">
      {tournamentsData.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum campeonato disponível
          </h3>
          <p className="text-muted-foreground">
            Os campeonatos aparecerão aqui quando forem adicionados.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {tournamentsData.map((data) => (
            <TournamentCard key={data.tournament.id} data={data} />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
