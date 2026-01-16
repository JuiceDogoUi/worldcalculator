/**
 * Flooring Calculator Types
 * Calculate flooring materials for various floor types
 */

import { z } from 'zod'

/**
 * Unit system for measurements
 */
export type UnitSystem = 'imperial' | 'metric'

/**
 * Flooring types
 */
export type FlooringType = 'hardwood' | 'laminate' | 'vinyl' | 'tile' | 'carpet'

/**
 * Zod schema for flooring calculator inputs
 */
export const FlooringInputsSchema = z.object({
  roomLength: z.number().positive({ message: 'validation.roomLengthRequired' }),
  roomWidth: z.number().positive({ message: 'validation.roomWidthRequired' }),
  flooringType: z.enum(['hardwood', 'laminate', 'vinyl', 'tile', 'carpet']),
  wastePercent: z.number().min(0).max(25).default(10),
  boxCoverage: z.number().positive().optional(),
})

export type FlooringInputsValidated = z.infer<typeof FlooringInputsSchema>

/**
 * Flooring calculator inputs
 */
export interface FlooringInputs {
  roomLength: number
  roomWidth: number
  flooringType: FlooringType
  wastePercent: number
  boxCoverage?: number // sq ft per box (optional override)
}

/**
 * Flooring calculation result
 */
export interface FlooringResult {
  // Area calculations
  floorArea: number
  wasteArea: number
  totalArea: number
  // Materials needed
  boxesNeeded: number
  coveragePerBox: number
  // Metric conversions
  floorAreaMetric: number
  totalAreaMetric: number
  // Cost estimates
  estimatedCost: {
    low: number
    high: number
    currency: string
  }
  // Installation info
  installationCost: {
    low: number
    high: number
    currency: string
  }
}

/**
 * Validation result
 */
export interface FlooringValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}

/**
 * Standard box coverage (sq ft per box) by flooring type
 */
export const BOX_COVERAGE = {
  hardwood: 20, // ~20 sq ft per box
  laminate: 22, // ~22 sq ft per box
  vinyl: 24, // ~24 sq ft per box (LVP planks)
  tile: 10, // ~10 sq ft per box (varies widely)
  carpet: 12, // ~12 sq ft per roll section
} as const

/**
 * Material cost per square foot (USD)
 */
export const FLOORING_COSTS = {
  hardwood: { low: 5, high: 15 },
  laminate: { low: 1, high: 5 },
  vinyl: { low: 2, high: 7 },
  tile: { low: 1, high: 20 },
  carpet: { low: 2, high: 10 },
} as const

/**
 * Installation cost per square foot (USD)
 */
export const INSTALLATION_COSTS = {
  hardwood: { low: 4, high: 12 },
  laminate: { low: 2, high: 6 },
  vinyl: { low: 2, high: 5 },
  tile: { low: 4, high: 15 },
  carpet: { low: 1, high: 4 },
} as const

/**
 * Conversion constants
 */
export const FLOORING_CONVERSIONS = {
  sqFtToSqM: 0.092903,
  sqMToSqFt: 10.7639,
  feetToMeters: 0.3048,
  metersToFeet: 3.28084,
} as const
