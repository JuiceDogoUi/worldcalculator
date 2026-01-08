import type {
  CorrelationInputs,
  CorrelationResult,
  CorrelationValidation,
  ParsedCorrelationData,
  DataPoint,
  CorrelationStrength,
  DeviationDetails,
  RegressionLine,
  SignificanceResult,
} from './types'

/**
 * Round to specified decimal places
 */
export function roundToDecimals(value: number, decimals: number = 6): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Detect if input uses European number format (comma as decimal separator)
 */
function detectEuropeanFormat(input: string): boolean {
  // If semicolons or newlines are used as delimiters, likely European format
  if (/[;\n]/.test(input) && /\d,\d/.test(input)) {
    return true
  }

  // Check for European decimal pattern
  const europeanPattern = /\d,\d{1,2}(?:\s|;|\n|$)/
  const usPattern = /\d\.\d{1,2}(?:\s|,|;|\n|$)/

  const hasEuropeanDecimals = europeanPattern.test(input)
  const hasUsDecimals = usPattern.test(input)

  if (hasEuropeanDecimals && !hasUsDecimals) {
    return true
  }

  return false
}

/**
 * Parse single data input string into array of numbers
 */
export function parseDataInput(input: string): {
  values: number[]
  invalidValues: string[]
} {
  if (!input || input.trim().length === 0) {
    return { values: [], invalidValues: [] }
  }

  const isEuropean = detectEuropeanFormat(input)
  let normalizedInput = input

  if (isEuropean) {
    normalizedInput = input
      .replace(/(\d)\.(\d{3})/g, '$1$2')
      .replace(/,/g, '.')
  } else {
    normalizedInput = input.replace(/(\d),(\d{3})(?!\d)/g, '$1$2')
  }

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

  return { values, invalidValues }
}

/**
 * Parse pairs input (e.g., "1,2\n3,4\n5,6") into data points
 */
export function parsePairsInput(input: string): {
  dataPoints: DataPoint[]
  xValues: number[]
  yValues: number[]
  invalidLines: string[]
} {
  if (!input || input.trim().length === 0) {
    return { dataPoints: [], xValues: [], yValues: [], invalidLines: [] }
  }

  const isEuropean = detectEuropeanFormat(input)
  const dataPoints: DataPoint[] = []
  const xValues: number[] = []
  const yValues: number[] = []
  const invalidLines: string[] = []

  // Split by newlines or semicolons
  const lines = input.split(/[\n;]+/).filter((line) => line.trim().length > 0)

  lines.forEach((line) => {
    let normalizedLine = line.trim()

    // Normalize European format
    if (isEuropean) {
      normalizedLine = normalizedLine
        .replace(/(\d)\.(\d{3})/g, '$1$2')
        .replace(/,/g, '.')
    }

    // Split by comma, space, or tab (use comma only for non-European)
    const parts = isEuropean
      ? normalizedLine.split(/[\s\t]+/)
      : normalizedLine.split(/[\s,\t]+/)

    const numericParts = parts
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
      .map((p) => parseFloat(p))
      .filter((n) => !isNaN(n))

    if (numericParts.length >= 2) {
      const x = numericParts[0]
      const y = numericParts[1]
      dataPoints.push({ x, y, index: dataPoints.length })
      xValues.push(x)
      yValues.push(y)
    } else if (line.trim().length > 0) {
      invalidLines.push(line.trim())
    }
  })

  return { dataPoints, xValues, yValues, invalidLines }
}

/**
 * Parse correlation inputs into paired data points based on input method
 */
