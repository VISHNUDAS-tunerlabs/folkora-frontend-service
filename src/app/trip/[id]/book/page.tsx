/**
 * Book Journey — traveler selection and details.
 *
 * Reached from the "Book this journey" button on the trip detail page.
 *
 * Phase 1: booking is mocked — `BookingFlow` simulates a network call and
 *          never persists anything.
 * Phase 3: replace `BookingFlow`'s submit handler with `booking.service.ts`.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTripById } from '@/features/trip/services/trip.service';
import { BookingFlow } from '@/features/booking/components/booking-flow';

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  const trip = await getTripById(id);

  if (!trip) {
    notFound();
  }

  return (
    <main className="bg-onboarding-sky min-h-screen relative">
      <Link
        href={`/trip/${trip.id}`}
        aria-label="Back to journey details"
        className="absolute left-6 top-6 sm:left-8 sm:top-8 flex h-11 w-11 items-center justify-center rounded-full bg-on-surface text-surface-container-lowest transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:bg-white dark:text-on-surface dark:focus-visible:ring-white dark:focus-visible:ring-offset-black"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <div className="px-margin-mobile sm:px-margin-desktop py-8 sm:py-12 pt-24 sm:pt-28 max-w-3xl mx-auto">
        <BookingFlow trip={trip} />
      </div>
    </main>
  );
}
