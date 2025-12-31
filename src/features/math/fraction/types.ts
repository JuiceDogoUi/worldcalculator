/**
 * Fraction operation modes
 */
export type FractionMode =
  | 'add' // Add two fractions
  | 'subtract' // Subtract two fractions
  | 'multiply' // Multiply two fractions
  | 'divide' // Divide two fractions
  | 'simplify' // Simplify a single fraction
  | 'convert' // Convert between formats

/**
 * Conversion output format
 */
export type ConversionFormat = 'decimal' | 'percentage' | 'mixed' | 'improper'

/**
 * Represents a fraction with numerator and denominator
 */
export interface Fraction {
  numerator: number
  denominator: number
  wholeNumber?: number // For mixed numbers
}

/**
 * Input interface for fraction calculations
 */
export interface FractionInputs {
  mode: FractionMode

  // First fraction (all modes except simplify use this)
  fraction1: Fraction

  // Second fraction (add, subtract, multiply, divide modes)
  fraction2?: Fraction

  // Conversion format (only for convert mode)
  conversionFormat?: ConversionFormat
}

/**
 * Simplified fraction result
 */
export interface SimplifiedFraction {
  numerator: number
  denominator: number
  wholeNumber?: number
  isNegative: boolean
}

/**
 * Result interface for fraction calculations
 */
export interface FractionResult {
  mode: FractionMode

  // The calculated result as a fraction
  result: SimplifiedFraction

  // Display formats
  fractionDisplay: string // e.g., "3/4" or "1 3/4"
  decimalValue: number
  percentageValue: number

  // Calculation steps for educational purposes
  steps: CalculationStep[]

  // Formula used
  formula: string

  // Human-readable explanation
  explanation: string

  // For conversion mode
  conversionResults?: {
    decimal: number
    percentage: number
    mixedNumber?: string
    improperFraction?: string
  }
}

/**
 * Step in the calculation process
 */
export interface CalculationStep {
  stepNumber: number
  description: string
  expression: string
  result?: string
}

/**
 * Validation result for fraction inputs
 */
export interface FractionValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
