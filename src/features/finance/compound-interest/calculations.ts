import type {
  CompoundInterestInputs,
  CompoundInterestResult,
  YearBreakdown,
  CompoundingFrequency,
  ContributionFrequency,
  CompoundInterestValidation,
} from './types'

/**
 * Round to cents to avoid floating point precision issues
 */
function roundToCents(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Get number of compounding periods per year
 */
function getCompoundingPeriodsPerYear(frequency: CompoundingFrequency): number {
  switch (frequency) {
    case 'annually':
      return 1
    case 'semiannually':
      return 2
    case 'quarterly':
      return 4
    case 'monthly':
      return 12
    case 'daily':
      return 365
    default:
      return 12
  }
}

/**
 * Get number of contribution periods per year
 */
function getContributionPeriodsPerYear(frequency: ContributionFrequency): number {
  switch (frequency) {
    case 'none':
      return 0
    case 'annually':
      return 1
    case 'quarterly':
      return 4
    case 'monthly':
      return 12
    default:
      return 0
  }
}

/**
 * Validate compound interest inputs
 */
export function validateCompoundInterestInputs(
  inputs: Partial<CompoundInterestInputs>
): CompoundInterestValidation {
  const errors: CompoundInterestValidation['errors'] = []

  // Validate principal
  if (inputs.principal === undefined || inputs.principal <= 0) {
    errors.push({
      field: 'principal',
      message: 'Initial investment must be greater than zero',
    })
  } else if (inputs.principal > 100000000) {
    errors.push({
      field: 'principal',
      message: 'Initial investment exceeds maximum (100,000,000)',
    })
  }

  // Validate interest rate
  if (inputs.annualRate === undefined || inputs.annualRate < 0) {
    errors.push({
      field: 'annualRate',
      message: 'Interest rate cannot be negative',
    })
  } else if (inputs.annualRate > 100) {
    errors.push({ field: 'annualRate', message: 'Interest rate exceeds 100%' })
  }

  // Validate time period
  if (inputs.years === undefined || inputs.years <= 0) {
    errors.push({
      field: 'years',
      message: 'Time period must be greater than zero',
    })
  } else if (inputs.years > 100) {
    errors.push({
      field: 'years',
      message: 'Time period exceeds maximum (100 years)',
    })
  }

  // Validate contribution amount if provided
  if (inputs.contributionAmount !== undefined) {
    if (inputs.contributionAmount < 0) {
      errors.push({
        field: 'contributionAmount',
        message: 'Contribution amount cannot be negative',
      })
    } else if (inputs.contributionAmount > 10000000) {
      errors.push({
        field: 'contributionAmount',
        message: 'Contribution amount exceeds maximum (10,000,000)',
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Calculate compound interest with optional regular contributions
 *
 * Formulas:
 * - Without contributions: A = P(1 + r/n)^(nt)
 * - With contributions: A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
 *
 * Where:
 * - A = Final amount
 * - P = Principal (initial investment)
 * - r = Annual interest rate (as decimal)
 * - n = Number of times interest compounds per year
 * - t = Number of years
 * - PMT = Regular contribution amount per period
 */
export function calculateCompoundInterest(
  inputs: CompoundInterestInputs
): CompoundInterestResult {
  const {
    principal,
    annualRate,
    years,
    compoundingFrequency,
    contributionAmount = 0,
    contributionFrequency = 'none',
  } = inputs

  // Get compounding and contribution frequencies
  const n = getCompoundingPeriodsPerYear(compoundingFrequency)
  const contributionsPerYear = getContributionPeriodsPerYear(contributionFrequency)

  // Convert annual rate to decimal
  const r = annualRate / 100

  // Calculate periodic rate
  const periodicRate = r / n

  // Calculate effective annual rate (APY)
  // Formula: APY = (1 + r/n)^n - 1
  const effectiveAnnualRate = roundToCents(
    (Math.pow(1 + periodicRate, n) - 1) * 100
  )

  // Generate year-by-year breakdown
  const yearlyBreakdown: YearBreakdown[] = []
  let currentBalance = principal
  let totalContributions = principal

  for (let year = 1; year <= years; year++) {
    const startingBalance = currentBalance
    let yearlyContributions = 0
    let yearlyInterest = 0

    // Calculate contributions for this year
    if (contributionAmount > 0 && contributionsPerYear > 0) {
      yearlyContributions = contributionAmount * contributionsPerYear
      totalContributions += yearlyContributions
    }

    // Calculate compound interest for the year
    // We need to account for when contributions are made throughout the year
    if (contributionsPerYear === 0 || contributionAmount === 0) {
      // Simple case: no contributions
      const endBalance = currentBalance * Math.pow(1 + periodicRate, n)
      yearlyInterest = endBalance - currentBalance
      currentBalance = endBalance
    } else {
      // With contributions: simulate each compounding period
      // Use accumulated periods to handle non-integer ratios (e.g., daily compounding with monthly contributions)
      const periodsPerContribution = n / contributionsPerYear
      let accumulatedPeriods = 0

      for (let period = 1; period <= n; period++) {
        // Add interest for this period
        const periodInterest = currentBalance * periodicRate
        yearlyInterest += periodInterest
        currentBalance += periodInterest
        accumulatedPeriods++

        // Add contribution when accumulated periods reach threshold
        if (accumulatedPeriods >= periodsPerContribution) {
          currentBalance += contributionAmount
          accumulatedPeriods -= periodsPerContribution
        }
      }
    }

    // Round to cents
    currentBalance = roundToCents(currentBalance)
    yearlyInterest = roundToCents(yearlyInterest)

    yearlyBreakdown.push({
      year,
      startingBalance: roundToCents(startingBalance),
      contributions: roundToCents(yearlyContributions),
      interestEarned: yearlyInterest,
      endingBalance: currentBalance,
    })
  }

  const finalBalance = currentBalance
  const totalInterest = roundToCents(finalBalance - totalContributions)

  return {
    finalBalance: roundToCents(finalBalance),
    totalContributions: roundToCents(totalContributions),
    totalInterest,
    effectiveAnnualRate,
    yearlyBreakdown,
  }
}

/**
 * Calculate the Rule of 72 - approximate years to double investment
 */
export function calculateRuleOf72(annualRate: number): number {
  if (annualRate <= 0) return Infinity
  return roundToCents(72 / annualRate)
}

/**
 * Calculate required interest rate to reach a target
 */
export function calculateRequiredRate(
  principal: number,
  targetAmount: number,
  years: number,
  compoundingFrequency: CompoundingFrequency
): number {
  if (targetAmount <= principal || years <= 0) {
    return 0
  }

  const n = getCompoundingPeriodsPerYear(compoundingFrequency)

  // Formula: r = n * ((A/P)^(1/(n*t)) - 1)
  const rate = n * (Math.pow(targetAmount / principal, 1 / (n * years)) - 1)

  return roundToCents(rate * 100)
}
