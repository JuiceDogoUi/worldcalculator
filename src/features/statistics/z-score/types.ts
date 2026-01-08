/**
 * Calculation mode for Z-Score calculator
 * - 'z-score': Calculate z-score from value, mean, and standard deviation
 * - 'value': Calculate value from z-score, mean, and standard deviation
 */
export type CalculationMode = 'z-score' | 'value'

/**
 * Input interface for Z-Score calculations
 */
export interface ZScoreInputs {
  // The data point value (x)
  value: number | null

  // The population/sample mean (μ)
  mean: number | null

  // The standard deviation (σ)
  standardDeviation: number | null

  // The z-score (for reverse calculation)
  zScore: number | null

  // Calculation mode
  mode: CalculationMode
}

/**
 * P-value results for statistical significance
 */
export interface PValueResults {
  // Left-tailed p-value: P(Z ≤ z)
  leftTailed: number

  // Right-tailed p-value: P(Z ≥ z)
  rightTailed: number

  // Two-tailed p-value: P(|Z| ≥ |z|)
  twoTailed: number

  // Confidence level (1 - two-tailed p-value)
  confidenceLevel: number
}

/**
 * Result interface for Z-Score calculations
 */
export interface ZScoreResult {
  // Calculated z-score
  zScore: number

  // Calculated value (for reverse mode)
  value: number

  // Original inputs
  mean: number
  standardDeviation: number

  // Number of standard deviations from mean
  standardDeviationsFromMean: number

  // Percentile rank (approximate)
  percentile: number

  // P-value results
  pValues: PValueResults

  // Formula used
  formula: string

  // Interpretation text key
  interpretation: 'below_mean' | 'at_mean' | 'above_mean'
}

/**
 * Validation result for Z-Score inputs
 */
export interface ZScoreValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
