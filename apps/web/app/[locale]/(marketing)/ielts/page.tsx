/** @purpose IELTS Marketing showcase with British Council Navy & Crimson Swiss grid architecture, un-obscured student portrait + docked 4-skill band bar, and sticky 4-item sub-navigation bar (M2.8-B) */
import { brand } from '@lumen/config';
import { Button } from '@lumen/ui';
import {
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Columns2,
  MonitorCheck,
  Award,
} from 'lucide-react';
import { LocaleLink as Link } from '../../_components/LocaleLink';
import { IeltsExamGuide } from '../_components/IeltsExamGuide';

export const metadata = {
  title: `IELTS Academic & General Prep | আইইএলটিএস প্রস্তুতি | ${brand.name}`,
  description:
    'Achieve Band 7.5+ with pixel-perfect Computer-Delivered IELTS test runners, AI writing & speaking band diagnostic, and authentic Cambridge-style item banks.',
};

export default async function IeltsMarketingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBn = locale === 'bn';

  return (
    <div className="flex flex-col items-center bg-[#F8F7F4]" data-locale={locale}>
      {/* British Council Navy (#001E42) & IELTS Crimson (#E4002B) Asymmetric 12-Column Split Hero */}
      <section className="relative w-full border-b border-slate-800 bg-[#001E42] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid lg:grid-cols-12 gap-10 items-start">
          {/* Left 7 Columns: Left-Aligned Hero + Academic vs General Training Quick Boxes + Direct CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-slate-200">
              {isBn
                ? 'কম্পিউটার-ডেলিভার্ড আইইএলটিএস প্যারিটি • ব্রিটিশ কাউন্সিল ও আইডিপি মানদণ্ড'
                : 'Computer-Delivered IELTS™ Parity • Official Centre Interface'}
            </div>

            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {isBn ? (
                <>
                  আসল পরীক্ষার নির্ভুলতায় অর্জন করুন{' '}
                  <span className="text-[#00A896]">ব্যান্ড ৭.৫ থেকে ৮.৫</span>
                </>
              ) : (
                <>
                  Target Band <span className="text-[#00A896]">7.5 to 8.5</span> with Exam-Room
                  Precision
                </>
              )}
            </h1>

            <p className="max-w-2xl text-base text-slate-200 sm:text-lg leading-relaxed">
              {isBn
                ? 'ব্রিটিশ কাউন্সিল এবং আইডিপি এক্সাম সেন্টারে ব্যবহৃত হুবহু একই ইন্টারফেসে অনুশীলন করুন। বাস্তবসম্মত সিঙ্গেল-প্লে লিসেনিং, টেক্সট হাইলাইটারসহ স্প্লিট-পেইন রিডিং এবং রাইটিং ও স্পিকিংয়ের জন্য তাৎক্ষণিক রুব্রিক মূল্যায়ন।'
                : 'Practice in the exact interface used in British Council & IDP exam centres. Realistic single-play listening, split-pane reading with text highlighter, and instant rubric evaluations for Writing & Speaking.'}
            </p>

            {/* Academic vs. General Training Architectural Hairline Grid */}
            <div className="rounded-md border border-slate-700 bg-[#00142E] divide-y sm:divide-y-0 sm:divide-x divide-slate-700 grid grid-cols-1 sm:grid-cols-2 max-w-xl text-xs">
              <div className="p-3.5">
                <div className="font-mono font-bold text-white uppercase tracking-wider">
                  {isBn ? 'IELTS Academic (একাডেমিক)' : 'IELTS™ Academic'}
                </div>
                <div className="text-slate-300 mt-1">
                  {isBn
                    ? 'যুক্তরাজ্য, যুক্তরাষ্ট্র, কানাডা ও অস্ট্রেলিয়ায় উচ্চশিক্ষা'
                    : 'UK, US, Canada & Australia Higher Study'}
                </div>
              </div>
              <div className="p-3.5">
                <div className="font-mono font-bold text-white uppercase tracking-wider">
                  {isBn ? 'IELTS General Training (জিটি)' : 'IELTS™ General Training'}
                </div>
                <div className="text-slate-300 mt-1">
                  {isBn
                    ? 'কানাডা এক্সপ্রেস এন্ট্রি (CLB 9+) ও স্কিলড মাইগ্রেশন'
                    : 'Express Entry PR (CLB 9+) & Work Visas'}
                </div>
              </div>
            </div>

            {/* Primary Rectangular CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/exam/ielts-preview">
                <Button
                  size="lg"
                  className="rounded-md gap-2 bg-[#E4002B] text-white hover:bg-[#c80025] font-bold shadow-sm px-6 h-12 text-base"
                >
                  {isBn
                    ? 'স্প্লিট-স্ক্রিন সিবিটি সিমুলেটর চালু করুন'
                    : 'Launch Split-Screen CBT Simulator'}{' '}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/exam/diagnostic">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-md border-slate-400 bg-white/10 text-white hover:bg-white/20 font-semibold px-6 h-12 text-base"
                >
                  {isBn
                    ? 'ফ্রি আইইএলটিএস ব্যান্ড ডায়াগনস্টিক দিন'
                    : 'Take Free IELTS Band Diagnostic'}
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex flex-wrap items-center gap-6 text-xs text-slate-200">
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle className="h-4 w-4 text-[#00A896]" />{' '}
                {isBn ? 'সিডি-আইইএলটিএস প্রামাণিক ইউআই শেল' : 'CD-IELTS Authentic UI Shell'}
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle className="h-4 w-4 text-[#E4002B]" />{' '}
                {isBn ? '৪-মাত্রিক হিউম্যান + এআই রুব্রিক' : '4-Dimension Human + AI Rubric'}
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle className="h-4 w-4 text-[#00A896]" />{' '}
                {isBn ? 'একাডেমিক ও জেনারেল ট্রেনিং' : 'Academic & General Training'}
              </span>
            </div>
          </div>

          {/* Right 5 Columns: Un-tilted, Un-obscured Student Photograph + Docked 4-Skill Band Breakdown Bar Underneath */}
          <div className="lg:col-span-5">
            <div className="rounded-md overflow-hidden border border-slate-700/60 bg-slate-950 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85"
                alt={
                  isBn
                    ? 'হেডফোন পরে কম্পিউটার-ডেলিভার্ড আইইএলটিএস অনুশীলনরত শিক্ষার্থী'
                    : 'Student with headphones in computer-delivered IELTS test setting'
                }
                className="h-[290px] sm:h-[320px] w-full object-cover object-center block"
              />
              {/* Solid Structural Caption Bar Docked Directly Underneath the Photo */}
              <div className="border-t border-slate-700/80 bg-[#00142E] p-4 space-y-2.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-200">
                    <Award className="h-3.5 w-3.5 text-[#E4002B]" />
                    {isBn
                      ? '৪-স্কিল ব্যান্ড ব্রেকডাউন বেঞ্চমার্ক'
                      : '4-Skill Band Breakdown Benchmark'}
                  </span>
                  <span className="rounded-md bg-[#E4002B] px-2 py-0.5 font-mono text-xs font-extrabold text-white">
                    Overall 8.0 (C1)
                  </span>
                </div>
                <div className="rounded-md border border-slate-700 bg-slate-900 divide-x divide-slate-700 grid grid-cols-4 text-center">
                  <div className="p-2">
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      Listening
                    </div>
                    <div className="font-mono text-sm font-black text-white">8.5</div>
                  </div>
                  <div className="p-2">
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      Reading
                    </div>
                    <div className="font-mono text-sm font-black text-[#00A896]">8.5</div>
                  </div>
                  <div className="p-2">
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      Writing
                    </div>
                    <div className="font-mono text-sm font-black text-rose-400">7.5</div>
                  </div>
                  <div className="p-2">
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      Speaking
                    </div>
                    <div className="font-mono text-sm font-black text-white">7.5</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky In-Page Sub-Navbar */}
      <nav
        aria-label={isBn ? 'আইইএলটিএস পৃষ্ঠা নেভিগেশন' : 'IELTS page sub-navigation'}
        className="w-full bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <a
              href="#how-ielts-works"
              className="px-4 py-3.5 text-left font-mono text-xs font-bold text-slate-800 hover:bg-slate-50 hover:text-[#001E42] transition-colors flex items-center justify-between"
            >
              <span>
                {isBn
                  ? '01. অফিশিয়াল ফরম্যাট ও ব্যান্ড টেবিল'
                  : '01. Official Exam Format & Band Table'}
              </span>
              <span className="text-slate-400">↓</span>
            </a>
            <a
              href="#simulator"
              className="px-4 py-3.5 text-left font-mono text-xs font-bold text-slate-800 hover:bg-slate-50 hover:text-[#001E42] transition-colors flex items-center justify-between"
            >
              <span>
                {isBn ? '02. স্প্লিট-স্ক্রিন সিবিটি সিমুলেটর' : '02. Split-Screen CBT Simulator'}
              </span>
              <span className="text-slate-400">↓</span>
            </a>
            <a
              href="#skills"
              className="px-4 py-3.5 text-left font-mono text-xs font-bold text-slate-800 hover:bg-slate-50 hover:text-[#001E42] transition-colors flex items-center justify-between"
            >
              <span>{isBn ? '03. ৪-স্কিল মডিউলসমূহ' : '03. 4-Skill Modules'}</span>
              <span className="text-slate-400">↓</span>
            </a>
            <Link
              href="/pricing"
              className="px-4 py-3.5 text-left font-mono text-xs font-bold text-[#001E42] hover:bg-slate-50 transition-colors flex items-center justify-between"
            >
              <span>{isBn ? '04. টিউশন ও প্ল্যানসমূহ' : '04. Tuition & Plans'}</span>
              <span className="text-[#E4002B]">-&gt;</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 01. Official Exam Format & Band Table */}
      <IeltsExamGuide isBn={isBn} />

      {/* 02. Split-Screen CBT Simulator Preview Banner */}
      <section
        id="simulator"
        className="w-full max-w-7xl mx-auto px-4 pt-16 sm:px-6 lg:px-8 scroll-mt-16"
      >
        <div className="overflow-hidden rounded-md border border-slate-200 border-t-4 border-t-[#E4002B] bg-white shadow-sm">
          <div className="bg-[#001E42] px-6 py-3.5 text-white flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Columns2 className="h-4 w-4 text-[#00A896]" />
              <span className="font-mono font-bold uppercase tracking-wider text-slate-100">
                {isBn
                  ? '০২ • সিডি-আইইএলটিএস স্প্লিট-পেইন রিডিং ও লিসেনিং রানার'
                  : '02 • CD-IELTS Split-Pane Reading & Listening Runner'}
              </span>
            </div>
            <span className="rounded-md bg-[#006677] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-white">
              {isBn ? 'লাইভ ইন্টারেক্টিভ স্যান্ডবক্স' : 'Live Interactive Sandbox'}
            </span>
          </div>

          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
            <div className="space-y-4 lg:col-span-7 text-left">
              <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#006677]">
                {isBn ? 'অফিশিয়াল টেস্ট ইন্টারফেস প্রিভিউ' : 'Official Centre Workstation Preview'}
              </div>
              <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-slate-950">
                {isBn
                  ? 'স্প্লিট-স্ক্রিন সিবিটি সিমুলেটর চালু করুন'
                  : 'Launch Split-Screen CBT Simulator'}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {isBn
                  ? 'অ্যাকাউন্ট খোলা ছাড়াই অভিজ্ঞতা নিন প্রামাণিক ২-কলাম রিডিং প্যাসেজ ও প্রশ্ন ওয়ার্কবেঞ্চের—যেখানে রয়েছে বিল্ট-ইন টেক্সট হাইলাইটিং, নিচের প্রশ্ন প্যালেট নেভিগেশন এবং রিয়েল-টাইম ওয়ার্ড কাউন্ট ট্র্যাকিং।'
                  : 'Experience the authentic 2-column reading passage & question workbench with built-in text highlighting, bottom question palette navigation, and real-time word count tracking—without creating an account.'}
              </p>
              <div className="grid grid-cols-1 gap-2.5 text-xs text-slate-700 sm:grid-cols-2 pt-1">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle className="h-4 w-4 text-[#006677] shrink-0" />
                  <span>
                    {isBn ? 'স্বতন্ত্র ডুয়াল-পেইন স্ক্রলিং' : 'Independent Dual-Pane Scrolling'}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle className="h-4 w-4 text-[#006677] shrink-0" />
                  <span>
                    {isBn
                      ? 'হলুদ / গোলাপি প্যাসেজ হাইলাইটার'
                      : 'Yellow / Pink Passage Highlighter'}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle className="h-4 w-4 text-[#006677] shrink-0" />
                  <span>
                    {isBn ? 'True / False / Not Given ড্রিল' : 'True / False / Not Given Drills'}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle className="h-4 w-4 text-[#006677] shrink-0" />
                  <span>{isBn ? '১০-সেকেন্ড ক্লাউড অটোসেভ' : '10-Second Cloud Autosave'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-md border border-slate-200 bg-[#F8F7F4] p-6 lg:col-span-5 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#001E42] text-white">
                  <MonitorCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-950">
                    {isBn ? 'তাৎক্ষণিক ব্রাউজার প্রিভিউ' : 'Instant Browser Preview'}
                  </div>
                  <div className="text-xs text-slate-600">
                    {isBn
                      ? 'ডেস্কটপ স্প্লিট-স্ক্রিন ও মোবাইল ট্যাব'
                      : 'Desktop split-screen & mobile tabs'}
                  </div>
                </div>
              </div>
              <Link href="/exam/ielts-preview" className="block w-full">
                <Button className="w-full rounded-md justify-center gap-2 bg-[#E4002B] text-white hover:bg-[#c80025] font-bold h-11">
                  {isBn
                    ? 'স্প্লিট-স্ক্রিন সিবিটি সিমুলেটর চালু করুন'
                    : 'Launch Split-Screen CBT Simulator'}{' '}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="/pricing"
                className="block text-center text-xs font-bold text-[#006677] hover:underline"
              >
                {isBn
                  ? 'আইইএলটিএস একাডেমিক ও জিটি প্ল্যান তুলনা করুন →'
                  : 'Compare IELTS Academic & GT Plans →'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 03. 4-Skill Modules (Exposed 4-Column Hairline Grid) */}
      <section
        id="skills"
        className="w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 sm:py-20 scroll-mt-16"
      >
        <div className="space-y-2.5 mb-10 text-left">
          <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#001E42]">
            {isBn
              ? '০৩ • অফিশিয়াল কেমব্রিজ ও আইডিপি ৪-স্কিল কাঠামো'
              : '03 • Official 4-Skill Assessment Framework'}
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950">
            {isBn ? '৪টি স্কিলেই পূর্ণাঙ্গ দক্ষতা অর্জন' : 'Complete Mastery Across All 4 Skills'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
            {isBn
              ? 'রাইটিং টাস্ক ২-এর কোহেরেন্স এবং স্পিকিং ফ্লুয়েন্সিতে বাংলাদেশি পরীক্ষার্থীদের নির্দিষ্ট দুর্বলতাগুলো কাটিয়ে উঠতে বিশেষভাবে ডিজাইন করা হয়েছে।'
              : 'Engineered to overcome the specific bottlenecks faced by Bangladeshi test takers in Writing Task 2 coherence and Speaking fluency.'}
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-white divide-y sm:divide-y-0 sm:divide-x divide-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 shadow-2xs">
          {/* Listening */}
          <div className="p-6 space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#001E42]">
                SKILL 01 • 30 MIN
              </span>
              <Headphones className="h-4 w-4 text-[#001E42]" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-950">
              {isBn ? 'লিসেনিং রানার' : 'Listening Runner'}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {isBn
                ? 'যুক্তরাজ্য, অস্ট্রেলিয়া এবং উত্তর আমেরিকান অ্যাকসেন্টসহ প্রামাণিক সিঙ্গেল-প্লে অডিও স্ট্রিম।'
                : 'Authentic single-play audio streams with UK, Australian, and North American accents.'}
            </p>
            <p className="text-slate-500 text-xs pt-2 border-t border-slate-100">
              {isBn
                ? 'সকল ৭টি সিডি-আইইএলটিএস প্রশ্নের ধরন সমর্থন করে: ফর্ম পূরণ, ম্যাপ লেবেলিং, ম্যাচিং এবং এমসিকিউ।'
                : 'Supports all 7 CD-IELTS item formats: form completion, map labelling, matching, and MCQ.'}
            </p>
          </div>

          {/* Reading */}
          <div className="p-6 space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#006677]">
                SKILL 02 • 60 MIN
              </span>
              <BookOpen className="h-4 w-4 text-[#006677]" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-950">
              {isBn ? 'রিডিং স্প্লিট-পেইন' : 'Reading Split-Pane'}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {isBn
                ? 'ইন্টারেক্টিভ টেক্সট হাইলাইটারসহ স্বতন্ত্রভাবে স্ক্রলযোগ্য প্যাসেজ এবং প্রশ্ন পেইন।'
                : 'Independent scrolling passage and questions pane with interactive text highlighter.'}
            </p>
            <p className="text-slate-500 text-xs pt-2 border-t border-slate-100">
              {isBn
                ? 'True/False/Not Given এবং Yes/No/Not Given-এর সূক্ষ্ম পার্থক্য বোঝার বিশেষ প্রশিক্ষণ।'
                : 'True/False/Not Given and Yes/No/Not Given cognitive distinction training.'}
            </p>
          </div>

          {/* Writing */}
          <div className="p-6 space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#E4002B]">
                SKILL 03 • 60 MIN
              </span>
              <PenTool className="h-4 w-4 text-[#E4002B]" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-950">
              {isBn ? 'রাইটিং ইভ্যালুয়েটর' : 'Writing Evaluator'}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {isBn
                ? 'তথ্য হারানো রোধে ১০-সেকেন্ড অটোসেভসহ রিয়েল-টাইম ওয়ার্ড কাউন্ট।'
                : 'Real-time word counts with 10-second autosave preventing accidental loss.'}
            </p>
            <p className="text-slate-500 text-xs pt-2 border-t border-slate-100">
              {isBn
                ? 'টাস্ক অ্যাচিভমেন্ট, কোহেশন, লেক্সিক্যাল রিসোর্স এবং গ্রামারের ওপর বিস্তারিত রুব্রিক বিশ্লেষণ।'
                : 'Rubric breakdown across Task Achievement, Cohesion, Lexical Resource, and Grammar.'}
            </p>
          </div>

          {/* Speaking */}
          <div className="p-6 space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#001E42]">
                SKILL 04 • 11–14 MIN
              </span>
              <Mic className="h-4 w-4 text-[#001E42]" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-950">
              {isBn ? 'স্পিকিং সিমুলেটর' : 'Speaking Simulator'}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {isBn
                ? 'টাইমড পার্ট ১, ২ (কিউ কার্ড ১-মিনিট প্রস্তুতি) এবং পার্ট ৩ ডিসকাশনের সাথে STT শব্দ-ভিত্তিক মূল্যায়ন।'
                : 'Timed Parts 1, 2 (cue card 1-min prep), and Part 3 discussion with STT word-level evaluation.'}
            </p>
            <p className="text-slate-500 text-xs pt-2 border-t border-slate-100">
              {isBn
                ? 'কথার গতি (wpm), বিরতি, ফিলার শব্দের হার এবং উচ্চারণের স্পষ্টতা পরিমাপ করে।'
                : 'Measures speech rate (wpm), pauses, filler frequency, and pronunciation clarity.'}
            </p>
          </div>
        </div>
      </section>

      {/* Band Calculator Footer Banner with Editorial Kicker */}
      <section className="w-full border-t border-slate-800 bg-[#001E42] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3 text-left">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-slate-200">
              {isBn
                ? 'অফিশিয়াল ০.২৫ / ০.৭৫ ব্যান্ড রাউন্ডিং ক্যালকুলেটর'
                : 'Official 0.25 / 0.75 Band Rounding Calculator'}
            </div>
            <h3 className="text-2xl lg:text-4xl font-extrabold text-white">
              {isBn ? 'আপনার আইইএলটিএস ব্যান্ড স্কোর হিসাব করুন' : 'Calculate Your IELTS Band Score'}
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              {isBn
                ? 'অফিসিয়াল ০.২৫/০.৭৫ রাউন্ডিং নিয়মের অধীনে ৪টি স্কিলের ব্যান্ড কীভাবে গড় করা হয় তা দেখুন।'
                : 'Check how individual skill bands aggregate under the official 0.25/0.75 rounding rule.'}
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link href="/tools/ielts-band-calculator">
              <Button
                size="lg"
                className="rounded-md gap-2 bg-[#E4002B] text-white hover:bg-[#c80025] font-bold px-8 h-12 text-base shadow-sm"
              >
                <BarChart3 className="h-4 w-4" />{' '}
                {isBn ? 'আইইএলটিএস ব্যান্ড ক্যালকুলেটর খুলুন' : 'Open IELTS Band Calculator'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
