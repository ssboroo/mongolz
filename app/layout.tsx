import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MONGOLZ — Casino Demo 2026',
  description: 'Монгол / English хоёр хэлтэй, 2026 premium crypto-casino inspired playable demo platform.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="mn"><body>{children}</body></html>;
}
