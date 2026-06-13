/**
 * Fixed pixel layout for the Discover carousel.
 *
 * The carousel positions cards with absolute `x`/`y`/`width`/`height` motion
 * values driven by scroll, so its slot geometry must be known numerically
 * (unlike the rest of the app, which sizes with Tailwind/CSS). Tuned so the
 * 2x2 grid block (`cellWidth * 2 + cellGap`) exactly equals `heroWidth` —
 * that symmetry is what lets a grid cell scale cleanly into the hero slot.
 */
export const CAROUSEL_LAYOUT = {
  heroWidth: 448,
  heroHeight: 560,
  cellWidth: 220,
  cellHeight: 276,
  /** Gap between the hero card and the 2x2 grid block. */
  cardGap: 16,
  /** Gap between cells within the 2x2 grid block. */
  cellGap: 8,
  /** Left offset of the first hero card — the page's editorial margin. */
  marginLeft: 64,
} as const;

/**
 * Horizontal scroll distance for one full "step" of the carousel — the hero
 * card exits left, each grid card advances one slot, and a new card enters
 * bottom-right.
 */
export const SET_WIDTH =
  CAROUSEL_LAYOUT.heroWidth +
  CAROUSEL_LAYOUT.cardGap +
  (CAROUSEL_LAYOUT.cellWidth * 2 + CAROUSEL_LAYOUT.cellGap) +
  CAROUSEL_LAYOUT.cardGap;

/** Combined width of the hero card + the 2x2 grid block, used to center the group in the viewport. */
export const GROUP_WIDTH =
  CAROUSEL_LAYOUT.heroWidth +
  CAROUSEL_LAYOUT.cardGap +
  (CAROUSEL_LAYOUT.cellWidth * 2 + CAROUSEL_LAYOUT.cellGap);
