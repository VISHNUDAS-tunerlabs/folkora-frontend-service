# Folkora Frontend — Project State

## Current Project State

### What Exists

- Full Next.js 15 (App Router) project with TypeScript, Tailwind CSS, Framer Motion
- **Screen 1 — Welcome (`/`)**: Animated "Aether Drift" sky, write-on SVG typography, celestial day/night drift, birds, CTA. Fully theme-aware.
- **Screen 2 — Mood (`/onboarding/mood`)**: Four horizontal icon cards, single-select, first card pre-selected. Fully theme-aware.
- **Screen 3 — Taste (`/onboarding/taste`)**: Flat pill/chip multi-select, blur-reveal entrance animation. Fully theme-aware.
- **Screen 4 — Auth (`/auth`)**: Sign-in / create-account toggle, animated name field slide, loading state, Forgot password link, PageQuote. Fully theme-aware. Phase 1 mock auth (always succeeds).
- **Screen 5 — Discover (`/discover`)**: Infinite-looping scroll-driven carousel of curated journeys (hero + 2x2 grid), centered horizontally in the viewport, theme-aware, images, hover animation, Previous/Next buttons, single-step gesture handling.
- **Trip Detail (`/trip/[id]`)**: Shared template page. Hero image, title, tagline, duration, taste pills, and a "Book this journey" link to the booking page. Has a dedicated `not-found.tsx` for unknown ids.
- **Book Journey (`/trip/[id]/book`)**: Image-free booking page — cursive "You are almost there!" heading + quote, a 10x3 backpack-grid party-size picker (30 seats, filled-icon selection), and dynamically generated traveler detail forms (full name, age, gender, contact number) via React Hook Form + Zod, with validation/loading/success states. See below.
- **Light/dark theme system**: Zustand store (`useThemeStore`), Tailwind `darkMode: 'class'`, inline pre-paint script in `layout.tsx` prevents FOUC. `ThemeToggle` on every screen. Persisted to `localStorage`.
- Shared components: `CircleNavButton`, `PageQuote`, `ThemeToggle` in `src/components/`
- Zustand stores: `useOnboardingStore`, `useAuthStore`, `useThemeStore`
- Mock trip data (`MOCK_TRIPS`, 20 trips) with mood/taste personalization filtering and curated images under `public/images/discover/`
- Full Aether Drift token system in `tailwind.config.ts`
- Latest pushed commit: `9ac34a6` on `origin/master` (Discover carousel build + Trip Detail pages). **Everything below from this session (infinite loop, centering, booking flow + reshape) is uncommitted local work.**

### What is Functional

- Complete onboarding flow: Welcome → Mood → Taste → Auth → Discover
- Mood single-select, Taste multi-select (persist in Zustand)
- Mock auth (always succeeds, stores mock user, redirects to `/discover`)
- Discover feed filters mock trips by mood + taste preferences
- Discover carousel: infinite loop (clone-card translation-invariance), scroll/wheel/touch/keyboard/button-driven (Previous + Next), always settles on a card boundary, hover micro-interaction, every card has a photo, hero+grid group is horizontally centered and aligned with the page heading
- Every discover card navigates to `/trip/[id]`, rendering the same template with that trip's data
- Trip detail page links to `/trip/[id]/book`
- Booking flow: select 1–30 travelers via a 10x3 backpack grid (selected backpacks render as solid filled icons), form grows/shrinks traveler fieldsets accordingly, each fieldset collects full name/age/gender/contact number, Zod validation on submit, simulated submit delay, success state ("You're all set.")
- Unknown trip ids render a friendly not-found page with a link back to `/discover`
- Light/dark theme: toggle on all styled screens, persists across reloads and navigation, no FOUC, `prefers-reduced-motion` respected

### What is Incomplete

- No real authentication (Phase 3)
- No API integration (Phase 3) — `trip.service.getTripById` currently reads `MOCK_TRIPS` synchronously but is `async` so the swap to a real fetch needs no page changes
- Auth form uses plain React state — needs React Hook Form + Zod (Phase 2)
- Trip Detail page is still minimal/placeholder per user request — no itinerary, gallery, or map yet; will be reworked later
- Booking flow does not persist anything (Phase 1 mock) — `booking.service.ts` not yet created
- No global 404 (only `/trip/[id]/not-found.tsx` exists)
- No loading/skeleton states (mock data is synchronous, so not yet needed, but Phase 3 will need them)
- No Mapbox integration
- TanStack Query installed but unused

