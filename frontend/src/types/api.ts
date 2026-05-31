// Success envelope jo har endpoint return karta hai. Backend ke contract se match karta hai
export interface ApiResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

// Failure envelope, jise axios interceptor normalize karke aage bhejta hai
export interface ApiErrorResponse {
  success: false;
  message: string;
  // Field-level validation errors, field naam se keyed
  errors?: Record<string, string>;
}

// Normalized error jo API layer throw karta hai aur pure app me use hota hai
export interface NormalizedApiError {
  message: string;
  status: number;
  fieldErrors?: Record<string, string>;
}
