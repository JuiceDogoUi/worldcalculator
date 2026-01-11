/**
 * BMI Calculator Types
 * WHO BMI Classification Standards
 */

/**
 * Unit system for height and weight input
 */
export type UnitSystem = 'metric' | 'imperial'

/**
 * BMI Category based on WHO classification
 * - underweight: BMI < 18.5
 * - normal: BMI 18.5 - 24.9
 * - overweight: BMI 25 - 29.9
 * - obese-class-1: BMI 30 - 34.9
 * - obese-class-2: BMI 35 - 39.9
 * - obese-class-3: BMI >= 40
 */
export type BMICategory =
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obese-class-1'
  | 'obese-class-2'
  | 'obese-class-3'

/**
 * BMI threshold constants based on WHO guidelines
 * Using exclusive upper bounds for cleaner boundary logic
 * Normal: 18.5 <= BMI < 25 (not 24.9 to avoid floating point issues)
 */
export const BMI_THRESHOLDS = {
  underweight: 18.5,   // BMI < 18.5 is underweight
  normalMax: 25,       // BMI < 25 is normal (18.5-24.99...)
  overweightMax: 30,   // BMI < 30 is overweight (25-29.99...)
  obeseClass1Max: 35,  // BMI < 35 is obese class 1 (30-34.99...)
  obeseClass2Max: 40,  // BMI < 40 is obese class 2 (35-39.99...)
  // obese-class-3 is anything >= 40
} as const

/**
 * BMI category color mappings for UI (Tailwind-compatible hex colors)
 */
export const BMI_CATEGORY_COLORS: Record<BMICategory, string> = {
  underweight: '#3b82f6', // blue-500
  normal: '#22c55e', // green-500
  overweight: '#eab308', // yellow-500
  'obese-class-1': '#f97316', // orange-500
  'obese-class-2': '#ef4444', // red-500
  'obese-class-3': '#dc2626', // red-600
}

/**
 * BMI category background colors for UI
 */
export const BMI_CATEGORY_BG_COLORS: Record<BMICategory, string> = {
  underweight: '#dbeafe', // blue-100
  normal: '#dcfce7', // green-100
  overweight: '#fef9c3', // yellow-100
  'obese-class-1': '#ffedd5', // orange-100
  'obese-class-2': '#fee2e2', // red-100
  'obese-class-3': '#fecaca', // red-200
}

/**
 * BMI inputs from user
 */
export interface BMIInputs {
  unitSystem: UnitSystem
  // Metric inputs
  heightCm?: number
  weightKg?: number
  // Imperial inputs
  heightFeet?: number
  heightInches?: number
  weightLbs?: number
}

/**
 * Healthy weight range for a given height
 */
export interface HealthyWeightRange {
  minWeight: number // In the user's selected unit system
  maxWeight: number // In the user's selected unit system
  unit: 'kg' | 'lbs'
}

/**
 * Distance from normal BMI range
 */
export interface DistanceFromNormal {
  direction: 'under' | 'within' | 'over'
  amount: number // Weight difference in user's unit system
  unit: 'kg' | 'lbs'
}

/**
 * BMI calculation result
 */
export interface BMIResult {
  bmi: number
  category: BMICategory
  healthyWeightRange: HealthyWeightRange
  distanceFromNormal: DistanceFromNormal
  heightInMeters: number
  weightInKg: number
}

/**
 * Validation result for BMI inputs
 */
export interface BMIValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
