import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResult, User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  // Jab session backend se verify ho jaaye (/me) tab true
  isInitialized: boolean;
  isAuthenticated: boolean;

  setAuth: (auth: AuthResult) => void;
  setUser: (user: User) => void;
  setInitialized: (value: boolean) => void;
  clearAuth: () => void;
}

// Auth session store. Token aur user localStorage me persist hote hain taaki refresh ke baad bhi login bana rahe
// Boot pe useSession token ko /me se revalidate karta hai aur isInitialized flip kar deta hai
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
      // Sirf utna hi persist karte hain jitna session restore karne ke liye chahiye
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// React ke bahar (jaise axios interceptor) token chahiye toh ye non-reactive accessor
export const getAuthToken = () => useAuthStore.getState().token;
