import type {
  VolumeUnit,
  VolumeUnitInfo,
  VolumeConversionInputs,
  VolumeConversionResult,
  AllVolumeConversions,
  VolumeValidation,
  MeasurementSystem,
} from './types'

/**
 * Volume unit definitions with conversion factors to liters (base unit)
 *
 * Conversion factors sourced from:
 * - NIST Handbook 44 (US customary units)
 * - UK Weights and Measures Act 1985 (UK imperial units)
 * - International System of Units (metric)
 */
export const VOLUME_UNITS: Record<VolumeUnit, VolumeUnitInfo> = {
  // Metric units
  'milliliter': {
    id: 'milliliter',
    system: 'metric',
    toLiters: 0.001,
    abbreviation: 'mL',
  },
  'liter': {
    id: 'liter',
    system: 'metric',
    toLiters: 1,
    abbreviation: 'L',
  },
  'cubic-meter': {
    id: 'cubic-meter',
    system: 'metric',
    toLiters: 1000,
    abbreviation: 'm³',
  },

  // US Imperial units
  'teaspoon-us': {
    id: 'teaspoon-us',
    system: 'us-imperial',
    toLiters: 0.00492892,
    abbreviation: 'tsp',
  },
  'tablespoon-us': {
    id: 'tablespoon-us',
    system: 'us-imperial',
    toLiters: 0.0147868,
    abbreviation: 'tbsp',
  },
  'fluid-ounce-us': {
    id: 'fluid-ounce-us',
    system: 'us-imperial',
    toLiters: 0.0295735,
    abbreviation: 'fl oz (US)',
  },
  'cup-us': {
    id: 'cup-us',
    system: 'us-imperial',
    toLiters: 0.236588,
    abbreviation: 'cup (US)',
  },
  'pint-us': {
    id: 'pint-us',
    system: 'us-imperial',
    toLiters: 0.473176,
    abbreviation: 'pt (US)',
  },
  'quart-us': {
    id: 'quart-us',
    system: 'us-imperial',
    toLiters: 0.946353,
    abbreviation: 'qt (US)',
  },
  'gallon-us': {
    id: 'gallon-us',
    system: 'us-imperial',
    toLiters: 3.78541,
    abbreviation: 'gal (US)',
  },

  // UK Imperial units
  'fluid-ounce-uk': {
    id: 'fluid-ounce-uk',
    system: 'uk-imperial',
    toLiters: 0.0284131,
    abbreviation: 'fl oz (UK)',
  },
  'pint-uk': {
    id: 'pint-uk',
    system: 'uk-imperial',
    toLiters: 0.568261,
    abbreviation: 'pt (UK)',
  },
  'quart-uk': {
    id: 'quart-uk',
    system: 'uk-imperial',
    toLiters: 1.13652,
    abbreviation: 'qt (UK)',
  },
  'gallon-uk': {
    id: 'gallon-uk',
    system: 'uk-imperial',
    toLiters: 4.54609,
    abbreviation: 'gal (UK)',
  },

  // Other common units
  'cubic-inch': {
    id: 'cubic-inch',
    system: 'other',
    toLiters: 0.0163871,
    abbreviation: 'in³',
  },
  'cubic-foot': {
    id: 'cubic-foot',
    system: 'other',
    toLiters: 28.3168,
    abbreviation: 'ft³',
  },
}

/**
 * Get all volume units as an array
 */
export function getAllVolumeUnits(): VolumeUnitInfo[] {
  return Object.values(VOLUME_UNITS)
}

/**
 * Get volume units by measurement system
 */
export function getVolumeUnitsBySystem(system: MeasurementSystem): VolumeUnitInfo[] {
  return Object.values(VOLUME_UNITS).filter((unit) => unit.system === system)
}

/**
 * Get unit info by ID
 */
export function getVolumeUnitInfo(unitId: VolumeUnit): VolumeUnitInfo {
  return VOLUME_UNITS[unitId]
}

/**
 * Round to specified decimal places with precision handling
 */
function roundToDecimals(value: number, decimals: number = 6): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Convert a value from one unit to liters (base unit)
 */
