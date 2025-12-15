import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

/**
 * Calculator category files to load
 * These are loaded dynamically and merged under the 'calculators' namespace
 */
const CALCULATOR_CATEGORIES = [
  'math',
  'finance',
  'health',
  'conversion',
  'time-date',
  'construction',
] as const

/**
 * Load and merge all translation messages for a locale
 * Combines common.json with category-specific calculator translations
 */
async function loadMessages(locale: string) {
  // Load base common translations
  const common = (await import(`../messages/${locale}/common.json`)).default

  // Load calculator category translations
  const calculatorMessages: Record<string, unknown> = {}

  for (const category of CALCULATOR_CATEGORIES) {
    try {
      const categoryMessages = (
        await import(`../messages/${locale}/calculators/${category}.json`)
      ).default

      // Filter out internal metadata keys (starting with _)
      Object.entries(categoryMessages).forEach(([key, value]) => {
        if (!key.startsWith('_')) {
          calculatorMessages[key] = value
        }
      })
    } catch {
      // Category file doesn't exist yet, skip
      console.warn(
        `Translation file not found: ${locale}/calculators/${category}.json`
      )
    }
  }

  // Merge common with calculator-specific translations
  return {
    ...common,
    calculators: calculatorMessages,
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale from the request
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (
    !locale ||
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: await loadMessages(locale),
    timeZone: 'UTC',
    now: new Date(),
  }
})
