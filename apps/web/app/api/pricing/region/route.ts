/** @purpose Geo-IP and regional currency resolution endpoint returning BDT for Bangladesh and USD for International visitors */

import { NextResponse, type NextRequest } from 'next/server';

export function GET(request: NextRequest) {
  const queryCountry = request.nextUrl.searchParams.get('country');
  const rawCountry =
    queryCountry ??
    request.headers.get('x-vercel-ip-country') ??
    request.headers.get('cf-ipcountry') ??
    request.headers.get('x-country-code') ??
    '';

  const normalized = rawCountry.trim().toUpperCase();
  const isBangladesh =
    normalized === '' ||
    normalized === 'BD' ||
    normalized === 'XX' ||
    normalized === 'T1' ||
    normalized === 'LOCAL';

  if (isBangladesh) {
    return NextResponse.json(
      {
        region: 'BD',
        countryCode: normalized || 'BD',
        currency: 'BDT',
        symbol: '৳',
        vatRate: 0.15,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  return NextResponse.json(
    {
      region: 'INTL',
      countryCode: normalized,
      currency: 'USD',
      symbol: '$',
      vatRate: 0,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
