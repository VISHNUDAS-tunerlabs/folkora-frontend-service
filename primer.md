# Folkora Frontend — Project State

## Current Project State

### What Exists

- Full Next.js 15 (App Router) project with TypeScript, Tailwind CSS, Framer Motion
- **Screen 1 — Welcome (`/`)**: Animated "Aether Drift" sky, write-on SVG typography, celestial day/night drift, birds, CTA. Fully theme-aware.
- **Screen 2 — Mood (`/onboarding/mood`)**: Four horizontal icon cards, single-select, first card pre-selected. Fully theme-aware.
- **Screen 3 — Taste (`/onboarding/taste`)**: Flat pill/chip multi-select, blur-reveal entrance animation. Fully theme-aware.
- **Screen 4 — Auth (`/auth`)**: Sign-in / create-account toggle, animated name field slide, loading state, Forgot password link, PageQuote. Fully theme-aware. Phase 1 mock auth (always succeeds).
- **Screen 5 — Discover (`/discover`)**: Scroll-driven carousel of curated journeys (hero + 2x2 grid that continuously cycles), theme-aware, images, hover animation, "Next" button, single-step gesture handling. See below for details.
- **Trip Detail (`/trip/[id]`)**: New shared template page. Every carousel card links here; content resolved per trip id via `trip.service`. Has a dedicated `not-found.tsx` for unknown ids.
- **Light/dark theme system**: Zustand store (`useThemeStore`), Tailwind `darkMode: 'class'`, inline pre-paint script in `layout.tsx` prevents FOUC. `ThemeToggle` on every screen. Persisted to `localStorage`.
- Shared components: `CircleNavButton`, `PageQuote`, `ThemeToggle` in `src/components/`
- Zustand stores: `useOnboardingStore`, `useAuthStore`, `useThemeStore`
- Mock trip data (`MOCK_TRIPS`, 20 trips) with mood/taste personalization filtering and curated images under `public/images/discover/`
- Full Aether Drift token system in `tailwind.config.ts`
- Latest pushed commit: `8c27221` on `origin/master`. **Everything below (full Discover carousel build + Trip Detail page) is uncommitted local work.**

### What is Functional

- Complete onboarding flow: Welcome → Mood → Taste → Auth → Discover
- Mood single-select, Taste multi-select (persist in Zustand)
- Mock auth (always succeeds, stores mock user, redirects to `/discover`)
- Discover feed filters mock trips by mood + taste preferences
- Discover carousel: scroll/wheel/touch/keyboard/button-driven, always settles on a card boundary, hover micro-interaction, every card has a photo
- Every discover card navigates to `/trip/[id]`, rendering the same template with that trip's data (title, destination, country, duration, tagline, tastes)
- Unknown trip ids render a friendly not-found page with a link back to `/discover`
- Light/dark theme: toggle on all styled screens, persists across reloads and navigation, no FOUC, `prefers-reduced-motion` respected

### What is Incomplete

- No real authentication (Phase 3)
- No API integration (Phase 3) — `trip.service.getTripById` currently reads `MOCK_TRIPS` synchronously but is `async` so the swap to a real fetch needs no page changes
- Auth form uses plain React state — needs React Hook Form + Zod (Phase 2)
- Trip Detail page is minimal (hero image, title, tagline, duration, taste tags) — no booking CTA, itinerary, gallery, or map yet
- No global 404 (only `/trip/[id]/not-found.tsx` exists)
- No loading/skeleton states (mock data is synchronous, so not yet needed, but Phase 3 will need them)
- No Mapbox integration
- TanStack Query and React Hook Form + Zod installed but unused

---

## Session Summary (Session 8 — 2026-06-13)

### Discover Carousel (`src/features/discover/components/discover-carousel.tsx`, `carousel-card.tsx`)

Built out the full interaction model for the scroll-driven hero + 2x2 grid carousel:

- **Scroll-snap that always completes a transition**: an idle-snap effect animates `scrollLeft` to the nearest `SET_WIDTH` multiple (`SNAP_IDLE_MS` = 120ms idle, `SNAP_DURATION_S` = 0.4s, ease `[0.4,0,0.2,1]`).
- **Spring-smoothed scroll position**: `smoothScrollX = useSpring(scrollX, { stiffness: 300, damping: 32, mass: 0.6 })` feeds all card transforms, so the hero/grid transition reads as fluid rather than mechanical.
- **One gesture = one step, regardless of input**: a shared `stepCarousel(el, direction)` / `animateTo(el, target)` pair drives wheel, touch, and the Next button.
  - Wheel: picks whichever of `deltaX`/`deltaY` has the larger magnitude (handles macOS trackpad swipes that report as either axis), debounces a full gesture including its inertial momentum tail via `WHEEL_GESTURE_GAP_MS` (180ms) so one big swipe = one step.
  - Touch: `touch-action: none` + `preventDefault` suppress native scrolling; `touchend` measures total `deltaX` against a 30px threshold, then steps once regardless of swipe depth/speed.
  - Rapid repeated gestures while an animation is mid-flight are queued via `pendingStepRef` (not dropped) and run on `onComplete`.
- **"Next" button**: fixed-position circular arrow button, sibling to the scroll container (so its `right` offset is relative to the viewport, not the scrollable content), currently at `right-16`. Calls the same `stepCarousel`.
- **Hover animation** (`carousel-card.tsx`): `whileHover={{ scale: 1.02 }}` on the card, image `group-hover:scale-110`, overlay gradient lightens on hover.
- **Images**: all 20 `MOCK_TRIPS` entries now have `imageUrl` pointing at `public/images/discover/*.jpg` (10 unique images, reused across trips for demo purposes). `next/image` with `fill`, `sizes`, `priority` on the initial hero card; falls back to a gradient if `imageUrl` is empty.
- **Small-card tagline gap fix**: `taglineHeight`/`taglineOpacity` both animate from the card's width, collapsing the tagline's reserved space to `0` in grid cells so there's no gap between the place name and the duration line.

