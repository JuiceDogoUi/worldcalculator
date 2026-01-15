import type {
  HeartRateInputs,
  HeartRateResult,
  HeartRateValidation,
  HeartRateZone,
  HeartRateZoneId,
  TrainingGoal,
} from './types'
import {
  ZONE_INTENSITY_RANGES,
  ZONE_COLORS,
  GOAL_TO_ZONE,
} from './types'

/**
 * Round to specified decimal places
 */
function roundToDecimals(value: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Validate Heart Rate Calculator inputs
 */
export function validateHeartRateInputs(inputs: Partial<HeartRateInputs>): HeartRateValidation {
  const errors: HeartRateValidation['errors'] = []

  // Validate age
  if (inputs.age === undefined || inputs.age === null) {
    errors.push({
      field: 'age',
      message: 'validation.ageRequired',
    })
  } else if (isNaN(inputs.age)) {
    errors.push({
      field: 'age',
      message: 'validation.ageInvalid',
    })
  } else if (inputs.age <= 0) {
    errors.push({
      field: 'age',
      message: 'validation.agePositive',
    })
  } else if (inputs.age < 10) {
    errors.push({
      field: 'age',
      message: 'validation.ageTooLow',
    })
  } else if (inputs.age > 120) {
    errors.push({
      field: 'age',
      message: 'validation.ageTooHigh',
    })
  }

  // Validate resting heart rate
  if (inputs.restingHeartRate === undefined || inputs.restingHeartRate === null) {
    errors.push({
      field: 'restingHeartRate',
      message: 'validation.restingHRRequired',
    })
  } else if (isNaN(inputs.restingHeartRate)) {
    errors.push({
      field: 'restingHeartRate',
      message: 'validation.restingHRInvalid',
    })
  } else if (inputs.restingHeartRate <= 0) {
    errors.push({
      field: 'restingHeartRate',
      message: 'validation.restingHRPositive',
    })
  } else if (inputs.restingHeartRate < 30) {
    errors.push({
      field: 'restingHeartRate',
      message: 'validation.restingHRTooLow',
    })
  } else if (inputs.restingHeartRate > 120) {
    errors.push({
      field: 'restingHeartRate',
      message: 'validation.restingHRTooHigh',
    })
  }

  // Validate resting HR is less than max HR (220 - age)
  if (inputs.age && inputs.restingHeartRate) {
    const maxHR = 220 - inputs.age
    if (inputs.restingHeartRate >= maxHR) {
      errors.push({
        field: 'restingHeartRate',
        message: 'validation.restingHRExceedsMax',
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Calculate Maximum Heart Rate using the standard formula
 * Max HR = 220 - Age
 */
export function calculateMaxHeartRate(age: number): number {
  return 220 - age
}

/**
 * Calculate Heart Rate Reserve (Karvonen Method)
 * HRR = Max HR - Resting HR
 */
export function calculateHeartRateReserve(maxHR: number, restingHR: number): number {
  return maxHR - restingHR
}

/**
 * Calculate Target Heart Rate at a given intensity using Karvonen Formula
 * Target HR = (HRR x Intensity%) + Resting HR
 */
export function calculateTargetHeartRate(
  heartRateReserve: number,
  restingHR: number,
  intensityPercent: number
): number {
  return roundToDecimals((heartRateReserve * (intensityPercent / 100)) + restingHR)
}

/**
 * Get zone name key for translations
 */
function getZoneName(zoneId: HeartRateZoneId): string {
  const zoneNames: Record<HeartRateZoneId, string> = {
    zone1: 'zones.zone1.name',
    zone2: 'zones.zone2.name',
    zone3: 'zones.zone3.name',
    zone4: 'zones.zone4.name',
    zone5: 'zones.zone5.name',
  }
  return zoneNames[zoneId]
}

/**
 * Get zone description key for translations
 */
function getZoneDescription(zoneId: HeartRateZoneId): string {
  const descriptions: Record<HeartRateZoneId, string> = {
    zone1: 'zones.zone1.description',
    zone2: 'zones.zone2.description',
    zone3: 'zones.zone3.description',
    zone4: 'zones.zone4.description',
    zone5: 'zones.zone5.description',
  }
  return descriptions[zoneId]
}

/**
 * Get zone benefits key for translations
 */
function getZoneBenefits(zoneId: HeartRateZoneId): string {
  const benefits: Record<HeartRateZoneId, string> = {
    zone1: 'zones.zone1.benefits',
    zone2: 'zones.zone2.benefits',
    zone3: 'zones.zone3.benefits',
    zone4: 'zones.zone4.benefits',
    zone5: 'zones.zone5.benefits',
  }
  return benefits[zoneId]
}

/**
 * Calculate all heart rate zones
 */
export function calculateHeartRateZones(
  heartRateReserve: number,
  restingHR: number
): HeartRateZone[] {
  const zoneIds: HeartRateZoneId[] = ['zone1', 'zone2', 'zone3', 'zone4', 'zone5']

  return zoneIds.map((zoneId) => {
    const { min, max } = ZONE_INTENSITY_RANGES[zoneId]
    const colors = ZONE_COLORS[zoneId]

    return {
      id: zoneId,
      name: getZoneName(zoneId),
      minIntensity: min,
      maxIntensity: max,
      minHR: calculateTargetHeartRate(heartRateReserve, restingHR, min),
      maxHR: calculateTargetHeartRate(heartRateReserve, restingHR, max),
      description: getZoneDescription(zoneId),
      benefits: getZoneBenefits(zoneId),
      color: colors.primary,
      bgColor: colors.bg,
    }
  })
}

/**
 * Get recommended zone based on training goal
 */
export function getRecommendedZone(goal?: TrainingGoal): HeartRateZoneId | undefined {
  if (!goal) return undefined
  return GOAL_TO_ZONE[goal]
}

/**
 * Main calculation function for Target Heart Rate
 */
export function calculateHeartRate(inputs: HeartRateInputs): HeartRateResult {
  const { age, restingHeartRate, trainingGoal } = inputs

  // Calculate maximum heart rate
  const maxHeartRate = calculateMaxHeartRate(age)

  // Calculate heart rate reserve (Karvonen method)
  const heartRateReserve = calculateHeartRateReserve(maxHeartRate, restingHeartRate)

  // Calculate all zones
  const zones = calculateHeartRateZones(heartRateReserve, restingHeartRate)

  // Get recommended zone based on goal
  const recommendedZone = getRecommendedZone(trainingGoal)

  return {
    maxHeartRate,
    heartRateReserve,
    zones,
    recommendedZone,
  }
}

/**
 * Format heart rate for display
 */
export function formatHeartRate(bpm: number): string {
  return `${Math.round(bpm)} bpm`
}

/**
 * Format heart rate range for display
 */
export function formatHeartRateRange(minHR: number, maxHR: number): string {
  return `${Math.round(minHR)} - ${Math.round(maxHR)} bpm`
}

/**
 * Format intensity percentage range
 */
export function formatIntensityRange(min: number, max: number): string {
  return `${min}% - ${max}%`
}

/**
 * Get zone by ID from zones array
 */
export function getZoneById(zones: HeartRateZone[], zoneId: HeartRateZoneId): HeartRateZone | undefined {
  return zones.find((zone) => zone.id === zoneId)
}

/**
 * Calculate visual position for heart rate on a scale
 * Maps HR from minHR to maxHR to 0-100%
 */
export function getHeartRateScalePosition(
  heartRate: number,
  minScale: number,
  maxScale: number
): number {
  const clampedHR = Math.max(minScale, Math.min(maxScale, heartRate))
  return ((clampedHR - minScale) / (maxScale - minScale)) * 100
}

/**
 * Get estimated calories burned per minute based on zone
 * These are rough estimates for an average adult
 */
export function getEstimatedCaloriesPerMinute(zoneId: HeartRateZoneId): { min: number; max: number } {
  const calorieRanges: Record<HeartRateZoneId, { min: number; max: number }> = {
    zone1: { min: 4, max: 6 },
    zone2: { min: 6, max: 9 },
    zone3: { min: 9, max: 12 },
    zone4: { min: 12, max: 15 },
    zone5: { min: 15, max: 20 },
  }
  return calorieRanges[zoneId]
}
