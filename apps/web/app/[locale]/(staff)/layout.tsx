/** @purpose Internal staff management layout (Editor, Support, Finance) */
import type { ReactNode } from 'react';

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <div className="staff-shell min-h-screen p-6">
      <header className="staff-header mb-6 border-b pb-4">
        <h1 className="text-xl font-bold">Staff Operations Portal</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
