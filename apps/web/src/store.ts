import { create } from 'zustand';

interface AppState {
  currentPage: number;
  totalPages: number;
  isDark: boolean;
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  toggleDarkMode: () => void;
}

export const useStore = create<AppState>((set) => ({
  currentPage: 1,
  totalPages: 0,
  isDark: false,
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (total) => set({ totalPages: total }),
  toggleDarkMode: () => set((state) => ({ isDark: !state.isDark })),
}));
