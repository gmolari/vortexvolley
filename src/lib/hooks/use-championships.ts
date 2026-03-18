"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getChampionships,
  getActiveChampionships,
  getUpcomingChampionships,
} from "@/lib/services/copafacil.service";

export function useChampionships() {
  return useQuery({
    queryKey: ["championships"],
    queryFn: getChampionships,
    staleTime: 10 * 60 * 1000,
  });
}

export function useActiveChampionships() {
  return useQuery({
    queryKey: ["championships", "active"],
    queryFn: getActiveChampionships,
    staleTime: 10 * 60 * 1000,
  });
}

export function useUpcomingChampionships() {
  return useQuery({
    queryKey: ["championships", "upcoming"],
    queryFn: getUpcomingChampionships,
    staleTime: 10 * 60 * 1000,
  });
}
