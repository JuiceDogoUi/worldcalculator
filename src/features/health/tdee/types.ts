/**
 * TDEE (Total Daily Energy Expenditure) Calculator Types
 * Based on Mifflin-St Jeor and Harris-Benedict equations
 */

/**
 * Unit system for height and weight input
 */
export type UnitSystem = 'metric' | 'imperial'

/**
 * Biological sex for BMR calculation
 */
export type BiologicalSex = 'male' | 'female'

/**
 * BMR formula selection
 * - mifflin: Mifflin-St Jeor (most accurate for general population)
 * - harris: Harris-Benedict (traditional, slightly overestimates)
 * - katch: Katch-McArdle (best if body fat % is known)
 */
export type BMRFormula = 'mifflin' | 'harris' | 'katch'

/**
 * Activity level with corresponding multiplier
 * Based on standard activity factor multipliers
 */
export type ActivityLevel =
  | 'sedentary'      // 1.2 - Little or no exercise, desk job
  | 'light'          // 1.375 - Light exercise 1-3 days/week
  | 'moderate'       // 1.55 - Moderate exercise 3-5 days/week
  | 'active'         // 1.725 - Heavy exercise 6-7 days/week
  | 'veryActive'     // 1.9 - Very heavy exercise, physical job
  | 'athlete'        // 2.0-2.3 - Professional athlete level

/**
 * Activity level multiplier constants
 */
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
  athlete: 2.1,
} as const

/**
 * Weight goal options
 */
export type WeightGoal =
  | 'extremeLoss'    // -1000 calories (lose ~1 kg/week)
  | 'loss'           // -500 calories (lose ~0.5 kg/week)
  | 'mildLoss'       // -250 calories (lose ~0.25 kg/week)
  | 'maintain'       // 0 calories (maintain weight)
  | 'mildGain'       // +250 calories (gain ~0.25 kg/week)
  | 'gain'           // +500 calories (gain ~0.5 kg/week)
  | 'extremeGain'    // +1000 calories (gain ~1 kg/week)

/**
 * Calorie adjustment for weight goals (in kcal)
 */
export const GOAL_CALORIE_ADJUSTMENTS: Record<WeightGoal, number> = {
  extremeLoss: -1000,
  loss: -500,
  mildLoss: -250,
  maintain: 0,
  mildGain: 250,
  gain: 500,
  extremeGain: 1000,
} as const

/**
 * Macronutrient ratios for different goals
 * Values are percentages [protein, carbs, fat]
 */
export const MACRO_RATIOS: Record<'balanced' | 'lowCarb' | 'highProtein' | 'lowFat', [number, number, number]> = {
  balanced: [30, 40, 30],      // Standard balanced diet
  lowCarb: [40, 20, 40],       // Low carb / keto-ish
  highProtein: [40, 35, 25],   // Muscle building
  lowFat: [30, 50, 20],        // Low fat diet
} as const

/**
 * TDEE inputs from user
 */
export interface TDEEInputs {
  unitSystem: UnitSystem
  sex: BiologicalSex
  age: number
  // Metric inputs
  heightCm?: number
  weightKg?: number
  // Imperial inputs
  heightFeet?: number
  heightInches?: number
  weightLbs?: number
  // Activity and formula
  activityLevel: ActivityLevel
  formula: BMRFormula
  // Optional: body fat percentage (for Katch-McArdle)
  bodyFatPercentage?: number
}

/**
 * Macronutrient breakdown in grams
 */
export interface MacroBreakdown {
  protein: number    // grams
  carbs: number      // grams
  fat: number        // grams
  proteinCalories: number
  carbsCalories: number
  fatCalories: number
}

/**
 * Calorie goals for different weight objectives
 */
export interface CalorieGoals {
  extremeLoss: number   // -1000 kcal
  loss: number          // -500 kcal
  mildLoss: number      // -250 kcal
  maintain: number      // TDEE
  mildGain: number      // +250 kcal
  gain: number          // +500 kcal
  extremeGain: number   // +1000 kcal
}

/**
 * TDEE calculation result
 */
export interface TDEEResult {
  bmr: number                          // Basal Metabolic Rate (kcal/day)
  tdee: number                         // Total Daily Energy Expenditure (kcal/day)
  activityMultiplier: number           // Activity factor used
  formulaUsed: BMRFormula              // Formula used for calculation
  calorieGoals: CalorieGoals           // Calories for different goals
  macros: {
    balanced: MacroBreakdown
    lowCarb: MacroBreakdown
    highProtein: MacroBreakdown
    lowFat: MacroBreakdown
  }
  // Additional metrics
  bmiEstimate?: number                 // BMI if calculable
  idealWeightRange?: {
    min: number
    max: number
    unit: 'kg' | 'lbs'
  }
}

/**
 * Validation result for TDEE inputs
 */
export interface TDEEValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
