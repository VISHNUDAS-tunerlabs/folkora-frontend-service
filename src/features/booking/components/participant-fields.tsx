'use client';

import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { BookingFormValues } from '../schemas/booking.schema';

/**
 * Minimal editorial input — transparent background so inputs read as
 * "carved out" of the page rather than inserted boxes. Matches the auth page.
 */
const INPUT_CLASS =
  'w-full px-4 py-3 rounded-lg border text-body-md bg-transparent outline-none ' +
  'transition-colors duration-200 ' +
  'text-on-surface border-outline-variant ' +
  'placeholder:text-outline ' +
  'focus:border-on-surface ' +
  'dark:text-surface-container-lowest dark:border-surface-container ' +
  'dark:placeholder:text-surface-container-high dark:focus:border-surface-container-lowest';

const LABEL_CLASS = 'block text-label-md text-on-surface-variant dark:text-surface-container-high mb-1.5';

const ERROR_CLASS = 'mt-1.5 text-label-md text-red-600 dark:text-red-400';

interface ParticipantFieldsProps {
  index: number;
  register: UseFormRegister<BookingFormValues>;
  errors: FieldErrors<BookingFormValues>;
}

/** Name, email, and phone fields for a single traveler in the booking form. */
export function ParticipantFields({ index, register, errors }: ParticipantFieldsProps) {
  const participantErrors = errors.participants?.[index];

  return (
    <fieldset className="rounded-lg border border-outline-variant p-4 sm:p-5 dark:border-surface-container">
      <legend className="px-1 text-label-md font-semibold text-on-surface dark:text-surface-container-lowest">
        Traveler {index + 1}
      </legend>

      <div className="mt-2 flex flex-col gap-4">
        <div>
          <label htmlFor={`participants.${index}.fullName`} className={LABEL_CLASS}>
            Full name
          </label>
          <input
            id={`participants.${index}.fullName`}
            type="text"
            placeholder="Full name"
            autoComplete="name"
            className={INPUT_CLASS}
            {...register(`participants.${index}.fullName`)}
          />
          {participantErrors?.fullName && (
            <p className={ERROR_CLASS}>{participantErrors.fullName.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor={`participants.${index}.age`} className={LABEL_CLASS}>
              Age
            </label>
            <input
              id={`participants.${index}.age`}
              type="number"
              placeholder="Age"
              inputMode="numeric"
              className={INPUT_CLASS}
              {...register(`participants.${index}.age`)}
            />
            {participantErrors?.age && <p className={ERROR_CLASS}>{participantErrors.age.message}</p>}
          </div>

          <div>
            <label htmlFor={`participants.${index}.gender`} className={LABEL_CLASS}>
              Gender
            </label>
            <select
              id={`participants.${index}.gender`}
              className={INPUT_CLASS}
              defaultValue=""
              {...register(`participants.${index}.gender`)}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
            {participantErrors?.gender && <p className={ERROR_CLASS}>{participantErrors.gender.message}</p>}
          </div>

          <div>
            <label htmlFor={`participants.${index}.contactNumber`} className={LABEL_CLASS}>
              Contact number
            </label>
            <input
              id={`participants.${index}.contactNumber`}
              type="tel"
              placeholder="Contact number"
              autoComplete="tel"
              className={INPUT_CLASS}
              {...register(`participants.${index}.contactNumber`)}
            />
            {participantErrors?.contactNumber && (
              <p className={ERROR_CLASS}>{participantErrors.contactNumber.message}</p>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
}
