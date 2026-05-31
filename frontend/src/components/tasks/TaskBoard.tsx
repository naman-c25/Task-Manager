import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useTasks, useTaskMutations } from '@/hooks/useTasks';
import type { Task, TaskStatus } from '@/types';
import type { TaskFormValues } from '@/lib/validations';
import { TASK_COLUMNS } from './taskConfig';
import { TaskColumn } from './TaskColumn';
import { TaskFormModal } from './TaskFormModal';

/**
 * The full task board: three columns fed by live data, with create/edit/delete
 * and column-to-column moves — all optimistic. Drop this anywhere (Dashboard,
 * Tasks page) and it's self-contained.
 */
export function TaskBoard() {
  const { data: tasks, isLoading, isError, refetch } = useTasks();
  const { createTask, updateTask, deleteTask } = useTaskMutations();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Group tasks into their columns in a single pass.
  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { TODO: [], IN_PROGRESS: [], DONE: [] };
    for (const task of tasks ?? []) map[task.status].push(task);
    return map;
  }, [tasks]);

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmit = (values: TaskFormValues) => {
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, data: values });
    } else {
      createTask.mutate(values);
    }
    setModalOpen(false);
  };

  const handleMove = (task: Task, status: TaskStatus) =>
    updateTask.mutate({ id: task.id, data: { status } });

  const handleDelete = (task: Task) => deleteTask.mutate(task.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {tasks ? `${tasks.length} task${tasks.length === 1 ? '' : 's'}` : 'Your board'}
        </p>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New task
        </Button>
      </div>

      {isError ? (
        <ErrorState
          title="Couldn't load tasks"
          description="There was a problem fetching your board."
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <BoardSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {TASK_COLUMNS.map((col) => (
            <TaskColumn
              key={col.status}
              label={col.label}
              icon={col.icon}
              accent={col.accent}
              tasks={grouped[col.status]}
              onEdit={openEdit}
              onDelete={handleDelete}
              onMove={handleMove}
            />
          ))}
        </div>
      )}

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        task={editingTask}
        isSubmitting={createTask.isPending || updateTask.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

/** Three-column skeleton that mirrors the loaded board layout. */
function BoardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TASK_COLUMNS.map((col) => (
        <div key={col.status} className="rounded-xl border border-border bg-card/60 p-3">
          <Skeleton className="mb-3 h-5 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
