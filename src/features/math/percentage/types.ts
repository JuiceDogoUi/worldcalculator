/**
 * Percentage calculation modes
 */
export type PercentageMode =
  | 'what-is-percent-of' // What is X% of Y?
  | 'is-what-percent-of' // X is what % of Y?
  | 'is-percent-of-what' // X is Y% of what?
  | 'percent-change' // % change from X to Y
  | 'percent-difference' // % difference between X and Y

/**
 * Input interface for percentage calculations
 */
export interface PercentageInputs {
  mode: PercentageMode

  // Mode: 'what-is-percent-of' - What is X% of Y?
  percentValue?: number // X (the percentage)
  baseValue?: number // Y (the base/whole)

  // Mode: 'is-what-percent-of' - X is what % of Y?
  partValue?: number // X (the part)
  wholeValue?: number // Y (the whole)

  // Mode: 'is-percent-of-what' - X is Y% of what?
  resultValue?: number // X (the result)
  percentOfWhole?: number // Y (the percentage)

  // Mode: 'percent-change' - % change from X to Y
  initialValue?: number // X (starting value)
  finalValue?: number // Y (ending value)

  // Mode: 'percent-difference' - % difference between X and Y
  value1?: number // First value
  value2?: number // Second value
}

/**
 * Result interface for percentage calculations
 */
export interface PercentageResult {
  mode: PercentageMode
  result: number
  formula: string
  explanation: string

  // Additional contextual results
  absoluteDifference?: number // For change/difference modes
  isIncrease?: boolean // For change mode
  isDecrease?: boolean // For change mode
}

/**
 * Validation result for percentage inputs
 */
export interface PercentageValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
