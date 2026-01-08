/**
 * Probability Calculator - Calculation Functions
 * Pure functions for probability calculations
 */

import type {
  ProbabilityInputs,
  ProbabilityResult,
  ProbabilityValidation,
  CalculationStep,
  CalcTranslations,
} from './types'

/**
 * Round to specified decimal places
 */
export function roundToDecimals(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Calculate Greatest Common Divisor (for fraction simplification)
 */
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }
  return a
}

/**
 * Convert decimal to simplified fraction
 */
function decimalToFraction(
  decimal: number,
  maxDenominator: number = 1000
): { numerator: number; denominator: number } | null {
  if (decimal < 0 || decimal > 1) return null

  // Handle edge cases
  if (decimal === 0) return { numerator: 0, denominator: 1 }
  if (decimal === 1) return { numerator: 1, denominator: 1 }

  // Find best fraction approximation
  let bestNumerator = 0
  let bestDenominator = 1
  let bestError = Math.abs(decimal)

  for (let d = 1; d <= maxDenominator; d++) {
    const n = Math.round(decimal * d)
    const error = Math.abs(decimal - n / d)
    if (error < bestError) {
      bestError = error
      bestNumerator = n
      bestDenominator = d
      if (error < 0.0000001) break
    }
  }

  // Simplify
  const divisor = gcd(bestNumerator, bestDenominator)
  return {
    numerator: bestNumerator / divisor,
    denominator: bestDenominator / divisor,
  }
}

/**
 * Calculate odds representation
 */
function calculateOdds(probability: number): { oddsFor: string; oddsAgainst: string } {
  if (probability <= 0) return { oddsFor: '0:1', oddsAgainst: '1:0' }
  if (probability >= 1) return { oddsFor: '1:0', oddsAgainst: '0:1' }

  // Convert to odds ratio
  const oddsForRatio = probability / (1 - probability)

  // Find nice integer representation
  let forNum: number, forDen: number

  if (oddsForRatio >= 1) {
    // Try to find integers that give this ratio
    forDen = 1
    forNum = Math.round(oddsForRatio)

    // Refine for better accuracy
    for (let d = 1; d <= 100; d++) {
      const n = Math.round(oddsForRatio * d)
      if (Math.abs(n / d - oddsForRatio) < 0.001) {
        const divisor = gcd(n, d)
        forNum = n / divisor
        forDen = d / divisor
        if (forNum <= 100 && forDen <= 100) break
      }
    }
  } else {
    forNum = 1
    forDen = Math.round(1 / oddsForRatio)

    for (let n = 1; n <= 100; n++) {
      const d = Math.round(n / oddsForRatio)
      if (d > 0 && Math.abs(n / d - oddsForRatio) < 0.001) {
        const divisor = gcd(n, d)
        forNum = n / divisor
        forDen = d / divisor
        if (forNum <= 100 && forDen <= 100) break
      }
    }
  }

  return {
    oddsFor: `${forNum}:${forDen}`,
    oddsAgainst: `${forDen}:${forNum}`,
  }
}

/**
 * Validate probability inputs
 */
