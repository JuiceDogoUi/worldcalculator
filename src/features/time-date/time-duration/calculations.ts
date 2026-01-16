import type { TimeDurationInputs, TimeDurationResult, TimeDurationValidation } from './types'

/**
 * Parse time string to minutes since midnight
 */
export function parseTimeToMinutes(time: string): number | null {
  const match = time.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null

  const hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null
  }

  return hours * 60 + minutes
}

/**
 * Validate time duration inputs
 */
export function validateTimeDurationInputs(
  inputs: Partial<TimeDurationInputs>
): TimeDurationValidation {
  const errors: TimeDurationValidation['errors'] = []

  if (!inputs.startTime) {
    errors.push({ field: 'startTime', message: 'validation.startTimeRequired' })
  } else if (parseTimeToMinutes(inputs.startTime) === null) {
    errors.push({ field: 'startTime', message: 'validation.startTimeInvalid' })
  }

  if (!inputs.endTime) {
    errors.push({ field: 'endTime', message: 'validation.endTimeRequired' })
  } else if (parseTimeToMinutes(inputs.endTime) === null) {
    errors.push({ field: 'endTime', message: 'validation.endTimeInvalid' })
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Calculate time duration between two times
 */
export function calculateTimeDuration(inputs: TimeDurationInputs): TimeDurationResult | null {
  const startMinutes = parseTimeToMinutes(inputs.startTime)
  const endMinutes = parseTimeToMinutes(inputs.endTime)

  if (startMinutes === null || endMinutes === null) {
    return null
  }

  let totalMinutes: number

  if (inputs.crossesMidnight || endMinutes < startMinutes) {
    // Handle overnight duration
    totalMinutes = (24 * 60 - startMinutes) + endMinutes
  } else {
    totalMinutes = endMinutes - startMinutes
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const totalSeconds = totalMinutes * 60
  const decimalHours = Math.round((totalMinutes / 60) * 100) / 100

  const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

  return {
    hours,
    minutes,
    totalMinutes,
    totalSeconds,
    decimalHours,
    formatted,
  }
}

/**
 * Format decimal hours for display
 */
export function formatDecimalHours(hours: number): string {
  return hours.toFixed(2)
}
