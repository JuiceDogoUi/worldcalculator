/**
 * Target Heart Rate Calculator Types
 * Based on the Karvonen Method (ACSM endorsed)
 */

/**
 * Training goal options for recommended zone selection
 */
export type TrainingGoal =
  | 'general-fitness'
  | 'fat-burn'
  | 'cardio'
  | 'performance'

/**
 * Heart rate zone identifiers
 */
export type HeartRateZoneId =
  | 'zone1'
  | 'zone2'
  | 'zone3'
  | 'zone4'
  | 'zone5'

/**
 * Heart Rate Zone definition
 */
export interface HeartRateZone {
  id: HeartRateZoneId
  name: string
  minIntensity: number // Percentage (0-100)
  maxIntensity: number // Percentage (0-100)
  minHR: number // BPM
  maxHR: number // BPM
  description: string
  benefits: string
  color: string
  bgColor: string
}

/**
 * Zone intensity ranges as constants
 * Based on ACSM guidelines
 */
export const ZONE_INTENSITY_RANGES: Record<HeartRateZoneId, { min: number; max: number }> = {
  zone1: { min: 50, max: 60 },  // Warm-up / Recovery
  zone2: { min: 60, max: 70 },  // Fat Burn
  zone3: { min: 70, max: 80 },  // Cardio / Aerobic
  zone4: { min: 80, max: 90 },  // Threshold / Anaerobic
  zone5: { min: 90, max: 100 }, // Peak / Maximum
} as const

/**
 * Zone colors for UI visualization (Tailwind-compatible hex colors)
 */
export const ZONE_COLORS: Record<HeartRateZoneId, { primary: string; bg: string }> = {
  zone1: { primary: '#6b7280', bg: '#f3f4f6' }, // gray-500, gray-100
  zone2: { primary: '#22c55e', bg: '#dcfce7' }, // green-500, green-100
  zone3: { primary: '#f59e0b', bg: '#fef3c7' }, // amber-500, amber-100
  zone4: { primary: '#f97316', bg: '#ffedd5' }, // orange-500, orange-100
  zone5: { primary: '#ef4444', bg: '#fee2e2' }, // red-500, red-100
} as const

/**
 * Mapping from training goals to recommended zones
 */
export const GOAL_TO_ZONE: Record<TrainingGoal, HeartRateZoneId> = {
  'general-fitness': 'zone3',
  'fat-burn': 'zone2',
  'cardio': 'zone3',
  'performance': 'zone4',
} as const

/**
 * Heart Rate Calculator Inputs
 */
export interface HeartRateInputs {
  age: number
  restingHeartRate: number
  trainingGoal?: TrainingGoal
}

/**
 * Heart Rate Calculation Result
 */
export interface HeartRateResult {
  maxHeartRate: number        // 220 - Age
  heartRateReserve: number    // Max HR - Resting HR
  zones: HeartRateZone[]      // All 5 training zones with calculated HR
  recommendedZone?: HeartRateZoneId // Based on training goal
}

/**
 * Validation result for Heart Rate inputs
 */
export interface HeartRateValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
