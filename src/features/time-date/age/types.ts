/**
 * Age Calculator Types
 * Calculate exact age from birthdate with multiple formats
 */

import { z } from 'zod'

/**
 * Zod schema for age calculator inputs
 */
export const AgeInputsSchema = z.object({
  birthDate: z
    .date()
    .nullable()
    .refine((date) => date !== null, { message: 'validation.required' })
    .refine((date) => date === null || date <= new Date(), { message: 'validation.futureDate' })
    .refine((date) => date === null || date.getFullYear() >= 1900, { message: 'validation.tooOld' }),
  targetDate: z.date().default(() => new Date()),
})

export type AgeInputsValidated = z.infer<typeof AgeInputsSchema>

/**
 * Zodiac sign type
 */
export type ZodiacSign =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces'

/**
 * Generation type based on birth year
 */
export type Generation =
  | 'silent'
  | 'baby-boomer'
  | 'gen-x'
  | 'millennial'
  | 'gen-z'
  | 'gen-alpha'

/**
 * Age calculator inputs
 */
export interface AgeInputs {
  birthDate: Date | null
  targetDate: Date // Default to today
}

/**
 * Detailed age breakdown
 */
export interface AgeBreakdown {
  years: number
  months: number
  days: number
}

/**
 * Total age in various units
 */
export interface AgeTotals {
  totalYears: number
  totalMonths: number
  totalWeeks: number
  totalDays: number
  totalHours: number
  totalMinutes: number
}

/**
 * Next birthday information
 */
export interface NextBirthday {
  date: Date
  daysUntil: number
  dayOfWeek: string
  age: number // Age they will turn
}

/**
 * Age calculation result
 */
export interface AgeResult {
  age: AgeBreakdown
  totals: AgeTotals
  nextBirthday: NextBirthday
  dayOfWeekBorn: string
  zodiacSign: ZodiacSign
  generation: Generation
  isBirthdayToday: boolean
}

/**
 * Validation result for age inputs
 */
export interface AgeValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}

/**
 * Zodiac date ranges (month, day)
 */
export const ZODIAC_RANGES: Record<ZodiacSign, { start: [number, number]; end: [number, number] }> = {
  aries: { start: [3, 21], end: [4, 19] },
  taurus: { start: [4, 20], end: [5, 20] },
  gemini: { start: [5, 21], end: [6, 20] },
  cancer: { start: [6, 21], end: [7, 22] },
  leo: { start: [7, 23], end: [8, 22] },
  virgo: { start: [8, 23], end: [9, 22] },
  libra: { start: [9, 23], end: [10, 22] },
  scorpio: { start: [10, 23], end: [11, 21] },
  sagittarius: { start: [11, 22], end: [12, 21] },
  capricorn: { start: [12, 22], end: [1, 19] },
  aquarius: { start: [1, 20], end: [2, 18] },
  pisces: { start: [2, 19], end: [3, 20] },
}

/**
 * Generation year ranges
 */
export const GENERATION_RANGES: Record<Generation, { start: number; end: number }> = {
  silent: { start: 1928, end: 1945 },
  'baby-boomer': { start: 1946, end: 1964 },
  'gen-x': { start: 1965, end: 1980 },
  millennial: { start: 1981, end: 1996 },
  'gen-z': { start: 1997, end: 2012 },
  'gen-alpha': { start: 2013, end: 2025 },
}
