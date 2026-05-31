import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Pencil, Trash2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Task, TaskStatus } from '@/types';
import { STATUS_LABELS } from './taskConfig';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (task: Task, status: TaskStatus) => void;
}

const ALL_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

// Ek task card with actions menu (edit/move/delete)
export function TaskCard({ task, onEdit, onDelete, onMove }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isOptimistic = task.id.startsWith('temp-');

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const moveTargets = ALL_STATUSES.filter((s) => s !== task.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isOptimistic ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="group relative rounded-lg border border-border bg-background p-3 shadow-soft transition-colors hover:border-muted-foreground/30"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium leading-snug text-foreground">{task.title}</h4>

        <div ref={ref} className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground focus:opacity-100 group-hover:opacity-100"
            aria-label="Task actions"
            disabled={isOptimistic}
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-elevated">
              <MenuItem icon={Pencil} label="Edit" onClick={() => { setMenuOpen(false); onEdit(task); }} />
              {moveTargets.map((status) => (
                <MenuItem
                  key={status}
                  icon={ArrowRight}
                  label={`Move to ${STATUS_LABELS[status]}`}
                  onClick={() => { setMenuOpen(false); onMove(task, status); }}
                />
              ))}
              <div className="my-1 border-t border-border" />
              <MenuItem
                icon={Trash2}
                label="Delete"
                destructive
                onClick={() => { setMenuOpen(false); onDelete(task); }}
              />
            </div>
          )}
        </div>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {task.description}
        </p>
      )}
    </motion.div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  destructive = false,
}: {
  icon: typeof Pencil;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
        destructive ? 'text-destructive' : 'text-foreground',
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
