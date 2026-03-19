import { env } from "../../../config/env";
import { getVisibleTournaments, getTournamentById } from "./tournament.service";
import { createCopafacilLog } from "./copafacil-log.service";
import type {
  Tournament,
  TournamentData,
  TournamentDetailData,
  StageData,
  CopafacilStage,
  CopafacilRound,
  CopafacilMatch,
  CopafacilClassification,
} from "@/types/copafacil";

const BASE_URL = "https://copafacil.com/api2";

async function copafacilFetch<T>(path: string, context?: string): Promise<T | null> {
  const apiKey = env.COPAFACIL_API_KEY;
  if (!apiKey) {
    createCopafacilLog({
      path,
      success: false,
      error: "COPAFACIL_API_KEY not configured",
      context,
    });
    return null;
  }

  const start = Date.now();

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "x-api-key": apiKey,
        lang: "pt",
        gmt: "-3",
      },
      next: { revalidate: 600 },
    });

    const durationMs = Date.now() - start;
    const bodyText = await res.text();

    if (!res.ok) {
      createCopafacilLog({
        path,
        statusCode: res.status,
        durationMs,
        success: false,
        error: `HTTP ${res.status} ${res.statusText}`,
        responsePreview: bodyText.slice(0, 500),
        context,
      });
      return null;
    }

    const data = JSON.parse(bodyText) as T;

    createCopafacilLog({
      path,
      statusCode: res.status,
      durationMs,
      success: true,
      responsePreview: bodyText.slice(0, 300),
      context,
    });

    return data;
  } catch (err) {
    const durationMs = Date.now() - start;
    createCopafacilLog({
      path,
      durationMs,
      success: false,
      error: err instanceof Error ? err.message : String(err),
      context,
    });
    return null;
  }
}

// --- Individual API calls ---

export async function getStages(tournamentId: string, context?: string): Promise<CopafacilStage[]> {
  const data = await copafacilFetch<CopafacilStage[]>(
    `/tournament/${tournamentId}/stages`,
    context ?? "getStages"
  );
  return data || [];
}

export async function getClassification(
  tournamentId: string,
  stageId: string,
  context?: string
): Promise<CopafacilClassification | null> {
  return copafacilFetch<CopafacilClassification>(
    `/tournament/${tournamentId}/stages/${stageId}/table`,
    context ?? "getClassification"
  );
}

export async function getRounds(
  tournamentId: string,
  stageId: string,
  context?: string
): Promise<CopafacilRound[]> {
  const data = await copafacilFetch<CopafacilRound[]>(
    `/tournament/${tournamentId}/stages/${stageId}/rounds`,
    context ?? "getRounds"
  );
  return data || [];
}

export async function getMatches(
  tournamentId: string,
  stageId: string,
  roundId: string,
  context?: string
): Promise<CopafacilMatch[]> {
  const data = await copafacilFetch<CopafacilMatch[]>(
    `/tournament/${tournamentId}/stages/${stageId}/rounds/${roundId}/matchs`,
    context ?? "getMatches"
  );
  return data || [];
}

export async function getTeams(
  tournamentId: string,
  context?: string
): Promise<{ teams: { name: string }[]; header: { key: string; title: string }[] } | null> {
  return copafacilFetch(
    `/tournament/${tournamentId}/teams`,
    context ?? "getTeams"
  );
}

// --- Test API connection ---

export async function testConnection(copafacilId: string): Promise<{
  ok: boolean;
  stages: number;
  teams: number;
  name?: string;
}> {
  try {
    const [stages, teamsData] = await Promise.all([
      getStages(copafacilId, "testConnection"),
      getTeams(copafacilId, "testConnection"),
    ]);

    return {
      ok: stages.length > 0 || (teamsData?.teams?.length ?? 0) > 0,
      stages: stages.length,
      teams: teamsData?.teams?.length ?? 0,
    };
  } catch {
    return { ok: false, stages: 0, teams: 0 };
  }
}

// --- Aggregated data for landing page (summary) ---

export async function getTournamentData(tournament: Tournament): Promise<TournamentData> {
  const ctx = `landing:${tournament.copafacilId}`;
  const stages = await getStages(tournament.copafacilId, ctx);

  let classification: CopafacilClassification | null = null;
  let recentMatches: CopafacilMatch[] = [];

  const roundRobinStage = stages.find((s) => s.round_robin);
  const firstStage = roundRobinStage || stages[0];

  if (firstStage) {
    classification = await getClassification(tournament.copafacilId, firstStage.id, ctx);

    const rounds = await getRounds(tournament.copafacilId, firstStage.id, ctx);
    if (rounds.length > 0) {
      const lastRound = rounds[rounds.length - 1];
      recentMatches = await getMatches(
        tournament.copafacilId,
        firstStage.id,
        lastRound.id,
        ctx
      );
    }
  }

  const teamsData = await getTeams(tournament.copafacilId, ctx);
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

// --- Detailed data for individual tournament page ---

async function getStageData(
  copafacilId: string,
  stage: CopafacilStage
): Promise<StageData> {
  const ctx = `detail:${copafacilId}`;
  const [classification, rounds] = await Promise.all([
    getClassification(copafacilId, stage.id, ctx),
    getRounds(copafacilId, stage.id, ctx),
  ]);

  const roundsWithMatches = await Promise.all(
    rounds.map(async (round) => {
      const matches = await getMatches(copafacilId, stage.id, round.id, ctx);
      return { ...round, matches };
    })
  );

  return {
    stage,
    classification,
    rounds: roundsWithMatches,
  };
}

export async function getTournamentDetailData(
  tournamentId: string
): Promise<TournamentDetailData | null> {
  const tournament = await getTournamentById(tournamentId);
  if (!tournament) return null;

  const ctx = `detail:${tournament.copafacilId}`;
  const [stages, teamsData] = await Promise.all([
    getStages(tournament.copafacilId, ctx),
    getTeams(tournament.copafacilId, ctx),
  ]);

  const stagesData = await Promise.all(
    stages.map((stage) => getStageData(tournament.copafacilId, stage))
  );

  const teamsCount = teamsData?.teams?.length || 0;

  return {
    tournament,
    stagesData,
    teamsCount,
  };
}
