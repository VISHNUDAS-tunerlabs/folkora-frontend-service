'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CelestialLayer } from './celestial-layer';
import { BirdLayer } from './bird-layer';
import { OnboardingTypography } from './onboarding-typography';
import { OnboardingCTA } from './onboarding-cta';

const SKY_DAY = 'linear-gradient(160deg, #111111 0%, #000000 100%)';
const SKY_NIGHT = 'linear-gradient(160deg, #0a0a0a 0%, #000000 100%)';

/**
 * Full-screen animated welcome canvas.
 *
 * Owns the isNight state that drives both the background gradient
 * and the celestial body positions. Toggles every 8s.
 *
 * Animation sequence:
 *   1s  — "Hi," fades in
 *   3s  — "Welcome To" stroke animation begins
 *   7s  — "Folkora" stroke animation begins
 *   8.5s — Both texts fill white
 *   9.5s — Tagline and CTA button fade in
 */
export function WelcomeCanvas() {
  const [isNight, setIsNight] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => setIsNight((prev) => !prev), 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main
      className="relative h-screen w-screen flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop overflow-hidden"
      style={{
        background: isNight ? SKY_NIGHT : SKY_DAY,
        transition: prefersReducedMotion ? 'none' : 'background 2s ease',
      }}
    >
      <CelestialLayer isNight={isNight} />
      <BirdLayer />

      <div className="relative z-10 flex flex-col items-start text-left max-w-2xl w-full">
        <div className="flex flex-col items-start">
          <motion.p
            className="text-body-lg text-surface-container-highest mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 2, delay: 1, ease: [0.4, 0, 0.2, 1] }
            }
          >
            Hi,
          </motion.p>

          <OnboardingTypography />

          <motion.p
            className="text-body-md text-surface-container-high max-w-xs -mt-4 italic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 1.5, delay: 9.5, ease: [0.4, 0, 0.2, 1] }
            }
          >
            &ldquo;We help you discover stories worth carrying.&rdquo;
          </motion.p>

          <OnboardingCTA />
        </div>
      </div>
    </main>
  );
}
