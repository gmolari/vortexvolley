"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllTournamentsDataAction } from "@/lib/actions/copafacil.actions";

export function useTournamentsData() {
  return useQuery({
    queryKey: ["tournaments-data"],
    queryFn: getAllTournamentsDataAction,
    staleTime: 10 * 60 * 1000,
  });
}
