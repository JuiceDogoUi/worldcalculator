import type {
  TemperatureUnit,
  TemperatureInputs,
  TemperatureResult,
  TemperatureValidation,
} from './types'
import {
  ABSOLUTE_ZERO_CELSIUS,
  ABSOLUTE_ZERO_FAHRENHEIT,
  ABSOLUTE_ZERO_KELVIN,
} from './types'

/**
 * Round to specified decimal places
 * Used for display precision
 */
function roundToDecimals(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

// ============================================
// Conversion Functions
// ============================================

/**
 * Convert Celsius to Fahrenheit
 * Formula: F = (C x 9/5) + 32
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

/**
 * Convert Fahrenheit to Celsius
 * Formula: C = (F - 32) x 5/9
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9
}

/**
 * Convert Celsius to Kelvin
 * Formula: K = C + 273.15
 */
export function celsiusToKelvin(celsius: number): number {
  return celsius + 273.15
}

/**
 * Convert Kelvin to Celsius
 * Formula: C = K - 273.15
 */
export function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15
}

/**
 * Convert Fahrenheit to Kelvin
 * Formula: K = (F - 32) x 5/9 + 273.15
 */
export function fahrenheitToKelvin(fahrenheit: number): number {
  return celsiusToKelvin(fahrenheitToCelsius(fahrenheit))
}

/**
 * Convert Kelvin to Fahrenheit
 * Formula: F = (K - 273.15) x 9/5 + 32
 */
export function kelvinToFahrenheit(kelvin: number): number {
  return celsiusToFahrenheit(kelvinToCelsius(kelvin))
}

// ============================================
// Validation Functions
// ============================================

/**
 * Validate a temperature value for a specific unit
 * Checks for valid number and minimum value (absolute zero)
 */
export function validateTemperature(
  value: number | null,
  unit: TemperatureUnit
): { valid: boolean; error?: string } {
  // Check if value is null or undefined
  if (value === null || value === undefined) {
    return { valid: false, error: 'validation.required' }
  }

  // Check if value is a valid number
  if (isNaN(value)) {
    return { valid: false, error: 'validation.invalid' }
  }

  // Check minimum value (absolute zero) based on unit
  switch (unit) {
    case 'celsius':
      if (value < ABSOLUTE_ZERO_CELSIUS) {
        return { valid: false, error: 'validation.belowAbsoluteZero' }
      }
      break
    case 'fahrenheit':
      if (value < ABSOLUTE_ZERO_FAHRENHEIT) {
        return { valid: false, error: 'validation.belowAbsoluteZero' }
      }
      break
    case 'kelvin':
      if (value < ABSOLUTE_ZERO_KELVIN) {
        return { valid: false, error: 'validation.belowAbsoluteZero' }
      }
      break
  }

  return { valid: true }
}

/**
 * Validate temperature inputs
 * Only validates the last modified field (since others are calculated)
 */
export function validateTemperatureInputs(
  inputs: TemperatureInputs
): TemperatureValidation {
  const errors: TemperatureValidation['errors'] = []
  const value = inputs[inputs.lastModified]
  const result = validateTemperature(value, inputs.lastModified)

  if (!result.valid && result.error) {
    errors.push({
      field: inputs.lastModified,
      message: result.error,
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// ============================================
// Main Conversion Functions
// ============================================

/**
 * Convert from any unit to all units
 * Pure function - no side effects
 */
export function convertTemperature(
  value: number,
  fromUnit: TemperatureUnit
): TemperatureResult {
  let celsius: number
  let fahrenheit: number
  let kelvin: number

  switch (fromUnit) {
    case 'celsius':
      celsius = value
      fahrenheit = celsiusToFahrenheit(value)
      kelvin = celsiusToKelvin(value)
      break
    case 'fahrenheit':
      celsius = fahrenheitToCelsius(value)
      fahrenheit = value
      kelvin = fahrenheitToKelvin(value)
      break
    case 'kelvin':
      celsius = kelvinToCelsius(value)
      fahrenheit = kelvinToFahrenheit(value)
      kelvin = value
      break
  }

  return {
    celsius: roundToDecimals(celsius, 2),
    fahrenheit: roundToDecimals(fahrenheit, 2),
    kelvin: roundToDecimals(kelvin, 2),
  }
}

/**
 * Calculate all temperatures from the current inputs
 * Uses the lastModified field to determine source
 */
export function calculateTemperatures(
  inputs: TemperatureInputs
): TemperatureResult | null {
  const value = inputs[inputs.lastModified]

  if (value === null || isNaN(value)) {
    return null
  }

  return convertTemperature(value, inputs.lastModified)
}

// ============================================
// Formatting Functions
// ============================================

/**
 * Format temperature for display with unit symbol
 */
export function formatTemperature(
  value: number,
  unit: TemperatureUnit,
  locale: string = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  const symbols: Record<TemperatureUnit, string> = {
    celsius: 'C',
    fahrenheit: 'F',
    kelvin: 'K',
  }

  return `${formatter.format(value)}${symbols[unit]}`
}

/**
 * Get the unit symbol for a temperature unit
 */
export function getUnitSymbol(unit: TemperatureUnit): string {
  const symbols: Record<TemperatureUnit, string> = {
    celsius: 'C',
    fahrenheit: 'F',
    kelvin: 'K',
  }
  return symbols[unit]
}

/**
 * Get descriptive temperature range for a value
 * Used for color coding in UI
 */
export function getTemperatureRange(
  celsius: number
): 'freezing' | 'cold' | 'cool' | 'moderate' | 'warm' | 'hot' | 'extreme' {
  if (celsius < -20) return 'freezing'
  if (celsius < 0) return 'cold'
  if (celsius < 15) return 'cool'
  if (celsius < 25) return 'moderate'
  if (celsius < 35) return 'warm'
  if (celsius < 50) return 'hot'
  return 'extreme'
}

/**
 * Get color for temperature range (Tailwind-compatible hex colors)
 */
export const TEMPERATURE_RANGE_COLORS: Record<
  ReturnType<typeof getTemperatureRange>,
  string
> = {
  freezing: '#1e3a8a', // blue-900
  cold: '#3b82f6', // blue-500
  cool: '#06b6d4', // cyan-500
  moderate: '#22c55e', // green-500
  warm: '#f97316', // orange-500
  hot: '#ef4444', // red-500
  extreme: '#7c2d12', // orange-900
}

/**
 * Get background color for temperature range
 */
export const TEMPERATURE_RANGE_BG_COLORS: Record<
  ReturnType<typeof getTemperatureRange>,
  string
> = {
  freezing: '#dbeafe', // blue-100
  cold: '#dbeafe', // blue-100
  cool: '#cffafe', // cyan-100
  moderate: '#dcfce7', // green-100
  warm: '#ffedd5', // orange-100
  hot: '#fee2e2', // red-100
  extreme: '#fef3c7', // amber-100
}
