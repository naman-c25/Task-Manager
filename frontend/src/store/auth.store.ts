import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResult, User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  /** True once the session has been verified against the backend (/me). */
  isInitialized: boolean;
  isAuthenticated: boolean;

  setAuth: (auth: AuthResult) => void;
  setUser: (user: User) => void;
  setInitialized: (value: boolean) => void;
  clearAuth: () => void;
}

/**
 * Auth session store. The token + user are persisted to localStorage so the
 * session survives refreshes (persistent login). On boot, `useSession` revalidates
 * the token against /me and flips `isInitialized`.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isInitialized: false,
      isAuthenticated: false,

      setAuth: ({ user, token }) =>
        set({ user, token, isAuthenticated: true }),

      setUser: (user) => set({ user }),

      setInitialized: (value) => set({ isInitialized: value }),

      clearAuth: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'taskflow-auth',
      // Only persist what we need to restore a session.
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

/** Non-reactive token accessor for use outside React (e.g. axios interceptors). */
export const getAuthToken = () => useAuthStore.getState().token;
