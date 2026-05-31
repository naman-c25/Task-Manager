import { useEffect } from 'react';
import { useUiStore } from '@/store/ui.store';

/**
 * Syncs the persisted theme with the `.dark` class on <html>. Mount once near
 * the app root so the document class always reflects store state.
 */
export function useTheme() {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return { theme, toggleTheme };
}
