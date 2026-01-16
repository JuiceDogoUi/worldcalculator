/**
 * Drywall Calculator - Calculation Functions
 * Pure functions for calculating drywall requirements
 */

import type {
  DrywallInputs,
  DrywallResult,
  DrywallValidation,
  SheetSize,
} from './types'
import {
  SHEET_AREAS,
  DRYWALL_DEDUCTIONS,
  MATERIAL_RATIOS,
  DRYWALL_COSTS,
} from './types'

/**
 * Round to specified decimal places
 */
function roundToDecimals(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Calculate total wall area for a rectangular room
 * Formula: 2 × (length × height + width × height)
 */
export function calculateWallArea(
  length: number,
  width: number,
  height: number
): number {
  return 2 * (length * height + width * height)
}

/**
 * Calculate ceiling area
 * Formula: length × width
 */
export function calculateCeilingArea(length: number, width: number): number {
  return length * width
}

/**
 * Calculate total deductions for doors and windows
 */
export function calculateDeductions(
  numberOfDoors: number,
  numberOfWindows: number
): number {
  const doorDeduction = numberOfDoors * DRYWALL_DEDUCTIONS.door
  const windowDeduction = numberOfWindows * DRYWALL_DEDUCTIONS.window
  return doorDeduction + windowDeduction
}

/**
 * Calculate sheets needed
 */
export function calculateSheetsNeeded(
  totalArea: number,
  sheetSize: SheetSize
): number {
  const sheetArea = SHEET_AREAS[sheetSize]
  return Math.ceil(totalArea / sheetArea)
}

/**
 * Calculate joint compound needed (gallons)
 */
export function calculateJointCompound(totalArea: number): number {
  return roundToDecimals(totalArea * MATERIAL_RATIOS.jointCompoundPerSqFt, 1)
}

/**
 * Calculate tape needed (feet)
 */
export function calculateTape(totalArea: number): number {
  return Math.ceil(totalArea * MATERIAL_RATIOS.tapePerSqFt)
}

/**
 * Calculate screws needed
 */
export function calculateScrews(totalArea: number): number {
  return Math.ceil(totalArea * MATERIAL_RATIOS.screwsPerSqFt)
}

/**
 * Calculate corner bead (4 corners for a rectangular room)
 */
export function calculateCornerBead(wallHeight: number): number {
  // 4 inside corners (assuming rectangular room)
  return Math.ceil(4 * wallHeight)
}

/**
 * Calculate material costs
 */
export function calculateCosts(
  sheetsNeeded: number,
  sheetSize: SheetSize,
  jointCompoundGallons: number,
  tapeFeet: number,
  screwsNeeded: number
): { sheets: number; materials: number; total: number } {
  const sheetsCost = sheetsNeeded * DRYWALL_COSTS.sheetCost[sheetSize]
  const jointCompoundCost = Math.ceil(jointCompoundGallons) * DRYWALL_COSTS.jointCompoundPerGallon
  const tapeRolls = Math.ceil(tapeFeet / 250)
  const tapeCost = tapeRolls * DRYWALL_COSTS.tapePerRoll
  const screwBoxes = Math.ceil(screwsNeeded / 1000)
  const screwCost = screwBoxes * DRYWALL_COSTS.screwsPerBox

  const materialsCost = jointCompoundCost + tapeCost + screwCost

  return {
    sheets: roundToDecimals(sheetsCost, 0),
    materials: roundToDecimals(materialsCost, 0),
    total: roundToDecimals(sheetsCost + materialsCost, 0),
  }
}

/**
 * Validate drywall calculator inputs
 */
export function validateDrywallInputs(
  inputs: Partial<DrywallInputs>
): DrywallValidation {
  const errors: DrywallValidation['errors'] = []

  if (!inputs.roomLength || inputs.roomLength <= 0) {
    errors.push({ field: 'roomLength', message: 'validation.roomLengthRequired' })
  }
  if (!inputs.roomWidth || inputs.roomWidth <= 0) {
    errors.push({ field: 'roomWidth', message: 'validation.roomWidthRequired' })
  }
  if (!inputs.wallHeight || inputs.wallHeight <= 0) {
    errors.push({ field: 'wallHeight', message: 'validation.wallHeightRequired' })
  }
  if (inputs.numberOfDoors !== undefined && inputs.numberOfDoors < 0) {
    errors.push({ field: 'numberOfDoors', message: 'validation.numberOfDoorsInvalid' })
  }
  if (inputs.numberOfWindows !== undefined && inputs.numberOfWindows < 0) {
    errors.push({ field: 'numberOfWindows', message: 'validation.numberOfWindowsInvalid' })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Main drywall calculation function
 */
export function calculateDrywall(inputs: DrywallInputs): DrywallResult {
  const {
    roomLength,
    roomWidth,
    wallHeight,
    includeCeiling,
    sheetSize,
    numberOfDoors,
    numberOfWindows,
    wastePercent,
  } = inputs

  // Calculate areas
  const wallArea = calculateWallArea(roomLength, roomWidth, wallHeight)
  const ceilingArea = includeCeiling ? calculateCeilingArea(roomLength, roomWidth) : 0
  const totalDeductions = calculateDeductions(numberOfDoors, numberOfWindows)

  // Net area (area minus deductions)
  const netArea = Math.max(0, wallArea + ceilingArea - totalDeductions)

  // Add waste factor
  const totalAreaWithWaste = netArea * (1 + wastePercent / 100)

  // Calculate sheets needed
  const sheetsNeeded = calculateSheetsNeeded(totalAreaWithWaste, sheetSize)
  const sheetAreaUsed = SHEET_AREAS[sheetSize]

  // Calculate additional materials
  const jointCompoundGallons = calculateJointCompound(netArea)
  const tapeFeet = calculateTape(netArea)
  const screwsNeeded = calculateScrews(netArea)
  const cornerBeadFeet = calculateCornerBead(wallHeight)

  // Calculate costs
  const costs = calculateCosts(
    sheetsNeeded,
    sheetSize,
    jointCompoundGallons,
    tapeFeet,
    screwsNeeded
  )

  return {
    wallArea: roundToDecimals(wallArea, 2),
    ceilingArea: roundToDecimals(ceilingArea, 2),
    totalDeductions: roundToDecimals(totalDeductions, 2),
    netArea: roundToDecimals(netArea, 2),
    totalAreaWithWaste: roundToDecimals(totalAreaWithWaste, 2),
    sheetsNeeded,
    sheetAreaUsed,
    jointCompoundGallons,
    tapeFeet,
    screwsNeeded,
    cornerBeadFeet,
    estimatedCost: {
      ...costs,
      currency: 'USD',
    },
  }
}

/**
 * Format area for display
 */
export function formatArea(
  value: number,
  locale: string = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return formatter.format(value)
}
