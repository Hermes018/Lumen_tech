/** @purpose Scholar CD-IELTS & GRE Typing Speed & Accuracy Studio workspace (/app/typing) */
'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { TypingPracticeEngine } from '@/src/components/typing/TypingPracticeEngine';
import {
  WorkspaceContainer,
  WorkspaceHeader,
} from '@/src/components/ui/WorkspacePrimitives';

export default function ScholarTypingStudioPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  return (
    <WorkspaceContainer>
      <WorkspaceHeader
        title={
          isBn
            ? 'সিডি-আইইএলটিএস ও জিআরই টাইপিং স্টুডিও'
            : 'CD-IELTS & GRE® Typing Speed & Accuracy Studio'
        }
        subtitle={
          isBn
            ? 'টাস্ক ১ (১৫০ শব্দ), টাস্ক ২ (২৫০ শব্দ), লিসেনিং বানান সতর্কতা এবং জিআরই ইস্যু প্রবন্ধের ওপর নির্ভুল গতি তৈরি করুন।'
            : 'Build timed fluency across IELTS Task 1 data reports, Band 8.5 Task 2 prose, Listening spelling traps, and GRE AWA arguments.'
        }
        metaText={
          isBn
            ? 'কীবোর্ড শর্টকাট: তাৎক্ষণিক রিস্টার্টের জন্য Tab + Enter (অথবা Escape) চাপুন'
            : 'Keyboard: Press Tab + Enter (or Escape) to reset cleanly in <16ms'
        }
        primaryAction={{
          label: isBn ? '৪-স্কিল সিডি-আইইএলটিএস সিমুলেটর →' : 'Launch CD-IELTS Simulator →',
          href: '/exam/ielts-preview',
        }}
        secondaryAction={{
          label: isBn ? 'আইইএলটিএস ট্র্যাকে ফিরুন' : '← Back to IELTS™ Track',
          href: '/app/ielts',
        }}
      />

      <TypingPracticeEngine variant="learner" initialCorpus="ielts-task2-band8" />
    </WorkspaceContainer>
  );
}
