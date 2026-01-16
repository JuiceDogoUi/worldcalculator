import { z } from 'zod'

export type UnitSystem = 'imperial' | 'metric'

export type GravelType =
  | 'pea-gravel'
  | 'crushed-stone'
  | 'river-rock'
  | 'decomposed-granite'
  | 'lava-rock'
  | 'base-gravel'

// Gravel density in lbs per cubic foot
export const GRAVEL_DENSITY: Record<GravelType, number> = {
  'pea-gravel': 97, // ~1555 kg/m³
  'crushed-stone': 100, // ~1602 kg/m³
  'river-rock': 95, // ~1522 kg/m³
  'decomposed-granite': 100, // ~1602 kg/m³
  'lava-rock': 50, // ~801 kg/m³ (lightweight)
  'base-gravel': 105, // ~1682 kg/m³
}

// Gravel cost per ton (USD estimates)
export const GRAVEL_COST_PER_TON: Record<GravelType, number> = {
  'pea-gravel': 35,
  'crushed-stone': 30,
  'river-rock': 45,
  'decomposed-granite': 40,
  'lava-rock': 80,
  'base-gravel': 25,
}

// Delivery cost estimate per ton
export const DELIVERY_COST_PER_TON = 15

// Conversion constants
export const CUBIC_FEET_PER_CUBIC_YARD = 27
export const POUNDS_PER_TON = 2000
export const CUBIC_METERS_PER_CUBIC_YARD = 0.764555
export const KG_PER_POUND = 0.453592
export const FEET_PER_METER = 3.28084
export const INCHES_PER_FOOT = 12

export interface GravelInputs {
  unitSystem: UnitSystem
  length: number
  width: number
  depth: number
  gravelType: GravelType
  compactionFactor: number // percentage for compaction (e.g., 10% = 1.10)
}

export interface GravelResult {
  // Area
  area: number // sq ft or m²
  // Volume
  volumeCubicFeet: number
  volumeCubicYards: number
  volumeCubicMeters: number
  // Weight
  weightPounds: number
  weightTons: number
  weightKg: number
  weightMetricTons: number
  // Bags (50 lb bags)
  bags50lb: number
  // Costs
  materialCost: number
  deliveryCost: number
  totalCost: number
}

export const gravelInputSchema = z.object({
  unitSystem: z.enum(['imperial', 'metric']),
  length: z.number().positive('Length must be greater than 0'),
  width: z.number().positive('Width must be greater than 0'),
  depth: z.number().positive('Depth must be greater than 0'),
  gravelType: z.enum([
    'pea-gravel',
    'crushed-stone',
    'river-rock',
    'decomposed-granite',
    'lava-rock',
    'base-gravel',
  ]),
  compactionFactor: z.number().min(0).max(50),
})

export type GravelInputSchema = z.infer<typeof gravelInputSchema>