---

## Session Summary (Session 9 — 2026-06-13)

### Discover Carousel — Infinite Loop + Centering

- **`src/features/discover/utils/carousel-keyframes.ts`**: added `CAROUSEL_WINDOW_SIZE = 5` and `getInfiniteCarouselMetrics(cardCount)` (returns initial scroll position, scroll range, and wrap step/target pairs for forward and backward wrap-teleport). `getCardKeyframes` now takes `marginLeft` as a parameter instead of reading a module-level constant. Legacy `getCarouselScrollRange` retained as a fallback for ≤5-card sets.
- **`src/features/discover/constants/carousel-layout.ts`**: added `GROUP_WIDTH` (hero + gap + 2x2 grid width = 912px) for centering math; `CAROUSEL_LAYOUT.marginLeft` (64px) kept as a fallback for narrow viewports.
- **`src/features/discover/hooks/use-carousel-group-margin.ts`** (new): `useCarouselGroupMargin()` computes `(viewportWidth - GROUP_WIDTH) / 2` (or the 64px fallback on narrow screens), used by both the carousel and the Discover page heading so the heading's left edge aligns with the hero card's left edge.
- **`src/features/discover/components/discover-carousel.tsx`**: renders `CAROUSEL_WINDOW_SIZE` clone cards before and after the real set for seamless infinite scrolling; wrap-teleports via `smoothScrollX.jump(value, false)` + direct `scrollLeft` assignment (no visible jump). Added a "Previous journey" button (`left-16`) alongside the existing "Next journey" button (`right-16`); both visible at all breakpoints.
- **`src/app/discover/page.tsx`**: heading wrapper now uses `useCarouselGroupMargin()` for `paddingLeft` so the "Your curated journeys" heading aligns with the carousel's first card.
- Verified via Playwright: carousel loops infinitely in both directions, centering diff = 0px at 1024px and 1440px viewports.

### Trip Detail Page

- Added a "Book this journey" link (`src/app/trip/[id]/page.tsx`) below the taste pills, styled minimally per explicit instruction not to over-style (page will be reworked later). Links to `/trip/[id]/book`.

### Booking Flow (new feature: `src/features/booking/`)

- **`constants/booking.ts`**: `MAX_TRAVELERS = 30`, `BACKPACK_GRID_COLUMNS = 10`.
- **`schemas/booking.schema.ts`**: Zod `participantSchema` (`fullName`, `age`, `gender`, `contactNumber` — all strings, `age` refined to an integer 1–119) and `bookingSchema` (`participants: participantSchema[]`, 1–30 entries), plus `EMPTY_PARTICIPANT`.
- **`components/backpack-selector.tsx`**: 10x3 grid (`grid-cols-10`, `gap-1.5`, `max-width: 480px`) of plain backpack-icon buttons (no numbering, no circle/border container). Tapping backpack N sets party size to N; backpacks `<= value` render as solid filled icons (`text-on-surface dark:text-white`, rect fill + knockout strap/handle strokes), the rest are outlined/muted. `role="group"` + `aria-pressed`/`aria-label` per button.
- **`components/participant-fields.tsx`**: per-traveler `<fieldset>` with Full name (full width) and a `sm:grid-cols-3` row of Age (number input), Gender (`<select>`: Female/Male/Other), and Contact number — reuses the auth page's `INPUT_CLASS`/`LABEL_CLASS` styling; inline validation errors. No "as it appears on your ID" copy.
- **`components/booking-flow.tsx`**: `useForm` + `zodResolver(bookingSchema)` + `useFieldArray`; traveler count drives the field array length; cursive "You are almost there!" heading (`clamp(40px, 7vw, 64px)`) + italic quote above the picker; simulated 900ms submit; idle/submitting/success/error states; success state shows a cursive "You're all set." confirmation. Stagger animations match the auth page's `container`/`item` variants.
- **`src/app/trip/[id]/book/page.tsx`**: image-free route — back-to-trip-detail circular button positioned `absolute left-6/top-6 sm:left-8/top-8` (matching the back-button placement convention on other pages), content padded below it (`pt-24 sm:pt-28`), renders `<BookingFlow trip={trip} />`.
- Added dependency: `@hookform/resolvers` (for `zodResolver`).
- Verified via Playwright across both the initial build and this session's reshape: page renders with the new heading/quote, selecting N travelers produces N filled backpacks and N traveler fieldsets (tested at 3 and 14), empty submit shows validation errors, filling all fields and submitting shows the success state. No console errors. `tsc --noEmit` clean.

