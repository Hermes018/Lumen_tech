/** @purpose Full-screen distraction-free CBT exam shell layout */
import type { ReactNode } from 'react';

export default function ExamLayout({ children }: { children: ReactNode }) {
  return (
    <div className="exam-shell flex min-h-screen flex-col bg-gray-50 select-none">
      <header className="exam-header flex items-center justify-between border-b bg-white px-6 py-3">
        <span className="font-mono text-sm font-bold">GRE CBT Exam Shell</span>
        <span className="font-mono text-sm">Time Remaining: 30:00</span>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
