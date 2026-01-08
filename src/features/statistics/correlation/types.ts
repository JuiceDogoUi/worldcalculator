/**
 * Correlation Calculator Types
 *
 * Defines interfaces for Pearson correlation coefficient calculations
 * including data points, inputs, results, and validation.
 */

/**
 * Single data point with X and Y coordinates
 */
export interface DataPoint {
  x: number
  y: number
  index: number
}

/**
 * Parsed data for correlation
 */
export interface ParsedCorrelationData {
  dataPoints: DataPoint[]
  xValues: number[]
  yValues: number[]
  count: number
  invalidXValues: string[]
  invalidYValues: string[]
}

/**
 * Input methods for data entry
 */
export type InputMethod = 'pairs' | 'columns'

/**
 * Input interface for correlation calculations
 */
export interface CorrelationInputs {
  // Input method selection
  inputMethod: InputMethod

  // For 'pairs' mode: comma or newline separated X,Y pairs
  pairsInput: string

  // For 'columns' mode: separate X and Y inputs
  xDataInput: string
  yDataInput: string

  // Decimal precision for display (1-6)
  decimalPrecision: number
}

/**
 * Deviation details for each data point (for educational display)
 */
export interface DeviationDetails {
  point: DataPoint
  xDeviation: number // (xi - x_mean)
  yDeviation: number // (yi - y_mean)
  product: number // (xi - x_mean) * (yi - y_mean)
  xSquared: number // (xi - x_mean)^2
  ySquared: number // (yi - y_mean)^2
}

/**
 * Correlation strength interpretation
 */
export type CorrelationStrength =
  | 'perfect_positive'
  | 'strong_positive'
  | 'moderate_positive'
  | 'weak_positive'
  | 'negligible'
  | 'weak_negative'
  | 'moderate_negative'
  | 'strong_negative'
  | 'perfect_negative'

/**
 * Regression line parameters
 */
export interface RegressionLine {
  slope: number
  intercept: number
  equation: string
}

/**
 * Statistical significance result
 */
export interface SignificanceResult {
  tStatistic: number
  degreesOfFreedom: number
  pValueApprox: string // e.g., "< 0.001", "< 0.05", "> 0.05"
  isSignificant: boolean // at alpha = 0.05
}

/**
 * Result interface for correlation calculations
 */
export interface CorrelationResult {
  // Pearson correlation coefficient (r)
  correlationCoefficient: number

  // Coefficient of determination (R²)
  rSquared: number

  // Number of data points
  count: number

  // Interpretation
  strength: CorrelationStrength
  direction: 'positive' | 'negative' | 'none'

  // Statistics for X
  xMean: number
  xStdDev: number

  // Statistics for Y
  yMean: number
  yStdDev: number

  // Covariance
  covariance: number

  // Sum products for formula display
  sumX: number
  sumY: number
  sumXY: number
  sumX2: number
  sumY2: number

  // Sums for deviation formula
  sumXDevYDev: number // Σ(xi - x̄)(yi - ȳ)
  sumXDevSquared: number // Σ(xi - x̄)²
  sumYDevSquared: number // Σ(yi - ȳ)²

  // Regression line (y = mx + b)
  regression: RegressionLine

  // Statistical significance (requires n >= 3)
  significance?: SignificanceResult

  // Deviations for step-by-step display
  deviations: DeviationDetails[]

  // Original data
  dataPoints: DataPoint[]

  // Formula used
  formula: string
}

/**
 * Validation result for correlation inputs
 */
export interface CorrelationValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
  warnings?: {
    field: string
    message: string
  }[]
  parsedData?: ParsedCorrelationData
}

/**
 * Translations interface for the calculator component
 */
export interface CorrelationCalculatorTranslations {
  inputs: {
    inputMethod: string
    pairsMode: string
    pairsModeDescription: string
    columnsMode: string
    columnsModeDescription: string
    pairsInput: string
    pairsInputPlaceholder: string
    pairsInputHelp: string
    xInput: string
    xInputPlaceholder: string
    yInput: string
    yInputPlaceholder: string
    columnsHelp: string
    decimalPrecision: string
  }
  results: {
    correlationCoefficient: string
    rSquared: string
    sampleSize: string
    strength: string
    xMean: string
    yMean: string
    xStdDev: string
    yStdDev: string
    covariance: string
    regression: string
    tStatistic: string
    pValue: string
    significant: string
    notSignificant: string
  }
  strength: {
    perfect_positive: string
    strong_positive: string
    moderate_positive: string
    weak_positive: string
    negligible: string
    weak_negative: string
    moderate_negative: string
    strong_negative: string
    perfect_negative: string
  }
  steps: {
    title: string
    step1: string
    step2: string
    step3: string
    step4: string
    step5: string
    deviationsTable: string
    x: string
    y: string
    xDeviation: string
    yDeviation: string
    product: string
  }
  formula: string
  showSteps: string
  hideSteps: string
  pairsDetected: string
  reset: string
  tryExample: string
  interpretation: string
  rSquaredExplanation: string
}
