/** @purpose Sign-in authentication page */
import { Suspense } from 'react';
import { brand } from '@lumen/config';
import { AuthForm } from '../_components/AuthForm';

export const metadata = {
  title: `Sign In | ${brand.name}`,
  description: `Sign in to ${brand.name} to access your courses, mock exams, and analytics.`,
};

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm">Loading sign-in...</div>}>
      <AuthForm mode="sign-in" />
    </Suspense>
  );
}
