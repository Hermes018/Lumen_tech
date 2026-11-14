/** @purpose Bilingual "How the Official GRE General Test Works" guide: overview, section table, adaptation flow (P2.6.3) */
import type { ReactNode } from 'react';

const NAVY = 'text-[#003057]';

export function GreExamGuide({ isBn }: { isBn: boolean }) {
  const t = (en: string, bn: string): string => (isBn ? bn : en);
  const cards: Array<[string, string]> = [
    [t('Total Duration', 'মোট সময়'), t('1 Hour 58 Minutes', '১ ঘণ্টা ৫৮ মিনিট')],
    [t('Format', 'ফরম্যাট'), t('Computer-Delivered, Section-Adaptive', 'কম্পিউটার-ডেলিভার্ড, সেকশন-অ্যাডাপটিভ')],
    [
      t('Score Scale', 'স্কোর স্কেল'),
      t(
        '260–340 Total • 130–170 Quant • 130–170 Verbal • 0.0–6.0 Analytical Writing',
        'মোট ২৬০–৩৪০ • কোয়ান্ট ১৩০–১৭০ • ভার্বাল ১৩০–১৭০ • অ্যানালিটিক্যাল রাইটিং ০.০–৬.০',
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
    <section id="how-gre-works" className="w-full border-t border-slate-200 bg-white px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-2 text-center">
          <h2 className={`text-3xl font-extrabold sm:text-4xl ${NAVY}`}>
            {t('How the Official GRE® General Test Works', 'অফিশিয়াল GRE® জেনারেল টেস্ট যেভাবে কাজ করে')}
          </h2>
          <p className="mx-auto max-w-2xl text-slate-600">
            {t(
              'Know the format before you buy a course. Here is exactly what test day looks like.',
              'কোর্স কেনার আগে ফরম্যাট জেনে নিন। পরীক্ষার দিন ঠিক কী হয়, এখানে দেখুন।',
            )}
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map(([k, v]) => (
            <div key={k} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{k}</p>
              <p className={`mt-1 text-base font-bold ${NAVY}`}>{v}</p>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">{t('GRE section breakdown', 'GRE সেকশন বিবরণ')}</caption>
            <thead className="bg-[#003057] text-white">
              <tr>
                <th scope="col" className="px-4 py-3">{t('Section', 'সেকশন')}</th>
                <th scope="col" className="px-4 py-3">{t('Structure', 'কাঠামো')}</th>
                <th scope="col" className="px-4 py-3">{t('Time', 'সময়')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rows.map(([s, d, m]) => (
                <tr key={s}>
                  <th scope="row" className={`px-4 py-3 font-semibold ${NAVY}`}>{s}</th>
                  <td className="px-4 py-3 text-slate-700">{d}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
          <h3 className={`text-lg font-bold ${NAVY}`}>
            {t('How Section-Level Adaptation Works', 'সেকশন-লেভেল অ্যাডাপটেশন যেভাবে কাজ করে')}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {t(
              'The GRE adapts between sections, not question by question. Your Section 1 result decides the difficulty of Section 2.',
              'GRE প্রশ্ন ধরে নয়, সেকশন ধরে অ্যাডাপ্ট করে। সেকশন ১-এর ফলাফল ঠিক করে সেকশন ২ কতটা কঠিন হবে।',
            )}
          </p>
          <ol className="mt-4 grid gap-3 md:grid-cols-3">
            <li className="rounded-md border border-slate-200 bg-white p-4 text-sm">
              <span className={`font-bold ${NAVY}`}>1. {t('Section 1', 'সেকশন ১')}</span>
              <p className="mt-1 text-slate-700">
                {t('Medium difficulty for everyone. Your accuracy is measured.', 'সবার জন্য মাঝারি কঠিনতা। আপনার নির্ভুলতা মাপা হয়।')}
              </p>
            </li>
            <li className="rounded-md border border-slate-200 bg-white p-4 text-sm">
              <span className={`font-bold ${NAVY}`}>2. {t('Routing', 'রাউটিং')}</span>
              <p className="mt-1 text-slate-700">
                {t(
                  'Stronger performance routes you to a Harder Section 2; otherwise a Standard Section 2.',
                  'ভালো ফলাফলে কঠিনতর সেকশন ২, অন্যথায় স্ট্যান্ডার্ড সেকশন ২ আসে।',
                )}
              </p>
            </li>
            <li className="rounded-md border border-slate-200 bg-white p-4 text-sm">
              <span className={`font-bold ${NAVY}`}>3. {t('Score ceiling', 'স্কোরের সীমা')}</span>
              <p className="mt-1 text-slate-700">
                {t(
                  'The Section 2 level sets how high your 130–170 score can go. The top scores require the Harder Section 2.',
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
