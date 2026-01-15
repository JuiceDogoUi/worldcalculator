import type {
  LengthUnit,
  UnitInfo,
  LengthConverterInputs,
  LengthConversionResult,
  CommonConversion,
  AllUnitsConversion,
  LengthValidation,
} from './types'

/**
 * Unit definitions with conversion factors to meters (base unit)
 * Using meters as the base allows bidirectional conversion between any units
 */
export const UNIT_DEFINITIONS: Record<LengthUnit, UnitInfo> = {
  // Metric units
  mm: { id: 'mm', system: 'metric', toMeters: 0.001 },
  cm: { id: 'cm', system: 'metric', toMeters: 0.01 },
  m: { id: 'm', system: 'metric', toMeters: 1 },
  km: { id: 'km', system: 'metric', toMeters: 1000 },
  // Imperial units
  in: { id: 'in', system: 'imperial', toMeters: 0.0254 },
  ft: { id: 'ft', system: 'imperial', toMeters: 0.3048 },
  yd: { id: 'yd', system: 'imperial', toMeters: 0.9144 },
  mi: { id: 'mi', system: 'imperial', toMeters: 1609.344 },
  nmi: { id: 'nmi', system: 'imperial', toMeters: 1852 }, // Nautical mile (exact by definition)
}

/**
 * All available units in display order
 */
export const ALL_UNITS: LengthUnit[] = ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi', 'nmi']

/**
 * Metric units in order from smallest to largest
 */
export const METRIC_UNITS: LengthUnit[] = ['mm', 'cm', 'm', 'km']

/**
 * Imperial units in order from smallest to largest
 */
export const IMPERIAL_UNITS: LengthUnit[] = ['in', 'ft', 'yd', 'mi', 'nmi']

/**
 * Round to specified decimal places, handling floating-point precision
 */
export function roundToDecimals(value: number, decimals: number = 6): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/**
 * Format number with appropriate precision based on magnitude
 * Smaller numbers get more decimal places for accuracy
 */
export function formatConversionValue(value: number): string {
  if (value === 0) return '0'

  const absValue = Math.abs(value)

  // Very large numbers - no decimals
  if (absValue >= 1000000) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 })
  }

  // Large numbers - few decimals
  if (absValue >= 1000) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }

  // Normal numbers - moderate decimals
  if (absValue >= 1) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 4 })
  }

  // Small numbers - more decimals
  if (absValue >= 0.001) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 6 })
  }

  // Very small numbers - scientific notation threshold or max decimals
  return value.toLocaleString('en-US', { maximumFractionDigits: 10 })
}

/**
 * Validate converter inputs
 */
export function validateInputs(inputs: Partial<LengthConverterInputs>): LengthValidation {
  const errors: LengthValidation['errors'] = []

  if (inputs.value === undefined || inputs.value === null) {
    errors.push({ field: 'value', message: 'Please enter a value to convert' })
  } else if (isNaN(inputs.value)) {
    errors.push({ field: 'value', message: 'Please enter a valid number' })
  } else if (inputs.value < 0) {
    errors.push({ field: 'value', message: 'Length cannot be negative' })
  } else if (!isFinite(inputs.value)) {
    errors.push({ field: 'value', message: 'Value must be a finite number' })
  }

  if (!inputs.fromUnit || !UNIT_DEFINITIONS[inputs.fromUnit]) {
    errors.push({ field: 'fromUnit', message: 'Please select a valid source unit' })
  }

  if (!inputs.toUnit || !UNIT_DEFINITIONS[inputs.toUnit]) {
    errors.push({ field: 'toUnit', message: 'Please select a valid target unit' })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Convert length from one unit to another
 * Uses meters as intermediate base unit for accuracy
 */
export function convertLength(inputs: LengthConverterInputs): LengthConversionResult {
  const { value, fromUnit, toUnit } = inputs

  // Handle zero case
  if (value === 0) {
    return {
      inputValue: 0,
      inputUnit: fromUnit,
      outputValue: 0,
      outputUnit: toUnit,
      conversionFactor: getConversionFactor(fromUnit, toUnit),
    }
  }

  // Get conversion factors
  const fromFactor = UNIT_DEFINITIONS[fromUnit].toMeters
  const toFactor = UNIT_DEFINITIONS[toUnit].toMeters

  // Convert: input -> meters -> output
  const valueInMeters = value * fromFactor
  const outputValue = valueInMeters / toFactor

  // Calculate direct conversion factor
  const conversionFactor = fromFactor / toFactor

  return {
    inputValue: value,
    inputUnit: fromUnit,
    outputValue: roundToDecimals(outputValue, 10),
    outputUnit: toUnit,
    conversionFactor: roundToDecimals(conversionFactor, 10),
  }
}

/**
 * Get direct conversion factor from one unit to another
 */
export function getConversionFactor(fromUnit: LengthUnit, toUnit: LengthUnit): number {
  const fromFactor = UNIT_DEFINITIONS[fromUnit].toMeters
  const toFactor = UNIT_DEFINITIONS[toUnit].toMeters
  return roundToDecimals(fromFactor / toFactor, 10)
}

/**
 * Convert a value to all available units
 */
export function convertToAllUnits(value: number, fromUnit: LengthUnit): AllUnitsConversion {
  const conversions = ALL_UNITS.map((unit) => ({
    unit,
    value: convertLength({ value, fromUnit, toUnit: unit }).outputValue,
  }))

  return {
    inputValue: value,
    inputUnit: fromUnit,
    conversions,
  }
}

/**
 * Common conversion reference values
 * Useful for quick reference cards in the UI
 */
export const COMMON_CONVERSIONS: CommonConversion[] = [
  // Metric to Imperial
  { fromUnit: 'cm', toUnit: 'in', fromValue: 1, toValue: 0.393701 },
  { fromUnit: 'm', toUnit: 'ft', fromValue: 1, toValue: 3.28084 },
  { fromUnit: 'km', toUnit: 'mi', fromValue: 1, toValue: 0.621371 },
  // Imperial to Metric
  { fromUnit: 'in', toUnit: 'cm', fromValue: 1, toValue: 2.54 },
  { fromUnit: 'ft', toUnit: 'm', fromValue: 1, toValue: 0.3048 },
  { fromUnit: 'mi', toUnit: 'km', fromValue: 1, toValue: 1.609344 },
  // Common practical conversions
  { fromUnit: 'ft', toUnit: 'in', fromValue: 1, toValue: 12 },
  { fromUnit: 'yd', toUnit: 'ft', fromValue: 1, toValue: 3 },
  { fromUnit: 'm', toUnit: 'cm', fromValue: 1, toValue: 100 },
  { fromUnit: 'km', toUnit: 'm', fromValue: 1, toValue: 1000 },
]

/**
 * Get unit system (metric or imperial)
 */
export function getUnitSystem(unit: LengthUnit): 'metric' | 'imperial' {
  return UNIT_DEFINITIONS[unit].system
}

/**
 * Check if converting between different unit systems
 */
export function isCrossSystemConversion(fromUnit: LengthUnit, toUnit: LengthUnit): boolean {
  return getUnitSystem(fromUnit) !== getUnitSystem(toUnit)
}
