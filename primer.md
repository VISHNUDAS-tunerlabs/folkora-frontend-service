# Folkora Frontend — Project State

## Session 6 (2026-06-08) — Bugfix addendum

User reported, immediately after Session 5's theme-system delivery: on the Welcome screen, switching theme mid-session made the "Welcome To Folkora" SVG text lose its fill — only the stroke outline remained visible.

**Root cause:** `globals.css` originally split `.svg-text-welcome`/`.svg-text-folkora` into light-default + `.dark`-override rules, each referencing a *different* keyframe name (`fill-text-light` vs `fill-text-dark`) inside the `animation` shorthand. Toggling `.dark` mid-session changed the resolved `animation-name`, which makes the browser **restart** that animation from scratch — resetting `fill` to transparent and re-arming its 8.5s delay. The static (non-animated) `stroke` property applied instantly, so only the outline remained visible for ~10s after every switch.

**Fix:** introduced a single `--svg-ink` CSS custom property (RGB triplet: `27, 28, 28` in `:root`, `255, 255, 255` in `.dark`) and consolidated `fill-text-light`/`fill-text-dark` into one shared `@keyframes fill-text { to { fill: rgb(var(--svg-ink)); } }`. `.svg-text-welcome`/`.svg-text-folkora` now express `fill`/`stroke` via `rgba(var(--svg-ink), 0)`/`rgb(var(--svg-ink))` and reference the single `fill-text` name — the `.dark`-override blocks (and the reduced-motion media query's duplicate dark overrides) were removed entirely, since `var()` re-resolves live without restarting the animation.

**Verified:** `tsc --noEmit` clean; Playwright test loaded the Welcome page, waited for the write-on/fill sequence to fully settle (~11s), then toggled the theme twice mid-session — `getComputedStyle(...).fill` read a solid color (`rgb(255,255,255)` ⇄ `rgb(27,28,28)`) immediately after each toggle, never a transparent/in-between value. Screenshot confirmed the text renders fully inked, with no hollow/stroke-only flash.

Full architecture detail and the general rule ("resolve animated target colors through a CSS custom property in a single shared keyframe — never swap `animation-name` per theme") are recorded in the `theme-system` memory file.

### Follow-up tweak — Welcome canvas sun/moon (`celestial-layer.tsx`)
User asked for a crescent moon shape (first tried a half-moon via `clip-path` — corrected to "crescent" after seeing it) and for the sun/moon to render in solid black ("ink") in light theme:
- **Crescent moon**: replaced the plain circle `<div>` with an inline `<svg>` reusing the *exact same crescent path* as `ThemeToggle`'s `MoonIcon` (`M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a9 9 0 0 0 11 11Z`) — gives the "moon" motif a consistent shape across the toggle button and the animated sky. Glow moved from `box-shadow` (doesn't apply to SVG path fills) to `drop-shadow(...)` on the `<svg>`. Shape applies in **both** themes — it's a shape preference, not a per-theme variant; only the `fill` color (`fill-on-surface dark:fill-surface-container-lowest`) and `drop-shadow` color vary with theme.
- **Black in light theme**: changed the sun (`bg-on-surface dark:bg-tertiary-fixed`, was always gold `#ffe088`) and the moon's fill (`fill-on-surface dark:fill-surface-container-lowest`, was light-grey `#eae8e7`/white) to render as `on-surface` ink-black (`#1b1c1c`) in light mode. **Why this is more than cosmetic**: in light theme the canvas's internal "night" sky (`--sky-night: #f6efe9 → #efeded`) is only a *subtly warmer pale* gradient — not actually dark — so the old light-grey/white moon nearly disappeared against it, and the gold sun had weak contrast against the pale daytime sky too. Solid ink-black silhouettes read clearly against both, and tie visually to the `--svg-ink` write-on text color. Dark theme is untouched (still gold sun / white crescent glow against the near-black sky).
- Verified visually with Playwright screenshots across all 4 combinations (light/dark theme × day/night phase) — `tsc --noEmit` clean.

---

## Current Project State

