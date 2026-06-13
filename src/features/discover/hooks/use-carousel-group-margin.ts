'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { CAROUSEL_LAYOUT, GROUP_WIDTH } from '../constants/carousel-layout';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Left offset (px) of the carousel's hero card.
 *
 * `DiscoverCarousel` centers its hero + grid group within the viewport,
 * falling back to `CAROUSEL_LAYOUT.marginLeft` on viewports too narrow to
 * center it. This hook mirrors that calculation so page chrome (headings,
 * etc.) can align to the hero card's left edge. The carousel container spans
 * the full viewport width with no horizontal padding, so `window.innerWidth`
 * matches its measured width.
 */
export function useCarouselGroupMargin(): number {
  const [viewportWidth, setViewportWidth] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return viewportWidth > GROUP_WIDTH ? (viewportWidth - GROUP_WIDTH) / 2 : CAROUSEL_LAYOUT.marginLeft;
}
