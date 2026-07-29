'use client';
import { useCallback, useEffect, useState } from 'react';

const THEME_KEY = 'infinitus_theme';

export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
    const preferred = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setThemeState(preferred);
    document.documentElement.classList.toggle('dark', preferred === 'dark');
  }, []);

  const setTheme = useCallback((next: 'light' | 'dark') => {
    setThemeState(next);
    window.localStorage.setItem(THEME_KEY, next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
