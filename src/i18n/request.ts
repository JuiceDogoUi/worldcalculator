import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

/**
 * Calculator categories with their calculator slugs
 * Structure: { category: [calculatorSlugs] }
 */
const CALCULATOR_REGISTRY: Record<string, string[]> = {
  finance: ['loan', 'mortgage'],
  math: ['percentage'],
  health: [],
  conversion: [],
  'time-date': [],
  construction: [],
}

/**
 * Load and merge all translation messages for a locale
 * Combines common.json with calculator-level translations
 * Structure: calculators.{category}.{calculatorSlug}
 */
async function loadMessages(locale: string) {
  // Load base common translations
  const common = (await import(`../messages/${locale}/common.json`)).default

  // Load calculator translations at calculator level
  const calculatorMessages: Record<string, Record<string, unknown>> = {}

  for (const [category, calculators] of Object.entries(CALCULATOR_REGISTRY)) {
    // Convert category to camelCase for namespace key (e.g., 'time-date' -> 'timeDate')
    const categoryKey = category.replace(/-([a-z])/g, (_, letter) =>
      letter.toUpperCase()
    )

    // Initialize category namespace
    calculatorMessages[categoryKey] = {}

    // Load each calculator's translations
    for (const calculator of calculators) {
      try {
        const calcMessages = (
          await import(
            `../messages/${locale}/calculators/${category}/${calculator}.json`
          )
        ).default

        calculatorMessages[categoryKey][calculator] = calcMessages
      } catch {
        // Calculator translation file doesn't exist yet, skip silently
      }
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
