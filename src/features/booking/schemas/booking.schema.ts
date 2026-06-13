import { z } from 'zod';
import { MAX_TRAVELERS } from '../constants/booking';

/** One traveler's details, collected per seat selected on the booking page. */
export const participantSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter a full name.'),
  age: z.string().trim().refine((val) => {
    const age = Number(val);
    return Number.isInteger(age) && age > 0 && age < 120;
  }, 'Enter a valid age.'),
  gender: z.string().trim().min(1, 'Select a gender.'),
  contactNumber: z.string().trim().min(7, 'Enter a valid contact number.'),
});

export const bookingSchema = z.object({
  participants: z.array(participantSchema).min(1, 'Select at least one traveler.').max(MAX_TRAVELERS),
});

export type ParticipantValues = z.infer<typeof participantSchema>;
export type BookingFormValues = z.infer<typeof bookingSchema>;

/** A blank participant record — used to grow the form when another traveler is selected. */
export const EMPTY_PARTICIPANT: ParticipantValues = {
  fullName: '',
  age: '',
  gender: '',
  contactNumber: '',
};
