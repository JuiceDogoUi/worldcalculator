/**
 * Confidence level presets (common Z-scores)
 */
export type ConfidenceLevelPreset = '90' | '95' | '99' | 'custom'

/**
 * Z-scores for common confidence levels
 */
export const Z_SCORES: Record<string, number> = {
  '90': 1.645, // 90% confidence
  '95': 1.96, // 95% confidence (most common)
  '99': 2.576, // 99% confidence
}

/**
 * Input interface for sample size calculations
 */
export interface SampleSizeInputs {
  // Confidence level selection
  confidenceLevelPreset: ConfidenceLevelPreset

  // Custom confidence level (0-100, used when preset is 'custom')
  customConfidenceLevel?: number

  // Margin of error as percentage (e.g., 5 for 5%)
  marginOfError: number

  // Population size (optional - for finite population correction)
  populationSize?: number

  // Expected proportion/response rate (0-100, default 50 for maximum sample size)
  expectedProportion: number
}

/**
 * Result interface for sample size calculations
 */
export interface SampleSizeResult {
  // Core result
  sampleSize: number

  // Sample size without finite population correction (infinite population)
  infiniteSampleSize: number

  // Whether finite population correction was applied
  finiteCorrectionApplied: boolean

  // Input parameters (for display)
  confidenceLevel: number
  zScore: number
  marginOfError: number
  populationSize?: number
  expectedProportion: number

  // Additional useful metrics
  marginOfErrorDecimal: number
  proportionDecimal: number

  // Response distribution (for visualization)
  expectedYes: number
  expectedNo: number

  // Sampling fraction (if population provided)
  samplingFraction?: number

  // Formula used (for educational display)
  formula: string
  formulaWithValues: string
}

/**
 * Validation result for sample size inputs
 */
export interface SampleSizeValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
  warnings?: {
    field: string
    message: string
  }[]
}
