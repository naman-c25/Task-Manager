import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { taskFormSchema, type TaskFormValues } from '@/lib/validations';
import { STATUS_LABELS } from './taskConfig';
import type { Task, TaskStatus } from '@/types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Edit ke time milta hai; create me nahi
  task?: Task | null;
  // Kisi specific column se create karne pe default status (future use)
  defaultStatus?: TaskStatus;
  isSubmitting?: boolean;
  onSubmit: (values: TaskFormValues) => void;
}

const STATUS_OPTIONS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

// Modal me create/edit form. Dono ke liye same hai; task hai ya nahi usse mode decide hota hai
export function TaskFormModal({
  isOpen,
  onClose,
  task,
  defaultStatus = 'TODO',
  isSubmitting = false,
  onSubmit,
}: TaskFormModalProps) {
  const isEditing = Boolean(task);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: { title: '', description: '', status: defaultStatus },
  });

  // Jab bhi modal khulta hai form values sync kar dete hain (naya ya edit)
  useEffect(() => {
    if (isOpen) {
      reset({
        title: task?.title ?? '',
        description: task?.description ?? '',
        status: task?.status ?? defaultStatus,
      });
    }
  }, [isOpen, task, defaultStatus, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit task' : 'New task'}
      description={isEditing ? 'Update the details of your task.' : 'Add a task to your board.'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Title"
          placeholder="e.g. Design the landing page"
          autoFocus
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="space-y-1.5">
          <label htmlFor="task-description" className="block text-sm font-medium text-foreground">
            Description <span className="text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="task-description"
            rows={3}
            placeholder="Add more detail…"
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-xs font-medium text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="task-status" className="block text-sm font-medium text-foreground">
            Status
          </label>
          <select
            id="task-status"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            {...register('status')}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? 'Save changes' : 'Create task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
