/**
 * Concrete Calculator - Calculation Functions
 * Pure functions for calculating concrete volume and requirements
 */

import type {
  ConcreteInputs,
  ConcreteResult,
  ConcreteValidation,
  ProjectType,
  BagRequirements,
} from './types'
import {
  BAG_YIELDS,
  BAG_WEIGHTS,
  CONCRETE_CONVERSIONS,
  DEFAULT_WASTE_PERCENT,
} from './types'

/**
 * Round to specified decimal places
 */
function roundToDecimals(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Calculate slab volume in cubic feet
 * Formula: Length × Width × (Thickness in feet)
 */
export function calculateSlabVolume(
  length: number,
  width: number,
  thicknessInches: number
): number {
  const thicknessFeet = thicknessInches * CONCRETE_CONVERSIONS.inchesToFeet
  return length * width * thicknessFeet
}

/**
 * Calculate footing volume in cubic feet
 * Formula: Length × Width × Depth
 */
export function calculateFootingVolume(
  length: number,
  width: number,
  depth: number
): number {
  return length * width * depth
}

/**
 * Calculate column (cylinder) volume in cubic feet
 * Formula: π × (diameter/2)² × height × quantity
 */
export function calculateColumnVolume(
  diameter: number,
  height: number,
  quantity: number
): number {
  const radius = diameter / 2
  const singleVolume = Math.PI * radius * radius * height
  return singleVolume * quantity
}

/**
 * Calculate stairs volume in cubic feet
 * This is an approximation based on steps as triangular prisms
 */
export function calculateStairsVolume(
  platformWidth: number,
  platformDepth: number,
  riseHeight: number,
  runDepth: number,
  stepWidth: number,
  numberOfSteps: number
): number {
  // Platform volume
  const platformThickness = 4 * CONCRETE_CONVERSIONS.inchesToFeet // 4 inches thick platform
  const platformVolume = platformWidth * platformDepth * platformThickness

  // Steps volume calculation using average step height approximation
  // Each step adds cumulative rise, so average height = (rise × (n+1)) / 2
  const riseInFeet = riseHeight * CONCRETE_CONVERSIONS.inchesToFeet
  const runInFeet = runDepth * CONCRETE_CONVERSIONS.inchesToFeet
  const avgStepHeight = (riseInFeet * (numberOfSteps + 1)) / 2
  const stepsVolume = stepWidth * runInFeet * avgStepHeight * numberOfSteps

  return platformVolume + stepsVolume
}

/**
 * Calculate bag requirements for a given volume
 */
function calculateBagRequirements(
  cubicFeet: number,
  bagSize: keyof typeof BAG_YIELDS
): BagRequirements {
  const yieldPerBag = BAG_YIELDS[bagSize]
  const bagsNeeded = Math.ceil(cubicFeet / yieldPerBag)
  const totalWeight = bagsNeeded * BAG_WEIGHTS[bagSize]

  return {
    size: bagSize,
    yield: yieldPerBag,
    bagsNeeded,
    totalWeight,
  }
}

/**
 * Validate concrete inputs
 */
export function validateConcreteInputs(
  inputs: Partial<ConcreteInputs> & { projectType?: ProjectType }
): ConcreteValidation {
  const errors: ConcreteValidation['errors'] = []

  if (!inputs.projectType) {
    errors.push({ field: 'projectType', message: 'validation.projectTypeRequired' })
    return { valid: false, errors }
  }

  switch (inputs.projectType) {
    case 'slab':
      if (!inputs.length || inputs.length <= 0) {
        errors.push({ field: 'length', message: 'validation.lengthRequired' })
      }
      if (!inputs.width || inputs.width <= 0) {
        errors.push({ field: 'width', message: 'validation.widthRequired' })
      }
      if (!inputs.thickness || inputs.thickness <= 0) {
        errors.push({ field: 'thickness', message: 'validation.thicknessRequired' })
      }
      break

    case 'footing':
      if (!inputs.length || inputs.length <= 0) {
        errors.push({ field: 'length', message: 'validation.lengthRequired' })
      }
      if (!inputs.width || inputs.width <= 0) {
        errors.push({ field: 'width', message: 'validation.widthRequired' })
      }
      if (!inputs.depth || inputs.depth <= 0) {
        errors.push({ field: 'depth', message: 'validation.depthRequired' })
      }
      break

    case 'column':
      if (!inputs.diameter || inputs.diameter <= 0) {
        errors.push({ field: 'diameter', message: 'validation.diameterRequired' })
      }
      if (!inputs.height || inputs.height <= 0) {
        errors.push({ field: 'height', message: 'validation.heightRequired' })
      }
      if (!inputs.quantity || inputs.quantity <= 0) {
        errors.push({ field: 'quantity', message: 'validation.quantityRequired' })
      }
      break

    case 'stairs':
      if (!inputs.platformWidth || inputs.platformWidth <= 0) {
        errors.push({ field: 'platformWidth', message: 'validation.platformWidthRequired' })
      }
      if (!inputs.platformDepth || inputs.platformDepth <= 0) {
        errors.push({ field: 'platformDepth', message: 'validation.platformDepthRequired' })
      }
      if (!inputs.riseHeight || inputs.riseHeight <= 0) {
        errors.push({ field: 'riseHeight', message: 'validation.riseHeightRequired' })
      }
      if (!inputs.runDepth || inputs.runDepth <= 0) {
        errors.push({ field: 'runDepth', message: 'validation.runDepthRequired' })
      }
      if (!inputs.stepWidth || inputs.stepWidth <= 0) {
        errors.push({ field: 'stepWidth', message: 'validation.stepWidthRequired' })
      }
      if (!inputs.numberOfSteps || inputs.numberOfSteps <= 0) {
        errors.push({ field: 'numberOfSteps', message: 'validation.numberOfStepsRequired' })
      }
      break

    case 'custom':
      if (!inputs.cubicFeet || inputs.cubicFeet <= 0) {
        errors.push({ field: 'cubicFeet', message: 'validation.volumeRequired' })
      }
      break
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Main concrete calculation function
 */
export function calculateConcrete(
  inputs: ConcreteInputs,
  wastePercent: number = DEFAULT_WASTE_PERCENT
): ConcreteResult {
  let cubicFeet: number

  switch (inputs.projectType) {
    case 'slab':
      cubicFeet = calculateSlabVolume(inputs.length, inputs.width, inputs.thickness)
      break
    case 'footing':
      cubicFeet = calculateFootingVolume(inputs.length, inputs.width, inputs.depth)
      break
    case 'column':
      cubicFeet = calculateColumnVolume(inputs.diameter, inputs.height, inputs.quantity)
      break
    case 'stairs':
      cubicFeet = calculateStairsVolume(
        inputs.platformWidth,
        inputs.platformDepth,
        inputs.riseHeight,
        inputs.runDepth,
        inputs.stepWidth,
        inputs.numberOfSteps
      )
      break
    case 'custom':
      cubicFeet = inputs.cubicFeet
      break
  }

  // Calculate with waste factor
  const wasteFactor = 1 + wastePercent / 100
  const cubicFeetWithWaste = cubicFeet * wasteFactor

  // Convert to other units
  const cubicYards = cubicFeet * CONCRETE_CONVERSIONS.cubicFeetToCubicYards
  const cubicMeters = cubicFeet * CONCRETE_CONVERSIONS.cubicFeetToCubicMeters
  const cubicYardsWithWaste = cubicFeetWithWaste * CONCRETE_CONVERSIONS.cubicFeetToCubicYards
  const cubicMetersWithWaste = cubicFeetWithWaste * CONCRETE_CONVERSIONS.cubicFeetToCubicMeters

  // Calculate bag requirements (using volume with waste)
  const bag40lb = calculateBagRequirements(cubicFeetWithWaste, '40lb')
  const bag60lb = calculateBagRequirements(cubicFeetWithWaste, '60lb')
  const bag80lb = calculateBagRequirements(cubicFeetWithWaste, '80lb')

  // Calculate truck loads
  const truckLoads = Math.ceil(cubicYardsWithWaste / CONCRETE_CONVERSIONS.standardTruckCapacity)

  return {
    projectType: inputs.projectType,
    cubicFeet: roundToDecimals(cubicFeet, 2),
    cubicYards: roundToDecimals(cubicYards, 2),
    cubicMeters: roundToDecimals(cubicMeters, 2),
    cubicFeetWithWaste: roundToDecimals(cubicFeetWithWaste, 2),
    cubicYardsWithWaste: roundToDecimals(cubicYardsWithWaste, 2),
    cubicMetersWithWaste: roundToDecimals(cubicMetersWithWaste, 2),
    wastePercent,
    bags: {
      bag40lb,
      bag60lb,
      bag80lb,
    },
    truckLoads,
  }
}

/**
 * Format volume for display
 */
export function formatVolume(
  value: number,
  unit: 'cubicFeet' | 'cubicYards' | 'cubicMeters',
  locale: string = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return formatter.format(value)
}

/**
 * Format bag count for display
 */
export function formatBagCount(bags: number, locale: string = 'en-US'): string {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return formatter.format(bags)
}
