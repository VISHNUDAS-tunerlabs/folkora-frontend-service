/**
 * Static onboarding option definitions.
 *
 * These are the curated mood and taste options presented during the
 * pre-discovery onboarding flow. They are intentionally small and
 * emotionally phrased — the goal is to understand user intent and
 * mindset, not to collect demographic or logistical data.
 *
 * In Phase 3, these may be loaded from a CMS to allow non-technical
 * updates without code changes.
 */

import type { MoodOption, TasteGroup } from '@/types/onboarding';

/** Mood options representing the user's current emotional travel intent. */
export const MOODS: MoodOption[] = [
  { id: 'need-a-break', label: 'I need a break', description: 'Rest and recharge' },
  { id: 'want-adventure', label: 'I want adventure', description: 'Push boundaries' },
  { id: 'want-to-slow-down', label: 'I want to slow down', description: 'Gentle pace' },
  { id: 'want-to-reconnect', label: 'I want to reconnect', description: 'People and places' },
  { id: 'want-unexpected', label: 'I want something unexpected', description: 'Surprise me' },
  { id: 'need-inspiration', label: 'I need inspiration', description: 'Spark creativity' },
  { id: 'escape-routine', label: 'I want to escape routine', description: 'Something different' },
];

/** Grouped taste options representing the user's preferred travel style and environment. */
export const TASTE_GROUPS: TasteGroup[] = [
  {
    id: 'nature',
    label: 'Nature',
    options: [
      { id: 'mountains', label: 'Mountains' },
      { id: 'forests', label: 'Forests' },
      { id: 'beaches', label: 'Beaches' },
      { id: 'lakes', label: 'Lakes' },
    ],
  },
  {
    id: 'experience-style',
    label: 'Experience Style',
    options: [
      { id: 'luxury', label: 'Luxury' },
      { id: 'boutique', label: 'Boutique' },
      { id: 'cultural', label: 'Cultural' },
      { id: 'wellness', label: 'Wellness' },
      { id: 'adventure', label: 'Adventure' },
      { id: 'slow-travel', label: 'Slow Travel' },
    ],
  },
  {
    id: 'atmosphere',
    label: 'Atmosphere',
    options: [
      { id: 'quiet', label: 'Quiet' },
      { id: 'social', label: 'Social' },
      { id: 'remote', label: 'Remote' },
      { id: 'vibrant', label: 'Vibrant' },
    ],
  },
];
