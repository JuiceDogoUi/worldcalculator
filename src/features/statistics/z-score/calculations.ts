import type {
  ZScoreInputs,
  ZScoreResult,
  ZScoreValidation,
  PValueResults,
} from './types'

/**
 * Round to specified decimal places
 */
function roundToDecimals(value: number, decimals: number = 6): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Error function approximation for normal distribution CDF
 * Uses Horner's method for polynomial approximation
 */
function erf(x: number): number {
  // Constants for approximation
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  // Save the sign of x
  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)

  // A&S formula 7.1.26
  const t = 1.0 / (1.0 + p * x)
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return sign * y
}

/**
 * Cumulative distribution function for standard normal distribution
 * Returns P(Z ≤ z)
 */
export function normalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.sqrt(2)))
}

/**
 * Calculate z-score from value, mean, and standard deviation
 * Formula: z = (x - μ) / σ
 */
export function calculateZScore(
  value: number,
  mean: number,
  standardDeviation: number
): number {
  if (standardDeviation === 0) {
    throw new Error('Standard deviation cannot be zero')
  }
  return (value - mean) / standardDeviation
}

/**
 * Calculate value from z-score, mean, and standard deviation
 * Formula: x = μ + z * σ
 */
export function calculateValueFromZScore(
  zScore: number,
  mean: number,
  standardDeviation: number
): number {
  return mean + zScore * standardDeviation
}

/**
 * Calculate p-values for a given z-score
 */
export function calculatePValues(zScore: number): PValueResults {
  // Left-tailed p-value: P(Z ≤ z)
  const leftTailed = normalCDF(zScore)

  // Right-tailed p-value: P(Z ≥ z) = 1 - P(Z ≤ z)
  const rightTailed = 1 - leftTailed

  // Two-tailed p-value: P(|Z| ≥ |z|) = 2 * min(leftTailed, rightTailed)
  const twoTailed = 2 * Math.min(leftTailed, rightTailed)

  // Confidence level: 1 - two-tailed p-value
  const confidenceLevel = 1 - twoTailed

  return {
    leftTailed: roundToDecimals(leftTailed, 6),
    rightTailed: roundToDecimals(rightTailed, 6),
    twoTailed: roundToDecimals(twoTailed, 6),
    confidenceLevel: roundToDecimals(confidenceLevel, 6),
  }
}

/**
 * Calculate percentile from z-score
 * Percentile = CDF(z) * 100
 */
export function calculatePercentile(zScore: number): number {
  return roundToDecimals(normalCDF(zScore) * 100, 2)
}

/**
 * Validate Z-Score calculator inputs
 */
export function validateZScoreInputs(inputs: ZScoreInputs): ZScoreValidation {
  const errors: ZScoreValidation['errors'] = []
  const { mode, value, mean, standardDeviation, zScore } = inputs

  if (mode === 'z-score') {
    // Forward calculation: need value, mean, and stdDev
    if (value === null || isNaN(value)) {
      errors.push({
        field: 'value',
        message: 'Please enter a value (x)',
      })
    }

    if (mean === null || isNaN(mean)) {
      errors.push({
        field: 'mean',
        message: 'Please enter the mean (μ)',
      })
    }

    if (standardDeviation === null || isNaN(standardDeviation)) {
      errors.push({
        field: 'standardDeviation',
        message: 'Please enter the standard deviation (σ)',
      })
    } else if (standardDeviation <= 0) {
      errors.push({
        field: 'standardDeviation',
        message: 'Standard deviation must be greater than 0',
      })
    }
  } else {
    // Reverse calculation: need zScore, mean, and stdDev
    if (zScore === null || isNaN(zScore)) {
      errors.push({
        field: 'zScore',
        message: 'Please enter a z-score',
      })
    }

    if (mean === null || isNaN(mean)) {
      errors.push({
        field: 'mean',
        message: 'Please enter the mean (μ)',
      })
    }

    if (standardDeviation === null || isNaN(standardDeviation)) {
      errors.push({
        field: 'standardDeviation',
        message: 'Please enter the standard deviation (σ)',
      })
    } else if (standardDeviation <= 0) {
      errors.push({
        field: 'standardDeviation',
        message: 'Standard deviation must be greater than 0',
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Main calculation function for Z-Score
 */
export function calculateZScoreResult(inputs: ZScoreInputs): ZScoreResult {
  const { mode, mean, standardDeviation } = inputs

  let calculatedZScore: number
  let calculatedValue: number
  let formula: string

  if (mode === 'z-score') {
    // Forward calculation
    calculatedValue = inputs.value!
    calculatedZScore = calculateZScore(
      calculatedValue,
      mean!,
      standardDeviation!
    )
    formula = 'z = (x - μ) / σ'
  } else {
    // Reverse calculation
    calculatedZScore = inputs.zScore!
    calculatedValue = calculateValueFromZScore(
      calculatedZScore,
      mean!,
      standardDeviation!
    )
    formula = 'x = μ + z × σ'
  }

  // Calculate additional statistics
  const pValues = calculatePValues(calculatedZScore)
  const percentile = calculatePercentile(calculatedZScore)

  // Determine interpretation
  let interpretation: ZScoreResult['interpretation']
  if (calculatedZScore < -0.0001) {
    interpretation = 'below_mean'
  } else if (calculatedZScore > 0.0001) {
    interpretation = 'above_mean'
  } else {
    interpretation = 'at_mean'
  }

  return {
    zScore: roundToDecimals(calculatedZScore, 4),
    value: roundToDecimals(calculatedValue, 4),
    mean: mean!,
    standardDeviation: standardDeviation!,
    standardDeviationsFromMean: roundToDecimals(Math.abs(calculatedZScore), 4),
    percentile,
    pValues,
    formula,
    interpretation,
  }
}
