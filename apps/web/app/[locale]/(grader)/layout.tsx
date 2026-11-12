/** @purpose Human evaluation and grading queue layout with mandatory 2FA enforcement badge */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Badge } from '@lumen/ui';
import { ShieldCheck, ClipboardCheck, ArrowLeft } from 'lucide-react';

export default function GraderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Top Staff Navigation Header */}
      <header className="border-b border-control bg-surface sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="text-fg-muted hover:text-fg transition-colors p-1 rounded-lg"
              title="Return to App"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="h-4 w-px bg-control" />
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-accent/15 p-1.5 text-accent">
                <ClipboardCheck className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-fg leading-none">
                  Human Grader Workstation
                </h1>
                <span className="text-[11px] text-fg-muted">
                  GRE AWA & IELTS Double-Marking Protocol (docs/31)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1 border-success/40 bg-success-soft/30 text-success text-xs py-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>2FA Verified Staff Session</span>
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}
