'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useThemeStore } from '@/store/theme-store';

const iconVariants = {
  initial: { opacity: 0, rotate: -90, scale: 0.5 },
  animate: { opacity: 1, rotate: 0, scale: 1 },
  exit: { opacity: 0, rotate: 90, scale: 0.5 },
};

const reducedIconVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a9 9 0 0 0 11 11Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Light/dark mode switch styled as a small celestial body — a sun stands
 * in for light mode, a crescent moon for dark — echoing the Aether Drift
 * welcome screen's day/night motif rather than reading as a generic toggle.
 *
 * Sized and styled to match the circular nav buttons so it reads as a
 * sibling control. Icons cross-fade with a gentle rotate + scale (never
 * a spin or bounce), and collapse to a plain opacity swap under
 * prefers-reduced-motion.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme, syncFromDocument } = useThemeStore();
  const prefersReducedMotion = useReducedMotion();

  // The inline head script already applied the saved theme class to <html>
  // before paint. Reconcile the store with that class on mount so the icon
  // shown matches the user's actual preference (the store's 'dark' default
  // would otherwise briefly show the wrong icon for returning light-mode users).
  useEffect(() => {
    syncFromDocument();
  }, [syncFromDocument]);

  const variants = prefersReducedMotion ? reducedIconVariants : iconVariants;

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={theme === 'dark'}
      className={`w-11 h-11 rounded-full flex items-center justify-center overflow-hidden transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-on-surface text-surface-container-lowest hover:scale-110 hover:shadow-[0_0_20px_rgba(0,0,0,0.18)] focus-visible:ring-on-surface focus-visible:ring-offset-surface dark:bg-white dark:text-on-surface dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] dark:focus-visible:ring-white dark:focus-visible:ring-offset-black ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: prefersReducedMotion ? 0.15 : 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="flex items-center justify-center"
        >
          {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
