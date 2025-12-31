import type {
  GCDInputs,
  GCDResult,
  GCDValidation,
  ParsedNumbers,
  PrimeFactorization,
  EuclideanStep,
} from './types'

/**
 * Parse number input string into array of positive integers
 * Accepts comma, space, tab, newline, or semicolon as delimiters
 */
export function parseNumbersInput(input: string): ParsedNumbers {
  if (!input || input.trim().length === 0) {
    return { values: [], invalidValues: [], count: 0 }
  }

  // Split by common delimiters
  const parts = input
    .split(/[\s,;\t\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  const values: number[] = []
  const invalidValues: string[] = []

  for (const part of parts) {
    const num = parseInt(part, 10)

    if (isNaN(num)) {
      invalidValues.push(part)
    } else if (num <= 0) {
      invalidValues.push(part) // GCD/LCM requires positive integers
    } else if (!Number.isInteger(parseFloat(part))) {
      invalidValues.push(part) // Must be integers
    } else {
      values.push(num)
    }
  }

  return {
    values,
    invalidValues,
    count: values.length,
  }
}

/**
 * Validate GCD inputs
 */
export function validateGCDInputs(inputs: GCDInputs): GCDValidation {
  const errors: GCDValidation['errors'] = []
  const warnings: GCDValidation['warnings'] = []

  // Parse the number input
  const parsedNumbers = parseNumbersInput(inputs.numbersInput)

  // Check for invalid values
  if (parsedNumbers.invalidValues.length > 0) {
    errors.push({
      field: 'numbersInput',
      message: `Invalid values: ${parsedNumbers.invalidValues.slice(0, 5).join(', ')}${parsedNumbers.invalidValues.length > 5 ? '...' : ''}. Only positive integers are allowed.`,
    })
  }

  // Check for minimum count
  if (parsedNumbers.count === 0) {
    errors.push({
      field: 'numbersInput',
      message: 'Please enter at least two positive integers',
    })
  } else if (parsedNumbers.count === 1) {
    errors.push({
      field: 'numbersInput',
      message: 'Please enter at least two numbers to calculate GCD',
    })
  }

  // Warning for large numbers
  const hasLargeNumbers = parsedNumbers.values.some((v) => v > 1000000)
  if (hasLargeNumbers) {
    warnings.push({
      field: 'numbersInput',
      message: 'Large numbers may take longer to factorize',
    })
  }

  // Warning for many numbers
  if (parsedNumbers.count > 10) {
    warnings.push({
      field: 'numbersInput',
      message: 'Many numbers entered. Calculation may take longer.',
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
    parsedNumbers,
  }
}

/**
 * Calculate GCD of two numbers using Euclidean algorithm
 */
export function gcdOfTwo(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }
  return a
}

/**
 * Calculate GCD of multiple numbers
 */
export function gcdOfMultiple(numbers: number[]): number {
  if (numbers.length === 0) return 0
  if (numbers.length === 1) return numbers[0]

  let result = numbers[0]
  for (let i = 1; i < numbers.length; i++) {
    result = gcdOfTwo(result, numbers[i])
    if (result === 1) break // Optimization: GCD can't be less than 1
  }
  return result
}

/**
 * Calculate LCM of two numbers
 * LCM(a, b) = |a| / GCD(a, b) × |b|
 * Note: Division first to avoid overflow with large numbers
 */
export function lcmOfTwo(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  // Divide first to reduce overflow risk
  return Math.abs(a / gcdOfTwo(a, b)) * Math.abs(b)
}

/**
 * Calculate LCM of multiple numbers
 */
export function lcmOfMultiple(numbers: number[]): number {
  if (numbers.length === 0) return 0
  if (numbers.length === 1) return numbers[0]

  let result = numbers[0]
  for (let i = 1; i < numbers.length; i++) {
    result = lcmOfTwo(result, numbers[i])
  }
  return result
}

/**
 * Get prime factorization of a number
 */
export function getPrimeFactorization(n: number): PrimeFactorization {
  const factors = new Map<number, number>()
  let num = Math.abs(n)

  if (num <= 1) {
    return {
      number: n,
      factors,
      factorString: n === 1 ? '1' : String(n),
    }
  }

  // Factor out 2s first
  while (num % 2 === 0) {
    factors.set(2, (factors.get(2) || 0) + 1)
    num = num / 2
  }

  // Check odd factors from 3 to sqrt(n)
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    while (num % i === 0) {
      factors.set(i, (factors.get(i) || 0) + 1)
      num = num / i
    }
  }

  // If num is still greater than 1, it's a prime factor
  if (num > 1) {
    factors.set(num, 1)
  }

  // Create factor string
  const factorString = formatFactorization(factors)

  return {
    number: n,
    factors,
    factorString,
  }
}

/**
 * Format factorization map as string
 * e.g., Map {2 => 3, 3 => 1, 5 => 2} becomes "2³ × 3 × 5²"
 */
function formatFactorization(factors: Map<number, number>): string {
  if (factors.size === 0) return '1'

  const superscripts: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
  }

  const toSuperscript = (num: number): string => {
    return String(num)
      .split('')
      .map((d) => superscripts[d] || d)
      .join('')
  }

  const sortedPrimes = Array.from(factors.keys()).sort((a, b) => a - b)

  return sortedPrimes
    .map((prime) => {
      const exp = factors.get(prime)!
      if (exp === 1) return String(prime)
      return `${prime}${toSuperscript(exp)}`
    })
    .join(' × ')
}

/**
 * Calculate GCD from prime factorizations
 * GCD uses minimum exponent for each common prime
 */
export function gcdFromFactorizations(
  factorizations: PrimeFactorization[]
): PrimeFactorization {
  if (factorizations.length === 0) {
    return { number: 1, factors: new Map(), factorString: '1' }
  }

  // Get all primes that appear in ALL factorizations
  const allPrimes = new Set<number>()
  factorizations[0].factors.forEach((_, prime) => allPrimes.add(prime))

  for (let i = 1; i < factorizations.length; i++) {
    const currentPrimes = new Set(factorizations[i].factors.keys())
    allPrimes.forEach((prime) => {
      if (!currentPrimes.has(prime)) {
        allPrimes.delete(prime)
      }
    })
  }

  // For common primes, take minimum exponent
  const gcdFactors = new Map<number, number>()
  allPrimes.forEach((prime) => {
    const minExp = Math.min(
      ...factorizations.map((f) => f.factors.get(prime) || 0)
    )
    if (minExp > 0) {
      gcdFactors.set(prime, minExp)
    }
  })

  // Calculate the actual GCD value
  let gcdValue = 1
  gcdFactors.forEach((exp, prime) => {
    gcdValue *= Math.pow(prime, exp)
  })

  return {
    number: gcdValue,
    factors: gcdFactors,
    factorString: formatFactorization(gcdFactors),
  }
}

/**
 * Calculate LCM from prime factorizations
 * LCM uses maximum exponent for each prime
 */
export function lcmFromFactorizations(
  factorizations: PrimeFactorization[]
): PrimeFactorization {
  if (factorizations.length === 0) {
    return { number: 1, factors: new Map(), factorString: '1' }
  }

  // Get all primes from all factorizations
  const allPrimes = new Set<number>()
  factorizations.forEach((f) => {
    f.factors.forEach((_, prime) => allPrimes.add(prime))
  })

  // For each prime, take maximum exponent
  const lcmFactors = new Map<number, number>()
  allPrimes.forEach((prime) => {
    const maxExp = Math.max(
      ...factorizations.map((f) => f.factors.get(prime) || 0)
    )
    if (maxExp > 0) {
      lcmFactors.set(prime, maxExp)
    }
  })

  // Calculate the actual LCM value
  let lcmValue = 1
  lcmFactors.forEach((exp, prime) => {
    lcmValue *= Math.pow(prime, exp)
  })

  return {
    number: lcmValue,
    factors: lcmFactors,
    factorString: formatFactorization(lcmFactors),
  }
}

/**
 * Generate Euclidean algorithm steps for two numbers
 */
export function generateEuclideanSteps(a: number, b: number): EuclideanStep[] {
  const steps: EuclideanStep[] = []

  // Ensure a >= b
  if (a < b) {
    ;[a, b] = [b, a]
  }

  while (b !== 0) {
    const quotient = Math.floor(a / b)
    const remainder = a % b

    steps.push({
      a,
      b,
      quotient,
      remainder,
      equation: `${a} = ${b} × ${quotient} + ${remainder}`,
    })

    a = b
    b = remainder
  }

  return steps
}

/**
 * Main calculation function for GCD/LCM
 */
export function calculateGCDResult(parsedNumbers: ParsedNumbers): GCDResult {
  const { values } = parsedNumbers
  const n = values.length

  // Calculate GCD and LCM
  const gcd = gcdOfMultiple(values)
  const lcm = lcmOfMultiple(values)

  // Get prime factorizations for each number
  const factorizations = values.map((v) => getPrimeFactorization(v))

  // Get GCD and LCM as factorizations
  const gcdFactorization = gcdFromFactorizations(factorizations)
  const lcmFactorization = lcmFromFactorizations(factorizations)

  // Generate Euclidean steps only for 2 numbers
  const euclideanSteps =
    n === 2 ? generateEuclideanSteps(values[0], values[1]) : undefined

  // Check if numbers are coprime
  const areCoprime = gcd === 1

  return {
    gcd,
    lcm,
    numbers: values,
    count: n,
    factorizations,
    gcdFactorization,
    lcmFactorization,
    euclideanSteps,
    areCoprime,
  }
}
