/** @purpose Bilingual "GRE vs. IELTS: Which Exam Do You Need?" decision table for /courses (P2.6.3) */
export function ExamChooserGuide({ isBn }: { isBn: boolean }) {
  const t = (en: string, bn: string): string => (isBn ? bn : en);
  const rows: Array<[string, string, string]> = [
    [
      t('IELTS Only', 'শুধু IELTS'),
      t('Undergraduate or most master’s programmes in the UK, Canada, Australia and Europe (Study Abroad)', 'যুক্তরাজ্য, কানাডা, অস্ট্রেলিয়া ও ইউরোপে আন্ডারগ্র্যাড বা অধিকাংশ মাস্টার্স (উচ্চশিক্ষা)'),
      t('IELTS Academic', 'IELTS অ্যাকাডেমিক'),
    ],
    [
      t('GRE + IELTS', 'GRE + IELTS'),
      t('Graduate school, MS/PhD and business programmes in the USA and competitive programmes elsewhere (Study Abroad)', 'যুক্তরাষ্ট্রে গ্র্যাড স্কুল, MS/PhD, বিজনেস প্রোগ্রাম এবং অন্যত্র প্রতিযোগিতামূলক প্রোগ্রাম (উচ্চশিক্ষা)'),
      t('GRE General Test + IELTS Academic', 'GRE জেনারেল টেস্ট + IELTS অ্যাকাডেমিক'),
    ],
    [
      t('IELTS General Training', 'IELTS জেনারেল ট্রেনিং'),
      t('Skilled migration, PR, Canada Express Entry, Australia/UK work visas (Immigration/PR)', 'স্কিলড মাইগ্রেশন, পিআর, কানাডা এক্সপ্রেস এন্ট্রি, অস্ট্রেলিয়া/যুক্তরাজ্য ওয়ার্ক ভিসা (ইমিগ্রেশন/পিআর)'),
      t('IELTS General Training', 'IELTS জেনারেল ট্রেনিং'),
    ],
  ];
  return (
    <section className="w-full border-t border-slate-200 bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl space-y-6">
        <h2 className="text-center text-3xl font-extrabold text-[#001E42]">
          {t('GRE vs. IELTS: Which Exam Do You Need?', 'GRE নাকি IELTS: কোন পরীক্ষা আপনার দরকার?')}
        </h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-[#001E42] text-white">
              <tr>
                <th scope="col" className="px-4 py-3">{t('Your path', 'আপনার পথ')}</th>
                <th scope="col" className="px-4 py-3">{t('Target and goal', 'লক্ষ্য ও উদ্দেশ্য')}</th>
                <th scope="col" className="px-4 py-3">{t('Exam(s) to take', 'যে পরীক্ষা দেবেন')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map(([a, b, c]) => (
                <tr key={a}>
                  <th scope="row" className="px-4 py-3 font-semibold text-[#001E42]">{a}</th>
                  <td className="px-4 py-3 text-slate-700">{b}</td>
                  <td className="px-4 py-3 text-slate-700">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500">
          {t('Always confirm requirements with your target university or immigration authority.', 'সর্বদা আপনার লক্ষ্য বিশ্ববিদ্যালয় বা ইমিগ্রেশন কর্তৃপক্ষের শর্ত যাচাই করুন।')}
        </p>
      </div>
    </section>
  );
}
