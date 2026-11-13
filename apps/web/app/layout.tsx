/** @purpose Root application layout for Next.js 16 with design tokens */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { brand } from '@lumen/config';
import './globals.css';

export const metadata: Metadata = {
  title: brand.name,
  description: brand.tagline,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-canvas text-fg antialiased">{children}</body>
    </html>
  );
}
