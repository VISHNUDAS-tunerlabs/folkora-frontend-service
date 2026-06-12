/**
 * Trip Detail — shared template for every curated journey.
 *
 * Every card across the app links here as `/trip/[id]`. The same page
 * renders for all trips; only the content differs, resolved by id.
 *
 * Phase 1: content comes from MOCK_TRIPS via trip.service.
 * Phase 3: trip.service will fetch from the trips API instead — this
 *          page's structure does not need to change.
 */

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTripById } from '@/features/trip/services/trip.service';

interface TripPageProps {
  params: Promise<{ id: string }>;
}

export default async function TripPage({ params }: TripPageProps) {
  const { id } = await params;
  const trip = await getTripById(id);

  if (!trip) {
    notFound();
  }

  return (
    <main className="bg-onboarding-sky min-h-screen">
      <div className="relative h-[60vh] min-h-[420px] w-full sm:h-[70vh]">
        <Image
          src={trip.imageUrl}
          alt={`${trip.destination}, ${trip.country}`}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <Link
          href="/discover"
          aria-label="Back to your curated journeys"
          className="absolute left-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-on-surface transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:left-8 sm:top-8"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <div className="absolute inset-x-0 bottom-0 px-margin-mobile pb-8 sm:px-margin-desktop sm:pb-12 text-white">
          <p className="text-label-md uppercase tracking-widest opacity-80 mb-2">
            {trip.destination}, {trip.country}
          </p>
          <h1
            className="font-cursive leading-none"
            style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}
          >
            {trip.title}
          </h1>
        </div>
      </div>

      <div className="px-margin-mobile sm:px-margin-desktop py-8 sm:py-12 max-w-3xl">
        <p className="text-body-lg text-on-surface dark:text-surface-container-lowest mb-2">
          {trip.tagline}
        </p>
        <p className="text-label-md text-on-surface-variant dark:text-surface-container-high mb-8">
          {trip.duration}
        </p>

        <div className="flex flex-wrap gap-2">
          {trip.tastes.map((taste) => (
            <span
              key={taste}
              className="rounded-full bg-surface-container px-4 py-1.5 text-label-md text-on-surface dark:bg-surface-container-high dark:text-surface-container-lowest"
            >
              {taste.replace(/-/g, ' ')}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
