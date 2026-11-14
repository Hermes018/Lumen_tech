/** @purpose Bilingual "How the Official IELTS Exam Works" guide: Academic vs General Training, sections, band scale (P2.6.3) */
const NAVY = 'text-[#005A70]';

export function IeltsExamGuide({ isBn }: { isBn: boolean }) {
  const t = (en: string, bn: string): string => (isBn ? bn : en);
  const modules: Array<[string, string]> = [
    [
      t('IELTS Academic', 'আইইএলটিএস অ্যাকাডেমিক'),
      t(
        'For university degrees in the UK, USA, Canada, Australia and Europe, and for professional registration.',
        'যুক্তরাজ্য, যুক্তরাষ্ট্র, কানাডা, অস্ট্রেলিয়া ও ইউরোপে বিশ্ববিদ্যালয়ে ডিগ্রি এবং পেশাগত নিবন্ধনের জন্য।',
      ),
    ],
    [
      t('IELTS General Training', 'আইইএলটিএস জেনারেল ট্রেনিং'),
      t(
        'For skilled migration, permanent residency, Canada Express Entry and Australia/UK work visas.',
        'স্কিলড মাইগ্রেশন, পিআর, কানাডা এক্সপ্রেস এন্ট্রি এবং অস্ট্রেলিয়া/যুক্তরাজ্যের ওয়ার্ক ভিসার জন্য।',
      ),
    ],
  ];
  const sections: Array<[string, string, string]> = [
    [
      t('Listening', 'লিসেনিং'),
      t('30 min', '৩০ মিনিট'),
      t('4 recordings • 40 questions • played once only', '৪টি রেকর্ডিং • ৪০টি প্রশ্ন • শুধু একবার বাজানো হয়'),
    ],
    [
      t('Reading', 'রিডিং'),
      t('60 min', '৬০ মিনিট'),
      t(
        '3 passages • 40 questions • True/False/Not Given, Matching Headings, Summary Completion',
        '৩টি প্যাসেজ • ৪০টি প্রশ্ন • True/False/Not Given, ম্যাচিং হেডিংস, সামারি কমপ্লিশন',
      ),
    ],
    [
      t('Writing', 'রাইটিং'),
      t('60 min', '৬০ মিনিট'),
      t(
        '2 tasks • Task 1: 20 min, 150+ words • Task 2: 40 min, 250+ words, weighted 2×',
        '২টি টাস্ক • টাস্ক ১: ২০ মিনিট, ১৫০+ শব্দ • টাস্ক ২: ৪০ মিনিট, ২৫০+ শব্দ, ২ গুণ গুরুত্ব',
      ),
    ],
    [
      t('Speaking', 'স্পিকিং'),
      t('11–14 min', '১১–১৪ মিনিট'),
      t(
        '3 parts • Part 1 introduction • Part 2 cue card (1 min prep + 2 min talk) • Part 3 discussion',
        '৩টি পার্ট • পার্ট ১ পরিচিতি • পার্ট ২ কিউ কার্ড (১ মিনিট প্রস্তুতি + ২ মিনিট বক্তব্য) • পার্ট ৩ আলোচনা',
      ),
    ],
  ];
  const conv: Array<[string, string]> = [
    ['23/40', '6.0'],
    ['30/40', '7.0'],
    ['35/40', '8.0'],
    ['39/40', '9.0'],
  ];
  return (
    <section id="how-ielts-works" className="w-full border-t border-slate-200 bg-white px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-2 text-center">
          <h2 className={`text-3xl font-extrabold sm:text-4xl ${NAVY}`}>
            {t('How the Official IELTS™ Exam Works', 'অফিশিয়াল IELTS™ পরীক্ষা যেভাবে কাজ করে')}
          </h2>
          <p className="mx-auto max-w-2xl text-slate-600">
            {t('Academic vs. General Training, the four sections, and how bands are scored.', 'অ্যাকাডেমিক বনাম জেনারেল ট্রেনিং, চারটি সেকশন এবং ব্যান্ড স্কোর কীভাবে হয়।')}
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {modules.map(([k, v]) => (
            <div key={k} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h3 className={`text-lg font-bold ${NAVY}`}>{k}</h3>
              <p className="mt-1 text-sm text-slate-700">{v}</p>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="bg-slate-50 px-4 py-2 text-left font-semibold text-slate-700">
              {t('Four test sections • about 2 hours 45 minutes in total', 'চারটি সেকশন • মোট প্রায় ২ ঘণ্টা ৪৫ মিনিট')}
            </caption>
            <thead className="bg-[#005A70] text-white">
              <tr>
                <th scope="col" className="px-4 py-3">{t('Section', 'সেকশন')}</th>
                <th scope="col" className="px-4 py-3">{t('Time', 'সময়')}</th>
                <th scope="col" className="px-4 py-3">{t('Format', 'ফরম্যাট')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {sections.map(([s, m, d]) => (
                <tr key={s}>
                  <th scope="row" className={`px-4 py-3 font-semibold ${NAVY}`}>{s}</th>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">{m}</td>
                  <td className="px-4 py-3 text-slate-700">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
          <h3 className={`text-lg font-bold ${NAVY}`}>
            {t('Band Scores (0.0–9.0) and CEFR', 'ব্যান্ড স্কোর (০.০–৯.০) ও CEFR')}
          </h3>
          <p className="mt-1 text-sm text-slate-700">
            {t(
              'Bands run from 0.0 to 9.0 and map roughly to CEFR levels B1 (about Band 4.0–5.0) through C2 (Band 8.5–9.0). Your overall band is the average of the four skills, rounded to the nearest 0.5.',
              'ব্যান্ড ০.০ থেকে ৯.০ পর্যন্ত এবং মোটামুটি CEFR B1 (প্রায় ব্যান্ড ৪.০–৫.০) থেকে C2 (ব্যান্ড ৮.৫–৯.০) এর সমতুল্য। ওভারঅল ব্যান্ড হলো চার স্কিলের গড়, নিকটতম ০.৫-এ রাউন্ড করা।',
            )}
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {conv.map(([raw, band]) => (
              <li key={raw} className="rounded-md border border-slate-200 bg-white p-3 text-center">
                <span className="block text-sm text-slate-600">{t('Listening/Reading', 'লিসেনিং/রিডিং')} {raw}</span>
                <span className={`block text-lg font-bold ${NAVY}`}>{t('Band', 'ব্যান্ড')} {band}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            {t(
              'Approximate Academic Listening/Reading conversion; exact thresholds vary by test version.',
              'অ্যাকাডেমিক লিসেনিং/রিডিং-এর আনুমানিক রূপান্তর; টেস্ট ভার্সনভেদে সঠিক সীমা ভিন্ন হতে পারে।',
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
