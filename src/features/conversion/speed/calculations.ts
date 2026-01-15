import type {
  SpeedUnit,
  SpeedConversionResult,
  SpeedValidation,
  SpeedContextExample,
} from './types'
import { SPEED_UNITS, SPEED_CONTEXT_EXAMPLES } from './types'

/**
 * Round to specified decimal places to avoid floating point precision issues
 */
function roundToDecimals(value: number, decimals: number = 6): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/**
 * Convert speed from one unit to another using m/s as the base unit
 *
 * @param value - The speed value to convert
 * @param fromUnit - The source unit
 * @param toUnit - The target unit
 * @returns The converted speed value
 */
export function convertSpeed(
  value: number,
  fromUnit: SpeedUnit,
  toUnit: SpeedUnit
): number {
  if (value === 0) return 0
  if (fromUnit === toUnit) return value

  const fromInfo = SPEED_UNITS[fromUnit]
  const toInfo = SPEED_UNITS[toUnit]

  // Convert to base unit (m/s), then to target unit
  const inBaseUnit = value * fromInfo.toBaseUnit
  const result = inBaseUnit / toInfo.toBaseUnit

  return roundToDecimals(result)
}

/**
 * Convert speed to all supported units
 *
 * @param value - The speed value to convert
 * @param fromUnit - The source unit
 * @returns Object with all conversions
 */
export function convertToAllUnits(
  value: number,
  fromUnit: SpeedUnit
): Record<SpeedUnit, number> {
  const units: SpeedUnit[] = ['kmh', 'mph', 'ms', 'fts', 'knots']
  const result: Partial<Record<SpeedUnit, number>> = {}

  for (const unit of units) {
    result[unit] = convertSpeed(value, fromUnit, unit)
  }

  return result as Record<SpeedUnit, number>
}

/**
 * Perform a complete speed conversion with all related values
 *
 * @param value - The speed value to convert
 * @param fromUnit - The source unit
 * @param toUnit - The target unit
 * @returns Complete conversion result
 */
export function calculateSpeedConversion(
  value: number,
  fromUnit: SpeedUnit,
  toUnit: SpeedUnit
): SpeedConversionResult {
  return {
    inputValue: value,
    inputUnit: fromUnit,
    outputValue: convertSpeed(value, fromUnit, toUnit),
    outputUnit: toUnit,
    allConversions: convertToAllUnits(value, fromUnit),
  }
}

/**
 * Validate speed conversion inputs
 *
 * @param value - The speed value to validate
 * @returns Validation result
 */
export function validateSpeedInputs(value: number): SpeedValidation {
  const errors: SpeedValidation['errors'] = []

  if (isNaN(value)) {
    errors.push({ field: 'value', message: 'Please enter a valid number' })
  } else if (value < 0) {
    errors.push({ field: 'value', message: 'Speed cannot be negative' })
  } else if (value > 1000000000) {
    errors.push({ field: 'value', message: 'Value exceeds maximum (1,000,000,000)' })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Get context examples that match the given speed
 *
 * @param speedInMs - Speed in meters per second
 * @returns Array of matching context examples
 */
export function getMatchingContexts(speedInMs: number): SpeedContextExample[] {
  if (speedInMs <= 0) return []

  return SPEED_CONTEXT_EXAMPLES.filter(
    (example) => speedInMs >= example.minSpeed && speedInMs <= example.maxSpeed
  )
}

/**
 * Get the closest context example to the given speed
 *
 * @param speedInMs - Speed in meters per second
 * @returns The closest context example or null
 */
export function getClosestContext(speedInMs: number): SpeedContextExample | null {
  if (speedInMs <= 0) return null

  // First try to find an exact match
  const exactMatches = getMatchingContexts(speedInMs)
  if (exactMatches.length > 0) return exactMatches[0]

  // Find the closest context by comparing to the midpoint of each range
  let closest: SpeedContextExample | null = null
  let smallestDistance = Infinity

  for (const example of SPEED_CONTEXT_EXAMPLES) {
    const midpoint = (example.minSpeed + example.maxSpeed) / 2
    const distance = Math.abs(speedInMs - midpoint)

    if (distance < smallestDistance) {
      smallestDistance = distance
      closest = example
    }
  }

  return closest
}

/**
 * Format speed value for display
 *
 * @param value - The speed value
 * @param decimals - Number of decimal places
 * @returns Formatted string
 */
export function formatSpeedValue(value: number, decimals: number = 2): string {
  if (value === 0) return '0'

  // For very large numbers, use fewer decimals
  if (Math.abs(value) >= 10000) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  // For very small numbers, show more precision
  if (Math.abs(value) < 0.01 && value !== 0) {
    return value.toExponential(2)
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

/**
 * Get the unit abbreviation for display
 *
 * @param unit - The speed unit
 * @returns The abbreviation string
 */
export function getUnitAbbreviation(unit: SpeedUnit): string {
  return SPEED_UNITS[unit].abbreviation
}

/**
 * Get all available speed units for dropdown
 */
export function getAvailableUnits(): SpeedUnit[] {
  return ['kmh', 'mph', 'ms', 'fts', 'knots']
}
