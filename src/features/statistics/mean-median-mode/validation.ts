import { z } from 'zod'
import { parseLocalizedNumber } from '@/lib/formatters'
import { roundToDecimals } from './calculations'

/**
 * Validation module for Mean/Median/Mode Calculator
 * Handles data parsing, validation, and edge case detection
 */

// Re-export roundToDecimals for consumers of this module
export { roundToDecimals }

/**
 * Parse result for data input parsing
 */
export interface ParseDataResult {
  success: boolean
  data?: number[]
  errors?: string[]
  warnings?: string[]
}

/**
 * Detect delimiter used in the input string
 * Priority: newline > semicolon > comma > space
 */
function detectDelimiter(input: string): string {
  const trimmed = input.trim()

  // Check for newlines
  if (trimmed.includes('\n')) {
    return '\n'
  }

  // Check for semicolon (common in European formats)
  if (trimmed.includes(';')) {
    return ';'
  }

  // Check for comma (but be careful with European decimal comma)
  // Count commas and periods to determine if comma is a delimiter or decimal separator
  const commaCount = (trimmed.match(/,/g) || []).length
  const periodCount = (trimmed.match(/\./g) || []).length

  // If there are spaces, commas might be decimal separators
  if (trimmed.includes(' ') && commaCount > 0 && periodCount === 0) {
    // Likely European format: "1,5 2,3 3,7" (comma = decimal)
    return ' '
  }

  if (trimmed.includes(',')) {
    return ','
  }

  // Default to space
  return ' '
}

/**
 * Parse data input string into array of numbers
 * Handles multiple formats and locales
 *
 * Supported formats:
 * - Comma-separated: "1, 2, 3, 4"
 * - Space-separated: "1 2 3 4"
 * - Newline-separated: "1\n2\n3\n4"
 * - Semicolon-separated: "1; 2; 3; 4"
 * - European format: "1,5; 2,5; 3,5" (comma as decimal)
 *
 * @param input - Raw string input from user
 * @param locale - User's locale for number parsing (default: 'en-US')
 * @returns ParseDataResult with parsed data or errors
 */
export function parseDataInput(
  input: string,
  locale: string = 'en-US'
): ParseDataResult {
  if (!input || input.trim().length === 0) {
    return {
      success: false,
      errors: ['Please enter at least one number'],
    }
  }

  const trimmed = input.trim()
  const delimiter = detectDelimiter(trimmed)

  // Split by detected delimiter
  const parts = trimmed.split(delimiter).map(s => s.trim()).filter(s => s.length > 0)

  if (parts.length === 0) {
    return {
      success: false,
      errors: ['Please enter at least one number'],
    }
  }

  const parsedNumbers: number[] = []
  const invalidValues: string[] = []

  for (const part of parts) {
    const parsed = parseLocalizedNumber(part, locale)

    if (parsed === null || isNaN(parsed) || !isFinite(parsed)) {
      invalidValues.push(part)
    } else {
      parsedNumbers.push(parsed)
    }
  }

  // Check if we got any valid numbers
  if (parsedNumbers.length === 0) {
    return {
      success: false,
      errors: [
        `No valid numbers found. Invalid values: ${invalidValues.join(', ')}`,
        'Please enter numbers separated by commas, spaces, or line breaks.',
      ],
    }
  }

  // Prepare result with warnings if there were invalid values
  const warnings: string[] = []

  if (invalidValues.length > 0) {
    warnings.push(
      `Ignored ${invalidValues.length} invalid value${invalidValues.length > 1 ? 's' : ''}: ${invalidValues.join(', ')}`
    )
  }

  if (parsedNumbers.length === 1) {
    warnings.push(
      'Only one value provided. All measures of central tendency will equal this value.'
    )
  }

  return {
    success: true,
    data: parsedNumbers,
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}

/**
 * Parse weights input string into array of numbers
 * Same format support as data input
 */
export function parseWeightsInput(
  input: string,
  locale: string = 'en-US'
): ParseDataResult {
  if (!input || input.trim().length === 0) {
    return {
      success: true,
      data: [],
    }
  }

  return parseDataInput(input, locale)
}

/**
 * Zod schema for data input validation
 * Validates that we have at least one valid number
 */
export const dataInputSchema = z.string()
  .min(1, 'Please enter at least one number')
  .transform((val, ctx) => {
    const result = parseDataInput(val)

    if (!result.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.errors?.join(' ') || 'Invalid data input',
      })
      return z.NEVER
    }

    return result.data!
  })

