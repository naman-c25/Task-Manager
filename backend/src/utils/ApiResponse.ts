import type { Response } from 'express';

interface SuccessPayload<T> {
  message?: string;
  data?: T;
}

/**
 * Standard success envelope so every endpoint returns a predictable shape:
 * { success, message, data }. The frontend can rely on this contract.
 */
export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  { message = 'Success', data }: SuccessPayload<T>,
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
}
