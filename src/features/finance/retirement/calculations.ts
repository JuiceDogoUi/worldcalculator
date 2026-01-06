import type {
  RetirementInputs,
  RetirementResult,
  RetirementValidation,
  AccumulationYearProjection,
  RetirementYearProjection,
  AccumulationPhaseSummary,
  RetirementPhaseSummary,
} from './types'

/**
 * Round to cents to avoid floating point precision issues
 */
function roundToCents(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Round to one decimal place (for ages/years)
 */
function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10
}

/**
 * Calculate inflation-adjusted (real) value
 * Converts future value to today's dollars
 */
function calculateRealValue(
  futureValue: number,
  inflationRate: number,
  years: number
): number {
  if (inflationRate === 0 || years <= 0) return futureValue
  const inflationFactor = Math.pow(1 + inflationRate / 100, years)
  return futureValue / inflationFactor
}

/**
 * Calculate future value with regular contributions
 * FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]
 */
function calculateFutureValue(
  presentValue: number,
  monthlyReturn: number,
  months: number,
  monthlyContribution: number
): number {
  if (monthlyReturn === 0) {
    return presentValue + monthlyContribution * months
  }

  const growthFactor = Math.pow(1 + monthlyReturn, months)
  const pvGrowth = presentValue * growthFactor
  const annuityFactor = (growthFactor - 1) / monthlyReturn
  const pmtGrowth = monthlyContribution * annuityFactor

  return pvGrowth + pmtGrowth
}

/**
 * Calculate how many months savings will last with given withdrawals
 */
function calculateSavingsLongevity(
  portfolioValue: number,
  monthlyReturn: number,
  monthlyWithdrawal: number
): number {
  if (monthlyWithdrawal <= 0 || portfolioValue <= 0) return Infinity

  // If no returns, simple division
  if (monthlyReturn === 0) {
    return portfolioValue / monthlyWithdrawal
  }

  // If returns exceed withdrawals, savings never run out
  if (monthlyWithdrawal <= portfolioValue * monthlyReturn) {
    return Infinity
  }

  // n = -log(1 - PV × r / PMT) / log(1 + r)
  const ratio = (portfolioValue * monthlyReturn) / monthlyWithdrawal

  if (ratio >= 1) {
    return Infinity // Savings never run out
  }

  const logNumerator = Math.log(1 - ratio)
  const logDenominator = Math.log(1 + monthlyReturn)

  return -logNumerator / logDenominator
}

/**
 * Validate retirement inputs
 */
