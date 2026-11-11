/** @purpose Ultra-authentic ETS PowerPrep GRE Computer-Based Test (CBT) exam shell */
import type { ReactNode } from 'react';
import {
  Calculator,
  Bookmark,
  HelpCircle,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ListFilter,
} from 'lucide-react';

export default function ExamLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-exam-theme="soft"
      className="exam-shell flex min-h-screen flex-col bg-[#f4f4f4] font-sans text-[#111] antialiased select-none"
    >
      {/* ETS PowerPrep Authentic CBT Top Header Bar */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#cccccc] bg-[#e5e5e5] px-4 shadow-xs sm:px-6">
        {/* Left: Section Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-[#222]">
            Section 1 of 2 — Quantitative Reasoning
          </span>
        </div>

        {/* Center: Server-Authoritative Timer & Hide/Show Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded border border-[#bbbbbb] bg-white px-2.5 py-1 font-mono text-sm font-bold tracking-wider text-[#111]">
            <span>34:52</span>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 rounded border border-[#bbbbbb] bg-[#f9f9f9] px-2 py-1 text-xs font-medium text-[#333] transition-colors hover:bg-[#eaeaea] active:bg-[#dddddd]"
            title="Toggle timer visibility"
          >
            <EyeOff className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Hide Time</span>
          </button>
        </div>

        {/* Right: ETS Action Toolbar */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* 4-Function Calculator Button */}
          <button
            type="button"
            className="flex items-center gap-1 rounded border border-[#aaaaaa] bg-[#f0f0f0] px-2.5 py-1 text-xs font-semibold text-[#222] transition-colors hover:bg-[#e4e4e4] active:bg-[#d4d4d4]"
          >
            <Calculator className="h-3.5 w-3.5 text-[#444]" />
            <span className="hidden md:inline">Calculator</span>
          </button>

          {/* Mark / Flag Toggle */}
          <label className="flex cursor-pointer items-center gap-1 rounded border border-[#aaaaaa] bg-[#f0f0f0] px-2.5 py-1 text-xs font-semibold text-[#222] hover:bg-[#e4e4e4]">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#888] accent-[#1a56db]" />
            <Bookmark className="h-3.5 w-3.5 text-[#555]" />
            <span className="hidden md:inline">Mark</span>
          </label>

          {/* Review Screen Trigger */}
          <button
            type="button"
            className="flex items-center gap-1 rounded border border-[#aaaaaa] bg-[#f0f0f0] px-2.5 py-1 text-xs font-semibold text-[#222] transition-colors hover:bg-[#e4e4e4]"
          >
            <ListFilter className="h-3.5 w-3.5 text-[#444]" />
            <span className="hidden sm:inline">Review</span>
          </button>

          {/* Help Screen */}
          <button
            type="button"
            className="flex items-center gap-1 rounded border border-[#aaaaaa] bg-[#f0f0f0] px-2 py-1 text-xs font-semibold text-[#222] transition-colors hover:bg-[#e4e4e4]"
            aria-label="Exam Help"
          >
            <HelpCircle className="h-3.5 w-3.5 text-[#444]" />
            <span className="hidden lg:inline">Help</span>
          </button>

          {/* Back & Next Navigation */}
          <div className="flex items-center gap-1 border-l border-[#cccccc] pl-1">
            <button
              type="button"
              className="flex items-center gap-0.5 rounded border border-[#999999] bg-[#e8e8e8] px-2.5 py-1 text-xs font-bold text-[#111] transition-colors hover:bg-[#d8d8d8] active:bg-[#cccccc]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-0.5 rounded border border-[#2b52ba] bg-[#3b66d4] px-3 py-1 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#2d56c2] active:bg-[#2245a4]"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Distraction-Free Exam Question Canvas */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* CBT Autosave & Engine Status Bar */}
      <footer className="flex h-8 items-center justify-between border-t border-[#d5d5d5] bg-[#eaeaea] px-4 text-[11px] text-[#666]">
        <span>Autosave: Active (every 10s to Cloud Neon DB)</span>
        <span>Lumen GRE Computer-Based Engine v1.0 • ETS PowerPrep Calibration</span>
      </footer>
    </div>
  );
}
