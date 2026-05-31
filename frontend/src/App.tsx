import { AppRouter } from '@/routes/AppRouter';
import { Loader } from '@/components/ui/Loader';
import { useTheme } from '@/hooks/useTheme';
import { useSession } from '@/hooks/useSession';

// App root. Theme set karta hai aur routes render karne se pehle persisted session revalidate karta hai, taaki auth resolve hone tak protected pages flash na hon
export default function App() {
  useTheme();
  const { isLoading } = useSession();

  if (isLoading) {
    return <Loader fullScreen label="Restoring your session…" />;
  }

  return <AppRouter />;
}
