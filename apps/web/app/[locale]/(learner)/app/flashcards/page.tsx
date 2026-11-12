/** @purpose Flashcards route alias redirecting to FSRS Vocab Hub (/app/vocab) */
import { redirect } from 'next/navigation';

export default function FlashcardsRedirectPage() {
  redirect('/app/vocab');
}
