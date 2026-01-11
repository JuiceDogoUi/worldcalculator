import type {
  BMIInputs,
  BMIResult,
  BMICategory,
  BMIValidation,
  HealthyWeightRange,
  DistanceFromNormal,
} from './types'
import { BMI_THRESHOLDS, BMI_CATEGORY_COLORS, BMI_CATEGORY_BG_COLORS } from './types'

/**
 * Round to specified decimal places
 */
function roundToDecimals(value: number, decimals: number = 1): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Validate metric BMI inputs
 */
function validateMetricInputs(inputs: Partial<BMIInputs>): BMIValidation {
  const errors: BMIValidation['errors'] = []

  // Validate height in cm
  if (inputs.heightCm === undefined || inputs.heightCm === null) {
    errors.push({
      field: 'heightCm',
      message: 'validation.heightRequired',
    })
  } else if (isNaN(inputs.heightCm)) {
    errors.push({
      field: 'heightCm',
      message: 'validation.heightInvalid',
    })
  } else if (inputs.heightCm <= 0) {
    errors.push({
      field: 'heightCm',
      message: 'validation.heightPositive',
    })
  } else if (inputs.heightCm < 50) {
    errors.push({
      field: 'heightCm',
      message: 'validation.heightTooLow',
    })
  } else if (inputs.heightCm > 300) {
    errors.push({
      field: 'heightCm',
      message: 'validation.heightTooHigh',
    })
  }

  // Validate weight in kg
  if (inputs.weightKg === undefined || inputs.weightKg === null) {
    errors.push({
      field: 'weightKg',
      message: 'validation.weightRequired',
    })
  } else if (isNaN(inputs.weightKg)) {
    errors.push({
      field: 'weightKg',
      message: 'validation.weightInvalid',
    })
  } else if (inputs.weightKg <= 0) {
    errors.push({
      field: 'weightKg',
      message: 'validation.weightPositive',
    })
  } else if (inputs.weightKg < 10) {
    errors.push({
      field: 'weightKg',
      message: 'validation.weightTooLow',
    })
  } else if (inputs.weightKg > 500) {
    errors.push({
      field: 'weightKg',
      message: 'validation.weightTooHigh',
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate imperial BMI inputs
 */
function validateImperialInputs(inputs: Partial<BMIInputs>): BMIValidation {
  const errors: BMIValidation['errors'] = []

  // Validate height feet
  if (inputs.heightFeet === undefined || inputs.heightFeet === null) {
    errors.push({
      field: 'heightFeet',
      message: 'validation.heightFeetRequired',
    })
  } else if (isNaN(inputs.heightFeet)) {
    errors.push({
      field: 'heightFeet',
      message: 'validation.heightFeetInvalid',
    })
  } else if (inputs.heightFeet < 0) {
    errors.push({
      field: 'heightFeet',
      message: 'validation.heightFeetPositive',
    })
  } else if (inputs.heightFeet < 1) {
    errors.push({
      field: 'heightFeet',
      message: 'validation.heightFeetTooLow',
    })
  } else if (inputs.heightFeet > 9) {
    errors.push({
      field: 'heightFeet',
      message: 'validation.heightFeetTooHigh',
    })
  }

  // Validate height inches
  if (inputs.heightInches === undefined || inputs.heightInches === null) {
    errors.push({
      field: 'heightInches',
      message: 'validation.heightInchesRequired',
    })
  } else if (isNaN(inputs.heightInches)) {
    errors.push({
      field: 'heightInches',
      message: 'validation.heightInchesInvalid',
    })
  } else if (inputs.heightInches < 0) {
    errors.push({
      field: 'heightInches',
      message: 'validation.heightInchesPositive',
    })
  } else if (inputs.heightInches > 11) {
    errors.push({
      field: 'heightInches',
      message: 'validation.heightInchesTooHigh',
    })
  }

  // Validate weight in lbs
  if (inputs.weightLbs === undefined || inputs.weightLbs === null) {
    errors.push({
      field: 'weightLbs',
      message: 'validation.weightRequired',
    })
  } else if (isNaN(inputs.weightLbs)) {
    errors.push({
      field: 'weightLbs',
      message: 'validation.weightInvalid',
    })
  } else if (inputs.weightLbs <= 0) {
    errors.push({
      field: 'weightLbs',
      message: 'validation.weightPositive',
    })
  } else if (inputs.weightLbs < 22) {
    // 10 kg ≈ 22 lbs
    errors.push({
      field: 'weightLbs',
      message: 'validation.weightTooLow',
    })
  } else if (inputs.weightLbs > 1100) {
    // 500 kg ≈ 1100 lbs
    errors.push({
      field: 'weightLbs',
      message: 'validation.weightTooHigh',
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate BMI inputs based on unit system
 */
export function validateBMIInputs(inputs: Partial<BMIInputs>): BMIValidation {
  if (!inputs.unitSystem) {
    return {
      valid: false,
      errors: [
        {
          field: 'unitSystem',
          message: 'validation.unitSystemRequired',
        },
      ],
    }
  }

  if (inputs.unitSystem === 'metric') {
    return validateMetricInputs(inputs)
  } else if (inputs.unitSystem === 'imperial') {
    return validateImperialInputs(inputs)
  }

  return {
    valid: false,
    errors: [
      {
        field: 'unitSystem',
        message: 'validation.unitSystemInvalid',
      },
    ],
  }
}

// ============================================
// Unit Conversion Functions (Exported)
// ============================================

/**
 * Convert feet and inches to centimeters
 * 1 foot = 30.48 cm, 1 inch = 2.54 cm
 */
export function feetInchesToCm(feet: number, inches: number): number {
  const totalInches = feet * 12 + inches
  return totalInches * 2.54
}

/**
 * Convert centimeters to meters
 */
export function cmToMeters(cm: number): number {
  return cm / 100
}

/**
 * Convert pounds to kilograms
 * 1 lb = 0.453592 kg
 */
export function lbsToKg(lbs: number): number {
  return lbs * 0.453592
}

/**
 * Convert kilograms to pounds
 * 1 kg = 2.20462 lbs
 */
export function kgToLbs(kg: number): number {
  return kg * 2.20462
}

// Internal aliases for backward compatibility
const convertImperialHeightToCm = feetInchesToCm
const convertLbsToKg = lbsToKg
const convertKgToLbs = kgToLbs

/**
 * Get BMI category based on BMI value
 * Categories based on WHO classification
 */
export function getBMICategory(bmi: number): BMICategory {
  if (bmi < BMI_THRESHOLDS.underweight) return 'underweight'
  if (bmi < BMI_THRESHOLDS.normalMax) return 'normal'
  if (bmi < BMI_THRESHOLDS.overweightMax) return 'overweight'
  if (bmi < BMI_THRESHOLDS.obeseClass1Max) return 'obese-class-1'
  if (bmi < BMI_THRESHOLDS.obeseClass2Max) return 'obese-class-2'
  return 'obese-class-3'
}

/**
 * Calculate healthy weight range for given height
 * Based on healthy BMI range: 18.5 - 24.9
 */
function calculateHealthyWeightRange(
  heightCm: number,
  unitSystem: 'metric' | 'imperial'
): HealthyWeightRange {
  const heightM = heightCm / 100
  const minWeightKg = BMI_THRESHOLDS.underweight * heightM * heightM
  const maxWeightKg = BMI_THRESHOLDS.normalMax * heightM * heightM

  if (unitSystem === 'metric') {
    return {
      minWeight: Math.round(minWeightKg),
      maxWeight: Math.round(maxWeightKg),
      unit: 'kg',
    }
  } else {
    return {
      minWeight: Math.round(convertKgToLbs(minWeightKg)),
      maxWeight: Math.round(convertKgToLbs(maxWeightKg)),
      unit: 'lbs',
    }
  }
}

/**
 * Calculate distance from normal BMI range
 */
function calculateDistanceFromNormal(
  bmi: number,
  currentWeightKg: number,
  heightM: number,
  unitSystem: 'metric' | 'imperial'
): DistanceFromNormal {
  if (bmi >= BMI_THRESHOLDS.underweight && bmi <= BMI_THRESHOLDS.normalMax) {
    // Within normal range
    return {
      direction: 'within',
      amount: 0,
      unit: unitSystem === 'metric' ? 'kg' : 'lbs',
    }
  }

  let targetWeightKg: number
  let direction: 'under' | 'over'

  if (bmi < BMI_THRESHOLDS.underweight) {
    // Underweight - calculate weight needed to reach min normal BMI
    targetWeightKg = BMI_THRESHOLDS.underweight * heightM * heightM
    direction = 'under'
  } else {
    // Overweight or obese - calculate weight needed to reach max normal BMI
    targetWeightKg = BMI_THRESHOLDS.normalMax * heightM * heightM
    direction = 'over'
  }

  const differenceKg = Math.abs(currentWeightKg - targetWeightKg)

  return {
    direction,
    amount:
      unitSystem === 'metric'
        ? roundToDecimals(differenceKg, 1)
        : roundToDecimals(convertKgToLbs(differenceKg), 1),
    unit: unitSystem === 'metric' ? 'kg' : 'lbs',
  }
}

/**
 * Main BMI calculation function
 */
export function calculateBMI(inputs: BMIInputs): BMIResult {
  let heightCm: number
  let weightKg: number

  // Convert to metric for calculations
  if (inputs.unitSystem === 'metric') {
    heightCm = inputs.heightCm!
    weightKg = inputs.weightKg!
  } else {
    heightCm = convertImperialHeightToCm(inputs.heightFeet!, inputs.heightInches!)
    weightKg = convertLbsToKg(inputs.weightLbs!)
  }

  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)
  const roundedBMI = roundToDecimals(bmi, 1)

  const category = getBMICategory(roundedBMI)
  const healthyWeightRange = calculateHealthyWeightRange(heightCm, inputs.unitSystem)
  const distanceFromNormal = calculateDistanceFromNormal(
    roundedBMI,
    weightKg,
    heightM,
    inputs.unitSystem
  )

  return {
    bmi: roundedBMI,
    category,
    healthyWeightRange,
    distanceFromNormal,
    heightInMeters: roundToDecimals(heightM, 2),
    weightInKg: roundToDecimals(weightKg, 1),
  }
}

/**
 * Format BMI value for display
 */
export function formatBMI(bmi: number): string {
  return bmi.toFixed(1)
}

/**
 * Format weight range for display
 */
export function formatWeightRange(
  range: HealthyWeightRange,
  locale = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return `${formatter.format(range.minWeight)} - ${formatter.format(range.maxWeight)} ${range.unit}`
}

// ============================================
// Color Helper Functions
// ============================================

/**
 * Get color for BMI category
 */
export function getCategoryColor(category: BMICategory): string {
  return BMI_CATEGORY_COLORS[category]
}

/**
 * Get background color for BMI category
 */
export function getCategoryBgColor(category: BMICategory): string {
  return BMI_CATEGORY_BG_COLORS[category]
}

// ============================================
// BMI Visual Scale Functions
// ============================================

/**
 * Get BMI scale position as percentage (for visual scale)
 * Maps BMI 10-50 to 0-100%
 */
export function getBMIScalePosition(bmi: number): number {
  const minBMI = 10
  const maxBMI = 50
  const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi))
  return ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100
}

/**
 * Get category threshold positions for visual scale
 * Returns positions as percentages
 */
export function getCategoryThresholdPositions(): {
  underweight: number
  normal: number
  overweight: number
  obeseClass1: number
  obeseClass2: number
} {
  const minBMI = 10
  const maxBMI = 50
  const range = maxBMI - minBMI

  return {
    underweight: ((BMI_THRESHOLDS.underweight - minBMI) / range) * 100,
    normal: ((BMI_THRESHOLDS.normalMax - minBMI) / range) * 100,
    overweight: ((BMI_THRESHOLDS.overweightMax - minBMI) / range) * 100,
    obeseClass1: ((BMI_THRESHOLDS.obeseClass1Max - minBMI) / range) * 100,
    obeseClass2: ((BMI_THRESHOLDS.obeseClass2Max - minBMI) / range) * 100,
  }
}
