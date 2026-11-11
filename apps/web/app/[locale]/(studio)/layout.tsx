/** @purpose Content authoring and test builder studio layout */
import type { ReactNode } from 'react';

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="studio-shell min-h-screen p-6">
      <header className="studio-header mb-6 border-b pb-4">
        <h1 className="text-xl font-bold">Lumen Authoring Studio</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