export function convertToLiters(value: number, fromUnit: VolumeUnit): number {
  const unitInfo = VOLUME_UNITS[fromUnit]
  return roundToDecimals(value * unitInfo.toLiters)
}

/**
 * Convert a value from liters to another unit
 */
export function convertFromLiters(liters: number, toUnit: VolumeUnit): number {
  const unitInfo = VOLUME_UNITS[toUnit]
  return roundToDecimals(liters / unitInfo.toLiters)
}

/**
 * Convert between any two volume units
 */
export function convertVolume(inputs: VolumeConversionInputs): VolumeConversionResult {
  const { value, fromUnit, toUnit } = inputs

  // Convert to liters first (base unit)
  const litersValue = convertToLiters(value, fromUnit)

  // Then convert from liters to target unit
  const outputValue = convertFromLiters(litersValue, toUnit)

  return {
    inputValue: value,
    inputUnit: fromUnit,
    outputValue,
    outputUnit: toUnit,
    litersValue,
  }
}

/**
 * Get all conversions for a given input value
 */
export function convertToAllUnits(value: number, fromUnit: VolumeUnit): AllVolumeConversions {
  const litersValue = convertToLiters(value, fromUnit)

  const conversions: Partial<Record<VolumeUnit, number>> = {}

  for (const unitId of Object.keys(VOLUME_UNITS) as VolumeUnit[]) {
    conversions[unitId] = convertFromLiters(litersValue, unitId)
  }

  return {
    inputValue: value,
    inputUnit: fromUnit,
    litersValue,
    conversions: conversions as Record<VolumeUnit, number>,
  }
}

/**
 * Validate conversion inputs
 */
export function validateVolumeInputs(
  value: number | undefined | null,
  fromUnit: VolumeUnit | undefined | null,
  toUnit: VolumeUnit | undefined | null
): VolumeValidation {
  const errors: VolumeValidation['errors'] = []

  if (value === undefined || value === null || isNaN(value)) {
    errors.push({ field: 'value', message: 'Please enter a valid number' })
  } else if (value < 0) {
    errors.push({ field: 'value', message: 'Value cannot be negative' })
  } else if (value > 1e15) {
    errors.push({ field: 'value', message: 'Value is too large' })
  }

  if (!fromUnit || !VOLUME_UNITS[fromUnit]) {
    errors.push({ field: 'fromUnit', message: 'Please select a valid source unit' })
  }

  if (!toUnit || !VOLUME_UNITS[toUnit]) {
    errors.push({ field: 'toUnit', message: 'Please select a valid target unit' })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Format a volume value for display with appropriate precision
 * Uses fewer decimal places for larger numbers
 */
export function formatVolumeValue(value: number): string {
  if (value === 0) return '0'

  const absValue = Math.abs(value)

  let decimals: number
  if (absValue >= 1000) {
    decimals = 2
  } else if (absValue >= 1) {
    decimals = 4
  } else if (absValue >= 0.001) {
    decimals = 6
  } else {
    decimals = 8
  }

  // Format with appropriate decimals and remove trailing zeros
  return value.toFixed(decimals).replace(/\.?0+$/, '')
}

/**
 * Get common conversion pairs for quick selection
 */
export function getCommonConversions(): Array<{ from: VolumeUnit; to: VolumeUnit; label: string }> {
  return [
    { from: 'liter', to: 'gallon-us', label: 'Liters to US Gallons' },
    { from: 'gallon-us', to: 'liter', label: 'US Gallons to Liters' },
    { from: 'milliliter', to: 'fluid-ounce-us', label: 'mL to US Fluid Ounces' },
    { from: 'cup-us', to: 'milliliter', label: 'US Cups to mL' },
    { from: 'gallon-us', to: 'gallon-uk', label: 'US Gallons to UK Gallons' },
    { from: 'pint-us', to: 'pint-uk', label: 'US Pints to UK Pints' },
    { from: 'liter', to: 'cubic-meter', label: 'Liters to Cubic Meters' },
    { from: 'cubic-foot', to: 'liter', label: 'Cubic Feet to Liters' },
  ]
}
