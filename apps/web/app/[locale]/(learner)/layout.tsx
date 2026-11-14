/** @purpose Responsive learner portal shell with sidebar, track switcher, streak pill, and AI credit badge */
import type { ReactNode } from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
import { brand } from '@lumen/config';
import { Badge, Button } from '@lumen/ui';
import {
  LayoutDashboard,
  Target,
  Award,
  Brain,
  AlertTriangle,
  GraduationCap,
  Flame,
  Zap,
  User,
  Menu,
} from 'lucide-react';
import { LocaleSwitcher } from '../_components/LocaleSwitcher';

export default function LearnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="learner-shell bg-canvas text-fg flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="learner-sidebar border-border bg-surface hidden w-64 flex-col border-r lg:flex">
        {/* Brand Header */}
        <div className="border-border flex h-16 items-center gap-2 border-b px-6">
          <span className="bg-accent text-accent-fg flex h-8 w-8 items-center justify-center rounded-lg font-bold">
            {brand.shortName.charAt(0)}
          </span>
          <div className="flex flex-col">
            <span className="leading-tight font-bold">{brand.name}</span>
            <span className="text-fg-muted text-xs">Learner Portal</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-4 py-6 text-sm font-medium">
          <Link
            href="/app"
            className="bg-surface-2 text-fg flex items-center gap-3 rounded-md px-3 py-2 transition-colors"
          >
            <LayoutDashboard className="text-accent h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/app/progress"
            className="text-fg-muted hover:bg-surface-2 hover:text-fg flex items-center gap-3 rounded-md px-3 py-2 transition-colors"
          >
            <Award className="h-4 w-4" />
            <span>Mastery & Analytics</span>
          </Link>
          <Link
            href="/app/practice"
            className="text-fg-muted hover:bg-surface-2 hover:text-fg flex items-center gap-3 rounded-md px-3 py-2 transition-colors"
          >
            <Target className="h-4 w-4" />
            <span>Practice & Drills</span>
          </Link>
          <Link
            href="/app/mistakes"
            className="text-fg-muted hover:bg-surface-2 hover:text-fg flex items-center gap-3 rounded-md px-3 py-2 transition-colors"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Mistake Notebook</span>
          </Link>
          <Link
            href="/app/flashcards"
            className="text-fg-muted hover:bg-surface-2 hover:text-fg flex items-center gap-3 rounded-md px-3 py-2 transition-colors"
          >
            <Brain className="h-4 w-4" />
            <span>Vocab Decks (FSRS)</span>
          </Link>
          <Link
            href="/app/error-log"
            className="text-fg-muted hover:bg-surface-2 hover:text-fg flex items-center gap-3 rounded-md px-3 py-2 transition-colors"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Trap Diagnostics</span>
          </Link>
          <Link
            href="/app/admissions"
            className="text-fg-muted hover:bg-surface-2 hover:text-fg flex items-center gap-3 rounded-md px-3 py-2 transition-colors"
          >
            <GraduationCap className="h-4 w-4" />
            <span>Admissions (P2)</span>
          </Link>
        </nav>

        {/* Sidebar Footer with Session / Diagnostics Info */}
        <div className="border-border text-fg-muted border-t p-4 text-xs">
          <div className="text-fg font-medium">GRE Diagnostic Target</div>
          <p className="mt-1">Current: 318 → Goal: 330+</p>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header Bar */}
        <header className="border-border bg-surface/90 sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-md sm:px-6">
          {/* Mobile menu and current track indicator */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-fg-muted hover:text-fg p-2 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Track Switcher */}
            <div className="border-control bg-surface-2 flex items-center rounded-lg border p-0.5 text-xs font-semibold">
              <button type="button" className="bg-surface text-fg rounded-md px-3 py-1 shadow-xs">
                GRE Prep
              </button>
              <button type="button" className="text-fg-muted hover:text-fg rounded-md px-3 py-1">
                IELTS
              </button>
            </div>
          </div>

          {/* User Status Pills & Profile */}
          <div className="flex items-center gap-3">
            {/* Interactive Language Switcher */}
            <LocaleSwitcher />

            {/* Study Streak Pill */}
            <div className="bg-warning-soft text-warning-fg border-warning/20 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
              <Flame className="fill-warning text-warning h-4 w-4" />
              <span>7 Day Streak</span>
            </div>

            {/* AI Credits Counter Badge */}
            <Badge variant="default" className="hidden gap-1 px-2.5 py-1 sm:inline-flex">
              <Zap className="fill-accent h-3.5 w-3.5" />
              <span>120 Credits</span>
            </Badge>

            {/* Profile Avatar Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 rounded-full p-0"
              aria-label="User Profile"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
