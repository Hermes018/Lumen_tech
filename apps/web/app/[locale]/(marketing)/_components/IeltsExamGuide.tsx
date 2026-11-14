/** @purpose Bilingual "How the Official IELTS Exam Works" guide with Swiss grid hairline borders and rounded-md geometry (M2.8-B) */
const NAVY = 'text-[#001E42]';

export function IeltsExamGuide({ isBn }: { isBn: boolean }) {
  const t = (en: string, bn: string): string => (isBn ? bn : en);
  const modules: Array<[string, string]> = [
    [
      t('IELTS™ Academic', 'আইইএলটিএস অ্যাকাডেমিক'),
      t(
        'For university degrees in the UK, USA, Canada, Australia and Europe, and for professional registration.',
        'যুক্তরাজ্য, যুক্তরাষ্ট্র, কানাডা, অস্ট্রেলিয়া ও ইউরোপে বিশ্ববিদ্যালয়ে ডিগ্রি এবং পেশাগত নিবন্ধনের জন্য।',
      ),
    ],
    [
      t('IELTS™ General Training', 'আইইএলটিএস জেনারেল ট্রেনিং'),
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
      t(
        '4 recordings • 40 questions • played once only',
        '৪টি রেকর্ডিং • ৪০টি প্রশ্ন • শুধু একবার বাজানো হয়',
      ),
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
  const conv: Array<[string, string, string]> = [
    ['39–40', '39–40', '9.0'],
    ['37–38', '37–38', '8.5'],
    ['35–36', '35–36', '8.0'],
    ['33–34', '32–34', '7.5'],
    ['30–32', '30–31', '7.0'],
    ['27–29', '26–29', '6.5'],
    ['23–26', '23–25', '6.0'],
    ['19–22', '18–22', '5.5'],
    ['15–18', '16–17', '5.0'],
  ];
  return (
    <section
      id="how-ielts-works"
      className="w-full border-b border-slate-200 bg-white px-4 py-16 sm:py-20 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8 space-y-10">
        <header className="space-y-2.5 text-left">
          <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#001E42]">
            {t('01 • Official Exam Format & Band Table', '০১ • অফিশিয়াল পরীক্ষার কাঠামো ও ব্যান্ড টেবিল')}
          </div>
          <h2 className={`text-3xl font-extrabold sm:text-4xl ${NAVY}`}>
            {t('How the Official IELTS™ Exam Works', 'অফিশিয়াল IELTS™ পরীক্ষা যেভাবে কাজ করে')}
          </h2>
          <p className="max-w-2xl text-slate-600 text-sm sm:text-base">
            {t(
              'Academic vs. General Training, the four computer-delivered test sections, and how 0.0–9.0 bands are calculated.',
              'অ্যাকাডেমিক বনাম জেনারেল ট্রেনিং, চারটি সেকশন এবং ব্যান্ড স্কোর কীভাবে হয়।',
            )}
          </p>
        </header>

        {/* Exposed 2-Column Hairline Grid */}
        <div className="rounded-md border border-slate-200 bg-slate-50 divide-y md:divide-y-0 md:divide-x divide-slate-200 grid grid-cols-1 md:grid-cols-2">
          {modules.map(([k, v]) => (
            <div key={k} className="p-6 text-left">
              <h3 className={`text-lg font-extrabold ${NAVY}`}>{k}</h3>
              <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">{v}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="bg-slate-50 px-5 py-2.5 text-left font-mono text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200">
              {t(
                'Four test sections • about 2 hours 45 minutes in total',
                'চারটি সেকশন • মোট প্রায় ২ ঘণ্টা ৪৫ মিনিট',
              )}
            </caption>
            <thead className="bg-[#001E42] text-white text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-bold">
                  {t('Section', 'সেকশন')}
                </th>
                <th scope="col" className="px-5 py-3.5 font-bold">
                  {t('Time', 'সময়')}
                </th>
                <th scope="col" className="px-5 py-3.5 font-bold">
                  {t('Format', 'ফরম্যাট')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {sections.map(([s, m, d]) => (
                <tr key={s} className="hover:bg-slate-50/80">
                  <th scope="row" className={`px-5 py-4 font-bold whitespace-nowrap ${NAVY}`}>
                    {s}
                  </th>
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-bold text-slate-900">
                    {m}
                  </td>
                  <td className="px-5 py-4 text-slate-700 leading-relaxed">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-6 text-left space-y-4">
          <div>
            <h3 className={`text-lg font-extrabold ${NAVY}`}>
              {t('Band Scores (0.0–9.0) and CEFR', 'ব্যান্ড স্কোর (০.০–৯.০) ও CEFR')}
            </h3>
            <p className="mt-1 text-sm text-slate-700">
              {t(
                'Bands run from 0.0 to 9.0 and map roughly to CEFR levels B1 (about Band 4.0–5.0) through C2 (Band 8.5–9.0). Your overall band is the average of the four skills, rounded to the nearest 0.5.',
                'ব্যান্ড ০.০ থেকে ৯.০ পর্যন্ত এবং মোটামুটি CEFR B1 (প্রায় ব্যান্ড ৪.০–৫.০) থেকে C2 (ব্যান্ড ৮.৫–৯.০) এর সমতুল্য। ওভারঅল ব্যান্ড হলো চার স্কিলের গড়, নিকটতম ০.৫-এ রাউন্ড করা।',
              )}
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {conv.map(([readingRaw, listeningRaw, band]) => (
              <li
                key={band}
                className="rounded-md border border-slate-200 bg-white p-3.5 text-left"
              >
                <span className={`block font-mono text-base font-extrabold ${NAVY}`}>
                  {t('Band', 'ব্যান্ড')} {band}
                </span>
                <span className="mt-1 block font-mono text-xs text-slate-600">
                  {t('Reading:', 'রিডিং:')} {readingRaw}/40 • {t('Listening:', 'লিসেনিং:')}{' '}
                  {listeningRaw}/40
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500">
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
