import {
  GravelInputs,
  GravelResult,
  GravelType,
  GRAVEL_DENSITY,
  GRAVEL_COST_PER_TON,
  DELIVERY_COST_PER_TON,
  CUBIC_FEET_PER_CUBIC_YARD,
  POUNDS_PER_TON,
  CUBIC_METERS_PER_CUBIC_YARD,
  KG_PER_POUND,
  FEET_PER_METER,
  INCHES_PER_FOOT,
} from './types'

/**
 * Convert metric dimensions to imperial (feet)
 */
export function metersToFeet(meters: number): number {
  return meters * FEET_PER_METER
}

/**
 * Convert metric area to imperial (sq ft)
 */
export function sqMetersToSqFeet(sqMeters: number): number {
  return sqMeters * FEET_PER_METER * FEET_PER_METER
}

/**
 * Calculate area
 */
export function calculateArea(
  length: number,
  width: number,
  unitSystem: 'imperial' | 'metric'
): number {
  if (unitSystem === 'metric') {
    // Convert to sq ft for internal calculations, return m²
    return length * width
  }
  return length * width
}

/**
 * Calculate volume in cubic feet
 * Depth is in inches for imperial, cm for metric
 */
export function calculateVolumeCubicFeet(
  length: number,
  width: number,
  depth: number,
  unitSystem: 'imperial' | 'metric',
  compactionFactor: number
): number {
  let volumeCuFt: number

  if (unitSystem === 'metric') {
    // Length and width in meters, depth in cm
    const lengthFt = metersToFeet(length)
    const widthFt = metersToFeet(width)
    const depthFt = (depth / 100) * FEET_PER_METER // cm to feet
    volumeCuFt = lengthFt * widthFt * depthFt
  } else {
    // Length and width in feet, depth in inches
    const depthFt = depth / INCHES_PER_FOOT
    volumeCuFt = length * width * depthFt
  }

  // Apply compaction factor
  const compactionMultiplier = 1 + compactionFactor / 100
  return volumeCuFt * compactionMultiplier
}

/**
 * Convert cubic feet to cubic yards
 */
export function cubicFeetToCubicYards(cubicFeet: number): number {
  return cubicFeet / CUBIC_FEET_PER_CUBIC_YARD
}

/**
 * Convert cubic feet to cubic meters
 */
export function cubicFeetToCubicMeters(cubicFeet: number): number {
  return (cubicFeet / CUBIC_FEET_PER_CUBIC_YARD) * CUBIC_METERS_PER_CUBIC_YARD
}

/**
 * Calculate weight from volume
 */
export function calculateWeight(
  volumeCubicFeet: number,
  gravelType: GravelType
): { pounds: number; tons: number; kg: number; metricTons: number } {
  const density = GRAVEL_DENSITY[gravelType]
  const pounds = volumeCubicFeet * density
  const tons = pounds / POUNDS_PER_TON
  const kg = pounds * KG_PER_POUND
  const metricTons = kg / 1000

  return { pounds, tons, kg, metricTons }
}

/**
 * Calculate number of 50 lb bags needed
 */
export function calculateBags(weightPounds: number, bagSize: number = 50): number {
  return Math.ceil(weightPounds / bagSize)
}

/**
 * Calculate material cost
 */
export function calculateMaterialCost(
  tons: number,
  gravelType: GravelType
): number {
  const costPerTon = GRAVEL_COST_PER_TON[gravelType]
  return tons * costPerTon
}

/**
 * Calculate delivery cost
 */
export function calculateDeliveryCost(tons: number): number {
  // Minimum delivery often applies
  const minimumDelivery = 50
  const deliveryCost = tons * DELIVERY_COST_PER_TON
  return Math.max(deliveryCost, minimumDelivery)
}

/**
 * Main calculation function
 */
export function calculateGravel(inputs: GravelInputs): GravelResult {
  const { unitSystem, length, width, depth, gravelType, compactionFactor } =
    inputs

  // Calculate area
  const area = calculateArea(length, width, unitSystem)

  // Calculate volume
  const volumeCubicFeet = calculateVolumeCubicFeet(
    length,
    width,
    depth,
    unitSystem,
    compactionFactor
  )
  const volumeCubicYards = cubicFeetToCubicYards(volumeCubicFeet)
  const volumeCubicMeters = cubicFeetToCubicMeters(volumeCubicFeet)

  // Calculate weight
  const weight = calculateWeight(volumeCubicFeet, gravelType)

  // Calculate bags
  const bags50lb = calculateBags(weight.pounds, 50)

  // Calculate costs
  const materialCost = calculateMaterialCost(weight.tons, gravelType)
  const deliveryCost = calculateDeliveryCost(weight.tons)
  const totalCost = materialCost + deliveryCost

  return {
    area: Math.round(area * 100) / 100,
    volumeCubicFeet: Math.round(volumeCubicFeet * 100) / 100,
    volumeCubicYards: Math.round(volumeCubicYards * 100) / 100,
    volumeCubicMeters: Math.round(volumeCubicMeters * 100) / 100,
    weightPounds: Math.round(weight.pounds),
    weightTons: Math.round(weight.tons * 100) / 100,
    weightKg: Math.round(weight.kg),
    weightMetricTons: Math.round(weight.metricTons * 100) / 100,
    bags50lb,
    materialCost: Math.round(materialCost * 100) / 100,
    deliveryCost: Math.round(deliveryCost * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
  }
}
