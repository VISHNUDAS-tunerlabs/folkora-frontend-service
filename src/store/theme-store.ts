/**
 * Theme state store.
 *
 * Tracks the user's light/dark mode preference and keeps the `<html>`
 * element's class (and color-scheme) in sync so Tailwind's `dark:`
 * variant and native form controls render correctly.
 *
 * Persisted to localStorage so the choice survives reloads. The inline
 * script in the root layout applies the stored class before first paint —
 * `syncFromDocument` then reconciles store state with that class without
 * triggering a visual flash.
 *
 * Zustand is appropriate here: this is global UI preference state, not
 * server data, and nothing about it needs React Query caching.
 */

import { create } from 'zustand';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'folkora-theme';

interface ThemeState {
  theme: Theme;

  /** Apply a theme: updates the DOM class, persists it, and updates state. */
  setTheme: (theme: Theme) => void;

  /** Switch between light and dark. */
  toggleTheme: () => void;

  /** Reconcile store state with the class the inline script already applied to <html>. */
  syncFromDocument: () => void;
}

function applyToDocument(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage may be unavailable (private browsing) — theme still applies for this session.
  }
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark',

  setTheme: (theme) => {
    if (theme !== get().theme) applyToDocument(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  syncFromDocument: () => {
    const fromDom = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    if (fromDom !== get().theme) set({ theme: fromDom });
  },
}));
