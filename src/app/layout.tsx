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

/**
 * Applies the user's saved light/dark preference to <html> before first
 * paint, so Tailwind's `dark:` variant matches immediately and there is
 * no flash of the wrong theme on load. Defaults to 'dark' — the theme
 * the onboarding screens were originally designed in.
 */
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('folkora-theme');
    var theme = stored === 'light' ? 'light' : 'dark';
    var root = document.documentElement;
    root.classList.add(theme);
    root.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${nunito.variable} ${jakarta.variable} ${passions.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
