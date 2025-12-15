/**
 * Translation type definitions
 * These types ensure type-safe translation key access
 */

/**
 * Category translation keys
 * Must match keys in common.json > categories
 */
export type CategoryTranslationKey =
  | 'finance'
  | 'health'
  | 'math'
  | 'conversion'
  | 'timeDate'
  | 'construction'

/**
 * Calculator translation keys
 * Must match keys in common.json > calculator
 */
export type CalculatorTranslationKey = 'percentage' // Add more as calculators are added

/**
 * Helper type guard to check if a string is a valid category key
 */
export function isCategoryTranslationKey(
  key: string
): key is CategoryTranslationKey {
  return [
    'finance',
    'health',
    'math',
    'conversion',
    'timeDate',
    'construction',
  ].includes(key)
}

/**
 * Helper to safely cast category translation keys
 */
export function asCategoryKey(key: string): CategoryTranslationKey {
  if (isCategoryTranslationKey(key)) {
    return key
  }
  throw new Error(`Invalid category translation key: ${key}`)
}
