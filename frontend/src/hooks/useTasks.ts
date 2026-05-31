import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { taskApi } from '@/services/task.service';
import type { CreateTaskPayload, NormalizedApiError, Task, UpdateTaskPayload } from '@/types';

const TASKS_KEY = ['tasks'] as const;

// Current user ke tasks fetch karta hai
export function useTasks() {
  return useQuery({ queryKey: TASKS_KEY, queryFn: taskApi.list });
}

// Task mutations with optimistic updates - board turant update ho jaata hai aur agar request fail ho toh apne aap rollback ho ke settle pe resync ho jaata hai
export function useTaskMutations() {
  const queryClient = useQueryClient();

  // Snapshot le ke rollback ka context return karte hain, sab mutations isko share karte hain
  const optimistic = async (apply: (tasks: Task[]) => Task[]) => {
    await queryClient.cancelQueries({ queryKey: TASKS_KEY });
    const previous = queryClient.getQueryData<Task[]>(TASKS_KEY) ?? [];
    queryClient.setQueryData<Task[]>(TASKS_KEY, apply(previous));
    return { previous };
  };

  const rollback = (context?: { previous: Task[] }) => {
    if (context) queryClient.setQueryData(TASKS_KEY, context.previous);
  };

  const settle = () => queryClient.invalidateQueries({ queryKey: TASKS_KEY });

  const createTask = useMutation({
    mutationFn: (payload: CreateTaskPayload) => taskApi.create(payload),
    onMutate: (payload) => {
      const now = new Date().toISOString();
      // Server se asli id aane tak ek temporary task dikha dete hain
      const optimisticTask: Task = {
        id: `temp-${crypto.randomUUID()}`,
        title: payload.title,
        description: payload.description ?? null,
        status: payload.status ?? 'TODO',
        createdAt: now,
        updatedAt: now,
      };
      return optimistic((tasks) => [optimisticTask, ...tasks]);
    },
    onError: (error: NormalizedApiError, _v, context) => {
      rollback(context);
      toast.error(error.message);
    },
    onSuccess: () => toast.success('Task created'),
    onSettled: settle,
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskPayload }) => taskApi.update(id, data),
    onMutate: ({ id, data }) =>
      optimistic((tasks) =>
        tasks.map((task) => (task.id === id ? { ...task, ...data } : task)),
      ),
    onError: (error: NormalizedApiError, _v, context) => {
      rollback(context);
      toast.error(error.message);
    },
    onSettled: settle,
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => taskApi.remove(id),
    onMutate: (id) => optimistic((tasks) => tasks.filter((task) => task.id !== id)),
    onError: (error: NormalizedApiError, _v, context) => {
      rollback(context);
      toast.error(error.message);
    },
    onSuccess: () => toast.success('Task deleted'),
    onSettled: settle,
  });

  return { createTask, updateTask, deleteTask };
}
