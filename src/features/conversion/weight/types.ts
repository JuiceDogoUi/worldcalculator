/**
 * Weight Converter Types
 *
 * Defines all weight/mass units supported for conversion,
 * including both metric and imperial systems.
 */

/**
 * All supported weight units
 */
export type WeightUnit =
  // Metric units
  | 'mg'      // Milligram
  | 'g'       // Gram
  | 'kg'      // Kilogram
  | 'tonne'   // Metric ton (1000 kg)
  // Imperial units
  | 'oz'      // Ounce
  | 'lb'      // Pound
  | 'stone'   // Stone (14 pounds)
  | 'ton'     // US short ton (2000 pounds)

/**
 * Unit metadata for display and categorization
 */
export interface WeightUnitInfo {
  id: WeightUnit
  system: 'metric' | 'imperial'
  toKg: number // Conversion factor to kilograms (base unit)
}

/**
 * Weight converter input state
 */
export interface WeightConverterInputs {
  value: number
  fromUnit: WeightUnit
  toUnit: WeightUnit
}

/**
 * Weight conversion result
 */
export interface WeightConversionResult {
  inputValue: number
  inputUnit: WeightUnit
  outputValue: number
  outputUnit: WeightUnit
  // For display: formatted string with proper precision
  formattedOutput: string
}

/**
 * Common conversion reference item
 */
export interface CommonConversion {
  from: WeightUnit
  to: WeightUnit
  fromValue: number
  toValue: number
  label: string
}

/**
 * Validation errors for inputs
 */
export interface WeightConverterValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}

/**
 * Translation structure for weight converter
 */
export interface WeightConverterTranslations {
  title: string
  description: string
  fromValue: string
  fromUnit: string
  toUnit: string
  result: string
  swap: string
  reset: string
  copy: string
  copied: string
  commonConversions: string
  metricUnits: string
  imperialUnits: string
  // Unit names
  units: {
    mg: { name: string; abbr: string }
    g: { name: string; abbr: string }
    kg: { name: string; abbr: string }
    tonne: { name: string; abbr: string }
    oz: { name: string; abbr: string }
    lb: { name: string; abbr: string }
    stone: { name: string; abbr: string }
    ton: { name: string; abbr: string }
  }
  // Validation
  validation?: {
    required: string
    positive: string
    tooLarge: string
  }
}
