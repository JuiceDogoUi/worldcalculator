import type {
  AgeInputs,
  AgeResult,
  AgeBreakdown,
  AgeTotals,
  NextBirthday,
  AgeValidation,
  ZodiacSign,
  Generation,
} from './types'
import { ZODIAC_RANGES, GENERATION_RANGES } from './types'

/**
 * Days of the week for display
 */
const DAYS_OF_WEEK = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const

/**
 * Check if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Validate age calculator inputs
 */
export function validateAgeInputs(inputs: Partial<AgeInputs>): AgeValidation {
  const errors: AgeValidation['errors'] = []

  if (!inputs.birthDate) {
    errors.push({
      field: 'birthDate',
      message: 'validation.birthDateRequired',
    })
  } else if (!(inputs.birthDate instanceof Date) || isNaN(inputs.birthDate.getTime())) {
    errors.push({
      field: 'birthDate',
      message: 'validation.birthDateInvalid',
    })
  } else if (inputs.birthDate > new Date()) {
    errors.push({
      field: 'birthDate',
      message: 'validation.birthDateFuture',
    })
  } else if (inputs.birthDate.getFullYear() < 1900) {
    errors.push({
      field: 'birthDate',
      message: 'validation.birthDateTooOld',
    })
  }

  if (inputs.targetDate) {
    if (!(inputs.targetDate instanceof Date) || isNaN(inputs.targetDate.getTime())) {
      errors.push({
        field: 'targetDate',
        message: 'validation.targetDateInvalid',
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Calculate age breakdown (years, months, days)
 */
export function calculateAgeBreakdown(birthDate: Date, targetDate: Date): AgeBreakdown {
  let years = targetDate.getFullYear() - birthDate.getFullYear()
  let months = targetDate.getMonth() - birthDate.getMonth()
  let days = targetDate.getDate() - birthDate.getDate()

  // Adjust for negative days
  if (days < 0) {
    months--
    const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0)
    days += prevMonth.getDate()
  }

  // Adjust for negative months
  if (months < 0) {
    years--
    months += 12
  }

  return { years, months, days }
}

/**
 * Calculate total age in various units
 */
export function calculateAgeTotals(birthDate: Date, targetDate: Date): AgeTotals {
  const diffMs = targetDate.getTime() - birthDate.getTime()
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
  const totalMinutes = Math.floor(diffMs / (1000 * 60))
  const totalWeeks = Math.floor(totalDays / 7)

  // Calculate total months more accurately
  let totalMonths =
    (targetDate.getFullYear() - birthDate.getFullYear()) * 12 +
    (targetDate.getMonth() - birthDate.getMonth())
  if (targetDate.getDate() < birthDate.getDate()) {
    totalMonths--
  }

  // Calculate total years
  const ageBreakdown = calculateAgeBreakdown(birthDate, targetDate)
  const totalYears = ageBreakdown.years

  return {
    totalYears,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
  }
}

/**
 * Calculate next birthday information
 */
export function calculateNextBirthday(birthDate: Date, targetDate: Date): NextBirthday {
  const currentYear = targetDate.getFullYear()
  const birthMonth = birthDate.getMonth()
  const birthDay = birthDate.getDate()

  // Try this year's birthday first
  let nextBirthdayDate = new Date(currentYear, birthMonth, birthDay)

  // Handle Feb 29 for non-leap years
  if (birthMonth === 1 && birthDay === 29 && !isLeapYear(currentYear)) {
    nextBirthdayDate = new Date(currentYear, 1, 28)
  }

  // If birthday has passed this year, use next year
  if (nextBirthdayDate <= targetDate) {
    const nextYear = currentYear + 1
    nextBirthdayDate = new Date(nextYear, birthMonth, birthDay)

    // Handle Feb 29 for non-leap years
    if (birthMonth === 1 && birthDay === 29 && !isLeapYear(nextYear)) {
      nextBirthdayDate = new Date(nextYear, 1, 28)
    }
  }

  const diffMs = nextBirthdayDate.getTime() - targetDate.getTime()
  const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  const dayOfWeek = DAYS_OF_WEEK[nextBirthdayDate.getDay()]
  const age = nextBirthdayDate.getFullYear() - birthDate.getFullYear()

  return {
    date: nextBirthdayDate,
    daysUntil,
    dayOfWeek,
    age,
  }
}

/**
 * Get day of week for a date
 */
export function getDayOfWeek(date: Date): string {
  return DAYS_OF_WEEK[date.getDay()]
}

/**
 * Get zodiac sign based on birth date
 */
export function getZodiacSign(birthDate: Date): ZodiacSign {
  const month = birthDate.getMonth() // 0-indexed
  const day = birthDate.getDate()

  // Check each zodiac sign
  for (const [sign, range] of Object.entries(ZODIAC_RANGES) as [ZodiacSign, typeof ZODIAC_RANGES[ZodiacSign]][]) {
    const { start, end } = range
    const [startMonth, startDay] = start
    const [endMonth, endDay] = end

    // Handle Capricorn which spans year boundary
    if (sign === 'capricorn') {
      if ((month === 11 && day >= 22) || (month === 0 && day <= 19)) {
        return sign
      }
      continue
    }

    // For other signs, check if date falls within range
    if (
      (month === startMonth - 1 && day >= startDay) ||
      (month === endMonth - 1 && day <= endDay)
    ) {
      return sign
    }
  }

  // Default fallback (shouldn't reach here)
  return 'capricorn'
}

/**
 * Get generation based on birth year
 */
export function getGeneration(birthYear: number): Generation {
  for (const [gen, range] of Object.entries(GENERATION_RANGES) as [Generation, typeof GENERATION_RANGES[Generation]][]) {
    if (birthYear >= range.start && birthYear <= range.end) {
      return gen
    }
  }

  // Default to gen-alpha for future years
  if (birthYear > 2025) {
    return 'gen-alpha'
  }

  // Default to silent for very old years
  return 'silent'
}

/**
 * Check if today is the birthday
 */
export function isBirthdayToday(birthDate: Date, targetDate: Date): boolean {
  return (
    birthDate.getMonth() === targetDate.getMonth() &&
    birthDate.getDate() === targetDate.getDate()
  )
}

/**
 * Main age calculation function
 */
export function calculateAge(inputs: AgeInputs): AgeResult | null {
  if (!inputs.birthDate) {
    return null
  }

  const birthDate = inputs.birthDate
  const targetDate = inputs.targetDate || new Date()

  // Calculate all age components
  const age = calculateAgeBreakdown(birthDate, targetDate)
  const totals = calculateAgeTotals(birthDate, targetDate)
  const nextBirthday = calculateNextBirthday(birthDate, targetDate)
  const dayOfWeekBorn = getDayOfWeek(birthDate)
  const zodiacSign = getZodiacSign(birthDate)
  const generation = getGeneration(birthDate.getFullYear())
  const birthdayToday = isBirthdayToday(birthDate, targetDate)

  return {
    age,
    totals,
    nextBirthday,
    dayOfWeekBorn,
    zodiacSign,
    generation,
    isBirthdayToday: birthdayToday,
  }
}

/**
 * Format age for display
 */
export function formatAge(age: AgeBreakdown): string {
  const parts: string[] = []
  if (age.years > 0) parts.push(`${age.years} year${age.years !== 1 ? 's' : ''}`)
  if (age.months > 0) parts.push(`${age.months} month${age.months !== 1 ? 's' : ''}`)
  if (age.days > 0) parts.push(`${age.days} day${age.days !== 1 ? 's' : ''}`)
  return parts.join(', ') || '0 days'
}

/**
 * Format large numbers with locale
 */
export function formatNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * Format date for display
 */
export function formatDate(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
