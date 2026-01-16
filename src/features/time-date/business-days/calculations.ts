import type { BusinessDaysInputs, BusinessDaysResult, BusinessDaysValidation } from './types'

/**
 * Check if a date is a weekend
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday = 0, Saturday = 6
}

/**
 * Check if a date is in the holiday list
 */
export function isHoliday(date: Date, holidays: Date[]): boolean {
  return holidays.some(
    (h) =>
      h.getFullYear() === date.getFullYear() &&
      h.getMonth() === date.getMonth() &&
      h.getDate() === date.getDate()
  )
}

/**
 * Validate business days inputs
 */
export function validateBusinessDaysInputs(
  inputs: Partial<BusinessDaysInputs>
): BusinessDaysValidation {
  const errors: BusinessDaysValidation['errors'] = []

  if (!inputs.startDate) {
    errors.push({ field: 'startDate', message: 'validation.startDateRequired' })
  }

  if (inputs.mode === 'between' && !inputs.endDate) {
    errors.push({ field: 'endDate', message: 'validation.endDateRequired' })
  }

  if (inputs.mode === 'add' && (inputs.daysToAdd === undefined || inputs.daysToAdd < 0)) {
    errors.push({ field: 'daysToAdd', message: 'validation.daysToAddRequired' })
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Count business days between two dates
 */
export function countBusinessDaysBetween(
  startDate: Date,
  endDate: Date,
  excludeWeekends: boolean,
  excludeHolidays: boolean,
  customHolidays: Date[]
): { businessDays: number; weekendDays: number; holidaysExcluded: number } {
  let businessDays = 0
  let weekendDays = 0
  let holidaysExcluded = 0

  const start = new Date(Math.min(startDate.getTime(), endDate.getTime()))
  const end = new Date(Math.max(startDate.getTime(), endDate.getTime()))
  const current = new Date(start)

  while (current <= end) {
    const isWeekendDay = isWeekend(current)
    const isHolidayDay = isHoliday(current, customHolidays)

    if (excludeWeekends && isWeekendDay) {
      weekendDays++
    } else if (excludeHolidays && isHolidayDay) {
      holidaysExcluded++
    } else {
      businessDays++
    }

    current.setDate(current.getDate() + 1)
  }

  return { businessDays, weekendDays, holidaysExcluded }
}

/**
 * Add business days to a date
 */
export function addBusinessDays(
  startDate: Date,
  daysToAdd: number,
  excludeWeekends: boolean,
  excludeHolidays: boolean,
  customHolidays: Date[]
): Date {
  const result = new Date(startDate)
  let daysAdded = 0

  while (daysAdded < daysToAdd) {
    result.setDate(result.getDate() + 1)

    const isWeekendDay = isWeekend(result)
    const isHolidayDay = isHoliday(result, customHolidays)

    if (excludeWeekends && isWeekendDay) continue
    if (excludeHolidays && isHolidayDay) continue

    daysAdded++
  }

  return result
}

/**
 * Main calculation function
 */
export function calculateBusinessDays(inputs: BusinessDaysInputs): BusinessDaysResult | null {
  if (!inputs.startDate) return null

  if (inputs.mode === 'between') {
    if (!inputs.endDate) return null

    const totalCalendarDays = Math.abs(
      Math.floor(
        (inputs.endDate.getTime() - inputs.startDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    ) + 1

    const { businessDays, weekendDays, holidaysExcluded } = countBusinessDaysBetween(
      inputs.startDate,
      inputs.endDate,
      inputs.excludeWeekends,
      inputs.excludeHolidays,
      inputs.customHolidays
    )

    return {
      mode: 'between',
      startDate: inputs.startDate,
      endDate: inputs.endDate,
      totalCalendarDays,
      businessDays,
      weekendDays,
      holidaysExcluded,
    }
  } else {
    // add mode
    const daysToAdd = inputs.daysToAdd || 0
    const endDate = addBusinessDays(
      inputs.startDate,
      daysToAdd,
      inputs.excludeWeekends,
      inputs.excludeHolidays,
      inputs.customHolidays
    )

    const totalCalendarDays = Math.floor(
      (endDate.getTime() - inputs.startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1

    return {
      mode: 'add',
      startDate: inputs.startDate,
      endDate,
      totalCalendarDays,
      businessDays: daysToAdd,
      weekendDays: 0,
      holidaysExcluded: 0,
    }
  }
}

export function formatDate(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
