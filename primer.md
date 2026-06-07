# Folkora Frontend — Project State

## Current Project State

### What Exists
- Full Next.js 15 (App Router) project with TypeScript, Tailwind CSS
- **Screen 1 (Welcome `/`)** — fully styled animated night-sky splash screen imported from Stitch, production-ready
- **Screen 2 (Mood `/onboarding/mood`)** — fully styled with horizontal icon cards, dark background, navigation buttons
- **Screen 3 (Taste `/onboarding/taste`)** — fully styled with grouped pill-shaped multi-select chips, same dark background and nav pattern as Mood
- Auth Page (`/auth`) — plain, unstyled
- Discovery Feed (`/discover`) — plain, unstyled
- Zustand stores for onboarding + auth state
- Mock trip data with personalization filtering logic
- Full Aether Drift design token system wired into Tailwind config
- Raw Stitch import preserved at `/imported/folkora-onboarding-immersive-story/index.html`
- All session work committed and pushed to `origin/master` (commit `4562a9f`)

### What is Functional
- Full onboarding flow navigation: Welcome → Mood → Taste → Auth → Discover
- Mood selection (single select, first card selected by default, persists in Zustand)
- Taste selection (multi-select, persists in Zustand)
- Fake auth (always succeeds, stores mock user)
- Discovery feed filters mock trips by mood + taste preferences

### What is Incomplete
- Screens 4–5 (Auth, Discover) — unstyled plain HTML
- No real authentication (Phase 3)
- No API integration (Phase 3)
- No Mapbox integration
- TanStack Query installed but not yet used
- React Hook Form + Zod installed but not yet used
- No loading, empty, or error states

---

## Session Summary (Session 3 — 2026-06-06 / 2026-06-07)

### Commit
- `4562a9f` — feat: build animated welcome screen from Stitch and redesign mood page
- Pushed to `origin/master` (`d22a449..4562a9f`)
- 15 files changed, 1057 insertions, 123 deletions

### Stitch Import & Production Conversion (Welcome Screen)
- Imported Stitch project `12827796371518906841` ("Animated Day-Night Onboarding") via MCP
- Raw import saved to `/imported/folkora-onboarding-immersive-story/index.html`
- Full 12-category audit performed — 9 critical, 10 minor issues identified
- All issues resolved, production components created:
  - `src/features/onboarding/components/welcome-canvas.tsx` — main container, sky state
  - `src/features/onboarding/components/celestial-layer.tsx` — sun/moon Framer Motion transition
  - `src/features/onboarding/components/bird-layer.tsx` — animated birds (hydration-safe via useEffect)
  - `src/features/onboarding/components/onboarding-typography.tsx` — SVG stroke write-on animation
  - `src/features/onboarding/components/onboarding-cta.tsx` — CTA button fixed bottom-right

### Welcome Screen Key Details
- Animation sequence: 1s "Hi," → 3s "Welcome To" stroke → 7s "Folkora" stroke → 8.5s fill → 9.5s tagline + CTA
- Sky toggles between day/night every 8s via Framer Motion
- Full `prefers-reduced-motion` support
- "Folkora" SVG text uses Plus Jakarta Sans; all other UI uses Nunito
- "Welcome To" uses Passions Conflict (cursive)
- CTA button: fixed `bottom-8 right-8`, small pill, navigates to `/onboarding/mood`
- Motto quote: left-aligned below typography, same italic style, fades in at 9.5s
- `devIndicators: false` in next.config.ts (hides dev toolbar)

### Design Tokens (tailwind.config.ts)
- Full Aether Drift palette (50+ color tokens)
- Custom spacing: `unit`, `gutter`, `margin-mobile`, `margin-desktop`, `section-gap`
- Custom border radius: `sm`, `DEFAULT`, `md`, `lg`, `xl`, `full`
- Custom font sizes: `headline-lg`, `headline-lg-mobile`, `headline-md`, `body-lg`, `body-md`, `label-md`
- Font families: `sans` → Nunito (`--font-nunito`), `cursive` → Passions Conflict (`--font-passions`)
- Plus Jakarta Sans loaded as `--font-jakarta` (used only in SVG "Folkora" write-on)

### Mood Page Redesign
- Condensed moods from 7 → 4: "I need a break", "I want adventure", "I want to slow down", "I want to reconnect"
- Horizontal 4-column icon card grid (`grid-cols-4`)
- Each card: fixed `h-36`, `rounded-md`, icon on top + bold label below
- Unique SVG icon per mood: moon, mountain, leaf, heart
- First card selected by default on mount via `useEffect`
- Back button: white circle, `absolute top-8 left-8`, navigates to `/`
- Next button: white circle, `absolute top-8 right-8`, enabled when mood selected
- Philosophical quote below cards: `text-gray-500 italic opacity-25`
- "How Are You Feeling?" label in title case (not uppercase)
- Background: same glossy black gradient as welcome screen (`160deg, #111111 → #000000`)
- Staggered fade-in animation on all elements

### Bugs Fixed
- Hydration mismatch: `Math.random()` in `useMemo` → moved to `useEffect` + `useState`
- Continue button unresponsive: removed `disabled` attr + `motion.button` combo → plain `<button>` with conditional classes
- Back button navigating forward: `router.back()` → `router.push('/')` (explicit route)

