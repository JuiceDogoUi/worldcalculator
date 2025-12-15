import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'
import { locales, defaultLocale } from './locales'

export const routing = defineRouting({
  // All supported locales
  locales: locales,

  // Default locale
  defaultLocale: defaultLocale,

  // Locale prefix strategy
  // 'always' = /en/calculators, /es/calculators
  localePrefix: 'always',
})

// Export navigation utilities
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
