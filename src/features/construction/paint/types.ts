/**
 * Paint Calculator Types
 * Calculate paint requirements for walls and ceilings
 */

import { z } from 'zod'

/**
 * Unit system for measurements
 */
export type UnitSystem = 'imperial' | 'metric'

/**
 * Zod schema for paint calculator inputs
 */
export const PaintInputsSchema = z.object({
  roomLength: z.number().positive({ message: 'validation.roomLengthRequired' }),
  roomWidth: z.number().positive({ message: 'validation.roomWidthRequired' }),
  wallHeight: z.number().positive({ message: 'validation.wallHeightRequired' }),
  numberOfDoors: z.number().int().min(0).default(0),
  numberOfWindows: z.number().int().min(0).default(0),
  includeCeiling: z.boolean().default(false),
  numberOfCoats: z.number().int().min(1).max(4).default(2),
})

export type PaintInputsValidated = z.infer<typeof PaintInputsSchema>

/**
 * Paint calculator inputs
 */
export interface PaintInputs {
  roomLength: number
  roomWidth: number
  wallHeight: number
  numberOfDoors: number
  numberOfWindows: number
  includeCeiling: boolean
  numberOfCoats: number
}

/**
 * Paint calculation result
 */
export interface PaintResult {
  // Wall area
  totalWallArea: number
  wallAreaAfterDeductions: number
  ceilingArea: number
  totalPaintableArea: number
  // Paint needed
  gallonsNeeded: number
  litersNeeded: number
  quartsNeeded: number
  // Coverage info
  coverageRateUsed: number
  numberOfCoats: number
  // Deductions
  doorDeductions: number
  windowDeductions: number
  totalDeductions: number
  // Cost estimate (based on average paint prices)
  estimatedCostRange: {
    low: number
    high: number
    currency: string
  }
}

/**
 * Validation result
 */
export interface PaintValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}

/**
 * Standard coverage rates (sq ft per gallon)
 * Varies by paint type and surface texture
 */
export const COVERAGE_RATES = {
  standard: 350, // Standard coverage for smooth walls
  textured: 300, // Textured or rough surfaces
  primer: 300, // Primer coverage
} as const

/**
 * Standard deduction sizes (in square feet)
 */
export const DEDUCTION_SIZES = {
  door: 20, // Standard interior door ~20 sq ft (3' x 6'8")
  window: 15, // Standard window ~15 sq ft (3' x 5')
} as const

/**
 * Conversion constants
 */
export const PAINT_CONVERSIONS = {
  sqFtToSqM: 0.092903,
  sqMToSqFt: 10.7639,
  gallonsToLiters: 3.78541,
  litersToGallons: 0.264172,
  gallonsToQuarts: 4,
  feetToMeters: 0.3048,
  metersToFeet: 3.28084,
} as const

/**
 * Average paint prices (USD per gallon)
 */
export const PAINT_PRICES = {
  budget: 25,
  midRange: 45,
  premium: 75,
} as const
