import type {
  AreaUnit,
  AreaUnitInfo,
  AreaConverterInputs,
  AreaConversionResult,
  AreaAllConversions,
  AreaValidation,
} from './types'

/**
 * Conversion factors to square meters (m2)
 * All values are exact or highly precise standard conversion factors
 */
export const AREA_UNITS: Record<AreaUnit, AreaUnitInfo> = {
  // Metric units
  mm2: { id: 'mm2', system: 'metric', toSquareMeters: 0.000001 },
  cm2: { id: 'cm2', system: 'metric', toSquareMeters: 0.0001 },
  m2: { id: 'm2', system: 'metric', toSquareMeters: 1 },
  km2: { id: 'km2', system: 'metric', toSquareMeters: 1000000 },
  hectare: { id: 'hectare', system: 'metric', toSquareMeters: 10000 },
  // Imperial units
  in2: { id: 'in2', system: 'imperial', toSquareMeters: 0.00064516 },
  ft2: { id: 'ft2', system: 'imperial', toSquareMeters: 0.09290304 },
  yd2: { id: 'yd2', system: 'imperial', toSquareMeters: 0.83612736 },
  acre: { id: 'acre', system: 'imperial', toSquareMeters: 4046.8564224 },
  mi2: { id: 'mi2', system: 'imperial', toSquareMeters: 2589988.110336 },
}

/**
 * Order of units for display (metric first, then imperial, small to large)
 */
export const UNIT_ORDER: AreaUnit[] = [
  // Metric
  'mm2',
  'cm2',
  'm2',
  'hectare',
  'km2',
  // Imperial
  'in2',
  'ft2',
  'yd2',
  'acre',
  'mi2',
]

/**
 * Round to significant precision for display
 * Handles very small and very large numbers appropriately
 */
function roundToPrecision(value: number, precision: number = 10): number {
  if (value === 0) return 0
  if (!isFinite(value)) return value

  // For very small numbers, use scientific notation precision
  if (Math.abs(value) < 0.0001) {
    return Number(value.toPrecision(precision))
  }

  // For normal numbers, round to decimal places
  const factor = Math.pow(10, precision)
  return Math.round(value * factor) / factor
}

/**
 * Validate converter inputs
 */
export function validateAreaInputs(
  inputs: Partial<AreaConverterInputs>
): AreaValidation {
  const errors: AreaValidation['errors'] = []

  if (inputs.value === undefined || inputs.value === null) {
    errors.push({ field: 'value', message: 'Value is required' })
  } else if (inputs.value < 0) {
    errors.push({ field: 'value', message: 'Value cannot be negative' })
  } else if (!isFinite(inputs.value)) {
    errors.push({ field: 'value', message: 'Value must be a valid number' })
  } else if (inputs.value > 1e15) {
    errors.push({ field: 'value', message: 'Value exceeds maximum (1e15)' })
  }

  if (!inputs.fromUnit || !AREA_UNITS[inputs.fromUnit]) {
    errors.push({ field: 'fromUnit', message: 'Invalid source unit' })
  }

  if (!inputs.toUnit || !AREA_UNITS[inputs.toUnit]) {
    errors.push({ field: 'toUnit', message: 'Invalid target unit' })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Convert from one unit to square meters
 */
export function toSquareMeters(value: number, fromUnit: AreaUnit): number {
  const unitInfo = AREA_UNITS[fromUnit]
  if (!unitInfo) return 0
  return value * unitInfo.toSquareMeters
}

/**
 * Convert from square meters to another unit
 */
export function fromSquareMeters(squareMeters: number, toUnit: AreaUnit): number {
  const unitInfo = AREA_UNITS[toUnit]
  if (!unitInfo) return 0
  return squareMeters / unitInfo.toSquareMeters
}

/**
 * Convert between any two area units
 */
export function convertArea(inputs: AreaConverterInputs): AreaConversionResult {
  const { value, fromUnit, toUnit } = inputs

  // Handle edge cases
  if (value === 0) {
    return {
      inputValue: 0,
      inputUnit: fromUnit,
      outputValue: 0,
      outputUnit: toUnit,
      valueInSquareMeters: 0,
      formula: `0 ${fromUnit} = 0 ${toUnit}`,
    }
  }

  // Convert to base unit (m2), then to target unit
  const squareMeters = toSquareMeters(value, fromUnit)
  const outputValue = fromSquareMeters(squareMeters, toUnit)

  // Generate formula representation
  const conversionFactor = AREA_UNITS[toUnit].toSquareMeters / AREA_UNITS[fromUnit].toSquareMeters
  const formula = `1 ${fromUnit} = ${roundToPrecision(1 / conversionFactor, 8)} ${toUnit}`

  return {
    inputValue: value,
    inputUnit: fromUnit,
    outputValue: roundToPrecision(outputValue),
    outputUnit: toUnit,
    valueInSquareMeters: roundToPrecision(squareMeters),
    formula,
  }
}

/**
 * Convert to all available units
 */
export function convertToAllUnits(
  value: number,
  fromUnit: AreaUnit
): AreaAllConversions {
  const squareMeters = toSquareMeters(value, fromUnit)

  const conversions = UNIT_ORDER.map((unit) => ({
    unit,
    value: roundToPrecision(fromSquareMeters(squareMeters, unit)),
    system: AREA_UNITS[unit].system,
  }))

  return {
    inputValue: value,
    inputUnit: fromUnit,
    valueInSquareMeters: roundToPrecision(squareMeters),
    conversions,
  }
}

/**
 * Format a number for display with appropriate decimal places
 */
export function formatAreaValue(
  value: number,
  locale: string = 'en-US'
): string {
  if (value === 0) return '0'
  if (!isFinite(value)) return String(value)

  // For very small or very large numbers, use exponential notation
  const absValue = Math.abs(value)
  if (absValue < 0.0001 || absValue >= 1e10) {
    return value.toExponential(6)
  }

  // Determine decimal places based on magnitude
  let decimalPlaces: number
  if (absValue >= 1000) {
    decimalPlaces = 2
  } else if (absValue >= 1) {
    decimalPlaces = 4
  } else if (absValue >= 0.01) {
    decimalPlaces = 6
  } else {
    decimalPlaces = 8
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalPlaces,
  }).format(value)
}

/**
 * Get unit abbreviation for display
 */
export function getUnitAbbreviation(unit: AreaUnit): string {
  const abbreviations: Record<AreaUnit, string> = {
    mm2: 'mm\u00B2',
    cm2: 'cm\u00B2',
    m2: 'm\u00B2',
    km2: 'km\u00B2',
    hectare: 'ha',
    in2: 'in\u00B2',
    ft2: 'ft\u00B2',
    yd2: 'yd\u00B2',
    acre: 'ac',
    mi2: 'mi\u00B2',
  }
  return abbreviations[unit] || unit
}

/**
 * Get common conversions for real estate context
 */
export function getRealEstateConversions(
  squareMeters: number
): Array<{ unit: AreaUnit; value: number; label: string }> {
  return [
    {
      unit: 'm2',
      value: roundToPrecision(fromSquareMeters(squareMeters, 'm2')),
      label: 'Square Meters',
    },
    {
      unit: 'ft2',
      value: roundToPrecision(fromSquareMeters(squareMeters, 'ft2')),
      label: 'Square Feet',
    },
    {
      unit: 'hectare',
      value: roundToPrecision(fromSquareMeters(squareMeters, 'hectare')),
      label: 'Hectares',
    },
    {
      unit: 'acre',
      value: roundToPrecision(fromSquareMeters(squareMeters, 'acre')),
      label: 'Acres',
    },
  ]
}
