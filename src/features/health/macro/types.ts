/**
 * Macro Calculator Types
 * Macronutrient Calculator based on Mifflin-St Jeor equation
 */

/**
 * Unit system for height and weight input
 */
export type UnitSystem = 'metric' | 'imperial'

/**
 * Biological sex for BMR calculation
 */
export type Gender = 'male' | 'female'

/**
 * Activity level with corresponding multiplier
 * Based on standard activity factor multipliers
 */
export type ActivityLevel =
  | 'sedentary'       // 1.2 - Little or no exercise, desk job
  | 'lightlyActive'   // 1.375 - Light exercise 1-3 days/week
  | 'moderatelyActive' // 1.55 - Moderate exercise 3-5 days/week
  | 'veryActive'      // 1.725 - Heavy exercise 6-7 days/week
  | 'extremelyActive' // 1.9 - Very heavy exercise, physical job

/**
 * Activity level multiplier constants
 */
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightlyActive: 1.375,
  moderatelyActive: 1.55,
  veryActive: 1.725,
  extremelyActive: 1.9,
} as const

/**
 * Weight/fitness goal
 */
export type Goal = 'lose' | 'maintain' | 'gain'

/**
 * Calorie adjustment for goals
 * - Lose weight: -500 kcal (moderate deficit for ~0.5kg/week loss)
 * - Maintain: 0 kcal
 * - Gain muscle: +300 kcal (lean bulk surplus)
 */
export const GOAL_CALORIE_ADJUSTMENTS: Record<Goal, number> = {
  lose: -500,
  maintain: 0,
  gain: 300,
} as const

/**
 * Diet preference/preset
 */
export type DietPreset = 'balanced' | 'lowCarb' | 'highProtein' | 'keto' | 'custom'

/**
 * Macro ratios for diet presets [carbs%, protein%, fat%]
 */
export const DIET_PRESET_RATIOS: Record<Exclude<DietPreset, 'custom'>, [number, number, number]> = {
  balanced: [40, 30, 30],     // Standard balanced diet
  lowCarb: [25, 40, 35],      // Low carbohydrate diet
  highProtein: [30, 40, 30],  // High protein for muscle building
  keto: [5, 25, 70],          // Ketogenic diet
} as const

/**
 * Macro colors for visualization (Tailwind-compatible hex colors)
 */
export const MACRO_COLORS = {
  carbs: '#3b82f6',    // blue-500
  protein: '#22c55e',  // green-500
  fat: '#f59e0b',      // amber-500
} as const

/**
 * Macro background colors for UI
 */
export const MACRO_BG_COLORS = {
  carbs: '#dbeafe',    // blue-100
  protein: '#dcfce7',  // green-100
  fat: '#fef3c7',      // amber-100
} as const

/**
 * Macro inputs from user
 */
export interface MacroInputs {
  unitSystem: UnitSystem
  gender: Gender
  age: number
  activityLevel: ActivityLevel
  goal: Goal
  dietPreset: DietPreset
  // Metric inputs
  heightCm?: number
  weightKg?: number
  // Imperial inputs
  heightFeet?: number
  heightInches?: number
  weightLbs?: number
  // Custom macro ratios (only used when dietPreset is 'custom')
  customCarbsPercent?: number
  customProteinPercent?: number
  customFatPercent?: number
}

/**
 * Individual macro breakdown
 */
export interface MacroBreakdown {
  grams: number
  calories: number
  percentage: number
}

/**
 * Macro calculation result
 */
export interface MacroResult {
  bmr: number                     // Basal Metabolic Rate (kcal/day)
  tdee: number                    // Total Daily Energy Expenditure (kcal/day)
  targetCalories: number          // Adjusted calories based on goal
  activityMultiplier: number      // Activity factor used
  calorieAdjustment: number       // Adjustment from goal (+/- kcal)
  protein: MacroBreakdown
  carbs: MacroBreakdown
  fat: MacroBreakdown
  dietPresetUsed: DietPreset
}

/**
 * Validation result for Macro inputs
 */
export interface MacroValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
