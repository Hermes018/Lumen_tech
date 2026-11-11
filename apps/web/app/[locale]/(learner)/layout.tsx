/** @purpose Learner portal shell with study dashboard layout */
import type { ReactNode } from 'react';

export default function LearnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="learner-shell flex min-h-screen">
      <aside className="learner-sidebar hidden w-64 border-r p-4 md:block">
        <div className="mb-6 text-lg font-bold">Lumen Learner</div>
        <nav className="space-y-2 text-sm">
          <div>Dashboard</div>
          <div>Practice & Quizzes</div>
          <div>Mock Exams</div>
          <div>Vocab Decks (FSRS)</div>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
