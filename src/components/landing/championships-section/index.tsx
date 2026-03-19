import Link from "next/link";
import { Trophy, Users, Swords, ChevronRight } from "lucide-react";
import { SectionWrapper } from "../section-wrapper";
import type { TournamentData, CopafacilMatch } from "@/types/copafacil";

interface ChampionshipsSectionProps {
  tournamentsData: TournamentData[];
}

function MatchCard({ match }: { match: CopafacilMatch }) {
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

function ClassificationPreview({ data }: { data: TournamentData }) {
  const { classification } = data;
  if (!classification || classification.teams.length === 0) return null;

  const top5 = classification.teams.slice(0, 5);
  const headers = classification.header.slice(0, 6);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="py-2 pr-2 font-medium">#</th>
            <th className="py-2 pr-4 font-medium">Equipe</th>
            {headers.map((h) => (
              <th
                key={h.cod}
                className="py-2 px-2 font-medium text-center"
                title={h.title1}
              >
                {h.title2}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {top5.map((team) => (
            <tr
              key={team.id}
              className="border-b border-border/50 last:border-0"
            >
              <td className="py-2 pr-2 text-muted-foreground">
                {team.position}
              </td>
              <td className="py-2 pr-4 font-medium text-foreground truncate max-w-[160px]">
                {team.name}
              </td>
              {team.tableData.slice(0, 6).map((d, i) => (
                <td
                  key={i}
                  className="py-2 px-2 text-center text-muted-foreground"
                >
                  {d.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ChampionshipsSection({
  tournamentsData,
}: ChampionshipsSectionProps) {
  if (tournamentsData.length === 0) return null;

  return (
    <SectionWrapper id="campeonatos" title="Campeonatos" className="bg-muted/30">
      <div className="space-y-8">
        {tournamentsData.map((data) => (
          <Link
            key={data.tournament.id}
            href={`/campeonatos/${data.tournament.id}`}
            className="group block rounded-xl border border-border/50 bg-card overflow-hidden transition-shadow hover:shadow-lg hover:border-border"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border p-5">
              <Trophy className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {data.tournament.name}
                </h3>
                <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                  {data.teamsCount > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {data.teamsCount} equipes
                    </span>
                  )}
                  {data.stages.length > 0 && (
                    <span>
                      {data.stages.length} fase
                      {data.stages.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>

            <div className="p-5 space-y-6">
              {/* Classification */}
              {data.classification &&
                data.classification.teams.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Classificação
                    </h4>
                    <ClassificationPreview data={data} />
                  </div>
                )}

              {/* Recent Matches */}
              {data.recentMatches.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Swords className="h-4 w-4" />
                    Últimos Jogos
                  </h4>
                  <div className="space-y-2">
                    {data.recentMatches.slice(0, 5).map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </div>
              )}

              {/* No data yet */}
              {!data.classification && data.recentMatches.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Dados do campeonato ainda não disponíveis
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Link to full page */}
      <div className="mt-8 text-center">
        <Link
          href="/campeonatos"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Ver todos os campeonatos
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </SectionWrapper>
  );
}
