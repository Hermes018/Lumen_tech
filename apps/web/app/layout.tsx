/** @purpose Root application layout for Next.js 16 with design tokens */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Hind_Siliguri } from 'next/font/google';
import { brand } from '@lumen/config';
import 'katex/dist/katex.min.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['bengali'],
  variable: '--font-bengali',
  display: 'swap',
});

export const metadata: Metadata = {
  title: brand.name,
  description: brand.tagline,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${hindSiliguri.variable}`}>
      <body className="bg-canvas text-fg antialiased">{children}</body>
    </html>
  );
}
