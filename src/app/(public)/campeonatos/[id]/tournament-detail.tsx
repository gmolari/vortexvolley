"use client";

import { useState } from "react";
import { Swords } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import type {
  TournamentDetailData,
  StageData,
  CopafacilMatch,
  RoundWithMatches,
} from "@/types/copafacil";

function MatchCard({ match }: { match: CopafacilMatch }) {
  const hasResult = match.result.pts1 !== 0 || match.result.pts2 !== 0;

  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 text-sm">
      <div className="flex-1 text-right font-medium text-foreground truncate">
        {match.teams.team_1.name}
      </div>
      <div className="shrink-0 rounded-md bg-card border border-border px-3 py-1 text-center font-bold tabular-nums min-w-[60px]">
        {hasResult ? (
          <>
            {match.result.pts1} - {match.result.pts2}
          </>
        ) : (
          <span className="text-muted-foreground font-normal text-xs">vs</span>
        )}
      </div>
      <div className="flex-1 font-medium text-foreground truncate">
        {match.teams.team_2.name}
      </div>
    </div>
  );
}

function ClassificationTable({ stageData }: { stageData: StageData }) {
  const { classification } = stageData;
  if (!classification || classification.teams.length === 0) return null;

  const headers = classification.header.slice(0, 8);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
              <th className="py-3 pl-4 pr-2 font-medium">#</th>
              <th className="py-3 pr-4 font-medium">Equipe</th>
              {headers.map((h) => (
                <th
                  key={h.cod}
                  className="py-3 px-2 font-medium text-center"
                  title={h.title1}
                >
                  {h.title2}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classification.teams.map((team, idx) => (
              <tr
                key={team.id}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 pl-4 pr-2">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      idx < 3
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {team.position}
                  </span>
                </td>
                <td className="py-3 pr-4 font-medium text-foreground">
                  {team.name}
                </td>
                {team.tableData.slice(0, 8).map((d, i) => (
                  <td
                    key={i}
                    className="py-3 px-2 text-center text-muted-foreground tabular-nums"
                  >
                    {d.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoundSection({ round }: { round: RoundWithMatches }) {
  if (round.matches.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Swords className="h-4 w-4 text-muted-foreground" />
        {round.title}
      </h4>
      <div className="space-y-2">
        {round.matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}

function StageView({ stageData }: { stageData: StageData }) {
  const [showAllRounds, setShowAllRounds] = useState(false);

  const roundsWithMatches = stageData.rounds.filter((r) => r.matches.length > 0);
  const displayedRounds = showAllRounds
    ? roundsWithMatches
    : roundsWithMatches.slice(-3);
  const hasMore = roundsWithMatches.length > 3;

  return (
    <div className="space-y-8">
      {/* Classification */}
      {stageData.classification &&
        stageData.classification.teams.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Classificação
            </h3>
            <ClassificationTable stageData={stageData} />
          </div>
        )}

      {/* Rounds & Matches */}
      {roundsWithMatches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Jogos</h3>
            {hasMore && (
              <button
                onClick={() => setShowAllRounds(!showAllRounds)}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {showAllRounds
                  ? "Mostrar menos"
                  : `Ver todas as ${roundsWithMatches.length} rodadas`}
              </button>
            )}
          </div>
          <div className="space-y-6">
            {displayedRounds.map((round) => (
              <RoundSection key={round.id} round={round} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!stageData.classification ||
        stageData.classification.teams.length === 0) &&
        roundsWithMatches.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Dados desta fase ainda não disponíveis
          </p>
        )}
    </div>
  );
}

export function TournamentDetail({ data }: { data: TournamentDetailData }) {
  if (data.stagesData.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">
          Dados do campeonato ainda não disponíveis
        </p>
      </div>
    );
  }

  if (data.stagesData.length === 1) {
    return <StageView stageData={data.stagesData[0]} />;
  }

  return (
    <Tabs defaultValue={data.stagesData[0].stage.id}>
      <TabsList className="mb-6 flex-wrap">
        {data.stagesData.map((sd) => (
          <TabsTrigger key={sd.stage.id} value={sd.stage.id}>
            {sd.stage.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {data.stagesData.map((sd) => (
        <TabsContent key={sd.stage.id} value={sd.stage.id}>
          <StageView stageData={sd} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
