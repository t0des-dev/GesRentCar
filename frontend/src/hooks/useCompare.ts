"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareStore {
  selectedIds: number[];
  addToCompare: (id: number) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
}

export const useCompare = create<CompareStore>()(
  persist(
    (set) => ({
      selectedIds: [],
      addToCompare: (id) =>
        set((state) => ({
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds
            : [...state.selectedIds].slice(-3).concat(id), // Max 3 items
        })),
      removeFromCompare: (id) =>
        set((state) => ({
          selectedIds: state.selectedIds.filter((i) => i !== id),
        })),
      clearCompare: () => set({ selectedIds: [] }),
    }),
    {
      name: "compare-storage",
    }
  )
);
