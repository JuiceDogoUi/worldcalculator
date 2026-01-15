/**
 * Ideal Weight Calculator Types
 * Multiple medical formulas for calculating ideal body weight
 */

/**
 * Unit system for height and weight input
 */
export type UnitSystem = 'metric' | 'imperial'

/**
 * Gender for ideal weight formulas
 */
export type Gender = 'male' | 'female'

/**
 * Body frame size for weight adjustment
 */
export type BodyFrame = 'small' | 'medium' | 'large'

/**
 * Ideal weight formula names
 */
export type FormulaName = 'devine' | 'robinson' | 'miller' | 'hamwi'

/**
 * Formula constants for ideal weight calculations
 * All formulas use: baseWeight + multiplier * (heightInInches - 60)
 * Different for men and women
 */
export const FORMULA_CONSTANTS = {
  devine: {
    // Devine Formula (1974) - Most widely used in clinical settings
    male: { base: 50, multiplier: 2.3 },
    female: { base: 45.5, multiplier: 2.3 },
  },
  robinson: {
    // Robinson Formula (1983) - Considered more accurate for shorter individuals
    male: { base: 52, multiplier: 1.9 },
    female: { base: 49, multiplier: 1.7 },
  },
  miller: {
    // Miller Formula (1983) - Results in higher ideal weights
    male: { base: 56.2, multiplier: 1.41 },
    female: { base: 53.1, multiplier: 1.36 },
  },
  hamwi: {
    // Hamwi Formula (1964) - Original formula, still widely used
    male: { base: 48, multiplier: 2.7 },
    female: { base: 45.5, multiplier: 2.2 },
  },
} as const

/**
 * BMI-based healthy weight range thresholds
 */
export const BMI_HEALTHY_RANGE = {
  min: 18.5,
  max: 24.9,
} as const

/**
 * Frame size adjustment percentages
 */
export const FRAME_ADJUSTMENTS = {
  small: -0.1, // -10%
  medium: 0, // No adjustment
  large: 0.1, // +10%
} as const

/**
 * Colors for formula visualization
 */
export const FORMULA_COLORS: Record<FormulaName, string> = {
  devine: '#3b82f6', // blue-500
  robinson: '#22c55e', // green-500
  miller: '#f97316', // orange-500
  hamwi: '#8b5cf6', // violet-500
}

/**
 * Ideal weight calculator inputs
 */
export interface IdealWeightInputs {
  gender: Gender
  unitSystem: UnitSystem
  // Metric inputs
  heightCm?: number
  currentWeightKg?: number
  // Imperial inputs
  heightFeet?: number
  heightInches?: number
  currentWeightLbs?: number
  // Optional body frame
  bodyFrame: BodyFrame
}

/**
 * Result from a single formula calculation
 */
export interface FormulaResult {
  name: FormulaName
  idealWeight: number // In kg
  adjustedWeight: number // After frame adjustment, in kg
}

/**
 * BMI-based weight range
 */
export interface BMIWeightRange {
  minWeight: number // In kg
  maxWeight: number // In kg
}

/**
 * Weight difference from ideal
 */
export interface WeightDifference {
  direction: 'gain' | 'lose' | 'ideal'
  amount: number // Absolute difference
}

/**
 * Complete ideal weight calculation result
 */
export interface IdealWeightResult {
  // Formula results (in kg)
  formulas: FormulaResult[]
  // Average ideal weight across all formulas (in kg)
  averageIdealWeight: number
  // BMI-based healthy weight range (in kg)
  bmiRange: BMIWeightRange
  // Current weight comparison (if provided)
  weightDifference?: WeightDifference
  // Height in standard units for reference
  heightInCm: number
  heightInInches: number
  // Current weight in kg (if provided)
  currentWeightKg?: number
}

/**
 * Validation result for ideal weight inputs
 */
export interface IdealWeightValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
