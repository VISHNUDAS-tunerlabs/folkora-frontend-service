'use client';

const CHEVRON_PATHS: Record<'back' | 'next', string> = {
  back: 'M11 4L6 9l5 5',
  next: 'M7 4l5 5-5 5',
};

const POSITION_CLASSES: Record<'back' | 'next', string> = {
  back: 'left-8',
  next: 'right-8',
};

interface CircleNavButtonProps {
  /** Determines chevron direction, corner placement, and accessible label fallback. */
  direction: 'back' | 'next';
  label: string;
  onClick: () => void;
  /**
   * Visual-only disabled state (opacity + cursor), not the `disabled` attribute.
   * Framer Motion's whileTap + disabled combo swallows click events — see
   * the "Buttons with Framer Motion" architecture pattern.
   */
  disabled?: boolean;
}

/**
 * Circular chevron button used for onboarding back/next navigation.
 * Back sits top-left, next sits top-right — the established placement
 * across the Welcome, Mood, and Taste screens.
 *
 * Colors invert between themes for contrast: a dark circle on light
 * backgrounds, a white circle on the dark "Aether Drift" backgrounds.
 */
export function CircleNavButton({ direction, label, onClick, disabled = false }: CircleNavButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-disabled={disabled}
      className={`absolute top-8 ${POSITION_CLASSES[direction]} w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-on-surface text-surface-container-lowest focus-visible:ring-on-surface focus-visible:ring-offset-surface dark:bg-white dark:text-on-surface dark:focus-visible:ring-white dark:focus-visible:ring-offset-black ${
        disabled
          ? 'opacity-30 cursor-not-allowed'
          : 'opacity-100 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]'
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={CHEVRON_PATHS[direction]} />
      </svg>
    </button>
  );
}
