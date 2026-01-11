import type {
  TDEEInputs,
  TDEEResult,
  TDEEValidation,
  BiologicalSex,
  BMRFormula,
  ActivityLevel,
  MacroBreakdown,
  CalorieGoals,
} from './types'
import {
  ACTIVITY_MULTIPLIERS,
  GOAL_CALORIE_ADJUSTMENTS,
  MACRO_RATIOS,
} from './types'

/**
 * Round to specified decimal places
 */
function roundToDecimals(value: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

// ============================================
// Unit Conversion Functions
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
// BMR Calculation Functions
// ============================================

/**
 * Calculate BMR using Mifflin-St Jeor Equation (1990)
 * Most accurate for general population
 *
 * Males:   BMR = (10 × weight[kg]) + (6.25 × height[cm]) - (5 × age) + 5
 * Females: BMR = (10 × weight[kg]) + (6.25 × height[cm]) - (5 × age) - 161
 *
 * Source: https://pubmed.ncbi.nlm.nih.gov/2305711/
 */
export function calculateBMRMifflin(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: BiologicalSex
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

/**
 * Calculate BMR using Harris-Benedict Equation (1919, revised 1984)
 * Traditional formula, slightly overestimates for obese individuals
 *
 * Males:   BMR = (13.397 × weight[kg]) + (4.799 × height[cm]) - (5.677 × age) + 88.362
 * Females: BMR = (9.247 × weight[kg]) + (3.098 × height[cm]) - (4.330 × age) + 447.593
 *
 * Source: https://pubmed.ncbi.nlm.nih.gov/6741850/
 */
export function calculateBMRHarrisBenedict(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: BiologicalSex
): number {
  if (sex === 'male') {
    return 13.397 * weightKg + 4.799 * heightCm - 5.677 * age + 88.362
  } else {
    return 9.247 * weightKg + 3.098 * heightCm - 4.330 * age + 447.593
  }
}

/**
 * Calculate BMR using Katch-McArdle Formula
 * Best when body fat percentage is known and person is relatively lean
 *
 * BMR = 370 + (21.6 × LBM[kg])
 * where LBM = Lean Body Mass = weight × (1 - body fat percentage / 100)
 *
 * Source: https://en.wikipedia.org/wiki/Basal_metabolic_rate#Katch%E2%80%93McArdle_formula
 */
export function calculateBMRKatchMcArdle(
  weightKg: number,
  bodyFatPercentage: number
): number {
  const leanBodyMass = weightKg * (1 - bodyFatPercentage / 100)
  return 370 + 21.6 * leanBodyMass
}

/**
 * Calculate BMR based on selected formula
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: BiologicalSex,
  formula: BMRFormula,
  bodyFatPercentage?: number
): number {
  switch (formula) {
    case 'mifflin':
      return calculateBMRMifflin(weightKg, heightCm, age, sex)
    case 'harris':
      return calculateBMRHarrisBenedict(weightKg, heightCm, age, sex)
    case 'katch':
      if (bodyFatPercentage !== undefined) {
        return calculateBMRKatchMcArdle(weightKg, bodyFatPercentage)
      }
      // Fallback to Mifflin if body fat not provided
      return calculateBMRMifflin(weightKg, heightCm, age, sex)
    default:
      return calculateBMRMifflin(weightKg, heightCm, age, sex)
  }
}

/**
 * Calculate TDEE from BMR and activity level
 * TDEE = BMR × Activity Multiplier
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel]
}

// ============================================
// Macronutrient Calculations
// ============================================

/**
 * Calculate macronutrient breakdown
 * Protein: 4 calories per gram
 * Carbohydrates: 4 calories per gram
 * Fat: 9 calories per gram
 */
export function calculateMacros(
  totalCalories: number,
  ratios: [number, number, number]
): MacroBreakdown {
  const [proteinPct, carbsPct, fatPct] = ratios

  const proteinCalories = (totalCalories * proteinPct) / 100
  const carbsCalories = (totalCalories * carbsPct) / 100
  const fatCalories = (totalCalories * fatPct) / 100

  return {
    protein: roundToDecimals(proteinCalories / 4, 0),
    carbs: roundToDecimals(carbsCalories / 4, 0),
    fat: roundToDecimals(fatCalories / 9, 0),
    proteinCalories: roundToDecimals(proteinCalories, 0),
    carbsCalories: roundToDecimals(carbsCalories, 0),
    fatCalories: roundToDecimals(fatCalories, 0),
  }
}

/**
 * Calculate calorie goals for different weight objectives
 */
export function calculateCalorieGoals(tdee: number): CalorieGoals {
  return {
    extremeLoss: Math.max(1200, roundToDecimals(tdee + GOAL_CALORIE_ADJUSTMENTS.extremeLoss, 0)),
    loss: Math.max(1200, roundToDecimals(tdee + GOAL_CALORIE_ADJUSTMENTS.loss, 0)),
    mildLoss: Math.max(1200, roundToDecimals(tdee + GOAL_CALORIE_ADJUSTMENTS.mildLoss, 0)),
    maintain: roundToDecimals(tdee, 0),
    mildGain: roundToDecimals(tdee + GOAL_CALORIE_ADJUSTMENTS.mildGain, 0),
    gain: roundToDecimals(tdee + GOAL_CALORIE_ADJUSTMENTS.gain, 0),
    extremeGain: roundToDecimals(tdee + GOAL_CALORIE_ADJUSTMENTS.extremeGain, 0),
  }
}

// ============================================
// Validation Functions
// ============================================

/**
 * Validate metric TDEE inputs
 */
function validateMetricInputs(inputs: Partial<TDEEInputs>): TDEEValidation {
  const errors: TDEEValidation['errors'] = []

  // Validate height in cm
  if (inputs.heightCm === undefined || inputs.heightCm === null) {
    errors.push({ field: 'heightCm', message: 'validation.heightRequired' })
  } else if (isNaN(inputs.heightCm)) {
    errors.push({ field: 'heightCm', message: 'validation.heightInvalid' })
  } else if (inputs.heightCm <= 0) {
    errors.push({ field: 'heightCm', message: 'validation.heightPositive' })
  } else if (inputs.heightCm < 50) {
    errors.push({ field: 'heightCm', message: 'validation.heightTooLow' })
  } else if (inputs.heightCm > 300) {
    errors.push({ field: 'heightCm', message: 'validation.heightTooHigh' })
  }

  // Validate weight in kg
  if (inputs.weightKg === undefined || inputs.weightKg === null) {
    errors.push({ field: 'weightKg', message: 'validation.weightRequired' })
  } else if (isNaN(inputs.weightKg)) {
    errors.push({ field: 'weightKg', message: 'validation.weightInvalid' })
  } else if (inputs.weightKg <= 0) {
    errors.push({ field: 'weightKg', message: 'validation.weightPositive' })
  } else if (inputs.weightKg < 20) {
    errors.push({ field: 'weightKg', message: 'validation.weightTooLow' })
  } else if (inputs.weightKg > 500) {
    errors.push({ field: 'weightKg', message: 'validation.weightTooHigh' })
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Validate imperial TDEE inputs
 */
function validateImperialInputs(inputs: Partial<TDEEInputs>): TDEEValidation {
  const errors: TDEEValidation['errors'] = []

  // Validate height feet
  if (inputs.heightFeet === undefined || inputs.heightFeet === null) {
    errors.push({ field: 'heightFeet', message: 'validation.heightFeetRequired' })
  } else if (isNaN(inputs.heightFeet)) {
    errors.push({ field: 'heightFeet', message: 'validation.heightFeetInvalid' })
  } else if (inputs.heightFeet < 0) {
    errors.push({ field: 'heightFeet', message: 'validation.heightFeetPositive' })
  } else if (inputs.heightFeet < 1) {
    errors.push({ field: 'heightFeet', message: 'validation.heightFeetTooLow' })
  } else if (inputs.heightFeet > 9) {
    errors.push({ field: 'heightFeet', message: 'validation.heightFeetTooHigh' })
  }

  // Validate height inches
  if (inputs.heightInches === undefined || inputs.heightInches === null) {
    errors.push({ field: 'heightInches', message: 'validation.heightInchesRequired' })
  } else if (isNaN(inputs.heightInches)) {
    errors.push({ field: 'heightInches', message: 'validation.heightInchesInvalid' })
  } else if (inputs.heightInches < 0) {
    errors.push({ field: 'heightInches', message: 'validation.heightInchesPositive' })
  } else if (inputs.heightInches > 11) {
    errors.push({ field: 'heightInches', message: 'validation.heightInchesTooHigh' })
  }

  // Validate weight in lbs
  if (inputs.weightLbs === undefined || inputs.weightLbs === null) {
    errors.push({ field: 'weightLbs', message: 'validation.weightRequired' })
  } else if (isNaN(inputs.weightLbs)) {
    errors.push({ field: 'weightLbs', message: 'validation.weightInvalid' })
  } else if (inputs.weightLbs <= 0) {
    errors.push({ field: 'weightLbs', message: 'validation.weightPositive' })
  } else if (inputs.weightLbs < 44) {
    errors.push({ field: 'weightLbs', message: 'validation.weightTooLow' })
  } else if (inputs.weightLbs > 1100) {
    errors.push({ field: 'weightLbs', message: 'validation.weightTooHigh' })
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Validate common TDEE inputs (age, sex, activity level)
 */
function validateCommonInputs(inputs: Partial<TDEEInputs>): TDEEValidation {
  const errors: TDEEValidation['errors'] = []

  // Validate age
  if (inputs.age === undefined || inputs.age === null) {
    errors.push({ field: 'age', message: 'validation.ageRequired' })
  } else if (isNaN(inputs.age)) {
    errors.push({ field: 'age', message: 'validation.ageInvalid' })
  } else if (inputs.age < 15) {
    errors.push({ field: 'age', message: 'validation.ageTooLow' })
  } else if (inputs.age > 120) {
    errors.push({ field: 'age', message: 'validation.ageTooHigh' })
  }

  // Validate sex
  if (!inputs.sex) {
    errors.push({ field: 'sex', message: 'validation.sexRequired' })
  } else if (!['male', 'female'].includes(inputs.sex)) {
    errors.push({ field: 'sex', message: 'validation.sexInvalid' })
  }

  // Validate activity level
  if (!inputs.activityLevel) {
    errors.push({ field: 'activityLevel', message: 'validation.activityRequired' })
  }

  // Validate body fat percentage if Katch formula selected
  if (inputs.formula === 'katch') {
    if (inputs.bodyFatPercentage !== undefined) {
      if (isNaN(inputs.bodyFatPercentage)) {
        errors.push({ field: 'bodyFatPercentage', message: 'validation.bodyFatInvalid' })
      } else if (inputs.bodyFatPercentage < 3) {
        errors.push({ field: 'bodyFatPercentage', message: 'validation.bodyFatTooLow' })
      } else if (inputs.bodyFatPercentage > 70) {
        errors.push({ field: 'bodyFatPercentage', message: 'validation.bodyFatTooHigh' })
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Validate all TDEE inputs
 */
export function validateTDEEInputs(inputs: Partial<TDEEInputs>): TDEEValidation {
  const commonValidation = validateCommonInputs(inputs)

  let unitValidation: TDEEValidation
  if (inputs.unitSystem === 'metric') {
    unitValidation = validateMetricInputs(inputs)
  } else if (inputs.unitSystem === 'imperial') {
    unitValidation = validateImperialInputs(inputs)
  } else {
    unitValidation = {
      valid: false,
      errors: [{ field: 'unitSystem', message: 'validation.unitSystemRequired' }],
    }
  }

  const allErrors = [...commonValidation.errors, ...unitValidation.errors]
  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  }
}

// ============================================
// Main Calculation Function
// ============================================

/**
 * Calculate BMI from weight and height
 */
function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

/**
 * Calculate ideal weight range based on BMI 18.5-25
 */
function calculateIdealWeightRange(
  heightCm: number,
  unitSystem: 'metric' | 'imperial'
): { min: number; max: number; unit: 'kg' | 'lbs' } {
  const heightM = heightCm / 100
  const minKg = 18.5 * heightM * heightM
  const maxKg = 25 * heightM * heightM

  if (unitSystem === 'metric') {
    return {
      min: roundToDecimals(minKg, 1),
      max: roundToDecimals(maxKg, 1),
      unit: 'kg',
    }
  } else {
    return {
      min: roundToDecimals(kgToLbs(minKg), 0),
      max: roundToDecimals(kgToLbs(maxKg), 0),
      unit: 'lbs',
    }
  }
}

/**
 * Main TDEE calculation function
 */
export function calculateTDEEResult(inputs: TDEEInputs): TDEEResult {
  // Convert to metric for calculations
  let heightCm: number
  let weightKg: number

  if (inputs.unitSystem === 'metric') {
    heightCm = inputs.heightCm!
    weightKg = inputs.weightKg!
  } else {
    heightCm = feetInchesToCm(inputs.heightFeet!, inputs.heightInches!)
    weightKg = lbsToKg(inputs.weightLbs!)
  }

  // Calculate BMR
  const bmr = calculateBMR(
    weightKg,
    heightCm,
    inputs.age,
    inputs.sex,
    inputs.formula,
    inputs.bodyFatPercentage
  )

  // Calculate TDEE
  const activityMultiplier = ACTIVITY_MULTIPLIERS[inputs.activityLevel]
  const tdee = calculateTDEE(bmr, inputs.activityLevel)

  // Calculate calorie goals
  const calorieGoals = calculateCalorieGoals(tdee)

  // Calculate macros for maintenance calories
  const maintainCalories = calorieGoals.maintain
  const macros = {
    balanced: calculateMacros(maintainCalories, MACRO_RATIOS.balanced),
    lowCarb: calculateMacros(maintainCalories, MACRO_RATIOS.lowCarb),
    highProtein: calculateMacros(maintainCalories, MACRO_RATIOS.highProtein),
    lowFat: calculateMacros(maintainCalories, MACRO_RATIOS.lowFat),
  }

  // Calculate additional metrics
  const bmiEstimate = calculateBMI(weightKg, heightCm)
  const idealWeightRange = calculateIdealWeightRange(heightCm, inputs.unitSystem)

  return {
    bmr: roundToDecimals(bmr, 0),
    tdee: roundToDecimals(tdee, 0),
    activityMultiplier,
    formulaUsed: inputs.formula,
    calorieGoals,
    macros,
    bmiEstimate: roundToDecimals(bmiEstimate, 1),
    idealWeightRange,
  }
}

// ============================================
// Formatting Functions
// ============================================

/**
 * Format calories for display
 */
export function formatCalories(calories: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(calories)
}

/**
 * Format weight for display
 */
export function formatWeight(weight: number, unit: 'kg' | 'lbs', locale: string = 'en-US'): string {
  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: unit === 'kg' ? 1 : 0,
  })
  return `${formatter.format(weight)} ${unit}`
}

/**
 * Format macros for display
 */
export function formatMacros(grams: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(grams)
}