### What Exists
- Full Next.js 15 (App Router) project with TypeScript, Tailwind CSS
- **Screen 1 (Welcome `/`)** — fully styled animated sky splash screen, now theme-aware (day ⇄ night celestial drift plays in both light and dark modes)
- **Screen 2 (Mood `/onboarding/mood`)** — fully styled, theme-aware horizontal icon cards
- **Screen 3 (Taste `/onboarding/taste`)** — fully styled, theme-aware pill-chip multi-select with blur-reveal entrance
- **Light/dark theme system** — global, persisted, toggle with sun/moon icons (see Session 5 below)
- **Screen 4 (Auth `/auth`)** — fully styled, theme-aware (sign-in/create-account toggle, animated name field, loading state)
- Discovery Feed (`/discover`) — plain, unstyled, not yet theme-aware
- Shared components in `src/components/`: `CircleNavButton`, `PageQuote`, `ThemeToggle`
- Zustand stores: onboarding, auth, **theme** (`useThemeStore`)
- Mock trip data with personalization filtering logic
- Full Aether Drift design token system wired into Tailwind config (`darkMode: 'class'` now enabled)
- Raw Stitch import preserved at `/imported/folkora-onboarding-immersive-story/index.html`
- All session work through `676f96b` committed and pushed to `origin/master`; this session's theme work is uncommitted

### What is Functional
- Full onboarding flow navigation: Welcome → Mood → Taste → Auth → Discover
- Mood selection (single select, first card selected by default, persists in Zustand)
- Taste selection (multi-select via pill chips, persists in Zustand)
- Fake auth (always succeeds, stores mock user)
- Discovery feed filters mock trips by mood + taste preferences
- **Light/dark theme**: toggle on Welcome, Mood, and Taste screens; persists across reloads and navigation; no flash-of-wrong-theme on load; respects `prefers-reduced-motion` for the icon swap

### What is Incomplete
- Screens 4–5 (Auth, Discover) — unstyled plain HTML, and will need the same `dark:` treatment once styled
- No real authentication (Phase 3)
- No API integration (Phase 3)
- No Mapbox integration
- TanStack Query installed but not yet used
- React Hook Form + Zod installed but not yet used
- No loading, empty, or error states

---

## Session Summary (Session 5 — 2026-06-08)

### Goal
Add a light mode alongside the existing dark "Aether Drift" look, with a sun/moon toggle to switch between them — without redesigning or duplicating the styled screens.

### Theme Infrastructure (new)
- **`src/store/theme-store.ts`** — `useThemeStore` (Zustand): `theme: 'light' | 'dark'`, `setTheme`, `toggleTheme`, `syncFromDocument`. Applies the `light`/`dark` class + `color-scheme` to `<html>` and persists to `localStorage` (`folkora-theme`) on every change.
- **`tailwind.config.ts`** — added `darkMode: 'class'`, so `dark:` variants key off the `<html>` class rather than the OS preference.
- **`src/app/layout.tsx`** — added an inline head `<script>` (via `dangerouslySetInnerHTML`, with `suppressHydrationWarning` on `<html>`) that reads `localStorage` and applies the theme class **before first paint**. This is what prevents a flash of the wrong theme — styling is entirely CSS-driven (`dark:` classes / `.dark` selectors / CSS custom properties), so it's correct on the very first frame regardless of when the Zustand store hydrates.
- **`src/components/theme-toggle.tsx`** — `ThemeToggle`: circular button styled like the nav buttons, shows a hand-drawn sun (light mode) or crescent moon (dark mode) — echoing the Welcome screen's celestial motif rather than a generic switch icon. Cross-fades + gently rotates/scales between icons via Framer Motion (`AnimatePresence`), collapses to a plain opacity swap under `prefers-reduced-motion`. Calls `syncFromDocument()` on mount to reconcile the store's default with whatever the inline script already applied.

### Shared Component Extraction (overdue from Session 4 — now done)
- **`src/components/circle-nav-button.tsx`** — `CircleNavButton`: back/next chevron circle, parameterized by `direction`, theme-aware colors (inverted between modes for contrast), visual-only `disabled` styling (no `disabled` attribute, per the Framer Motion click-swallowing pattern).
- **`src/components/page-quote.tsx`** — `PageQuote`: italic muted travel quote, declares the shared `item` fade/drift variant and inherits stagger orchestration from the page's container.
- Both now used on Mood and Taste; Auth should reuse them when styled (no more duplication).

