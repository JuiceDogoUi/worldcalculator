import type {
  Fraction,
  FractionInputs,
  FractionResult,
  FractionValidation,
  SimplifiedFraction,
  CalculationStep,
  ConversionFormat,
} from './types'

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
 * Convert a mixed number to an improper fraction
 */
export function toImproperFraction(fraction: Fraction): Fraction {
  const { numerator, denominator, wholeNumber = 0 } = fraction

  // Handle negative whole numbers
  const isNegative = wholeNumber < 0
  const absWhole = Math.abs(wholeNumber)

  const improperNumerator = absWhole * denominator + Math.abs(numerator)

  return {
    numerator: isNegative ? -improperNumerator : improperNumerator,
    denominator,
  }
}

/**
 * Convert an improper fraction to a mixed number
 */
export function toMixedNumber(numerator: number, denominator: number): SimplifiedFraction {
  if (denominator === 0) {
    return { numerator: 0, denominator: 1, isNegative: false }
  }

  const isNegative = (numerator < 0) !== (denominator < 0)
  const absNum = Math.abs(numerator)
  const absDen = Math.abs(denominator)

  const wholeNumber = Math.floor(absNum / absDen)
  const remainder = absNum % absDen

  if (wholeNumber === 0) {
    return {
      numerator: remainder,
      denominator: absDen,
      isNegative,
    }
  }

  return {
    numerator: remainder,
    denominator: absDen,
    wholeNumber,
    isNegative,
  }
}

/**
 * Simplify a fraction to its lowest terms
 */
export function simplifyFraction(numerator: number, denominator: number): SimplifiedFraction {
  if (denominator === 0) {
    return { numerator: 0, denominator: 1, isNegative: false }
  }

  const isNegative = (numerator < 0) !== (denominator < 0)
  const absNum = Math.abs(numerator)
  const absDen = Math.abs(denominator)

  const divisor = gcd(absNum, absDen)

  return {
    numerator: absNum / divisor,
    denominator: absDen / divisor,
    isNegative,
  }
}

/**
 * Format a simplified fraction for display
 */
export function formatFraction(fraction: SimplifiedFraction): string {
  const sign = fraction.isNegative ? '-' : ''

  if (fraction.denominator === 1 && !fraction.wholeNumber) {
    return `${sign}${fraction.numerator}`
  }

  if (fraction.wholeNumber) {
    if (fraction.numerator === 0) {
      return `${sign}${fraction.wholeNumber}`
    }
    return `${sign}${fraction.wholeNumber} ${fraction.numerator}/${fraction.denominator}`
  }

  if (fraction.numerator === 0) {
    return '0'
  }

  return `${sign}${fraction.numerator}/${fraction.denominator}`
}

/**
 * Convert fraction to decimal
 */
export function fractionToDecimal(numerator: number, denominator: number): number {
  if (denominator === 0) return 0
  return numerator / denominator
}

/**
 * Round to specified decimal places
 */
function roundToDecimals(value: number, decimals: number = 6): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Validate fraction inputs based on mode
 */
