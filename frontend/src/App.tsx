import { AppRouter } from '@/routes/AppRouter';
import { Loader } from '@/components/ui/Loader';
import { useTheme } from '@/hooks/useTheme';
import { useSession } from '@/hooks/useSession';

/**
 * App root. Initializes the theme and revalidates the persisted session before
 * rendering routes, so protected pages never flash while we resolve auth state.
 */
export default function App() {
  useTheme();
  const { isLoading } = useSession();

  if (isLoading) {
    return <Loader fullScreen label="Restoring your session…" />;
  }

  return <AppRouter />;
}
