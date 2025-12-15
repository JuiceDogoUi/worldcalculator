/**
 * Locale-aware formatting utilities
 * Provides internationalized number, currency, date, and text formatting
 */

/**
 * Format a number as currency with locale-specific symbols
 *
 * @param amount - The numeric amount to format
 * @param currency - ISO 4217 currency code (default: 'USD')
 * @param locale - BCP 47 language tag (default: 'en-US')
 * @returns Formatted currency string (e.g., "$1,234.56", "€1.234,56")
 *
 * @example
 * ```ts
 * formatCurrency(1234.56, 'USD', 'en-US') // "$1,234.56"
 * formatCurrency(1234.56, 'EUR', 'de-DE') // "1.234,56 €"
 * ```
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format a number as a percentage with specified precision
 *
 * @param value - The percentage value (e.g., 25 for 25%)
 * @param precision - Number of decimal places (default: 2)
 * @param locale - BCP 47 language tag (default: 'en-US')
 * @returns Formatted percentage string (e.g., "25.00%")
 *
 * @example
 * ```ts
 * formatPercentage(25, 2, 'en-US') // "25.00%"
 * formatPercentage(33.333, 1, 'en-US') // "33.3%"
 * ```
 */
export function formatPercentage(
  value: number,
  precision: number = 2,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value / 100)
}

/**
 * Format a number with locale-specific thousands separators and decimals
 *
 * @param value - The numeric value to format
 * @param precision - Number of decimal places (default: 2)
 * @param locale - BCP 47 language tag (default: 'en-US')
 * @returns Formatted number string (e.g., "1,234.56", "1.234,56")
 *
 * @example
 * ```ts
 * formatNumber(1234.567, 2, 'en-US') // "1,234.57"
 * formatNumber(1234.567, 2, 'de-DE') // "1.234,57"
 * ```
 */
export function formatNumber(
  value: number,
  precision: number = 2,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value)
}

/**
 * Format a number in compact notation (K, M, B suffixes)
 *
 * @param value - The numeric value to format
 * @param locale - BCP 47 language tag (default: 'en-US')
 * @returns Compact formatted string (e.g., "1.2K", "3.5M")
 *
 * @example
 * ```ts
 * formatCompactNumber(1234, 'en-US') // "1.2K"
 * formatCompactNumber(1234567, 'en-US') // "1.2M"
 * ```
 */
export function formatCompactNumber(
  value: number,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value)
}

export function formatDate(
  date: Date,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(date)
}

/**
 * Parse a localized number string to a JavaScript number
 * Handles different decimal and thousands separators based on locale
 *
 * @param value - The string to parse
 * @param locale - The locale to use for parsing (default: 'en-US')
 * @returns The parsed number, or null if parsing fails
 *
 * @example
 * parseLocalizedNumber('1,234.56', 'en-US')  // 1234.56
 * parseLocalizedNumber('1.234,56', 'de-DE')  // 1234.56
 * parseLocalizedNumber('1 234,56', 'fr-FR')  // 1234.56
 */
export function parseLocalizedNumber(
  value: string,
  locale: string = 'en-US'
): number | null {
  if (!value || typeof value !== 'string') {
    return null
  }

  try {
    // Get locale-specific decimal and group separators
    const parts = new Intl.NumberFormat(locale).formatToParts(12345.67)
    const decimalSeparator = parts.find((p) => p.type === 'decimal')?.value || '.'
    const groupSeparator = parts.find((p) => p.type === 'group')?.value || ','

    // Remove all non-numeric characters except decimal separator and minus sign
    // Step 1: Remove group separators
    let normalized = value.replace(new RegExp(`\\${groupSeparator}`, 'g'), '')

    // Step 2: Replace decimal separator with standard period
    if (decimalSeparator !== '.') {
      normalized = normalized.replace(decimalSeparator, '.')
    }

    // Step 3: Remove any remaining non-numeric characters (except . and -)
    normalized = normalized.replace(/[^\d.-]/g, '')

    // Step 4: Trim whitespace
    normalized = normalized.trim()

    // Step 5: Parse to number
    const parsed = parseFloat(normalized)

    // Return null if parsing failed
    return isNaN(parsed) ? null : parsed
  } catch {
    // Fallback: try basic parsing
    const fallback = parseFloat(value.replace(/[^\d.-]/g, ''))
    return isNaN(fallback) ? null : fallback
  }
}

/**
 * Format calculator output values based on type
 * Unified formatting logic for consistent display across calculator components
 *
 * @param value - The value to format (number or string)
 * @param options - Formatting options
 * @returns Formatted string representation of the value
 *
 * @example
 * ```ts
 * formatCalculatorValue(1234.56, { type: 'currency', currency: 'USD', locale: 'en-US' })
 * // "$1,234.56"
 *
 * formatCalculatorValue(25.5, { type: 'percentage', decimals: 1, locale: 'en-US' })
 * // "25.5%"
 *
 * formatCalculatorValue(1234, { type: 'number', unit: 'kg', decimals: 0, locale: 'en-US' })
 * // "1,234 kg"
 * ```
 */
export interface FormatCalculatorValueOptions {
  type: 'number' | 'currency' | 'percentage'
  locale?: string
  decimals?: number
  currency?: string
  unit?: string
}

export function formatCalculatorValue(
  value: number | string,
  options: FormatCalculatorValueOptions
): string {
  // If already a string, return as-is
  if (typeof value === 'string') return value

  const {
    type,
    locale = 'en-US',
    decimals = 2,
    currency = 'USD',
    unit,
  } = options

  switch (type) {
    case 'currency':
      return formatCurrency(value, currency, locale)

    case 'percentage':
      return `${formatNumber(value, decimals, locale)}%`

    case 'number': {
      const formatted = formatNumber(value, decimals, locale)
      return unit ? `${formatted} ${unit}` : formatted
    }

    default:
      return String(value)
  }
}
