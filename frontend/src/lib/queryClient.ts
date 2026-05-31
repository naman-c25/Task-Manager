import { QueryClient } from '@tanstack/react-query';

// Shared React Query client. Sensible defaults - data ek minute fresh rehta hai, fail hui query ek baar retry hoti hai, aur window focus pe baar baar refetch nahi karte
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
