/** @purpose Split-screen Sign-up registration page (BUG-11, P2.6.1 Bilingual) */
import { Suspense } from 'react';
import { brand } from '@lumen/config';
import { AuthForm } from '../_components/AuthForm';

export const metadata = {
  title: `Create Account | অ্যাকাউন্ট তৈরি করুন | ${brand.name}`,
  description: `Create your ${brand.name} account to claim your free diagnostic and 2 AI evaluation credits.`,
};

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBn = locale === 'bn';

  return (
    <div className="w-full" data-layout="split-screen-auth" data-locale={locale}>
      <Suspense
        fallback={
          <div className="p-6 text-center text-sm">
            {isBn ? 'সাইন-আপ পেজ লোড হচ্ছে...' : 'Loading sign-up...'}
          </div>
        }
      >
        <AuthForm mode="sign-up" locale={isBn ? 'bn' : 'en'} />
      </Suspense>
    </div>
  );
}
