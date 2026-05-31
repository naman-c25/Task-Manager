import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import type { LoginPayload, RegisterPayload, NormalizedApiError } from '@/types';

/**
 * Auth actions as React Query mutations. They own the side effects (store
 * updates, toasts, redirects) so pages stay declarative.
 */
export function useAuthMutations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const login = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (result) => {
      setAuth(result);
      toast.success(`Welcome back, ${result.user.name.split(' ')[0]}!`);
      navigate('/dashboard', { replace: true });
    },
    onError: (error: NormalizedApiError) => toast.error(error.message),
  });

  const register = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (result) => {
      setAuth(result);
      toast.success('Account created — welcome to TaskFlow!');
      navigate('/dashboard', { replace: true });
    },
    onError: (error: NormalizedApiError) => toast.error(error.message),
  });

  const logout = useMutation({
    mutationFn: () => authApi.logout(),
    // Optimistic: clear locally regardless of the network result.
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Signed out');
      navigate('/login', { replace: true });
    },
  });

  return { login, register, logout };
}
