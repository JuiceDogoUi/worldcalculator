/**
 * Input interface for GCD/LCM calculations
 */
export interface GCDInputs {
  // Raw number input as string (comma, space, or newline separated)
  numbersInput: string
}

/**
 * Parsed and validated data
 */
export interface ParsedNumbers {
  values: number[]
  invalidValues: string[]
  count: number
}

/**
 * Prime factorization of a single number
 */
export interface PrimeFactorization {
  number: number
  factors: Map<number, number> // prime -> exponent
  factorString: string // e.g., "2² × 3 × 5"
}

/**
 * Step in the Euclidean algorithm
 */
export interface EuclideanStep {
  a: number
  b: number
  quotient: number
  remainder: number
  equation: string // e.g., "48 = 18 × 2 + 12"
}

/**
 * Result interface for GCD/LCM calculations
 */
export interface GCDResult {
  // Core results
  gcd: number
  lcm: number

  // Input values
  numbers: number[]
  count: number

  // Prime factorizations for each input number
  factorizations: PrimeFactorization[]

  // GCD as prime factorization
  gcdFactorization: PrimeFactorization

  // LCM as prime factorization
  lcmFactorization: PrimeFactorization

  // Euclidean algorithm steps (for 2 numbers)
  euclideanSteps?: EuclideanStep[]

  // Coprime check (GCD = 1)
  areCoprime: boolean
}

/**
 * Validation result for GCD inputs
 */
export interface GCDValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
  warnings?: {
    field: string
    message: string
  }[]
  parsedNumbers?: ParsedNumbers
}
