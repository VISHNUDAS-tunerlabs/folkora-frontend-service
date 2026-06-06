/**
 * Authentication state store.
 *
 * Manages the authenticated user session across the application.
 *
 * Phase 1 uses fake/mock authentication — login always succeeds and
 * stores a hardcoded user object. No tokens or cookies are involved.
 *
 * In Phase 3, this store will be wired to the real auth API. The
 * login action will call the auth service, receive a JWT, and
 * persist it securely. This store only holds the in-memory session
 * state; token storage will be handled server-side via httpOnly cookies.
 *
 * Zustand is appropriate here because auth state is global client UI
 * state that many components need to read (e.g. nav, protected routes).
 */

import { create } from 'zustand';
import type { User } from '@/types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;

  /**
   * Authenticate the user.
   * Phase 1: accepts any credentials, always succeeds with a mock user.
   * Phase 3: will call the auth service and validate credentials.
   */
  login: (user: User) => void;

  /** Clear the authenticated session. */
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: (user) => set({ isAuthenticated: true, user }),

  logout: () => set({ isAuthenticated: false, user: null }),
}));
