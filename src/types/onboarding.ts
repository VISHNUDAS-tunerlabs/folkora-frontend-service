/**
 * Onboarding domain types.
 *
 * These types represent the data collected during the lightweight
 * pre-discovery onboarding flow: mood + travel taste preferences.
 * They are used to personalize the discovery feed shown after onboarding.
 */

/** A single selectable mood option presented to the user. */
export interface MoodOption {
  id: string;
  label: string;
  description: string;
}

/** A single selectable taste/preference option within a group. */
export interface TasteOption {
  id: string;
  label: string;
}

/** A named group of related taste options (e.g. Nature, Atmosphere). */
export interface TasteGroup {
  id: string;
  label: string;
  options: TasteOption[];
}

/** The full set of onboarding data collected before showing the discovery feed. */
export interface OnboardingData {
  selectedMood: string | null;
  selectedTastes: string[];
}
