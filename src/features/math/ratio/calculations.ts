import type {
  Ratio,
  RatioInputs,
  RatioResult,
  RatioValidation,
  SimplifiedRatio,
  RatioConversions,
  CalculationStep,
  CalcTranslations,
} from './types'

/**
 * Helper function to replace placeholders in translation strings
 */
function t(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (str, [key, value]) => str.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    template
  )
}

/**
 * Calculate the Greatest Common Divisor using Euclidean algorithm
 */
export function gcd(a: number, b: number): number {
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
 * Calculate the Least Common Multiple
 */
export function lcm(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  if (a === 0 || b === 0) return 0
  return (a * b) / gcd(a, b)
}

/**
 * Round to specified decimal places
 */
function roundToDecimals(value: number, decimals: number = 6): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Simplify a ratio to its lowest terms
 */
export function simplifyRatio(ratio: Ratio): SimplifiedRatio {
  const { antecedent, consequent } = ratio

  if (consequent === 0) {
    return {
      antecedent: antecedent,
      consequent: 0,
      gcd: 1,
      isSimplified: false,
    }
  }

  // Handle decimal inputs by converting to integers
  const isDecimal =
    !Number.isInteger(antecedent) || !Number.isInteger(consequent)
  if (isDecimal) {
    // Find appropriate multiplier to convert to integers
    const aDecimals = (antecedent.toString().split('.')[1] || '').length
    const bDecimals = (consequent.toString().split('.')[1] || '').length
    const maxDecimals = Math.max(aDecimals, bDecimals)
    const multiplier = Math.pow(10, maxDecimals)
    const intA = Math.round(antecedent * multiplier)
    const intB = Math.round(consequent * multiplier)
    const divisor = gcd(intA, intB)
    return {
      antecedent: intA / divisor,
      consequent: intB / divisor,
      gcd: divisor,
      isSimplified: divisor > 1,
    }
  }

  const divisor = gcd(Math.abs(antecedent), Math.abs(consequent))
  const simplified = {
    antecedent: antecedent / divisor,
    consequent: consequent / divisor,
    gcd: divisor,
    isSimplified: divisor > 1,
  }

  return simplified
}

/**
 * Format a ratio for display
 */
export function formatRatio(ratio: SimplifiedRatio | Ratio): string {
  const a = Number.isInteger(ratio.antecedent)
    ? ratio.antecedent
    : roundToDecimals(ratio.antecedent, 4)
  const b = Number.isInteger(ratio.consequent)
    ? ratio.consequent
    : roundToDecimals(ratio.consequent, 4)
  return `${a}:${b}`
}

/**
 * Convert ratio to various formats
 */
export function convertRatio(ratio: Ratio): RatioConversions {
  const decimal =
    ratio.consequent !== 0
      ? roundToDecimals(ratio.antecedent / ratio.consequent)
      : 0

  return {
    ratio: `${ratio.antecedent}:${ratio.consequent}`,
    fraction: `${ratio.antecedent}/${ratio.consequent}`,
    decimal,
    percentage: roundToDecimals(decimal * 100, 4),
    partsNotation: `${ratio.antecedent} part${ratio.antecedent !== 1 ? 's' : ''} to ${ratio.consequent} part${ratio.consequent !== 1 ? 's' : ''}`,
  }
}

/**
 * Validate ratio inputs based on mode
 */
export function validateRatioInputs(inputs: RatioInputs): RatioValidation {
  const errors: RatioValidation['errors'] = []
  const { mode, ratio, scaleTarget, proportion, compareRatio } = inputs

  // Validate primary ratio (all modes)
  if (ratio.consequent === 0) {
    errors.push({
      field: 'ratio.consequent',
      message: 'Consequent (second term) cannot be zero',
    })
  }

  // Mode-specific validation
  switch (mode) {
    case 'scale':
      if (!scaleTarget) {
        errors.push({
          field: 'scaleTarget',
          message: 'Scale target is required',
        })
      } else if (scaleTarget.value <= 0) {
        errors.push({
          field: 'scaleTarget.value',
          message: 'Scale target must be positive',
        })
      }
      break

    case 'find-missing':
      if (!proportion) {
        errors.push({
          field: 'proportion',
          message: 'Proportion values are required',
        })
      } else if (proportion.knownValue <= 0) {
        errors.push({
          field: 'proportion.knownValue',
          message: 'Known value must be positive',
        })
      }
      break

    case 'compare':
      if (!compareRatio) {
        errors.push({
          field: 'compareRatio',
          message: 'Second ratio is required for comparison',
        })
      } else if (compareRatio.consequent === 0) {
        errors.push({
          field: 'compareRatio.consequent',
          message: 'Second ratio consequent cannot be zero',
        })
      }
      break
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Simplify ratio mode
 */
function simplifyRatioMode(ratio: Ratio, tr: CalcTranslations): RatioResult {
  const steps: CalculationStep[] = []
  const simplified = simplifyRatio(ratio)

  steps.push({
    stepNumber: 1,
    description: tr.originalRatio,
    expression: formatRatio(ratio),
  })

  steps.push({
    stepNumber: 2,
    description: t(tr.findGcd, { a: ratio.antecedent, b: ratio.consequent }),
    expression: t(tr.gcdEquals, { gcd: simplified.gcd }),
  })

  steps.push({
    stepNumber: 3,
    description: tr.divideBothByGcd,
    expression: `${ratio.antecedent} ÷ ${simplified.gcd} : ${ratio.consequent} ÷ ${simplified.gcd}`,
    result: formatRatio(simplified),
  })

  return {
    mode: 'simplify',
    result: simplified,
    ratioDisplay: formatRatio(simplified),
    fractionDisplay: `${simplified.antecedent}/${simplified.consequent}`,
    conversions: convertRatio(simplified),
    steps,
    formula: tr.simplifyFormula,
    explanation: simplified.isSimplified
      ? t(tr.simplifiedExplanation, { from: formatRatio(ratio), to: formatRatio(simplified), gcd: simplified.gcd })
      : t(tr.alreadySimplest, { ratio: formatRatio(ratio) }),
  }
}

/**
 * Scale ratio mode
 */
function scaleRatioMode(
  ratio: Ratio,
  scaleTarget: NonNullable<RatioInputs['scaleTarget']>,
  tr: CalcTranslations
): RatioResult {
  const steps: CalculationStep[] = []
  const { position, value: targetValue } = scaleTarget

  const sourceValue =
    position === 'antecedent' ? ratio.antecedent : ratio.consequent
  const scaleFactor = targetValue / sourceValue
  const positionName = position === 'antecedent' ? tr.firstTerm : tr.secondTerm

  steps.push({
    stepNumber: 1,
    description: tr.originalRatio,
    expression: formatRatio(ratio),
  })

  steps.push({
    stepNumber: 2,
    description: t(tr.calculateScaleFactor, { position: positionName, value: targetValue }),
    expression: `${targetValue} ÷ ${sourceValue} = ${roundToDecimals(scaleFactor, 4)}`,
  })

  const scaledRatio: SimplifiedRatio = {
    antecedent: roundToDecimals(ratio.antecedent * scaleFactor, 4),
    consequent: roundToDecimals(ratio.consequent * scaleFactor, 4),
    gcd: 1,
    isSimplified: false,
  }

  steps.push({
    stepNumber: 3,
    description: tr.multiplyByScaleFactor,
    expression: `${ratio.antecedent} × ${roundToDecimals(scaleFactor, 4)} : ${ratio.consequent} × ${roundToDecimals(scaleFactor, 4)}`,
    result: formatRatio(scaledRatio),
  })

  return {
    mode: 'scale',
    result: scaledRatio,
    ratioDisplay: formatRatio(scaledRatio),
    fractionDisplay: `${scaledRatio.antecedent}/${scaledRatio.consequent}`,
    conversions: convertRatio(scaledRatio),
    steps,
    formula: tr.scaleFormula,
    explanation: t(tr.scaledExplanation, { from: formatRatio(ratio), to: formatRatio(scaledRatio), position: positionName, value: targetValue }),
    scaledRatio,
  }
}

/**
 * Find missing value mode (solve proportion)
 */
function findMissingMode(
  ratio: Ratio,
  proportion: NonNullable<RatioInputs['proportion']>,
  tr: CalcTranslations
): RatioResult {
  const steps: CalculationStep[] = []
  const { knownValue, knownPosition } = proportion

  // Solving: a:b = x:y where one of x or y is unknown
  // If knownPosition is 'antecedent': a:b = knownValue:?
  // If knownPosition is 'consequent': a:b = ?:knownValue

  let missingValue: number

  steps.push({
    stepNumber: 1,
    description: tr.setupProportion,
    expression:
      knownPosition === 'antecedent'
        ? `${ratio.antecedent}:${ratio.consequent} = ${knownValue}:?`
        : `${ratio.antecedent}:${ratio.consequent} = ?:${knownValue}`,
  })

  if (knownPosition === 'antecedent') {
    // a:b = knownValue:x, so x = (knownValue * b) / a
    missingValue = (knownValue * ratio.consequent) / ratio.antecedent

    steps.push({
      stepNumber: 2,
      description: tr.crossMultiply,
      expression: `${ratio.antecedent} × ? = ${ratio.consequent} × ${knownValue}`,
    })

    steps.push({
      stepNumber: 3,
      description: tr.solveForUnknown,
      expression: `? = (${ratio.consequent} × ${knownValue}) ÷ ${ratio.antecedent}`,
      result: `? = ${roundToDecimals(missingValue, 4)}`,
    })
  } else {
    // a:b = x:knownValue, so x = (knownValue * a) / b
    missingValue = (knownValue * ratio.antecedent) / ratio.consequent

    steps.push({
      stepNumber: 2,
      description: tr.crossMultiply,
      expression: `${ratio.consequent} × ? = ${ratio.antecedent} × ${knownValue}`,
    })

    steps.push({
      stepNumber: 3,
      description: tr.solveForUnknown,
      expression: `? = (${ratio.antecedent} × ${knownValue}) ÷ ${ratio.consequent}`,
      result: `? = ${roundToDecimals(missingValue, 4)}`,
    })
  }

  missingValue = roundToDecimals(missingValue, 4)

  const resultRatio: SimplifiedRatio = {
    antecedent: knownPosition === 'antecedent' ? knownValue : missingValue,
    consequent: knownPosition === 'consequent' ? knownValue : missingValue,
    gcd: 1,
    isSimplified: false,
  }

  return {
    mode: 'find-missing',
    result: resultRatio,
    ratioDisplay: formatRatio(resultRatio),
    fractionDisplay: `${resultRatio.antecedent}/${resultRatio.consequent}`,
    conversions: convertRatio(resultRatio),
    steps,
    formula: tr.proportionFormula,
    explanation: t(tr.missingExplanation, { value: missingValue, from: formatRatio(ratio), to: formatRatio(resultRatio) }),
    missingValue,
  }
}

/**
 * Convert ratio mode
 */
function convertRatioMode(ratio: Ratio, tr: CalcTranslations): RatioResult {
  const steps: CalculationStep[] = []
  const simplified = simplifyRatio(ratio)
  const conversions = convertRatio(simplified)

  steps.push({
    stepNumber: 1,
    description: tr.simplifyFirst,
    expression: `${formatRatio(ratio)} = ${formatRatio(simplified)}`,
  })

  steps.push({
    stepNumber: 2,
    description: tr.convertToFraction,
    expression: `${simplified.antecedent}:${simplified.consequent} = ${conversions.fraction}`,
  })

  steps.push({
    stepNumber: 3,
    description: tr.convertToDecimal,
    expression: `${simplified.antecedent} ÷ ${simplified.consequent} = ${conversions.decimal}`,
  })

  steps.push({
    stepNumber: 4,
    description: tr.convertToPercentage,
    expression: `${conversions.decimal} × 100 = ${conversions.percentage}%`,
  })

  return {
    mode: 'convert',
    result: simplified,
    ratioDisplay: formatRatio(simplified),
    fractionDisplay: conversions.fraction,
    conversions,
    steps,
    formula: tr.convertFormula,
    explanation: t(tr.convertExplanation, { ratio: formatRatio(ratio), fraction: conversions.fraction, decimal: conversions.decimal, percentage: conversions.percentage }),
  }
}

/**
 * Compare two ratios mode
 */
function compareRatiosMode(ratio1: Ratio, ratio2: Ratio, tr: CalcTranslations): RatioResult {
  const steps: CalculationStep[] = []

  // Convert both ratios to decimals for comparison
  const decimal1 = ratio1.antecedent / ratio1.consequent
  const decimal2 = ratio2.antecedent / ratio2.consequent

  steps.push({
    stepNumber: 1,
    description: tr.convertFirstRatio,
    expression: `${ratio1.antecedent} ÷ ${ratio1.consequent} = ${roundToDecimals(decimal1, 6)}`,
  })

  steps.push({
    stepNumber: 2,
    description: tr.convertSecondRatio,
    expression: `${ratio2.antecedent} ÷ ${ratio2.consequent} = ${roundToDecimals(decimal2, 6)}`,
  })

  const equal = Math.abs(decimal1 - decimal2) < 0.000001 // Floating point tolerance
  const firstGreater = decimal1 > decimal2
  const secondGreater = decimal2 > decimal1
  const difference = roundToDecimals(Math.abs(decimal1 - decimal2), 6)

  let comparisonSymbol: string
  if (equal) {
    comparisonSymbol = '='
  } else if (firstGreater) {
    comparisonSymbol = '>'
  } else {
    comparisonSymbol = '<'
  }

  steps.push({
    stepNumber: 3,
    description: tr.compareDecimals,
    expression: `${roundToDecimals(decimal1, 6)} ${comparisonSymbol} ${roundToDecimals(decimal2, 6)}`,
    result: equal ? tr.ratiosAreEqual : t(tr.differenceIs, { value: difference }),
  })

  const simplified1 = simplifyRatio(ratio1)

  return {
    mode: 'compare',
    result: simplified1,
    ratioDisplay: formatRatio(simplified1),
    fractionDisplay: `${simplified1.antecedent}/${simplified1.consequent}`,
    conversions: convertRatio(simplified1),
    steps,
    formula: tr.compareFormula,
    explanation: equal
      ? t(tr.equivalentExplanation, { r1: formatRatio(ratio1), r2: formatRatio(ratio2) })
      : firstGreater
        ? t(tr.greaterExplanation, { r1: formatRatio(ratio1), r2: formatRatio(ratio2) })
        : t(tr.lessExplanation, { r1: formatRatio(ratio1), r2: formatRatio(ratio2) }),
    comparisonResult: {
      equal,
      firstGreater,
      secondGreater,
      difference,
    },
  }
}

/**
 * Main calculation function that routes to specific operation based on mode
 */
export function calculateRatio(inputs: RatioInputs, translations: CalcTranslations): RatioResult {
  const { mode, ratio, scaleTarget, proportion, compareRatio } = inputs

  switch (mode) {
    case 'simplify':
      return simplifyRatioMode(ratio, translations)

    case 'scale':
      return scaleRatioMode(ratio, scaleTarget!, translations)

    case 'find-missing':
      return findMissingMode(ratio, proportion!, translations)

    case 'convert':
      return convertRatioMode(ratio, translations)

    case 'compare':
      return compareRatiosMode(ratio, compareRatio!, translations)

    default:
      throw new Error(`Unknown calculation mode: ${mode}`)
  }
}
