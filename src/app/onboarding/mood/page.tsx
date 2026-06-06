/**
 * Mood Collection Page — Screen 2
 *
 * Captures the user's current emotional travel intent before
 * presenting recommendations. Focuses on feeling, not logistics.
 *
 * Responsibilities:
 * - Present mood options as selectable cards
 * - Store the selected mood in the onboarding Zustand store
 * - Gate navigation to the next step until a mood is selected
 *
 * Navigation: ← / (back) | → /onboarding/taste (continue)
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/onboarding-store';
import { MOODS } from '@/constants/onboarding';

export default function MoodPage() {
  const router = useRouter();
  const { selectedMood, setMood } = useOnboardingStore();

  const handleContinue = () => {
    if (selectedMood) {
      router.push('/onboarding/taste');
    }
  };

  return (
    <main>
      <Link href="/">← Back</Link>

      <h1>How are you feeling right now?</h1>
      <p>Tell us where you are, and we&apos;ll find journeys that match.</p>

      <ul>
        {MOODS.map((mood) => (
          <li key={mood.id}>
            <button
              onClick={() => setMood(mood.id)}
              aria-pressed={selectedMood === mood.id}
            >
              {mood.label}
              {selectedMood === mood.id && ' ✓'}
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleContinue} disabled={!selectedMood}>
        Continue
      </button>
    </main>
  );
}
