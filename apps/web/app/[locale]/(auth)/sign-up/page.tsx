/** @purpose Sign-up registration page */
import { Suspense } from 'react';
import { brand } from '@lumen/config';
import { AuthForm } from '../_components/AuthForm';

export const metadata = {
  title: `Create Account | ${brand.name}`,
  description: `Create your ${brand.name} account to claim your free diagnostic and 2 AI evaluation credits.`,
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm">Loading sign-up...</div>}>
      <AuthForm mode="sign-up" />
    </Suspense>
  );
}
