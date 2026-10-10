'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { style } from '@/app/resources';

const themeListeners = new Set<() => void>();

function subscribe(listener: () => void) {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

function readTheme() {
  return localStorage.getItem('theme') || style.theme;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => style.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const newTheme = readTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeListeners.forEach((listener) => listener());
  }, []);

  return {
    theme,
    toggleTheme
  };
}
