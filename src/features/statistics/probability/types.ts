/**
 * Probability Calculator Types
 * Supports single event, compound events (AND/OR), and conditional probability
 */

/**
 * Probability calculation modes
 */
export type ProbabilityMode =
  | 'single'      // P(A) - single event probability
  | 'and'         // P(A and B) - both events occurring
  | 'or'          // P(A or B) - either event occurring
  | 'conditional' // P(A|B) - probability of A given B

/**
 * Whether events are independent or dependent
 */
export type EventRelationship = 'independent' | 'dependent'

/**
 * Probability calculator inputs
 */
export interface ProbabilityInputs {
  mode: ProbabilityMode

  // Single event probability inputs
  favorableOutcomes: number
  totalOutcomes: number

  // Two-event probability inputs
  probabilityA: number       // P(A) as decimal 0-1
  probabilityB: number       // P(B) as decimal 0-1
  relationship: EventRelationship

  // For dependent events (AND)
  probabilityBGivenA?: number  // P(B|A) for dependent AND calculation

  // For OR with dependent events
  probabilityAAndB?: number    // P(A ∩ B) for dependent OR calculation

  // For conditional probability
  probabilityAGivenB?: number  // P(A|B) - can be input or calculated

  // Display precision
  decimalPrecision: number
}

/**
 * Probability calculation result
 */
export interface ProbabilityResult {
  // Main result
  probability: number
  probabilityPercent: number

  // Additional useful outputs
  complementProbability: number      // P(not A) = 1 - P(A)
  complementPercent: number

  // Odds representation
  oddsFor: string      // e.g., "3:7" (odds for the event)
  oddsAgainst: string  // e.g., "7:3" (odds against the event)

  // Fraction representation (if applicable)
  fractionNumerator?: number
  fractionDenominator?: number

  // Calculation steps for educational display
  steps: CalculationStep[]

  // Formula used
  formulaUsed: string
  formulaDescription: string

  // Warnings
  warnings: string[]
}

/**
 * Calculation step for step-by-step display
 */
export interface CalculationStep {
  stepNumber: number
  description: string
  expression: string
  result: string
}

/**
 * Validation result
 */
export interface ProbabilityValidation {
  valid: boolean
  errors: { field: string; message: string }[]
  warnings: { field: string; message: string }[]
}

/**
 * Translation strings used in calculations
 */
export interface CalcTranslations {
  // Step descriptions
  stepIdentifyValues: string
  stepApplyFormula: string
  stepCalculateResult: string
  stepConvertToPercent: string
  stepCalculateComplement: string
  stepCalculateOdds: string

  // Formula descriptions
  formulaSingleEvent: string
  formulaAndIndependent: string
  formulaAndDependent: string
  formulaOrMutuallyExclusive: string
  formulaOrGeneral: string
  formulaConditional: string

  // Value labels
  favorableOutcomes: string
  totalOutcomes: string
  probabilityOfA: string
  probabilityOfB: string
  probabilityOfAAndB: string
  probabilityOfAOrB: string
  probabilityOfAGivenB: string
  probabilityOfBGivenA: string
  result: string
  percent: string
  complement: string
  oddsFor: string
  oddsAgainst: string
}

/**
 * Default input values
 */
export const DEFAULT_PROBABILITY_INPUTS: ProbabilityInputs = {
  mode: 'single',
  favorableOutcomes: 1,
  totalOutcomes: 6,
  probabilityA: 0.5,
  probabilityB: 0.5,
  relationship: 'independent',
  probabilityBGivenA: undefined,
  probabilityAAndB: undefined,
  probabilityAGivenB: undefined,
  decimalPrecision: 4,
}
