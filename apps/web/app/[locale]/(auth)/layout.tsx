/** @purpose Responsive auth shell layout supporting 12-column split-screen authentication and onboarding */
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="auth-card mx-auto w-full max-w-6xl">{children}</div>
    </div>
  );
}
