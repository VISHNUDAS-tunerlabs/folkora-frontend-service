'use client';

import { BACKPACK_GRID_COLUMNS, MAX_TRAVELERS } from '../constants/booking';

interface BackpackSelectorProps {
  /** Number of travelers currently selected (1-indexed). */
  value: number;
  onChange: (count: number) => void;
}

/**
 * Party-size picker styled like a cinema seat map, but with backpacks
 * standing in for seats — fitting for a travel booking rather than a
 * screening. Tapping backpack N sets the party size to N; every backpack up
 * to and including that one fills in, the rest stay outlined.
 */
export function BackpackSelector({ value, onChange }: BackpackSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Number of travelers"
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${BACKPACK_GRID_COLUMNS}, minmax(0, 1fr))`, maxWidth: 480 }}
    >
      {Array.from({ length: MAX_TRAVELERS }, (_, i) => i + 1).map((count) => {
        const selected = count <= value;
        return (
          <button
            key={count}
            type="button"
            onClick={() => onChange(count)}
            aria-pressed={selected}
            aria-label={`${count} ${count === 1 ? 'traveler' : 'travelers'}`}
            className="flex h-9 w-9 items-center justify-center transition-colors duration-200"
          >
            <BackpackIcon
              filled={selected}
              className={`h-6 w-6 transition-colors duration-200 ${
                selected
                  ? 'text-on-surface dark:text-white'
                  : 'text-on-surface-variant hover:text-on-surface dark:text-surface-container-high dark:hover:text-surface-container-lowest'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function BackpackIcon({ className, filled = false }: { className?: string; filled?: boolean }) {
  const knockoutClass = filled ? 'stroke-surface-container-lowest dark:stroke-on-surface' : '';

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" />
      <rect x="5" y="7" width="14" height="14" rx="2.5" fill={filled ? 'currentColor' : 'none'} />
      <path d="M9 12h6" className={knockoutClass} />
      <path d="M9 7v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V7" className={knockoutClass} />
    </svg>
  );
}
