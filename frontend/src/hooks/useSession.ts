import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

// App load pe auth session ko bootstrap karta hai. Agar persisted token hai toh /me se revalidate karta hai, fail hone par stale session clear kar deta hai
// isInitialized router ko gate karta hai taaki protected routes pe banda kaun hai ye pata chalne se pehle screen flash na ho
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
    // Token hi nahi hai toh validate karne ko kuch nahi, session turant initialized
    if (!token) {
      setInitialized(true);
      return;
    }
    if (query.isSuccess && query.data) {
      setUser(query.data);
      setInitialized(true);
    }
    if (query.isError) {
      // 401 interceptor pehle hi token clear kar chuka, yahan bas local state consistent kar dete hain
      clearAuth();
      setInitialized(true);
    }
  }, [token, query.isSuccess, query.isError, query.data, setUser, clearAuth, setInitialized]);

  return { isLoading: Boolean(token) && query.isLoading };
}
