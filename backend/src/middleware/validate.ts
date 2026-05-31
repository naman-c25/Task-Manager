import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError.js';

/**
 * Validate the request against a Zod schema shaped as { body, query, params }.
 * Parsed (and coerced) values replace the originals so controllers receive
 * clean, typed input. Validation failures become a 400 with field-level errors.
 */
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

/** Collapse Zod's nested error tree into a flat { field: message } map. */
function formatZodErrors(error: import('zod').ZodError): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const issue of error.issues) {
    // Drop the leading segment ("body"/"query"/"params") for a clean key.
    const path = issue.path.slice(1).join('.') || issue.path.join('.');
    if (!flat[path]) flat[path] = issue.message;
  }
  return flat;
}
