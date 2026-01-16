/**
 * Paint Calculator - Calculation Functions
 * Pure functions for calculating paint requirements
 */

import type {
  PaintInputs,
  PaintResult,
  PaintValidation,
} from './types'
import {
  COVERAGE_RATES,
  DEDUCTION_SIZES,
  PAINT_CONVERSIONS,
  PAINT_PRICES,
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
  const doorDeduction = numberOfDoors * DEDUCTION_SIZES.door
  const windowDeduction = numberOfWindows * DEDUCTION_SIZES.window
  return doorDeduction + windowDeduction
}

/**
 * Calculate gallons of paint needed
 */
export function calculateGallonsNeeded(
  paintableArea: number,
  coverageRate: number,
  numberOfCoats: number
): number {
  const totalAreaToPaint = paintableArea * numberOfCoats
  return totalAreaToPaint / coverageRate
}

/**
 * Validate paint calculator inputs
 */
export function validatePaintInputs(
  inputs: Partial<PaintInputs>
): PaintValidation {
  const errors: PaintValidation['errors'] = []

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
  if (inputs.numberOfCoats !== undefined && (inputs.numberOfCoats < 1 || inputs.numberOfCoats > 4)) {
    errors.push({ field: 'numberOfCoats', message: 'validation.numberOfCoatsInvalid' })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Main paint calculation function
 */
export function calculatePaint(inputs: PaintInputs): PaintResult {
  const {
    roomLength,
    roomWidth,
    wallHeight,
    numberOfDoors,
    numberOfWindows,
    includeCeiling,
    numberOfCoats,
  } = inputs

  // Calculate areas
  const totalWallArea = calculateWallArea(roomLength, roomWidth, wallHeight)

  // Calculate deductions
  const doorDeductions = numberOfDoors * DEDUCTION_SIZES.door
  const windowDeductions = numberOfWindows * DEDUCTION_SIZES.window
  const totalDeductions = doorDeductions + windowDeductions

  // Wall area after deductions (minimum 0)
  const wallAreaAfterDeductions = Math.max(0, totalWallArea - totalDeductions)

  // Ceiling area (if included)
  const ceilingArea = includeCeiling ? calculateCeilingArea(roomLength, roomWidth) : 0

  // Total paintable area
  const totalPaintableArea = wallAreaAfterDeductions + ceilingArea

  // Calculate paint needed
  const coverageRate = COVERAGE_RATES.standard
  const gallonsNeeded = calculateGallonsNeeded(
    totalPaintableArea,
    coverageRate,
    numberOfCoats
  )

  // Round up to practical quantities
  const roundedGallons = Math.ceil(gallonsNeeded)
  const litersNeeded = gallonsNeeded * PAINT_CONVERSIONS.gallonsToLiters
  const quartsNeeded = Math.ceil(gallonsNeeded * PAINT_CONVERSIONS.gallonsToQuarts)

  // Cost estimate
  const estimatedCostRange = {
    low: roundToDecimals(roundedGallons * PAINT_PRICES.budget, 0),
    high: roundToDecimals(roundedGallons * PAINT_PRICES.premium, 0),
    currency: 'USD',
  }

  return {
    totalWallArea: roundToDecimals(totalWallArea, 2),
    wallAreaAfterDeductions: roundToDecimals(wallAreaAfterDeductions, 2),
    ceilingArea: roundToDecimals(ceilingArea, 2),
    totalPaintableArea: roundToDecimals(totalPaintableArea, 2),
    gallonsNeeded: roundToDecimals(gallonsNeeded, 1),
    litersNeeded: roundToDecimals(litersNeeded, 1),
    quartsNeeded,
    coverageRateUsed: coverageRate,
    numberOfCoats,
    doorDeductions: roundToDecimals(doorDeductions, 2),
    windowDeductions: roundToDecimals(windowDeductions, 2),
    totalDeductions: roundToDecimals(totalDeductions, 2),
    estimatedCostRange,
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
 * Format paint quantity for display
 */
export function formatPaintQuantity(
  value: number,
  locale: string = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  return formatter.format(value)
}
