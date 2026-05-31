import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { Loader } from '@/components/ui/Loader';

// Pages ko code-split karte hain taaki initial bundle halka rahe
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const TasksPage = lazy(() => import('@/pages/TasksPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Central route table - public routes (login/register) logged-in hone par redirect, protected routes ko session chahiye aur ye dashboard shell ke andar render hote hain
export function AppRouter() {
  return (
    <Suspense fallback={<Loader fullScreen label="Loading…" />}>
      <Routes>
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Public / auth wale routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Protected / app wale routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
