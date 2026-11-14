/** @purpose Bilingual "How the Official GRE General Test Works" guide with Swiss grid hairline borders and rounded-md geometry (M2.8-B) */
import type { ReactNode } from 'react';

const NAVY = 'text-[#003057]';

export function GreExamGuide({ isBn }: { isBn: boolean }) {
  const t = (en: string, bn: string): string => (isBn ? bn : en);
  const cards: Array<[string, string]> = [
    [t('Total Duration', 'মোট সময়'), t('1 Hour 58 Minutes', '১ ঘণ্টা ৫৮ মিনিট')],
    [
      t('Format', 'ফরম্যাট'),
      t('Computer-Delivered, Section-Adaptive', 'কম্পিউটার-ডেলিভার্ড, সেকশন-অ্যাডাপটিভ'),
    ],
    [
      t('Score Scale', 'স্কোর স্কেল'),
      t(
        '260–340 Total • 130–170 Quant • 130–170 Verbal • 0.0–6.0 AWA',
        'মোট ২৬০–৩৪০ • কোয়ান্ট ১৩০–১৭০ • ভার্বাল ১৩০–১৭০ • AWA ০.০–৬.০',
      ),
    ],
  ];
  const rows: Array<[string, ReactNode, string]> = [
    [
      t('Analytical Writing', 'অ্যানালিটিক্যাল রাইটিং'),
      t('1 section • 1 “Analyze an Issue” task', '১টি সেকশন • ১টি “Analyze an Issue” টাস্ক'),
      t('30 minutes', '৩০ মিনিট'),
    ],
    [
      t('Verbal Reasoning', 'ভার্বাল রিজনিং'),
      t(
        'Section 1: 12 questions (18 min) → Adaptive Section 2: 15 questions (23 min). Text Completion, Sentence Equivalence, Reading Comprehension.',
        'সেকশন ১: ১২টি প্রশ্ন (১৮ মিনিট) → অ্যাডাপটিভ সেকশন ২: ১৫টি প্রশ্ন (২৩ মিনিট)। টেক্সট কমপ্লিশন, সেন্টেন্স ইকুইভ্যালেন্স, রিডিং কমপ্রিহেনশন।',
      ),
      t('41 minutes', '৪১ মিনিট'),
    ],
    [
      t('Quantitative Reasoning', 'কোয়ান্টিটেটিভ রিজনিং'),
      t(
        'Section 1: 12 questions (21 min) → Adaptive Section 2: 15 questions (26 min). Quantitative Comparison, Multiple Choice, Numeric Entry. On-screen calculator provided.',
        'সেকশন ১: ১২টি প্রশ্ন (২১ মিনিট) → অ্যাডাপটিভ সেকশন ২: ১৫টি প্রশ্ন (২৬ মিনিট)। কোয়ান্টিটেটিভ কমপ্যারিজন, মাল্টিপল চয়েস, নিউমেরিক এন্ট্রি। অন-স্ক্রিন ক্যালকুলেটর দেওয়া হয়।',
      ),
      t('47 minutes', '৪৭ মিনিট'),
    ],
  ];
  return (
    <section
      id="how-gre-works"
      className="w-full border-b border-slate-200 bg-white px-4 py-16 sm:py-20 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8 space-y-10">
        <header className="space-y-2.5 text-left">
          <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#003057]">
            {t('01 • Official ETS Test Architecture', '০১ • অফিশিয়াল ETS পরীক্ষার কাঠামো')}
          </div>
          <h2 className={`text-3xl font-extrabold sm:text-4xl ${NAVY}`}>
            {t(
              'How the Official GRE® General Test Works',
              'অফিশিয়াল GRE® জেনারেল টেস্ট যেভাবে কাজ করে',
            )}
          </h2>
          <p className="max-w-2xl text-slate-600 text-sm sm:text-base">
            {t(
              'Know the exact computer-delivered structure, section timing, and multi-stage routing mechanics before you begin.',
              'কোর্স কেনার আগে ফরম্যাট জেনে নিন। পরীক্ষার দিন ঠিক কী হয়, এখানে দেখুন।',
            )}
          </p>
        </header>

        {/* Exposed 3-Column Hairline Grid */}
        <div className="rounded-md border border-slate-200 bg-slate-50 divide-y md:divide-y-0 md:divide-x divide-slate-200 grid grid-cols-1 md:grid-cols-3">
          {cards.map(([k, v]) => (
            <div key={k} className="p-5 text-left">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                {k}
              </p>
              <p className={`mt-1.5 text-base font-extrabold ${NAVY}`}>{v}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">
              {t('GRE section breakdown', 'GRE সেকশন বিবরণ')}
            </caption>
            <thead className="bg-[#003057] text-white text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-bold">
                  {t('Section', 'সেকশন')}
                </th>
                <th scope="col" className="px-5 py-3.5 font-bold">
                  {t('Structure', 'কাঠামো')}
                </th>
                <th scope="col" className="px-5 py-3.5 font-bold">
                  {t('Time', 'সময়')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rows.map(([s, d, m]) => (
                <tr key={s} className="hover:bg-slate-50/80">
                  <th scope="row" className={`px-5 py-4 font-bold whitespace-nowrap ${NAVY}`}>
                    {s}
                  </th>
                  <td className="px-5 py-4 text-slate-700 leading-relaxed">{d}</td>
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-bold text-slate-900">
                    {m}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-6 text-left space-y-4">
          <div>
            <h3 className={`text-lg font-extrabold ${NAVY}`}>
              {t('How Section-Level Adaptation Works', 'সেকশন-লেভেল অ্যাডাপটেশন যেভাবে কাজ করে')}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {t(
                'The GRE adapts between sections, not question by question. Your Section 1 result decides the difficulty of Section 2.',
                'GRE প্রশ্ন ধরে নয়, সেকশন ধরে অ্যাডাপ্ট করে। সেকশন ১-এর ফলাফল ঠিক করে সেকশন ২ কতটা কঠিন হবে।',
              )}
            </p>
          </div>
          <ol className="rounded-md border border-slate-200 bg-white divide-y md:divide-y-0 md:divide-x divide-slate-200 grid grid-cols-1 md:grid-cols-3">
            <li className="p-4 text-sm">
              <span className={`font-mono text-xs font-extrabold uppercase ${NAVY}`}>
                01. {t('Section 1 Baseline', 'সেকশন ১')}
              </span>
              <p className="mt-1.5 text-slate-700">
                {t(
                  'Medium difficulty for everyone. Your accuracy across the first 12 questions is measured.',
                  'সবার জন্য মাঝারি কঠিনতা। আপনার নির্ভুলতা মাপা হয়।',
                )}
              </p>
            </li>
            <li className="p-4 text-sm">
              <span className={`font-mono text-xs font-extrabold uppercase ${NAVY}`}>
                02. {t('Adaptive Routing', 'রাউটিং')}
              </span>
              <p className="mt-1.5 text-slate-700">
                {t(
                  'Stronger performance routes you to a Harder Section 2; otherwise a Standard Section 2.',
                  'ভালো ফলাফলে কঠিনতর সেকশন ২, অন্যথায় স্ট্যান্ডার্ড সেকশন ২ আসে।',
                )}
              </p>
            </li>
            <li className="p-4 text-sm">
              <span className={`font-mono text-xs font-extrabold uppercase ${NAVY}`}>
                03. {t('Score Ceiling (130–170)', 'স্কোরের সীমা')}
              </span>
              <p className="mt-1.5 text-slate-700">
                {t(
                  'The Section 2 level sets how high your 130–170 score can go. Top scores require the Harder Section 2.',
                  'সেকশন ২-এর লেভেল ঠিক করে আপনার ১৩০–১৭০ স্কোর কত উঁচুতে যেতে পারবে। সর্বোচ্চ স্কোরের জন্য কঠিনতর সেকশন ২ লাগে।',
                )}
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
