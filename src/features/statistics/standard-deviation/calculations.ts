import type {
  StandardDeviationInputs,
  StandardDeviationResult,
  StandardDeviationValidation,
  ParsedData,
  DeviationStep,
  CalculationType,
} from './types'

/**
 * Round to specified decimal places
 */
function roundToDecimals(value: number, decimals: number = 6): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Detect if input uses European number format (comma as decimal separator)
 * European format: 1.234,56 (period for thousands, comma for decimals)
 * US format: 1,234.56 (comma for thousands, period for decimals)
 */
function detectEuropeanFormat(input: string): boolean {
  // If semicolons or newlines are used as delimiters, likely European format
  if (/[;\n]/.test(input) && /\d,\d/.test(input)) {
    return true
  }

  // Check for European decimal pattern: digit + comma + 1-2 digits at end of number
  // e.g., "1,5" or "123,45" but not "1,234" (which is US thousands separator)
  const europeanPattern = /\d,\d{1,2}(?:\s|;|\n|$)/
  const usPattern = /\d\.\d{1,2}(?:\s|,|;|\n|$)/

  const hasEuropeanDecimals = europeanPattern.test(input)
  const hasUsDecimals = usPattern.test(input)

  // If has European-style decimals but no US-style decimals, it's European
  if (hasEuropeanDecimals && !hasUsDecimals) {
    return true
  }

  return false
}

/**
 * Parse data input string into array of numbers
 * Accepts comma, space, tab, newline, or semicolon as delimiters
 * Handles both US (1,234.56) and European (1.234,56) number formats
 */
export function parseDataInput(input: string): ParsedData {
  if (!input || input.trim().length === 0) {
    return { values: [], invalidValues: [], count: 0 }
  }

  const isEuropean = detectEuropeanFormat(input)

  let normalizedInput = input

  if (isEuropean) {
    // European format: periods are thousands separators, commas are decimals
    // First, remove periods (thousands separator), then convert commas to periods
    normalizedInput = input
      .replace(/(\d)\.(\d{3})/g, '$1$2') // Remove period thousands separators
      .replace(/,/g, '.') // Convert comma decimals to periods
  } else {
    // US format: commas are either delimiters or thousands separators
    // Remove commas that are thousands separators (digit,3digits pattern)
    normalizedInput = input.replace(/(\d),(\d{3})(?!\d)/g, '$1$2')
  }

  // Split by common delimiters (space, tab, newline, semicolon, and comma for non-European)
  const delimiterPattern = isEuropean ? /[\s;\t\n]+/ : /[\s,;\t\n]+/

  const parts = normalizedInput
    .split(delimiterPattern)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  const values: number[] = []
  const invalidValues: string[] = []

  for (const part of parts) {
    const num = parseFloat(part)

    if (isNaN(num)) {
      invalidValues.push(part)
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
 * Validate standard deviation inputs
 */
export function validateStandardDeviationInputs(
  inputs: StandardDeviationInputs
): StandardDeviationValidation {
  const errors: StandardDeviationValidation['errors'] = []
  const warnings: StandardDeviationValidation['warnings'] = []

  // Parse the data input
  const parsedData = parseDataInput(inputs.dataInput)

  // Check for invalid values
  if (parsedData.invalidValues.length > 0) {
    errors.push({
      field: 'dataInput',
      message: `Invalid values detected: ${parsedData.invalidValues.slice(0, 5).join(', ')}${parsedData.invalidValues.length > 5 ? '...' : ''}`,
    })
  }

  // Check for empty data
  if (parsedData.count === 0) {
    errors.push({
      field: 'dataInput',
      message: 'Please enter at least one number',
    })
  }

  // Check for single value with sample type
  if (parsedData.count === 1 && inputs.calculationType === 'sample') {
    errors.push({
      field: 'dataInput',
      message: 'Sample standard deviation requires at least 2 values. Use population mode for a single value.',
    })
  }

  // Warning for small sample size
  if (parsedData.count >= 2 && parsedData.count < 5 && inputs.calculationType === 'sample') {
    warnings.push({
      field: 'dataInput',
      message: 'Small sample size may lead to unreliable estimates',
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
    parsedData,
  }
}

/**
 * Calculate mean (average) of values
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0
  const sum = values.reduce((acc, val) => acc + val, 0)
  return sum / values.length
}

/**
 * Calculate sum of squared deviations from mean
 */
export function calculateSumOfSquares(values: number[], mean: number): number {
  return values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0)
}

/**
 * Calculate variance
 * Population: divide by n
 * Sample: divide by n-1 (Bessel's correction)
 */
export function calculateVariance(
  sumOfSquares: number,
  count: number,
  type: CalculationType
): number {
  if (count === 0) return 0
  if (count === 1 && type === 'sample') return 0

  const divisor = type === 'sample' ? count - 1 : count
  return sumOfSquares / divisor
}

/**
 * Calculate standard deviation
 */
export function calculateStandardDeviation(variance: number): number {
  return Math.sqrt(variance)
}

/**
 * Calculate standard error of the mean (SEM)
 * SEM = s / √n
 */
export function calculateStandardError(
  standardDeviation: number,
  count: number
): number {
  if (count === 0) return 0
  return standardDeviation / Math.sqrt(count)
}

/**
 * Calculate coefficient of variation (CV)
 * CV = (SD / mean) * 100
 */
export function calculateCoefficientOfVariation(
  standardDeviation: number,
  mean: number
): number | undefined {
  if (mean === 0) return undefined
  return (standardDeviation / Math.abs(mean)) * 100
}

/**
 * Generate deviation steps for educational display
 */
export function generateDeviationSteps(
  values: number[],
  mean: number
): DeviationStep[] {
  return values.map((value) => {
    const deviation = value - mean
    return {
      value,
      deviation: roundToDecimals(deviation),
      squaredDeviation: roundToDecimals(deviation * deviation),
    }
  })
}

/**
 * Main calculation function for standard deviation
 */
export function calculateStandardDeviationResult(
  inputs: StandardDeviationInputs,
  parsedData: ParsedData
): StandardDeviationResult {
  const { values } = parsedData
  const { calculationType } = inputs
  const n = values.length

  // Calculate basic statistics
  const sum = roundToDecimals(values.reduce((acc, val) => acc + val, 0))
  const mean = roundToDecimals(calculateMean(values))
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = roundToDecimals(max - min)

  // Calculate sum of squares and variance
  const sumOfSquares = roundToDecimals(calculateSumOfSquares(values, mean))
  const divisor = calculationType === 'sample' ? n - 1 : n
  const variance = roundToDecimals(calculateVariance(sumOfSquares, n, calculationType))
  const standardDeviation = roundToDecimals(calculateStandardDeviation(variance))

  // Calculate additional statistics
  const standardError =
    calculationType === 'sample'
      ? roundToDecimals(calculateStandardError(standardDeviation, n))
      : undefined

  const coefficientOfVariation =
    mean !== 0
      ? roundToDecimals(calculateCoefficientOfVariation(standardDeviation, mean) || 0)
      : undefined

  // Generate step-by-step deviations
  const deviations = generateDeviationSteps(values, mean)

  // Generate formula string
  const formula =
    calculationType === 'sample'
      ? 's = √[Σ(xi - x̄)² / (n-1)]'
      : 'σ = √[Σ(xi - μ)² / N]'

  return {
    standardDeviation,
    variance,
    mean,
    count: n,
    sum,
    sumOfSquares,
    range,
    min,
    max,
    standardError,
    coefficientOfVariation,
    calculationType,
    values,
    deviations,
    formula,
    divisor,
  }
}
