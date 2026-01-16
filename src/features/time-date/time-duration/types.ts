/**
 * Time Duration Calculator Types
 * Calculate time between two times
 */

import { z } from 'zod'

/**
 * Time format regex: HH:MM (24-hour format)
 */
const timeFormatRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/

/**
 * Zod schema for time duration inputs
 */
export const TimeDurationInputsSchema = z.object({
  startTime: z
    .string()
    .min(1, { message: 'validation.startTimeRequired' })
    .regex(timeFormatRegex, { message: 'validation.startTimeInvalid' }),
  endTime: z
    .string()
    .min(1, { message: 'validation.endTimeRequired' })
    .regex(timeFormatRegex, { message: 'validation.endTimeInvalid' }),
  crossesMidnight: z.boolean().default(false),
})

export type TimeDurationInputsValidated = z.infer<typeof TimeDurationInputsSchema>

export interface TimeDurationInputs {
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  crossesMidnight: boolean
}

export interface TimeDurationResult {
  hours: number
  minutes: number
  totalMinutes: number
  totalSeconds: number
  decimalHours: number // For payroll (e.g., 8.5 hours)
  formatted: string // HH:MM format
}

export interface TimeDurationValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
