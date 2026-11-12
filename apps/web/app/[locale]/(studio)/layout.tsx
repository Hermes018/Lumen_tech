/** @purpose Content authoring and test builder studio layout with 2FA badge */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Badge } from '@lumen/ui';
import { Layers, BookOpen, ShieldCheck, PlusCircle } from 'lucide-react';

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="studio-shell bg-canvas text-fg min-h-screen">
      <header className="border-border bg-surface/90 sticky top-0 z-30 flex h-16 items-center justify-between border-b px-6 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <Link href="/studio" className="flex items-center gap-2 font-bold text-lg">
            <span className="bg-accent text-accent-fg flex h-8 w-8 items-center justify-center rounded-lg font-bold">
              S
            </span>
            <span>Lumen Studio</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link
              href="/studio"
              className="text-fg hover:text-accent flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="h-4 w-4" /> Question Bank
            </Link>
            <Link
              href="/studio/assembly"
              className="text-fg-muted hover:text-fg flex items-center gap-1.5 transition-colors"
            >
              <Layers className="h-4 w-4" /> Form Assembly
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
            <ShieldCheck className="h-3.5 w-3.5" /> 2FA Verified (D4)
          </Badge>
          <Link
            href="/studio/questions/new"
            className="bg-accent text-accent-fg hover:opacity-90 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold shadow-xs transition-opacity"
          >
            <PlusCircle className="h-4 w-4" /> New Question
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
