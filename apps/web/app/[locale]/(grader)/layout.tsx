/** @purpose Human evaluation and grading queue layout */
import type { ReactNode } from 'react';

export default function GraderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grader-shell min-h-screen p-6">
      <header className="grader-header mb-6 border-b pb-4">
        <h1 className="text-xl font-bold">Grader Workspace (2FA Required)</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
