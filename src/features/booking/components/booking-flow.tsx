'use client';

import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, useReducedMotion } from 'framer-motion';
import type { Trip } from '@/types/trip';
import { BackpackSelector } from './backpack-selector';
import { ParticipantFields } from './participant-fields';
import { EMPTY_PARTICIPANT, type BookingFormValues, bookingSchema } from '../schemas/booking.schema';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
};

interface BookingFlowProps {
  trip: Trip;
}

/**
 * Booking form for a single trip — pick a party size with the backpack
 * selector, then fill in each traveler's details.
 *
 * Phase 1: submission is mocked (simulated delay, no persistence).
 * Phase 3: replace the submit handler with `booking.service.ts`.
 */
export function BookingFlow({ trip }: BookingFlowProps) {
  const prefersReducedMotion = useReducedMotion();
  const [travelerCount, setTravelerCount] = useState(1);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { participants: [EMPTY_PARTICIPANT] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'participants' });

  // Keep the participant fields in sync with the selected party size —
  // growing or shrinking the field array as the traveler count changes.
  useEffect(() => {
    if (travelerCount > fields.length) {
      for (let i = fields.length; i < travelerCount; i++) {
        append(EMPTY_PARTICIPANT);
      }
    } else if (travelerCount < fields.length) {
      for (let i = fields.length - 1; i >= travelerCount; i--) {
        remove(i);
      }
    }
  }, [travelerCount, fields.length, append, remove]);

  const onSubmit = async () => {
    setStatus('submitting');

    try {
      // Phase 1: simulate a network round-trip — no booking is actually created.
      await new Promise((resolve) => setTimeout(resolve, 900));
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div initial="hidden" animate="visible" variants={container} className="text-center py-12">
        <motion.h2
          variants={item}
          className="font-cursive text-on-surface dark:text-surface-container-lowest leading-none mb-3"
          style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}
        >
          You&apos;re all set.
        </motion.h2>
        <motion.p variants={item} className="text-body-md text-on-surface-variant dark:text-surface-container-high">
          We&apos;ve reserved {travelerCount} {travelerCount === 1 ? 'spot' : 'spots'} on {trip.title}. A confirmation
          will follow shortly.
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial="hidden"
      animate="visible"
      variants={container}
      className="flex flex-col gap-8"
      noValidate
    >
      <motion.div variants={item}>
        <h1
          className="font-cursive leading-none text-on-surface dark:text-surface-container-lowest mb-3"
          style={{ fontSize: 'clamp(40px, 7vw, 64px)' }}
        >
          You are almost there!
        </h1>
        <p className="text-body-md text-on-surface-variant dark:text-surface-container-high italic mb-8">
          &ldquo;The journey itself is part of the experience.&rdquo;
        </p>

        <h2 className="text-headline-md text-on-surface dark:text-surface-container-lowest mb-2">
          How many are traveling?
        </h2>
        <p className="text-body-md text-on-surface-variant dark:text-surface-container-high mb-4">
          Choose a backpack for each traveler joining {trip.destination}.
        </p>
        <BackpackSelector value={travelerCount} onChange={setTravelerCount} />
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-4">
        <h2 className="text-headline-md text-on-surface dark:text-surface-container-lowest">Traveler details</h2>
        {fields.map((field, index) => (
          <ParticipantFields key={field.id} index={index} register={register} errors={errors} />
        ))}
      </motion.div>

      {status === 'error' && (
        <motion.p variants={item} className="text-label-md text-red-600 dark:text-red-400">
          Something went wrong. Please try again.
        </motion.p>
      )}

      <motion.div
        variants={item}
        whileHover={prefersReducedMotion || status === 'submitting' ? {} : { scale: 1.02 }}
        whileTap={prefersReducedMotion || status === 'submitting' ? {} : { scale: 0.98 }}
      >
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full sm:w-auto px-8 py-3 rounded-full font-semibold text-label-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-on-surface text-surface-container-lowest focus-visible:ring-on-surface focus-visible:ring-offset-surface dark:bg-white dark:text-on-surface dark:focus-visible:ring-white dark:focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Confirming…' : 'Confirm booking'}
        </button>
      </motion.div>
    </motion.form>
  );
}
