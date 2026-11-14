/** @purpose Checkout and order shell layout with sticky header and LocaleSwitcher */
import type { ReactNode } from 'react';
import { brand } from '@lumen/config';
import { GraduationCap } from 'lucide-react';
import { Link } from '@/src/i18n/routing';
import { LocaleSwitcher } from '../_components/LocaleSwitcher';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="checkout-shell bg-canvas text-fg min-h-screen flex flex-col">
      <header className="checkout-header border-border bg-surface/80 sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="bg-accent text-accent-fg flex h-8 w-8 items-center justify-center rounded-lg">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-fg">{brand.name}</span>
            <span className="text-fg-muted border-border hidden border-l pl-2 text-xs font-medium sm:inline">
              Secure Checkout
            </span>
          </Link>
          <LocaleSwitcher />
        </div>
      </header>
      <main className="w-full flex-1">{children}</main>
    </div>
  );
}
