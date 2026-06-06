/**
 * Mock trip data for Phase 1 (Experience Prototype).
 *
 * These trips are used to populate the discovery feed before backend
 * integration is complete. Each trip includes mood and taste tags so
 * the feed can simulate personalized filtering based on onboarding answers.
 *
 * Replace with API calls in Phase 3.
 */

import type { Trip } from '@/types/trip';

export const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip-001',
    title: 'The Quiet Dolomites',
    destination: 'Cortina d\'Ampezzo',
    country: 'Italy',
    duration: '7 nights',
    tagline: 'Find stillness above the clouds.',
    mood: ['want-to-slow-down', 'need-a-break', 'need-inspiration'],
    tastes: ['mountains', 'boutique', 'quiet', 'wellness'],
    imageUrl: '',
  },
  {
    id: 'trip-002',
    title: 'Mekong River Drift',
    destination: 'Luang Prabang',
    country: 'Laos',
    duration: '10 nights',
    tagline: 'Let the river decide your pace.',
    mood: ['want-to-slow-down', 'want-to-reconnect', 'escape-routine'],
    tastes: ['forests', 'cultural', 'slow-travel', 'remote'],
    imageUrl: '',
  },
  {
    id: 'trip-003',
    title: 'Patagonia Edge',
    destination: 'Torres del Paine',
    country: 'Chile',
    duration: '12 nights',
    tagline: 'Where the wind rewrites your plans.',
    mood: ['want-adventure', 'want-unexpected', 'need-inspiration'],
    tastes: ['mountains', 'adventure', 'remote', 'quiet'],
    imageUrl: '',
  },
  {
    id: 'trip-004',
    title: 'Amalfi Slow Season',
    destination: 'Positano',
    country: 'Italy',
    duration: '6 nights',
    tagline: 'Sun, salt, and no itinerary.',
    mood: ['need-a-break', 'want-to-reconnect', 'escape-routine'],
    tastes: ['beaches', 'luxury', 'vibrant', 'cultural'],
    imageUrl: '',
  },
  {
    id: 'trip-005',
    title: 'Kyoto in Autumn',
    destination: 'Kyoto',
    country: 'Japan',
    duration: '9 nights',
    tagline: 'A season that teaches you to let go.',
    mood: ['want-to-slow-down', 'need-inspiration', 'want-to-reconnect'],
    tastes: ['cultural', 'wellness', 'quiet', 'boutique'],
    imageUrl: '',
  },
  {
    id: 'trip-006',
    title: 'Scottish Highlands Wild',
    destination: 'Isle of Skye',
    country: 'Scotland',
    duration: '8 nights',
    tagline: 'Untamed, honest, unforgettable.',
    mood: ['want-adventure', 'want-unexpected', 'need-a-break'],
    tastes: ['mountains', 'remote', 'adventure', 'quiet'],
    imageUrl: '',
  },
];