### Trip Detail Page (new)

- **`src/features/trip/services/trip.service.ts`**: `getTripById(id): Promise<Trip | null>` — Phase 1 reads `MOCK_TRIPS`; Phase 3 will replace the body with an API call without changing callers (per CLAUDE.md service-layer + Phase 3 rules).
- **`src/app/trip/[id]/page.tsx`**: async Server Component. Full-bleed hero image (60–70vh) with gradient overlay, back button to `/discover`, destination/country eyebrow, large cursive title, tagline, duration, and taste pills below. Calls `notFound()` if no trip matches the id.
- **`src/app/trip/[id]/not-found.tsx`**: editorial empty state ("This journey has wandered off.") with a link back to `/discover`.
- **`carousel-card.tsx`**: the card is now `motion.create(Link)` (`MotionLink`) pointing at `/trip/${trip.id}` — preserves all existing motion transforms (x/y/width/height/opacity/zIndex) and hover animation while making the whole card a link.
- Verified with Playwright: clicking the hero card navigates to `/trip/trip-001` and renders "The Quiet Dolomites"; a different trip (`/trip/trip-005`) renders the same template with "Kyoto in Autumn"; an unknown id renders the not-found page.

### New Dependencies

None added this session.

---

## Immediate Next Steps

1. **Commit the Discover carousel + Trip Detail work** (currently uncommitted local changes)
2. **Flesh out the Trip Detail page** — itinerary/gallery sections, booking CTA, map placeholder (per Phase 1: still static/mock)
3. **Add Shadcn/UI** — wire its theming to the same `.dark` class strategy already in place
4. **React Hook Form + Zod for Auth form** (Phase 2) — currently plain React state

---

## Open Issues

- Discover carousel + Trip Detail page are uncommitted local changes — commit before starting new work
- Auth form needs React Hook Form + Zod (Phase 2)
- Trip Detail page has no booking CTA, itinerary, or gallery yet
- No global 404 page (only the trip-detail-scoped one)
- No real loading, empty, or error states tied to async data (not yet needed — Phase 1 data is synchronous)
- `project-memory.md` picks up a trailing uncommitted diff after each commit (auto-generated by git post-commit hook) — one trailing entry is normal, not a problem

---

## Architecture Decisions

- **Theme = Zustand + Tailwind `class` strategy + inline pre-paint script**: `useThemeStore` owns `theme` and DOM/localStorage sync. `darkMode: 'class'` makes `dark:` variants key off the `<html>` class. An inline `<script>` in `layout.tsx`'s `<head>` applies the class from `localStorage` before React hydrates.
- **Light = default (no prefix), dark = `dark:` variant**: matches Tailwind convention.
- **Selected/accent state inverts between themes**: dark chip + white text in light mode, white chip + dark text in dark mode.
- **CSS custom properties for FOUC-free JS-computed theme values**: `--sky-day`/`--sky-night`/`--svg-ink` defined per-theme in `:root`/`.dark`.
- **Single shared `@keyframes` per animated property, CSS var for the color**: never swap `animation-name` per theme.
- **`motion.div` wrapper + plain `<button>`**: Framer Motion's `whileTap`/`disabled` on `motion.button` swallows clicks.
- **Explicit navigation over `router.back()`**.
- **Carousel: absolute positioning + scroll-driven transforms, not pagination**: every card is positioned via `useTransform(scrollX, keyframes...)` so the hero/grid layout is one continuous cycle rather than discrete "pages" (see `utils/carousel-keyframes.ts`).
- **One gesture = one step**: shared `stepCarousel`/`animateTo` + `isAnimatingRef`/`pendingStepRef` ensures wheel/touch/button/keyboard input always advances exactly one `SET_WIDTH`, queuing (not dropping) gestures that arrive mid-animation.
- **Fixed-position carousel controls must be siblings of the scroll container**: a button placed *inside* an `overflow-x-auto` element has its `right`/`left` offsets computed against the scrollable content box, not the viewport — it will appear to scroll with the content. Wrap the scroll container and any fixed controls in an outer `relative` div instead.
- **Cards as `motion.create(Link)`**: to keep both Framer Motion's transform-driven `style` props and Next's client-side navigation on the same element, wrap `next/link`'s `Link` with `motion.create()` rather than nesting a `motion.article` inside a `Link` (or vice versa).
- **Shared detail route via dynamic segment**: `/trip/[id]` is one template for all trips — Phase 1 resolves `id` against `MOCK_TRIPS` via an `async` service function so Phase 3's API swap requires no page changes.

---

## Future Considerations

- Progress indicator for onboarding flow (step dots or arc path)
- CMS for onboarding options (moods, tastes) to allow non-code updates
- Mapbox integration for destination map views
- Trip Detail page: itinerary, gallery, booking flow, map
- Store onboarding preferences to user profile post Phase 3 auth
- Suspense + skeleton states once Trip Detail/Discover move to real API calls
- Consider seeding first visit from `prefers-color-scheme` instead of always defaulting to dark
- Once Shadcn/UI is added, migrate its tokens onto the same `.dark`/CSS-variable approach
- Consider a "previous" button mirroring the new "Next" button for symmetry
