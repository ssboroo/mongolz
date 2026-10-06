import './globals.css';
import './reference.css';
import type { Metadata } from 'next';
import { Manrope, Unbounded } from 'next/font/google';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-ui',
  display: 'swap'
});

const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'MONGOLZ — Casino Demo 2026',
  description: 'Монгол / English хоёр хэлтэй, 2026 premium crypto-casino inspired playable demo platform.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="mn"><body className={`${manrope.variable} ${unbounded.variable}`}>{children}</body></html>;
}