/**
 * Zod schema for weights input validation (optional)
 */
export const weightsInputSchema = z.string()
  .optional()
  .transform((val, ctx) => {
    if (!val || val.trim().length === 0) {
      return undefined
    }

    const result = parseWeightsInput(val)

    if (!result.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.errors?.join(' ') || 'Invalid weights input',
      })
      return z.NEVER
    }

    // Check for negative weights
    const hasNegative = result.data!.some(w => w < 0)
    if (hasNegative) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Weights cannot be negative',
      })
      return z.NEVER
    }

    // Check for all-zero weights
    const allZero = result.data!.every(w => w === 0)
    if (allZero) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one weight must be greater than zero',
      })
      return z.NEVER
    }

    return result.data!
  })

/**
 * Zod schema for precision input
 */
export const precisionSchema = z.number()
  .int('Precision must be a whole number')
  .min(0, 'Precision cannot be negative')
  .max(10, 'Precision cannot exceed 10 decimal places')
  .default(4)

/**
 * Combined schema for all central tendency inputs
 */
export const centralTendencyInputSchema = z.object({
  data: dataInputSchema,
  weights: weightsInputSchema,
  precision: precisionSchema,
})
  .refine(
    (val) => {
      // If weights are provided, they must match data length
      if (val.weights && val.weights.length > 0) {
        return val.weights.length === val.data.length
      }
      return true
    },
    {
      message: 'Number of weights must match number of data values',
      path: ['weights'],
    }
  )

/**
 * Type inference from schemas
 */
export type CentralTendencyInputs = z.infer<typeof centralTendencyInputSchema>

/**
 * Validation errors interface
 */
export interface ValidationErrors {
  data?: string
  weights?: string
  precision?: string
  general?: string
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean
  errors: ValidationErrors
  warnings?: string[]
  parsedData?: {
    data: number[]
    weights?: number[]
    precision: number
  }
}

/**
 * Validate central tendency calculator inputs
 * Returns structured validation result with errors and warnings
 *
 * @param inputs - Raw inputs from the form
 * @returns ValidationResult with isValid flag, errors, warnings, and parsed data
 */
export function validateCentralTendencyInputs(inputs: {
  data: string
  weights?: string
  precision?: number
  locale?: string
}): ValidationResult {
  const errors: ValidationErrors = {}
  const warnings: string[] = []

  // Parse data
  const dataResult = parseDataInput(inputs.data, inputs.locale)
  if (!dataResult.success) {
    errors.data = dataResult.errors?.join(' ')
    return { isValid: false, errors }
  }

  if (dataResult.warnings) {
    warnings.push(...dataResult.warnings)
  }

  // Parse weights if provided
  let weightsData: number[] | undefined
  if (inputs.weights && inputs.weights.trim().length > 0) {
    const weightsResult = parseWeightsInput(inputs.weights, inputs.locale)

    if (!weightsResult.success) {
      errors.weights = weightsResult.errors?.join(' ')
      return { isValid: false, errors, warnings }
    }

    weightsData = weightsResult.data

    // Check weights length matches data length
    if (weightsData && weightsData.length !== dataResult.data!.length) {
      errors.weights = `Number of weights (${weightsData.length}) must match number of data values (${dataResult.data!.length})`
      return { isValid: false, errors, warnings }
    }

    // Check for negative weights
    const hasNegative = weightsData!.some(w => w < 0)
    if (hasNegative) {
      errors.weights = 'Weights cannot be negative'
      return { isValid: false, errors, warnings }
    }

    // Check for all-zero weights
    const allZero = weightsData!.every(w => w === 0)
    if (allZero) {
      errors.weights = 'At least one weight must be greater than zero'
      return { isValid: false, errors, warnings }
    }

    if (weightsResult.warnings) {
      warnings.push(...weightsResult.warnings)
    }
  }

  // Validate precision
  const precision = inputs.precision ?? 4
  if (precision < 0 || precision > 10 || !Number.isInteger(precision)) {
    errors.precision = 'Precision must be a whole number between 0 and 10'
    return { isValid: false, errors, warnings }
  }

  return {
    isValid: true,
    errors: {},
    warnings: warnings.length > 0 ? warnings : undefined,
    parsedData: {
      data: dataResult.data!,
      weights: weightsData,
      precision,
    },
  }
}

