/**
 * Flooring Calculator - Calculation Functions
 * Pure functions for calculating flooring requirements
 */

import type {
  FlooringInputs,
  FlooringResult,
  FlooringValidation,
  FlooringType,
} from './types'
import {
  BOX_COVERAGE,
  FLOORING_COSTS,
  INSTALLATION_COSTS,
  FLOORING_CONVERSIONS,
} from './types'

/**
 * Round to specified decimal places
 */
function roundToDecimals(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Calculate floor area
 * Formula: length × width
 */
export function calculateFloorArea(length: number, width: number): number {
  return length * width
}

/**
 * Calculate waste amount based on percentage
 */
export function calculateWaste(area: number, wastePercent: number): number {
  return area * (wastePercent / 100)
}

/**
 * Calculate boxes needed based on coverage
 */
export function calculateBoxesNeeded(
  totalArea: number,
  coveragePerBox: number
): number {
  return Math.ceil(totalArea / coveragePerBox)
}

/**
 * Get coverage per box for flooring type
 */
export function getCoveragePerBox(
  flooringType: FlooringType,
  customCoverage?: number
): number {
  return customCoverage ?? BOX_COVERAGE[flooringType]
}

/**
 * Calculate material cost
 */
export function calculateMaterialCost(
  area: number,
  flooringType: FlooringType
): { low: number; high: number } {
  const costs = FLOORING_COSTS[flooringType]
  return {
    low: roundToDecimals(area * costs.low, 0),
    high: roundToDecimals(area * costs.high, 0),
  }
}

/**
 * Calculate installation cost
 */
export function calculateInstallationCost(
  area: number,
  flooringType: FlooringType
): { low: number; high: number } {
  const costs = INSTALLATION_COSTS[flooringType]
  return {
    low: roundToDecimals(area * costs.low, 0),
    high: roundToDecimals(area * costs.high, 0),
  }
}

/**
 * Validate flooring calculator inputs
 */
export function validateFlooringInputs(
  inputs: Partial<FlooringInputs>
): FlooringValidation {
  const errors: FlooringValidation['errors'] = []

  if (!inputs.roomLength || inputs.roomLength <= 0) {
    errors.push({ field: 'roomLength', message: 'validation.roomLengthRequired' })
  }
  if (!inputs.roomWidth || inputs.roomWidth <= 0) {
    errors.push({ field: 'roomWidth', message: 'validation.roomWidthRequired' })
  }
  if (!inputs.flooringType) {
    errors.push({ field: 'flooringType', message: 'validation.flooringTypeRequired' })
  }
  if (inputs.wastePercent !== undefined && (inputs.wastePercent < 0 || inputs.wastePercent > 25)) {
    errors.push({ field: 'wastePercent', message: 'validation.wastePercentInvalid' })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Main flooring calculation function
 */
export function calculateFlooring(inputs: FlooringInputs): FlooringResult {
  const {
    roomLength,
    roomWidth,
    flooringType,
    wastePercent,
    boxCoverage,
  } = inputs

  // Calculate base area
  const floorArea = calculateFloorArea(roomLength, roomWidth)

  // Calculate waste
  const wasteArea = calculateWaste(floorArea, wastePercent)

  // Total area needed (including waste)
  const totalArea = floorArea + wasteArea

  // Get coverage per box
  const coveragePerBox = getCoveragePerBox(flooringType, boxCoverage)

  // Calculate boxes needed
  const boxesNeeded = calculateBoxesNeeded(totalArea, coveragePerBox)

  // Calculate costs
  const materialCost = calculateMaterialCost(totalArea, flooringType)
  const installationCost = calculateInstallationCost(floorArea, flooringType)

  // Convert to metric
  const floorAreaMetric = floorArea * FLOORING_CONVERSIONS.sqFtToSqM
  const totalAreaMetric = totalArea * FLOORING_CONVERSIONS.sqFtToSqM

  return {
    floorArea: roundToDecimals(floorArea, 2),
    wasteArea: roundToDecimals(wasteArea, 2),
    totalArea: roundToDecimals(totalArea, 2),
    boxesNeeded,
    coveragePerBox,
    floorAreaMetric: roundToDecimals(floorAreaMetric, 2),
    totalAreaMetric: roundToDecimals(totalAreaMetric, 2),
    estimatedCost: {
      ...materialCost,
      currency: 'USD',
    },
    installationCost: {
      ...installationCost,
      currency: 'USD',
    },
  }
}

/**
 * Format area for display
 */
export function formatArea(
  value: number,
  unit: 'sqft' | 'sqm',
  locale: string = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return formatter.format(value)
}

/**
 * Format currency for display
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return formatter.format(value)
}
