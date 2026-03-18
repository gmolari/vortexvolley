import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSaleItems,
  getActiveSaleItems,
  getSaleItemBySlug,
  getSaleItemById,
  createSaleItem,
  updateSaleItem,
  deleteSaleItem,
  addImage,
  removeImage,
  addField,
  updateField,
  deleteField,
} from "@/lib/services/sale-item.service";
import type { CreateSaleItemInput, UpdateSaleItemInput } from "@/lib/validators";

const KEYS = {
  all: ["sale-items"] as const,
  list: () => [...KEYS.all, "list"] as const,
  active: () => [...KEYS.all, "active"] as const,
  detail: (slug: string) => [...KEYS.all, "detail", slug] as const,
  byId: (id: string) => [...KEYS.all, "by-id", id] as const,
};

export function useSaleItems() {
  return useQuery({ queryKey: KEYS.list(), queryFn: getSaleItems });
}

export function useActiveSaleItems() {
  return useQuery({
    queryKey: KEYS.active(),
    queryFn: getActiveSaleItems,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaleItemBySlug(slug: string) {
  return useQuery({
    queryKey: KEYS.detail(slug),
    queryFn: () => getSaleItemBySlug(slug),
    enabled: !!slug,
  });
}

export function useSaleItemById(id: string) {
  return useQuery({
    queryKey: KEYS.byId(id),
    queryFn: () => getSaleItemById(id),
    enabled: !!id,
  });
}

export function useCreateSaleItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSaleItemInput) => createSaleItem(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateSaleItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSaleItemInput }) =>
      updateSaleItem(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteSaleItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSaleItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useAddImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { saleItemId: string; url: string; alt: string | null; order: number }) =>
      addImage(data.saleItemId, data.url, data.alt, data.order),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useRemoveImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeImage(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useAddField() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addField,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateField() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateField>[1] }) =>
      updateField(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteField() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteField(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}
