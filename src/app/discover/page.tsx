/**
 * Personalized Discovery Feed — Screen 5
 *
 * The primary destination after onboarding. Displays curated journey
 * recommendations filtered by the user's mood and taste selections.
 *
 * Responsibilities:
 * - Read mood and taste state from the onboarding store
 * - Filter mock trips to match user preferences
 * - Fall back to showing all trips if no preferences were selected
 * - Display journeys in a horizontally scrolling carousel: a hero card
 *   and a 2x2 grid of supporting cards that continuously cycle as the
 *   user scrolls
 *
 * Phase 1: Trips come from MOCK_TRIPS static data.
 * Phase 3: Replace with a React Query hook that calls the trips API
 *          with the user's preferences as query parameters.
 *
 * Navigation: No back navigation — this is the end of the onboarding flow.
 */

'use client';

import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useAuthStore } from '@/store/auth-store';
import { MOCK_TRIPS } from '@/constants/mock-trips';
import { ThemeToggle } from '@/components/theme-toggle';
import { DiscoverCarousel } from '@/features/discover/components/discover-carousel';
import type { Trip } from '@/types/trip';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
};

/**
 * Filter trips by the user's selected mood and taste preferences.
 * A trip is included if it matches the mood OR at least one taste preference.
 * If no preferences are set, all trips are returned.
 *
 * @param trips - Full list of available trips
 * @param selectedMood - The user's selected mood ID, or null
 * @param selectedTastes - Array of selected taste IDs
 * @returns Filtered list of relevant trips
 */
function getPersonalizedTrips(
  trips: Trip[],
  selectedMood: string | null,
  selectedTastes: string[]
): Trip[] {
  const hasPreferences = selectedMood || selectedTastes.length > 0;

  if (!hasPreferences) {
    return trips;
  }

  return trips.filter((trip) => {
    const moodMatch = selectedMood ? trip.mood.includes(selectedMood) : false;
    const tasteMatch = selectedTastes.some((taste) => trip.tastes.includes(taste));
    return moodMatch || tasteMatch;
  });
}

export default function DiscoverPage() {
  const { selectedMood, selectedTastes } = useOnboardingStore();
  const { user } = useAuthStore();

  const personalizedTrips = getPersonalizedTrips(MOCK_TRIPS, selectedMood, selectedTastes);

  return (
    <main className="bg-onboarding-sky relative h-screen overflow-hidden flex flex-col py-8 sm:py-10">
      <ThemeToggle className="absolute bottom-8 left-8" />

      <motion.div
        className="px-margin-mobile md:px-margin-desktop mb-6 sm:mb-8 shrink-0"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <motion.h1
          variants={item}
          className="font-cursive text-on-surface dark:text-surface-container-lowest leading-none mb-3"
          style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}
        >
          {user ? `Welcome, ${user.name}.` : 'Your curated journeys.'}
        </motion.h1>

        <motion.p variants={item} className="text-body-md text-gray-500 italic max-w-md">
          &ldquo;The journey itself is my home.&rdquo; — Bashō
        </motion.p>
      </motion.div>

      {personalizedTrips.length === 0 ? (
        <p className="px-margin-mobile md:px-margin-desktop text-body-md text-on-surface-variant dark:text-surface-container-high">
          No journeys match your current selection. Try adjusting your preferences.
        </p>
      ) : (
        <DiscoverCarousel trips={personalizedTrips} />
      )}
    </main>
  );
}
