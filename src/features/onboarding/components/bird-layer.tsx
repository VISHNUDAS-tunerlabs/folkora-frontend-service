'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const BIRD_COUNT = 6;
const BIRD_PATH = 'M2,12 C2,12 8,8 14,11 C20,14 26,10 30,12 C26,12 20,16 14,13 C8,10 2,12 2,12 Z';

interface Bird {
  id: number;
  top: number;
  delay: number;
  duration: number;
  scale: number;
  wingDuration: number;
}

/**
 * Decorative bird glide layer. Hidden from assistive tech.
 * Generates birds once via useMemo — no duplication on re-render.
 * Renders nothing when prefers-reduced-motion is set.
 */
export function BirdLayer() {
  const prefersReducedMotion = useReducedMotion();

  const [birds, setBirds] = useState<Bird[]>([]);

  useEffect(() => {
    setBirds(
      Array.from({ length: BIRD_COUNT }, (_, i) => ({
        id: i,
        top: 10 + Math.random() * 60,
        delay: Math.random() * 25,
        duration: 18 + Math.random() * 15,
        scale: 0.5 + Math.random() * 0.8,
        wingDuration: 2 + Math.random() * 2,
      })),
    );
  }, []);

  if (prefersReducedMotion) return null;

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {birds.map((bird) => (
        <div
          key={bird.id}
          className="bird-container"
          style={{
            top: `${bird.top}%`,
            animationDelay: `-${bird.delay}s`,
            animationDuration: `${bird.duration}s`,
            transform: `scale(${bird.scale})`,
          }}
        >
          <svg
            className="bird-svg"
            viewBox="0 0 32 24"
            style={{ animationDuration: `${bird.wingDuration}s` }}
          >
            <path d={BIRD_PATH} />
          </svg>
        </div>
      ))}
    </div>
  );
}
