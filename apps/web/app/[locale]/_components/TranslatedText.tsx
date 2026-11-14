/** @purpose Client-side auto-translation hook and <TranslatedText /> component backed by /api/translate */
'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { MathText } from '@lumen/ui';

const clientTranslationCache = new Map<string, string>();

/**
 * Automatically translates `text` into `targetLocale` via `/api/translate` (with math token safety).
 * Returns `fallbackBn` immediately when `targetLocale === 'bn'` and a pre-authored Bengali string is supplied.
 */
export function useAutoTranslate(
  text: string,
  locale?: string,
  fallbackBn?: string
): { translated: string; isTranslating: boolean } {
  const hookLocale = useLocale();
  const targetLocale = locale ?? hookLocale;
  const cacheKey = `${targetLocale}:${text}`;

  const immediateValue =
    !text || targetLocale === 'en'
      ? text
      : targetLocale === 'bn' && fallbackBn
        ? fallbackBn
        : clientTranslationCache.get(cacheKey);

  const [translated, setTranslated] = useState<string>(immediateValue ?? text);
  const [isTranslating, setIsTranslating] = useState<boolean>(immediateValue === undefined);

  useEffect(() => {
    if (!text || targetLocale === 'en') {
      setTranslated(text);
      setIsTranslating(false);
      return;
    }

    if (targetLocale === 'bn' && fallbackBn) {
      setTranslated(fallbackBn);
      setIsTranslating(false);
      return;
    }

    const cached = clientTranslationCache.get(cacheKey);
    if (cached !== undefined) {
      setTranslated(cached);
      setIsTranslating(false);
      return;
    }

    const controller = new AbortController();
    setIsTranslating(true);

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: [text], targetLocale }),
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { translations?: string[] } | null) => {
        const result = data?.translations?.[0];
        if (result) {
          clientTranslationCache.set(cacheKey, result);
          setTranslated(result);
        } else {
          setTranslated(text);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setTranslated(text);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsTranslating(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [text, targetLocale, fallbackBn, cacheKey]);

  return { translated, isTranslating };
}

export interface TranslatedTextProps {
  text: string;
  locale?: string;
  fallbackBn?: string;
  math?: boolean;
  className?: string;
}

export function TranslatedText({
  text,
  locale,
  fallbackBn,
  math = false,
  className,
}: TranslatedTextProps) {
  const { translated } = useAutoTranslate(text, locale, fallbackBn);

  if (math) {
    return <MathText content={translated} className={className} />;
  }

  return <span className={className}>{translated}</span>;
}
