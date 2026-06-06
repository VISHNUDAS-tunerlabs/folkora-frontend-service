/**
 * Authentication domain types.
 *
 * Phase 1 uses fake/mock authentication.
 * These types are designed to match what a real auth system will provide in Phase 3.
 */

/** Authenticated user profile. */
export interface User {
  id: string;
  name: string;
  email: string;
}

/** Credentials submitted via the login form. */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Data submitted via the signup form. */
export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}
