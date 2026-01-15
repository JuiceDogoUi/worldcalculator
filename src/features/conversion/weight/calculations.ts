import type {
  WeightUnit,
  WeightUnitInfo,
  WeightConverterInputs,
  WeightConversionResult,
  WeightConverterValidation,
  CommonConversion,
} from './types'

/**
 * Conversion factors to kilograms (base unit)
 * All conversions go through kg as the intermediate unit
 */
export const WEIGHT_UNITS: Record<WeightUnit, WeightUnitInfo> = {
  // Metric units
  mg: { id: 'mg', system: 'metric', toKg: 0.000001 },
  g: { id: 'g', system: 'metric', toKg: 0.001 },
  kg: { id: 'kg', system: 'metric', toKg: 1 },
  tonne: { id: 'tonne', system: 'metric', toKg: 1000 },
  // Imperial units
  oz: { id: 'oz', system: 'imperial', toKg: 0.0283495 },
  lb: { id: 'lb', system: 'imperial', toKg: 0.453592 },
  stone: { id: 'stone', system: 'imperial', toKg: 6.35029 },
  ton: { id: 'ton', system: 'imperial', toKg: 907.185 },
}

/**
 * Get all metric units in order
 */
export function getMetricUnits(): WeightUnit[] {
  return ['mg', 'g', 'kg', 'tonne']
}

/**
 * Get all imperial units in order
 */
export function getImperialUnits(): WeightUnit[] {
  return ['oz', 'lb', 'stone', 'ton']
}

/**
 * Get all units in display order (metric first, then imperial)
 */
export function getAllUnits(): WeightUnit[] {
  return [...getMetricUnits(), ...getImperialUnits()]
}

/**
 * Round a value to a sensible number of decimal places
 * based on the magnitude of the number
 */
function smartRound(value: number): number {
  if (value === 0) return 0

  const absValue = Math.abs(value)

  // Very large numbers - no decimals needed
  if (absValue >= 1000000) {
    return Math.round(value)
  }

  // Large numbers - 2 decimals max
  if (absValue >= 1000) {
    return Math.round(value * 100) / 100
  }

  // Medium numbers - 4 decimals
  if (absValue >= 1) {
    return Math.round(value * 10000) / 10000
  }

  // Small numbers - 6 decimals
  if (absValue >= 0.001) {
    return Math.round(value * 1000000) / 1000000
  }

  // Very small numbers - 9 decimals
  if (absValue >= 0.000001) {
    return Math.round(value * 1000000000) / 1000000000
  }

  // Extremely small - use scientific notation precision
  return Number(value.toPrecision(6))
}

/**
 * Format a number for display with appropriate precision
 */
export function formatWeightValue(value: number, locale: string = 'en-US'): string {
  const rounded = smartRound(value)

  // Use toLocaleString for proper formatting
  // Determine decimal places based on magnitude
  const absValue = Math.abs(rounded)

  let maximumFractionDigits = 6
  if (absValue >= 1000) {
    maximumFractionDigits = 2
  } else if (absValue >= 1) {
    maximumFractionDigits = 4
  }

  return rounded.toLocaleString(locale, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  })
}

/**
 * Convert a weight value from one unit to another
 * Uses kilograms as the intermediate unit
 */
export function convertWeight(
  value: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): number {
  if (value === 0) return 0
  if (fromUnit === toUnit) return value

  // Convert to kg first, then to target unit
  const inKg = value * WEIGHT_UNITS[fromUnit].toKg
  const result = inKg / WEIGHT_UNITS[toUnit].toKg

  return smartRound(result)
}

/**
 * Validate weight converter inputs
 */
export function validateWeightInputs(
  inputs: Partial<WeightConverterInputs>
): WeightConverterValidation {
  const errors: WeightConverterValidation['errors'] = []

  if (inputs.value === undefined || inputs.value === null) {
    errors.push({ field: 'value', message: 'Value is required' })
  } else if (inputs.value < 0) {
    errors.push({ field: 'value', message: 'Value must be positive' })
  } else if (inputs.value > 1e15) {
    errors.push({ field: 'value', message: 'Value is too large' })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Calculate complete weight conversion result
 */
export function calculateWeightConversion(
  inputs: WeightConverterInputs,
  locale: string = 'en-US'
): WeightConversionResult {
  const { value, fromUnit, toUnit } = inputs

  const outputValue = convertWeight(value, fromUnit, toUnit)
  const formattedOutput = formatWeightValue(outputValue, locale)

  return {
    inputValue: value,
    inputUnit: fromUnit,
    outputValue,
    outputUnit: toUnit,
    formattedOutput,
  }
}

/**
 * Generate common conversion references
 * These are popular conversions users frequently need
 */
export function getCommonConversions(): CommonConversion[] {
  return [
    // Metric to Imperial
    { from: 'kg', to: 'lb', fromValue: 1, toValue: convertWeight(1, 'kg', 'lb'), label: '1 kg to lb' },
    { from: 'g', to: 'oz', fromValue: 100, toValue: convertWeight(100, 'g', 'oz'), label: '100 g to oz' },
    { from: 'kg', to: 'stone', fromValue: 70, toValue: convertWeight(70, 'kg', 'stone'), label: '70 kg to stone' },
    { from: 'tonne', to: 'ton', fromValue: 1, toValue: convertWeight(1, 'tonne', 'ton'), label: '1 tonne to ton' },
    // Imperial to Metric
    { from: 'lb', to: 'kg', fromValue: 1, toValue: convertWeight(1, 'lb', 'kg'), label: '1 lb to kg' },
    { from: 'oz', to: 'g', fromValue: 1, toValue: convertWeight(1, 'oz', 'g'), label: '1 oz to g' },
    { from: 'stone', to: 'kg', fromValue: 10, toValue: convertWeight(10, 'stone', 'kg'), label: '10 stone to kg' },
    { from: 'lb', to: 'kg', fromValue: 100, toValue: convertWeight(100, 'lb', 'kg'), label: '100 lb to kg' },
    // Within metric
    { from: 'kg', to: 'g', fromValue: 1, toValue: convertWeight(1, 'kg', 'g'), label: '1 kg to g' },
    { from: 'g', to: 'mg', fromValue: 1, toValue: convertWeight(1, 'g', 'mg'), label: '1 g to mg' },
    // Within imperial
    { from: 'lb', to: 'oz', fromValue: 1, toValue: convertWeight(1, 'lb', 'oz'), label: '1 lb to oz' },
    { from: 'stone', to: 'lb', fromValue: 1, toValue: convertWeight(1, 'stone', 'lb'), label: '1 stone to lb' },
  ]
}

/**
 * Get unit system label
 */
export function getUnitSystem(unit: WeightUnit): 'metric' | 'imperial' {
  return WEIGHT_UNITS[unit].system
}

/**
 * Check if conversion is between different systems
 */
export function isCrossSystemConversion(
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): boolean {
  return WEIGHT_UNITS[fromUnit].system !== WEIGHT_UNITS[toUnit].system
}
