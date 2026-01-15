/**
 * Speed unit identifiers
 * Each unit can be converted to/from m/s as the base unit
 */
export type SpeedUnit = 'kmh' | 'mph' | 'ms' | 'fts' | 'knots'

/**
 * Speed unit metadata including conversion factor and display info
 */
export interface SpeedUnitInfo {
  id: SpeedUnit
  /** Multiplier to convert TO m/s (base unit) */
  toBaseUnit: number
  /** Default abbreviation for display */
  abbreviation: string
}

/**
 * Speed converter input state
 */
export interface SpeedConverterInputs {
  value: number
  fromUnit: SpeedUnit
  toUnit: SpeedUnit
}

/**
 * Conversion result with contextual examples
 */
export interface SpeedConversionResult {
  inputValue: number
  inputUnit: SpeedUnit
  outputValue: number
  outputUnit: SpeedUnit
  /** All equivalent values for display */
  allConversions: Record<SpeedUnit, number>
}

/**
 * Context example for speed values
 * Helps users understand the speed in real-world terms
 */
export interface SpeedContextExample {
  id: string
  minSpeed: number // in m/s
  maxSpeed: number // in m/s
  translationKey: string
}

/**
 * Validation result for speed inputs
 */
export interface SpeedValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}

/**
 * Speed unit conversion factors to m/s (base unit)
 * All conversions go through m/s for accuracy
 */
export const SPEED_UNITS: Record<SpeedUnit, SpeedUnitInfo> = {
  kmh: {
    id: 'kmh',
    toBaseUnit: 1 / 3.6, // 1 km/h = 1000m / 3600s = 1/3.6 m/s (exact)
    abbreviation: 'km/h',
  },
  mph: {
    id: 'mph',
    toBaseUnit: 0.44704, // 1 mph = 0.44704 m/s
    abbreviation: 'mph',
  },
  ms: {
    id: 'ms',
    toBaseUnit: 1, // Base unit
    abbreviation: 'm/s',
  },
  fts: {
    id: 'fts',
    toBaseUnit: 0.3048, // 1 ft/s = 0.3048 m/s
    abbreviation: 'ft/s',
  },
  knots: {
    id: 'knots',
    toBaseUnit: 1852 / 3600, // 1 knot = 1852/3600 m/s (exact: 0.5144444...)
    abbreviation: 'kn',
  },
}

/**
 * Context examples with speed ranges (in m/s)
 * Used to give users real-world context for their conversions
 */
export const SPEED_CONTEXT_EXAMPLES: SpeedContextExample[] = [
  {
    id: 'walking',
    minSpeed: 1.1, // ~4 km/h
    maxSpeed: 1.8, // ~6.5 km/h
    translationKey: 'contexts.walking',
  },
  {
    id: 'running',
    minSpeed: 2.5, // ~9 km/h
    maxSpeed: 5.5, // ~20 km/h
    translationKey: 'contexts.running',
  },
  {
    id: 'cycling',
    minSpeed: 4.2, // ~15 km/h
    maxSpeed: 8.3, // ~30 km/h
    translationKey: 'contexts.cycling',
  },
  {
    id: 'cityDriving',
    minSpeed: 8.3, // ~30 km/h
    maxSpeed: 13.9, // ~50 km/h
    translationKey: 'contexts.cityDriving',
  },
  {
    id: 'highwayDriving',
    minSpeed: 25, // ~90 km/h
    maxSpeed: 36.1, // ~130 km/h
    translationKey: 'contexts.highwayDriving',
  },
  {
    id: 'lightWind',
    minSpeed: 0.3, // ~1 km/h
    maxSpeed: 5.4, // ~19 km/h (Beaufort 1-3)
    translationKey: 'contexts.lightWind',
  },
  {
    id: 'strongWind',
    minSpeed: 10.8, // ~39 km/h (Beaufort 6)
    maxSpeed: 17.1, // ~62 km/h (Beaufort 7)
    translationKey: 'contexts.strongWind',
  },
  {
    id: 'commercialAircraft',
    minSpeed: 222, // ~800 km/h
    maxSpeed: 278, // ~1000 km/h
    translationKey: 'contexts.commercialAircraft',
  },
  {
    id: 'fastTrain',
    minSpeed: 69.4, // ~250 km/h
    maxSpeed: 97.2, // ~350 km/h
    translationKey: 'contexts.fastTrain',
  },
  {
    id: 'speedOfSound',
    minSpeed: 340, // ~1224 km/h at sea level
    maxSpeed: 343,
    translationKey: 'contexts.speedOfSound',
  },
]
