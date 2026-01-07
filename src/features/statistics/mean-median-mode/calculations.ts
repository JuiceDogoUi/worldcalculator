import type {
  CentralTendencyInputs,
  CentralTendencyResult,
  CentralTendencyValidation,
  ParsedData,
  MeanDetails,
  MedianDetails,
  ModeResult,
  ModeType,
  FrequencyItem,
  QuartileResult,
  CalculationStep,
  CalcTranslations,
  MeanType,
} from './types'

/**
 * Round to specified decimal places
 */
export function roundToDecimals(value: number, decimals: number = 6): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

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
 * Detect if input uses European number format (comma as decimal separator)
 */
function detectEuropeanFormat(input: string): boolean {
  // If semicolons or newlines are used as delimiters, likely European format
  if (/[;\n]/.test(input) && /\d,\d/.test(input)) {
    return true
  }

  // Check for European decimal pattern: digit + comma + 1-2 digits at end of number
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
    normalizedInput = input
      .replace(/(\d)\.(\d{3})/g, '$1$2') // Remove period thousands separators
      .replace(/,/g, '.') // Convert comma decimals to periods
  } else {
    // US format: commas are either delimiters or thousands separators
    normalizedInput = input.replace(/(\d),(\d{3})(?!\d)/g, '$1$2')
  }

  // Split by common delimiters
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
 * Validate central tendency inputs
 */
