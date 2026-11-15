/** @purpose Clean server redirect from legacy /app/admin path to role-isolated /admin or /app */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { ROLE_COOKIE_NAME, parseWorkspaceRole } from '@/src/lib/role-guard';

export const dynamic = 'force-dynamic';

export default async function LegacyAppAdminRedirectPage() {
  const [cookieStore, locale] = await Promise.all([cookies(), getLocale()]);
  const role = parseWorkspaceRole(cookieStore.get(ROLE_COOKIE_NAME)?.value);
  const prefix = locale === 'bn' ? '/bn' : '';

  if (role === 'scholar') {
    redirect(`${prefix}/app`);
  }

  redirect(`${prefix}/admin`);
}
