/**
 * Onboarding state store.
 *
 * Manages the user's mood and taste selections collected during the
 * pre-discovery onboarding flow. This state is used to personalize
 * the discovery feed shown after onboarding is complete.
 *
 * Zustand is used here (not React Query) because this is temporary
 * client-side UI state — it is not server data and does not need caching.
 * Once a user's preferences are persisted to the backend (Phase 3),
 * this store will be cleared and preferences will be loaded via React Query.
 */

import { create } from 'zustand';

interface OnboardingState {
  selectedMood: string | null;
  selectedTastes: string[];

  /** Set the user's current travel mood. Only one mood can be selected. */
  setMood: (moodId: string) => void;

  /**
   * Toggle a taste preference on or off.
   * Multiple tastes can be selected simultaneously.
   */
  toggleTaste: (tasteId: string) => void;

  /** Clear all onboarding selections (used on logout or reset). */
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  selectedMood: null,
  selectedTastes: [],

  setMood: (moodId) => set({ selectedMood: moodId }),

  toggleTaste: (tasteId) =>
    set((state) => ({
      selectedTastes: state.selectedTastes.includes(tasteId)
        ? state.selectedTastes.filter((id) => id !== tasteId)
        : [...state.selectedTastes, tasteId],
    })),

  reset: () => set({ selectedMood: null, selectedTastes: [] }),
}));
