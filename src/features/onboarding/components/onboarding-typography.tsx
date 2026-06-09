'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * SVG stroke write-on typography for the welcome sequence.
 *
 * Uses stroke-dasharray animation to draw each character in sequence.
 * getComputedTextLength() is used on mount to get precise path lengths —
 * initial values are safe approximations that are overwritten client-side.
 *
 * When prefers-reduced-motion is active, text is shown immediately at full opacity.
 */
export function OnboardingTypography() {
  const welcomeRef = useRef<SVGTextElement>(null);
  const folkoraRef = useRef<SVGTextElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    [welcomeRef.current, folkoraRef.current].forEach((el) => {
      if (!el) return;
      const length = el.getComputedTextLength() * 2.5;
      el.style.strokeDasharray = String(length);
      el.style.strokeDashoffset = String(length);
    });
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="mb-6 flex flex-col gap-2" aria-label="Welcome To Folkora">
        <span className="text-on-surface dark:text-white leading-none" style={{ fontFamily: 'var(--font-passions), cursive', fontSize: 'clamp(60px, 12vw, 120px)' }}>
          Welcome To
        </span>
        <span className="text-on-surface dark:text-white font-bold leading-none" style={{ fontSize: 'clamp(40px, 7vw, 72px)', letterSpacing: '-0.02em' }}>
          Folkora
        </span>
      </div>
    );
  }

  return (
    <svg
      className="overflow-visible mb-6 w-full max-w-2xl"
      viewBox="0 0 600 220"
      role="img"
      aria-label="Welcome To Folkora"
    >
      <text
        ref={welcomeRef}
        className="svg-text-welcome"
        style={{ fontSize: '120px', strokeDasharray: '1046', strokeDashoffset: '1046' }}
        textAnchor="start"
        x="0"
        y="80"
      >
        Welcome To
      </text>
      <text
        ref={folkoraRef}
        className="svg-text-folkora"
        style={{ fontSize: '72px', strokeDasharray: '632', strokeDashoffset: '632' }}
        textAnchor="start"
        x="0"
        y="170"
      >
        Folkora
      </text>
    </svg>
  );
}
