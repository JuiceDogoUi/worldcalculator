/**
 * Temperature Converter Types
 * Supports Celsius, Fahrenheit, and Kelvin conversions
 */

/**
 * Temperature unit types
 */
export type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin'

/**
 * Temperature input values for all units
 */
export interface TemperatureInputs {
  celsius: number | null
  fahrenheit: number | null
  kelvin: number | null
  /** Which unit was last modified by the user */
  lastModified: TemperatureUnit
}

/**
 * Temperature conversion result
 */
export interface TemperatureResult {
  celsius: number
  fahrenheit: number
  kelvin: number
}

/**
 * Temperature validation errors
 */
export interface TemperatureValidation {
  valid: boolean
  errors: {
    field: TemperatureUnit
    message: string
  }[]
}

/**
 * Reference temperature point for display
 */
export interface ReferencePoint {
  name: string
  celsius: number
  fahrenheit: number
  kelvin: number
}

/**
 * Common reference temperature points
 */
export const REFERENCE_POINTS: ReferencePoint[] = [
  {
    name: 'absoluteZero',
    celsius: -273.15,
    fahrenheit: -459.67,
    kelvin: 0,
  },
  {
    name: 'waterFreezing',
    celsius: 0,
    fahrenheit: 32,
    kelvin: 273.15,
  },
  {
    name: 'roomTemperature',
    celsius: 20,
    fahrenheit: 68,
    kelvin: 293.15,
  },
  {
    name: 'bodyTemperature',
    celsius: 37,
    fahrenheit: 98.6,
    kelvin: 310.15,
  },
  {
    name: 'waterBoiling',
    celsius: 100,
    fahrenheit: 212,
    kelvin: 373.15,
  },
]

/**
 * Minimum valid Kelvin value (absolute zero)
 */
export const ABSOLUTE_ZERO_KELVIN = 0

/**
 * Minimum valid Celsius value (absolute zero)
 */
export const ABSOLUTE_ZERO_CELSIUS = -273.15

/**
 * Minimum valid Fahrenheit value (absolute zero)
 */
export const ABSOLUTE_ZERO_FAHRENHEIT = -459.67
