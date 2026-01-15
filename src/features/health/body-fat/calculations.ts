import type {
  BodyFatInputs,
  BodyFatResult,
  BodyFatCategory,
  BodyFatValidation,
  Gender,
} from './types'
import {
  BODY_FAT_THRESHOLDS,
  BODY_FAT_CATEGORY_COLORS,
  BODY_FAT_CATEGORY_BG_COLORS,
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
 * Convert inches to centimeters
 * 1 inch = 2.54 cm
 */
export function inchesToCm(inches: number): number {
  return inches * 2.54
}

/**
 * Convert centimeters to inches
 * 1 cm = 0.393701 inches
 */
export function cmToInches(cm: number): number {
  return cm / 2.54
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
 * Validate metric inputs
 */
function validateMetricInputs(
  inputs: Partial<BodyFatInputs>
): BodyFatValidation {
  const errors: BodyFatValidation['errors'] = []

  // Validate height
  if (inputs.heightCm === undefined || inputs.heightCm === null) {
    errors.push({ field: 'heightCm', message: 'validation.heightRequired' })
  } else if (isNaN(inputs.heightCm) || inputs.heightCm <= 0) {
    errors.push({ field: 'heightCm', message: 'validation.heightPositive' })
  } else if (inputs.heightCm < 100) {
    errors.push({ field: 'heightCm', message: 'validation.heightTooLow' })
  } else if (inputs.heightCm > 250) {
    errors.push({ field: 'heightCm', message: 'validation.heightTooHigh' })
  }

  // Validate weight
  if (inputs.weightKg === undefined || inputs.weightKg === null) {
    errors.push({ field: 'weightKg', message: 'validation.weightRequired' })
  } else if (isNaN(inputs.weightKg) || inputs.weightKg <= 0) {
    errors.push({ field: 'weightKg', message: 'validation.weightPositive' })
  } else if (inputs.weightKg < 30) {
    errors.push({ field: 'weightKg', message: 'validation.weightTooLow' })
  } else if (inputs.weightKg > 300) {
    errors.push({ field: 'weightKg', message: 'validation.weightTooHigh' })
  }

  // Validate neck circumference
  if (inputs.neckCm === undefined || inputs.neckCm === null) {
    errors.push({ field: 'neckCm', message: 'validation.neckRequired' })
  } else if (isNaN(inputs.neckCm) || inputs.neckCm <= 0) {
    errors.push({ field: 'neckCm', message: 'validation.neckPositive' })
  } else if (inputs.neckCm < 20) {
    errors.push({ field: 'neckCm', message: 'validation.neckTooLow' })
  } else if (inputs.neckCm > 60) {
    errors.push({ field: 'neckCm', message: 'validation.neckTooHigh' })
  }

  // Validate waist circumference
  if (inputs.waistCm === undefined || inputs.waistCm === null) {
    errors.push({ field: 'waistCm', message: 'validation.waistRequired' })
  } else if (isNaN(inputs.waistCm) || inputs.waistCm <= 0) {
    errors.push({ field: 'waistCm', message: 'validation.waistPositive' })
  } else if (inputs.waistCm < 40) {
    errors.push({ field: 'waistCm', message: 'validation.waistTooLow' })
  } else if (inputs.waistCm > 200) {
    errors.push({ field: 'waistCm', message: 'validation.waistTooHigh' })
  }

  // Validate hip circumference (only for women)
  if (inputs.gender === 'female') {
    if (inputs.hipCm === undefined || inputs.hipCm === null) {
      errors.push({ field: 'hipCm', message: 'validation.hipRequired' })
    } else if (isNaN(inputs.hipCm) || inputs.hipCm <= 0) {
      errors.push({ field: 'hipCm', message: 'validation.hipPositive' })
    } else if (inputs.hipCm < 50) {
      errors.push({ field: 'hipCm', message: 'validation.hipTooLow' })
    } else if (inputs.hipCm > 200) {
      errors.push({ field: 'hipCm', message: 'validation.hipTooHigh' })
    }
  }

  // Validate waist > neck (required for formula to work)
  if (
    inputs.waistCm &&
    inputs.neckCm &&
    inputs.waistCm <= inputs.neckCm
  ) {
    errors.push({
      field: 'waistCm',
      message: 'validation.waistMustBeGreaterThanNeck',
    })
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Validate imperial inputs
 */
function validateImperialInputs(
  inputs: Partial<BodyFatInputs>
): BodyFatValidation {
  const errors: BodyFatValidation['errors'] = []

  // Validate height
  if (inputs.heightInches === undefined || inputs.heightInches === null) {
    errors.push({
      field: 'heightInches',
      message: 'validation.heightRequired',
    })
  } else if (isNaN(inputs.heightInches) || inputs.heightInches <= 0) {
    errors.push({
      field: 'heightInches',
      message: 'validation.heightPositive',
    })
  } else if (inputs.heightInches < 39) {
    // ~100 cm
    errors.push({
      field: 'heightInches',
      message: 'validation.heightTooLow',
    })
  } else if (inputs.heightInches > 98) {
    // ~250 cm
    errors.push({
      field: 'heightInches',
      message: 'validation.heightTooHigh',
    })
  }

  // Validate weight
  if (inputs.weightLbs === undefined || inputs.weightLbs === null) {
    errors.push({ field: 'weightLbs', message: 'validation.weightRequired' })
  } else if (isNaN(inputs.weightLbs) || inputs.weightLbs <= 0) {
    errors.push({ field: 'weightLbs', message: 'validation.weightPositive' })
  } else if (inputs.weightLbs < 66) {
    // ~30 kg
    errors.push({ field: 'weightLbs', message: 'validation.weightTooLow' })
  } else if (inputs.weightLbs > 661) {
    // ~300 kg
    errors.push({ field: 'weightLbs', message: 'validation.weightTooHigh' })
  }

  // Validate neck circumference
  if (inputs.neckInches === undefined || inputs.neckInches === null) {
    errors.push({
      field: 'neckInches',
      message: 'validation.neckRequired',
    })
  } else if (isNaN(inputs.neckInches) || inputs.neckInches <= 0) {
    errors.push({
      field: 'neckInches',
      message: 'validation.neckPositive',
    })
  } else if (inputs.neckInches < 8) {
    // ~20 cm
    errors.push({
      field: 'neckInches',
      message: 'validation.neckTooLow',
    })
  } else if (inputs.neckInches > 24) {
    // ~60 cm
    errors.push({
      field: 'neckInches',
      message: 'validation.neckTooHigh',
    })
  }

  // Validate waist circumference
  if (inputs.waistInches === undefined || inputs.waistInches === null) {
    errors.push({
      field: 'waistInches',
      message: 'validation.waistRequired',
    })
  } else if (isNaN(inputs.waistInches) || inputs.waistInches <= 0) {
    errors.push({
      field: 'waistInches',
      message: 'validation.waistPositive',
    })
  } else if (inputs.waistInches < 16) {
    // ~40 cm
    errors.push({
      field: 'waistInches',
      message: 'validation.waistTooLow',
    })
  } else if (inputs.waistInches > 79) {
    // ~200 cm
    errors.push({
      field: 'waistInches',
      message: 'validation.waistTooHigh',
    })
  }

  // Validate hip circumference (only for women)
  if (inputs.gender === 'female') {
    if (inputs.hipInches === undefined || inputs.hipInches === null) {
      errors.push({
        field: 'hipInches',
        message: 'validation.hipRequired',
      })
    } else if (isNaN(inputs.hipInches) || inputs.hipInches <= 0) {
      errors.push({
        field: 'hipInches',
        message: 'validation.hipPositive',
      })
    } else if (inputs.hipInches < 20) {
      // ~50 cm
      errors.push({
        field: 'hipInches',
        message: 'validation.hipTooLow',
      })
    } else if (inputs.hipInches > 79) {
      // ~200 cm
      errors.push({
        field: 'hipInches',
        message: 'validation.hipTooHigh',
      })
    }
  }

  // Validate waist > neck (required for formula to work)
  if (
    inputs.waistInches &&
    inputs.neckInches &&
    inputs.waistInches <= inputs.neckInches
  ) {
    errors.push({
      field: 'waistInches',
      message: 'validation.waistMustBeGreaterThanNeck',
    })
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Validate body fat inputs
 */
export function validateBodyFatInputs(
  inputs: Partial<BodyFatInputs>
): BodyFatValidation {
  const errors: BodyFatValidation['errors'] = []

  // Validate gender
  if (!inputs.gender) {
    errors.push({ field: 'gender', message: 'validation.genderRequired' })
  }

  // Validate age
  if (inputs.age === undefined || inputs.age === null) {
    errors.push({ field: 'age', message: 'validation.ageRequired' })
  } else if (isNaN(inputs.age) || inputs.age <= 0) {
    errors.push({ field: 'age', message: 'validation.agePositive' })
  } else if (inputs.age < 18) {
    errors.push({ field: 'age', message: 'validation.ageTooLow' })
  } else if (inputs.age > 120) {
    errors.push({ field: 'age', message: 'validation.ageTooHigh' })
  }

  // Validate unit system
  if (!inputs.unitSystem) {
    return {
      valid: false,
      errors: [
        ...errors,
        { field: 'unitSystem', message: 'validation.unitSystemRequired' },
      ],
    }
  }

  // Validate measurements based on unit system
  const measurementValidation =
    inputs.unitSystem === 'metric'
      ? validateMetricInputs(inputs)
      : validateImperialInputs(inputs)

  return {
    valid: errors.length === 0 && measurementValidation.valid,
    errors: [...errors, ...measurementValidation.errors],
  }
}

// ============================================
// Body Fat Category Functions
// ============================================

/**
 * Get body fat category based on percentage and gender
 */
export function getBodyFatCategory(
  bodyFatPercentage: number,
  gender: Gender
): BodyFatCategory {
  const thresholds = BODY_FAT_THRESHOLDS[gender]

  if (bodyFatPercentage <= thresholds.essential.max) return 'essential'
  if (bodyFatPercentage <= thresholds.athletic.max) return 'athletic'
  if (bodyFatPercentage <= thresholds.fitness.max) return 'fitness'
  if (bodyFatPercentage <= thresholds.acceptable.max) return 'acceptable'
  return 'obese'
}

/**
 * Get color for body fat category
 */
export function getCategoryColor(category: BodyFatCategory): string {
  return BODY_FAT_CATEGORY_COLORS[category]
}

/**
 * Get background color for body fat category
 */
export function getCategoryBgColor(category: BodyFatCategory): string {
  return BODY_FAT_CATEGORY_BG_COLORS[category]
}

/**
 * Get ideal body fat range based on gender (fitness range)
 */
function getIdealBodyFatRange(gender: Gender): { min: number; max: number } {
  // Return fitness range as ideal
  return {
    min: BODY_FAT_THRESHOLDS[gender].athletic.min,
    max: BODY_FAT_THRESHOLDS[gender].fitness.max,
  }
}

// ============================================
// Main Calculation Functions
// ============================================

/**
 * Calculate body fat percentage using U.S. Navy Method
 *
 * Men: BF% = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
 * Women: BF% = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
 *
 * @param gender - 'male' or 'female'
 * @param heightCm - Height in centimeters
 * @param neckCm - Neck circumference in centimeters
 * @param waistCm - Waist circumference in centimeters
 * @param hipCm - Hip circumference in centimeters (required for women)
 * @returns Body fat percentage
 */
export function calculateBodyFatPercentage(
  gender: Gender,
  heightCm: number,
  neckCm: number,
  waistCm: number,
  hipCm?: number
): number {
  if (gender === 'male') {
    // Men's formula
    const bodyFat =
      86.01 * Math.log10(waistCm - neckCm) -
      70.041 * Math.log10(heightCm) +
      36.76
    return Math.max(0, roundToDecimals(bodyFat, 1))
  } else {
    // Women's formula (requires hip measurement)
    if (hipCm === undefined) {
      throw new Error('Hip measurement is required for women')
    }
    const bodyFat =
      163.205 * Math.log10(waistCm + hipCm - neckCm) -
      97.684 * Math.log10(heightCm) -
      78.387
    return Math.max(0, roundToDecimals(bodyFat, 1))
  }
}

/**
 * Main body fat calculation function
 */
export function calculateBodyFat(inputs: BodyFatInputs): BodyFatResult {
  let heightCm: number
  let weightKg: number
  let neckCm: number
  let waistCm: number
  let hipCm: number | undefined
  const unit: 'kg' | 'lbs' = inputs.unitSystem === 'metric' ? 'kg' : 'lbs'

  // Convert to metric for calculations
  if (inputs.unitSystem === 'metric') {
    heightCm = inputs.heightCm!
    weightKg = inputs.weightKg!
    neckCm = inputs.neckCm!
    waistCm = inputs.waistCm!
    hipCm = inputs.hipCm
  } else {
    heightCm = inchesToCm(inputs.heightInches!)
    weightKg = lbsToKg(inputs.weightLbs!)
    neckCm = inchesToCm(inputs.neckInches!)
    waistCm = inchesToCm(inputs.waistInches!)
    hipCm = inputs.hipInches ? inchesToCm(inputs.hipInches) : undefined
  }

  // Calculate body fat percentage
  const bodyFatPercentage = calculateBodyFatPercentage(
    inputs.gender,
    heightCm,
    neckCm,
    waistCm,
    hipCm
  )

  // Calculate fat and lean mass
  const bodyFatMassKg = (bodyFatPercentage / 100) * weightKg
  const leanBodyMassKg = weightKg - bodyFatMassKg

  // Convert back to user's unit if imperial
  const bodyFatMass =
    unit === 'kg' ? roundToDecimals(bodyFatMassKg, 1) : roundToDecimals(kgToLbs(bodyFatMassKg), 1)
  const leanBodyMass =
    unit === 'kg' ? roundToDecimals(leanBodyMassKg, 1) : roundToDecimals(kgToLbs(leanBodyMassKg), 1)

  // Get category
  const category = getBodyFatCategory(bodyFatPercentage, inputs.gender)

  // Get ideal range
  const idealBodyFatRange = getIdealBodyFatRange(inputs.gender)

  // Calculate fat to lose to reach fitness range
  let fatToLose = 0
  const fitnessUpperLimit = BODY_FAT_THRESHOLDS[inputs.gender].fitness.max
  if (bodyFatPercentage > fitnessUpperLimit) {
    // Calculate weight at target body fat
    // leanMass = weight * (1 - BF%)
    // targetWeight = leanMass / (1 - targetBF%)
    const targetBFDecimal = fitnessUpperLimit / 100
    const targetWeightKg = leanBodyMassKg / (1 - targetBFDecimal)
    const fatToLoseKg = weightKg - targetWeightKg
    fatToLose =
      unit === 'kg'
        ? roundToDecimals(fatToLoseKg, 1)
        : roundToDecimals(kgToLbs(fatToLoseKg), 1)
  }

  return {
    bodyFatPercentage,
    bodyFatMass,
    leanBodyMass,
    category,
    unit,
    idealBodyFatRange,
    fatToLose,
  }
}

// ============================================
// Visual Scale Functions
// ============================================

/**
 * Get body fat scale position as percentage (for visual scale)
 * Maps body fat 0-50% to 0-100%
 */
export function getBodyFatScalePosition(bodyFatPercentage: number): number {
  const minBF = 0
  const maxBF = 50
  const clampedBF = Math.max(minBF, Math.min(maxBF, bodyFatPercentage))
  return (clampedBF / maxBF) * 100
}

/**
 * Get category threshold positions for visual scale
 * Returns positions as percentages for the given gender
 */
export function getCategoryThresholdPositions(gender: Gender): {
  essential: number
  athletic: number
  fitness: number
  acceptable: number
} {
  const maxBF = 50
  const thresholds = BODY_FAT_THRESHOLDS[gender]

  return {
    essential: (thresholds.essential.max / maxBF) * 100,
    athletic: (thresholds.athletic.max / maxBF) * 100,
    fitness: (thresholds.fitness.max / maxBF) * 100,
    acceptable: (thresholds.acceptable.max / maxBF) * 100,
  }
}

/**
 * Format body fat percentage for display
 */
export function formatBodyFatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

/**
 * Format weight for display
 */
export function formatWeight(value: number, unit: 'kg' | 'lbs'): string {
  return `${value.toFixed(1)} ${unit}`
}
