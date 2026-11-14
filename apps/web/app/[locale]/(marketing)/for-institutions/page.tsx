/** @purpose Institutional partnerships, bulk seat licensing, and campus cohort analytics page (P2.6.1 Bilingual) */
import React from 'react';
import { brand } from '@lumen/config';
import { Badge, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import {
  GraduationCap,
  Users,
  BarChart3,
  Award,
} from 'lucide-react';
import { InstitutionalInquiryForm } from './institutional-inquiry-form';

export const metadata = {
  title: `For Universities, Colleges & Corporate Cohorts | বিশ্ববিদ্যালয় ও প্রতিষ্ঠানের জন্য | ${brand.name}`,
  description: `Partner with ${brand.name} for bulk seat licensing, standardized GRE/IELTS diagnostic assessments, campus cohort analytics, and corporate upskilling in Bangladesh.`,
};

export default async function ForInstitutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBn = locale === 'bn';
  const brandDisplayName = isBn ? 'লুমেন একাডেমি' : brand.name;

  return (
    <div className="flex flex-col items-center" data-locale={locale}>
      {/* Hero Header */}
      <section className="w-full border-b border-border/40 bg-surface/40 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl text-center space-y-5">
          <Badge variant="outline" className="border-accent text-accent gap-1.5 px-3 py-1 font-medium">
            <GraduationCap className="h-4 w-4" />
            {isBn
              ? 'প্রাতিষ্ঠানিক পার্টনারশিপ ও ক্যাম্পাস কোহর্ট'
              : 'Institutional Partnerships & Campus Cohorts'}
          </Badge>

          <h1 className="text-fg text-3xl font-extrabold tracking-tight sm:text-5xl max-w-3xl mx-auto leading-tight">
            {isBn
              ? 'বৈশ্বিক স্কলারশিপ অর্জনে আপনার প্রতিষ্ঠানের সকল শিক্ষার্থীকে সক্ষম করে তুলুন'
              : 'Empower Your Entire Student Body to Win Global Scholarships'}
          </h1>

          <p className="text-fg-muted mx-auto max-w-2xl text-base sm:text-lg leading-relaxed">
            {isBn
              ? `বাংলাদেশের শীর্ষস্থানীয় বিশ্ববিদ্যালয়, বিভাগ এবং শিক্ষা প্রতিষ্ঠানগুলো বাল্ক সিট লাইসেন্সিং, ক্যাম্পাস-ব্যাপী ডায়াগনস্টিক মূল্যায়ন এবং এন্টারপ্রাইজ কোহর্ট অ্যানালিটিক্সের জন্য ${brandDisplayName}-এর সাথে অংশীদারিত্ব করে।`
              : `Leading universities, departments, and educational organizations in Bangladesh partner with ${brand.name} for bulk seat licensing, campus-wide diagnostic baseline screening, and enterprise cohort analytics.`}
          </p>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="w-full max-w-6xl px-4 py-16 sm:py-20 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            {isBn
              ? `কেন শিক্ষা প্রতিষ্ঠানগুলো ${brandDisplayName} বেছে নেয়`
              : `Why Academic Institutions Choose ${brand.name}`}
          </h2>
          <p className="text-fg-muted text-sm max-w-xl mx-auto">
            {isBn
              ? 'আপনার ক্যারিয়ার সেন্টার, উচ্চশিক্ষা সেল বা কর্পোরেট বিভাগের শিক্ষার্থীদের অগ্রগতি নিরীক্ষণের জন্য প্রয়োজনীয় সকল এন্টারপ্রাইজ সুবিধা।'
              : 'Everything your career center, study-abroad cell, or corporate department needs to monitor student progress with enterprise reliability.'}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <Card className="border-border bg-surface transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-accent/10 text-accent mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">
                {isBn ? 'বাল্ক সিট লাইসেন্সিং' : 'Bulk Seat Licensing'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-fg-muted text-sm space-y-2">
              <p>
                {isBn
                  ? 'বিভাগীয় ক্রয়ের জন্য ভ্যাট-সম্মত প্রাতিষ্ঠানিক চালানসহ (মূসক-৬.৩ ভ্যাট রসিদ) বিশেষ ডিসকাউন্ট মূল্য।'
                  : 'Volume discounted pricing with tax-compliant institutional invoicing (Mushak-6.3 VAT receipts) for departmental procurement.'}
              </p>
              <p className="text-xs text-fg-subtle">
                {isBn
                  ? 'অর্গানাইজেশন অ্যাডমিন পোর্টালের মাধ্যমে তাৎক্ষণিক CSV রোস্টার অনবোর্ডিং এবং এক-ক্লিকে লাইসেন্স বরাদ্দ।'
                  : 'Instant roster CSV onboarding and single-click license assignment via Organization Admin portal.'}
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-border bg-surface transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-accent/10 text-accent mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                <BarChart3 className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">
                {isBn ? 'অর্গ অ্যাডমিন কোহর্ট অ্যানালিটিক্স' : 'Org Admin Cohort Analytics'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-fg-muted text-sm space-y-2">
              <p>
                {isBn
                  ? 'শিক্ষার্থীদের অধ্যয়নের সময়, মক টেস্ট সম্পন্ন করার হার এবং সম্ভাব্য জিআরই/আইইএলটিএস স্কোর ট্র্যাক করার ডেডিকেটেড ড্যাশবোর্ড।'
                  : 'Dedicated department dashboard tracking student study hours, mock exam completion rates, and predicted GRE/IELTS score distributions.'}
              </p>
              <p className="text-xs text-fg-subtle">
                {isBn
                  ? 'অ্যাক্রেডিটেশন রিপোর্ট এবং স্কলারশিপ কমিটির জন্য সমন্বিত CSV পারফরম্যান্স বেঞ্চমার্ক এক্সপোর্ট করুন।'
                  : 'Export aggregated CSV performance benchmarks for accreditation reports and scholarship committees.'}
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border-border bg-surface transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-accent/10 text-accent mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                <Award className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">
                {isBn ? 'প্রক্টরড ডায়াগনস্টিক মূল্যায়ন' : 'Proctored Diagnostics'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-fg-muted text-sm space-y-2">
              <p>
                {isBn
                  ? 'আমাদের ক্যালিব্রেটেড কম্পিউটার-ভিত্তিক টেস্ট ইঞ্জিনের মাধ্যমে ক্যাম্পাস-ব্যাপী স্কলারশিপ অ্যাপটিটিউড স্ক্রিনিং পরিচালনা করুন।'
                  : 'Conduct campus-wide scholarship aptitude screenings with our calibrated Computer-Based Test engine.'}
              </p>
              <p className="text-xs text-fg-subtle">
                {isBn
                  ? 'সাইকোমেট্রিকভাবে ক্যালিব্রেটেড Rasch/IRT অ্যাবিলিটি রেটিংয়ের সাহায্যে মেধাবী শিক্ষার্থীদের শুরুতেই শনাক্ত করুন।'
                  : 'Identify high-potential scholars early with psychometrically calibrated Rasch/IRT ability ratings.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Inquiry Form Section */}
      <section className="w-full max-w-4xl px-4 pb-20">
        <InstitutionalInquiryForm locale={isBn ? 'bn' : 'en'} />
      </section>
    </div>
  );
}
