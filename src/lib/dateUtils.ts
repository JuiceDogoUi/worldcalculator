/**
 * Centralized date utility functions
 * Used across time-date calculators for consistent date math
 */

/**
 * Check if a year is a leap year
 * Leap years are divisible by 4, except century years unless divisible by 400
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * Get the number of days in a specific month
 * @param year - The year (needed for February in leap years)
 * @param month - The month (0-indexed: 0=January, 11=December)
 */
export function getDaysInMonth(year: number, month: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (month === 1 && isLeapYear(year)) {
    return 29
  }
  return daysInMonth[month]
}

/**
 * Get the day of week name from a date
 * @param date - The date to get day of week for
 * @returns lowercase day name (sunday, monday, etc.)
 */
export function getDayOfWeekName(date: Date): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[date.getDay()]
}

/**
 * Format a date for display using Intl.DateTimeFormat
 */
export function formatDate(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Format a number with locale-specific formatting
 */
export function formatNumber(num: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num)
}

/**
 * Calculate the total days between two dates
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns The number of days between the dates (always positive)
 */
export function daysBetween(startDate: Date, endDate: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const diffMs = Math.abs(endDate.getTime() - startDate.getTime())
  return Math.floor(diffMs / msPerDay)
}

/**
 * Normalize a date to midnight (00:00:00) to avoid time zone issues
 */
export function normalizeToMidnight(date: Date): Date {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Get the nth occurrence of a weekday in a month
 * @param year - The year
 * @param month - The month (0-indexed)
 * @param weekday - The day of week (0=Sunday, 1=Monday, etc.)
 * @param n - The nth occurrence (1=first, 2=second, etc.)
 */
export function getNthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  const firstDay = new Date(year, month, 1)
  const firstWeekday = firstDay.getDay()

  let daysUntilFirst = weekday - firstWeekday
  if (daysUntilFirst < 0) daysUntilFirst += 7

  const day = 1 + daysUntilFirst + (n - 1) * 7
  return new Date(year, month, day)
}

/**
 * Get the last occurrence of a weekday in a month
 * @param year - The year
 * @param month - The month (0-indexed)
 * @param weekday - The day of week (0=Sunday, 1=Monday, etc.)
 */
export function getLastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const lastDay = new Date(year, month + 1, 0)
  const lastDayWeekday = lastDay.getDay()

  let daysBack = lastDayWeekday - weekday
  if (daysBack < 0) daysBack += 7

  return new Date(year, month, lastDay.getDate() - daysBack)
}
