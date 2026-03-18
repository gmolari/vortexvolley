import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  getOrders,
  getOrderById,
  getOrdersBySaleItem,
  updateOrderStatus,
  deleteOrder,
  getOrdersForExport,
} from "@/lib/services/order.service";
import type { CreateOrderInput } from "@/lib/validators";

const KEYS = {
  all: ["orders"] as const,
  list: (filters?: object) => [...KEYS.all, "list", filters] as const,
  detail: (id: string) => [...KEYS.all, "detail", id] as const,
  bySaleItem: (id: string) => [...KEYS.all, "by-sale-item", id] as const,
  export: (id?: string) => [...KEYS.all, "export", id] as const,
};

export function useOrders(filters?: {
  saleItemId?: string;
  search?: string;
  status?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: KEYS.list(filters),
    queryFn: () => getOrders(filters),
  });
}

export function useOrderById(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
}

export function useOrdersBySaleItem(saleItemId: string) {
  return useQuery({
    queryKey: KEYS.bySaleItem(saleItemId),
    queryFn: () => getOrdersBySaleItem(saleItemId),
    enabled: !!saleItemId,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderInput) => createOrder(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED" }) =>
      updateOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useExportOrders(saleItemId?: string) {
  return useQuery({
    queryKey: KEYS.export(saleItemId),
    queryFn: () => getOrdersForExport(saleItemId),
    enabled: false,
  });
}
