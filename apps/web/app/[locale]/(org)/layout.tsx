/** @purpose Institutional coaching centre and B2B portal layout */
import type { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

export default function OrgLayout({ children }: { children: ReactNode }) {
  return (
    <div className="org-shell min-h-screen p-6">
      <header className="org-header mb-6 border-b pb-4">
        <h1 className="text-xl font-bold">Institution & Coaching Centre Portal</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
