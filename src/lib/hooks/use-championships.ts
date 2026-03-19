"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllTournamentsDataAction, getTournamentDetailDataAction } from "@/lib/actions/copafacil.actions";

export function useTournamentsData() {
  return useQuery({
    queryKey: ["tournaments-data"],
    queryFn: getAllTournamentsDataAction,
    staleTime: 10 * 60 * 1000,
  });
}

export function useTournamentDetail(tournamentId: string) {
  return useQuery({
    queryKey: ["tournament-detail", tournamentId],
    queryFn: () => getTournamentDetailDataAction(tournamentId),
    staleTime: 10 * 60 * 1000,
    enabled: !!tournamentId,
  });
}