export function validateProbabilityInputs(inputs: ProbabilityInputs): ProbabilityValidation {
  const errors: ProbabilityValidation['errors'] = []
  const warnings: ProbabilityValidation['warnings'] = []

  // Validate based on mode
  switch (inputs.mode) {
    case 'single':
      if (!Number.isFinite(inputs.favorableOutcomes) || inputs.favorableOutcomes < 0) {
        errors.push({ field: 'favorableOutcomes', message: 'Must be a non-negative number' })
      }
      if (!Number.isFinite(inputs.totalOutcomes) || inputs.totalOutcomes <= 0) {
        errors.push({ field: 'totalOutcomes', message: 'Must be a positive number' })
      }
      if (inputs.favorableOutcomes > inputs.totalOutcomes) {
        errors.push({ field: 'favorableOutcomes', message: 'Cannot exceed total outcomes' })
      }
      break

    case 'and':
    case 'or':
      if (!Number.isFinite(inputs.probabilityA) || inputs.probabilityA < 0 || inputs.probabilityA > 1) {
        errors.push({ field: 'probabilityA', message: 'Must be between 0 and 1' })
      }
      if (!Number.isFinite(inputs.probabilityB) || inputs.probabilityB < 0 || inputs.probabilityB > 1) {
        errors.push({ field: 'probabilityB', message: 'Must be between 0 and 1' })
      }

      // For dependent AND events
      if (inputs.mode === 'and' && inputs.relationship === 'dependent') {
        if (
          inputs.probabilityBGivenA === undefined ||
          !Number.isFinite(inputs.probabilityBGivenA) ||
          inputs.probabilityBGivenA < 0 ||
          inputs.probabilityBGivenA > 1
        ) {
          errors.push({ field: 'probabilityBGivenA', message: 'Must be between 0 and 1' })
        }
      }

      // For OR with known intersection
      if (inputs.mode === 'or' && inputs.relationship === 'dependent') {
        if (
          inputs.probabilityAAndB === undefined ||
          !Number.isFinite(inputs.probabilityAAndB) ||
          inputs.probabilityAAndB < 0 ||
          inputs.probabilityAAndB > 1
        ) {
          errors.push({ field: 'probabilityAAndB', message: 'Must be between 0 and 1' })
        }
        // Check that P(A∩B) doesn't exceed P(A) or P(B)
        if (
          inputs.probabilityAAndB !== undefined &&
          (inputs.probabilityAAndB > inputs.probabilityA ||
            inputs.probabilityAAndB > inputs.probabilityB)
        ) {
          errors.push({
            field: 'probabilityAAndB',
            message: 'Cannot exceed P(A) or P(B)',
          })
        }
      }
      break

    case 'conditional':
      if (!Number.isFinite(inputs.probabilityA) || inputs.probabilityA < 0 || inputs.probabilityA > 1) {
        errors.push({ field: 'probabilityA', message: 'Must be between 0 and 1' })
      }
      if (!Number.isFinite(inputs.probabilityB) || inputs.probabilityB < 0 || inputs.probabilityB > 1) {
        errors.push({ field: 'probabilityB', message: 'Must be between 0 and 1' })
      }
      if (inputs.probabilityB === 0) {
        errors.push({ field: 'probabilityB', message: 'Cannot be zero (division by zero)' })
      }
      if (
        inputs.probabilityAAndB === undefined ||
        !Number.isFinite(inputs.probabilityAAndB) ||
        inputs.probabilityAAndB < 0 ||
        inputs.probabilityAAndB > 1
      ) {
        errors.push({ field: 'probabilityAAndB', message: 'Must be between 0 and 1' })
      }
      // P(A∩B) cannot exceed P(B) for valid conditional probability
      if (
        inputs.probabilityAAndB !== undefined &&
        inputs.probabilityB !== undefined &&
        inputs.probabilityAAndB > inputs.probabilityB
      ) {
        errors.push({ field: 'probabilityAAndB', message: 'Cannot exceed P(B)' })
      }
      break
  }

  // Validate precision
  if (inputs.decimalPrecision < 1 || inputs.decimalPrecision > 10) {
    errors.push({ field: 'decimalPrecision', message: 'Must be between 1 and 10' })
  }

  // Warnings for edge cases
  if (inputs.mode === 'single' && inputs.favorableOutcomes === 0) {
    warnings.push({ field: 'favorableOutcomes', message: 'Zero favorable outcomes means impossible event' })
  }
  if (inputs.mode === 'single' && inputs.favorableOutcomes === inputs.totalOutcomes) {
    warnings.push({ field: 'favorableOutcomes', message: 'Favorable equals total means certain event' })
  }

  return { valid: errors.length === 0, errors, warnings }
}

