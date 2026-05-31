import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface UiState {
  /** Desktop sidebar collapsed state. */
  isSidebarCollapsed: boolean;
  /** Mobile slide-over navigation open state (never persisted). */
  isMobileNavOpen: boolean;
  theme: Theme;

  toggleSidebar: () => void;
  setMobileNav: (open: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      isMobileNavOpen: false,
      theme: 'dark',

      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      setMobileNav: (open) => set({ isMobileNavOpen: open }),

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'taskflow-ui',
      partialize: (state) => ({
        isSidebarCollapsed: state.isSidebarCollapsed,
        theme: state.theme,
      }),
    },
  ),
);
