import { LayoutDashboard, ListTodo, Settings, type LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  // Future features ke liye - "soon" badge dikhata hai aur disabled rehta hai
  comingSoon?: boolean;
}

// Sidebar/mobile nav ka single source of truth. Naye routes yahin add karo, layout components ko chhune ki zaroorat nahi
export const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Tasks', to: '/tasks', icon: ListTodo },
  { label: 'Settings', to: '/settings', icon: Settings, comingSoon: true },
];
