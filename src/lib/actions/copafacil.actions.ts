"use server";

import {
  getAllTournamentsData,
  getTournamentDetailData,
  testConnection,
} from "@/lib/services/copafacil.service";

export async function getAllTournamentsDataAction() {
  return getAllTournamentsData();
}

export async function getTournamentDetailDataAction(tournamentId: string) {
  return getTournamentDetailData(tournamentId);
}

export async function testCopafacilConnectionAction(copafacilId: string) {
  return testConnection(copafacilId);
}
