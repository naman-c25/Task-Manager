import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { tokenService } from '../services/token.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { extractBearerToken, verifyAccessToken } from '../utils/token.js';

// Auth ka HTTP layer. Controller sirf Express aur service ke beech translate karta hai, business logic yahan nahi hai
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

  // Stateless JWT delete nahi ho sakta, isliye jo token aaya hai usko Redis denylist me daal ke revoke kar dete hain (jab tak natural expire na ho)
  logout: asyncHandler(async (req: Request, res: Response) => {
    const token = extractBearerToken(req.headers.authorization);
    if (token) {
      try {
        await tokenService.revoke(verifyAccessToken(token));
      } catch {
        // Token waise hi invalid/expired hai, revoke karne ko kuch nahi
      }
    }
    return sendSuccess(res, 200, { message: 'Logged out successfully' });
  }),
};
