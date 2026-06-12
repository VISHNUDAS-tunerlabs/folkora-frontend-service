'use client';

import { useEffect, useRef } from 'react';
import { animate, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import type { Trip } from '@/types/trip';
import { CAROUSEL_LAYOUT, SET_WIDTH } from '../constants/carousel-layout';
import { getPlaceholderGradient } from '../constants/placeholder-gradients';
import { getCardKeyframes, getCarouselScrollRange } from '../utils/carousel-keyframes';
import { CarouselCard } from './carousel-card';

/** How long the carousel waits after the last scroll input before snapping. */
const SNAP_IDLE_MS = 120;
const SNAP_DURATION_S = 0.4;

/**
 * Trackpad swipes fire a burst of wheel events, including an inertial
 * "momentum" tail that keeps firing after the user lifts their fingers. A
 * gap longer than this between wheel events marks the end of that gesture.
 */
const WHEEL_GESTURE_GAP_MS = 180;

interface DiscoverCarouselProps {
  trips: Trip[];
}

/**
 * Horizontally scrolling carousel of curated journeys.
 *
 * Rather than scrolling discrete "pages", every card is absolutely
 * positioned and continuously re-laid-out from the container's scroll
 * position: the hero card slides out to the left while the grid's top-left
 * card grows to take its place, the rest of the grid advances one slot, and
 * a new card slides in bottom-right — a single continuous cycle.
 *
 * See `utils/carousel-keyframes` for the per-card position/size math.
 */
export function DiscoverCarousel({ trips }: DiscoverCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollX } = useScroll({ container: containerRef });
  const prefersReducedMotion = useReducedMotion();

  // Smooth out the raw scroll position so card transforms ease toward each
  // frame rather than jumping with every scroll event — makes the
  // continuous hero/grid transition feel fluid instead of mechanical.
  const smoothScrollX = useSpring(scrollX, { stiffness: 300, damping: 32, mass: 0.6 });

  const scrollRange = getCarouselScrollRange(trips.length);

  // Tracks whether a snap/step animation is currently driving scrollLeft, so
  // the two effects below don't fight each other or re-trigger off of their
  // own programmatic scroll updates.
  const isAnimatingRef = useRef(false);

  // If a swipe/wheel gesture is detected while the previous step is still
  // animating, its direction is queued here and run as soon as that
  // animation completes — so a quick gesture is never silently dropped.
  const pendingStepRef = useRef<1 | -1 | null>(null);

  const animateTo = (el: HTMLDivElement, target: number) => {
    isAnimatingRef.current = true;
    return animate(el.scrollLeft, target, {
      duration: prefersReducedMotion ? 0 : SNAP_DURATION_S,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (value) => {
        el.scrollLeft = value;
      },
      onComplete: () => {
        isAnimatingRef.current = false;

        const pending = pendingStepRef.current;
        if (pending !== null) {
          pendingStepRef.current = null;
          stepCarousel(el, pending);
        }
      },
    });
  };

  // Advance exactly one card-transition step (SET_WIDTH) in `direction`
  // (1 = forward, -1 = backward), regardless of how strong the input was.
  // If another step is already animating, queue this one rather than
  // dropping it.
  const stepCarousel = (el: HTMLDivElement, direction: 1 | -1) => {
    if (isAnimatingRef.current) {
      pendingStepRef.current = direction;
      return undefined;
    }

    const currentStep = Math.round(el.scrollLeft / SET_WIDTH);
    const target = Math.min(Math.max((currentStep + direction) * SET_WIDTH, 0), scrollRange);

    if (target === el.scrollLeft) return undefined;

    return animateTo(el, target);
  };

  // A wheel/trackpad scroll doesn't move an overflow-x-only container by
  // default in most browsers, and free-scrolling would let cards rest
  // mid-transition. Instead, each wheel "swipe" advances the carousel by
  // exactly one card-transition step in the scroll direction — including
  // its inertial momentum tail, which is locked out until the gesture ends
  // (a gap with no wheel events) so a big swipe can't trigger several steps.
  //
  // Trackpads report two-finger swipes as either deltaY or deltaX depending
  // on the browser and the element's scroll axis, so whichever axis carries
  // the larger delta is treated as the swipe direction.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let controls: ReturnType<typeof animate> | undefined;
    let gestureTimer: ReturnType<typeof setTimeout>;
    let gestureActive = false;

    const handleWheel = (event: WheelEvent) => {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (delta === 0) return;
      event.preventDefault();

      clearTimeout(gestureTimer);
      gestureTimer = setTimeout(() => {
        gestureActive = false;
      }, WHEEL_GESTURE_GAP_MS);

      if (gestureActive) return;
      gestureActive = true;

      controls = stepCarousel(el, delta > 0 ? 1 : -1);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      clearTimeout(gestureTimer);
      controls?.stop();
    };
  }, [scrollRange, prefersReducedMotion]);

  // Touch swipes are handled the same way: a single swipe — no matter how
  // long or fast — advances exactly one step. Native touch scrolling is
  // suppressed (touch-action: none + preventDefault) so a deep drag can't
  // carry the carousel through multiple transitions.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const SWIPE_THRESHOLD_PX = 30;
    let startX = 0;
    let tracking = false;
    let controls: ReturnType<typeof animate> | undefined;

    const handleTouchStart = (event: TouchEvent) => {
      tracking = true;
      startX = event.touches[0].clientX;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!tracking) return;
      event.preventDefault();
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!tracking) return;
      tracking = false;

      const deltaX = startX - event.changedTouches[0].clientX;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;

      controls = stepCarousel(el, deltaX > 0 ? 1 : -1);
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      controls?.stop();
    };
  }, [scrollRange, prefersReducedMotion]);

  // Keyboard and scrollbar-drag input can still move scrollLeft
  // continuously. Cards are only "settled" at multiples of SET_WIDTH, so
  // once scrolling goes idle, animate the rest of the way to the nearest
  // settled state.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let idleTimer: ReturnType<typeof setTimeout>;
    let controls: ReturnType<typeof animate> | undefined;

    const handleScroll = () => {
      if (isAnimatingRef.current) return;

      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        const target = Math.min(
          Math.max(Math.round(el.scrollLeft / SET_WIDTH) * SET_WIDTH, 0),
          scrollRange
        );

        if (Math.abs(target - el.scrollLeft) < 1) return;

        controls = animateTo(el, target);
      }, SNAP_IDLE_MS);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', handleScroll);
      clearTimeout(idleTimer);
      controls?.stop();
    };
  }, [scrollRange, prefersReducedMotion]);

  return (
    <div className="relative" style={{ height: CAROUSEL_LAYOUT.heroHeight }}>
      <div
        ref={containerRef}
        role="region"
        aria-label="Curated journeys"
        tabIndex={0}
        className="no-scrollbar relative h-full touch-none overflow-x-auto overflow-y-hidden focus-visible:outline-none"
      >
        {/* Establishes the scrollable width — its own content is invisible. */}
        <div style={{ width: `calc(100% + ${scrollRange}px)`, height: 1 }} aria-hidden="true" />

        {trips.map((trip, index) => (
          <CarouselCard
            key={trip.id}
            trip={trip}
            gradient={getPlaceholderGradient(index)}
            keyframes={getCardKeyframes(index)}
            scrollX={smoothScrollX}
            isInitialHero={index === 0}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          const el = containerRef.current;
          if (el) stepCarousel(el, 1);
        }}
        aria-label="Next journey"
        className="absolute right-16 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-on-surface text-surface-container-lowest transition-all duration-200 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,0,0,0.18)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:bg-white dark:text-on-surface dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] dark:focus-visible:ring-white dark:focus-visible:ring-offset-black"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
