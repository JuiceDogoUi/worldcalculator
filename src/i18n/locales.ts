export const locales = ['en', 'es', 'fr', 'de', 'pt', 'it'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export interface LocaleConfig {
  code: Locale
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
  currency: string
  dateFormat: string
  numberFormat: Intl.NumberFormatOptions
  flag: string
}

export const localeConfigs: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    flag: '🇺🇸',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    flag: '🇪🇸',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    flag: '🇫🇷',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    currency: 'EUR',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    flag: '🇩🇪',
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    flag: '🇵🇹',
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    direction: 'ltr',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    flag: '🇮🇹',
  },
}
