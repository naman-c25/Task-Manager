import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { tokenService } from '../services/token.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { extractBearerToken, verifyAccessToken } from '../utils/token.js';

/**
 * HTTP layer for authentication. Controllers translate between Express and the
 * service layer only — no business logic lives here.
 */
export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    return sendSuccess(res, 201, { message: 'Account created successfully', data: result });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    return sendSuccess(res, 200, { message: 'Logged in successfully', data: result });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const user = await authService.getProfile(req.user.id);
    return sendSuccess(res, 200, { message: 'Profile fetched', data: { user } });
  }),

  /**
   * Stateless JWTs can't be "deleted", so we revoke the presented token by
   * adding its jti to the Redis denylist until it would naturally expire.
   */
  logout: asyncHandler(async (req: Request, res: Response) => {
    const token = extractBearerToken(req.headers.authorization);
    if (token) {
      try {
        await tokenService.revoke(verifyAccessToken(token));
      } catch {
        // Token already invalid/expired — nothing to revoke.
      }
    }
    return sendSuccess(res, 200, { message: 'Logged out successfully' });
  }),
};
