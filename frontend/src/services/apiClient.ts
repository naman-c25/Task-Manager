import axios, { AxiosError, type AxiosInstance } from 'axios';
import { env } from '@/lib/env';
import { getAuthToken, useAuthStore } from '@/store/auth.store';
import type { ApiErrorResponse, NormalizedApiError } from '@/types';

/**
 * Pre-configured Axios instance. Two interceptors do the heavy lifting:
 *  - request: attaches the Bearer token from the auth store
 *  - response: unwraps the API envelope and normalizes every error into a
 *    consistent { message, status, fieldErrors } shape
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the auth token to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize responses and errors.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status ?? 0;

    // Auto-logout on 401 so a stale/expired token doesn't leave a ghost session.
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
