/** @purpose Full-bleed responsive auth shell layout supporting 50/50 edge-to-edge split-screen authentication (M2.7-B, P8) */
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="auth-shell min-h-screen w-full bg-[var(--bg)]">{children}</div>;
}
