/** @purpose Institutional UI primitives gallery page (/dev/ui) demonstrating all 17 primitives without raw layout classes */
import { getLocale } from 'next-intl/server';
import {
  Breadcrumb,
  Button,
  CalloutNotice,
  CtaBand,
  Disclosure,
  Heading,
  HeroBand,
  LumenSparkMotif,
  MediaColumns,
  PlaceholderImage,
  Section,
  SideHeadingBlocks,
  SplitFeature,
  StatRow,
  StepRow,
  SubBar,
  Tabs,
} from '@/src/components/ui/primitives';

export default async function DevUiGalleryPage({
  params,
}: {
  params?: Promise<{ locale?: string }>;
} = {}) {
  const resolvedParams = params ? await params : undefined;
  const locale = resolvedParams?.locale ?? (await getLocale());

  return (
    <>
      <Breadcrumb
        locale={locale}
        items={[
          { label: 'Home', href: '/' },
          { label: 'UI Primitives Gallery' },
        ]}
      />

      <HeroBand
        locale={locale}
        title="Institutional UI Primitives Gallery"
        body="All seventeen closed primitives rendered in open whitespace with zero bordered content cards and verified bilingual tokens."
        ctaLabel="Explore Courses"
        ctaHref="/courses"
        secondaryLinkLabel="View Pricing"
        secondaryLinkHref="/pricing"
        photoSlot="hero-home"
        frame="blocks"
        tone="warm"
      />

      <SubBar
        locale={locale}
        items={[
          { label: 'Overview', href: '/dev/ui', active: true },
          { label: 'GRE Track', href: '/gre' },
          { label: 'IELTS Track', href: '/ielts' },
        ]}
      />

      <Section tone="white" id="stats">
        <StatRow
          stats={[
            { value: '1h 58m', caption: 'Computer-Delivered GRE Format', verified: true },
            { value: '4 Skills', caption: 'IELTS Listening, Reading, Writing & Speaking', verified: true },
            { value: '1,500+', caption: 'Bilingual Active-Recall Vocabulary Cards', verified: true },
            { value: '15% VAT', caption: 'Official Mushak 6.3 Invoice Included', verified: true },
          ]}
        />
      </Section>

      <Section tone="tint" id="steps">
        <StepRow
          title="Four Steps to Exam Readiness"
          intro="Start with a baseline diagnostic and follow a structured practice cadence."
          locale={locale}
          steps={[
            {
              num: '1',
              title: 'Take Baseline Diagnostic',
              body: 'Complete a timed 20-minute diagnostic to measure your starting band or GRE score.',
              linkLabel: 'Start Diagnostic',
              linkHref: '/diagnostic',
            },
            {
              num: '2',
              title: 'Select Your Exam Track',
              body: 'Choose GRE, IELTS Academic, or IELTS General Training based on your destination.',
              linkLabel: 'Browse Courses',
              linkHref: '/courses',
            },
            {
              num: '3',
              title: 'Practice Adaptive Mocks',
              body: 'Train inside a computer-delivered workbench matching official test timing.',
              linkLabel: 'See GRE Format',
              linkHref: '/gre',
            },
            {
              num: '4',
              title: 'Review Rubric Feedback',
              body: 'Inspect detailed writing and speaking feedback before your real test date.',
              linkLabel: 'View Help Center',
              linkHref: '/help',
            },
          ]}
        />
      </Section>

      <Section tone="white" id="columns">
        <MediaColumns
          title="Flagship Exam Tracks"
          intro="Borderless editorial columns with sharp 4:3 frames and progressive syllabus disclosure."
          columns={3}
          locale={locale}
          items={[
            {
              photoSlot: 'track-gre',
              title: 'GRE Core & Plus',
              href: '/gre',
              meta: '৳ 4,490 – ৳ 5,990 • 6 Months',
              body: 'Section-adaptive mocks, 1,500+ FSRS vocabulary cards, and analytical writing reviews.',
              links: [{ label: 'Explore GRE', href: '/gre' }],
              disclosureTitle: 'View GRE syllabus modules',
              disclosureItems: [
                'Quantitative Reasoning & Trap Forensics',
                'Verbal Reasoning & Text Completion',
                'Analytical Writing Issue Essay Rubric',
              ],
            },
            {
              photoSlot: 'track-ielts-ac',
              title: 'IELTS Academic Complete',
              href: '/ielts',
              meta: '৳ 4,990 • 4 Months',
              body: 'Split-pane Academic Reading, Listening, Task 1 data charts, and Speaking evaluation.',
              links: [{ label: 'Explore IELTS', href: '/ielts' }],
              disclosureTitle: 'View Academic modules',
              disclosureItems: [
                'Split-Pane Academic Reading Workbench',
                'Writing Task 1 Charts & Task 2 Essays',
                'Structured Speaking Mock Interviews',
              ],
            },
            {
              photoSlot: 'track-ielts-gt',
              title: 'IELTS General Training',
              href: '/ielts',
              meta: '৳ 4,290 • 3 Months',
              body: 'Workforce Reading passages and Task 1 letter writing built for CLB 9+ targets.',
              links: [{ label: 'View Pricing', href: '/pricing' }],
              disclosureTitle: 'View GT modules',
              disclosureItems: [
                'Everyday & Workplace Reading Sections',
                'Formal & Semi-Formal Task 1 Letters',
                'Full-Length Timed CBT Mocks',
              ],
            },
          ]}
        />
      </Section>

      <Section tone="warm" id="split">
        <SplitFeature
          photoSlot="split-diagnostic"
          photoSide="left"
          backdrop="orange"
          title="Benchmark Your Starting Score"
          body="Take a free 20-minute computer-based diagnostic before enrolling so your study plan targets the exact skills that raise your score."
          ctaLabel="Take Free Diagnostic"
          ctaHref="/exam/diagnostic"
          locale={locale}
        />
      </Section>

      <Section tone="white" id="side-blocks">
        <SideHeadingBlocks
          title="Transparent Policies & Support"
          intro="Clear exam scheduling, local BDT tuition, and official VAT invoices."
          ctaLabel="Visit Help Center"
          ctaHref="/help"
          locale={locale}
          blocks={[
            {
              icon: 'currency',
              title: 'Transparent BDT Tuition',
              body: 'Pay once in BDT via bKash, Nagad, or card with an official Mushak 6.3 VAT invoice.',
              linkLabel: 'Compare Plans',
              linkHref: '/pricing',
            },
            {
              icon: 'clock',
              title: 'Self-Paced Study Windows',
              body: 'Access full-length mocks and vocabulary decks on your own schedule across 3 to 12 months.',
            },
            {
              icon: 'shield',
              title: 'Verified Rubric Scoring',
              body: 'All practice scores are clearly labelled as estimated and calibrated against official rubrics.',
            },
          ]}
        />
      </Section>

      <Section tone="tint" id="interactive">
        <Heading level={2}>Interactive Disclosure, Tabs & Tokens</Heading>
        <LumenSparkMotif />
        <Tabs
          tabs={[
            {
              id: 'buttons',
              label: 'Buttons & Motif',
              content: (
                <CalloutNotice
                  title="Single Allowed Notice Box"
                  body="CalloutNotice is the only soft-lavender notice box permitted on a marketing page."
                  linkLabel="Read Pricing Details"
                  linkHref="/pricing"
                  locale={locale}
                />
              ),
            },
            {
              id: 'media',
              label: 'Standalone Media',
              content: <PlaceholderImage slot="mega-courses" aspect="16:10" locale={locale} />,
            },
            {
              id: 'faq',
              label: 'FAQ Disclosure',
              content: (
                <Disclosure summary="How does the 15% VAT invoice work?">
                  <p>Every paid enrollment generates an official Mushak 6.3 VAT invoice in BDT.</p>
                </Disclosure>
              ),
            },
          ]}
        />
        <Button href="/courses" locale={locale} variant="outline">
          Browse All Tracks
        </Button>
      </Section>

      <CtaBand
        locale={locale}
        title="Ready to Start Your Preparation?"
        body="Begin with a free diagnostic or choose a full GRE or IELTS track today."
        ctaLabel="View Tuition Plans"
        ctaHref="/pricing"
      />
    </>
  );
}
