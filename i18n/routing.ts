import { defineRouting } from "next-intl/routing";

export const locales = [
  "en",
  "es",
  "fr",
  "de",
  "ja",
  "pt",
  "ko",
  "zh",
] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Espanol",
  fr: "Francais",
  de: "Deutsch",
  ja: "Japanese",
  pt: "Portugues",
  ko: "Korean",
  zh: "Chinese",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
});
