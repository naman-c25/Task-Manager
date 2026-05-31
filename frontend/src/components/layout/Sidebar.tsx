import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';
import { navItems } from './navigation';
import { useUiStore } from '@/store/ui.store';

// Desktop sidebar with collapse toggle. lg se chhote screens pe hidden
export function Sidebar() {
  const isCollapsed = useUiStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 256 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="hidden shrink-0 border-r border-border bg-card lg:flex lg:flex-col"
    >
      <div className={cn('flex h-16 items-center border-b border-border px-4', isCollapsed && 'justify-center')}>
        <Logo showText={!isCollapsed} />
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavItemLink key={item.to} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className={cn('h-5 w-5 transition-transform', isCollapsed && 'rotate-180')} />
          {!isCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}

function NavItemLink({
  item,
  isCollapsed,
}: {
  item: (typeof navItems)[number];
  isCollapsed: boolean;
}) {
  const { icon: Icon, label, to, comingSoon } = item;

  if (comingSoon) {
    return (
      <div
        title={`${label} — coming soon`}
        className={cn(
          'flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground/50',
          isCollapsed && 'justify-center',
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!isCollapsed && (
          <span className="flex w-full items-center justify-between">
            {label}
            <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium uppercase">soon</span>
          </span>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isCollapsed && 'justify-center',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span>{label}</span>}
    </NavLink>
  );
}
