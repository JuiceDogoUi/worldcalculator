/**
 * Square Footage Calculator - Calculation Functions
 * Pure functions for calculating area of various shapes
 */

import type {
  SquareFootageInputs,
  SquareFootageResult,
  SquareFootageValidation,
  ShapeType,
} from './types'
import { CONVERSION_FACTORS, MATERIAL_CONSTANTS } from './types'

/**
 * Round to specified decimal places
 */
function roundToDecimals(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Calculate rectangle area
 * Formula: length × width
 */
export function calculateRectangleArea(length: number, width: number): number {
  return length * width
}

/**
 * Calculate circle area
 * Formula: π × (diameter/2)²
 */
export function calculateCircleArea(diameter: number): number {
  const radius = diameter / 2
  return Math.PI * radius * radius
}

/**
 * Calculate triangle area
 * Formula: (base × height) / 2
 */
export function calculateTriangleArea(base: number, height: number): number {
  return (base * height) / 2
}

/**
 * Calculate L-shape area
 * Two rectangles combined (overlapping area subtracted)
 */
export function calculateLShapeArea(
  length1: number,
  width1: number,
  length2: number,
  width2: number
): number {
  // L-shape is calculated as two rectangles
  // First rectangle: length1 × width1
  // Second rectangle: length2 × width2
  // Total area (assuming they share one corner)
  return length1 * width1 + length2 * width2
}

/**
 * Calculate trapezoid area
 * Formula: ((base1 + base2) / 2) × height
 */
export function calculateTrapezoidArea(
  base1: number,
  base2: number,
  height: number
): number {
  return ((base1 + base2) / 2) * height
}

/**
 * Validate square footage inputs
 */
export function validateSquareFootageInputs(
  inputs: Partial<SquareFootageInputs> & { shape?: ShapeType }
): SquareFootageValidation {
  const errors: SquareFootageValidation['errors'] = []

  if (!inputs.shape) {
    errors.push({ field: 'shape', message: 'validation.shapeRequired' })
    return { valid: false, errors }
  }

  switch (inputs.shape) {
    case 'rectangle':
      if (!inputs.length || inputs.length <= 0) {
        errors.push({ field: 'length', message: 'validation.lengthRequired' })
      }
      if (!inputs.width || inputs.width <= 0) {
        errors.push({ field: 'width', message: 'validation.widthRequired' })
      }
      break

    case 'circle':
      if (!inputs.diameter || inputs.diameter <= 0) {
        errors.push({ field: 'diameter', message: 'validation.diameterRequired' })
      }
      break

    case 'triangle':
      if (!inputs.base || inputs.base <= 0) {
        errors.push({ field: 'base', message: 'validation.baseRequired' })
      }
      if (!inputs.height || inputs.height <= 0) {
        errors.push({ field: 'height', message: 'validation.heightRequired' })
      }
      break

    case 'l-shape':
      if (!inputs.length1 || inputs.length1 <= 0) {
        errors.push({ field: 'length1', message: 'validation.length1Required' })
      }
      if (!inputs.width1 || inputs.width1 <= 0) {
        errors.push({ field: 'width1', message: 'validation.width1Required' })
      }
      if (!inputs.length2 || inputs.length2 <= 0) {
        errors.push({ field: 'length2', message: 'validation.length2Required' })
      }
      if (!inputs.width2 || inputs.width2 <= 0) {
        errors.push({ field: 'width2', message: 'validation.width2Required' })
      }
      break

    case 'trapezoid':
      if (!inputs.base1 || inputs.base1 <= 0) {
        errors.push({ field: 'base1', message: 'validation.base1Required' })
      }
      if (!inputs.base2 || inputs.base2 <= 0) {
        errors.push({ field: 'base2', message: 'validation.base2Required' })
      }
      if (!inputs.height || inputs.height <= 0) {
        errors.push({ field: 'height', message: 'validation.heightRequired' })
      }
      break
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Calculate square footage for any shape
 */
export function calculateSquareFootage(
  inputs: SquareFootageInputs
): SquareFootageResult {
  let squareFeet: number

  switch (inputs.shape) {
    case 'rectangle':
      squareFeet = calculateRectangleArea(inputs.length, inputs.width)
      break
    case 'circle':
      squareFeet = calculateCircleArea(inputs.diameter)
      break
    case 'triangle':
      squareFeet = calculateTriangleArea(inputs.base, inputs.height)
      break
    case 'l-shape':
      squareFeet = calculateLShapeArea(
        inputs.length1,
        inputs.width1,
        inputs.length2,
        inputs.width2
      )
      break
    case 'trapezoid':
      squareFeet = calculateTrapezoidArea(inputs.base1, inputs.base2, inputs.height)
      break
  }

  // Convert to other units
  const squareMeters = squareFeet * CONVERSION_FACTORS.sqFtToSqM
  const squareYards = squareFeet * CONVERSION_FACTORS.sqFtToSqYd
  const acres = squareFeet * CONVERSION_FACTORS.sqFtToAcres

  // Calculate material estimates
  const paintGallons = squareFeet / MATERIAL_CONSTANTS.paintCoverageSqFtPerGallon
  const paintLiters = paintGallons * 3.78541 // gallons to liters

  const flooringWithWaste =
    squareFeet * (1 + MATERIAL_CONSTANTS.flooringWastePercent / 100)

  return {
    shape: inputs.shape,
    squareFeet: roundToDecimals(squareFeet, 2),
    squareMeters: roundToDecimals(squareMeters, 2),
    squareYards: roundToDecimals(squareYards, 2),
    acres: roundToDecimals(acres, 6),
    suggestedMaterials: {
      paint: {
        gallons: roundToDecimals(paintGallons * MATERIAL_CONSTANTS.paintCoats, 1),
        liters: roundToDecimals(paintLiters * MATERIAL_CONSTANTS.paintCoats, 1),
        coats: MATERIAL_CONSTANTS.paintCoats,
      },
      flooring: {
        squareFeet: roundToDecimals(flooringWithWaste, 2),
        squareMeters: roundToDecimals(
          flooringWithWaste * CONVERSION_FACTORS.sqFtToSqM,
          2
        ),
        wastePercent: MATERIAL_CONSTANTS.flooringWastePercent,
      },
    },
  }
}

/**
 * Convert feet to meters
 */
export function feetToMeters(feet: number): number {
  return feet * CONVERSION_FACTORS.ftToM
}

/**
 * Convert meters to feet
 */
export function metersToFeet(meters: number): number {
  return meters * CONVERSION_FACTORS.mToFt
}

/**
 * Format area for display
 */
export function formatArea(
  value: number,
  unit: 'sqft' | 'sqm' | 'sqyd' | 'acres',
  locale: string = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: unit === 'acres' ? 6 : 2,
    maximumFractionDigits: unit === 'acres' ? 6 : 2,
  })
  return formatter.format(value)
}
