import type {
  SquareRootInputs,
  SquareRootResult,
  SquareRootValidation,
  SimplifiedRadical,
  PrimeFactorization,
  CalculationStep,
} from './types'

/**
 * Calculate the prime factorization of a number
 */
export function getPrimeFactorization(n: number): PrimeFactorization {
  const factors: { prime: number; exponent: number }[] = []
  let num = Math.abs(Math.floor(n))

  if (num <= 1) {
    return {
      factors: [{ prime: num, exponent: 1 }],
      expression: num.toString(),
    }
  }

  let divisor = 2
  while (divisor * divisor <= num) {
    let exponent = 0
    while (num % divisor === 0) {
      exponent++
      num = num / divisor
    }
    if (exponent > 0) {
      factors.push({ prime: divisor, exponent })
    }
    divisor++
  }

  if (num > 1) {
    factors.push({ prime: num, exponent: 1 })
  }

  // Build expression string
  const expression = factors
    .map((f) => (f.exponent === 1 ? f.prime.toString() : `${f.prime}^${f.exponent}`))
    .join(' × ')

  return { factors, expression }
}

/**
 * Simplify a square root to its simplest radical form
 * e.g., √52 = 2√13
 */
export function simplifySquareRoot(n: number): SimplifiedRadical {
  if (n < 0) {
    return { coefficient: 0, radicand: Math.abs(n), isSimplified: false }
  }

  if (n === 0) {
    return { coefficient: 0, radicand: 0, isSimplified: true }
  }

  const sqrt = Math.sqrt(n)
  if (Number.isInteger(sqrt)) {
    // Perfect square
    return { coefficient: sqrt, radicand: 1, isSimplified: true }
  }

  // Find the largest perfect square factor
  let coefficient = 1
  let radicand = n

  // Get prime factorization and extract pairs
  const factorization = getPrimeFactorization(n)

  for (const { prime, exponent } of factorization.factors) {
    const pairsOutside = Math.floor(exponent / 2)
    const remaining = exponent % 2

    coefficient *= Math.pow(prime, pairsOutside)
    if (remaining > 0) {
      radicand = radicand / Math.pow(prime, exponent - remaining)
    } else {
      radicand = radicand / Math.pow(prime, exponent)
    }
  }

  // Recalculate radicand from remaining factors
  radicand = 1
  for (const { prime, exponent } of factorization.factors) {
    const remaining = exponent % 2
    if (remaining > 0) {
      radicand *= prime
    }
  }

  return {
    coefficient,
    radicand,
    isSimplified: coefficient > 1 || radicand === 1,
  }
}

/**
 * Simplify an nth root
 */
export function simplifyNthRoot(n: number, rootIndex: number): SimplifiedRadical {
  if (n < 0 && rootIndex % 2 === 0) {
    return { coefficient: 0, radicand: Math.abs(n), isSimplified: false }
  }

  if (n === 0) {
    return { coefficient: 0, radicand: 0, isSimplified: true }
  }

  const root = Math.pow(Math.abs(n), 1 / rootIndex)
  if (Math.abs(root - Math.round(root)) < 1e-10) {
    // Perfect nth root
    const sign = n < 0 ? -1 : 1
    return { coefficient: sign * Math.round(root), radicand: 1, isSimplified: true }
  }

  // For non-perfect nth roots, find factors that can be extracted
  let coefficient = 1
  let radicand = Math.abs(n)

  const factorization = getPrimeFactorization(Math.abs(n))

  for (const { prime, exponent } of factorization.factors) {
    const groupsOutside = Math.floor(exponent / rootIndex)
    const remaining = exponent % rootIndex

    coefficient *= Math.pow(prime, groupsOutside)
    radicand = radicand / Math.pow(prime, exponent - remaining)
  }

  // Recalculate radicand from remaining factors
  radicand = 1
  for (const { prime, exponent } of factorization.factors) {
    const remaining = exponent % rootIndex
    if (remaining > 0) {
      radicand *= Math.pow(prime, remaining)
    }
  }

  // Handle negative numbers for odd roots
  if (n < 0 && rootIndex % 2 === 1) {
    coefficient = -coefficient
  }

  return {
    coefficient,
    radicand,
    isSimplified: coefficient !== 1 || radicand === 1,
  }
}

/**
 * Check if a number is a perfect square
 */
export function isPerfectSquare(n: number): boolean {
  if (n < 0) return false
  const sqrt = Math.sqrt(n)
  return Number.isInteger(sqrt)
}

/**
 * Check if a number is a perfect nth root
 */
export function isPerfectNthRoot(n: number, rootIndex: number): boolean {
  if (n < 0 && rootIndex % 2 === 0) return false
  const root = Math.pow(Math.abs(n), 1 / rootIndex)
  return Math.abs(root - Math.round(root)) < 1e-10
}

/**
 * Format a simplified radical for display
 */
