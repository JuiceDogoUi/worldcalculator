/**
 * Volume unit types
 * Organized by measurement system (metric, US imperial, UK imperial)
 */
export type VolumeUnit =
  // Metric units
  | 'milliliter'
  | 'liter'
  | 'cubic-meter'
  // US Imperial units
  | 'fluid-ounce-us'
  | 'cup-us'
  | 'pint-us'
  | 'quart-us'
  | 'gallon-us'
  // UK Imperial units
  | 'fluid-ounce-uk'
  | 'pint-uk'
  | 'quart-uk'
  | 'gallon-uk'
  // Other common units
  | 'tablespoon-us'
  | 'teaspoon-us'
  | 'cubic-inch'
  | 'cubic-foot'

/**
 * Measurement system for grouping units
 */
export type MeasurementSystem = 'metric' | 'us-imperial' | 'uk-imperial' | 'other'

/**
 * Volume unit metadata
 */
export interface VolumeUnitInfo {
  id: VolumeUnit
  system: MeasurementSystem
  /** Conversion factor to liters (base unit) */
  toLiters: number
  /** Abbreviation for display */
  abbreviation: string
}

/**
 * Conversion inputs
 */
export interface VolumeConversionInputs {
  value: number
  fromUnit: VolumeUnit
  toUnit: VolumeUnit
}

/**
 * Conversion result
 */
export interface VolumeConversionResult {
  inputValue: number
  inputUnit: VolumeUnit
  outputValue: number
  outputUnit: VolumeUnit
  /** Value in liters (base unit) for reference */
  litersValue: number
}

/**
 * All unit conversions for a given input
 */
export interface AllVolumeConversions {
  inputValue: number
  inputUnit: VolumeUnit
  litersValue: number
  conversions: Record<VolumeUnit, number>
}

/**
 * Validation result
 */
export interface VolumeValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
