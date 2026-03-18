import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSections,
  getVisibleSections,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
  createLandingItem,
  updateLandingItem,
  deleteLandingItem,
  reorderLandingItems,
} from "@/lib/services/landing.service";
import type { CreateLandingSectionInput, UpdateLandingSectionInput } from "@/lib/validators";
import type { CreateLandingItemInput, UpdateLandingItemInput } from "@/lib/validators";

const KEYS = {
  all: ["landing"] as const,
  sections: () => [...KEYS.all, "sections"] as const,
  visible: () => [...KEYS.all, "visible"] as const,
};

export function useSections() {
  return useQuery({ queryKey: KEYS.sections(), queryFn: getSections });
}

export function useVisibleSections() {
  return useQuery({
    queryKey: KEYS.visible(),
    queryFn: getVisibleSections,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLandingSectionInput) => createSection(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLandingSectionInput }) =>
      updateSection(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSection(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useReorderSections() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => reorderSections(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useCreateLandingItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLandingItemInput) => createLandingItem(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateLandingItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLandingItemInput }) =>
      updateLandingItem(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteLandingItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLandingItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useReorderLandingItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, ids }: { sectionId: string; ids: string[] }) =>
      reorderLandingItems(sectionId, ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}
