/** @purpose Public CD-IELTS & GRE Typing Speed Test interactive tool (/tools/ielts-typing-test) */
import type { Metadata } from 'next';
import { brand } from '@lumen/config';
import { buildLocalizedMetadata } from '@/src/lib/seo';
import { TypingPracticeEngine } from '@/src/components/typing/TypingPracticeEngine';
import {
  WorkspaceContainer,
  WorkspaceHeader,
} from '@/src/components/ui/WorkspacePrimitives';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    pathname: '/tools/ielts-typing-test',
    titleEn: `CD-IELTS Typing Speed & Accuracy Test | ${brand.name}`,
    titleBn: `সিডি-আইইএলটিএস টাইপিং স্পিড ও নির্ভুলতা টেস্ট | ${brand.nameBn}`,
    descriptionEn:
      'Measure your Net WPM, character-level accuracy, and 400-word CD-IELTS Writing readiness across Academic Task 1, Task 2, Listening spelling traps, and GRE AWA.',
    descriptionBn:
      'আইইএলটিএস টাস্ক ১, টাস্ক ২, লিসেনিং বানান সতর্কতা এবং জিআরই এডব্লিউএ প্যাসেজে আপনার নেট WPM ও ৪০০-শব্দের প্রস্তুতি যাচাই করুন।',
  });
}

export default async function PublicIeltsTypingTestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBn = locale === 'bn';

  return (
    <main className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)]">
      <WorkspaceContainer>
        <WorkspaceHeader
          title={
            isBn
              ? 'সিডি-আইইএলটিএস টাইপিং স্পিড ও নির্ভুলতা টেস্ট'
              : 'CD-IELTS & GRE® Typing Speed & Accuracy Test'
          }
          subtitle={
            isBn
              ? 'কম্পিউটার-ভিত্তিক আইইএলটিএস রাইটিং (৪০০ শব্দ) এবং লিসেনিং বানান নির্ভুলতার জন্য আপনার বাস্তব টাইপিং গতি যাচাই করুন।'
              : 'Benchmark your real-time Net WPM, character-level accuracy, and 400-word CD-IELTS Writing readiness across exam-authentic passages.'
          }
          metaText={
            isBn
              ? 'অ্যাকাউন্ট ছাড়াই বিনামূল্যে অনুশীলন করুন · প্রতি সেকেন্ড WPM ও ত্রুটি বিশ্লেষণসহ'
              : 'Free interactive benchmark · Includes per-second WPM telemetry & missed-word remediation'
          }
          primaryAction={{
            label: isBn ? 'ফ্রি স্কলার অ্যাকাউন্ট খুলুন →' : 'Create Free Scholar Account →',
            href: '/sign-up',
          }}
          secondaryAction={{
            label: isBn ? 'আইইএলটিএস স্প্লিট-স্ক্রিন সিমুলেটর' : 'Try CD-IELTS Simulator',
            href: '/exam/ielts-preview',
          }}
        />

        <TypingPracticeEngine variant="public" initialCorpus="ielts-task2-band8" />
      </WorkspaceContainer>
    </main>
  );
}
