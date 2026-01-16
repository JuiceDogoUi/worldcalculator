/**
 * Week Number Calculator Types
 * Calculate ISO week number for any date
 */

import { z } from 'zod'

/**
 * Zod schema for week number calculator inputs
 */
export const WeekNumberInputsSchema = z.object({
  date: z
    .date()
    .nullable()
    .refine((date) => date !== null, { message: 'validation.dateRequired' }),
})

export type WeekNumberInputsValidated = z.infer<typeof WeekNumberInputsSchema>

export interface WeekNumberInputs {
  date: Date | null
}

export interface WeekNumberResult {
  date: Date
  weekNumber: number
  isoYear: number // ISO year (may differ from calendar year at year boundaries)
  dayOfWeek: number // 1=Monday, 7=Sunday
  dayOfWeekName: string
  dayOfYear: number
  quarter: number
  weeksInYear: number
  weekStart: Date // Monday of the week
  weekEnd: Date // Sunday of the week
  isCurrentWeek: boolean
}

export interface WeekNumberValidation {
  valid: boolean
  errors: { field: string; message: string }[]
}
