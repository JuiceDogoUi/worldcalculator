/**
 * Concrete Calculator Types
 * Calculate concrete volume and bag requirements for construction projects
 */

import { z } from 'zod'

/**
 * Project types supported by the calculator
 */
export type ProjectType = 'slab' | 'footing' | 'column' | 'stairs' | 'custom'

/**
 * Unit system for measurements
 */
export type UnitSystem = 'imperial' | 'metric'

/**
 * Zod schema for slab inputs
 */
export const SlabInputsSchema = z.object({
  projectType: z.literal('slab'),
  length: z.number().positive({ message: 'validation.lengthRequired' }),
  width: z.number().positive({ message: 'validation.widthRequired' }),
  thickness: z.number().positive({ message: 'validation.thicknessRequired' }),
})

/**
 * Zod schema for footing inputs
 */
export const FootingInputsSchema = z.object({
  projectType: z.literal('footing'),
  length: z.number().positive({ message: 'validation.lengthRequired' }),
  width: z.number().positive({ message: 'validation.widthRequired' }),
  depth: z.number().positive({ message: 'validation.depthRequired' }),
})

/**
 * Zod schema for column (cylinder) inputs
 */
export const ColumnInputsSchema = z.object({
  projectType: z.literal('column'),
  diameter: z.number().positive({ message: 'validation.diameterRequired' }),
  height: z.number().positive({ message: 'validation.heightRequired' }),
  quantity: z.number().int().positive({ message: 'validation.quantityRequired' }),
})

/**
 * Zod schema for stairs inputs
 */
export const StairsInputsSchema = z.object({
  projectType: z.literal('stairs'),
  platformWidth: z.number().positive({ message: 'validation.platformWidthRequired' }),
  platformDepth: z.number().positive({ message: 'validation.platformDepthRequired' }),
  riseHeight: z.number().positive({ message: 'validation.riseHeightRequired' }),
  runDepth: z.number().positive({ message: 'validation.runDepthRequired' }),
  stepWidth: z.number().positive({ message: 'validation.stepWidthRequired' }),
  numberOfSteps: z.number().int().positive({ message: 'validation.numberOfStepsRequired' }),
})

/**
 * Zod schema for custom volume input
 */
export const CustomInputsSchema = z.object({
  projectType: z.literal('custom'),
  cubicFeet: z.number().positive({ message: 'validation.volumeRequired' }),
})

/**
 * Combined Zod schema
 */
export const ConcreteInputsSchema = z.discriminatedUnion('projectType', [
  SlabInputsSchema,
  FootingInputsSchema,
  ColumnInputsSchema,
  StairsInputsSchema,
  CustomInputsSchema,
])

export type ConcreteInputsValidated = z.infer<typeof ConcreteInputsSchema>

/**
 * Slab inputs
 */
export interface SlabInputs {
  projectType: 'slab'
  length: number
  width: number
  thickness: number // in inches for imperial, cm for metric
}

/**
 * Footing inputs
 */
export interface FootingInputs {
  projectType: 'footing'
  length: number
  width: number
  depth: number
}

/**
 * Column inputs
 */
export interface ColumnInputs {
  projectType: 'column'
  diameter: number
  height: number
  quantity: number
}

/**
 * Stairs inputs
 */
export interface StairsInputs {
  projectType: 'stairs'
  platformWidth: number
  platformDepth: number
  riseHeight: number
  runDepth: number
  stepWidth: number
  numberOfSteps: number
}

/**
 * Custom volume input
 */
export interface CustomInputs {
  projectType: 'custom'
  cubicFeet: number
}

/**
 * Combined input type
 */
export type ConcreteInputs =
  | SlabInputs
  | FootingInputs
  | ColumnInputs
  | StairsInputs
  | CustomInputs

/**
 * Bag requirements result
 */
export interface BagRequirements {
  size: string
  yield: number // cubic feet per bag
  bagsNeeded: number
  totalWeight: number // in lbs or kg
}

/**
 * Concrete calculation result
 */
export interface ConcreteResult {
  projectType: ProjectType
  // Volume in different units
  cubicFeet: number
  cubicYards: number
  cubicMeters: number
  // With waste factor
  cubicFeetWithWaste: number
  cubicYardsWithWaste: number
  cubicMetersWithWaste: number
  wastePercent: number
  // Bag options
  bags: {
    bag40lb: BagRequirements
    bag60lb: BagRequirements
    bag80lb: BagRequirements
  }
  // Pre-mixed truck delivery
  truckLoads: number // Number of standard 10 cubic yard trucks
}

/**
 * Validation result
 */
export interface ConcreteValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}

/**
 * Concrete bag yields (cubic feet per bag)
 * Based on standard concrete mix ratios
 */
export const BAG_YIELDS = {
  '40lb': 0.30, // 40 lb bag yields ~0.30 cubic feet
  '60lb': 0.45, // 60 lb bag yields ~0.45 cubic feet
  '80lb': 0.60, // 80 lb bag yields ~0.60 cubic feet
} as const

/**
 * Bag weights in pounds
 */
export const BAG_WEIGHTS = {
  '40lb': 40,
  '60lb': 60,
  '80lb': 80,
} as const

/**
 * Conversion constants
 */
export const CONCRETE_CONVERSIONS = {
  cubicFeetToCubicYards: 1 / 27, // 27 cubic feet = 1 cubic yard
  cubicFeetToCubicMeters: 0.0283168,
  cubicMetersToCubicFeet: 35.3147,
  inchesToFeet: 1 / 12,
  cmToMeters: 0.01,
  metersToFeet: 3.28084,
  feetToMeters: 0.3048,
  standardTruckCapacity: 10, // cubic yards
} as const

/**
 * Default waste factor percentage
 */
export const DEFAULT_WASTE_PERCENT = 10
