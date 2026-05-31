/** The success envelope every endpoint returns. Mirrors the backend contract. */
export interface ApiResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

/** The failure envelope, surfaced by the axios interceptor as a normalized error. */
export interface ApiErrorResponse {
  success: false;
  message: string;
  /** Field-level validation errors, keyed by field name. */
  errors?: Record<string, string>;
}

/** Normalized error thrown by the API layer and consumed across the app. */
export interface NormalizedApiError {
  message: string;
  status: number;
  fieldErrors?: Record<string, string>;
}
