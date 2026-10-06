import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MONGOLZ — Demo Casino',
  description: 'Монгол / English хоёр хэлтэй, бодит мөнгөгүй casino demo platform.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="mn"><body>{children}</body></html>;
}
