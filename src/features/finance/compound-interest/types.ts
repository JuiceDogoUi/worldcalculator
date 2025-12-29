/**
 * Compound Interest Calculator Types
 * Follows World Calculator architecture patterns
 */

/**
 * Compounding frequency options
 */
export type CompoundingFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'daily'

/**
 * Contribution frequency options
 */
export type ContributionFrequency = 'none' | 'monthly' | 'quarterly' | 'annually'

/**
 * Input parameters for compound interest calculation
 */
export interface CompoundInterestInputs {
  principal: number // Initial investment amount
  annualRate: number // Annual interest rate as percentage
  years: number // Time period in years
  compoundingFrequency: CompoundingFrequency // How often interest compounds
  contributionAmount?: number // Regular contribution amount (optional)
  contributionFrequency?: ContributionFrequency // Frequency of contributions
}

/**
 * Breakdown data for a single year
 */
export interface YearBreakdown {
  year: number // Year number
  startingBalance: number // Balance at start of year
  contributions: number // Total contributions during year
  interestEarned: number // Interest earned during year
  endingBalance: number // Balance at end of year
}

/**
 * Complete calculation result
 */
export interface CompoundInterestResult {
  finalBalance: number // Total final balance
  totalContributions: number // Sum of all contributions including principal
  totalInterest: number // Total interest earned
  effectiveAnnualRate: number // Effective annual rate (APY)
  yearlyBreakdown: YearBreakdown[] // Year-by-year breakdown
}

/**
 * Validation result for compound interest inputs
 */
export interface CompoundInterestValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
