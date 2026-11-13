/** @purpose Learner onboarding page */
import { Suspense } from 'react';
import { brand } from '@lumen/config';
import { OnboardingClient } from './OnboardingClient';

export const metadata = {
  title: `Onboarding | ${brand.name}`,
  description: `Set your target GRE or IELTS exam date and claim your free AI credits on ${brand.name}.`,
};

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm">Loading onboarding...</div>}>
      <OnboardingClient />
    </Suspense>
  );
}