export function parseCorrelationData(
  inputs: CorrelationInputs
): ParsedCorrelationData {
  if (inputs.inputMethod === 'pairs') {
    const { dataPoints, xValues, yValues, invalidLines } = parsePairsInput(
      inputs.pairsInput
    )
    return {
      dataPoints,
      xValues,
      yValues,
      count: dataPoints.length,
      invalidXValues: invalidLines,
      invalidYValues: [],
    }
  }

  // Columns mode
  const xParsed = parseDataInput(inputs.xDataInput)
  const yParsed = parseDataInput(inputs.yDataInput)

  const minLength = Math.min(xParsed.values.length, yParsed.values.length)

  const dataPoints: DataPoint[] = []
  for (let i = 0; i < minLength; i++) {
    dataPoints.push({
      x: xParsed.values[i],
      y: yParsed.values[i],
      index: i,
    })
  }

  return {
    dataPoints,
    xValues: xParsed.values.slice(0, minLength),
    yValues: yParsed.values.slice(0, minLength),
    count: minLength,
    invalidXValues: xParsed.invalidValues,
    invalidYValues: yParsed.invalidValues,
  }
}

/**
 * Validate correlation inputs
 */
export function validateCorrelationInputs(
  inputs: CorrelationInputs
): CorrelationValidation {
  const errors: CorrelationValidation['errors'] = []
  const warnings: CorrelationValidation['warnings'] = []

  const parsedData = parseCorrelationData(inputs)

  if (inputs.inputMethod === 'pairs') {
    // Check for invalid lines in pairs mode
    if (parsedData.invalidXValues.length > 0) {
      errors.push({
        field: 'pairsInput',
        message: `Invalid pairs: ${parsedData.invalidXValues.slice(0, 3).join(', ')}${parsedData.invalidXValues.length > 3 ? '...' : ''}`,
      })
    }
  } else {
    // Check for invalid values in columns mode
    if (parsedData.invalidXValues.length > 0) {
      errors.push({
        field: 'xDataInput',
        message: `Invalid X values: ${parsedData.invalidXValues.slice(0, 3).join(', ')}`,
      })
    }

    if (parsedData.invalidYValues.length > 0) {
      errors.push({
        field: 'yDataInput',
        message: `Invalid Y values: ${parsedData.invalidYValues.slice(0, 3).join(', ')}`,
      })
    }

    // Check for mismatched lengths
    const xParsed = parseDataInput(inputs.xDataInput)
    const yParsed = parseDataInput(inputs.yDataInput)

    if (
      xParsed.values.length !== yParsed.values.length &&
      xParsed.values.length > 0 &&
      yParsed.values.length > 0
    ) {
      warnings.push({
        field: 'yDataInput',
        message: `X has ${xParsed.values.length} values, Y has ${yParsed.values.length}. Using ${parsedData.count} paired values.`,
      })
    }
  }

  // Check for insufficient data points
  if (parsedData.count === 0) {
    const field = inputs.inputMethod === 'pairs' ? 'pairsInput' : 'xDataInput'
    errors.push({
      field,
      message: 'Please enter at least 2 data points',
    })
  } else if (parsedData.count === 1) {
    const field = inputs.inputMethod === 'pairs' ? 'pairsInput' : 'xDataInput'
    errors.push({
      field,
      message: 'Correlation requires at least 2 data points',
    })
  }

  // Warning for small sample
  if (parsedData.count >= 2 && parsedData.count < 5) {
    const field = inputs.inputMethod === 'pairs' ? 'pairsInput' : 'xDataInput'
    warnings.push({
      field,
      message: 'Small sample size may lead to unreliable correlation estimates',
    })
  }

  // Check for constant values (no variance)
  if (parsedData.count >= 2) {
    const xUnique = new Set(parsedData.xValues).size
    const yUnique = new Set(parsedData.yValues).size

    if (xUnique === 1) {
      warnings.push({
        field: inputs.inputMethod === 'pairs' ? 'pairsInput' : 'xDataInput',
        message:
          'All X values are identical. Correlation cannot be computed when there is no variance.',
      })
    }

    if (yUnique === 1) {
      warnings.push({
        field: inputs.inputMethod === 'pairs' ? 'pairsInput' : 'yDataInput',
        message:
          'All Y values are identical. Correlation cannot be computed when there is no variance.',
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings && warnings.length > 0 ? warnings : undefined,
    parsedData,
  }
}

/**
 * Calculate mean of values
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((acc, val) => acc + val, 0) / values.length
}

/**
 * Calculate standard deviation (sample)
 */
export function calculateStdDev(values: number[], mean: number): number {
  if (values.length < 2) return 0
  const sumSquares = values.reduce(
    (acc, val) => acc + Math.pow(val - mean, 2),
    0
  )
  return Math.sqrt(sumSquares / (values.length - 1))
}

/**
 * Calculate covariance (sample)
 */
export function calculateCovariance(
  xValues: number[],
  yValues: number[],
  xMean: number,
  yMean: number
): number {
  if (xValues.length < 2) return 0
  let sum = 0
  for (let i = 0; i < xValues.length; i++) {
    sum += (xValues[i] - xMean) * (yValues[i] - yMean)
  }
  return sum / (xValues.length - 1)
}

/**
 * Calculate Pearson correlation coefficient
 * r = Σ[(xi - x̄)(yi - ȳ)] / √[Σ(xi - x̄)² × Σ(yi - ȳ)²]
 */
export function calculatePearsonCorrelation(
  xValues: number[],
  yValues: number[]
): {
  r: number
  sumXDevYDev: number
  sumXDevSquared: number
  sumYDevSquared: number
  xMean: number
  yMean: number
} {
  const n = xValues.length
  if (n < 2) {
    return {
      r: 0,
      sumXDevYDev: 0,
      sumXDevSquared: 0,
      sumYDevSquared: 0,
      xMean: 0,
      yMean: 0,
    }
  }

  const xMean = calculateMean(xValues)
  const yMean = calculateMean(yValues)

  let sumXDevYDev = 0
  let sumXDevSquared = 0
  let sumYDevSquared = 0

  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean
    const yDiff = yValues[i] - yMean
    sumXDevYDev += xDiff * yDiff
    sumXDevSquared += xDiff * xDiff
    sumYDevSquared += yDiff * yDiff
  }

  const denominator = Math.sqrt(sumXDevSquared * sumYDevSquared)

  // Handle zero variance case
  if (denominator === 0) {
    return { r: 0, sumXDevYDev, sumXDevSquared, sumYDevSquared, xMean, yMean }
  }

  return {
    r: sumXDevYDev / denominator,
    sumXDevYDev,
    sumXDevSquared,
    sumYDevSquared,
    xMean,
    yMean,
  }
}

/**
 * Calculate linear regression line: y = mx + b
 */
export function calculateRegression(
  xValues: number[],
  yValues: number[],
  xMean: number,
  yMean: number,
  sumXDevSquared: number,
  sumXDevYDev: number,
  precision: number
): RegressionLine {
  if (sumXDevSquared === 0) {
    return {
      slope: 0,
      intercept: yMean,
      equation: `y = ${roundToDecimals(yMean, precision)}`,
    }
  }

  const slope = sumXDevYDev / sumXDevSquared
  const intercept = yMean - slope * xMean

  const slopeStr = roundToDecimals(slope, precision)
  const interceptStr = roundToDecimals(Math.abs(intercept), precision)
  const sign = intercept >= 0 ? '+' : '-'

  return {
    slope: roundToDecimals(slope, precision),
    intercept: roundToDecimals(intercept, precision),
    equation: `y = ${slopeStr}x ${sign} ${interceptStr}`,
  }
}

/**
 * Calculate t-statistic for correlation significance
 * t = r * sqrt((n-2) / (1-r²))
 */
export function calculateSignificance(
  r: number,
  n: number
): SignificanceResult | undefined {
  if (n < 3) return undefined

  const rSquared = r * r

  // Avoid division by zero
  if (rSquared >= 1) {
    return {
      tStatistic: Infinity,
      degreesOfFreedom: n - 2,
      pValueApprox: '< 0.001',
      isSignificant: true,
    }
  }

  const df = n - 2
  const tStatistic = r * Math.sqrt(df / (1 - rSquared))
  const absT = Math.abs(tStatistic)

  // Approximate p-value using t-distribution critical values
  // For two-tailed test at alpha = 0.05
  // This is a simplified approximation
  let pValueApprox: string
  let isSignificant: boolean

  // Critical t-values for common df (two-tailed, alpha=0.05)
  // For exact values, would need to use a proper t-distribution library
  const criticalT005 = getCriticalT(df, 0.05)
  const criticalT001 = getCriticalT(df, 0.01)
  const criticalT0001 = getCriticalT(df, 0.001)

  if (absT >= criticalT0001) {
    pValueApprox = '< 0.001'
    isSignificant = true
  } else if (absT >= criticalT001) {
    pValueApprox = '< 0.01'
    isSignificant = true
  } else if (absT >= criticalT005) {
    pValueApprox = '< 0.05'
    isSignificant = true
  } else {
    pValueApprox = '> 0.05'
    isSignificant = false
  }

  return {
    tStatistic: roundToDecimals(tStatistic, 4),
    degreesOfFreedom: df,
    pValueApprox,
    isSignificant,
  }
}

/**
 * Get critical t-value for given degrees of freedom and alpha level
 * Uses approximation formula for t-distribution
 */
function getCriticalT(df: number, alpha: number): number {
  // Simplified critical t-values lookup
  // In production, would use proper statistical library
  const criticalValues: Record<number, Record<number, number>> = {
    0.05: {
      1: 12.706,
      2: 4.303,
      3: 3.182,
      4: 2.776,
      5: 2.571,
      6: 2.447,
      7: 2.365,
      8: 2.306,
      9: 2.262,
      10: 2.228,
      15: 2.131,
      20: 2.086,
      30: 2.042,
      60: 2.0,
      120: 1.98,
    },
    0.01: {
      1: 63.657,
      2: 9.925,
      3: 5.841,
      4: 4.604,
      5: 4.032,
      6: 3.707,
      7: 3.499,
      8: 3.355,
      9: 3.25,
      10: 3.169,
      15: 2.947,
      20: 2.845,
      30: 2.75,
      60: 2.66,
      120: 2.617,
    },
    0.001: {
      1: 636.619,
      2: 31.599,
      3: 12.924,
      4: 8.61,
      5: 6.869,
      6: 5.959,
      7: 5.408,
      8: 5.041,
      9: 4.781,
      10: 4.587,
      15: 4.073,
      20: 3.85,
      30: 3.646,
      60: 3.46,
      120: 3.373,
    },
  }

  const dfTable = criticalValues[alpha]
  if (!dfTable) return 1.96 // Default to z-score

  // Find closest df
  const dfs = Object.keys(dfTable)
    .map(Number)
    .sort((a, b) => a - b)

  if (df >= 120) return dfTable[120]
  if (df <= 1) return dfTable[1]

  // Interpolate between nearest values
  for (let i = 0; i < dfs.length - 1; i++) {
    if (df >= dfs[i] && df < dfs[i + 1]) {
      // Linear interpolation
      const lower = dfs[i]
      const upper = dfs[i + 1]
      const ratio = (df - lower) / (upper - lower)
      return dfTable[lower] + ratio * (dfTable[upper] - dfTable[lower])
    }
  }

  return 1.96
}

/**
 * Interpret correlation strength
 */
export function interpretCorrelationStrength(r: number): CorrelationStrength {
  const absR = Math.abs(r)

  if (absR >= 0.9999) {
    return r > 0 ? 'perfect_positive' : 'perfect_negative'
  } else if (absR >= 0.7) {
    return r > 0 ? 'strong_positive' : 'strong_negative'
  } else if (absR >= 0.4) {
    return r > 0 ? 'moderate_positive' : 'moderate_negative'
  } else if (absR >= 0.2) {
    return r > 0 ? 'weak_positive' : 'weak_negative'
  } else {
    return 'negligible'
  }
}

/**
 * Generate deviation details for each data point
 */
export function generateDeviations(
  dataPoints: DataPoint[],
  xMean: number,
  yMean: number,
  precision: number
): DeviationDetails[] {
  return dataPoints.map((point) => {
    const xDeviation = point.x - xMean
    const yDeviation = point.y - yMean
    const product = xDeviation * yDeviation

    return {
      point,
      xDeviation: roundToDecimals(xDeviation, precision),
      yDeviation: roundToDecimals(yDeviation, precision),
      product: roundToDecimals(product, precision),
      xSquared: roundToDecimals(xDeviation * xDeviation, precision),
      ySquared: roundToDecimals(yDeviation * yDeviation, precision),
    }
  })
}

/**
 * Main calculation function for correlation
 */
export function calculateCorrelationResult(
  parsedData: ParsedCorrelationData,
  precision: number = 4
): CorrelationResult {
  const { xValues, yValues, dataPoints, count } = parsedData

  // Calculate Pearson correlation
  const {
    r,
    sumXDevYDev,
    sumXDevSquared,
    sumYDevSquared,
    xMean,
    yMean,
  } = calculatePearsonCorrelation(xValues, yValues)

  const correlationCoefficient = roundToDecimals(r, precision)
  const rSquared = roundToDecimals(r * r, precision)

  // Calculate standard deviations
  const xStdDev = roundToDecimals(calculateStdDev(xValues, xMean), precision)
  const yStdDev = roundToDecimals(calculateStdDev(yValues, yMean), precision)

  // Calculate covariance
  const covariance = roundToDecimals(
    calculateCovariance(xValues, yValues, xMean, yMean),
    precision
  )

  // Calculate sums for formula display
  const sumX = roundToDecimals(
    xValues.reduce((a, b) => a + b, 0),
    precision
  )
  const sumY = roundToDecimals(
    yValues.reduce((a, b) => a + b, 0),
    precision
  )
  const sumXY = roundToDecimals(
    xValues.reduce((acc, x, i) => acc + x * yValues[i], 0),
    precision
  )
  const sumX2 = roundToDecimals(
    xValues.reduce((acc, x) => acc + x * x, 0),
    precision
  )
  const sumY2 = roundToDecimals(
    yValues.reduce((acc, y) => acc + y * y, 0),
    precision
  )

  // Interpret strength and direction
  const strength = interpretCorrelationStrength(correlationCoefficient)

  let direction: 'positive' | 'negative' | 'none'
  if (Math.abs(correlationCoefficient) < 0.0001) {
    direction = 'none'
  } else if (correlationCoefficient > 0) {
    direction = 'positive'
  } else {
    direction = 'negative'
  }

  // Calculate regression line
  const regression = calculateRegression(
    xValues,
    yValues,
    xMean,
    yMean,
    sumXDevSquared,
    sumXDevYDev,
    precision
  )

  // Calculate significance
  const significance = calculateSignificance(correlationCoefficient, count)

  // Generate deviations for step-by-step display
  const deviations = generateDeviations(dataPoints, xMean, yMean, precision)

  return {
    correlationCoefficient,
    rSquared,
    count,
    strength,
    direction,
    xMean: roundToDecimals(xMean, precision),
    xStdDev,
    yMean: roundToDecimals(yMean, precision),
    yStdDev,
    covariance,
    sumX,
    sumY,
    sumXY,
    sumX2,
    sumY2,
    sumXDevYDev: roundToDecimals(sumXDevYDev, precision),
    sumXDevSquared: roundToDecimals(sumXDevSquared, precision),
    sumYDevSquared: roundToDecimals(sumYDevSquared, precision),
    regression,
    significance,
    deviations,
    dataPoints,
    formula: 'r = Σ[(xi - x̄)(yi - ȳ)] / √[Σ(xi - x̄)² × Σ(yi - ȳ)²]',
  }
}
