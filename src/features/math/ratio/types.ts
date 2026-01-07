/**
 * Ratio calculation modes
 */
export type RatioMode =
  | 'simplify' // Simplify ratio (e.g., 4:8 -> 1:2)
  | 'scale' // Scale ratio (e.g., 1:2 scaled to ?:10 -> 5:10)
  | 'find-missing' // Find missing value (e.g., 2:3 = 4:? -> 6)
  | 'convert' // Convert ratio to fraction/decimal/percentage
  | 'compare' // Compare two ratios

/**
 * Represents a ratio with two terms
 */
export interface Ratio {
  antecedent: number // First term (a in a:b)
  consequent: number // Second term (b in a:b)
}

/**
 * Input interface for ratio calculations
 */
export interface RatioInputs {
  mode: RatioMode

  // Primary ratio (all modes use this)
  ratio: Ratio

  // Scale mode: target value for scaling
  scaleTarget?: {
    position: 'antecedent' | 'consequent' // Which term to scale to
    value: number // Target value
  }

  // Find missing mode: proportion setup (ratio = unknownRatio)
  proportion?: {
    knownValue: number // The known value in second ratio
    knownPosition: 'antecedent' | 'consequent' // Position of known value
  }

  // Compare mode: second ratio for comparison
  compareRatio?: Ratio
}

/**
 * Simplified ratio result
 */
export interface SimplifiedRatio {
  antecedent: number
  consequent: number
  gcd: number // Greatest common divisor used to simplify
  isSimplified: boolean // Whether simplification was applied
}

/**
 * Conversion result formats
 */
export interface RatioConversions {
  ratio: string // e.g., "1:2"
  fraction: string // e.g., "1/2"
  decimal: number // e.g., 0.5
  percentage: number // e.g., 50
  partsNotation: string // e.g., "1 part to 2 parts"
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
 * Result interface for ratio calculations
 */
export interface RatioResult {
  mode: RatioMode

  // The calculated result ratio
  result: SimplifiedRatio

  // Display formats
  ratioDisplay: string // e.g., "1:2"
  fractionDisplay: string // e.g., "1/2"

  // Conversion values
  conversions: RatioConversions

  // Calculation details
  steps: CalculationStep[]
  formula: string
  explanation: string

  // Mode-specific results
  scaledRatio?: SimplifiedRatio // For scale mode
  missingValue?: number // For find-missing mode
  comparisonResult?: {
    // For compare mode
    equal: boolean
    firstGreater: boolean
    secondGreater: boolean
    difference: number // Decimal difference
  }
}

/**
 * Validation result for ratio inputs
 */
export interface RatioValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}

/**
 * Translations for calculation steps and explanations
 */
export interface CalcTranslations {
  originalRatio: string
  findGcd: string
  gcdEquals: string
  divideBothByGcd: string
  simplifyFormula: string
  simplifiedExplanation: string
  alreadySimplest: string
  calculateScaleFactor: string
  multiplyByScaleFactor: string
  scaleFormula: string
  scaledExplanation: string
  setupProportion: string
  crossMultiply: string
  solveForUnknown: string
  proportionFormula: string
  missingExplanation: string
  simplifyFirst: string
  convertToFraction: string
  convertToDecimal: string
  convertToPercentage: string
  convertFormula: string
  convertExplanation: string
  convertFirstRatio: string
  convertSecondRatio: string
  compareDecimals: string
  ratiosAreEqual: string
  differenceIs: string
  compareFormula: string
  equivalentExplanation: string
  greaterExplanation: string
  lessExplanation: string
  firstTerm: string
  secondTerm: string
}
