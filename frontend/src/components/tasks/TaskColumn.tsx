import { AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  label: string;
  icon: LucideIcon;
  accent: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (task: Task, status: TaskStatus) => void;
}

// Board ka ek column - header with live count + cards ka scrollable stack
export function TaskColumn({ label, icon: Icon, accent, tasks, onEdit, onDelete, onMove }: TaskColumnProps) {
  return (
    <div className="flex min-h-[12rem] flex-col rounded-xl border border-border bg-card/60 p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Icon className={cn('h-4 w-4', accent)} />
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        </div>
        <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/70 py-10 text-center text-xs text-muted-foreground">
            No tasks here yet
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onMove={onMove} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
