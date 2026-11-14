/** @purpose Full-bleed responsive auth shell layout supporting 50/50 edge-to-edge split-screen authentication (M2.7-B) */
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="auth-shell min-h-screen w-full bg-white">{children}</div>;
}