### Re-theming approach
Rather than rewriting the dark look, the **existing styled screens stayed the dark mode** and a parallel light palette was added via Tailwind `dark:` variants (light = default/no-prefix, dark = `dark:`-prefixed):
- Backgrounds: new `.bg-onboarding-sky` utility class in `globals.css` — warm "glossy paper" gradient (`#fbf9f8 → #efeded`) by default, the original near-black Aether Drift gradient under `.dark`. Replaces the old inline `style={{ background: ... }}`.
- Text: `on-surface`/`on-surface-variant` (dark ink) by default, `surface-container-lowest`/`surface-container-high` (white/light) under `dark:` — using tokens already defined in `tailwind.config.ts`.
- Selected/accent surfaces (mood cards, taste pills, CTA button): **inverted** between modes — dark chip + white text in light mode, white chip + dark text in dark mode — so the "selected" state always reads as the highest-contrast element on the page in both themes.
- `text-gray-500` quote color was left unchanged — its contrast against both the warm-light and near-black gradients is close enough (~4.5:1) that no variant was needed.

### Welcome canvas — special handling
The Welcome screen has its own internal `isNight` celestial drift (toggles every 8s, independent of the user's theme preference — it's a decorative day/night cycle, not the light/dark switch). To keep this CSS-driven (FOUC-free) while still being theme-aware:
- Replaced the `SKY_DAY`/`SKY_NIGHT` JS string constants with CSS custom properties `--sky-day`/`--sky-night`, defined once in `:root` (warm daylight pair) and redefined in `.dark` (the original near-black pair). The component just does `background: isNight ? 'var(--sky-night)' : 'var(--sky-day)'` — the `.dark` class (already applied pre-paint) decides which literal gradient that resolves to.
- `celestial-layer.tsx` — radial glow tint and moon color/glow now have light-mode variants (`dark:` Tailwind variants) so they read softly against a bright sky instead of vanishing.
- `globals.css` — `.svg-text-welcome`/`.svg-text-folkora`/`.bird-svg` (and the `fill-text` keyframe) split into light-default + `.dark`-override rules — the write-on typography and birds now render in dark ink on light backgrounds, white on dark.
- `onboarding-cta.tsx` — button colors inverted between themes (same "selected = highest contrast" rule); hover glow color is read from `useThemeStore` directly (safe — runs only on interaction, well after the store has synced, and Framer Motion's `whileHover` boxShadow needs a concrete value to interpolate, not a CSS variable reference).

### Verification
- `tsc --noEmit` — clean
- Playwright screenshot pass across Welcome/Mood/Taste in both themes (light + dark), confirmed: visuals match intent, toggle switches instantly, theme persists in `localStorage` and across reload with no flash, and persists across in-app navigation (Mood → Taste).

---

## Immediate Next Steps

1. **Style Screen 5 — Discovery Feed (`/discover`)**
   - Trip cards with imagery
   - Mood/taste-filtered results
   - Skeleton loading states
   - Theme-aware from the start

3. **Add Shadcn/UI** as the component primitive layer — consider wiring its theming to the same `.dark` class strategy already in place

4. **Commit this session's theme work** — currently uncommitted (`primer.md`/`project-memory.md` plus all theme infra/component/page changes)

---

## Open Issues

- ~~Welcome SVG fill disappearing on mid-session theme switch~~ — **fixed in Session 6** (see addendum at top): `fill-text-light`/`fill-text-dark` keyframe pair replaced with a single `fill-text` keyframe driven by `--svg-ink`, eliminating the `animation-name` change that caused the browser to restart (and visually reset) the fill animation.
- Auth form uses plain React state — needs React Hook Form + Zod (Phase 2)
- Trip cards have no images — `imageUrl` is empty string in mock data
- No 404 / not-found page
- No loading, empty, or error states
- Discover page is unstyled AND not theme-aware — will need both the visual pass and `dark:` treatment
- `project-memory.md` may again pick up a trailing hook-generated entry after this session's commit(s) — see the Git Hook Note carried from Session 4 (self-referential post-commit logging; one trailing uncommitted entry is normal)

---

## Architecture Decisions

- **Theme = Zustand store + Tailwind `class` strategy + inline pre-paint script (this session)**: The store (`useThemeStore`) owns `theme` and DOM/localStorage sync; `darkMode: 'class'` in `tailwind.config.ts` makes `dark:` variants key off the `<html>` class; an inline `<script>` in `layout.tsx`'s `<head>` applies that class from `localStorage` *before* React hydrates. **Why this order matters**: styling driven purely by the DOM class (CSS) is correct on the very first paint, before any JS state exists — avoiding the flash that a React-state-driven theme would cause. The store exists only so components can *read* the current theme (e.g., to pick the right icon) and to let users *change* it; it never gates the visual styling itself.
- **Light mode = default (no prefix), dark mode = `dark:` variant**: Matches Tailwind convention. The previously dark-only screens kept their exact look — their classes simply moved under `dark:`, with new light-mode classes added as the unprefixed base.
- **Selected/accent state inverts between themes**: white-on-dark in dark mode, dark-on-white in light mode — keeps the "selected" element the highest-contrast thing on screen in both themes, a single semantic rule rather than per-component tuning.
- **CSS custom properties for anything that must be FOUC-free but isn't a simple Tailwind utility swap**: The Welcome canvas's day/night sky gradient is *computed in JS* (from `isNight`) but must also vary by theme — solved by defining `--sky-day`/`--sky-night` once per theme in CSS (`:root` / `.dark`) and letting the component reference `var(--sky-day)`/`var(--sky-night)`, so the resolved value is correct from the first frame without the component needing to know the theme at all.
- **Read theme from the store only for interaction-time values** (e.g., `OnboardingCTA`'s hover glow color): safe because it only runs after user interaction, well past the point where `syncFromDocument` has reconciled the store — and because Framer Motion needs a concrete animatable value (a CSS variable string can't be interpolated for `boxShadow`).
- **Stitch MCP as design source of truth**: All screen styling starts from Stitch import. Raw imports preserved in `/imported/` unmodified.
- **Zustand for onboarding + auth + theme state**: Client-side UI state only. Never stores server/API data.
- **Framer Motion for all animations**: CSS keyframes kept only for continuous loops (birds, SVG stroke-dasharray, theme-aware fill-text). All entrance/exit/icon-swap animations use Framer Motion.
- **`useEffect` for random/volatile values**: Any `Math.random()` or `Date` must run in `useEffect` to avoid SSR hydration mismatches.
- **Plain `<button>` over `motion.button` for navigational actions**: Framer Motion's `disabled` + `whileTap` combo causes click event swallowing — use `motion.div` wrapper + plain `<button>` instead (now encoded directly in `CircleNavButton`'s doc comment).
- **Explicit navigation over `router.back()`**: Always use `router.push('/explicit-path')` for onboarding back navigation.
- **First mood pre-selected on mount**: Reduces friction — user can proceed immediately without a required click.
- **Nunito as primary UI font**: Plus Jakarta Sans retained only for the "Folkora" SVG write-on animation.
- **Design tokens in tailwind.config.ts**: Full Aether Drift palette centralized — no raw hex values in component files (CSS custom properties for the Welcome sky gradients are the one deliberate exception, scoped to `globals.css` and documented there).
- **Pill/chip multi-select pattern (Taste page)**: rendered as ONE flat wrapped row, never grouped under category headings.
- **Blur-reveal over rotation/bounce for "lively" entrance requests**: default to blur-to-focus + gentle scale + drift-up.

---

## Future Considerations

- CMS for onboarding options (moods, tastes) to allow non-code updates
- Progress indicator for onboarding flow (e.g. step dots, arc path)
- Mapbox integration for destination map views
- Trip detail page (`/trip/[id]`) needed before booking flow
- Store onboarding preferences to user profile post Phase 3 auth
- Suspense + skeleton states before API integration
- Consider whether `TASTE_GROUPS`' grouped data shape is still worth keeping now that the UI flattens it
- **Theme**: consider seeding the *very first* visit (no stored preference) from `prefers-color-scheme` instead of always defaulting to dark — currently the inline script defaults to `'dark'` for anyone without a saved choice, which matches "the theme the screens were designed in" but may not match what a light-mode-OS visitor expects on first load
- **Theme**: once Shadcn/UI is added, consider migrating its theme tokens onto the same `.dark` class / CSS-variable approach rather than running two theming systems in parallel
