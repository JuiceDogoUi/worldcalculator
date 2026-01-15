/**
 * Body Fat Calculator Types
 * U.S. Navy Method (Hodgdon & Beckett, 1984)
 */

/**
 * Unit system for measurements
 */
export type UnitSystem = 'metric' | 'imperial'

/**
 * Gender for body fat calculation
 * Women require hip measurement; men do not
 */
export type Gender = 'male' | 'female'

/**
 * Body fat category based on gender
 * Different thresholds for men and women
 */
export type BodyFatCategory =
  | 'essential'
  | 'athletic'
  | 'fitness'
  | 'acceptable'
  | 'obese'

/**
 * Body fat category thresholds by gender
 * Based on American Council on Exercise (ACE) guidelines
 */
export const BODY_FAT_THRESHOLDS = {
  male: {
    essential: { min: 2, max: 5 },
    athletic: { min: 6, max: 13 },
    fitness: { min: 14, max: 17 },
    acceptable: { min: 18, max: 24 },
    obese: { min: 25, max: 100 },
  },
  female: {
    essential: { min: 10, max: 13 },
    athletic: { min: 14, max: 20 },
    fitness: { min: 21, max: 24 },
    acceptable: { min: 25, max: 31 },
    obese: { min: 32, max: 100 },
  },
} as const

/**
 * Body fat category colors for UI (Tailwind-compatible hex colors)
 */
export const BODY_FAT_CATEGORY_COLORS: Record<BodyFatCategory, string> = {
  essential: '#ef4444', // red-500 - too low can be dangerous
  athletic: '#3b82f6', // blue-500
  fitness: '#22c55e', // green-500
  acceptable: '#eab308', // yellow-500
  obese: '#f97316', // orange-500
}

/**
 * Body fat category background colors for UI
 */
export const BODY_FAT_CATEGORY_BG_COLORS: Record<BodyFatCategory, string> = {
  essential: '#fee2e2', // red-100
  athletic: '#dbeafe', // blue-100
  fitness: '#dcfce7', // green-100
  acceptable: '#fef9c3', // yellow-100
  obese: '#ffedd5', // orange-100
}

/**
 * Body fat inputs from user
 */
export interface BodyFatInputs {
  gender: Gender
  unitSystem: UnitSystem
  age: number
  // Metric inputs
  heightCm?: number
  weightKg?: number
  neckCm?: number
  waistCm?: number
  hipCm?: number // Required only for women
  // Imperial inputs
  heightInches?: number
  weightLbs?: number
  neckInches?: number
  waistInches?: number
  hipInches?: number // Required only for women
}

/**
 * Body fat calculation result
 */
export interface BodyFatResult {
  bodyFatPercentage: number
  bodyFatMass: number // in kg or lbs based on unit system
  leanBodyMass: number // in kg or lbs based on unit system
  category: BodyFatCategory
  unit: 'kg' | 'lbs'
  // Additional metrics
  idealBodyFatRange: {
    min: number
    max: number
  }
  fatToLose: number // Amount of fat to reach upper limit of fitness range (0 if already in range)
}

/**
 * Validation error for a specific field
 */
export interface ValidationError {
  field: string
  message: string
}

/**
 * Validation result for body fat inputs
 */
export interface BodyFatValidation {
  valid: boolean
  errors: ValidationError[]
}
