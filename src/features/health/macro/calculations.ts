import type {
  MacroInputs,
  MacroResult,
  MacroValidation,
  Gender,
  ActivityLevel,
  Goal,
  DietPreset,
  MacroBreakdown,
} from './types'
import {
  ACTIVITY_MULTIPLIERS,
  GOAL_CALORIE_ADJUSTMENTS,
  DIET_PRESET_RATIOS,
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
 * Males:   BMR = (10 x weight[kg]) + (6.25 x height[cm]) - (5 x age) + 5
 * Females: BMR = (10 x weight[kg]) + (6.25 x height[cm]) - (5 x age) - 161
 *
 * Source: https://pubmed.ncbi.nlm.nih.gov/2305711/
 */
export function calculateBMRMifflinStJeor(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return gender === 'male' ? base + 5 : base - 161
}

/**
 * Calculate TDEE from BMR and activity level
 * TDEE = BMR x Activity Multiplier
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel]
}

/**
 * Calculate target calories based on TDEE and goal
 */
export function calculateTargetCalories(tdee: number, goal: Goal): number {
  const adjustment = GOAL_CALORIE_ADJUSTMENTS[goal]
  // Ensure minimum calories (1200 for safety)
  return Math.max(1200, tdee + adjustment)
}

// ============================================
// Macro Calculation Functions
// ============================================

/**
 * Get macro ratios based on diet preset or custom values
 * Returns [carbs%, protein%, fat%]
 */
export function getMacroRatios(
  dietPreset: DietPreset,
  customCarbs?: number,
  customProtein?: number,
  customFat?: number
): [number, number, number] {
  if (dietPreset === 'custom' && customCarbs !== undefined && customProtein !== undefined && customFat !== undefined) {
    // Normalize custom ratios to ensure they sum to 100
    const total = customCarbs + customProtein + customFat
    if (total > 0) {
      return [
        (customCarbs / total) * 100,
        (customProtein / total) * 100,
        (customFat / total) * 100,
      ]
    }
    // Fallback to balanced if custom ratios are invalid
    return DIET_PRESET_RATIOS.balanced
  }

  return DIET_PRESET_RATIOS[dietPreset as Exclude<DietPreset, 'custom'>] || DIET_PRESET_RATIOS.balanced
}

/**
 * Calculate macro breakdown from calories and percentage
 * Protein: 4 calories per gram
 * Carbohydrates: 4 calories per gram
 * Fat: 9 calories per gram
 */
export function calculateMacroBreakdown(
  totalCalories: number,
  percentage: number,
  caloriesPerGram: number
): MacroBreakdown {
  const calories = (totalCalories * percentage) / 100
  const grams = calories / caloriesPerGram

  return {
    grams: roundToDecimals(grams, 0),
    calories: roundToDecimals(calories, 0),
    percentage: roundToDecimals(percentage, 0),
  }
}

/**
 * Calculate all macros based on target calories and diet preset
 */
export function calculateAllMacros(
  targetCalories: number,
  dietPreset: DietPreset,
  customCarbs?: number,
  customProtein?: number,
  customFat?: number
): { protein: MacroBreakdown; carbs: MacroBreakdown; fat: MacroBreakdown } {
  const [carbsPercent, proteinPercent, fatPercent] = getMacroRatios(
    dietPreset,
    customCarbs,
    customProtein,
    customFat
  )

  return {
    carbs: calculateMacroBreakdown(targetCalories, carbsPercent, 4),
    protein: calculateMacroBreakdown(targetCalories, proteinPercent, 4),
    fat: calculateMacroBreakdown(targetCalories, fatPercent, 9),
  }
}

// ============================================
// Validation Functions
// ============================================

/**
 * Validate metric Macro inputs
 */
function validateMetricInputs(inputs: Partial<MacroInputs>): MacroValidation {
  const errors: MacroValidation['errors'] = []

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
 * Validate imperial Macro inputs
 */
function validateImperialInputs(inputs: Partial<MacroInputs>): MacroValidation {
  const errors: MacroValidation['errors'] = []

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
 * Validate common Macro inputs (age, gender, activity level, goal, diet)
 */
function validateCommonInputs(inputs: Partial<MacroInputs>): MacroValidation {
  const errors: MacroValidation['errors'] = []

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

  // Validate gender
  if (!inputs.gender) {
    errors.push({ field: 'gender', message: 'validation.genderRequired' })
  } else if (!['male', 'female'].includes(inputs.gender)) {
    errors.push({ field: 'gender', message: 'validation.genderInvalid' })
  }

  // Validate activity level
  if (!inputs.activityLevel) {
    errors.push({ field: 'activityLevel', message: 'validation.activityRequired' })
  }

  // Validate goal
  if (!inputs.goal) {
    errors.push({ field: 'goal', message: 'validation.goalRequired' })
  }

  // Validate diet preset
  if (!inputs.dietPreset) {
    errors.push({ field: 'dietPreset', message: 'validation.dietPresetRequired' })
  }

  // Validate custom macro ratios if diet preset is custom
  if (inputs.dietPreset === 'custom') {
    const { customCarbsPercent, customProteinPercent, customFatPercent } = inputs

    if (customCarbsPercent === undefined || customProteinPercent === undefined || customFatPercent === undefined) {
      errors.push({ field: 'customMacros', message: 'validation.customMacrosRequired' })
    } else {
      const total = customCarbsPercent + customProteinPercent + customFatPercent
      if (Math.abs(total - 100) > 1) {
        errors.push({ field: 'customMacros', message: 'validation.customMacrosSumTo100' })
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Validate all Macro inputs
 */
export function validateMacroInputs(inputs: Partial<MacroInputs>): MacroValidation {
  const commonValidation = validateCommonInputs(inputs)

  let unitValidation: MacroValidation
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
 * Main Macro calculation function
 */
export function calculateMacros(inputs: MacroInputs): MacroResult {
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

  // Calculate BMR using Mifflin-St Jeor
  const bmr = calculateBMRMifflinStJeor(weightKg, heightCm, inputs.age, inputs.gender)

  // Calculate TDEE
  const activityMultiplier = ACTIVITY_MULTIPLIERS[inputs.activityLevel]
  const tdee = calculateTDEE(bmr, inputs.activityLevel)

  // Calculate target calories based on goal
  const calorieAdjustment = GOAL_CALORIE_ADJUSTMENTS[inputs.goal]
  const targetCalories = calculateTargetCalories(tdee, inputs.goal)

  // Calculate macros
  const macros = calculateAllMacros(
    targetCalories,
    inputs.dietPreset,
    inputs.customCarbsPercent,
    inputs.customProteinPercent,
    inputs.customFatPercent
  )

  return {
    bmr: roundToDecimals(bmr, 0),
    tdee: roundToDecimals(tdee, 0),
    targetCalories: roundToDecimals(targetCalories, 0),
    activityMultiplier,
    calorieAdjustment,
    protein: macros.protein,
    carbs: macros.carbs,
    fat: macros.fat,
    dietPresetUsed: inputs.dietPreset,
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
 * Format grams for display
 */
export function formatGrams(grams: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(grams)
}

/**
 * Format percentage for display
 */
export function formatPercentage(percentage: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(percentage)
}
