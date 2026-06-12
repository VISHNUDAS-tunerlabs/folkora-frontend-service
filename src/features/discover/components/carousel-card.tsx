'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { Trip } from '@/types/trip';
import { CAROUSEL_LAYOUT } from '../constants/carousel-layout';
import type { CardKeyframes } from '../utils/carousel-keyframes';

/** Every card links to the same shared trip-detail template, varying only by id. */
const MotionLink = motion.create(Link);

interface CarouselCardProps {
  trip: Trip;
  /** Tailwind `from-* to-*` gradient classes standing in for a destination photo. */
  gradient: string;
  keyframes: CardKeyframes;
  /** Shared horizontal scroll position (px) of the carousel container. */
  scrollX: MotionValue<number>;
  /** True for the card that starts as the hero, so its image loads eagerly. */
  isInitialHero?: boolean;
}

/**
 * A single carousel card, absolutely positioned and continuously resized
 * along the shared `scrollX` value per `keyframes` — this is what lets a
 * 2x2 grid cell smoothly grow into the next hero card as the user scrolls.
 *
 * Falls back to `gradient` when `trip.imageUrl` is empty (Phase 1 trips
 * without curated imagery yet).
 */
export function CarouselCard({ trip, gradient, keyframes, scrollX, isInitialHero }: CarouselCardProps) {
  const x = useTransform(scrollX, keyframes.scrollX, keyframes.x);
  const y = useTransform(scrollX, keyframes.scrollX, keyframes.y);
  const width = useTransform(scrollX, keyframes.scrollX, keyframes.width);
  const height = useTransform(scrollX, keyframes.scrollX, keyframes.height);
  const opacity = useTransform(scrollX, keyframes.scrollX, keyframes.opacity);
  const zIndex = useTransform(scrollX, keyframes.scrollX, keyframes.zIndex);

  // Title and tagline scale with the card's width so the hero card reads as
  // an editorial headline while grid cells stay compact.
  const titleSize = useTransform(width, [CAROUSEL_LAYOUT.cellWidth, CAROUSEL_LAYOUT.heroWidth], [16, 26]);
  const taglineOpacity = useTransform(width, [CAROUSEL_LAYOUT.cellWidth, CAROUSEL_LAYOUT.heroWidth * 0.85, CAROUSEL_LAYOUT.heroWidth], [0, 0, 1]);
  // Collapse the tagline's reserved space in grid cells — otherwise its
  // invisible text still leaves a gap between the place name and duration.
  const taglineHeight = useTransform(width, [CAROUSEL_LAYOUT.cellWidth, CAROUSEL_LAYOUT.heroWidth * 0.85, CAROUSEL_LAYOUT.heroWidth], [0, 0, 28]);

  return (
    <MotionLink
      href={`/trip/${trip.id}`}
      style={{ x, y, width, height, opacity, zIndex }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="group absolute top-0 left-0 block overflow-hidden rounded-lg shadow-xl cursor-pointer"
    >
      {trip.imageUrl ? (
        <Image
          src={trip.imageUrl}
          alt={`${trip.destination}, ${trip.country}`}
          fill
          sizes={`(min-width: 768px) ${CAROUSEL_LAYOUT.heroWidth}px, ${CAROUSEL_LAYOUT.cellWidth}px`}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          priority={isInitialHero}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-500 ease-out group-hover:scale-110`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition-colors duration-500 group-hover:from-black/60" />

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white">
        <p className="text-label-md uppercase tracking-widest opacity-80 mb-1">
          {trip.destination}, {trip.country}
        </p>
        <motion.h3 style={{ fontSize: titleSize }} className="font-bold leading-tight mb-1">
          {trip.title}
        </motion.h3>
        <motion.div style={{ height: taglineHeight, opacity: taglineOpacity }} className="overflow-hidden">
          <p className="text-body-md mb-2">{trip.tagline}</p>
        </motion.div>
        <p className="text-label-md opacity-75">{trip.duration}</p>
      </div>
    </MotionLink>
  );
}
