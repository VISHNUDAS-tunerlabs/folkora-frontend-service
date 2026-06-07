/**
 * Welcome Page — Screen 1
 *
 * Animated night-sky splash screen drawn from the Stitch "Aether Drift" design.
 * Sets the emotional tone before any personalization or booking occurs.
 *
 * Animation sequence:
 *   1s  — "Hi," fades in
 *   3s  — "Welcome To" writes on via SVG stroke
 *   7s  — "Folkora" writes on via SVG stroke
 *   8.5s — Both texts fill to solid white
 *   9.5s — Tagline + CTA + progress dots fade in
 *
 * Navigation: → /onboarding/mood
 */

import { WelcomeCanvas } from '@/features/onboarding/components/welcome-canvas';

export default function WelcomePage() {
  return <WelcomeCanvas />;
}
