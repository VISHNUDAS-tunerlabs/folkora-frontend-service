/**
 * Auth Page — Sign In / Create Account
 *
 * The final screen in the onboarding flow before the discovery feed.
 * Authenticated users skip this screen via the Taste page redirect.
 *
 * Responsibilities:
 * - Toggle between "sign in" and "create account" modes
 * - Slide the Name field in/out on mode switch (AnimatePresence)
 * - Simulate a brief loading state before mocking a successful response
 * - Redirect to the personalized discovery feed on success
 *
 * Phase 1: Mock authentication — always succeeds, no real credentials checked.
 * Phase 3: Replace `login()` call with `auth.service.ts` and handle JWT/error states.
 *
 * Navigation: ← /onboarding/taste | → /discover (on success)
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import { CircleNavButton } from '@/components/circle-nav-button';
import { PageQuote } from '@/components/page-quote';
import { ThemeToggle } from '@/components/theme-toggle';

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthMode = 'login' | 'signup';

// ─── Animation variants ───────────────────────────────────────────────────────

/** Stagger container — same orchestration pattern as Mood and Taste pages. */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/** Shared item: fade + gentle drift up. */
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
};

// ─── Shared style strings ─────────────────────────────────────────────────────

/**
 * Minimal editorial input — transparent background so inputs read as
 * "carved out" of the page rather than inserted boxes. Border color shifts
 * to full ink on focus for clear feedback without a focus ring.
 */
const INPUT_CLASS =
  'w-full px-4 py-3 rounded-lg border text-body-md bg-transparent outline-none ' +
  'transition-colors duration-200 ' +
  'text-on-surface border-outline-variant ' +
  'placeholder:text-outline ' +
  'focus:border-on-surface ' +
  'dark:text-surface-container-lowest dark:border-surface-container ' +
  'dark:placeholder:text-surface-container-high dark:focus:border-surface-container-lowest';

const LABEL_CLASS =
  'block text-label-md text-on-surface-variant dark:text-surface-container-high mb-1.5';

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const prefersReducedMotion = useReducedMotion();

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Phase 1: Simulate a brief network round-trip before mocking success.
    // Phase 3: Replace with real auth service call (src/services/auth.service.ts)
    // and handle error states (wrong credentials, network failure, etc.).
    await new Promise((resolve) => setTimeout(resolve, 800));

    login({
      id: 'mock-user-001',
      name: name || 'Traveller',
      email: email || 'traveller@folkora.com',
    });

    router.push('/discover');
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    // Clear all fields when switching modes — prevents stale values from
    // "login" prefilling "signup" fields (password hints also differ per mode).
    setName('');
    setEmail('');
    setPassword('');
  };

  const fieldTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <main className="bg-onboarding-sky relative min-h-screen flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-16">
      <CircleNavButton
        direction="back"
        label="Go back"
        onClick={() => router.push('/onboarding/taste')}
      />
      <ThemeToggle className="absolute bottom-8 left-8" />

      <motion.div
        className="max-w-sm w-full flex flex-col items-center text-center"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        {/* Eyebrow */}
        <motion.p
          variants={item}
          className="text-label-md text-on-surface-variant dark:text-surface-container-high tracking-widest mb-4"
        >
          Your Folkora Account
        </motion.p>

        {/* Heading — reacts to mode but does not re-animate on switch (same item key) */}
        <motion.h1
          variants={item}
          className="text-headline-lg text-on-surface dark:text-surface-container-lowest font-bold mb-2"
        >
          {mode === 'login' ? 'Welcome back.' : 'Join Folkora.'}
        </motion.h1>

        <motion.p
          variants={item}
          className="text-body-md text-on-surface-variant dark:text-surface-container-high mb-8"
        >
          {mode === 'login'
            ? 'Sign in to see your curated journeys.'
            : 'Create an account to save your discoveries.'}
        </motion.p>

        {/* Form — enters as a single stagger item; fields within are not individually staggered. */}
        <motion.form
          variants={item}
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 text-left"
          noValidate
        >
          {/* Name field — only shown in signup mode. Slides in/out with AnimatePresence. */}
          <AnimatePresence initial={false}>
            {mode === 'signup' && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={fieldTransition}
                className="overflow-hidden"
              >
                <div className="pb-0.5">
                  <label htmlFor="name" className={LABEL_CLASS}>
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    className={INPUT_CLASS}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label htmlFor="email" className={LABEL_CLASS}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            {/* Password row: label on the left, "Forgot password?" on the right (login only). */}
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="text-label-md text-on-surface-variant dark:text-surface-container-high"
              >
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  className="text-sm text-on-surface-variant hover:text-on-surface dark:text-surface-container-high dark:hover:text-surface-container-lowest transition-colors duration-200"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className={INPUT_CLASS}
            />
          </div>

          {/*
           * Submit — motion.div wrapper + plain <button> rather than motion.button.
           * Framer Motion's whileTap + disabled combo can swallow click events
           * (see "Buttons with Framer Motion" architecture pattern).
           */}
          <motion.div
            className="mt-2"
            whileHover={prefersReducedMotion || isLoading ? {} : { scale: 1.02 }}
            whileTap={prefersReducedMotion || isLoading ? {} : { scale: 0.98 }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full font-semibold text-label-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-on-surface text-surface-container-lowest focus-visible:ring-on-surface focus-visible:ring-offset-surface dark:bg-surface-container-lowest dark:text-on-surface dark:focus-visible:ring-white dark:focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? mode === 'login'
                  ? 'Signing in…'
                  : 'Creating account…'
                : mode === 'login'
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </motion.div>
        </motion.form>

        {/* Mode switch link */}
        <motion.button
          variants={item}
          type="button"
          onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
          className="mt-6 text-sm text-on-surface-variant dark:text-surface-container-high transition-colors duration-200 focus-visible:outline-none focus-visible:underline"
        >
          {mode === 'login' ? (
            <>
              New to Folkora?{' '}
              <span className="font-semibold text-on-surface dark:text-surface-container-lowest underline-offset-2 hover:underline">
                Create an account
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span className="font-semibold text-on-surface dark:text-surface-container-lowest underline-offset-2 hover:underline">
                Sign in
              </span>
            </>
          )}
        </motion.button>

        <PageQuote className="max-w-xs mt-8">
          &ldquo;Wherever you go becomes a part of you somehow.&rdquo;
        </PageQuote>
      </motion.div>
    </main>
  );
}
