import type {
  DateCalculatorInputs,
  DateCalculatorResult,
  DateDifferenceResult,
  DateAddSubtractResult,
  DateDifferenceBreakdown,
  DateCalculatorValidation,
} from './types'

/**
 * Check if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * Check if date range includes Feb 29
 */
export function includesLeapDay(startDate: Date, endDate: Date): boolean {
  const start = startDate < endDate ? startDate : endDate
  const end = startDate < endDate ? endDate : startDate

  for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
    if (isLeapYear(year)) {
      const feb29 = new Date(year, 1, 29)
      if (feb29 >= start && feb29 <= end) {
        return true
      }
    }
  }
  return false
}

/**
 * Validate date calculator inputs
 */
export function validateDateCalculatorInputs(
  inputs: Partial<DateCalculatorInputs>
): DateCalculatorValidation {
  const errors: DateCalculatorValidation['errors'] = []

  if (!inputs.startDate) {
    errors.push({
      field: 'startDate',
      message: 'validation.startDateRequired',
    })
  } else if (!(inputs.startDate instanceof Date) || isNaN(inputs.startDate.getTime())) {
    errors.push({
      field: 'startDate',
      message: 'validation.startDateInvalid',
    })
  }

  if (inputs.mode === 'difference') {
    if (!inputs.endDate) {
      errors.push({
        field: 'endDate',
        message: 'validation.endDateRequired',
      })
    } else if (!(inputs.endDate instanceof Date) || isNaN(inputs.endDate.getTime())) {
      errors.push({
        field: 'endDate',
        message: 'validation.endDateInvalid',
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Calculate date difference breakdown
 */
export function calculateDateDifference(
  startDate: Date,
  endDate: Date,
  includeEndDate: boolean = false
): DateDifferenceBreakdown {
  // Ensure dates are in correct order for calculation
  let start = new Date(startDate)
  let end = new Date(endDate)
  const isNegative = start > end

  if (isNegative) {
    [start, end] = [end, start]
  }

  // Calculate total days
  const diffMs = end.getTime() - start.getTime()
  let totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (includeEndDate) {
    totalDays += 1
  }

  // Calculate years, months, days breakdown
  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
    days += prevMonth.getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  // Calculate weeks from remaining days after years and months
  const weeks = Math.floor(days / 7)
  const remainingDays = days % 7

  // Total calculations
  const totalWeeks = Math.floor(totalDays / 7)
  const totalMonths = years * 12 + months

  return {
    years,
    months,
    weeks,
    days: remainingDays,
    totalDays,
    totalWeeks,
    totalMonths,
  }
}

/**
 * Add time period to a date
 */
export function addToDate(
  startDate: Date,
  years: number,
  months: number,
  weeks: number,
  days: number
): Date {
  const result = new Date(startDate)

  // Add years
  result.setFullYear(result.getFullYear() + years)

  // Add months (handles overflow automatically)
  result.setMonth(result.getMonth() + months)

  // Add weeks and days
  result.setDate(result.getDate() + weeks * 7 + days)

  return result
}

/**
 * Subtract time period from a date
 */
export function subtractFromDate(
  startDate: Date,
  years: number,
  months: number,
  weeks: number,
  days: number
): Date {
  return addToDate(startDate, -years, -months, -weeks, -days)
}

/**
 * Main date calculator function
 */
export function calculateDate(inputs: DateCalculatorInputs): DateCalculatorResult | null {
  if (!inputs.startDate) {
    return null
  }

  if (inputs.mode === 'difference') {
    if (!inputs.endDate) {
      return null
    }

    const breakdown = calculateDateDifference(
      inputs.startDate,
      inputs.endDate,
      inputs.includeEndDate
    )

    const result: DateDifferenceResult = {
      mode: 'difference',
      startDate: inputs.startDate,
      endDate: inputs.endDate,
      breakdown,
      includesLeapDay: includesLeapDay(inputs.startDate, inputs.endDate),
      isNegative: inputs.startDate > inputs.endDate,
    }

    return result
  } else {
    // add-subtract mode
    const { years, months, weeks, days, operation } = inputs

    const resultDate =
      operation === 'add'
        ? addToDate(inputs.startDate, years, months, weeks, days)
        : subtractFromDate(inputs.startDate, years, months, weeks, days)

    const result: DateAddSubtractResult = {
      mode: 'add-subtract',
      startDate: inputs.startDate,
      resultDate,
      operation,
      added: { years, months, weeks, days },
    }

    return result
  }
}

/**
 * Format date for display
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
 * Format number with locale
 */
export function formatNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value)
}
