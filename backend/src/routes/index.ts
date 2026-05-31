import { Router } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

/**
 * API v1 router. Mount new feature routers here (e.g. tasks) — they will be
 * namespaced under /api/v1 automatically.
 */
router.use('/auth', authRoutes);

export default router;
