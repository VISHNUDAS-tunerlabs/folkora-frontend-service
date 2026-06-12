/**
 * Trip data access.
 *
 * Phase 1: resolves trips from MOCK_TRIPS. Phase 3: replace the body of
 * `getTripById` with a call to the trips API — callers already treat this
 * as async, so the trip detail page requires no changes.
 */

import { MOCK_TRIPS } from '@/constants/mock-trips';
import type { Trip } from '@/types/trip';

/** Fetch a single trip by id, or `null` if no trip matches. */
export async function getTripById(id: string): Promise<Trip | null> {
  return MOCK_TRIPS.find((trip) => trip.id === id) ?? null;
}
