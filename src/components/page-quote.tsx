'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
};

interface PageQuoteProps {
  children: ReactNode;
  className?: string;
}

/**
 * Italic, muted travel quote shown beneath the main content on onboarding
 * screens. `text-gray-500` reads with comfortable contrast against both the
 * dark "Aether Drift" gradient and the light gradient, so no theme variant
 * is needed.
 *
 * Declares the shared `item` fade/drift variant and inherits `hidden`/
 * `visible` from the page's stagger container — drop it directly into an
 * existing `motion.div` orchestration without rewiring animation props.
 */
export function PageQuote({ children, className = '' }: PageQuoteProps) {
  return (
    <motion.p variants={item} className={`text-body-md text-gray-500 italic text-center ${className}`}>
      {children}
    </motion.p>
  );
}
