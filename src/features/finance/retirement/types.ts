/**
 * Retirement Calculator Types
 *
 * Comprehensive retirement planning calculator that helps users:
 * 1. Calculate projected retirement savings at retirement age
 * 2. Determine monthly retirement income from accumulated savings
 * 3. Analyze savings gap to meet desired retirement income
 * 4. Project how long savings will last in retirement
 */

/**
 * Core inputs for the retirement calculator
 */
export interface RetirementInputs {
  /** Current age of the user */
  currentAge: number
  /** Target retirement age */
  retirementAge: number
  /** Life expectancy for withdrawal planning */
  lifeExpectancy: number
  /** Current retirement savings balance */
  currentSavings: number
  /** Monthly contribution to retirement savings */
  monthlyContribution: number
  /** Expected annual rate of return before retirement (as percentage, e.g., 7 for 7%) */
  preRetirementReturn: number
  /** Expected annual rate of return during retirement (as percentage, typically lower) */
  postRetirementReturn: number
  /** Expected annual inflation rate (as percentage) */
  inflationRate: number
  /** Withdrawal rate during retirement (as percentage, e.g., 4 for 4% rule) */
  withdrawalRate: number
}

/**
 * Year-by-year projection during accumulation phase (before retirement)
 */
export interface AccumulationYearProjection {
  year: number
  age: number
  startingBalance: number
  contributions: number
  investmentGrowth: number
  endingBalance: number
  /** Balance in today's dollars (inflation-adjusted) */
  realBalance: number
}

/**
 * Year-by-year projection during retirement phase (after retirement)
 */
export interface RetirementYearProjection {
  year: number
  age: number
  startingBalance: number
  withdrawals: number
  investmentGrowth: number
  endingBalance: number
  /** Flag if savings depleted */
  isSavingsDepleted: boolean
}

/**
 * Summary of the accumulation phase
 */
export interface AccumulationPhaseSummary {
  /** Years until retirement */
  yearsToRetirement: number
  /** Total contributions made */
  totalContributions: number
  /** Total investment growth (interest/returns) */
  totalGrowth: number
  /** Final balance at retirement age */
  balanceAtRetirement: number
  /** Balance at retirement in today's dollars */
  realBalanceAtRetirement: number
}

/**
 * Summary of the retirement/withdrawal phase
 */
export interface RetirementPhaseSummary {
  /** Years in retirement */
  yearsInRetirement: number
  /** Sustainable monthly income using withdrawal rate */
  sustainableMonthlyIncome: number
  /** Monthly income in today's dollars */
  realMonthlyIncome: number
  /** Age when savings run out (null if never) */
  ageWhenDepleted: number | null
  /** Years savings will last */
  savingsLongevityYears: number | null
  /** Whether savings last through life expectancy */
  savingsLastsThroughRetirement: boolean
  /** Final balance at life expectancy (could be 0 or positive) */
  finalBalance: number
}

/**
 * Complete result from the retirement calculation
 */
export interface RetirementResult {
  /** Accumulation phase summary */
  accumulationSummary: AccumulationPhaseSummary

  /** Retirement phase summary */
  retirementSummary: RetirementPhaseSummary

  /** Year-by-year accumulation phase projections */
  accumulationProjections: AccumulationYearProjection[]

  /** Year-by-year retirement phase projections */
  retirementProjections: RetirementYearProjection[]

  /** Key milestone ages */
  milestones: {
    /** Age when savings first reaches $100K (null if never/already there) */
    age100K: number | null
    /** Age when savings first reaches $500K */
    age500K: number | null
    /** Age when savings first reaches $1M */
    age1M: number | null
    /** Age when savings run out (null if never) */
    ageDepletedSavings: number | null
  }
}

/**
 * Validation result for retirement inputs
 */
export interface RetirementValidation {
  valid: boolean
  errors: Array<{
    field: string
    message: string
  }>
}
