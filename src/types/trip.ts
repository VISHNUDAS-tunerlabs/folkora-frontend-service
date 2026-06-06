/**
 * Trip domain types.
 *
 * A Trip represents a curated travel experience on the Folkora platform.
 * In Phase 1, trips are populated from static mock data.
 * Phase 3 will replace mock data with API responses.
 */

/** A curated journey available for discovery and booking. */
export interface Trip {
  id: string;
  title: string;
  destination: string;
  country: string;
  duration: string;
  tagline: string;
  mood: string[];
  tastes: string[];
  imageUrl: string;
}
