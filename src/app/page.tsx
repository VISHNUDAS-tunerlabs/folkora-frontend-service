/**
 * Welcome Page — Screen 1
 *
 * Entry point of the Folkora experience. Sets the emotional tone
 * of the product before any recommendation or search occurs.
 *
 * Responsibilities:
 * - Introduce Folkora with a single inspiring statement
 * - Provide one clear call-to-action to begin the personalization journey
 * - Make the user feel curious, relaxed, and inspired
 *
 * Navigation: → /onboarding/mood
 */

import Link from 'next/link';

export default function WelcomePage() {
  return (
    <main>
      <h1>Travel isn&apos;t about destinations. It&apos;s about how you want to feel.</h1>

      <p>Discover journeys curated for your mood, not your search query.</p>

      <Link href="/onboarding/mood">Begin Your Journey</Link>
    </main>
  );
}
