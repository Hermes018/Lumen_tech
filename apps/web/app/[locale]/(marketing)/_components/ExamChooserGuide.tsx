/** @purpose Bilingual "GRE vs. IELTS: Which Exam Do You Need?" decision table for /courses with sharp rounded-md Swiss grid borders (M2.8-B) */
export function ExamChooserGuide({ isBn }: { isBn: boolean }) {
  const t = (en: string, bn: string): string => (isBn ? bn : en);
  const rows: Array<[string, string, string]> = [
    [
      t('IELTS Only', 'শুধু IELTS'),
      t(
        'Undergraduate or most master’s programmes in the UK, Canada, Australia and Europe (Study Abroad)',
        'যুক্তরাজ্য, কানাডা, অস্ট্রেলিয়া ও ইউরোপে আন্ডারগ্র্যাড বা অধিকাংশ মাস্টার্স (উচ্চশিক্ষা)',
      ),
      t('IELTS Academic', 'IELTS অ্যাকাডেমিক'),
    ],
    [
      t('GRE + IELTS', 'GRE + IELTS'),
      t(
        'Graduate school, MS/PhD and business programmes in the USA and competitive programmes elsewhere (Study Abroad)',
        'যুক্তরাষ্ট্রে গ্র্যাড স্কুল, MS/PhD, বিজনেস প্রোগ্রাম এবং অন্যত্র প্রতিযোগিতামূলক প্রোগ্রাম (উচ্চশিক্ষা)',
      ),
      t('GRE General Test + IELTS Academic', 'GRE জেনারেল টেস্ট + IELTS অ্যাকাডেমিক'),
    ],
    [
      t('IELTS General Training', 'IELTS জেনারেল ট্রেনিং'),
      t(
        'Skilled migration, PR, Canada Express Entry, Australia/UK work visas (Immigration/PR)',
        'স্কিলড মাইগ্রেশন, পিআর, কানাডা এক্সপ্রেস এন্ট্রি, অস্ট্রেলিয়া/যুক্তরাজ্য ওয়ার্ক ভিসা (ইমিগ্রেশন/পিআর)',
      ),
      t('IELTS General Training', 'IELTS জেনারেল ট্রেনিং'),
    ],
  ];
  return (
    <section className="w-full border-t border-slate-200 bg-white px-4 py-16 mt-16">
      <div className="mx-auto max-w-7xl space-y-6 px-0 sm:px-6 lg:px-8">
        <div className="space-y-2 text-left">
          <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#001E42]">
            {t('Examination Selection Matrix', 'পরীক্ষা নির্বাচন নির্দেশিকা')}
          </div>
          <h2 className="text-2xl lg:text-4xl font-extrabold text-[#001E42]">
            {t('GRE vs. IELTS: Which Exam Do You Need?', 'GRE নাকি IELTS: কোন পরীক্ষা আপনার দরকার?')}
          </h2>
        </div>
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-[#001E42] text-white text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3.5 font-bold">
                  {t('Your path', 'আপনার পথ')}
                </th>
                <th scope="col" className="px-4 py-3.5 font-bold">
                  {t('Target and goal', 'লক্ষ্য ও উদ্দেশ্য')}
                </th>
                <th scope="col" className="px-4 py-3.5 font-bold">
                  {t('Exam(s) to take', 'যে পরীক্ষা দেবেন')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rows.map(([a, b, c]) => (
                <tr key={a} className="hover:bg-slate-50/80">
                  <th scope="row" className="px-4 py-3.5 font-bold text-[#001E42] whitespace-nowrap">
                    {a}
                  </th>
                  <td className="px-4 py-3.5 text-slate-700">{b}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 text-left">
          {t(
            'Always confirm requirements with your target university or immigration authority.',
            'সর্বদা আপনার লক্ষ্য বিশ্ববিদ্যালয় বা ইমিগ্রেশন কর্তৃপক্ষের শর্ত যাচাই করুন।',
          )}
        </p>
      </div>
    </section>
  );
}
