/**
 * Square Root Calculator Types
 * Provides type definitions for square root and nth root calculations
 */

/**
 * Calculation mode for the square root calculator
 */
export type SquareRootMode =
  | 'square-root' // Calculate √x
  | 'nth-root' // Calculate ⁿ√x
  | 'square' // Calculate x² (reverse operation)

/**
 * Square root calculation inputs
 */
export interface SquareRootInputs {
  mode: SquareRootMode
  number: number
  nthRoot?: number // For nth root mode (default is 2 for square root)
}

/**
 * Simplified radical form representation
 * For example: √52 = 2√13 would be { coefficient: 2, radicand: 13 }
 */
export interface SimplifiedRadical {
  coefficient: number
  radicand: number
  isSimplified: boolean
}

/**
 * Prime factorization result
 */
export interface PrimeFactorization {
  factors: { prime: number; exponent: number }[]
  expression: string // e.g., "2² × 13"
}

/**
 * Square root calculation results
 */
export interface SquareRootResult {
  mode: SquareRootMode

  // Primary results
  positiveRoot: number
  negativeRoot: number

  // For display
  exactValue?: string // For perfect squares, e.g., "7"
  approximateValue: string // Decimal approximation, e.g., "7.211102551"

  // Simplified radical form (for non-perfect squares)
  simplifiedRadical?: SimplifiedRadical
  simplifiedDisplay?: string // e.g., "2√13"

  // Additional information
  isPerfectSquare: boolean
  isPerfectNthRoot: boolean
  originalNumber: number
  rootIndex: number // 2 for square root, n for nth root

  // Prime factorization (for educational purposes)
  primeFactorization?: PrimeFactorization

  // Calculation steps for educational display
  steps: CalculationStep[]

  // Formula used
  formula: string

  // Human-readable explanation
  explanation: string
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
 * Validation result for square root inputs
 */
export interface SquareRootValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
