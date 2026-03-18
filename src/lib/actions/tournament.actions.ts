"use server";

import {
  getTournaments,
  createTournament,
  updateTournament,
  deleteTournament,
} from "@/lib/services/tournament.service";

export async function getTournamentsAction() {
  return getTournaments();
}

export async function createTournamentAction(data: {
  copafacilId: string;
  name: string;
  visible?: boolean;
  order?: number;
}) {
  return createTournament(data);
}

export async function updateTournamentAction(
  id: string,
  data: Partial<{ copafacilId: string; name: string; visible: boolean; order: number }>
) {
  return updateTournament(id, data);
}

export async function deleteTournamentAction(id: string) {
  return deleteTournament(id);
}
