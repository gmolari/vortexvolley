"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTournamentsAction,
  createTournamentAction,
  updateTournamentAction,
  deleteTournamentAction,
} from "@/lib/actions/tournament.actions";

const KEYS = {
  all: ["tournaments"] as const,
};

export function useTournaments() {
  return useQuery({ queryKey: KEYS.all, queryFn: getTournamentsAction });
}

export function useCreateTournament() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { copafacilId: string; name: string; visible?: boolean; order?: number }) =>
      createTournamentAction(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateTournament() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{ copafacilId: string; name: string; visible: boolean; order: number }>;
    }) => updateTournamentAction(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteTournament() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTournamentAction(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}
