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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(61,54,162,0.15)_0%,transparent_70%)]" />

      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        animate={{ top: isNight ? '80%' : '15%', opacity: isNight ? 0 : 1 }}
        initial={{ top: '15%', opacity: 1 }}
        transition={transition}
      >
        <div className="w-16 h-16 rounded-full bg-tertiary-fixed shadow-[0_0_60px_rgba(255,224,136,0.6)]" />
      </motion.div>

      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        animate={{ top: isNight ? '15%' : '80%', opacity: isNight ? 1 : 0 }}
        initial={{ top: '80%', opacity: 0 }}
        transition={transition}
      >
        <div className="w-14 h-14 rounded-full bg-surface-container-lowest shadow-[0_0_40px_rgba(255,255,255,0.3)]" />
      </motion.div>
    </div>
  );
}
