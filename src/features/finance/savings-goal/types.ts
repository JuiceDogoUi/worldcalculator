/**
 * Savings Goal Calculator Types
 *
 * Supports three calculation modes:
 * 1. Calculate required deposit to reach a goal
 * 2. Calculate time needed to reach a goal
 * 3. Calculate final balance with given deposits
 */

/**
 * Deposit frequency options
 */
export type DepositFrequency =
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'annually'

/**
 * Calculation mode determines what to solve for
 */
export type CalculationMode =
  | 'requiredDeposit' // Given goal, time, rate → find deposit
  | 'timeToGoal' // Given goal, deposit, rate → find time
  | 'finalBalance' // Given deposit, time, rate → find balance

/**
 * Inputs for the savings goal calculator
 */
export interface SavingsGoalInputs {
  /** Target savings amount */
  savingsGoal: number
  /** Current savings / initial deposit */
  currentSavings: number
  /** Annual interest rate as percentage (e.g., 5 for 5%) */
  annualRate: number
  /** How often deposits are made */
  depositFrequency: DepositFrequency
  /** Time period in years */
  years: number
  /** Regular deposit amount (used when solving for time or final balance) */
  depositAmount?: number
  /** What to calculate */
  calculationMode: CalculationMode
}

/**
 * Year-by-year breakdown
 */
export interface YearBreakdown {
  year: number
  startingBalance: number
  yearlyDeposits: number
  interestEarned: number
  endingBalance: number
}

/**
 * Results from the savings goal calculation
 */
export interface SavingsGoalResult {
  /** The calculated value based on mode */
  calculatedValue: number
  /** Label for the calculated value */
  calculatedLabel: 'requiredDeposit' | 'monthsToGoal' | 'finalBalance'
  /** Final balance at end of period */
  finalBalance: number
  /** Total amount deposited (including initial) */
  totalDeposits: number
  /** Total interest earned */
  totalInterest: number
  /** Percentage of final balance from interest */
  interestPercentage: number
  /** Required deposit per period (if calculated) */
  requiredDeposit?: number
  /** Time to reach goal in months (if calculated) */
  monthsToGoal?: number
  /** Time to reach goal in years (if calculated) */
  yearsToGoal?: number
  /** Year-by-year breakdown */
  yearlyBreakdown: YearBreakdown[]
}

/**
 * Validation result
 */
export interface SavingsGoalValidation {
  valid: boolean
  errors: Array<{
    field: string
    message: string
  }>
}
