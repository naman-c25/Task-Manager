import { CheckCircle2, Clock, ListTodo, type LucideIcon } from 'lucide-react';
import type { TaskStatus } from '@/types';

interface ColumnConfig {
  status: TaskStatus;
  label: string;
  icon: LucideIcon;
  // Column header ke dot/badge ke accent classes
  accent: string;
}

// 3 board columns aur unke order ka single source of truth
export const TASK_COLUMNS: ColumnConfig[] = [
  { status: 'TODO', label: 'Todo', icon: ListTodo, accent: 'text-slate-400' },
  { status: 'IN_PROGRESS', label: 'In Progress', icon: Clock, accent: 'text-amber-400' },
  { status: 'DONE', label: 'Done', icon: CheckCircle2, accent: 'text-emerald-400' },
];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};
