/**
 * Length units supported by the converter
 */
export type LengthUnit =
  // Metric units
  | 'mm'   // Millimeter
  | 'cm'   // Centimeter
  | 'm'    // Meter
  | 'km'   // Kilometer
  // Imperial units
  | 'in'   // Inch
  | 'ft'   // Foot
  | 'yd'   // Yard
  | 'mi'   // Mile

/**
 * Unit system type
 */
export type UnitSystem = 'metric' | 'imperial'

/**
 * Unit metadata for UI display and categorization
 */
export interface UnitInfo {
  id: LengthUnit
  system: UnitSystem
  toMeters: number  // Conversion factor to base unit (meters)
}

/**
 * Inputs for length conversion
 */
export interface LengthConverterInputs {
  value: number
  fromUnit: LengthUnit
  toUnit: LengthUnit
}

/**
 * Result of length conversion
 */
export interface LengthConversionResult {
  inputValue: number
  inputUnit: LengthUnit
  outputValue: number
  outputUnit: LengthUnit
  conversionFactor: number  // Direct factor from input to output
}

/**
 * Common conversion pairs for quick reference
 */
export interface CommonConversion {
  fromUnit: LengthUnit
  toUnit: LengthUnit
  fromValue: number
  toValue: number
}

/**
 * All conversions from a single value to all units
 */
export interface AllUnitsConversion {
  inputValue: number
  inputUnit: LengthUnit
  conversions: {
    unit: LengthUnit
    value: number
  }[]
}

/**
 * Validation result for converter inputs
 */
export interface LengthValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
