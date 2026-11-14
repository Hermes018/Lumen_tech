/** @purpose Client-filterable Coursera / 10MS style syllabus & program directory for /courses with architectural rounded-md cards (M2.8-B) */
'use client';

import React, { useState } from 'react';
import { Button } from '@lumen/ui';
import { Clock, FileCheck2, Layers } from 'lucide-react';
import { LocaleLink as Link } from '../../_components/LocaleLink';

export type ProgramCategory = 'all' | 'gre' | 'ielts' | 'live';

export interface CourseProgramItem {
  id: string;
  code: string;
  categories: ProgramCategory[];
  title: string;
  subtitle: string;
  durationBadge: string;
  targetScore: string;
  accentColor: string;
  syllabusModules: string[];
  includedAssessments: string;
  priceDisplay: string;
  vatLabel: string;
  trackHref: string;
  checkoutHref: string;
}

export interface CoursesDirectoryClientProps {
  programs: CourseProgramItem[];
  isBn: boolean;
}

export function CoursesDirectoryClient({ programs, isBn }: CoursesDirectoryClientProps) {
  const [activeTab, setActiveTab] = useState<ProgramCategory>('all');

  const tabs: Array<{ id: ProgramCategory; label: string }> = [
    {
      id: 'all',
      label: isBn ? 'সকল প্রোগ্রাম (৬)' : 'All Programs (6)',
    },
    {
      id: 'gre',
      label: isBn ? 'GRE® প্রস্তুতি' : 'GRE® Preparation',
    },
    {
      id: 'ielts',
      label: isBn ? 'IELTS™ একাডেমিক ও GT' : 'IELTS™ Academic & GT',
    },
    {
      id: 'live',
      label: isBn ? 'লাইভ ক্র্যাশ ও কোহর্ট ব্যাচ' : 'Live Crash & Cohort Batches',
    },
  ];

  const visiblePrograms =
    activeTab === 'all'
      ? programs
      : programs.filter((program) => program.categories.includes(activeTab));

  return (
    <div className="space-y-8">
      {/* 1. Interactive Filter Bar at Top */}
      <div className="rounded-md border border-slate-300 bg-white p-2 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label={isBn ? 'প্রোগ্রাম ফিল্টার ট্যাব' : 'Program category filter tabs'}
          className="flex flex-wrap items-center gap-1.5"
        >
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-4 py-2 text-xs sm:text-sm font-bold transition-colors ${
                  isSelected
                    ? 'bg-[#001E42] text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="px-2 text-xs font-mono font-semibold text-slate-600">
          {isBn
            ? `${visiblePrograms.length}টি স্ট্রাকচার্ড প্রোগ্রাম প্রদর্শিত হচ্ছে`
            : `Showing ${visiblePrograms.length} of ${programs.length} Structured Programs`}
        </div>
      </div>

      {/* 2. Structured Program Rows / Architectural Cards */}
      <div className="space-y-6">
        {visiblePrograms.map((program) => (
          <article
            key={program.id}
            className="rounded-md border border-slate-200 bg-white shadow-2xs overflow-hidden transition-colors hover:border-slate-300"
          >
            {/* Top Architectural Metadata Bar */}
            <div className="border-b border-slate-200 bg-slate-50/90 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="inline-block rounded-md px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: program.accentColor }}
                >
                  {program.code}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-0.5 font-mono text-xs font-bold text-slate-800">
                  <Clock className="h-3.5 w-3.5 text-[#007791]" />
                  {program.durationBadge}
                </span>
              </div>
              <div className="font-mono text-xs font-bold text-[#001E42]">
                {program.targetScore}
              </div>
            </div>

            {/* 3-Column Exposed Hairline Body: Overview | Syllabus Modules | Assessments & Tuition */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 text-left">
              {/* Col 1 (4 cols): Program Title, Audience & Included Assessments */}
              <div className="lg:col-span-4 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-extrabold text-slate-950 leading-snug">
                    {program.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {program.subtitle}
                  </p>
                </div>

                <div className="rounded-md border border-slate-200 bg-[#F8F7F4] p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#001E42]">
                    <Layers className="h-3.5 w-3.5 text-[#E4002B]" />
                    <span>
                      {isBn ? 'অন্তর্ভুক্ত মূল্যায়ন ও মক টেস্ট' : 'Included Assessments'}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-900 leading-relaxed">
                    {program.includedAssessments}
                  </div>
                </div>
              </div>

              {/* Col 2 (5 cols): Concrete Syllabus Modules Included */}
              <div className="lg:col-span-5 p-6 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isBn ? 'অন্তর্ভুক্ত পাঠ্যক্রম মডিউলসমূহ' : 'Syllabus Modules Included'}
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
                  {program.syllabusModules.map((mod, idx) => (
                    <li key={mod} className="flex items-start gap-2.5">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 font-mono text-[11px] font-bold text-[#003057]">
                        0{idx + 1}
                      </span>
                      <span className="font-medium text-slate-800">{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3 (3 cols): Transparent Price + Action Buttons */}
              <div className="lg:col-span-3 p-6 bg-slate-50/50 flex flex-col justify-between space-y-5">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {isBn ? 'এককালীন টিউশন ফি' : 'Transparent Tuition'}
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-slate-950">
                    {program.priceDisplay}
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                    <FileCheck2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span>{program.vatLabel}</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Link href={program.checkoutHref} className="block w-full">
                    <Button className="w-full rounded-md bg-[#E4002B] text-white hover:bg-[#c80025] font-bold text-xs sm:text-sm h-10">
                      {isBn ? 'এখনই ভর্তি হোন ->' : 'Enroll Now ->'}
                    </Button>
                  </Link>
                  <Link href={program.trackHref} className="block w-full">
                    <Button
                      variant="outline"
                      className="w-full rounded-md border-slate-300 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs sm:text-sm h-10"
                    >
                      {isBn ? 'ট্র্যাক বিস্তারিত দেখুন' : 'View Track Details'}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