export function validateRetirementInputs(
  inputs: Partial<RetirementInputs>
): RetirementValidation {
  const errors: RetirementValidation['errors'] = []

  // Validate current age
  if (inputs.currentAge === undefined || inputs.currentAge < 18) {
    errors.push({
      field: 'currentAge',
      message: 'Current age must be 18 or older',
    })
  } else if (inputs.currentAge > 100) {
    errors.push({
      field: 'currentAge',
      message: 'Current age cannot exceed 100',
    })
  }

  // Validate retirement age
  if (inputs.retirementAge === undefined || inputs.retirementAge < 30) {
    errors.push({
      field: 'retirementAge',
      message: 'Retirement age must be at least 30',
    })
  } else if (inputs.retirementAge > 100) {
    errors.push({
      field: 'retirementAge',
      message: 'Retirement age cannot exceed 100',
    })
  }

  // Retirement age must be greater than current age
  if (
    inputs.currentAge !== undefined &&
    inputs.retirementAge !== undefined &&
    inputs.retirementAge <= inputs.currentAge
  ) {
    errors.push({
      field: 'retirementAge',
      message: 'Retirement age must be greater than current age',
    })
  }

  // Validate life expectancy
  if (inputs.lifeExpectancy === undefined || inputs.lifeExpectancy < 50) {
    errors.push({
      field: 'lifeExpectancy',
      message: 'Life expectancy must be at least 50',
    })
  } else if (inputs.lifeExpectancy > 120) {
    errors.push({
      field: 'lifeExpectancy',
      message: 'Life expectancy cannot exceed 120',
    })
  }

  // Life expectancy must be greater than retirement age
  if (
    inputs.retirementAge !== undefined &&
    inputs.lifeExpectancy !== undefined &&
    inputs.lifeExpectancy <= inputs.retirementAge
  ) {
    errors.push({
      field: 'lifeExpectancy',
      message: 'Life expectancy must be greater than retirement age',
    })
  }

  // Validate current savings
  if (inputs.currentSavings !== undefined && inputs.currentSavings < 0) {
    errors.push({
      field: 'currentSavings',
      message: 'Current savings cannot be negative',
    })
  } else if (
    inputs.currentSavings !== undefined &&
    inputs.currentSavings > 100000000
  ) {
    errors.push({
      field: 'currentSavings',
      message: 'Current savings exceeds maximum (100,000,000)',
    })
  }

  // Validate monthly contribution
  if (
    inputs.monthlyContribution !== undefined &&
    inputs.monthlyContribution < 0
  ) {
    errors.push({
      field: 'monthlyContribution',
      message: 'Monthly contribution cannot be negative',
    })
  } else if (
    inputs.monthlyContribution !== undefined &&
    inputs.monthlyContribution > 100000
  ) {
    errors.push({
      field: 'monthlyContribution',
      message: 'Monthly contribution exceeds maximum (100,000)',
    })
  }

  // Validate pre-retirement return
  if (
    inputs.preRetirementReturn === undefined ||
    inputs.preRetirementReturn < -10
  ) {
    errors.push({
      field: 'preRetirementReturn',
      message: 'Pre-retirement return cannot be less than -10%',
    })
  } else if (inputs.preRetirementReturn > 25) {
    errors.push({
      field: 'preRetirementReturn',
      message: 'Pre-retirement return exceeds realistic maximum (25%)',
    })
  }

  // Validate post-retirement return
  if (
    inputs.postRetirementReturn === undefined ||
    inputs.postRetirementReturn < -10
  ) {
    errors.push({
      field: 'postRetirementReturn',
      message: 'Post-retirement return cannot be less than -10%',
    })
  } else if (inputs.postRetirementReturn > 15) {
    errors.push({
      field: 'postRetirementReturn',
      message: 'Post-retirement return exceeds realistic maximum (15%)',
    })
  }

  // Validate inflation rate
  if (inputs.inflationRate === undefined || inputs.inflationRate < 0) {
    errors.push({
      field: 'inflationRate',
      message: 'Inflation rate cannot be negative',
    })
  } else if (inputs.inflationRate > 20) {
    errors.push({
      field: 'inflationRate',
      message: 'Inflation rate exceeds realistic maximum (20%)',
    })
  }

  // Validate withdrawal rate
  if (inputs.withdrawalRate !== undefined) {
    if (inputs.withdrawalRate <= 0) {
      errors.push({
        field: 'withdrawalRate',
        message: 'Withdrawal rate must be greater than 0%',
      })
    } else if (inputs.withdrawalRate > 15) {
      errors.push({
        field: 'withdrawalRate',
        message: 'Withdrawal rate exceeds recommended maximum (15%)',
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Generate year-by-year accumulation projections using monthly compounding
 * This matches the main calculation approach for consistency
 */
function generateAccumulationProjections(
  currentSavings: number,
  monthlyContribution: number,
  preRetirementReturn: number,
  inflationRate: number,
  currentAge: number,
  retirementAge: number
): AccumulationYearProjection[] {
  const projections: AccumulationYearProjection[] = []
  const yearsToRetirement = retirementAge - currentAge
  const monthlyReturn = preRetirementReturn / 100 / 12
  let balance = currentSavings

  for (let year = 1; year <= yearsToRetirement; year++) {
    const age = currentAge + year
    const startingBalance = balance
    let yearlyGrowth = 0
    const yearlyContributions = monthlyContribution * 12

    // Apply monthly compounding for each month in the year
    for (let month = 0; month < 12; month++) {
      const monthGrowth = balance * monthlyReturn
      yearlyGrowth += monthGrowth
      balance = balance + monthGrowth + monthlyContribution
    }

    const realBalance = calculateRealValue(balance, inflationRate, year)

    projections.push({
      year,
      age,
      startingBalance: roundToCents(startingBalance),
      contributions: roundToCents(yearlyContributions),
      investmentGrowth: roundToCents(yearlyGrowth),
      endingBalance: roundToCents(balance),
      realBalance: roundToCents(realBalance),
    })
  }

  return projections
}

/**
 * Generate year-by-year retirement projections
 */
function generateRetirementProjections(
  retirementBalance: number,
  annualWithdrawal: number,
  postRetirementReturn: number,
  retirementAge: number,
  lifeExpectancy: number
): RetirementYearProjection[] {
  const projections: RetirementYearProjection[] = []
  const yearsInRetirement = lifeExpectancy - retirementAge
  let balance = retirementBalance

  for (let year = 1; year <= yearsInRetirement; year++) {
    const age = retirementAge + year
    const startingBalance = balance

    const isSavingsDepleted = balance <= 0

    if (isSavingsDepleted) {
      projections.push({
        year,
        age,
        startingBalance: 0,
        withdrawals: 0,
        investmentGrowth: 0,
        endingBalance: 0,
        isSavingsDepleted: true,
      })
      continue
    }

    // Calculate actual withdrawal (can't withdraw more than available)
    const actualWithdrawal = Math.min(annualWithdrawal, balance)

    // Calculate growth on remaining balance (after withdrawals)
    // Assuming withdrawals are spread throughout the year
    const avgBalance = balance - actualWithdrawal / 2
    const growth = avgBalance * (postRetirementReturn / 100)

    balance = balance - actualWithdrawal + growth
    balance = Math.max(0, balance) // Can't go negative

    projections.push({
      year,
      age,
      startingBalance: roundToCents(startingBalance),
      withdrawals: roundToCents(actualWithdrawal),
      investmentGrowth: roundToCents(growth),
      endingBalance: roundToCents(balance),
      isSavingsDepleted: balance <= 0,
    })
  }

  return projections
}

/**
 * Calculate key savings milestones
 */
function calculateMilestones(
  currentSavings: number,
  accumulationProjections: AccumulationYearProjection[],
  retirementProjections: RetirementYearProjection[]
): RetirementResult['milestones'] {
  // Initialize milestones - null means "not yet reached" or "already achieved"
  let age100K: number | null = null
  let age500K: number | null = null
  let age1M: number | null = null
  let ageDepletedSavings: number | null = null

  // Check accumulation phase - only track milestones not already reached at start
  for (const proj of accumulationProjections) {
    if (age100K === null && currentSavings < 100000 && proj.endingBalance >= 100000) {
      age100K = proj.age
    }
    if (age500K === null && currentSavings < 500000 && proj.endingBalance >= 500000) {
      age500K = proj.age
    }
    if (age1M === null && currentSavings < 1000000 && proj.endingBalance >= 1000000) {
      age1M = proj.age
    }
  }

  // Check retirement phase for depletion
  for (const proj of retirementProjections) {
    if (ageDepletedSavings === null && proj.isSavingsDepleted) {
      ageDepletedSavings = proj.age
      break
    }
  }

  return {
    age100K,
    age500K,
    age1M,
    ageDepletedSavings,
  }
}

/**
 * Main calculation function for retirement planning
 */
export function calculateRetirement(inputs: RetirementInputs): RetirementResult {
  // Validate inputs before calculation
  const validation = validateRetirementInputs(inputs)
  if (!validation.valid) {
    throw new Error(
      `Invalid retirement inputs: ${validation.errors.map((e) => e.message).join(', ')}`
    )
  }

  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    preRetirementReturn,
    postRetirementReturn,
    inflationRate,
    withdrawalRate,
  } = inputs

  const yearsToRetirement = retirementAge - currentAge
  const yearsInRetirement = lifeExpectancy - retirementAge
  const monthsToRetirement = yearsToRetirement * 12

  // Convert to annual and monthly values
  const annualContribution = monthlyContribution * 12

  // Calculate monthly returns
  const preRetirementMonthlyReturn = preRetirementReturn / 100 / 12

  // Calculate balance at retirement using monthly compounding
  const balanceAtRetirement = calculateFutureValue(
    currentSavings,
    preRetirementMonthlyReturn,
    monthsToRetirement,
    monthlyContribution
  )

  const realBalanceAtRetirement = calculateRealValue(
    balanceAtRetirement,
    inflationRate,
    yearsToRetirement
  )

  // Calculate total contributions
  const totalContributions = currentSavings + annualContribution * yearsToRetirement
  const totalGrowth = balanceAtRetirement - totalContributions

  // Calculate sustainable monthly income using withdrawal rate (e.g., 4% rule)
  const annualWithdrawal = balanceAtRetirement * (withdrawalRate / 100)
  const sustainableMonthlyIncome = annualWithdrawal / 12

  const realMonthlyIncome = calculateRealValue(
    sustainableMonthlyIncome,
    inflationRate,
    yearsToRetirement
  )

  // Calculate savings longevity
  const postRetirementMonthlyReturn = postRetirementReturn / 100 / 12
  const savingsLongevityMonths = calculateSavingsLongevity(
    balanceAtRetirement,
    postRetirementMonthlyReturn,
    sustainableMonthlyIncome
  )
  const savingsLongevityYears =
    savingsLongevityMonths === Infinity ? null : savingsLongevityMonths / 12

  const ageWhenDepleted =
    savingsLongevityYears !== null
      ? retirementAge + savingsLongevityYears
      : null

  const savingsLastsThroughRetirement =
    savingsLongevityYears === null || savingsLongevityYears >= yearsInRetirement

  // Generate projections using monthly compounding
  const accumulationProjections = generateAccumulationProjections(
    currentSavings,
    monthlyContribution,
    preRetirementReturn,
    inflationRate,
    currentAge,
    retirementAge
  )

  const retirementProjections = generateRetirementProjections(
    balanceAtRetirement,
    annualWithdrawal,
    postRetirementReturn,
    retirementAge,
    lifeExpectancy
  )

  // Calculate final balance at life expectancy
  const finalBalance =
    retirementProjections.length > 0
      ? retirementProjections[retirementProjections.length - 1].endingBalance
      : balanceAtRetirement

  // Prepare summaries
  const accumulationSummary: AccumulationPhaseSummary = {
    yearsToRetirement,
    totalContributions: roundToCents(totalContributions),
    totalGrowth: roundToCents(totalGrowth),
    balanceAtRetirement: roundToCents(balanceAtRetirement),
    realBalanceAtRetirement: roundToCents(realBalanceAtRetirement),
  }

  const retirementSummary: RetirementPhaseSummary = {
    yearsInRetirement,
    sustainableMonthlyIncome: roundToCents(sustainableMonthlyIncome),
    realMonthlyIncome: roundToCents(realMonthlyIncome),
    ageWhenDepleted:
      ageWhenDepleted !== null ? roundToOneDecimal(ageWhenDepleted) : null,
    savingsLongevityYears:
      savingsLongevityYears !== null
        ? roundToOneDecimal(savingsLongevityYears)
        : null,
    savingsLastsThroughRetirement,
    finalBalance: roundToCents(finalBalance),
  }

  // Calculate milestones
  const milestones = calculateMilestones(
    currentSavings,
    accumulationProjections,
    retirementProjections
  )

  return {
    accumulationSummary,
    retirementSummary,
    accumulationProjections,
    retirementProjections,
    milestones,
  }
}
