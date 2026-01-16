import type { WeekNumberInputs, WeekNumberResult, WeekNumberValidation } from './types'

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

/**
 * Get ISO week number for a date
 * ISO 8601: Week 1 is the week containing the first Thursday of the year
 */
export function getISOWeekNumber(date: Date): { weekNumber: number; isoYear: number } {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)

  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday = 7
  const day = d.getDay() || 7
  d.setDate(d.getDate() + 4 - day)

  // Get first day of year
  const yearStart = new Date(d.getFullYear(), 0, 1)

  // Calculate full weeks to nearest Thursday
  const weekNumber = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)

  return { weekNumber, isoYear: d.getFullYear() }
}

/**
 * Get ISO day of week (1=Monday, 7=Sunday)
 */
export function getISODayOfWeek(date: Date): number {
  const day = date.getDay()
  return day === 0 ? 7 : day
}

/**
 * Get day of year (1-366)
 */
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

/**
 * Get quarter (1-4)
 */
export function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1
}

/**
 * Check if a year has 53 weeks (ISO 8601)
 */
export function weeksInISOYear(year: number): number {
  const dec31 = new Date(year, 11, 31)
  const { weekNumber } = getISOWeekNumber(dec31)
  return weekNumber === 1 ? 52 : weekNumber
}

/**
 * Get Monday of the week containing the date
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

/**
 * Get Sunday of the week containing the date
 */
export function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return end
}

/**
 * Validate week number inputs
 */
export function validateWeekNumberInputs(inputs: Partial<WeekNumberInputs>): WeekNumberValidation {
  const errors: WeekNumberValidation['errors'] = []
  if (!inputs.date) {
    errors.push({ field: 'date', message: 'validation.dateRequired' })
  }
  return { valid: errors.length === 0, errors }
}

/**
 * Calculate week number and related info
 */
export function calculateWeekNumber(inputs: WeekNumberInputs): WeekNumberResult | null {
  if (!inputs.date) return null

  const date = inputs.date
  const { weekNumber, isoYear } = getISOWeekNumber(date)
  const dayOfWeek = getISODayOfWeek(date)
  const weekStart = getWeekStart(date)
  const weekEnd = getWeekEnd(date)

  // Check if current week
  const today = new Date()
  const currentWeekStart = getWeekStart(today)
  const isCurrentWeek = weekStart.getTime() === currentWeekStart.getTime()

  return {
    date,
    weekNumber,
    isoYear,
    dayOfWeek,
    dayOfWeekName: DAYS_OF_WEEK[dayOfWeek - 1],
    dayOfYear: getDayOfYear(date),
    quarter: getQuarter(date),
    weeksInYear: weeksInISOYear(isoYear),
    weekStart,
    weekEnd,
    isCurrentWeek,
  }
}

export function formatDate(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(date)
}
