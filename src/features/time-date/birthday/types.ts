/**
 * Birthday Calculator Types
 * Calculate days until birthday and birthday milestones
 */

import { z } from 'zod'

/**
 * Zod schema for birthday calculator inputs
 */
export const BirthdayInputsSchema = z.object({
  birthDate: z
    .date()
    .nullable()
    .refine((date) => date !== null, { message: 'validation.birthDateRequired' })
    .refine((date) => date === null || date <= new Date(), { message: 'validation.birthDateFuture' }),
})

export type BirthdayInputsValidated = z.infer<typeof BirthdayInputsSchema>

export interface BirthdayInputs {
  birthDate: Date | null
}

export interface BirthdayMilestone {
  age: number
  date: Date
  dayOfWeek: string
  isPast: boolean
}

export interface BirthdayResult {
  birthDate: Date
  nextBirthday: Date
  daysUntil: number
  hoursUntil: number
  minutesUntil: number
  nextAge: number
  dayOfWeekBorn: string
  nextBirthdayDayOfWeek: string
  totalDaysLived: number
  isBirthdayToday: boolean
  upcomingMilestones: BirthdayMilestone[]
}

export interface BirthdayValidation {
  valid: boolean
  errors: { field: string; message: string }[]
}
