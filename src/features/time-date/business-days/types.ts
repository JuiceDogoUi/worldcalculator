/**
 * Business Days Calculator Types
 * Calculate working days excluding weekends and holidays
 */

import { z } from 'zod'

/**
 * Zod schema for business days between mode
 */
export const BusinessDaysBetweenSchema = z.object({
  mode: z.literal('between'),
  startDate: z
    .date()
    .nullable()
    .refine((date) => date !== null, { message: 'validation.startDateRequired' }),
  endDate: z
    .date()
    .nullable()
    .refine((date) => date !== null, { message: 'validation.endDateRequired' }),
  excludeWeekends: z.boolean().default(true),
  excludeHolidays: z.boolean().default(false),
  customHolidays: z.array(z.date()).default([]),
})

/**
 * Zod schema for business days add mode
 */
export const BusinessDaysAddSchema = z.object({
  mode: z.literal('add'),
  startDate: z
    .date()
    .nullable()
    .refine((date) => date !== null, { message: 'validation.startDateRequired' }),
  daysToAdd: z.number().int().min(0, { message: 'validation.daysToAddRequired' }),
  excludeWeekends: z.boolean().default(true),
  excludeHolidays: z.boolean().default(false),
  customHolidays: z.array(z.date()).default([]),
})

/**
 * Combined Zod schema for business days inputs
 */
export const BusinessDaysInputsSchema = z.discriminatedUnion('mode', [
  BusinessDaysBetweenSchema,
  BusinessDaysAddSchema,
])

export type BusinessDaysInputsValidated = z.infer<typeof BusinessDaysInputsSchema>

export type CalculationMode = 'between' | 'add'

export interface BusinessDaysInputs {
  mode: CalculationMode
  startDate: Date | null
  endDate?: Date | null // For 'between' mode
  daysToAdd?: number // For 'add' mode
  excludeWeekends: boolean
  excludeHolidays: boolean
  customHolidays: Date[]
}

export interface BusinessDaysResult {
  mode: CalculationMode
  startDate: Date
  endDate: Date
  totalCalendarDays: number
  businessDays: number
  weekendDays: number
  holidaysExcluded: number
}

export interface BusinessDaysValidation {
  valid: boolean
  errors: { field: string; message: string }[]
}

/**
 * Get the nth occurrence of a weekday in a month
 * @param year - The year
 * @param month - The month (0-indexed)
 * @param weekday - The day of week (0=Sunday, 1=Monday, etc.)
 * @param n - The nth occurrence (1=first, 2=second, etc.)
 */
function getNthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  const firstDay = new Date(year, month, 1)
  const firstWeekday = firstDay.getDay()

  // Calculate days until first occurrence of the weekday
  let daysUntilFirst = weekday - firstWeekday
  if (daysUntilFirst < 0) daysUntilFirst += 7

  // Calculate the date of the nth occurrence
  const day = 1 + daysUntilFirst + (n - 1) * 7
  return new Date(year, month, day)
}

/**
 * Get the last occurrence of a weekday in a month
 * @param year - The year
 * @param month - The month (0-indexed)
 * @param weekday - The day of week (0=Sunday, 1=Monday, etc.)
 */
function getLastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  // Get the last day of the month
  const lastDay = new Date(year, month + 1, 0)
  const lastDayWeekday = lastDay.getDay()

  // Calculate days to go back to find the last occurrence of weekday
  let daysBack = lastDayWeekday - weekday
  if (daysBack < 0) daysBack += 7

  return new Date(year, month, lastDay.getDate() - daysBack)
}

/**
 * Adjust holiday to observed date if it falls on weekend
 * Saturday holidays are observed on Friday, Sunday holidays on Monday
 */
function getObservedDate(date: Date): Date {
  const day = date.getDay()
  if (day === 0) {
    // Sunday - observe on Monday
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  } else if (day === 6) {
    // Saturday - observe on Friday
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
  }
  return date
}

/**
 * Get US Federal Holidays for a specific year
 * Correctly calculates floating holidays (e.g., MLK Day, Thanksgiving)
 */
export function getUSHolidaysForYear(year: number): Date[] {
  const holidays: Date[] = []

  // New Year's Day - January 1 (observed)
  holidays.push(getObservedDate(new Date(year, 0, 1)))

  // Martin Luther King Jr. Day - 3rd Monday of January
  holidays.push(getNthWeekdayOfMonth(year, 0, 1, 3))

  // Presidents' Day - 3rd Monday of February
  holidays.push(getNthWeekdayOfMonth(year, 1, 1, 3))

  // Memorial Day - Last Monday of May
  holidays.push(getLastWeekdayOfMonth(year, 4, 1))

  // Independence Day - July 4 (observed)
  holidays.push(getObservedDate(new Date(year, 6, 4)))

  // Labor Day - 1st Monday of September
  holidays.push(getNthWeekdayOfMonth(year, 8, 1, 1))

  // Columbus Day - 2nd Monday of October
  holidays.push(getNthWeekdayOfMonth(year, 9, 1, 2))

  // Veterans Day - November 11 (observed)
  holidays.push(getObservedDate(new Date(year, 10, 11)))

  // Thanksgiving - 4th Thursday of November
  holidays.push(getNthWeekdayOfMonth(year, 10, 4, 4))

  // Christmas Day - December 25 (observed)
  holidays.push(getObservedDate(new Date(year, 11, 25)))

  return holidays
}

/**
 * Get US holidays for a range of years
 * Useful when calculating business days across year boundaries
 */
export function getUSHolidaysForRange(startYear: number, endYear: number): Date[] {
  const holidays: Date[] = []
  for (let year = startYear; year <= endYear; year++) {
    holidays.push(...getUSHolidaysForYear(year))
  }
  return holidays
}

// Legacy export for backwards compatibility (deprecated)
// Note: These static dates are incorrect for most years - use getUSHolidaysForYear instead
export const US_HOLIDAYS: { month: number; day: number; name: string }[] = [
  { month: 0, day: 1, name: "New Year's Day" },
  { month: 0, day: 15, name: 'Martin Luther King Jr. Day' }, // Approximate - actually 3rd Monday
  { month: 1, day: 19, name: "Presidents' Day" }, // Approximate - actually 3rd Monday
  { month: 4, day: 27, name: 'Memorial Day' }, // Approximate - actually Last Monday
  { month: 6, day: 4, name: 'Independence Day' },
  { month: 8, day: 2, name: 'Labor Day' }, // Approximate - actually 1st Monday
  { month: 9, day: 14, name: 'Columbus Day' }, // Approximate - actually 2nd Monday
  { month: 10, day: 11, name: 'Veterans Day' },
  { month: 10, day: 28, name: 'Thanksgiving' }, // Approximate - actually 4th Thursday
  { month: 11, day: 25, name: 'Christmas Day' },
]
