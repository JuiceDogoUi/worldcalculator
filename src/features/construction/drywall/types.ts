/**
 * Drywall Calculator Types
 * Calculate drywall sheets and materials for walls and ceilings
 */

import { z } from 'zod'

/**
 * Unit system for measurements
 */
export type UnitSystem = 'imperial' | 'metric'

/**
 * Drywall sheet sizes (width x height in feet)
 */
export type SheetSize = '4x8' | '4x10' | '4x12'

/**
 * Zod schema for drywall calculator inputs
 */
export const DrywallInputsSchema = z.object({
  roomLength: z.number().positive({ message: 'validation.roomLengthRequired' }),
  roomWidth: z.number().positive({ message: 'validation.roomWidthRequired' }),
  wallHeight: z.number().positive({ message: 'validation.wallHeightRequired' }),
  includeCeiling: z.boolean().default(false),
  sheetSize: z.enum(['4x8', '4x10', '4x12']).default('4x8'),
  numberOfDoors: z.number().int().min(0).default(0),
  numberOfWindows: z.number().int().min(0).default(0),
  wastePercent: z.number().min(0).max(20).default(10),
})

export type DrywallInputsValidated = z.infer<typeof DrywallInputsSchema>

/**
 * Drywall calculator inputs
 */
export interface DrywallInputs {
  roomLength: number
  roomWidth: number
  wallHeight: number
  includeCeiling: boolean
  sheetSize: SheetSize
  numberOfDoors: number
  numberOfWindows: number
  wastePercent: number
}

/**
 * Drywall calculation result
 */
export interface DrywallResult {
  // Area calculations
  wallArea: number
  ceilingArea: number
  totalDeductions: number
  netArea: number
  totalAreaWithWaste: number
  // Sheets needed
  sheetsNeeded: number
  sheetAreaUsed: number
  // Additional materials
  jointCompoundGallons: number
  tapeFeet: number
  screwsNeeded: number
  cornerBeadFeet: number
  // Cost estimates
  estimatedCost: {
    sheets: number
    materials: number
    total: number
    currency: string
  }
}

/**
 * Validation result
 */
export interface DrywallValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}

/**
 * Sheet sizes in square feet
 */
export const SHEET_AREAS = {
  '4x8': 32,
  '4x10': 40,
  '4x12': 48,
} as const

/**
 * Standard deduction sizes (in square feet)
 */
export const DRYWALL_DEDUCTIONS = {
  door: 21, // Standard interior door 3' x 7'
  window: 15, // Standard window 3' x 5'
} as const

/**
 * Material requirements per sheet
 */
export const MATERIAL_RATIOS = {
  jointCompoundPerSqFt: 0.005, // gallons per sq ft
  tapePerSqFt: 0.375, // feet of tape per sq ft
  screwsPerSqFt: 1.5, // screws per sq ft
  cornerBeadPerCorner: 8, // feet per inside/outside corner
} as const

/**
 * Cost estimates (USD)
 */
export const DRYWALL_COSTS = {
  sheetCost: {
    '4x8': 12,
    '4x10': 15,
    '4x12': 18,
  },
  jointCompoundPerGallon: 15,
  tapePerRoll: 8, // 250 ft roll
  screwsPerBox: 12, // box of 1000
} as const

/**
 * Conversion constants
 */
export const DRYWALL_CONVERSIONS = {
  sqFtToSqM: 0.092903,
  sqMToSqFt: 10.7639,
  feetToMeters: 0.3048,
  metersToFeet: 3.28084,
} as const
