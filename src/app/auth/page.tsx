/**
 * Auth Page — Login / Signup
 *
 * Shown after the onboarding flow for new (unauthenticated) users.
 * Existing users bypass this screen entirely via the taste page redirect.
 *
 * Responsibilities:
 * - Toggle between login and signup views
 * - Capture credentials via form
 * - Simulate authentication (Phase 1: always succeeds with mock user)
 * - Redirect to the personalized discovery feed on success
 *
 * Phase 3: Replace mock login with real auth service call.
 *
 * Navigation: ← /onboarding/taste (back) | → /discover (on success)
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Phase 1: Mock authentication — always succeeds.
    // Phase 3: Call auth.service.ts and handle real JWT response.
    login({
      id: 'mock-user-001',
      name: name || 'Traveller',
      email: email || 'traveller@folkora.com',
    });

    router.push('/discover');
  };

  return (
    <main>
      <Link href="/onboarding/taste">← Back</Link>

      <h1>{mode === 'login' ? 'Welcome back.' : 'Join Folkora.'}</h1>
      <p>
        {mode === 'login'
          ? 'Sign in to see your curated journeys.'
          : 'Create an account to save your discoveries.'}
      </p>

      <form onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login'
          ? "Don't have an account? Sign up"
          : 'Already have an account? Sign in'}
      </button>
    </main>
  );
}