export function validateFractionInputs(inputs: FractionInputs): FractionValidation {
  const errors: FractionValidation['errors'] = []
  const { mode, fraction1, fraction2 } = inputs

  // Validate first fraction (required for all modes)
  if (fraction1.denominator === 0) {
    errors.push({
      field: 'fraction1.denominator',
      message: 'Denominator cannot be zero',
    })
  }

  // Validate second fraction for binary operations
  if (['add', 'subtract', 'multiply', 'divide'].includes(mode)) {
    if (!fraction2) {
      errors.push({
        field: 'fraction2',
        message: 'Second fraction is required for this operation',
      })
    } else {
      if (fraction2.denominator === 0) {
        errors.push({
          field: 'fraction2.denominator',
          message: 'Denominator cannot be zero',
        })
      }

      // Division by zero check
      if (mode === 'divide' && fraction2.numerator === 0 && (fraction2.wholeNumber === 0 || fraction2.wholeNumber === undefined)) {
        errors.push({
          field: 'fraction2.numerator',
          message: 'Cannot divide by zero',
        })
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Add two fractions
 */
function addFractions(f1: Fraction, f2: Fraction): FractionResult {
  const steps: CalculationStep[] = []

  // Convert to improper fractions if needed
  const imp1 = toImproperFraction(f1)
  const imp2 = toImproperFraction(f2)

  steps.push({
    stepNumber: 1,
    description: 'Convert to improper fractions if needed',
    expression: `${imp1.numerator}/${imp1.denominator} + ${imp2.numerator}/${imp2.denominator}`,
  })

  // Find LCD
  const lcd = lcm(imp1.denominator, imp2.denominator)
  const mult1 = lcd / imp1.denominator
  const mult2 = lcd / imp2.denominator

  steps.push({
    stepNumber: 2,
    description: `Find LCD (Least Common Denominator): ${lcd}`,
    expression: `LCD of ${imp1.denominator} and ${imp2.denominator} = ${lcd}`,
  })

  // Convert to equivalent fractions
  const newNum1 = imp1.numerator * mult1
  const newNum2 = imp2.numerator * mult2

  steps.push({
    stepNumber: 3,
    description: 'Convert to equivalent fractions with LCD',
    expression: `${newNum1}/${lcd} + ${newNum2}/${lcd}`,
  })

  // Add numerators
  const resultNum = newNum1 + newNum2

  steps.push({
    stepNumber: 4,
    description: 'Add the numerators',
    expression: `${newNum1} + ${newNum2} = ${resultNum}`,
    result: `${resultNum}/${lcd}`,
  })

  // Simplify
  const simplified = simplifyFraction(resultNum, lcd)
  const mixedResult = toMixedNumber(
    simplified.isNegative ? -simplified.numerator : simplified.numerator,
    simplified.denominator
  )

  if (simplified.numerator !== Math.abs(resultNum) || simplified.denominator !== lcd) {
    steps.push({
      stepNumber: 5,
      description: 'Simplify the result',
      expression: `${resultNum}/${lcd} = ${formatFraction(simplified)}`,
    })
  }

  const decimalValue = roundToDecimals(fractionToDecimal(
    simplified.isNegative ? -simplified.numerator : simplified.numerator,
    simplified.denominator
  ))

  // Format input fractions for explanation
  const f1Display = f1.wholeNumber
    ? `${f1.wholeNumber} ${f1.numerator}/${f1.denominator}`
    : `${f1.numerator}/${f1.denominator}`
  const f2Display = f2.wholeNumber
    ? `${f2.wholeNumber} ${f2.numerator}/${f2.denominator}`
    : `${f2.numerator}/${f2.denominator}`

  return {
    mode: 'add',
    result: mixedResult.wholeNumber ? mixedResult : simplified,
    fractionDisplay: formatFraction(mixedResult.wholeNumber ? mixedResult : simplified),
    decimalValue,
    percentageValue: roundToDecimals(decimalValue * 100, 4),
    steps,
    formula: 'a/b + c/d = (ad + bc) / bd',
    explanation: `Added ${f1Display} and ${f2Display} to get ${formatFraction(mixedResult.wholeNumber ? mixedResult : simplified)}`,
  }
}

/**
 * Subtract two fractions
 */
function subtractFractions(f1: Fraction, f2: Fraction): FractionResult {
  const steps: CalculationStep[] = []

  // Convert to improper fractions if needed
  const imp1 = toImproperFraction(f1)
  const imp2 = toImproperFraction(f2)

  steps.push({
    stepNumber: 1,
    description: 'Convert to improper fractions if needed',
    expression: `${imp1.numerator}/${imp1.denominator} - ${imp2.numerator}/${imp2.denominator}`,
  })

  // Find LCD
  const lcd = lcm(imp1.denominator, imp2.denominator)
  const mult1 = lcd / imp1.denominator
  const mult2 = lcd / imp2.denominator

  steps.push({
    stepNumber: 2,
    description: `Find LCD (Least Common Denominator): ${lcd}`,
    expression: `LCD of ${imp1.denominator} and ${imp2.denominator} = ${lcd}`,
  })

  // Convert to equivalent fractions
  const newNum1 = imp1.numerator * mult1
  const newNum2 = imp2.numerator * mult2

  steps.push({
    stepNumber: 3,
    description: 'Convert to equivalent fractions with LCD',
    expression: `${newNum1}/${lcd} - ${newNum2}/${lcd}`,
  })

  // Subtract numerators
  const resultNum = newNum1 - newNum2

  steps.push({
    stepNumber: 4,
    description: 'Subtract the numerators',
    expression: `${newNum1} - ${newNum2} = ${resultNum}`,
    result: `${resultNum}/${lcd}`,
  })

  // Simplify
  const simplified = simplifyFraction(resultNum, lcd)
  const mixedResult = toMixedNumber(
    simplified.isNegative ? -simplified.numerator : simplified.numerator,
    simplified.denominator
  )

  if (simplified.numerator !== Math.abs(resultNum) || simplified.denominator !== lcd) {
    steps.push({
      stepNumber: 5,
      description: 'Simplify the result',
      expression: `${resultNum}/${lcd} = ${formatFraction(simplified)}`,
    })
  }

  const decimalValue = roundToDecimals(fractionToDecimal(
    simplified.isNegative ? -simplified.numerator : simplified.numerator,
    simplified.denominator
  ))

  // Format input fractions for explanation
  const f1Display = f1.wholeNumber
    ? `${f1.wholeNumber} ${f1.numerator}/${f1.denominator}`
    : `${f1.numerator}/${f1.denominator}`
  const f2Display = f2.wholeNumber
    ? `${f2.wholeNumber} ${f2.numerator}/${f2.denominator}`
    : `${f2.numerator}/${f2.denominator}`

  return {
    mode: 'subtract',
    result: mixedResult.wholeNumber ? mixedResult : simplified,
    fractionDisplay: formatFraction(mixedResult.wholeNumber ? mixedResult : simplified),
    decimalValue,
    percentageValue: roundToDecimals(decimalValue * 100, 4),
    steps,
    formula: 'a/b - c/d = (ad - bc) / bd',
    explanation: `Subtracted ${f2Display} from ${f1Display} to get ${formatFraction(mixedResult.wholeNumber ? mixedResult : simplified)}`,
  }
}

/**
 * Multiply two fractions
 */
function multiplyFractions(f1: Fraction, f2: Fraction): FractionResult {
  const steps: CalculationStep[] = []

  // Convert to improper fractions if needed
  const imp1 = toImproperFraction(f1)
  const imp2 = toImproperFraction(f2)

  steps.push({
    stepNumber: 1,
    description: 'Convert to improper fractions if needed',
    expression: `${imp1.numerator}/${imp1.denominator} × ${imp2.numerator}/${imp2.denominator}`,
  })

  // Multiply numerators and denominators
  const resultNum = imp1.numerator * imp2.numerator
  const resultDen = imp1.denominator * imp2.denominator

  steps.push({
    stepNumber: 2,
    description: 'Multiply numerators and denominators',
    expression: `(${imp1.numerator} × ${imp2.numerator}) / (${imp1.denominator} × ${imp2.denominator})`,
    result: `${resultNum}/${resultDen}`,
  })

  // Simplify
  const simplified = simplifyFraction(resultNum, resultDen)
  const mixedResult = toMixedNumber(
    simplified.isNegative ? -simplified.numerator : simplified.numerator,
    simplified.denominator
  )

  if (simplified.numerator !== Math.abs(resultNum) || simplified.denominator !== resultDen) {
    steps.push({
      stepNumber: 3,
      description: 'Simplify the result',
      expression: `${resultNum}/${resultDen} = ${formatFraction(simplified)}`,
    })
  }

  const decimalValue = roundToDecimals(fractionToDecimal(
    simplified.isNegative ? -simplified.numerator : simplified.numerator,
    simplified.denominator
  ))

  // Format input fractions for explanation
  const f1Display = f1.wholeNumber
    ? `${f1.wholeNumber} ${f1.numerator}/${f1.denominator}`
    : `${f1.numerator}/${f1.denominator}`
  const f2Display = f2.wholeNumber
    ? `${f2.wholeNumber} ${f2.numerator}/${f2.denominator}`
    : `${f2.numerator}/${f2.denominator}`

  return {
    mode: 'multiply',
    result: mixedResult.wholeNumber ? mixedResult : simplified,
    fractionDisplay: formatFraction(mixedResult.wholeNumber ? mixedResult : simplified),
    decimalValue,
    percentageValue: roundToDecimals(decimalValue * 100, 4),
    steps,
    formula: 'a/b × c/d = (a × c) / (b × d)',
    explanation: `Multiplied ${f1Display} by ${f2Display} to get ${formatFraction(mixedResult.wholeNumber ? mixedResult : simplified)}`,
  }
}

/**
 * Divide two fractions
 */
function divideFractions(f1: Fraction, f2: Fraction): FractionResult {
  const steps: CalculationStep[] = []

  // Convert to improper fractions if needed
  const imp1 = toImproperFraction(f1)
  const imp2 = toImproperFraction(f2)

  steps.push({
    stepNumber: 1,
    description: 'Convert to improper fractions if needed',
    expression: `${imp1.numerator}/${imp1.denominator} ÷ ${imp2.numerator}/${imp2.denominator}`,
  })

  // Flip the second fraction and multiply
  steps.push({
    stepNumber: 2,
    description: 'Flip the second fraction (reciprocal)',
    expression: `${imp1.numerator}/${imp1.denominator} × ${imp2.denominator}/${imp2.numerator}`,
  })

  // Multiply
  const resultNum = imp1.numerator * imp2.denominator
  const resultDen = imp1.denominator * imp2.numerator

  steps.push({
    stepNumber: 3,
    description: 'Multiply numerators and denominators',
    expression: `(${imp1.numerator} × ${imp2.denominator}) / (${imp1.denominator} × ${imp2.numerator})`,
    result: `${resultNum}/${resultDen}`,
  })

  // Simplify
  const simplified = simplifyFraction(resultNum, resultDen)
  const mixedResult = toMixedNumber(
    simplified.isNegative ? -simplified.numerator : simplified.numerator,
    simplified.denominator
  )

  if (simplified.numerator !== Math.abs(resultNum) || simplified.denominator !== Math.abs(resultDen)) {
    steps.push({
      stepNumber: 4,
      description: 'Simplify the result',
      expression: `${resultNum}/${resultDen} = ${formatFraction(simplified)}`,
    })
  }

  const decimalValue = roundToDecimals(fractionToDecimal(
    simplified.isNegative ? -simplified.numerator : simplified.numerator,
    simplified.denominator
  ))

  // Format input fractions for explanation
  const f1Display = f1.wholeNumber
    ? `${f1.wholeNumber} ${f1.numerator}/${f1.denominator}`
    : `${f1.numerator}/${f1.denominator}`
  const f2Display = f2.wholeNumber
    ? `${f2.wholeNumber} ${f2.numerator}/${f2.denominator}`
    : `${f2.numerator}/${f2.denominator}`

  return {
    mode: 'divide',
    result: mixedResult.wholeNumber ? mixedResult : simplified,
    fractionDisplay: formatFraction(mixedResult.wholeNumber ? mixedResult : simplified),
    decimalValue,
    percentageValue: roundToDecimals(decimalValue * 100, 4),
    steps,
    formula: 'a/b ÷ c/d = a/b × d/c = (a × d) / (b × c)',
    explanation: `Divided ${f1Display} by ${f2Display} to get ${formatFraction(mixedResult.wholeNumber ? mixedResult : simplified)}`,
  }
}

/**
 * Simplify a fraction to lowest terms
 */
function simplifyFractionMode(f1: Fraction): FractionResult {
  const steps: CalculationStep[] = []

  // Convert to improper fraction if mixed number
  const imp = toImproperFraction(f1)

  if (f1.wholeNumber) {
    steps.push({
      stepNumber: 1,
      description: 'Convert mixed number to improper fraction',
      expression: `${f1.wholeNumber} ${f1.numerator}/${f1.denominator} = ${imp.numerator}/${imp.denominator}`,
    })
  }

  // Find GCD
  const divisor = gcd(Math.abs(imp.numerator), imp.denominator)

  steps.push({
    stepNumber: f1.wholeNumber ? 2 : 1,
    description: `Find GCD of ${Math.abs(imp.numerator)} and ${imp.denominator}`,
    expression: `GCD = ${divisor}`,
  })

  // Simplify
  const simplified = simplifyFraction(imp.numerator, imp.denominator)

  steps.push({
    stepNumber: f1.wholeNumber ? 3 : 2,
    description: 'Divide numerator and denominator by GCD',
    expression: `${imp.numerator}/${imp.denominator} = ${formatFraction(simplified)}`,
  })

  // Convert to mixed number if result is improper
  const mixedResult = toMixedNumber(
    simplified.isNegative ? -simplified.numerator : simplified.numerator,
    simplified.denominator
  )

  if (mixedResult.wholeNumber) {
    steps.push({
      stepNumber: steps.length + 1,
      description: 'Convert to mixed number',
      expression: `${formatFraction(simplified)} = ${formatFraction(mixedResult)}`,
    })
  }

  const decimalValue = roundToDecimals(fractionToDecimal(
    simplified.isNegative ? -simplified.numerator : simplified.numerator,
    simplified.denominator
  ))

  return {
    mode: 'simplify',
    result: mixedResult.wholeNumber ? mixedResult : simplified,
    fractionDisplay: formatFraction(mixedResult.wholeNumber ? mixedResult : simplified),
    decimalValue,
    percentageValue: roundToDecimals(decimalValue * 100, 4),
    steps,
    formula: 'Divide both numerator and denominator by their GCD',
    explanation: `Simplified ${imp.numerator}/${imp.denominator} to ${formatFraction(mixedResult.wholeNumber ? mixedResult : simplified)}`,
  }
}

/**
 * Convert a fraction to different formats
 */
function convertFraction(f1: Fraction, format: ConversionFormat): FractionResult {
  const steps: CalculationStep[] = []

  // Convert to improper fraction first
  const imp = toImproperFraction(f1)
  const simplified = simplifyFraction(imp.numerator, imp.denominator)

  steps.push({
    stepNumber: 1,
    description: 'Start with the fraction',
    expression: f1.wholeNumber
      ? `${f1.wholeNumber} ${f1.numerator}/${f1.denominator} = ${imp.numerator}/${imp.denominator}`
      : `${f1.numerator}/${f1.denominator}`,
  })

  const decimalValue = roundToDecimals(fractionToDecimal(imp.numerator, imp.denominator))
  const percentageValue = roundToDecimals(decimalValue * 100, 4)

  // Calculate all conversion results
  const mixedResult = toMixedNumber(imp.numerator, imp.denominator)

  const conversionResults = {
    decimal: decimalValue,
    percentage: percentageValue,
    mixedNumber: mixedResult.wholeNumber ? formatFraction(mixedResult) : undefined,
    improperFraction: `${imp.numerator}/${imp.denominator}`,
  }

  let resultDisplay: string
  let explanation: string

  switch (format) {
    case 'decimal':
      steps.push({
        stepNumber: 2,
        description: 'Divide numerator by denominator',
        expression: `${imp.numerator} ÷ ${imp.denominator} = ${decimalValue}`,
      })
      resultDisplay = decimalValue.toString()
      explanation = `Converted ${imp.numerator}/${imp.denominator} to decimal: ${decimalValue}`
      break

    case 'percentage':
      steps.push({
        stepNumber: 2,
        description: 'Divide and multiply by 100',
        expression: `(${imp.numerator} ÷ ${imp.denominator}) × 100 = ${percentageValue}%`,
      })
      resultDisplay = `${percentageValue}%`
      explanation = `Converted ${imp.numerator}/${imp.denominator} to percentage: ${percentageValue}%`
      break

    case 'mixed':
      if (Math.abs(imp.numerator) >= imp.denominator) {
        steps.push({
          stepNumber: 2,
          description: 'Divide to find whole number and remainder',
          expression: `${Math.abs(imp.numerator)} ÷ ${imp.denominator} = ${mixedResult.wholeNumber} remainder ${mixedResult.numerator}`,
        })
        steps.push({
          stepNumber: 3,
          description: 'Write as mixed number',
          expression: formatFraction(mixedResult),
        })
      }
      resultDisplay = formatFraction(mixedResult.wholeNumber ? mixedResult : simplified)
      explanation = `Converted to mixed number: ${resultDisplay}`
      break

    case 'improper':
      if (f1.wholeNumber) {
        steps.push({
          stepNumber: 2,
          description: 'Multiply whole number by denominator and add numerator',
          expression: `(${Math.abs(f1.wholeNumber)} × ${f1.denominator}) + ${f1.numerator} = ${Math.abs(imp.numerator)}`,
        })
      }
      resultDisplay = `${imp.numerator}/${imp.denominator}`
      explanation = `Converted to improper fraction: ${resultDisplay}`
      break
  }

  return {
    mode: 'convert',
    result: simplified,
    fractionDisplay: resultDisplay,
    decimalValue,
    percentageValue,
    steps,
    formula: format === 'decimal'
      ? 'numerator ÷ denominator = decimal'
      : format === 'percentage'
        ? '(numerator ÷ denominator) × 100 = percentage'
        : format === 'mixed'
          ? 'numerator ÷ denominator = whole remainder/denominator'
          : '(whole × denominator) + numerator = improper numerator',
    explanation,
    conversionResults,
  }
}

/**
 * Main calculation function that routes to specific operation based on mode
 */
export function calculateFraction(inputs: FractionInputs): FractionResult {
  const { mode, fraction1, fraction2, conversionFormat = 'decimal' } = inputs

  switch (mode) {
    case 'add':
      return addFractions(fraction1, fraction2!)

    case 'subtract':
      return subtractFractions(fraction1, fraction2!)

    case 'multiply':
      return multiplyFractions(fraction1, fraction2!)

    case 'divide':
      return divideFractions(fraction1, fraction2!)

    case 'simplify':
      return simplifyFractionMode(fraction1)

    case 'convert':
      return convertFraction(fraction1, conversionFormat)

    default:
      throw new Error(`Unknown calculation mode: ${mode}`)
  }
}