### Taste Page Redesign (Screen 3)
- Rebuilt `src/app/onboarding/taste/page.tsx` to match the Mood page's vibe exactly:
  - Same glossy black gradient background, `max-w-2xl` content column (wider than Mood's `max-w-lg` to fit pill rows)
  - Same label/headline pattern: `"Your Travel Taste"` tracking-widest label + `"What kind of journey calls to you?"` headline + supporting body copy
  - Same white circular nav buttons: back → `/onboarding/mood`, next → `handleContinue` (routes to `/discover` if `isAuthenticated`, else `/auth`) — both always enabled since taste selection is optional
  - Same `text-gray-500 italic` philosophical quote at the bottom, same stagger fade-in (`container`/`item` variants, `staggerChildren: 0.08`)
- Taste options rendered as small oval/pill multi-select chips per the user's request ("small ovel cards like botton shape"): `rounded-full px-6 py-2.5 border`, selected = white fill + dark text, unselected = transparent + outline, `aria-pressed` for a11y
- Per follow-up feedback ("remove category heading club and combine everything together"): flattened all `TASTE_GROUPS` options into a single `allTasteOptions = TASTE_GROUPS.flatMap(...)` list — no more per-category `<h2>` headings or `<section>` wrappers, just one `flex flex-wrap justify-center gap-3` row of pills
- Entrance animation went through two iterations: first a rotation-wobble "shaky settle" per "initialy give a shacky animation for all option coming together", then replaced per "try some other animation suiting the vibe" with a calmer **blur-to-focus reveal** — `hidden: { opacity: 0, filter: 'blur(10px)', y: 18, scale: 0.94 }` → `visible: { opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }` (`pillItem` variant), staggered via the existing `container` variant. Chosen because it matches CLAUDE.md's preferred "Reveal"/"Gentle Scale" motion language (and the stitch-worker skill's documented section-entrance standard) far better than rotation/wobble — feels like a photo resolving into focus. Respects `useReducedMotion()` (falls back to plain opacity fade)
- Multi-select via existing `selectedTastes`/`toggleTaste` from `useOnboardingStore` — no store changes needed
- Verified with `tsc --noEmit` (clean) and curl against the dev server (renders all group labels and option pills)

---

## Immediate Next Steps

1. **Style Screen 4 — Auth (`/auth`)**
   - Login/signup toggle
   - Add React Hook Form + Zod validation
   - Minimal, calm form — no aggressive CTAs

2. **Style Screen 5 — Discovery Feed (`/discover`)**
   - Trip cards with imagery
   - Mood/taste-filtered results
   - Skeleton loading states

3. **Extract shared components**
   - `CircleNavButton` — the white circle arrow button now duplicated across Welcome, Mood, and Taste pages
   - `PageQuote` — the italic grey quote duplicated across Mood and Taste pages
   - Move to `src/components/`

4. **Add Shadcn/UI** as the component primitive layer

---

## Open Issues

- Auth form uses plain React state — needs React Hook Form + Zod (Phase 2)
- Trip cards have no images — `imageUrl` is empty string in mock data
- No 404 / not-found page
- No loading, empty, or error states
- Auth page still unstyled — visual consistency break mid-flow (last remaining gap before Discover)
- `CircleNavButton` and `PageQuote` are now duplicated across three pages (Welcome/Mood/Taste) — extract to shared components before styling Auth

---

## Architecture Decisions

- **Stitch MCP as design source of truth**: All screen styling starts from Stitch import. Raw imports preserved in `/imported/` unmodified.
- **Zustand for onboarding + auth state**: Client-side UI state only. Never stores server/API data.
- **Framer Motion for all animations**: CSS keyframes kept only for continuous loops (birds, SVG stroke-dasharray). All entrance/exit animations use Framer Motion.
- **`useEffect` for random/volatile values**: Any `Math.random()` or `Date` must run in `useEffect` to avoid SSR hydration mismatches.
- **Plain `<button>` over `motion.button` for navigational actions**: Framer Motion's `disabled` + `whileTap` combo causes click event swallowing — use `motion.div` wrapper + plain `<button>` instead.
- **Explicit navigation over `router.back()`**: `router.back()` follows browser history which can be unpredictable. Always use `router.push('/explicit-path')` for onboarding back navigation.
- **First mood pre-selected on mount**: Reduces friction — user can proceed immediately without a required click.
- **Nunito as primary UI font**: Replaced Plus Jakarta Sans for all UI text. Plus Jakarta Sans retained only for the "Folkora" SVG write-on animation to preserve the Stitch design intent.
- **Design tokens in tailwind.config.ts**: Full Aether Drift palette centralized — no raw hex values in component files.

---

## Future Considerations

- CMS for onboarding options (moods, tastes) to allow non-code updates
- Progress indicator for onboarding flow (e.g. step dots, arc path)
- Mapbox integration for destination map views
- Trip detail page (`/trip/[id]`) needed before booking flow
- Store onboarding preferences to user profile post Phase 3 auth
- Suspense + skeleton states before API integration
- Consider shared `PageLayout` wrapper for consistent dark background across onboarding pages
