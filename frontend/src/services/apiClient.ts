import axios, { AxiosError, type AxiosInstance } from 'axios';
import { env } from '@/lib/env';
import { getAuthToken, useAuthStore } from '@/store/auth.store';
import type { ApiErrorResponse, NormalizedApiError } from '@/types';

// Pre-configured Axios instance. Do interceptors saara kaam karte hain -
// request: auth store se Bearer token laga deta hai
// response: API envelope unwrap karta hai aur har error ko ek consistent { message, status, fieldErrors } shape me badal deta hai
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Har outgoing request pe auth token laga do
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response aur error ko normalize karo
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status ?? 0;

    // 401 pe auto-logout taaki purana/expired token ghost session na chhode
    if (status === 401) {
      useAuthStore.getState().clearAuth();
    }

    const normalized: NormalizedApiError = {
      status,
      message:
        error.response?.data?.message ??
        (status === 0
          ? 'Network error — please check your connection.'
          : 'Something went wrong. Please try again.'),
      fieldErrors: error.response?.data?.errors,
    };

    return Promise.reject(normalized);
  },
);
