import { env } from "../../../config/env";
import { getVisibleTournaments } from "./tournament.service";
import type {
  Tournament,
  TournamentData,
  CopafacilStage,
  CopafacilRound,
  CopafacilMatch,
  CopafacilClassification,
} from "@/types/copafacil";

const BASE_URL = "https://copafacil.com/api2";

async function copafacilFetch<T>(path: string): Promise<T | null> {
  const apiKey = env.COPAFACIL_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "x-api-key": apiKey,
        lang: "pt",
        gmt: "-3",
      },
      next: { revalidate: 600 },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// --- Individual API calls ---

export async function getStages(tournamentId: string): Promise<CopafacilStage[]> {
  const data = await copafacilFetch<CopafacilStage[]>(`/tournament/${tournamentId}/stages`);
  return data || [];
}

export async function getClassification(
  tournamentId: string,
  stageId: string
): Promise<CopafacilClassification | null> {
  return copafacilFetch<CopafacilClassification>(
    `/tournament/${tournamentId}/stages/${stageId}/table`
  );
}

export async function getRounds(
  tournamentId: string,
  stageId: string
): Promise<CopafacilRound[]> {
  const data = await copafacilFetch<CopafacilRound[]>(
    `/tournament/${tournamentId}/stages/${stageId}/rounds`
  );
  return data || [];
}

export async function getMatches(
  tournamentId: string,
  stageId: string,
  roundId: string
): Promise<CopafacilMatch[]> {
  const data = await copafacilFetch<CopafacilMatch[]>(
    `/tournament/${tournamentId}/stages/${stageId}/rounds/${roundId}/matchs`
  );
  return data || [];
}

export async function getTeams(
  tournamentId: string
): Promise<{ teams: { name: string }[]; header: { key: string; title: string }[] } | null> {
  return copafacilFetch(`/tournament/${tournamentId}/teams`);
}

// --- Aggregated data for landing page ---

export async function getTournamentData(tournament: Tournament): Promise<TournamentData> {
  const stages = await getStages(tournament.copafacilId);

  let classification: CopafacilClassification | null = null;
  let recentMatches: CopafacilMatch[] = [];

  // Get classification from the first round-robin stage (league table)
  const roundRobinStage = stages.find((s) => s.round_robin);
  const firstStage = roundRobinStage || stages[0];

  if (firstStage) {
    classification = await getClassification(tournament.copafacilId, firstStage.id);

    // Get rounds and fetch matches from the most recent round
    const rounds = await getRounds(tournament.copafacilId, firstStage.id);
    if (rounds.length > 0) {
      // Try the last round first (most recent matches)
      const lastRound = rounds[rounds.length - 1];
      recentMatches = await getMatches(
        tournament.copafacilId,
        firstStage.id,
        lastRound.id
      );
    }
  }

  // Get teams count
  const teamsData = await getTeams(tournament.copafacilId);
  const teamsCount = teamsData?.teams?.length || classification?.teams?.length || 0;

  return {
    tournament,
    stages,
    classification,
    recentMatches,
    teamsCount,
  };
}

export async function getAllTournamentsData(): Promise<TournamentData[]> {
  const tournaments = await getVisibleTournaments();
  if (tournaments.length === 0) return [];

  const results = await Promise.all(
    tournaments.map((t) => getTournamentData(t).catch(() => null))
  );

  return results.filter((r): r is TournamentData => r !== null);
}
