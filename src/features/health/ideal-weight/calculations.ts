import type {
  IdealWeightInputs,
  IdealWeightResult,
  IdealWeightValidation,
  FormulaResult,
  FormulaName,
  Gender,
  BodyFrame,
  WeightDifference,
  BMIWeightRange,
} from './types'
import {
  FORMULA_CONSTANTS,
  BMI_HEALTHY_RANGE,
  FRAME_ADJUSTMENTS,
} from './types'

/**
 * Round to specified decimal places
 */
function roundToDecimals(value: number, decimals: number = 1): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

// ============================================
// Unit Conversion Functions
// ============================================

/**
 * Convert centimeters to inches
 * 1 inch = 2.54 cm
 */
export function cmToInches(cm: number): number {
  return cm / 2.54
}

/**
 * Convert inches to centimeters
 * 1 inch = 2.54 cm
 */
export function inchesToCm(inches: number): number {
  return inches * 2.54
}

/**
 * Convert feet and inches to total inches
 */
export function feetInchesToInches(feet: number, inches: number): number {
  return feet * 12 + inches
}

/**
 * Convert feet and inches to centimeters
 */
export function feetInchesToCm(feet: number, inches: number): number {
  return inchesToCm(feetInchesToInches(feet, inches))
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

// ============================================
// Validation Functions
// ============================================

/**
 * Validate metric inputs for ideal weight calculation
 */
function validateMetricInputs(inputs: Partial<IdealWeightInputs>): IdealWeightValidation {
  const errors: IdealWeightValidation['errors'] = []

  // Validate height in cm (required)
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
  } else if (inputs.heightCm < 100) {
    errors.push({
      field: 'heightCm',
      message: 'validation.heightTooLow',
    })
  } else if (inputs.heightCm > 250) {
    errors.push({
      field: 'heightCm',
      message: 'validation.heightTooHigh',
    })
  }

  // Validate current weight in kg (optional)
  if (inputs.currentWeightKg !== undefined && inputs.currentWeightKg !== null) {
    if (isNaN(inputs.currentWeightKg)) {
      errors.push({
        field: 'currentWeightKg',
        message: 'validation.weightInvalid',
      })
    } else if (inputs.currentWeightKg <= 0) {
      errors.push({
        field: 'currentWeightKg',
        message: 'validation.weightPositive',
      })
    } else if (inputs.currentWeightKg < 20) {
      errors.push({
        field: 'currentWeightKg',
        message: 'validation.weightTooLow',
      })
    } else if (inputs.currentWeightKg > 300) {
      errors.push({
        field: 'currentWeightKg',
        message: 'validation.weightTooHigh',
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate imperial inputs for ideal weight calculation
 */
function validateImperialInputs(inputs: Partial<IdealWeightInputs>): IdealWeightValidation {
  const errors: IdealWeightValidation['errors'] = []

  // Validate height feet (required)
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
  } else if (inputs.heightFeet < 3) {
    errors.push({
      field: 'heightFeet',
      message: 'validation.heightFeetTooLow',
    })
  } else if (inputs.heightFeet > 8) {
    errors.push({
      field: 'heightFeet',
      message: 'validation.heightFeetTooHigh',
    })
  }

  // Validate height inches (required)
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

  // Validate current weight in lbs (optional)
  if (inputs.currentWeightLbs !== undefined && inputs.currentWeightLbs !== null) {
    if (isNaN(inputs.currentWeightLbs)) {
      errors.push({
        field: 'currentWeightLbs',
        message: 'validation.weightInvalid',
      })
    } else if (inputs.currentWeightLbs <= 0) {
      errors.push({
        field: 'currentWeightLbs',
        message: 'validation.weightPositive',
      })
    } else if (inputs.currentWeightLbs < 44) {
      // ~20 kg
      errors.push({
        field: 'currentWeightLbs',
        message: 'validation.weightTooLow',
      })
    } else if (inputs.currentWeightLbs > 661) {
      // ~300 kg
      errors.push({
        field: 'currentWeightLbs',
        message: 'validation.weightTooHigh',
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate ideal weight inputs based on unit system
 */
export function validateIdealWeightInputs(
  inputs: Partial<IdealWeightInputs>
): IdealWeightValidation {
  const errors: IdealWeightValidation['errors'] = []

  // Validate gender
  if (!inputs.gender) {
    errors.push({
      field: 'gender',
      message: 'validation.genderRequired',
    })
  }

  // Validate unit system
  if (!inputs.unitSystem) {
    errors.push({
      field: 'unitSystem',
      message: 'validation.unitSystemRequired',
    })
  }

  // Add gender/unit system errors first
  if (errors.length > 0) {
    return { valid: false, errors }
  }

  // Validate based on unit system
  const unitValidation =
    inputs.unitSystem === 'metric'
      ? validateMetricInputs(inputs)
      : validateImperialInputs(inputs)

  return {
    valid: unitValidation.valid,
    errors: [...errors, ...unitValidation.errors],
  }
}

// ============================================
// Ideal Weight Calculation Functions
// ============================================

/**
 * Calculate ideal weight using a specific formula
 * All formulas use: baseWeight + multiplier * (heightInInches - 60)
 *
 * Note: These formulas are designed for heights above 5 feet (60 inches).
 * For shorter individuals, the base weight is used as minimum.
 */
export function calculateFormulaWeight(
  heightInInches: number,
  gender: Gender,
  formula: FormulaName
): number {
  const constants = FORMULA_CONSTANTS[formula][gender]

  // Calculate ideal weight
  // For heights below 60 inches, use base weight as minimum
  const inchesAbove60 = Math.max(0, heightInInches - 60)
  const idealWeight = constants.base + constants.multiplier * inchesAbove60

  return roundToDecimals(idealWeight, 1)
}

/**
 * Apply frame size adjustment to ideal weight
 */
export function applyFrameAdjustment(weight: number, frame: BodyFrame): number {
  const adjustment = FRAME_ADJUSTMENTS[frame]
  return roundToDecimals(weight * (1 + adjustment), 1)
}

/**
 * Calculate BMI-based healthy weight range
 */
export function calculateBMIWeightRange(heightCm: number): BMIWeightRange {
  const heightM = heightCm / 100
  const heightSquared = heightM * heightM

  return {
    minWeight: roundToDecimals(BMI_HEALTHY_RANGE.min * heightSquared, 1),
    maxWeight: roundToDecimals(BMI_HEALTHY_RANGE.max * heightSquared, 1),
  }
}

/**
 * Calculate weight difference from ideal
 */
export function calculateWeightDifference(
  currentWeight: number,
  idealWeight: number
): WeightDifference {
  const difference = currentWeight - idealWeight

  if (Math.abs(difference) < 0.5) {
    return { direction: 'ideal', amount: 0 }
  }

  return {
    direction: difference > 0 ? 'lose' : 'gain',
    amount: roundToDecimals(Math.abs(difference), 1),
  }
}

/**
 * Main ideal weight calculation function
 */
export function calculateIdealWeight(inputs: IdealWeightInputs): IdealWeightResult {
  let heightCm: number
  let heightInInches: number
  let currentWeightKg: number | undefined

  // Convert inputs to standard units
  if (inputs.unitSystem === 'metric') {
    heightCm = inputs.heightCm!
    heightInInches = cmToInches(heightCm)
    currentWeightKg = inputs.currentWeightKg
  } else {
    heightInInches = feetInchesToInches(inputs.heightFeet!, inputs.heightInches!)
    heightCm = inchesToCm(heightInInches)
    currentWeightKg = inputs.currentWeightLbs
      ? lbsToKg(inputs.currentWeightLbs)
      : undefined
  }

  // Calculate ideal weight from each formula
  const formulaNames: FormulaName[] = ['devine', 'robinson', 'miller', 'hamwi']
  const formulas: FormulaResult[] = formulaNames.map((name) => {
    const idealWeight = calculateFormulaWeight(heightInInches, inputs.gender, name)
    const adjustedWeight = applyFrameAdjustment(idealWeight, inputs.bodyFrame)
    return {
      name,
      idealWeight,
      adjustedWeight,
    }
  })

  // Calculate average ideal weight (using adjusted weights)
  const totalWeight = formulas.reduce((sum, f) => sum + f.adjustedWeight, 0)
  const averageIdealWeight = roundToDecimals(totalWeight / formulas.length, 1)

  // Calculate BMI-based weight range
  const bmiRange = calculateBMIWeightRange(heightCm)

  // Calculate weight difference if current weight provided
  let weightDifference: WeightDifference | undefined
  if (currentWeightKg !== undefined) {
    weightDifference = calculateWeightDifference(currentWeightKg, averageIdealWeight)
  }

  return {
    formulas,
    averageIdealWeight,
    bmiRange,
    weightDifference,
    heightInCm: roundToDecimals(heightCm, 1),
    heightInInches: roundToDecimals(heightInInches, 1),
    currentWeightKg: currentWeightKg ? roundToDecimals(currentWeightKg, 1) : undefined,
  }
}

// ============================================
// Formatting Functions
// ============================================

/**
 * Format weight value for display with unit
 */
export function formatWeight(
  weightKg: number,
  unitSystem: 'metric' | 'imperial',
  locale: string = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  if (unitSystem === 'metric') {
    return `${formatter.format(weightKg)} kg`
  } else {
    return `${formatter.format(kgToLbs(weightKg))} lbs`
  }
}

/**
 * Format weight range for display
 */
export function formatWeightRange(
  minKg: number,
  maxKg: number,
  unitSystem: 'metric' | 'imperial',
  locale: string = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  if (unitSystem === 'metric') {
    return `${formatter.format(minKg)} - ${formatter.format(maxKg)} kg`
  } else {
    return `${formatter.format(kgToLbs(minKg))} - ${formatter.format(kgToLbs(maxKg))} lbs`
  }
}

/**
 * Get display weight in the user's unit system
 */
export function getDisplayWeight(weightKg: number, unitSystem: 'metric' | 'imperial'): number {
  return unitSystem === 'metric' ? weightKg : roundToDecimals(kgToLbs(weightKg), 1)
}
