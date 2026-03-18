// DB tournament record
export interface Tournament {
  id: string;
  copafacilId: string;
  name: string;
  visible: boolean;
  order: number;
}

// CopFacil API types
export interface CopafacilStage {
  id: string;
  title: string;
  last_modify: number;
  round_robin: boolean;
}

export interface CopafacilRound {
  id: string;
  title: string;
  last_modify: number;
}

export interface CopafacilMatch {
  id: string;
  title: string;
  status: string;
  teams: {
    team_1: { name: string };
    team_2: { name: string };
  };
  result: {
    pts1: number;
    pts2: number;
    penalt1: number;
    penalt2: number;
  };
}

export interface CopafacilTableTeam {
  name: string;
  position: number;
  photo: string | null;
  id: string;
  tableData: { cod: number; value: string }[];
}

export interface CopafacilClassification {
  header: { title1: string; title2: string; cod: string }[];
  teams: CopafacilTableTeam[];
}

export interface CopafacilTeam {
  name: string;
  [key: string]: unknown;
}

export interface CopafacilRanking {
  id: string;
  title1: string;
  title2: string;
  headers: string[];
}

export interface CopafacilPlayer {
  name: string;
  nickName: string;
  position: number;
  photo: string | null;
  teamName: string;
  teamId: string;
  teamPhoto: string;
  playerId: string;
  data: string[];
}

// Aggregated data for display
export interface TournamentData {
  tournament: Tournament;
  stages: CopafacilStage[];
  classification: CopafacilClassification | null;
  recentMatches: CopafacilMatch[];
  teamsCount: number;
}

// Keep backward compat for any old references
export interface Championship {
  id: string;
  name: string;
  status: "active" | "finished" | "upcoming";
  sport: string;
  startDate: string;
  endDate?: string;
  teamsCount: number;
}
