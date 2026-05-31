import { Moon, Sun } from 'lucide-react';
import { Button } from './Button';
import { useTheme } from '@/hooks/useTheme';

/** Switches between light and dark themes. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
