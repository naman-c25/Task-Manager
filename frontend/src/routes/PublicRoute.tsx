import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

// Auth pages (login/register) wrap karta hai. Already logged-in banda seedha dashboard pe chala jaata hai, login form dobara nahi dikhta
export function PublicRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
