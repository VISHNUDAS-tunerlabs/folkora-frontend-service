/**
 * Travel Taste Collection Page — Screen 3
 *
 * Captures the user's travel style preferences across three dimensions:
 * nature type, experience style, and atmosphere. Used alongside the mood
 * selection to personalize the discovery feed.
 *
 * Responsibilities:
 * - Present taste options grouped by category
 * - Allow multi-selection across all groups
 * - Store selections in the onboarding Zustand store
 * - Navigate to auth (new users) or directly to discover (returning users)
 *
 * Navigation: ← /onboarding/mood (back) | → /auth or /discover (continue)
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useAuthStore } from '@/store/auth-store';
import { TASTE_GROUPS } from '@/constants/onboarding';

export default function TastePage() {
  const router = useRouter();
  const { selectedTastes, toggleTaste } = useOnboardingStore();
  const { isAuthenticated } = useAuthStore();

  const handleContinue = () => {
    // Skip auth if the user is already signed in
    if (isAuthenticated) {
      router.push('/discover');
    } else {
      router.push('/auth');
    }
  };

  return (
    <main>
      <Link href="/onboarding/mood">← Back</Link>

      <h1>What kind of journey calls to you?</h1>
      <p>Select everything that feels right. There are no wrong answers.</p>

      {TASTE_GROUPS.map((group) => (
        <section key={group.id}>
          <h2>{group.label}</h2>
          <ul>
            {group.options.map((option) => (
              <li key={option.id}>
                <button
                  onClick={() => toggleTaste(option.id)}
                  aria-pressed={selectedTastes.includes(option.id)}
                >
                  {option.label}
                  {selectedTastes.includes(option.id) && ' ✓'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <button onClick={handleContinue}>
        {selectedTastes.length > 0 ? 'Show My Journeys' : 'Skip for now'}
      </button>
    </main>
  );
}
