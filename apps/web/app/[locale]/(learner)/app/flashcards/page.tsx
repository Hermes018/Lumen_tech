/** @purpose Flashcards route alias redirecting to FSRS Vocab Hub (/app/vocab) preserving active locale */
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export default async function FlashcardsRedirectPage() {
  const locale = await getLocale();
  redirect(locale === 'bn' ? '/bn/app/vocab' : '/app/vocab');
}
