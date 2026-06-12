import { CAROUSEL_LAYOUT, SET_WIDTH } from '../constants/carousel-layout';

const { heroWidth, heroHeight, cellWidth, cellHeight, cardGap, cellGap, marginLeft } = CAROUSEL_LAYOUT;

const GRID_X = heroWidth + cardGap;

/** Slot geometry, relative to the origin of the "window" (set of 5 cards) that contains it. */
const SLOTS = {
  hero: { x: 0, y: 0, width: heroWidth, height: heroHeight },
  topLeft: { x: GRID_X, y: 0, width: cellWidth, height: cellHeight },
  topRight: { x: GRID_X + cellWidth + cellGap, y: 0, width: cellWidth, height: cellHeight },
  bottomLeft: { x: GRID_X, y: cellHeight + cellGap, width: cellWidth, height: cellHeight },
  bottomRight: { x: GRID_X + cellWidth + cellGap, y: cellHeight + cellGap, width: cellWidth, height: cellHeight },
};

export interface CardKeyframes {
  /** Scroll-x breakpoints (px), monotonically increasing — input range for `useTransform`. */
  scrollX: number[];
  x: number[];
  y: number[];
  width: number[];
  height: number[];
  opacity: number[];
  /** Stacking order — the card growing toward the hero slot renders above the rest. */
  zIndex: number[];
}

/**
 * Scroll-driven keyframes for card `index` in a sliding-window carousel
 * (window size 5: one hero + a 2x2 grid).
 *
 * Each card lives through 6 phases, one per `SET_WIDTH` of horizontal
 * scroll: entering off the right edge -> grid bottom-right -> bottom-left
 * -> top-right -> top-left -> hero -> exiting off the left edge. Card
 * `index` becomes the hero exactly `index * SET_WIDTH` px into the scroll,
 * and the grid's top-left card always becomes the next hero — that's what
 * makes the cycle read as continuous rather than five separate "pages".
 */
export function getCardKeyframes(index: number): CardKeyframes {
  const phases = [
    { window: index - 5, slot: SLOTS.bottomRight, extraX: SET_WIDTH }, // entering, off-screen right
    { window: index - 4, slot: SLOTS.bottomRight, extraX: 0 },
    { window: index - 3, slot: SLOTS.bottomLeft, extraX: 0 },
    { window: index - 2, slot: SLOTS.topRight, extraX: 0 },
    { window: index - 1, slot: SLOTS.topLeft, extraX: 0 },
    { window: index, slot: SLOTS.hero, extraX: 0 }, // hero
    { window: index, slot: SLOTS.hero, extraX: -(heroWidth + cardGap) }, // exiting, off-screen left
  ];

  const keyframes: CardKeyframes = { scrollX: [], x: [], y: [], width: [], height: [], opacity: [], zIndex: [] };

  phases.forEach(({ window, slot, extraX }, i) => {
    keyframes.scrollX.push((index - 5 + i) * SET_WIDTH);
    keyframes.x.push(marginLeft + window * SET_WIDTH + slot.x + extraX);
    keyframes.y.push(slot.y);
    keyframes.width.push(slot.width);
    keyframes.height.push(slot.height);
    keyframes.opacity.push(i === 0 || i === 6 ? 0 : 1);
    keyframes.zIndex.push(i);
  });

  return keyframes;
}

/** Total horizontal scroll distance (px) for `cardCount` cards in the carousel. */
export function getCarouselScrollRange(cardCount: number): number {
  return Math.max(cardCount - 5, 0) * SET_WIDTH;
}
