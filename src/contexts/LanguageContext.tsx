'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import en from '@/locales/en.json';

type Locale = 'en';

const translations: Record<Locale, Record<string, any>> = {
  en: en as Record<string, any>,
};

const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
} | null>(null);

function getNested(obj: any, path: string): string | undefined {
  const keys = path.split('.');
  let current: any = obj;
  for (const key of keys) {
    current = current?.[key];
    if (current === undefined) return undefined;
  }
  return typeof current === 'string' ? current : undefined;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const t = useCallback(
    (key: string) => getNested(translations[locale], key) ?? key,
    [locale]
  );
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      locale: 'en' as Locale,
      setLocale: () => {},
      t: (key: string) => key,
    };
  }
  return ctx;
}
