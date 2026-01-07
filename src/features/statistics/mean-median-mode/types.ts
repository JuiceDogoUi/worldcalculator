/**
 * Mean type options
 */
export type MeanType = 'arithmetic' | 'geometric' | 'harmonic' | 'weighted'

/**
 * Mode type classification
 */
export type ModeType = 'no-mode' | 'unimodal' | 'bimodal' | 'multimodal'

/**
 * Input interface for central tendency calculations
 */
export interface CentralTendencyInputs {
  // Raw data input as string (comma, space, or newline separated)
  dataInput: string

  // Optional weights input for weighted mean (same format as dataInput)
  weightsInput?: string

  // Type of mean to calculate
  meanType: MeanType

  // Decimal precision for results (1-6)
  decimalPrecision: number
}

/**
 * Parsed and validated data
 */
export interface ParsedData {
  values: number[]
  invalidValues: string[]
  count: number
}

/**
 * Frequency item for mode calculation
 */
export interface FrequencyItem {
  value: number
  frequency: number
  percentage: number
  isMode: boolean
}

/**
 * Mode calculation result with details
 */
export interface ModeResult {
  type: ModeType
  values: number[] // Mode values (empty if no mode)
  frequency: number // Frequency of mode values
  frequencyDistribution: FrequencyItem[]
}

/**
 * Median calculation details
 */
export interface MedianDetails {
  value: number
  position: string // e.g., "5th value" or "average of 5th and 6th"
  middleIndices: number[] // 0-based indices of middle values
  middleValues: number[] // The actual middle values
  sortedValues: number[]
  isInterpolated: boolean // Whether median is average of two values
}

/**
 * Mean calculation details with all types
 */
export interface MeanDetails {
  arithmetic: number | null
  geometric: number | null // null if any value is non-positive
  harmonic: number | null // null if any value is zero or negative
  weighted: number | null // null if weights not provided
  sum: number
  count: number
  formula: string
  weightSum?: number
  weightedSum?: number
}

/**
 * Quartile values
 */
export interface QuartileResult {
  q1: number
  q2: number // Same as median
  q3: number
  iqr: number // Interquartile range (Q3 - Q1)
  min: number
  max: number
}

/**
 * Calculation step for educational display
 */
export interface CalculationStep {
  stepNumber: number
  description: string
  expression: string
  result?: string
}

/**
 * Complete result interface for central tendency calculations
 */
export interface CentralTendencyResult {
  // Primary results
  mean: MeanDetails
  median: MedianDetails
  mode: ModeResult

  // Selected mean value based on meanType
  selectedMean: number | null
  selectedMeanType: MeanType

  // Additional statistics
  count: number
  sum: number
  range: number
  min: number
  max: number
  variance: number
  standardDeviation: number
  quartiles: QuartileResult

  // Original values
  values: number[]
  weights?: number[]

  // Step-by-step calculations
  meanSteps: CalculationStep[]
  medianSteps: CalculationStep[]
  modeSteps: CalculationStep[]

  // Warnings for edge cases
  warnings: string[]
}

/**
 * Validation result for central tendency inputs
 */
export interface CentralTendencyValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
  warnings?: {
    field: string
    message: string
  }[]
  parsedData?: ParsedData
  parsedWeights?: ParsedData
}

/**
 * Translations for calculation descriptions
 */
export interface CalcTranslations {
  // Mean translations
  sumAllValues: string
  divideByCount: string
  arithmeticFormula: string
  multiplyAllValues: string
  takeNthRoot: string
  geometricFormula: string
  sumReciprocals: string
  divideCountBySum: string
  harmonicFormula: string
  multiplyValuesByWeights: string
  sumWeightedValues: string
  divideByWeightSum: string
  weightedFormula: string
  cannotCalculateGeometric: string
  cannotCalculateHarmonic: string

  // Median translations
  sortValues: string
  findMiddlePosition: string
  middleValueIs: string
  averageMiddleValues: string
  medianFormula: string
  sortedValuesAre: string

  // Mode translations
  countFrequencies: string
  findHighestFrequency: string
  identifyModeValues: string
  noModeAllEqual: string
  noModeAllDifferent: string
  unimodalResult: string
  bimodalResult: string
  multimodalResult: string
  modeFormula: string
  frequencyOf: string
  appearsNTimes: string

  // General
  valueLabel: string
  frequencyLabel: string
  percentageLabel: string
}
