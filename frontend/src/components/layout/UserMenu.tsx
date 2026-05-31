import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useAuthMutations } from '@/hooks/useAuthMutations';

// Avatar button jo dropdown kholta hai - user info aur logout
export function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuthMutations();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        aria-label="Open user menu"
      >
        {initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-card shadow-elevated"
          >
            <div className="border-b border-border px-4 py-3">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <button
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
