import type {
  SavingsGoalInputs,
  SavingsGoalResult,
  YearBreakdown,
  DepositFrequency,
  SavingsGoalValidation,
} from './types'

/**
 * Round to cents to avoid floating point precision issues
 */
function roundToCents(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Get number of deposit periods per year
 */
function getDepositsPerYear(frequency: DepositFrequency): number {
  switch (frequency) {
    case 'weekly':
      return 52
    case 'biweekly':
      return 26
    case 'monthly':
      return 12
    case 'quarterly':
      return 4
    case 'annually':
      return 1
    default:
      return 12
  }
}

/**
 * Validate savings goal inputs
 */
export function validateSavingsGoalInputs(
  inputs: Partial<SavingsGoalInputs>
): SavingsGoalValidation {
  const errors: SavingsGoalValidation['errors'] = []

  // Validate savings goal
  if (inputs.calculationMode !== 'finalBalance') {
    if (inputs.savingsGoal === undefined || inputs.savingsGoal <= 0) {
      errors.push({
        field: 'savingsGoal',
        message: 'Savings goal must be greater than zero',
      })
    } else if (inputs.savingsGoal > 100000000) {
      errors.push({
        field: 'savingsGoal',
        message: 'Savings goal exceeds maximum (100,000,000)',
      })
    }
  }

  // Validate current savings
  if (inputs.currentSavings !== undefined && inputs.currentSavings < 0) {
    errors.push({
      field: 'currentSavings',
      message: 'Current savings cannot be negative',
    })
  }

  // Validate annual rate
  if (inputs.annualRate === undefined || inputs.annualRate < 0) {
    errors.push({
      field: 'annualRate',
      message: 'Interest rate cannot be negative',
    })
  } else if (inputs.annualRate > 50) {
    errors.push({
      field: 'annualRate',
      message: 'Interest rate exceeds realistic maximum (50%)',
    })
  }

  // Validate time period (for modes that need it)
  if (inputs.calculationMode !== 'timeToGoal') {
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
  }

  // Validate deposit amount (for modes that need it)
  if (
    inputs.calculationMode === 'timeToGoal' ||
    inputs.calculationMode === 'finalBalance'
  ) {
    if (inputs.depositAmount === undefined || inputs.depositAmount <= 0) {
      errors.push({
        field: 'depositAmount',
        message: 'Deposit amount must be greater than zero',
      })
    } else if (inputs.depositAmount > 10000000) {
      errors.push({
        field: 'depositAmount',
        message: 'Deposit amount exceeds maximum (10,000,000)',
      })
    }
  }

  // Validate that goal is reachable (for timeToGoal mode)
  if (inputs.calculationMode === 'timeToGoal') {
    const currentSavings = inputs.currentSavings || 0
    if (currentSavings >= (inputs.savingsGoal || 0)) {
      errors.push({
        field: 'savingsGoal',
        message: 'You have already reached your savings goal',
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Calculate Future Value with regular deposits
 * FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]
 */
function calculateFutureValue(
  presentValue: number,
  periodicRate: number,
  periods: number,
  payment: number
): number {
  if (periodicRate === 0) {
    // Simple case: no interest
    return presentValue + payment * periods
  }

  const growthFactor = Math.pow(1 + periodicRate, periods)
  const pvGrowth = presentValue * growthFactor
  const annuityFactor = (growthFactor - 1) / periodicRate
  const pmtGrowth = payment * annuityFactor

  return pvGrowth + pmtGrowth
}

/**
 * Calculate required periodic payment to reach a goal
 * PMT = (FV - PV × (1 + r)^n) × r / ((1 + r)^n - 1)
 */
function calculateRequiredPayment(
  futureValue: number,
  presentValue: number,
  periodicRate: number,
  periods: number
): number {
  if (periodicRate === 0) {
    // Simple case: no interest
    return (futureValue - presentValue) / periods
  }

  const growthFactor = Math.pow(1 + periodicRate, periods)
  const pvGrowth = presentValue * growthFactor
  const remaining = futureValue - pvGrowth

  if (remaining <= 0) {
    // Initial savings will grow to meet the goal without additional deposits
    return 0
  }

  const annuityFactor = (growthFactor - 1) / periodicRate
  return remaining / annuityFactor
}

/**
 * Calculate time needed to reach a goal (in periods)
 * Using logarithmic formula: n = log((FV × r + PMT) / (PV × r + PMT)) / log(1 + r)
 */
function calculateTimeToGoal(
  futureValue: number,
  presentValue: number,
  periodicRate: number,
  payment: number
): number {
  if (periodicRate === 0) {
    // Simple case: no interest
    if (payment <= 0) return Infinity
    return (futureValue - presentValue) / payment
  }

  // Check if goal is unreachable (no payment and no starting value)
  if (payment <= 0 && presentValue <= 0) return Infinity

  // Using the formula: n = log((FV × r + PMT) / (PV × r + PMT)) / log(1 + r)
  const numerator = futureValue * periodicRate + payment
  const denominator = presentValue * periodicRate + payment

  if (denominator <= 0 || numerator <= 0 || numerator <= denominator) {
    // Goal cannot be reached with these parameters
    return Infinity
  }

  return Math.log(numerator / denominator) / Math.log(1 + periodicRate)
}

/**
 * Generate year-by-year breakdown
 */
function generateYearlyBreakdown(
  initialSavings: number,
  annualRate: number,
  depositAmount: number,
  depositsPerYear: number,
  totalYears: number
): YearBreakdown[] {
  const breakdown: YearBreakdown[] = []
  let currentBalance = initialSavings
  const periodicRate = annualRate / 100 / depositsPerYear

  for (let year = 1; year <= totalYears; year++) {
    const startingBalance = currentBalance
    let yearlyDeposits = 0
    let yearlyInterest = 0

    // Simulate each deposit period within the year
    for (let period = 0; period < depositsPerYear; period++) {
      // Add interest for this period
      const periodInterest = currentBalance * periodicRate
      yearlyInterest += periodInterest
      currentBalance += periodInterest

      // Add deposit
      currentBalance += depositAmount
      yearlyDeposits += depositAmount
    }

    breakdown.push({
      year,
      startingBalance: roundToCents(startingBalance),
      yearlyDeposits: roundToCents(yearlyDeposits),
      interestEarned: roundToCents(yearlyInterest),
      endingBalance: roundToCents(currentBalance),
    })
  }

  return breakdown
}

/**
 * Main calculation function for savings goal
 */
export function calculateSavingsGoal(
  inputs: SavingsGoalInputs
): SavingsGoalResult {
  const {
    savingsGoal,
    currentSavings,
    annualRate,
    depositFrequency,
    years,
    depositAmount = 0,
    calculationMode,
  } = inputs

  const depositsPerYear = getDepositsPerYear(depositFrequency)
  const periodicRate = annualRate / 100 / depositsPerYear
  const totalPeriods = years * depositsPerYear

  let result: SavingsGoalResult

  switch (calculationMode) {
    case 'requiredDeposit': {
      // Calculate the required deposit to reach the goal
      const requiredDeposit = calculateRequiredPayment(
        savingsGoal,
        currentSavings,
        periodicRate,
        totalPeriods
      )

      const finalBalance = calculateFutureValue(
        currentSavings,
        periodicRate,
        totalPeriods,
        requiredDeposit
      )

      const totalDeposits = currentSavings + requiredDeposit * totalPeriods
      const totalInterest = finalBalance - totalDeposits

      const yearlyBreakdown = generateYearlyBreakdown(
        currentSavings,
        annualRate,
        requiredDeposit,
        depositsPerYear,
        years
      )

      result = {
        calculatedValue: roundToCents(requiredDeposit),
        calculatedLabel: 'requiredDeposit',
        finalBalance: roundToCents(finalBalance),
        totalDeposits: roundToCents(totalDeposits),
        totalInterest: roundToCents(totalInterest),
        interestPercentage:
          finalBalance > 0
            ? roundToCents((totalInterest / finalBalance) * 100)
            : 0,
        requiredDeposit: roundToCents(requiredDeposit),
        yearlyBreakdown,
      }
      break
    }

    case 'timeToGoal': {
      // Calculate time needed to reach the goal
      const periodsToGoal = calculateTimeToGoal(
        savingsGoal,
        currentSavings,
        periodicRate,
        depositAmount
      )

      const monthsToGoal = Math.ceil(periodsToGoal / depositsPerYear * 12)
      const yearsToGoal = periodsToGoal / depositsPerYear

      // Calculate final balance at the goal time
      const actualPeriods = Math.ceil(periodsToGoal)
      const finalBalance = calculateFutureValue(
        currentSavings,
        periodicRate,
        actualPeriods,
        depositAmount
      )

      const totalDeposits = currentSavings + depositAmount * actualPeriods
      const totalInterest = finalBalance - totalDeposits

      // Generate breakdown for the calculated time (max 100 years)
      const breakdownYears = Math.min(Math.ceil(yearsToGoal), 100)
      const yearlyBreakdown = generateYearlyBreakdown(
        currentSavings,
        annualRate,
        depositAmount,
        depositsPerYear,
        breakdownYears
      )

      result = {
        calculatedValue: monthsToGoal,
        calculatedLabel: 'monthsToGoal',
        finalBalance: roundToCents(finalBalance),
        totalDeposits: roundToCents(totalDeposits),
        totalInterest: roundToCents(totalInterest),
        interestPercentage:
          finalBalance > 0
            ? roundToCents((totalInterest / finalBalance) * 100)
            : 0,
        monthsToGoal,
        yearsToGoal: roundToCents(yearsToGoal),
        yearlyBreakdown,
      }
      break
    }

    case 'finalBalance':
    default: {
      // Calculate final balance with given deposits
      const finalBalance = calculateFutureValue(
        currentSavings,
        periodicRate,
        totalPeriods,
        depositAmount
      )

      const totalDeposits = currentSavings + depositAmount * totalPeriods
      const totalInterest = finalBalance - totalDeposits

      const yearlyBreakdown = generateYearlyBreakdown(
        currentSavings,
        annualRate,
        depositAmount,
        depositsPerYear,
        years
      )

      result = {
        calculatedValue: roundToCents(finalBalance),
        calculatedLabel: 'finalBalance',
        finalBalance: roundToCents(finalBalance),
        totalDeposits: roundToCents(totalDeposits),
        totalInterest: roundToCents(totalInterest),
        interestPercentage:
          finalBalance > 0
            ? roundToCents((totalInterest / finalBalance) * 100)
            : 0,
        yearlyBreakdown,
      }
      break
    }
  }

  return result
}

/**
 * Convert deposit amount between frequencies
 */
export function convertDepositFrequency(
  amount: number,
  fromFrequency: DepositFrequency,
  toFrequency: DepositFrequency
): number {
  const fromPerYear = getDepositsPerYear(fromFrequency)
  const toPerYear = getDepositsPerYear(toFrequency)
  return roundToCents((amount * fromPerYear) / toPerYear)
}
