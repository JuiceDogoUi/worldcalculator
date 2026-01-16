/**
 * Square Footage Calculator Types
 * Calculate area for various shapes used in construction projects
 */

import { z } from 'zod'

/**
 * Shape types supported by the calculator
 */
export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'l-shape' | 'trapezoid'

/**
 * Unit system for measurements
 */
export type UnitSystem = 'imperial' | 'metric'

/**
 * Zod schema for rectangle inputs
 */
export const RectangleInputsSchema = z.object({
  shape: z.literal('rectangle'),
  length: z.number().positive({ message: 'validation.lengthRequired' }),
  width: z.number().positive({ message: 'validation.widthRequired' }),
})

/**
 * Zod schema for circle inputs
 */
export const CircleInputsSchema = z.object({
  shape: z.literal('circle'),
  diameter: z.number().positive({ message: 'validation.diameterRequired' }),
})

/**
 * Zod schema for triangle inputs
 */
export const TriangleInputsSchema = z.object({
  shape: z.literal('triangle'),
  base: z.number().positive({ message: 'validation.baseRequired' }),
  height: z.number().positive({ message: 'validation.heightRequired' }),
})

/**
 * Zod schema for L-shape inputs
 */
export const LShapeInputsSchema = z.object({
  shape: z.literal('l-shape'),
  length1: z.number().positive({ message: 'validation.length1Required' }),
  width1: z.number().positive({ message: 'validation.width1Required' }),
  length2: z.number().positive({ message: 'validation.length2Required' }),
  width2: z.number().positive({ message: 'validation.width2Required' }),
})

/**
 * Zod schema for trapezoid inputs
 */
export const TrapezoidInputsSchema = z.object({
  shape: z.literal('trapezoid'),
  base1: z.number().positive({ message: 'validation.base1Required' }),
  base2: z.number().positive({ message: 'validation.base2Required' }),
  height: z.number().positive({ message: 'validation.heightRequired' }),
})

/**
 * Combined Zod schema for all shape inputs
 */
export const SquareFootageInputsSchema = z.discriminatedUnion('shape', [
  RectangleInputsSchema,
  CircleInputsSchema,
  TriangleInputsSchema,
  LShapeInputsSchema,
  TrapezoidInputsSchema,
])

export type SquareFootageInputsValidated = z.infer<typeof SquareFootageInputsSchema>

/**
 * Rectangle inputs
 */
export interface RectangleInputs {
  shape: 'rectangle'
  length: number
  width: number
}

/**
 * Circle inputs
 */
export interface CircleInputs {
  shape: 'circle'
  diameter: number
}

/**
 * Triangle inputs
 */
export interface TriangleInputs {
  shape: 'triangle'
  base: number
  height: number
}

/**
 * L-shape inputs
 */
export interface LShapeInputs {
  shape: 'l-shape'
  length1: number
  width1: number
  length2: number
  width2: number
}

/**
 * Trapezoid inputs
 */
export interface TrapezoidInputs {
  shape: 'trapezoid'
  base1: number
  base2: number
  height: number
}

/**
 * Combined input type
 */
export type SquareFootageInputs =
  | RectangleInputs
  | CircleInputs
  | TriangleInputs
  | LShapeInputs
  | TrapezoidInputs

/**
 * Square footage calculation result
 */
export interface SquareFootageResult {
  shape: ShapeType
  squareFeet: number
  squareMeters: number
  squareYards: number
  acres: number
  // For material estimation
  suggestedMaterials: {
    paint: {
      gallons: number
      liters: number
      coats: number
    }
    flooring: {
      squareFeet: number
      squareMeters: number
      wastePercent: number
    }
  }
}

/**
 * Validation result
 */
export interface SquareFootageValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}

/**
 * Conversion constants
 */
export const CONVERSION_FACTORS = {
  sqFtToSqM: 0.092903,
  sqMToSqFt: 10.7639,
  sqFtToSqYd: 0.111111,
  sqFtToAcres: 0.0000229568,
  ftToM: 0.3048,
  mToFt: 3.28084,
} as const

/**
 * Material estimation constants
 */
export const MATERIAL_CONSTANTS = {
  paintCoverageSqFtPerGallon: 350,
  paintCoats: 2,
  flooringWastePercent: 10,
} as const
