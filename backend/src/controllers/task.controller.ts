import type { Request, Response } from 'express';
import { taskService } from '../services/task.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';

// Task ka HTTP layer. requireAuth pehle hi chal chuka hota hai isliye req.user pakka milega
export const taskController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const tasks = await taskService.list(req.user!.id);
    return sendSuccess(res, 200, { message: 'Tasks fetched', data: { tasks } });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const task = await taskService.create(req.user!.id, req.body);
    return sendSuccess(res, 201, { message: 'Task created', data: { task } });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const task = await taskService.update(req.user!.id, req.params.id, req.body);
    return sendSuccess(res, 200, { message: 'Task updated', data: { task } });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await taskService.remove(req.user!.id, req.params.id);
    return sendSuccess(res, 200, { message: 'Task deleted', data: { id: req.params.id } });
  }),
};
