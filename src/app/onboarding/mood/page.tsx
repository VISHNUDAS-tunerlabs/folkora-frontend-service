/**
 * Mood Collection Page — Screen 2
 *
 * Four compact icon cards arranged horizontally.
 * Navigation: ← / (back) | → /onboarding/taste (continue)
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/store/onboarding-store';
import { MOODS } from '@/constants/onboarding';
import { CircleNavButton } from '@/components/circle-nav-button';
import { PageQuote } from '@/components/page-quote';
import { ThemeToggle } from '@/components/theme-toggle';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const MOOD_ICONS: Record<string, React.ReactNode> = {
  'need-a-break': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  ),
  'want-adventure': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  ),
  'want-to-slow-down': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
  'want-to-reconnect': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
};

export default function MoodPage() {
  const router = useRouter();
  const { selectedMood, setMood } = useOnboardingStore();

  useEffect(() => {
    if (!selectedMood) setMood(MOODS[0].id);
  }, []);

  const handleContinue = () => {
    if (selectedMood) router.push('/onboarding/taste');
  };

  return (
    <main className="bg-onboarding-sky relative min-h-screen flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-16">
      <CircleNavButton direction="back" label="Go back" onClick={() => router.push('/')} />
      <CircleNavButton direction="next" label="Continue" onClick={handleContinue} disabled={!selectedMood} />
      <ThemeToggle className="absolute bottom-8 left-8" />

      <motion.div
        className="max-w-lg w-full flex flex-col items-center text-center"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <motion.p variants={item} className="text-label-md text-on-surface-variant dark:text-surface-container-high tracking-widest mb-4">
          How Are You Feeling?
        </motion.p>

        <motion.h1 variants={item} className="text-headline-lg text-on-surface dark:text-surface-container-lowest font-bold mb-10">
          Choose your mood.
        </motion.h1>

        <motion.ul variants={container} className="w-full grid grid-cols-4 gap-5">
          {MOODS.map((mood) => {
            const selected = selectedMood === mood.id;
            return (
              <motion.li key={mood.id} variants={item}>
                <button
                  onClick={() => setMood(mood.id)}
                  aria-pressed={selected}
                  className={`w-full h-36 flex flex-col items-center justify-center gap-3 px-3 rounded-md border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface dark:focus-visible:ring-white ${
                    selected
                      ? 'bg-on-surface text-surface-container-lowest border-on-surface dark:bg-surface-container-lowest dark:text-on-surface dark:border-surface-container-lowest'
                      : 'bg-transparent text-on-surface border-outline-variant hover:border-outline dark:text-surface-container-lowest dark:border-surface-container dark:hover:border-surface-container-highest'
                  }`}
                >
                  <span className={selected ? 'text-surface-container-lowest dark:text-on-surface' : 'text-on-surface-variant dark:text-surface-container-high'}>
                    {MOOD_ICONS[mood.id]}
                  </span>
                  <span className="text-label-md font-bold leading-snug">{mood.label}</span>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>

        <PageQuote className="max-w-xs mt-8">
          &ldquo;We travel not to escape life, but for life not to escape us.&rdquo;
        </PageQuote>
      </motion.div>
    </main>
  );
}