### New Dependencies

- `@hookform/resolvers` (zod resolver for React Hook Form)

---

## Immediate Next Steps

1. **Commit this session's work** (carousel infinite loop + centering, booking flow + reshape, trip detail "Book" link) — currently uncommitted local changes
2. **`booking.service.ts`** (Phase 3 prep) — extract the mock submit from `booking-flow.tsx` into a service function so swapping to a real API later requires no component changes
3. **Flesh out the Trip Detail page** — itinerary/gallery sections, map placeholder (per Phase 1: still static/mock); user has flagged this page for a future rework pass
4. **Add Shadcn/UI** — wire its theming to the same `.dark` class strategy already in place
5. **React Hook Form + Zod for Auth form** (Phase 2) — currently plain React state

---

## Open Issues

- This session's carousel + booking work is uncommitted — commit before starting new work
- Auth form needs React Hook Form + Zod (Phase 2)
- Trip Detail page is intentionally minimal/placeholder — slated for a rework pass
- Booking flow has no `booking.service.ts` yet — submit is mocked inline in `booking-flow.tsx`
- No global 404 page (only the trip-detail-scoped one)
- No real loading, empty, or error states tied to async data (not yet needed — Phase 1 data is synchronous)
- `project-memory.md` picks up a trailing uncommitted diff after each commit (auto-generated by git post-commit hook) — one trailing entry is normal, not a problem

---

## Architecture Decisions

- **Theme = Zustand + Tailwind `class` strategy + inline pre-paint script**: `useThemeStore` owns `theme` and DOM/localStorage sync. `darkMode: 'class'` makes `dark:` variants key off the `<html>` class. An inline `<script>` in `layout.tsx`'s `<head>` applies the class from `localStorage` before React hydrates.
- **Light = default (no prefix), dark = `dark:` variant**: matches Tailwind convention.
- **Selected/accent state inverts between themes**: dark chip + white text in light mode, white chip + dark text in dark mode. The booking page's filled backpack icon follows the same convention (`text-on-surface dark:text-white` with knockout inner strokes).
- **Infinite carousel via clone cards**: `CAROUSEL_WINDOW_SIZE` clones of the start/end of the trip list are rendered on either side of the real set; scroll position wrap-teleports between equivalent positions using `motionValue.jump()` + direct `scrollLeft` assignment, so the loop is visually seamless.
- **Shared margin hook for alignment**: `useCarouselGroupMargin()` is the single source of truth for the carousel's horizontal centering and the Discover page heading's left padding — keeps both in sync without duplicating viewport-width logic.
- **Booking flow reuses auth page styling constants** (`INPUT_CLASS`, `LABEL_CLASS`, stagger variants) rather than introducing new design tokens, per "design matching the aesthetics of other pages."
- **Booking page is intentionally image-free**: unlike the Discover and Trip Detail pages, the booking page drops the hero image entirely to keep focus on the form; the back button uses the same circular convention but is positioned over plain background rather than over imagery.
- **Participant fields collect age/gender/contact number, not email/phone**: matches a real-world group booking manifest (per "based on ticket booking get participant details accordingly") rather than an account-style contact form.

---

## Future Considerations

- Backpack selector icon could be promoted to a shared icon component if other features need it (e.g. trip "essentials" lists)
- Booking flow could support removing a specific traveler (not just resizing from the end) if user feedback asks for it
- Consider a shared `Stepper`/`SegmentedControl` primitive if more "pick a number" UIs appear (per Phase 2 design system goals)
- With 30 possible travelers, the traveler-details list could get long — consider collapsing filled-in fieldsets or paginating if real users routinely book large groups
