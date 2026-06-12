import Link from 'next/link';

export default function TripNotFound() {
  return (
    <main className="bg-onboarding-sky flex min-h-screen flex-col items-center justify-center px-margin-mobile text-center">
      <h1 className="font-cursive text-on-surface dark:text-surface-container-lowest leading-none mb-3" style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>
        This journey has wandered off.
      </h1>
      <p className="text-body-md text-on-surface-variant dark:text-surface-container-high mb-8 max-w-md">
        We couldn&apos;t find that trip. It may have been moved or is no longer available.
      </p>
      <Link
        href="/discover"
        className="rounded-full bg-on-surface px-6 py-3 text-label-md text-surface-container-lowest transition-transform duration-200 hover:scale-105 dark:bg-white dark:text-on-surface"
      >
        Back to your journeys
      </Link>
    </main>
  );
}
