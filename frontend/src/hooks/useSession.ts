import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

/**
 * Bootstraps the auth session on app load. If a persisted token exists, it's
 * revalidated against /me; a failure clears the stale session. `isInitialized`
 * gates the router so protected routes don't flash before we know who's logged in.
 */
export function useSession() {
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  const query = useQuery({
    queryKey: ['session'],
    queryFn: authApi.me,
    enabled: Boolean(token),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    // No token → nothing to validate, session is "initialized" immediately.
    if (!token) {
      setInitialized(true);
      return;
    }
    if (query.isSuccess && query.data) {
      setUser(query.data);
      setInitialized(true);
    }
    if (query.isError) {
      // The 401 interceptor already cleared the token; ensure local consistency.
      clearAuth();
      setInitialized(true);
    }
  }, [token, query.isSuccess, query.isError, query.data, setUser, clearAuth, setInitialized]);

  return { isLoading: Boolean(token) && query.isLoading };
}
