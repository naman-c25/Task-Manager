import { motion } from 'framer-motion';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { fadeInUp, staggerContainer } from '@/animations/variants';

export default function TasksPage() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Organize your work across Todo, In Progress, and Done.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <TaskBoard />
      </motion.div>
    </motion.div>
  );
}
