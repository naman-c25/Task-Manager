/**
 * Centralized, typed access to environment variables. Importing from here
 * (instead of touching import.meta.env directly) keeps env usage discoverable
 * and easy to mock in tests.
 */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1',
} as const;