export function validateCentralTendencyInputs(
  inputs: CentralTendencyInputs
): CentralTendencyValidation {
  const errors: CentralTendencyValidation['errors'] = []
  const warnings: CentralTendencyValidation['warnings'] = []

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

  // Parse weights if provided
  let parsedWeights: ParsedData | undefined

  if (inputs.meanType === 'weighted' && inputs.weightsInput && inputs.weightsInput.trim().length > 0) {
    parsedWeights = parseDataInput(inputs.weightsInput)

    // Check for invalid weight values
    if (parsedWeights.invalidValues.length > 0) {
      errors.push({
        field: 'weightsInput',
        message: `Invalid weight values: ${parsedWeights.invalidValues.slice(0, 5).join(', ')}${parsedWeights.invalidValues.length > 5 ? '...' : ''}`,
      })
    }

    // Check weight count matches data count
    if (parsedWeights.count > 0 && parsedWeights.count !== parsedData.count) {
      errors.push({
        field: 'weightsInput',
        message: `Number of weights (${parsedWeights.count}) must match number of values (${parsedData.count})`,
      })
    }

    // Check for non-positive weights
    const hasNonPositiveWeights = parsedWeights.values.some((w) => w <= 0)
    if (hasNonPositiveWeights) {
      errors.push({
        field: 'weightsInput',
        message: 'All weights must be positive numbers',
      })
    }
  } else if (inputs.meanType === 'weighted' && (!inputs.weightsInput || inputs.weightsInput.trim().length === 0)) {
    errors.push({
      field: 'weightsInput',
      message: 'Please enter weights for weighted mean calculation',
    })
  }

  // Warnings for geometric/harmonic mean
  if (parsedData.count > 0) {
    const hasNonPositive = parsedData.values.some((v) => v <= 0)
    const hasZero = parsedData.values.some((v) => v === 0)

    if (inputs.meanType === 'geometric' && hasNonPositive) {
      warnings.push({
        field: 'dataInput',
        message: 'Geometric mean requires all positive values. Non-positive values detected.',
      })
    }

    if (inputs.meanType === 'harmonic' && (hasZero || hasNonPositive)) {
      warnings.push({
        field: 'dataInput',
        message: 'Harmonic mean requires all positive non-zero values.',
      })
    }

    // Warning for single value
    if (parsedData.count === 1) {
      warnings.push({
        field: 'dataInput',
        message: 'Single value: all measures equal this value.',
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
    parsedData,
    parsedWeights,
  }
}

/**
 * Calculate arithmetic mean
 */
export function calculateArithmeticMean(values: number[]): number {
  if (values.length === 0) return 0
  const sum = values.reduce((acc, val) => acc + val, 0)
  return sum / values.length
}

/**
 * Calculate geometric mean
 * Returns null if any value is non-positive
 */
export function calculateGeometricMean(values: number[]): number | null {
  if (values.length === 0) return 0

  // Geometric mean requires all positive values
  if (values.some((v) => v <= 0)) {
    return null
  }

  // Use log transformation to avoid overflow for large datasets
  const logSum = values.reduce((acc, val) => acc + Math.log(val), 0)
  return Math.exp(logSum / values.length)
}

/**
 * Calculate harmonic mean
 * Returns null if any value is zero or negative
 */
export function calculateHarmonicMean(values: number[]): number | null {
  if (values.length === 0) return 0

  // Harmonic mean requires all positive non-zero values
  if (values.some((v) => v <= 0)) {
    return null
  }

  const reciprocalSum = values.reduce((acc, val) => acc + 1 / val, 0)
  return values.length / reciprocalSum
}

/**
 * Calculate weighted mean
 * Returns null if weights are not provided or invalid
 */
export function calculateWeightedMean(
  values: number[],
  weights: number[]
): { mean: number; weightSum: number; weightedSum: number } | null {
  if (values.length === 0 || weights.length === 0) return null
  if (values.length !== weights.length) return null

  const weightSum = weights.reduce((acc, w) => acc + w, 0)
  if (weightSum === 0) return null

  const weightedSum = values.reduce((acc, val, i) => acc + val * weights[i], 0)

  return {
    mean: weightedSum / weightSum,
    weightSum,
    weightedSum,
  }
}

/**
 * Calculate median with detailed information
 */
export function calculateMedian(values: number[], precision: number): MedianDetails {
  if (values.length === 0) {
    return {
      value: 0,
      position: '',
      middleIndices: [],
      middleValues: [],
      sortedValues: [],
      isInterpolated: false,
    }
  }

  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length

  if (n === 1) {
    return {
      value: sorted[0],
      position: '1st value',
      middleIndices: [0],
      middleValues: [sorted[0]],
      sortedValues: sorted,
      isInterpolated: false,
    }
  }

  if (n % 2 === 1) {
    // Odd number of values - middle value
    const middleIndex = Math.floor(n / 2)
    const position = middleIndex + 1

    return {
      value: sorted[middleIndex],
      position: `${getOrdinal(position)} value`,
      middleIndices: [middleIndex],
      middleValues: [sorted[middleIndex]],
      sortedValues: sorted,
      isInterpolated: false,
    }
  } else {
    // Even number of values - average of two middle values
    const lowerIndex = n / 2 - 1
    const upperIndex = n / 2
    const lowerValue = sorted[lowerIndex]
    const upperValue = sorted[upperIndex]
    const median = roundToDecimals((lowerValue + upperValue) / 2, precision)

    return {
      value: median,
      position: `average of ${getOrdinal(lowerIndex + 1)} and ${getOrdinal(upperIndex + 1)} values`,
      middleIndices: [lowerIndex, upperIndex],
      middleValues: [lowerValue, upperValue],
      sortedValues: sorted,
      isInterpolated: true,
    }
  }
}

/**
 * Helper function to get ordinal suffix
 */
function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

/**
 * Calculate mode with frequency distribution
 */
export function calculateMode(values: number[], precision: number): ModeResult {
  if (values.length === 0) {
    return {
      type: 'no-mode',
      values: [],
      frequency: 0,
      frequencyDistribution: [],
    }
  }

  // Count frequencies
  const frequencyMap = new Map<number, number>()
  for (const value of values) {
    const key = roundToDecimals(value, precision)
    frequencyMap.set(key, (frequencyMap.get(key) || 0) + 1)
  }

  // Create frequency distribution
  const frequencyDistribution: FrequencyItem[] = []
  let maxFrequency = 0

  frequencyMap.forEach((freq, value) => {
    if (freq > maxFrequency) {
      maxFrequency = freq
    }
    frequencyDistribution.push({
      value,
      frequency: freq,
      percentage: roundToDecimals((freq / values.length) * 100, 2),
      isMode: false, // Will be updated below
    })
  })

  // Sort by frequency (descending), then by value (ascending)
  frequencyDistribution.sort((a, b) => {
    if (b.frequency !== a.frequency) {
      return b.frequency - a.frequency
    }
    return a.value - b.value
  })

  // Find mode values (all values with maximum frequency)
  const modeValues: number[] = []
  for (const item of frequencyDistribution) {
    if (item.frequency === maxFrequency) {
      modeValues.push(item.value)
      item.isMode = true
    }
  }

  // Determine mode type
  let modeType: ModeType

  // If all values have the same frequency
  if (frequencyDistribution.every((item) => item.frequency === maxFrequency)) {
    // If all frequencies are 1 (all different) or all same (uniform)
    modeType = 'no-mode'
    // Clear mode values when there's no mode
    for (const item of frequencyDistribution) {
      item.isMode = false
    }
    return {
      type: modeType,
      values: [],
      frequency: maxFrequency,
      frequencyDistribution,
    }
  }

  // Classify mode type
  if (modeValues.length === 1) {
    modeType = 'unimodal'
  } else if (modeValues.length === 2) {
    modeType = 'bimodal'
  } else {
    modeType = 'multimodal'
  }

  return {
    type: modeType,
    values: modeValues,
    frequency: maxFrequency,
    frequencyDistribution,
  }
}

/**
 * Calculate quartiles
 */
export function calculateQuartiles(values: number[], precision: number): QuartileResult {
  if (values.length === 0) {
    return { q1: 0, q2: 0, q3: 0, iqr: 0, min: 0, max: 0 }
  }

  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length

  // Q2 (median)
  const q2 = calculateMedian(values, precision).value

  // For Q1 and Q3, use the "inclusive" method (similar to Excel QUARTILE.INC)
  // Q1 is the median of the lower half
  // Q3 is the median of the upper half

  const lowerHalf = sorted.slice(0, Math.floor(n / 2))
  const upperHalf = n % 2 === 0 ? sorted.slice(n / 2) : sorted.slice(Math.floor(n / 2) + 1)

  const q1 =
    lowerHalf.length > 0
      ? calculateMedian(lowerHalf, precision).value
      : sorted[0]

  const q3 =
    upperHalf.length > 0
      ? calculateMedian(upperHalf, precision).value
      : sorted[sorted.length - 1]

  return {
    q1: roundToDecimals(q1, precision),
    q2: roundToDecimals(q2, precision),
    q3: roundToDecimals(q3, precision),
    iqr: roundToDecimals(q3 - q1, precision),
    min: sorted[0],
    max: sorted[n - 1],
  }
}

/**
 * Calculate variance and standard deviation
 */
export function calculateVarianceAndSD(
  values: number[],
  mean: number,
  precision: number
): { variance: number; standardDeviation: number } {
  if (values.length < 2) {
    return { variance: 0, standardDeviation: 0 }
  }

  // Using sample variance (n-1 divisor)
  const squaredDiffs = values.map((v) => Math.pow(v - mean, 2))
  const sumSquaredDiffs = squaredDiffs.reduce((acc, val) => acc + val, 0)
  const variance = sumSquaredDiffs / (values.length - 1)
  const standardDeviation = Math.sqrt(variance)

  return {
    variance: roundToDecimals(variance, precision),
    standardDeviation: roundToDecimals(standardDeviation, precision),
  }
}

/**
 * Generate calculation steps for mean
 */
export function generateMeanSteps(
  values: number[],
  meanType: MeanType,
  meanDetails: MeanDetails,
  weights: number[] | undefined,
  tr: CalcTranslations,
  precision: number
): CalculationStep[] {
  const steps: CalculationStep[] = []

  switch (meanType) {
    case 'arithmetic': {
      steps.push({
        stepNumber: 1,
        description: tr.sumAllValues,
        expression: values.join(' + '),
        result: roundToDecimals(meanDetails.sum, precision).toString(),
      })

      steps.push({
        stepNumber: 2,
        description: tr.divideByCount,
        expression: `${roundToDecimals(meanDetails.sum, precision)} / ${meanDetails.count}`,
        result: meanDetails.arithmetic !== null ? roundToDecimals(meanDetails.arithmetic, precision).toString() : '--',
      })

      steps.push({
        stepNumber: 3,
        description: tr.arithmeticFormula,
        expression: 'x\u0304 = (x\u2081 + x\u2082 + ... + x\u2099) / n',
      })
      break
    }

    case 'geometric': {
      if (meanDetails.geometric === null) {
        steps.push({
          stepNumber: 1,
          description: tr.cannotCalculateGeometric,
          expression: 'Requires all positive values',
        })
      } else {
        steps.push({
          stepNumber: 1,
          description: tr.multiplyAllValues,
          expression: values.map((v) => roundToDecimals(v, precision)).join(' x '),
          result: roundToDecimals(values.reduce((a, b) => a * b, 1), precision).toString(),
        })

        steps.push({
          stepNumber: 2,
          description: t(tr.takeNthRoot, { n: values.length }),
          expression: `\u207F\u221A(${roundToDecimals(values.reduce((a, b) => a * b, 1), precision)})`,
          result: roundToDecimals(meanDetails.geometric, precision).toString(),
        })

        steps.push({
          stepNumber: 3,
          description: tr.geometricFormula,
          expression: 'G = \u207F\u221A(x\u2081 \u00d7 x\u2082 \u00d7 ... \u00d7 x\u2099)',
        })
      }
      break
    }

    case 'harmonic': {
      if (meanDetails.harmonic === null) {
        steps.push({
          stepNumber: 1,
          description: tr.cannotCalculateHarmonic,
          expression: 'Requires all positive non-zero values',
        })
      } else {
        const reciprocalSum = values.reduce((acc, v) => acc + 1 / v, 0)

        steps.push({
          stepNumber: 1,
          description: tr.sumReciprocals,
          expression: values.map((v) => `1/${roundToDecimals(v, precision)}`).join(' + '),
          result: roundToDecimals(reciprocalSum, precision).toString(),
        })

        steps.push({
          stepNumber: 2,
          description: tr.divideCountBySum,
          expression: `${values.length} / ${roundToDecimals(reciprocalSum, precision)}`,
          result: roundToDecimals(meanDetails.harmonic, precision).toString(),
        })

        steps.push({
          stepNumber: 3,
          description: tr.harmonicFormula,
          expression: 'H = n / (1/x\u2081 + 1/x\u2082 + ... + 1/x\u2099)',
        })
      }
      break
    }

    case 'weighted': {
      if (meanDetails.weighted === null || !weights) {
        steps.push({
          stepNumber: 1,
          description: 'Weights required',
          expression: 'Please provide weights for weighted mean calculation',
        })
      } else {
        steps.push({
          stepNumber: 1,
          description: tr.multiplyValuesByWeights,
          expression: values.map((v, i) => `${roundToDecimals(v, precision)} \u00d7 ${roundToDecimals(weights[i], precision)}`).join(' + '),
          result: roundToDecimals(meanDetails.weightedSum!, precision).toString(),
        })

        steps.push({
          stepNumber: 2,
          description: tr.sumWeightedValues,
          expression: `\u03A3(x\u1d62 \u00d7 w\u1d62) = ${roundToDecimals(meanDetails.weightedSum!, precision)}`,
        })

        steps.push({
          stepNumber: 3,
          description: tr.divideByWeightSum,
          expression: `${roundToDecimals(meanDetails.weightedSum!, precision)} / ${roundToDecimals(meanDetails.weightSum!, precision)}`,
          result: roundToDecimals(meanDetails.weighted, precision).toString(),
        })

        steps.push({
          stepNumber: 4,
          description: tr.weightedFormula,
          expression: 'x\u0304\u1d42 = \u03A3(x\u1d62 \u00d7 w\u1d62) / \u03A3w\u1d62',
        })
      }
      break
    }
  }

  return steps
}

/**
 * Generate calculation steps for median
 */
export function generateMedianSteps(
  medianDetails: MedianDetails,
  tr: CalcTranslations,
  precision: number
): CalculationStep[] {
  const steps: CalculationStep[] = []
  const n = medianDetails.sortedValues.length

  if (n === 0) return steps

  // Show first few and last few sorted values if too many
  let sortedDisplay: string
  if (n <= 10) {
    sortedDisplay = medianDetails.sortedValues.map((v) => roundToDecimals(v, precision)).join(', ')
  } else {
    const first = medianDetails.sortedValues.slice(0, 4).map((v) => roundToDecimals(v, precision))
    const last = medianDetails.sortedValues.slice(-4).map((v) => roundToDecimals(v, precision))
    sortedDisplay = `${first.join(', ')}, ..., ${last.join(', ')}`
  }

  steps.push({
    stepNumber: 1,
    description: tr.sortValues,
    expression: t(tr.sortedValuesAre, { values: sortedDisplay }),
  })

  steps.push({
    stepNumber: 2,
    description: tr.findMiddlePosition,
    expression: `n = ${n}`,
    result: medianDetails.position,
  })

  if (medianDetails.isInterpolated) {
    steps.push({
      stepNumber: 3,
      description: tr.averageMiddleValues,
      expression: `(${roundToDecimals(medianDetails.middleValues[0], precision)} + ${roundToDecimals(medianDetails.middleValues[1], precision)}) / 2`,
      result: roundToDecimals(medianDetails.value, precision).toString(),
    })
  } else {
    steps.push({
      stepNumber: 3,
      description: tr.middleValueIs,
      expression: medianDetails.position,
      result: roundToDecimals(medianDetails.value, precision).toString(),
    })
  }

  steps.push({
    stepNumber: 4,
    description: tr.medianFormula,
    expression: n % 2 === 1 ? 'Median = x\u2099/\u2082\u208a\u2081' : 'Median = (x\u2099/\u2082 + x\u2099/\u2082\u208a\u2081) / 2',
  })

  return steps
}

/**
 * Generate calculation steps for mode
 */
export function generateModeSteps(
  modeResult: ModeResult,
  tr: CalcTranslations,
  precision: number
): CalculationStep[] {
  const steps: CalculationStep[] = []

  if (modeResult.frequencyDistribution.length === 0) return steps

  // Show frequency counts
  const topFrequencies = modeResult.frequencyDistribution.slice(0, 5)
  const frequencyDisplay = topFrequencies
    .map((item) => t(tr.appearsNTimes, { value: roundToDecimals(item.value, precision), n: item.frequency }))
    .join('; ')

  steps.push({
    stepNumber: 1,
    description: tr.countFrequencies,
    expression: frequencyDisplay + (modeResult.frequencyDistribution.length > 5 ? '; ...' : ''),
  })

  steps.push({
    stepNumber: 2,
    description: tr.findHighestFrequency,
    expression: t(tr.frequencyOf, { frequency: modeResult.frequency }),
  })

  steps.push({
    stepNumber: 3,
    description: tr.identifyModeValues,
    expression:
      modeResult.type === 'no-mode'
        ? modeResult.frequency === 1
          ? tr.noModeAllDifferent
          : tr.noModeAllEqual
        : modeResult.type === 'unimodal'
          ? t(tr.unimodalResult, { value: roundToDecimals(modeResult.values[0], precision) })
          : modeResult.type === 'bimodal'
            ? t(tr.bimodalResult, { values: modeResult.values.map((v) => roundToDecimals(v, precision)).join(', ') })
            : t(tr.multimodalResult, { values: modeResult.values.map((v) => roundToDecimals(v, precision)).join(', '), count: modeResult.values.length }),
  })

  steps.push({
    stepNumber: 4,
    description: tr.modeFormula,
    expression: 'Mode = value(s) with highest frequency',
  })

  return steps
}

/**
 * Main calculation function for central tendency
 */
export function calculateCentralTendency(
  inputs: CentralTendencyInputs,
  parsedData: ParsedData,
  parsedWeights: ParsedData | undefined,
  tr: CalcTranslations
): CentralTendencyResult {
  const { values } = parsedData
  const weights = parsedWeights?.values
  const { meanType, decimalPrecision } = inputs
  const n = values.length

  // Calculate basic statistics
  const sum = roundToDecimals(values.reduce((acc, val) => acc + val, 0), decimalPrecision)
  const min = n > 0 ? Math.min(...values) : 0
  const max = n > 0 ? Math.max(...values) : 0
  const range = roundToDecimals(max - min, decimalPrecision)

  // Calculate all mean types
  const arithmetic = roundToDecimals(calculateArithmeticMean(values), decimalPrecision)
  const geometricRaw = calculateGeometricMean(values)
  const geometric = geometricRaw !== null ? roundToDecimals(geometricRaw, decimalPrecision) : null
  const harmonicRaw = calculateHarmonicMean(values)
  const harmonic = harmonicRaw !== null ? roundToDecimals(harmonicRaw, decimalPrecision) : null

  let weighted: number | null = null
  let weightSum: number | undefined
  let weightedSum: number | undefined

  if (weights && weights.length === n) {
    const weightedResult = calculateWeightedMean(values, weights)
    if (weightedResult) {
      weighted = roundToDecimals(weightedResult.mean, decimalPrecision)
      weightSum = roundToDecimals(weightedResult.weightSum, decimalPrecision)
      weightedSum = roundToDecimals(weightedResult.weightedSum, decimalPrecision)
    }
  }

  // Select the appropriate mean based on meanType
  let selectedMean: number | null
  switch (meanType) {
    case 'arithmetic':
      selectedMean = arithmetic
      break
    case 'geometric':
      selectedMean = geometric
      break
    case 'harmonic':
      selectedMean = harmonic
      break
    case 'weighted':
      selectedMean = weighted
      break
    default:
      selectedMean = arithmetic
  }

  // Build mean details
  const meanDetails: MeanDetails = {
    arithmetic,
    geometric,
    harmonic,
    weighted,
    sum,
    count: n,
    formula: getMeanFormula(meanType),
    weightSum,
    weightedSum,
  }

  // Calculate median
  const medianDetails = calculateMedian(values, decimalPrecision)

  // Calculate mode
  const modeResult = calculateMode(values, decimalPrecision)

  // Calculate quartiles
  const quartiles = calculateQuartiles(values, decimalPrecision)

  // Calculate variance and standard deviation
  const { variance, standardDeviation } = calculateVarianceAndSD(
    values,
    arithmetic,
    decimalPrecision
  )

  // Generate steps
  const meanSteps = generateMeanSteps(values, meanType, meanDetails, weights, tr, decimalPrecision)
  const medianSteps = generateMedianSteps(medianDetails, tr, decimalPrecision)
  const modeSteps = generateModeSteps(modeResult, tr, decimalPrecision)

  // Generate warnings
  const warnings: string[] = []
  if (n === 1) {
    warnings.push('Single value dataset - all measures equal this value')
  }
  if (meanType === 'geometric' && geometric === null) {
    warnings.push('Geometric mean requires all positive values')
  }
  if (meanType === 'harmonic' && harmonic === null) {
    warnings.push('Harmonic mean requires all positive non-zero values')
  }
  if (modeResult.type === 'no-mode') {
    warnings.push('No unique mode exists (all values have equal frequency)')
  }

  return {
    mean: meanDetails,
    median: medianDetails,
    mode: modeResult,
    selectedMean,
    selectedMeanType: meanType,
    count: n,
    sum,
    range,
    min,
    max,
    variance,
    standardDeviation,
    quartiles,
    values,
    weights,
    meanSteps,
    medianSteps,
    modeSteps,
    warnings,
  }
}

/**
 * Get formula string for mean type
 */
function getMeanFormula(meanType: MeanType): string {
  switch (meanType) {
    case 'arithmetic':
      return 'x\u0304 = \u03A3x\u1d62 / n'
    case 'geometric':
      return 'G = \u207F\u221A(\u03A0x\u1d62)'
    case 'harmonic':
      return 'H = n / \u03A3(1/x\u1d62)'
    case 'weighted':
      return 'x\u0304\u1d42 = \u03A3(x\u1d62 \u00d7 w\u1d62) / \u03A3w\u1d62'
    default:
      return ''
  }
}
