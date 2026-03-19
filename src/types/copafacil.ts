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

// Round with matches loaded
export interface RoundWithMatches extends CopafacilRound {
  matches: CopafacilMatch[];
}

// Full stage data (classification + all rounds with matches)
export interface StageData {
  stage: CopafacilStage;
  classification: CopafacilClassification | null;
  rounds: RoundWithMatches[];
}

// Aggregated data for homepage summary
export interface TournamentData {
  tournament: Tournament;
  stages: CopafacilStage[];
  classification: CopafacilClassification | null;
  recentMatches: CopafacilMatch[];
  teamsCount: number;
}

// Full detail data for individual tournament page
export interface TournamentDetailData {
  tournament: Tournament;
  stagesData: StageData[];
  teamsCount: number;
}
