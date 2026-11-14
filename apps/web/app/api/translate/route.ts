/** @purpose LaTeX-safe live Google Translate API route with in-memory + dictionary caching */
import { NextResponse, type NextRequest } from 'next/server';
import { translateText } from '@lumen/core';

interface TranslateRequestPayload {
  texts: string[];
  targetLocale: string;
}

function parseTranslateRequest(body: unknown): TranslateRequestPayload | null {
  if (!body || typeof body !== 'object') return null;
  const record = body as Record<string, unknown>;
  if (!Array.isArray(record.texts) || record.texts.length === 0 || record.texts.length > 50) {
    return null;
  }
  const texts: string[] = [];
  for (const item of record.texts) {
    if (typeof item !== 'string' || item.length > 5000) return null;
    texts.push(item);
  }
  const rawLocale = record.targetLocale;
  const targetLocale =
    typeof rawLocale === 'string' && rawLocale.trim().length >= 2 && rawLocale.trim().length <= 10
      ? rawLocale.trim()
      : 'bn';
  return { texts, targetLocale };
}

const MAX_CACHE_ENTRIES = 2000;
const translationCache = new Map<string, string>();

function setCache(key: string, value: string) {
  if (translationCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = translationCache.keys().next().value;
    if (oldestKey !== undefined) {
      translationCache.delete(oldestKey);
    }
  }
  translationCache.set(key, value);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const parsed = parseTranslateRequest(body);
  if (!parsed) {
    return NextResponse.json(
      { error: 'Validation failed: expected { texts: string[] (1..50), targetLocale?: string }' },
      { status: 400 }
    );
  }

  const { texts, targetLocale } = parsed;

  if (targetLocale === 'en') {
    return NextResponse.json({ translations: texts });
  }

  const translations = await Promise.all(
    texts.map(async (text: string) => {
      if (!text.trim()) return text;
      const cacheKey = `${targetLocale}:${text}`;
      const cached = translationCache.get(cacheKey);
      if (cached !== undefined) return cached;

      const translated = await translateText(text, targetLocale, {
        enableLiveTranslation: true,
      });
      setCache(cacheKey, translated);
      return translated;
    })
  );

  return NextResponse.json({ translations });
}
