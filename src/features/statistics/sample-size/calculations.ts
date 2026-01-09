import type {
  SampleSizeInputs,
  SampleSizeResult,
  SampleSizeValidation,
  ConfidenceLevelPreset,
} from './types'
import { Z_SCORES } from './types'

/**
 * Round to whole number (sample sizes are always integers)
 */
function roundUp(value: number): number {
  return Math.ceil(value)
}

/**
 * Round to specified decimal places for display
 */
function roundToDecimals(value: number, decimals: number = 4): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Get Z-score from confidence level
 * For common levels, use pre-calculated values
 * For custom levels, calculate using inverse normal distribution approximation
 */
export function getZScore(
  preset: ConfidenceLevelPreset,
  customLevel?: number
): number {
  if (preset !== 'custom' && Z_SCORES[preset]) {
    return Z_SCORES[preset]
  }

  // For custom confidence level, use approximation of inverse normal
  // This is the Abramowitz & Stegun approximation
  const confidence = (customLevel || 95) / 100
  const alpha = (1 - confidence) / 2

  // Rational approximation for inverse normal CDF
  // Source: Abramowitz & Stegun, Handbook of Mathematical Functions
  const t = Math.sqrt(-2 * Math.log(alpha))
  const c0 = 2.515517
  const c1 = 0.802853
  const c2 = 0.010328
  const d1 = 1.432788
  const d2 = 0.189269
  const d3 = 0.001308

  const z =
    t -
    (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t)

  return roundToDecimals(z, 3)
}

/**
 * Validate sample size inputs
 */
export function validateSampleSizeInputs(
  inputs: SampleSizeInputs
): SampleSizeValidation {
  const errors: SampleSizeValidation['errors'] = []
  const warnings: SampleSizeValidation['warnings'] = []

  // Validate margin of error
  if (inputs.marginOfError <= 0) {
    errors.push({
      field: 'marginOfError',
      message: 'Margin of error must be greater than 0%',
    })
  } else if (inputs.marginOfError > 50) {
    errors.push({
      field: 'marginOfError',
      message: 'Margin of error cannot exceed 50%',
    })
  } else if (inputs.marginOfError > 10) {
    warnings.push({
      field: 'marginOfError',
      message: 'Margin of error above 10% may produce unreliable results',
    })
  }

  // Validate expected proportion
  if (inputs.expectedProportion < 0 || inputs.expectedProportion > 100) {
    errors.push({
      field: 'expectedProportion',
      message: 'Expected proportion must be between 0% and 100%',
    })
  }

  // Validate population size (if provided)
  if (inputs.populationSize !== undefined) {
    if (inputs.populationSize <= 0) {
      errors.push({
        field: 'populationSize',
        message: 'Population size must be greater than 0',
      })
    } else if (inputs.populationSize < 10) {
      warnings.push({
        field: 'populationSize',
        message: 'For very small populations, consider surveying everyone',
      })
    }
  }

  // Validate custom confidence level
  if (inputs.confidenceLevelPreset === 'custom') {
    if (!inputs.customConfidenceLevel) {
      errors.push({
        field: 'customConfidenceLevel',
        message: 'Please enter a custom confidence level',
      })
    } else if (
      inputs.customConfidenceLevel < 50 ||
      inputs.customConfidenceLevel > 99.99
    ) {
      errors.push({
        field: 'customConfidenceLevel',
        message: 'Confidence level must be between 50% and 99.99%',
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}

/**
 * Calculate sample size for proportions
 *
 * Formula for infinite population (Cochran's formula):
 * n = (Z² * p * (1-p)) / E²
 *
 * With finite population correction (FPC):
 * n_adjusted = n / (1 + (n-1)/N)
 *
 * Where:
 * - Z = Z-score for confidence level
 * - p = expected proportion (as decimal)
 * - E = margin of error (as decimal)
 * - N = population size
 */
export function calculateSampleSize(inputs: SampleSizeInputs): SampleSizeResult {
  const {
    confidenceLevelPreset,
    customConfidenceLevel,
    marginOfError,
    populationSize,
    expectedProportion,
  } = inputs

  // Get Z-score
  const zScore = getZScore(confidenceLevelPreset, customConfidenceLevel)

  // Get confidence level for display
  const confidenceLevel =
    confidenceLevelPreset === 'custom'
      ? customConfidenceLevel!
      : parseFloat(confidenceLevelPreset)

  // Convert percentages to decimals
  const p = expectedProportion / 100
  const e = marginOfError / 100

  // Calculate sample size for infinite population
  // n = (Z² * p * (1-p)) / E²
  const zSquared = zScore * zScore
  const pq = p * (1 - p)
  const eSquared = e * e

  const infiniteSampleSize = (zSquared * pq) / eSquared

  // Apply finite population correction if population size is provided
  let finalSampleSize = infiniteSampleSize
  let finiteCorrectionApplied = false
  let samplingFraction: number | undefined

  if (populationSize && populationSize > 0) {
    // FPC: n_adjusted = n / (1 + (n-1)/N)
    // This is equivalent to: n_adjusted = (n * N) / (n + N - 1)
    finalSampleSize =
      (infiniteSampleSize * populationSize) /
      (infiniteSampleSize + populationSize - 1)
    finiteCorrectionApplied = true

    // Calculate sampling fraction
    samplingFraction = roundToDecimals(
      (Math.ceil(finalSampleSize) / populationSize) * 100,
      2
    )
  }

  // Round up to get integer sample size (always round up to ensure precision)
  const sampleSize = roundUp(finalSampleSize)

  // Calculate expected response distribution
  const expectedYes = roundToDecimals(sampleSize * p, 0)
  const expectedNo = sampleSize - expectedYes

  // Generate formula strings for educational display
  const formula = populationSize
    ? 'n = (Z² × p × (1-p) / E²) × N / (Z² × p × (1-p) / E² + N - 1)'
    : 'n = Z² × p × (1-p) / E²'

  const formulaWithValues = populationSize
    ? `n = (${zScore}² × ${p} × ${1 - p} / ${e}²) × ${populationSize} / (${zScore}² × ${p} × ${1 - p} / ${e}² + ${populationSize} - 1)`
    : `n = ${zScore}² × ${p} × ${1 - p} / ${e}²`

  return {
    sampleSize,
    infiniteSampleSize: roundUp(infiniteSampleSize),
    finiteCorrectionApplied,
    confidenceLevel,
    zScore: roundToDecimals(zScore, 3),
    marginOfError,
    populationSize,
    expectedProportion,
    marginOfErrorDecimal: roundToDecimals(e, 4),
    proportionDecimal: roundToDecimals(p, 4),
    expectedYes,
    expectedNo,
    samplingFraction,
    formula,
    formulaWithValues,
  }
}

/**
 * Generate sample size table for different confidence/margin combinations
 * Useful for comparison display
 */
export function generateSampleSizeTable(
  expectedProportion: number,
  populationSize?: number
): Array<{
  confidenceLevel: number
  marginOfError: number
  sampleSize: number
}> {
  const confidenceLevels = [90, 95, 99]
  const marginsOfError = [1, 2, 3, 5, 10]
  const results: Array<{
    confidenceLevel: number
    marginOfError: number
    sampleSize: number
  }> = []

  for (const cl of confidenceLevels) {
    for (const moe of marginsOfError) {
      const result = calculateSampleSize({
        confidenceLevelPreset: cl.toString() as ConfidenceLevelPreset,
        marginOfError: moe,
        expectedProportion,
        populationSize,
      })
      results.push({
        confidenceLevel: cl,
        marginOfError: moe,
        sampleSize: result.sampleSize,
      })
    }
  }

  return results
}
