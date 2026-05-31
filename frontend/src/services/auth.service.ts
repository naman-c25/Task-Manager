import { apiClient } from './apiClient';
import type { ApiResponse, AuthResult, LoginPayload, RegisterPayload, User } from '@/types';

/**
 * Auth API service. Each method returns the unwrapped `data` payload so callers
 * (hooks/components) never deal with the response envelope directly.
 */
export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResult> {
    const { data } = await apiClient.post<ApiResponse<AuthResult>>('/auth/register', payload);
    return data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResult> {
    const { data } = await apiClient.post<ApiResponse<AuthResult>>('/auth/login', payload);
    return data.data;
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return data.data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
};
