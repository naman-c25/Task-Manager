import { apiClient } from './apiClient';
import type { ApiResponse, CreateTaskPayload, Task, UpdateTaskPayload } from '@/types';

// Task API service. Har method response envelope ko unwrap karke plain object deta hai
export const taskApi = {
  async list(): Promise<Task[]> {
    const { data } = await apiClient.get<ApiResponse<{ tasks: Task[] }>>('/tasks');
    return data.data.tasks;
  },

  async create(payload: CreateTaskPayload): Promise<Task> {
    const { data } = await apiClient.post<ApiResponse<{ task: Task }>>('/tasks', payload);
    return data.data.task;
  },

  async update(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const { data } = await apiClient.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}`, payload);
    return data.data.task;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },
};
