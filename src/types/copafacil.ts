export interface Championship {
  id: string;
  name: string;
  status: "active" | "finished" | "upcoming";
  sport: string;
  startDate: string;
  endDate?: string;
  teamsCount: number;
}
