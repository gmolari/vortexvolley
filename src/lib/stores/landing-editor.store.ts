import { create } from "zustand";

interface LandingEditorStore {
  editingSection: string | null;
  editingItem: string | null;
  isDragging: boolean;
  setEditingSection: (id: string | null) => void;
  setEditingItem: (id: string | null) => void;
  setIsDragging: (v: boolean) => void;
}

export const useLandingEditorStore = create<LandingEditorStore>((set) => ({
  editingSection: null,
  editingItem: null,
  isDragging: false,
  setEditingSection: (id) => set({ editingSection: id }),
  setEditingItem: (id) => set({ editingItem: id }),
  setIsDragging: (v) => set({ isDragging: v }),
}));
