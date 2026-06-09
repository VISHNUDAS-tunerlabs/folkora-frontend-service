'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface CelestialLayerProps {
  isNight: boolean;
}

/**
 * Sun/moon transition layer. Decorative — fully hidden from assistive tech.
 * State is owned by WelcomeCanvas and toggled every 8s.
 */
export function CelestialLayer({ isNight }: CelestialLayerProps) {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 2, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,157,108,0.12)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(61,54,162,0.15)_0%,transparent_70%)]" />

      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        animate={{ top: isNight ? '80%' : '15%', opacity: isNight ? 0 : 1 }}
        initial={{ top: '15%', opacity: 1 }}
        transition={transition}
      >
        {/* Light theme: solid "ink" silhouette against the pale sky (matches
            the SVG write-on ink color) — better contrast than the warm-gold
            fill, which nearly vanishes against the light daytime gradient. */}
        <div className="w-16 h-16 rounded-full bg-on-surface shadow-[0_0_60px_rgba(255,224,136,0.6)] dark:bg-tertiary-fixed" />
      </motion.div>

      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        animate={{ top: isNight ? '15%' : '80%', opacity: isNight ? 1 : 0 }}
        initial={{ top: '80%', opacity: 0 }}
        transition={transition}
      >
        {/* Crescent silhouette — same path as ThemeToggle's MoonIcon, so the
            "moon" motif reads consistently across the toggle and this canvas
            (applies in both themes; shape is a preference, not a variant).
            Light theme renders it in solid "ink" black for contrast against
            the light "night" sky (which, in light theme, is only a subtly
            warmer pale gradient — a light-grey/white moon would all but
            disappear against it). */}
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          className="drop-shadow-[0_0_30px_rgba(135,115,106,0.25)] dark:drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]"
        >
          <path
            d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a9 9 0 0 0 11 11Z"
            className="fill-on-surface dark:fill-surface-container-lowest"
          />
        </svg>
      </motion.div>
    </div>
  );
}
