/** @purpose Platform super-admin and security console layout */
import type { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell min-h-screen bg-gray-50 p-6">
      <header className="admin-header mb-6 border-b pb-4">
        <h1 className="text-xl font-bold">Lumen Platform Administration</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
