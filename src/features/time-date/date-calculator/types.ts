/**
 * Date Calculator Types
 * Calculate days between dates or add/subtract from dates
 */

import { z } from 'zod'

/**
 * Zod schema for date difference inputs
 */
export const DateDifferenceInputsSchema = z.object({
  mode: z.literal('difference'),
  startDate: z
    .date()
    .nullable()
    .refine((date) => date !== null, { message: 'validation.startDateRequired' }),
  endDate: z
    .date()
    .nullable()
    .refine((date) => date !== null, { message: 'validation.endDateRequired' }),
  includeEndDate: z.boolean().default(false),
})

/**
 * Zod schema for date add/subtract inputs
 */
export const DateAddSubtractInputsSchema = z.object({
  mode: z.literal('add-subtract'),
  startDate: z
    .date()
    .nullable()
    .refine((date) => date !== null, { message: 'validation.startDateRequired' }),
  operation: z.enum(['add', 'subtract']),
  years: z.number().int().min(0).default(0),
  months: z.number().int().min(0).default(0),
  weeks: z.number().int().min(0).default(0),
  days: z.number().int().min(0).default(0),
})

/**
 * Combined Zod schema for date calculator inputs
 */
export const DateCalculatorInputsSchema = z.discriminatedUnion('mode', [
  DateDifferenceInputsSchema,
  DateAddSubtractInputsSchema,
])

export type DateCalculatorInputsValidated = z.infer<typeof DateCalculatorInputsSchema>

/**
 * Calculation mode
 */
export type DateCalculatorMode = 'difference' | 'add-subtract'

/**
 * Add/subtract operation type
 */
export type DateOperation = 'add' | 'subtract'

/**
 * Date calculator inputs for difference mode
 */
export interface DateDifferenceInputs {
  mode: 'difference'
  startDate: Date | null
  endDate: Date | null
  includeEndDate: boolean
}

/**
 * Date calculator inputs for add/subtract mode
 */
export interface DateAddSubtractInputs {
  mode: 'add-subtract'
  startDate: Date | null
  operation: DateOperation
  years: number
  months: number
  weeks: number
  days: number
}

/**
 * Combined inputs type
 */
export type DateCalculatorInputs = DateDifferenceInputs | DateAddSubtractInputs

/**
 * Date difference result breakdown
 */
export interface DateDifferenceBreakdown {
  years: number
  months: number
  weeks: number
  days: number
  totalDays: number
  totalWeeks: number
  totalMonths: number
}

/**
 * Date difference calculation result
 */
export interface DateDifferenceResult {
  mode: 'difference'
  startDate: Date
  endDate: Date
  breakdown: DateDifferenceBreakdown
  includesLeapDay: boolean
  isNegative: boolean
}

/**
 * Add/subtract calculation result
 */
export interface DateAddSubtractResult {
  mode: 'add-subtract'
  startDate: Date
  resultDate: Date
  operation: DateOperation
  added: {
    years: number
    months: number
    weeks: number
    days: number
  }
}

/**
 * Combined result type
 */
export type DateCalculatorResult = DateDifferenceResult | DateAddSubtractResult

/**
 * Validation result
 */
export interface DateCalculatorValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
