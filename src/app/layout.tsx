/**
 * Root layout.
 *
 * Wraps all pages with shared HTML structure and global styles.
 * This is a Server Component — client-side providers are added
 * in a separate Providers component to keep the boundary explicit.
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Folkora — Curated Travel Discovery',
  description: 'Discover journeys curated for your mood, not your search query.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
