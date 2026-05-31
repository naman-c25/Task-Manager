import { LayoutDashboard, ListTodo, Settings, type LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Reserved for Phase 2+ features — shows a "soon" badge and is disabled. */
  comingSoon?: boolean;
}

/**
 * Single source of truth for sidebar/mobile navigation. New feature routes
 * (e.g. Tasks board) plug in here without touching the layout components.
 */
export const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Tasks', to: '/tasks', icon: ListTodo },
  { label: 'Settings', to: '/settings', icon: Settings, comingSoon: true },
];
