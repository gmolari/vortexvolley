import { create } from "zustand";

interface OrderFilters {
  saleItemId?: string;
  search?: string;
  status?: string;
}

interface AdminStore {
  selectedSaleItemId: string | null;
  setSelectedSaleItemId: (id: string | null) => void;
  orderFilters: OrderFilters;
  setOrderFilters: (filters: Partial<OrderFilters>) => void;
  resetOrderFilters: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  selectedSaleItemId: null,
  setSelectedSaleItemId: (id) => set({ selectedSaleItemId: id }),
  orderFilters: {},
  setOrderFilters: (filters) =>
    set((state) => ({
      orderFilters: { ...state.orderFilters, ...filters },
    })),
  resetOrderFilters: () => set({ orderFilters: {} }),
}));
