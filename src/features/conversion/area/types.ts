/**
 * Area units supported by the converter
 * Base unit: square meters (m2)
 */
export type AreaUnit =
  // Metric units
  | 'mm2'    // Square millimeters
  | 'cm2'    // Square centimeters
  | 'm2'     // Square meters (base unit)
  | 'km2'    // Square kilometers
  | 'hectare' // Hectares
  // Imperial units
  | 'in2'    // Square inches
  | 'ft2'    // Square feet
  | 'yd2'    // Square yards
  | 'acre'   // Acres
  | 'mi2'   // Square miles

/**
 * Area unit metadata
 */
export interface AreaUnitInfo {
  id: AreaUnit
  system: 'metric' | 'imperial'
  toSquareMeters: number // Conversion factor to m2
}

/**
 * Converter inputs
 */
export interface AreaConverterInputs {
  value: number
  fromUnit: AreaUnit
  toUnit: AreaUnit
}

/**
 * Conversion result
 */
export interface AreaConversionResult {
  inputValue: number
  inputUnit: AreaUnit
  outputValue: number
  outputUnit: AreaUnit
  valueInSquareMeters: number
  formula: string
}

/**
 * All conversions from input to all units
 */
export interface AreaAllConversions {
  inputValue: number
  inputUnit: AreaUnit
  valueInSquareMeters: number
  conversions: Array<{
    unit: AreaUnit
    value: number
    system: 'metric' | 'imperial'
  }>
}

/**
 * Validation result for converter inputs
 */
export interface AreaValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