/**
 * Edge case detection for specific calculation types
 */
export interface EdgeCaseWarnings {
  geometricMean?: string
  harmonicMean?: string
  mode?: string
}

/**
 * Detect edge cases for different types of calculations
 *
 * @param data - Parsed numeric data array
 * @returns EdgeCaseWarnings object with warnings for specific calculations
 */
export function detectEdgeCases(data: number[]): EdgeCaseWarnings {
  const warnings: EdgeCaseWarnings = {}

  // Check for non-positive values (affects geometric and harmonic mean)
  const hasNonPositive = data.some(n => n <= 0)
  const hasNegative = data.some(n => n < 0)
  const hasZero = data.some(n => n === 0)

  if (hasNegative) {
    warnings.geometricMean =
      'Geometric mean is not defined for negative numbers. Consider using absolute values or arithmetic mean.'
  }

  if (hasZero) {
    warnings.geometricMean =
      'Geometric mean is undefined when the dataset contains zero. Result may be invalid.'
    warnings.harmonicMean =
      'Harmonic mean is undefined when the dataset contains zero. Cannot calculate.'
  } else if (hasNonPositive) {
    warnings.harmonicMean =
      'Harmonic mean is not defined for non-positive numbers. Consider using positive values or arithmetic mean.'
  }

  // Check if all values are unique (no mode)
  const uniqueValues = new Set(data)
  if (uniqueValues.size === data.length) {
    warnings.mode =
      'No mode exists - all values appear exactly once. Consider using mean or median instead.'
  }

  return warnings
}

/**
 * Validate that data is suitable for a specific calculation type
 *
 * @param data - Numeric data array
 * @param calculationType - Type of calculation to validate for
 * @returns Object with isValid flag and optional error message
 */
export function validateForCalculationType(
  data: number[],
  calculationType: 'arithmetic' | 'geometric' | 'harmonic'
): { isValid: boolean; error?: string } {
  switch (calculationType) {
    case 'geometric':
      const hasNegative = data.some(n => n < 0)
      const hasZero = data.some(n => n === 0)

      if (hasZero) {
        return {
          isValid: false,
          error: 'Geometric mean cannot be calculated with zero values in the dataset',
        }
      }

      if (hasNegative) {
        return {
          isValid: false,
          error: 'Geometric mean is not defined for negative numbers',
        }
      }
      break

    case 'harmonic':
      const hasNonPositive = data.some(n => n <= 0)

      if (hasNonPositive) {
        return {
          isValid: false,
          error: 'Harmonic mean requires all values to be positive (greater than zero)',
        }
      }
      break

    case 'arithmetic':
      // Arithmetic mean works with any numbers
      break
  }

  return { isValid: true }
}

/**
 * Sanitize and prepare data for calculations
 * Removes NaN, Infinity, and optionally filters based on criteria
 *
 * @param data - Raw numeric array
 * @returns Sanitized array of valid finite numbers
 */
export function sanitizeData(data: number[]): number[] {
  return data.filter(n => Number.isFinite(n))
}