/**
 * Calculate single event probability
 */
function calculateSingleEvent(
  inputs: ProbabilityInputs,
  tr: CalcTranslations
): ProbabilityResult {
  const { favorableOutcomes, totalOutcomes, decimalPrecision } = inputs
  const steps: CalculationStep[] = []

  // Step 1: Identify values
  steps.push({
    stepNumber: 1,
    description: tr.stepIdentifyValues,
    expression: `${tr.favorableOutcomes} = ${favorableOutcomes}, ${tr.totalOutcomes} = ${totalOutcomes}`,
    result: '',
  })

  // Step 2: Apply formula
  const probability = favorableOutcomes / totalOutcomes
  steps.push({
    stepNumber: 2,
    description: tr.stepApplyFormula,
    expression: `P(A) = ${tr.favorableOutcomes} / ${tr.totalOutcomes}`,
    result: `P(A) = ${favorableOutcomes} / ${totalOutcomes}`,
  })

  // Step 3: Calculate result
  const roundedProbability = roundToDecimals(probability, decimalPrecision)
  steps.push({
    stepNumber: 3,
    description: tr.stepCalculateResult,
    expression: `P(A) = ${roundedProbability}`,
    result: `${roundedProbability}`,
  })

  // Step 4: Convert to percentage
  const probabilityPercent = roundToDecimals(probability * 100, Math.max(0, decimalPrecision - 2))
  steps.push({
    stepNumber: 4,
    description: tr.stepConvertToPercent,
    expression: `${roundedProbability} × 100`,
    result: `${probabilityPercent}%`,
  })

  // Calculate complement
  const complementProbability = roundToDecimals(1 - probability, decimalPrecision)
  const complementPercent = roundToDecimals((1 - probability) * 100, Math.max(0, decimalPrecision - 2))

  // Calculate odds
  const { oddsFor, oddsAgainst } = calculateOdds(probability)

  // Get fraction representation
  const fraction = decimalToFraction(probability)

  return {
    probability: roundedProbability,
    probabilityPercent,
    complementProbability,
    complementPercent,
    oddsFor,
    oddsAgainst,
    fractionNumerator: fraction?.numerator,
    fractionDenominator: fraction?.denominator,
    steps,
    formulaUsed: 'P(A) = favorable outcomes / total outcomes',
    formulaDescription: tr.formulaSingleEvent,
    warnings: [],
  }
}

/**
 * Calculate AND probability (P(A ∩ B))
 */
function calculateAndProbability(
  inputs: ProbabilityInputs,
  tr: CalcTranslations
): ProbabilityResult {
  const { probabilityA, probabilityB, relationship, probabilityBGivenA, decimalPrecision } = inputs
  const steps: CalculationStep[] = []
  const warnings: string[] = []

  let probability: number
  let formulaUsed: string
  let formulaDescription: string

  // Step 1: Identify values
  steps.push({
    stepNumber: 1,
    description: tr.stepIdentifyValues,
    expression: `P(A) = ${probabilityA}, P(B) = ${probabilityB}`,
    result: '',
  })

  if (relationship === 'independent') {
    // P(A ∩ B) = P(A) × P(B) for independent events
    probability = probabilityA * probabilityB
    formulaUsed = 'P(A ∩ B) = P(A) × P(B)'
    formulaDescription = tr.formulaAndIndependent

    steps.push({
      stepNumber: 2,
      description: tr.stepApplyFormula,
      expression: formulaUsed,
      result: `P(A ∩ B) = ${probabilityA} × ${probabilityB}`,
    })
  } else {
    // P(A ∩ B) = P(A) × P(B|A) for dependent events
    const pBGivenA = probabilityBGivenA ?? 0
    probability = probabilityA * pBGivenA
    formulaUsed = 'P(A ∩ B) = P(A) × P(B|A)'
    formulaDescription = tr.formulaAndDependent

    steps.push({
      stepNumber: 2,
      description: tr.stepApplyFormula,
      expression: `${formulaUsed}, ${tr.probabilityOfBGivenA} = ${pBGivenA}`,
      result: `P(A ∩ B) = ${probabilityA} × ${pBGivenA}`,
    })
  }

  const roundedProbability = roundToDecimals(probability, decimalPrecision)
  steps.push({
    stepNumber: 3,
    description: tr.stepCalculateResult,
    expression: `P(A ∩ B) = ${roundedProbability}`,
    result: `${roundedProbability}`,
  })

  const probabilityPercent = roundToDecimals(probability * 100, Math.max(0, decimalPrecision - 2))
  steps.push({
    stepNumber: 4,
    description: tr.stepConvertToPercent,
    expression: `${roundedProbability} × 100`,
    result: `${probabilityPercent}%`,
  })

  const complementProbability = roundToDecimals(1 - probability, decimalPrecision)
  const complementPercent = roundToDecimals((1 - probability) * 100, Math.max(0, decimalPrecision - 2))
  const { oddsFor, oddsAgainst } = calculateOdds(probability)
  const fraction = decimalToFraction(probability)

  return {
    probability: roundedProbability,
    probabilityPercent,
    complementProbability,
    complementPercent,
    oddsFor,
    oddsAgainst,
    fractionNumerator: fraction?.numerator,
    fractionDenominator: fraction?.denominator,
    steps,
    formulaUsed,
    formulaDescription,
    warnings,
  }
}

