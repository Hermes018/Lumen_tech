/** @purpose Full-bleed exam shell wrapper letting each specific exam runner render authentic chrome */
import type { ReactNode } from 'react';

export default function ExamLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 text-slate-900 overflow-x-hidden">
      {children}
    </div>
  );
}
