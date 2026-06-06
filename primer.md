# Folkora Frontend — Project State

## Current Project State

### What Exists
- Full Next.js 15 project scaffolded with App Router, TypeScript, Tailwind CSS
- All 5 screens implemented as plain, unstyled functional pages with working navigation
- Zustand stores for onboarding state and auth state
- Mock trip data with personalization filtering logic
- Complete folder structure per CLAUDE.md architecture

### What is Functional
- Full onboarding flow: Welcome → Mood → Taste → Auth → Discover
- Mood selection (single select, persists in Zustand)
- Taste selection (multi-select, persists in Zustand)
- Fake auth (login/signup form, always succeeds, stores mock user)
- Authenticated users skip the auth screen (redirected from taste page)
- Discovery feed filters mock trips by mood + taste preferences
- All pages build successfully with zero TypeScript errors

### What is Incomplete
- No styling — all screens are plain HTML elements (intentional per initial-pages.md)
- No Framer Motion animations yet
- No Shadcn/UI components yet
- No real authentication (Phase 3)
- No API integration (Phase 3)
- No Mapbox integration
- No TanStack Query hooks (no server state yet)
- No React Hook Form / Zod on auth forms (currently uncontrolled, Phase 2)

---

## Session Summary

### Features Completed
- Project scaffolded from scratch (package.json, tsconfig, next.config, tailwind, postcss)
- Screen 1: Welcome Page (`/`) — headline + single CTA
- Screen 2: Mood Collection (`/onboarding/mood`) — 7 mood options, single select
- Screen 3: Travel Taste Collection (`/onboarding/taste`) — 3 groups, multi-select
- Auth Page (`/auth`) — login/signup toggle, mock auth, redirect to discover
- Discovery Feed (`/discover`) — filters MOCK_TRIPS by mood + taste preferences

### Components Added
None yet — all screens are in `src/app/` as page-level components. Phase 2 will extract reusable components to `src/components/` and `src/features/*/components/`.

### New Dependencies Introduced
- next ^15.3.3
- react ^19.0.0
- zustand ^4.5.5
- @tanstack/react-query ^5.62.0 (installed, not yet used)
- framer-motion ^11.15.0 (installed, not yet used)
- react-hook-form ^7.54.0 (installed, not yet used)
- zod ^3.23.8 (installed, not yet used)
- tailwindcss ^3.4.17 (installed, not yet used in components)

---

## Immediate Next Steps

1. **Style Screen 1 (Welcome Page)** — full-screen hero, large typography, single CTA
2. **Style Screen 2 (Mood Collection)** — mood cards with hover/selected states
3. **Style Screen 3 (Travel Taste Collection)** — grouped pill/tag selectors
4. **Style Auth Page** — clean centered form, login/signup toggle
5. **Style Discovery Feed** — trip cards with destination, duration, tagline
6. Add Framer Motion page transitions and card reveal animations
7. Extract reusable components (Button, Card, Input) to `src/components/`
8. Add Shadcn/UI primitives as the component foundation
9. Add React Hook Form + Zod to the auth form

---

## Open Issues

- Auth form uses plain React state — needs React Hook Form + Zod validation (Phase 2)
- Trip cards have no images — `imageUrl` is empty string in mock data (placeholder needed)
- No 404 / not-found page customized yet
- No loading states on any page yet
- No error boundaries

---

## Architecture Decisions

- **Zustand for onboarding + auth state**: Client-side UI state only. Server data will go through React Query in Phase 3. Stores are reset-able for logout flows.
- **Mock data in `src/constants/`**: Static trips and onboarding options live here for Phase 1. Promotes easy replacement with API calls in Phase 3 without touching component code.
- **Personalization logic in `discover/page.tsx`**: Simple filter function co-located with the page for now. Will move to `src/features/discover/services/` when API integration begins.
- **Screens as plain page components**: No shared layout or nav bar yet — avoids premature abstraction before styling direction is confirmed.
- **Taste page skips auth for authenticated users**: Logic lives in the taste page's `handleContinue` function, reading from `useAuthStore`.

---

## Future Considerations

- Add a persistent nav bar/header component once visual direction is established
- Consider adding a progress indicator component for the onboarding flow
- Mapbox integration for destination map views on trip detail pages
- Trip detail page (`/trip/[id]`) needed before booking flow
- Consider storing onboarding preferences to user profile after Phase 3 auth
- Add Suspense + skeleton loading states before API integration
