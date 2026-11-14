/** @purpose Full-bleed 50/50 edge-to-edge split-screen Sign-in authentication page (M2.7-B, P2.6.1 Bilingual) */
import { Suspense } from 'react';
import { brand } from '@lumen/config';
import { AuthForm } from '../_components/AuthForm';

export const metadata = {
  title: `Sign In | লগইন করুন | ${brand.name}`,
  description: `Sign in to ${brand.name} to access your courses, section-adaptive mock exams, and analytics.`,
};

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBn = locale === 'bn';

  return (
    <div className="min-h-screen w-full bg-white" data-layout="split-screen-auth" data-locale={locale}>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center p-6 text-center text-sm text-slate-600">
            {isBn ? 'লগইন পেজ লোড হচ্ছে...' : 'Loading sign-in...'}
          </div>
        }
      >
        <AuthForm mode="sign-in" locale={isBn ? 'bn' : 'en'} />
      </Suspense>
    </div>
  );
}