/**
 * Calculate OR probability (P(A ∪ B))
 */
function calculateOrProbability(
  inputs: ProbabilityInputs,
  tr: CalcTranslations
): ProbabilityResult {
  const { probabilityA, probabilityB, relationship, probabilityAAndB, decimalPrecision } = inputs
  const steps: CalculationStep[] = []
  const warnings: string[] = []

  let probability: number
  let formulaUsed: string
  let formulaDescription: string

  // Step 1: Identify values
  steps.push({
    stepNumber: 1,
    description: tr.stepIdentifyValues,
    expression: `P(A) = ${probabilityA}, P(B) = ${probabilityB}`,
    result: '',
  })

  if (relationship === 'independent') {
    // For independent events: P(A ∪ B) = P(A) + P(B) - P(A)×P(B)
    const intersection = probabilityA * probabilityB
    probability = probabilityA + probabilityB - intersection
    formulaUsed = 'P(A ∪ B) = P(A) + P(B) - P(A) × P(B)'
    formulaDescription = tr.formulaOrGeneral

    steps.push({
      stepNumber: 2,
      description: tr.stepApplyFormula,
      expression: formulaUsed,
      result: `P(A ∪ B) = ${probabilityA} + ${probabilityB} - ${roundToDecimals(intersection, decimalPrecision)}`,
    })
  } else {
    // For dependent events with known P(A ∩ B)
    const pAAndB = probabilityAAndB ?? 0
    probability = probabilityA + probabilityB - pAAndB
    formulaUsed = 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B)'
    formulaDescription = tr.formulaOrGeneral

    steps.push({
      stepNumber: 2,
      description: tr.stepApplyFormula,
      expression: `${formulaUsed}, P(A ∩ B) = ${pAAndB}`,
      result: `P(A ∪ B) = ${probabilityA} + ${probabilityB} - ${pAAndB}`,
    })
  }

  // Clamp result to [0, 1]
  if (probability > 1) {
    probability = 1
    warnings.push('Result clamped to 1 (100%)')
  }
  if (probability < 0) {
    probability = 0
    warnings.push('Result clamped to 0 (0%)')
  }

  const roundedProbability = roundToDecimals(probability, decimalPrecision)
  steps.push({
    stepNumber: 3,
    description: tr.stepCalculateResult,
    expression: `P(A ∪ B) = ${roundedProbability}`,
    result: `${roundedProbability}`,
  })

  const probabilityPercent = roundToDecimals(probability * 100, Math.max(0, decimalPrecision - 2))
  steps.push({
    stepNumber: 4,
    description: tr.stepConvertToPercent,
    expression: `${roundedProbability} × 100`,
    result: `${probabilityPercent}%`,
  })

  const complementProbability = roundToDecimals(1 - probability, decimalPrecision)
  const complementPercent = roundToDecimals((1 - probability) * 100, Math.max(0, decimalPrecision - 2))
  const { oddsFor, oddsAgainst } = calculateOdds(probability)
  const fraction = decimalToFraction(probability)

  return {
    probability: roundedProbability,
    probabilityPercent,
    complementProbability,
    complementPercent,
    oddsFor,
    oddsAgainst,
    fractionNumerator: fraction?.numerator,
    fractionDenominator: fraction?.denominator,
    steps,
    formulaUsed,
    formulaDescription,
    warnings,
  }
}

