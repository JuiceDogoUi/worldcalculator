/**
 * Calculation type - population or sample
 */
export type CalculationType = 'population' | 'sample'

/**
 * Input interface for standard deviation calculations
 */
export interface StandardDeviationInputs {
  // Raw data input as string (comma, space, or newline separated)
  dataInput: string

  // Calculation type
  calculationType: CalculationType
}

/**
 * Parsed and validated data
 */
export interface ParsedData {
  values: number[]
  invalidValues: string[]
  count: number
}

/**
 * Individual deviation from mean (for step-by-step display)
 */
export interface DeviationStep {
  value: number
  deviation: number // (xi - mean)
  squaredDeviation: number // (xi - mean)²
}

/**
 * Result interface for standard deviation calculations
 */
export interface StandardDeviationResult {
  // Core statistics
  standardDeviation: number
  variance: number
  mean: number
  count: number

  // Additional statistics
  sum: number
  sumOfSquares: number // Σ(xi - mean)²
  range: number
  min: number
  max: number

  // Standard error (only for sample)
  standardError?: number

  // Coefficient of variation (CV = SD/mean * 100)
  coefficientOfVariation?: number

  // Calculation type used
  calculationType: CalculationType

  // Original values
  values: number[]

  // Step-by-step deviations (for educational display)
  deviations: DeviationStep[]

  // Formula used
  formula: string

  // Divisor used (n or n-1)
  divisor: number
}

/**
 * Validation result for standard deviation inputs
 */
export interface StandardDeviationValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
  warnings?: {
    field: string
    message: string
  }[]
  parsedData?: ParsedData
}
