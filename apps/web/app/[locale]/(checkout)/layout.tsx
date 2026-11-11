/** @purpose Checkout and order shell layout */
import type { ReactNode } from 'react';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="checkout-shell min-h-screen p-6">
      <header className="checkout-header mb-6 border-b pb-4">
        <h1 className="text-lg font-semibold">Lumen Academy Secure Checkout</h1>
      </header>
      <main className="mx-auto max-w-2xl">{children}</main>
    </div>
  );
}