/**
 * Calculate conditional probability P(A|B)
 */
function calculateConditionalProbability(
  inputs: ProbabilityInputs,
  tr: CalcTranslations
): ProbabilityResult {
  const { probabilityB, probabilityAAndB, decimalPrecision } = inputs
  const steps: CalculationStep[] = []
  const warnings: string[] = []

  const pAAndB = probabilityAAndB ?? 0

  // Step 1: Identify values
  steps.push({
    stepNumber: 1,
    description: tr.stepIdentifyValues,
    expression: `P(A ∩ B) = ${pAAndB}, P(B) = ${probabilityB}`,
    result: '',
  })

  // P(A|B) = P(A ∩ B) / P(B)
  const formulaUsed = 'P(A|B) = P(A ∩ B) / P(B)'
  const formulaDescription = tr.formulaConditional

  steps.push({
    stepNumber: 2,
    description: tr.stepApplyFormula,
    expression: formulaUsed,
    result: `P(A|B) = ${pAAndB} / ${probabilityB}`,
  })

  let probability = pAAndB / probabilityB

  // Validate result
  if (probability > 1) {
    warnings.push('P(A ∩ B) cannot exceed P(B) - check your inputs')
    probability = 1
  }

  const roundedProbability = roundToDecimals(probability, decimalPrecision)
  steps.push({
    stepNumber: 3,
    description: tr.stepCalculateResult,
    expression: `P(A|B) = ${roundedProbability}`,
    result: `${roundedProbability}`,
  })

  const probabilityPercent = roundToDecimals(probability * 100, Math.max(0, decimalPrecision - 2))
  steps.push({
    stepNumber: 4,
    description: tr.stepConvertToPercent,
    expression: `${roundedProbability} × 100`,
    result: `${probabilityPercent}%`,
  })

  const complementProbability = roundToDecimals(1 - probability, decimalPrecision)
  const complementPercent = roundToDecimals((1 - probability) * 100, Math.max(0, decimalPrecision - 2))
  const { oddsFor, oddsAgainst } = calculateOdds(probability)
  const fraction = decimalToFraction(probability)

  return {
    probability: roundedProbability,
    probabilityPercent,
    complementProbability,
    complementPercent,
    oddsFor,
    oddsAgainst,
    fractionNumerator: fraction?.numerator,
    fractionDenominator: fraction?.denominator,
    steps,
    formulaUsed,
    formulaDescription,
    warnings,
  }
}

/**
 * Main calculation function - routes to appropriate calculator based on mode
 */
export function calculateProbability(
  inputs: ProbabilityInputs,
  tr: CalcTranslations
): ProbabilityResult {
  switch (inputs.mode) {
    case 'single':
      return calculateSingleEvent(inputs, tr)
    case 'and':
      return calculateAndProbability(inputs, tr)
    case 'or':
      return calculateOrProbability(inputs, tr)
    case 'conditional':
      return calculateConditionalProbability(inputs, tr)
    default:
      return calculateSingleEvent(inputs, tr)
  }
}