export function formatSimplifiedRadical(
  radical: SimplifiedRadical,
  rootIndex: number = 2
): string {
  if (radical.radicand === 1) {
    return radical.coefficient.toString()
  }

  if (radical.coefficient === 0) {
    return '0'
  }

  const rootSymbol = rootIndex === 2 ? '√' : `${rootIndex}√`

  if (radical.coefficient === 1) {
    return `${rootSymbol}${radical.radicand}`
  }

  return `${radical.coefficient}${rootSymbol}${radical.radicand}`
}

/**
 * Round to specified decimal places
 */
function roundToDecimals(value: number, decimals: number = 10): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Validate square root inputs
 */
export function validateSquareRootInputs(inputs: SquareRootInputs): SquareRootValidation {
  const errors: SquareRootValidation['errors'] = []
  const { mode, number, nthRoot } = inputs

  // Check for NaN
  if (isNaN(number)) {
    errors.push({
      field: 'number',
      message: 'Please enter a valid number',
    })
  }

  // Check for negative numbers with even roots
  if (mode === 'square-root' && number < 0) {
    errors.push({
      field: 'number',
      message: 'Cannot calculate square root of a negative number (result would be imaginary)',
    })
  }

  if (mode === 'nth-root') {
    if (nthRoot === undefined || nthRoot < 1) {
      errors.push({
        field: 'nthRoot',
        message: 'Root index must be at least 1',
      })
    } else if (!Number.isInteger(nthRoot)) {
      errors.push({
        field: 'nthRoot',
        message: 'Root index must be a whole number',
      })
    } else if (nthRoot % 2 === 0 && number < 0) {
      errors.push({
        field: 'number',
        message: 'Cannot calculate even root of a negative number',
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Calculate square root with all details
 */
function calculateSquareRootMode(number: number): SquareRootResult {
  const steps: CalculationStep[] = []
  const positiveRoot = Math.sqrt(number)
  const negativeRoot = -positiveRoot
  const perfect = isPerfectSquare(number)
  const simplified = simplifySquareRoot(number)
  const primeFactorization = number > 1 ? getPrimeFactorization(number) : undefined

  steps.push({
    stepNumber: 1,
    description: 'Identify the number under the radical',
    expression: `√${number}`,
  })

  if (primeFactorization && number > 1) {
    steps.push({
      stepNumber: 2,
      description: 'Find the prime factorization',
      expression: `${number} = ${primeFactorization.expression}`,
    })
  }

  if (perfect) {
    steps.push({
      stepNumber: steps.length + 1,
      description: 'This is a perfect square',
      expression: `√${number} = ${Math.sqrt(number)}`,
      result: Math.sqrt(number).toString(),
    })
  } else if (simplified.coefficient > 1) {
    steps.push({
      stepNumber: steps.length + 1,
      description: 'Extract perfect square factors',
      expression: `√${number} = √(${simplified.coefficient ** 2} × ${simplified.radicand}) = ${simplified.coefficient}√${simplified.radicand}`,
      result: formatSimplifiedRadical(simplified),
    })
  }

  steps.push({
    stepNumber: steps.length + 1,
    description: 'Calculate the decimal approximation',
    expression: `√${number} ≈ ${roundToDecimals(positiveRoot, 10)}`,
    result: `±${roundToDecimals(positiveRoot, 10)}`,
  })

  const explanation = perfect
    ? `The square root of ${number} is exactly ${Math.sqrt(number)} because ${Math.sqrt(number)} × ${Math.sqrt(number)} = ${number}.`
    : simplified.coefficient > 1
      ? `The square root of ${number} can be simplified to ${formatSimplifiedRadical(simplified)}, which equals approximately ${roundToDecimals(positiveRoot, 6)}.`
      : `The square root of ${number} is approximately ${roundToDecimals(positiveRoot, 6)}. This is an irrational number.`

  return {
    mode: 'square-root',
    positiveRoot: roundToDecimals(positiveRoot, 10),
    negativeRoot: roundToDecimals(negativeRoot, 10),
    exactValue: perfect ? Math.sqrt(number).toString() : undefined,
    approximateValue: roundToDecimals(positiveRoot, 10).toString(),
    simplifiedRadical: !perfect ? simplified : undefined,
    simplifiedDisplay: !perfect && simplified.coefficient > 1
      ? formatSimplifiedRadical(simplified)
      : undefined,
    isPerfectSquare: perfect,
    isPerfectNthRoot: perfect,
    originalNumber: number,
    rootIndex: 2,
    primeFactorization,
    steps,
    formula: '√x = x^(1/2)',
    explanation,
  }
}

/**
 * Calculate nth root with all details
 */
function calculateNthRootMode(number: number, rootIndex: number): SquareRootResult {
  const steps: CalculationStep[] = []
  const isEvenRoot = rootIndex % 2 === 0
  const absNumber = Math.abs(number)

  let positiveRoot: number
  let negativeRoot: number

  if (number >= 0) {
    positiveRoot = Math.pow(number, 1 / rootIndex)
    negativeRoot = isEvenRoot ? -positiveRoot : NaN
  } else {
    // Negative number with odd root
    positiveRoot = -Math.pow(absNumber, 1 / rootIndex)
    negativeRoot = NaN
  }

  const perfect = isPerfectNthRoot(number, rootIndex)
  const simplified = simplifyNthRoot(number, rootIndex)
  const primeFactorization = absNumber > 1 ? getPrimeFactorization(absNumber) : undefined

  const rootSymbol = rootIndex === 2 ? '√' : `${rootIndex}√`

  steps.push({
    stepNumber: 1,
    description: `Identify the ${getOrdinal(rootIndex)} root to calculate`,
    expression: `${rootSymbol}${number}`,
  })

  if (primeFactorization && absNumber > 1) {
    steps.push({
      stepNumber: 2,
      description: 'Find the prime factorization',
      expression: `${absNumber} = ${primeFactorization.expression}`,
    })
  }

  if (perfect) {
    const exactResult = Math.round(Math.pow(absNumber, 1 / rootIndex))
    const signedResult = number < 0 ? -exactResult : exactResult
    steps.push({
      stepNumber: steps.length + 1,
      description: `This is a perfect ${getOrdinal(rootIndex)} power`,
      expression: `${rootSymbol}${number} = ${signedResult}`,
      result: signedResult.toString(),
    })
  } else if (simplified.coefficient > 1) {
    steps.push({
      stepNumber: steps.length + 1,
      description: `Extract perfect ${getOrdinal(rootIndex)} power factors`,
      expression: `${rootSymbol}${number} = ${formatSimplifiedRadical(simplified, rootIndex)}`,
      result: formatSimplifiedRadical(simplified, rootIndex),
    })
  }

  steps.push({
    stepNumber: steps.length + 1,
    description: 'Calculate the decimal approximation',
    expression: `${rootSymbol}${number} ≈ ${roundToDecimals(positiveRoot, 10)}`,
    result: roundToDecimals(positiveRoot, 10).toString(),
  })

  const exactValue = perfect
    ? Math.round(Math.pow(absNumber, 1 / rootIndex)) * (number < 0 ? -1 : 1)
    : undefined

  const explanation = perfect
    ? `The ${getOrdinal(rootIndex)} root of ${number} is exactly ${exactValue}.`
    : simplified.coefficient > 1
      ? `The ${getOrdinal(rootIndex)} root of ${number} can be simplified to ${formatSimplifiedRadical(simplified, rootIndex)}, approximately ${roundToDecimals(positiveRoot, 6)}.`
      : `The ${getOrdinal(rootIndex)} root of ${number} is approximately ${roundToDecimals(positiveRoot, 6)}.`

  return {
    mode: 'nth-root',
    positiveRoot: roundToDecimals(positiveRoot, 10),
    negativeRoot: isEvenRoot && number >= 0 ? roundToDecimals(negativeRoot, 10) : NaN,
    exactValue: exactValue?.toString(),
    approximateValue: roundToDecimals(positiveRoot, 10).toString(),
    simplifiedRadical: !perfect ? simplified : undefined,
    simplifiedDisplay: !perfect && simplified.coefficient > 1
      ? formatSimplifiedRadical(simplified, rootIndex)
      : undefined,
    isPerfectSquare: rootIndex === 2 && perfect,
    isPerfectNthRoot: perfect,
    originalNumber: number,
    rootIndex,
    primeFactorization,
    steps,
    formula: `${rootSymbol}x = x^(1/${rootIndex})`,
    explanation,
  }
}

/**
 * Calculate square (reverse operation)
 */
function calculateSquareMode(number: number): SquareRootResult {
  const steps: CalculationStep[] = []
  const result = number * number

  steps.push({
    stepNumber: 1,
    description: 'Multiply the number by itself',
    expression: `${number} × ${number}`,
    result: result.toString(),
  })

  steps.push({
    stepNumber: 2,
    description: 'Verify: the square root of the result equals the original',
    expression: `√${result} = ${Math.abs(number)}`,
  })

  return {
    mode: 'square',
    positiveRoot: result,
    negativeRoot: result, // Same for square mode
    exactValue: result.toString(),
    approximateValue: result.toString(),
    isPerfectSquare: true,
    isPerfectNthRoot: true,
    originalNumber: number,
    rootIndex: 2,
    steps,
    formula: 'x² = x × x',
    explanation: `${number} squared equals ${result}. The square root of ${result} is ${Math.abs(number)}.`,
  }
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
function getOrdinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

/**
 * Main calculation function
 */
export function calculateSquareRoot(inputs: SquareRootInputs): SquareRootResult {
  const { mode, number, nthRoot = 2 } = inputs

  switch (mode) {
    case 'square-root':
      return calculateSquareRootMode(number)

    case 'nth-root':
      return calculateNthRootMode(number, nthRoot)

    case 'square':
      return calculateSquareMode(number)

    default:
      throw new Error(`Unknown calculation mode: ${mode}`)
  }
}
