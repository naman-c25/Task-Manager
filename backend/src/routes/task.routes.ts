import { Router } from 'express';
import { taskController } from '../controllers/task.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from '../validations/task.validation.js';

const router = Router();

// Every task route requires a valid session.
router.use(requireAuth);

router.get('/', taskController.list);
router.post('/', validate(createTaskSchema), taskController.create);
router.patch('/:id', validate(updateTaskSchema), taskController.update);
router.delete('/:id', validate(taskIdSchema), taskController.remove);

export default router;
