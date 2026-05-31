import { useEffect } from 'react';
import { useUiStore } from '@/store/ui.store';

// Persisted theme ko <html> ke `.dark` class ke saath sync karta hai. App root ke paas ek hi baar mount karo taaki document class hamesha store ke hisaab se rahe
export function useTheme() {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return { theme, toggleTheme };
}
