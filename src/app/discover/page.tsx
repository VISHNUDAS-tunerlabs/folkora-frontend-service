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
 * - Display each trip as a card with key details
 *
 * Phase 1: Trips come from MOCK_TRIPS static data.
 * Phase 3: Replace with a React Query hook that calls the trips API
 *          with the user's preferences as query parameters.
 *
 * Navigation: No back navigation — this is the end of the onboarding flow.
 */

'use client';

import { useOnboardingStore } from '@/store/onboarding-store';
import { useAuthStore } from '@/store/auth-store';
import { MOCK_TRIPS } from '@/constants/mock-trips';
import { MOODS } from '@/constants/onboarding';
import type { Trip } from '@/types/trip';

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

  const selectedMoodLabel = selectedMood
    ? MOODS.find((m) => m.id === selectedMood)?.label
    : null;

  return (
    <main>
      <h1>
        {user ? `Welcome, ${user.name}.` : 'Your curated journeys.'}
      </h1>

      {selectedMoodLabel && (
        <p>Journeys matched to: {selectedMoodLabel}</p>
      )}

      <p>
        {personalizedTrips.length === MOCK_TRIPS.length
          ? 'Explore all journeys'
          : `${personalizedTrips.length} journeys found for you`}
      </p>

      {personalizedTrips.length === 0 ? (
        <p>No journeys match your current selection. Try adjusting your preferences.</p>
      ) : (
        <ul>
          {personalizedTrips.map((trip) => (
            <li key={trip.id}>
              <article>
                <h2>{trip.title}</h2>
                <p>{trip.destination}, {trip.country}</p>
                <p>{trip.duration}</p>
                <p>{trip.tagline}</p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
