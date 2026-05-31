import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError.js';

// Request ko Zod schema ({ body, query, params } shape) se validate karta hai
// Parsed (aur coerced) values original ko replace kar dete hain taaki controller ko saaf typed input mile. Fail hone par 400 with field errors
export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return next(ApiError.badRequest('Validation failed', formatZodErrors(result.error)));
    }

    const data = result.data as { body?: unknown; query?: unknown; params?: unknown };
    if (data.body) req.body = data.body;
    if (data.query) Object.assign(req.query, data.query);
    if (data.params) Object.assign(req.params, data.params);
    next();
  };

// Zod ke nested error tree ko flat { field: message } map me badalte hain
function formatZodErrors(error: import('zod').ZodError): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const issue of error.issues) {
    // Pehla segment ("body"/"query"/"params") hata dete hain taaki key clean rahe
    const path = issue.path.slice(1).join('.') || issue.path.join('.');
    if (!flat[path]) flat[path] = issue.message;
  }
  return flat;
}
