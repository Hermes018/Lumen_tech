/** @purpose Minimal auth shell layout */
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell flex min-h-screen items-center justify-center p-4">
      <div className="auth-card w-full max-w-md">{children}</div>
    </div>
  );
}
