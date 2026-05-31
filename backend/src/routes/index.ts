import { Router } from 'express';
import authRoutes from './auth.routes.js';
import taskRoutes from './task.routes.js';

const router = Router();

/**
 * API v1 router. Mount new feature routers here — they're namespaced under
 * /api/v1 automatically.
 */
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export default router;
