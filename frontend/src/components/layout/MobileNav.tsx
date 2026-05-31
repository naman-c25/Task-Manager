import { NavLink } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';
import { navItems } from './navigation';
import { Button } from '@/components/ui/Button';
import { useUiStore } from '@/store/ui.store';

// Chhoti screens ke liye slide-over nav, desktop sidebar jaisa hi
export function MobileNav() {
  const isOpen = useUiStore((s) => s.isMobileNavOpen);
  const setMobileNav = useUiStore((s) => s.setMobileNav);
  const close = () => setMobileNav(false);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
            className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-border bg-card"
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <Logo />
              <Button variant="ghost" size="icon" onClick={close} aria-label="Close navigation">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 space-y-1 p-3">
              {navItems.map(({ icon: Icon, label, to, comingSoon }) =>
                comingSoon ? (
                  <div
                    key={to}
                    className="flex cursor-not-allowed items-center justify-between rounded-md px-3 py-2.5 text-sm text-muted-foreground/50"
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      {label}
                    </span>
                    <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium uppercase">
                      soon
                    </span>
                  </div>
                ) : (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={close}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                      )
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </NavLink>
                ),
              )}
            </nav>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
