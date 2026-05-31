import { motion } from 'framer-motion';
import { ListTodo, Clock, CheckCircle2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useAuthStore } from '@/store/auth.store';
import { fadeInUp, staggerContainer } from '@/animations/variants';

/**
 * Placeholder dashboard for Phase 1. The board columns below are scaffolding
 * for the Phase 2 task CRUD — they render the column shells and empty states
 * so the feature can be dropped in without layout changes.
 */
const columns = [
  { key: 'todo', label: 'Todo', icon: ListTodo },
  { key: 'in_progress', label: 'In Progress', icon: Clock },
  { key: 'done', label: 'Done', icon: CheckCircle2 },
] as const;

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's your workspace. Task management arrives in the next phase.
          </p>
        </div>
        <Button disabled title="Coming in Phase 2">
          <Plus className="h-4 w-4" />
          New task
        </Button>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid gap-4 md:grid-cols-3">
        {columns.map(({ key, label, icon: Icon }) => (
          <Card key={key} className="flex flex-col">
            <CardHeader className="flex-row items-center justify-between p-4">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </CardTitle>
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-muted-foreground">0</span>
            </CardHeader>
            <CardContent className="flex-1 p-4 pt-0">
              <EmptyState title="No tasks yet" description="Tasks you create will appear here." />
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
