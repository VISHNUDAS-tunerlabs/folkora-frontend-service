/**
 * Root layout.
 *
 * Wraps all pages with shared HTML structure and global styles.
 * Fonts loaded via next/font for zero layout shift and automatic subsetting.
 */

import type { Metadata } from 'next';
import { Nunito, Plus_Jakarta_Sans, Passions_Conflict } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const passions = Passions_Conflict({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-passions',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Folkora — Curated Travel Discovery',
  description: 'Discover journeys curated for your mood, not your search query.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${jakarta.variable} ${passions.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
