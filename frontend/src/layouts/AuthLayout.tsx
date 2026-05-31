import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '@/components/layout/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { fadeInUp } from '@/animations/variants';

// Auth pages ka split-screen layout - left pe branded panel (sirf desktop), right pe form ka outlet
export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Brand panel - mobile pe hidden */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary/90 to-primary p-12 text-primary-foreground lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_55%)]" />
        <div className="relative">
          <Logo />
        </div>
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="relative max-w-md">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Organize your work, the way modern teams do.
          </h1>
          <p className="mt-4 text-base text-primary-foreground/80">
            Plan, track, and ship faster with a clean, distraction-free workspace built for focus.
          </p>
        </motion.div>
        <div className="relative text-sm text-primary-foreground/70">
          © {new Date().getFullYear()} TaskFlow. Crafted with care.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex items-center justify-between p-4 lg:justify-end">
          <div className="lg:hidden">
            <Logo />
          </div>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
