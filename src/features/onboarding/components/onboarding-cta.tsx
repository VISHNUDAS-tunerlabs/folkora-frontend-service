'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';

/**
 * CTA button for the welcome screen.
 *
 * Fixed at the bottom-right corner of the viewport.
 * Fades in after the write-on animation completes (9.5s delay).
 */
export function OnboardingCTA() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed bottom-8 right-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 1.5, delay: 9.5, ease: [0.4, 0, 0.2, 1] }
      }
    >
      <motion.button
        className="px-5 py-1.5 bg-surface-container-lowest text-on-surface font-semibold text-label-md rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        whileHover={prefersReducedMotion ? {} : { scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.4)' }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
        onClick={() => router.push('/onboarding/mood')}
        aria-label="Begin your Folkora journey"
      >
        Let&apos;s Pack Your Bag
      </motion.button>
    </motion.div>
  );
}
