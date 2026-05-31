import type { Response } from 'express';

interface SuccessPayload<T> {
  message?: string;
  data?: T;
}

// Har success response ka ek hi shape rahe - { success, message, data } - taaki frontend ko bharosa rahe response kaisa aayega
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
