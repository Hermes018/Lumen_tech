/** @purpose Marketing shell layout for public visitors */
import type { ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="marketing-shell flex min-h-screen flex-col">
      <header className="marketing-nav flex items-center justify-between border-b p-4">
        <span className="text-lg font-bold">Lumen Academy</span>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="marketing-footer border-t p-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Lumen Academy. All rights reserved.
      </footer>
    </div>
  );
}
