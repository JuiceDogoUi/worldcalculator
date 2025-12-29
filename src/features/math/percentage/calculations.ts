import type {
  PercentageInputs,
  PercentageResult,
  PercentageValidation,
} from './types'

/**
 * Round to specified decimal places
 */
function roundToDecimals(value: number, decimals: number = 4): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Validate percentage calculator inputs based on mode
 */
export function validatePercentageInputs(
  inputs: PercentageInputs
): PercentageValidation {
  const errors: PercentageValidation['errors'] = []
  const { mode } = inputs

  switch (mode) {
    case 'what-is-percent-of':
      if (inputs.percentValue === undefined) {
        errors.push({
          field: 'percentValue',
          message: 'Percentage is required',
        })
      } else if (inputs.percentValue < 0) {
        errors.push({
          field: 'percentValue',
          message: 'Percentage cannot be negative',
        })
      }
      if (inputs.baseValue === undefined) {
        errors.push({ field: 'baseValue', message: 'Base value is required' })
      }
      break

    case 'is-what-percent-of':
      if (inputs.partValue === undefined) {
        errors.push({ field: 'partValue', message: 'Part value is required' })
      }
      if (inputs.wholeValue === undefined) {
        errors.push({
          field: 'wholeValue',
          message: 'Whole value is required',
        })
      }
      if (inputs.wholeValue === 0) {
        errors.push({
          field: 'wholeValue',
          message: 'Whole value cannot be zero',
        })
      }
      break

    case 'is-percent-of-what':
      if (inputs.resultValue === undefined) {
        errors.push({
          field: 'resultValue',
          message: 'Result value is required',
        })
      }
      if (inputs.percentOfWhole === undefined) {
        errors.push({
          field: 'percentOfWhole',
          message: 'Percentage is required',
        })
      } else if (inputs.percentOfWhole === 0) {
        errors.push({
          field: 'percentOfWhole',
          message: 'Percentage cannot be zero',
        })
      } else if (inputs.percentOfWhole < 0) {
        errors.push({
          field: 'percentOfWhole',
          message: 'Percentage cannot be negative',
        })
      }
      break

    case 'percent-change':
      if (inputs.initialValue === undefined) {
        errors.push({
          field: 'initialValue',
          message: 'Initial value is required',
        })
      }
      if (inputs.finalValue === undefined) {
        errors.push({
          field: 'finalValue',
          message: 'Final value is required',
        })
      }
      if (inputs.initialValue === 0) {
        errors.push({
          field: 'initialValue',
          message: 'Initial value cannot be zero for percent change',
        })
      }
      break

    case 'percent-difference':
      if (inputs.value1 === undefined) {
        errors.push({
          field: 'value1',
          message: 'First value is required',
        })
      }
      if (inputs.value2 === undefined) {
        errors.push({
          field: 'value2',
          message: 'Second value is required',
        })
      }
      if (inputs.value1 === 0 && inputs.value2 === 0) {
        errors.push({
          field: 'value1',
          message: 'Both values cannot be zero',
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
 * Calculate: What is X% of Y?
 * Formula: (X / 100) × Y
 */
function calculateWhatIsPercentOf(
  percentValue: number,
  baseValue: number
): PercentageResult {
  const result = roundToDecimals((percentValue / 100) * baseValue)

  return {
    mode: 'what-is-percent-of',
    result,
    formula: `(${percentValue} ÷ 100) × ${baseValue} = ${result}`,
    explanation: `${percentValue}% of ${baseValue} is ${result}`,
  }
}

/**
 * Calculate: X is what % of Y?
 * Formula: (X / Y) × 100
 */
function calculateIsWhatPercentOf(
  partValue: number,
  wholeValue: number
): PercentageResult {
  const result = roundToDecimals((partValue / wholeValue) * 100)

  return {
    mode: 'is-what-percent-of',
    result,
    formula: `(${partValue} ÷ ${wholeValue}) × 100 = ${result}%`,
    explanation: `${partValue} is ${result}% of ${wholeValue}`,
  }
}

/**
 * Calculate: X is Y% of what?
 * Formula: X / (Y / 100) = X × (100 / Y)
 */
function calculateIsPercentOfWhat(
  resultValue: number,
  percentOfWhole: number
): PercentageResult {
  const result = roundToDecimals((resultValue / percentOfWhole) * 100)

  return {
    mode: 'is-percent-of-what',
    result,
    formula: `${resultValue} ÷ (${percentOfWhole} ÷ 100) = ${result}`,
    explanation: `${resultValue} is ${percentOfWhole}% of ${result}`,
  }
}

/**
 * Calculate: Percentage change from X to Y
 * Formula: ((Y - X) / |X|) × 100
 */
function calculatePercentChange(
  initialValue: number,
  finalValue: number
): PercentageResult {
  const absoluteDifference = finalValue - initialValue
  const percentChange = roundToDecimals(
    (absoluteDifference / Math.abs(initialValue)) * 100
  )
  const isIncrease = absoluteDifference > 0
  const isDecrease = absoluteDifference < 0

  return {
    mode: 'percent-change',
    result: percentChange,
    formula: `((${finalValue} - ${initialValue}) ÷ |${initialValue}|) × 100 = ${percentChange}%`,
    explanation: isIncrease
      ? `Increased by ${Math.abs(percentChange)}% from ${initialValue} to ${finalValue}`
      : isDecrease
        ? `Decreased by ${Math.abs(percentChange)}% from ${initialValue} to ${finalValue}`
        : `No change from ${initialValue} to ${finalValue}`,
    absoluteDifference: roundToDecimals(absoluteDifference),
    isIncrease,
    isDecrease,
  }
}

/**
 * Calculate: Percentage difference between X and Y
 * Uses average as base: |X - Y| / ((|X| + |Y|) / 2) × 100
 */
function calculatePercentDifference(
  value1: number,
  value2: number
): PercentageResult {
  const absoluteDifference = Math.abs(value1 - value2)
  const average = (Math.abs(value1) + Math.abs(value2)) / 2
  const result = average !== 0 ? roundToDecimals((absoluteDifference / average) * 100) : 0

  return {
    mode: 'percent-difference',
    result,
    formula: `|${value1} - ${value2}| ÷ ((|${value1}| + |${value2}|) ÷ 2) × 100 = ${result}%`,
    explanation: `The percentage difference between ${value1} and ${value2} is ${result}%`,
    absoluteDifference: roundToDecimals(absoluteDifference),
  }
}

/**
 * Main calculation function that routes to specific calculator based on mode
 */
export function calculatePercentage(
  inputs: PercentageInputs
): PercentageResult {
  const { mode } = inputs

  switch (mode) {
    case 'what-is-percent-of':
      return calculateWhatIsPercentOf(inputs.percentValue!, inputs.baseValue!)

    case 'is-what-percent-of':
      return calculateIsWhatPercentOf(inputs.partValue!, inputs.wholeValue!)

    case 'is-percent-of-what':
      return calculateIsPercentOfWhat(
        inputs.resultValue!,
        inputs.percentOfWhole!
      )

    case 'percent-change':
      return calculatePercentChange(inputs.initialValue!, inputs.finalValue!)

    case 'percent-difference':
      return calculatePercentDifference(inputs.value1!, inputs.value2!)

    default:
      throw new Error(`Unknown calculation mode: ${mode}`)
  }
}

// Formatters are imported from @/lib/formatters in the component
