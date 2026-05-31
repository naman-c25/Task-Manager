import { QueryClient } from '@tanstack/react-query';

/**
 * Shared React Query client. Sensible defaults: data stays fresh for a minute,
 * failed queries retry once, and we don't refetch aggressively on window focus.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
