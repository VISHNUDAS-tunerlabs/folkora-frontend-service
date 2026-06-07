/**
 * Travel Taste Collection Page — Screen 3
 *
 * Captures the user's travel style preferences across three dimensions:
 * nature type, experience style, and atmosphere. Used alongside the mood
 * selection to personalize the discovery feed.
 *
 * Responsibilities:
 * - Present taste options grouped by category as pill-shaped multi-select chips
 * - Allow multi-selection across all groups
 * - Store selections in the onboarding Zustand store
 * - Navigate to auth (new users) or directly to discover (returning users)
 *
 * Navigation: ← /onboarding/mood (back) | → /auth or /discover (continue)
 */

'use client';

import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useAuthStore } from '@/store/auth-store';
import { TASTE_GROUPS } from '@/constants/onboarding';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function TastePage() {
  const router = useRouter();
  const { selectedTastes, toggleTaste } = useOnboardingStore();
  const { isAuthenticated } = useAuthStore();
  const prefersReducedMotion = useReducedMotion();

  // Pills drift upward and resolve from a soft blur into focus — a calm "coming together" reveal.
  const pillItem = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }
    : {
        hidden: { opacity: 0, filter: 'blur(10px)', y: 18, scale: 0.94 },
        visible: {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          scale: 1,
          transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const },
        },
      };

  const allTasteOptions = TASTE_GROUPS.flatMap((group) => group.options);

  const handleContinue = () => {
    // Skip auth if the user is already signed in
    if (isAuthenticated) {
      router.push('/discover');
    } else {
      router.push('/auth');
    }
  };

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-16"
      style={{ background: 'linear-gradient(160deg, #111111 0%, #000000 100%)' }}
    >
      <button
        onClick={() => router.push('/onboarding/mood')}
        aria-label="Go back"
        className="absolute top-8 left-8 w-11 h-11 rounded-full bg-white text-on-surface flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-95"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4L6 9l5 5" />
        </svg>
      </button>

      <button
        onClick={handleContinue}
        aria-label="Continue"
        className="absolute top-8 right-8 w-11 h-11 rounded-full bg-white text-on-surface flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-95"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 4l5 5-5 5" />
        </svg>
      </button>

      <motion.div
        className="max-w-2xl w-full flex flex-col items-center text-center"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <motion.p variants={item} className="text-label-md text-surface-container-high tracking-widest mb-4">
          Your Travel Taste
        </motion.p>

        <motion.h1 variants={item} className="text-headline-lg text-surface-container-lowest font-bold mb-3">
          What kind of journey calls to you?
        </motion.h1>

        <motion.p variants={item} className="text-body-md text-surface-container-high mb-10">
          Select everything that feels right. There are no wrong answers.
        </motion.p>

        <motion.ul
          variants={container}
          className="w-full flex flex-wrap items-center justify-center gap-3"
        >
          {allTasteOptions.map((option) => {
            const selected = selectedTastes.includes(option.id);
            return (
              <motion.li key={option.id} variants={pillItem}>
                <button
                  onClick={() => toggleTaste(option.id)}
                  aria-pressed={selected}
                  className={`px-6 py-2.5 rounded-full border text-label-md font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    selected
                      ? 'bg-surface-container-lowest text-on-surface border-surface-container-lowest'
                      : 'bg-transparent text-surface-container-lowest border-surface-container hover:border-surface-container-highest'
                  }`}
                >
                  {option.label}
                </button>
              </motion.li>
            );
          })}
        </motion.ul>

        <motion.p
          variants={item}
          className="text-body-md text-gray-500 max-w-xs mt-12 italic text-center"
        >
          &ldquo;To travel is to live twice over, taking pleasure in the present and the past together.&rdquo;
        </motion.p>
      </motion.div>
    </main>
  );
}
