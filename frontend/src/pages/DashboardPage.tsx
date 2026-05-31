import { motion } from 'framer-motion';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { useAuthStore } from '@/store/auth.store';
import { fadeInUp, staggerContainer } from '@/animations/variants';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here's your board. Create a task and drag it through to done.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <TaskBoard />
      </motion.div>
    </motion.div>
  );
}
