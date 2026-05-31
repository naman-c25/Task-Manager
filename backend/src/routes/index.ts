import { Router } from 'express';
import authRoutes from './auth.routes.js';
import taskRoutes from './task.routes.js';

const router = Router();

// API v1 router. Naye feature routers yahin mount karo, ye apne aap /api/v1 ke andar aa jaayenge
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export default router;
