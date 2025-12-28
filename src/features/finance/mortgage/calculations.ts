import type {
  MortgageInputs,
  MortgageResult,
  AmortizationScheduleEntry,
  MonthlyPaymentBreakdown,
  PaymentFrequency,
  MortgageValidation,
  DownPaymentType,
} from './types'

/**
 * Round to cents for financial precision
 */
function roundToCents(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Get periods per year based on payment frequency
 */
function getPeriodsPerYear(frequency: PaymentFrequency): number {
  switch (frequency) {
    case 'weekly':
      return 365 / 7 // 52.142857
    case 'biweekly':
      return 365 / 14 // 26.071428
    default:
      return 12
  }
}

/**
 * Calculate down payment amount based on type
 */
export function calculateDownPayment(
  homePrice: number,
  downPaymentType: DownPaymentType,
  downPaymentPercentage: number,
  downPaymentAmount: number
): { amount: number; percentage: number } {
  if (downPaymentType === 'amount') {
    return {
      amount: downPaymentAmount,
      percentage: (downPaymentAmount / homePrice) * 100,
    }
  } else {
    return {
      amount: (homePrice * downPaymentPercentage) / 100,
      percentage: downPaymentPercentage,
    }
  }
}

/**
 * Determine if PMI is required (down payment < 20%)
 */
export function isPmiRequired(downPaymentPercentage: number): boolean {
  return downPaymentPercentage < 20
}

/**
 * Calculate monthly PMI amount
 * Typical PMI rates: 0.3% - 1.5% annually of loan amount
 */
export function calculateMonthlyPmi(
  loanAmount: number,
  pmiRate: number
): number {
  if (pmiRate <= 0) return 0
  return roundToCents((loanAmount * (pmiRate / 100)) / 12)
}

/**
 * Calculate period when PMI can be removed (80% LTV reached)
 */
export function calculatePmiRemovalPeriod(
  homePrice: number,
  loanAmount: number,
  periodicPayment: number,
  interestRate: number,
  periodsPerYear: number
): number | undefined {
  const targetBalance = homePrice * 0.8 // 80% LTV
  const periodicRate = interestRate / 100 / periodsPerYear

  let balance = loanAmount
  let period = 0
  const maxPeriods = 360 // Safety limit

  while (balance > targetBalance && period < maxPeriods) {
    const interestPayment = balance * periodicRate
    const principalPayment = periodicPayment - interestPayment
    balance -= principalPayment
    period++
  }

  return period < maxPeriods ? period : undefined
}

/**
 * Calculate periodic payment amount (P&I only)
 * Standard amortization formula
 */
export function calculatePeriodicPayment(
  principal: number,
  annualRate: number,
  totalPeriods: number,
  periodsPerYear: number
): number {
  if (principal <= 0 || totalPeriods <= 0) return 0

  // Handle 0% interest rate edge case
  if (annualRate === 0) {
    return principal / totalPeriods
  }

  const periodicRate = annualRate / 100 / periodsPerYear
  const numerator = periodicRate * Math.pow(1 + periodicRate, totalPeriods)
  const denominator = Math.pow(1 + periodicRate, totalPeriods) - 1

  return principal * (numerator / denominator)
}

/**
 * Generate complete amortization schedule
 */
export function generateAmortizationSchedule(
  loanAmount: number,
  annualRate: number,
  totalPeriods: number,
  periodsPerYear: number,
  periodicPayment: number,
  monthlyPmi: number,
  pmiRemovalPeriod?: number
): AmortizationScheduleEntry[] {
  const schedule: AmortizationScheduleEntry[] = []
  let balance = loanAmount
  let cumulativePrincipal = 0
  let cumulativeInterest = 0
  const periodicRate = annualRate / 100 / periodsPerYear

  for (let period = 1; period <= totalPeriods; period++) {
    const interestPayment = roundToCents(balance * periodicRate)
    let principalPayment = roundToCents(periodicPayment - interestPayment)

    // Final payment adjustment
    if (period === totalPeriods || balance - principalPayment < 0.01) {
      principalPayment = roundToCents(balance)
      balance = 0
    } else {
      balance = roundToCents(balance - principalPayment)
    }

    cumulativePrincipal = roundToCents(cumulativePrincipal + principalPayment)
    cumulativeInterest = roundToCents(cumulativeInterest + interestPayment)

    // PMI is removed after reaching 80% LTV
    const pmiThisPeriod =
      pmiRemovalPeriod && period >= pmiRemovalPeriod ? 0 : monthlyPmi

    schedule.push({
      period,
      payment: roundToCents(interestPayment + principalPayment),
      principal: principalPayment,
      interest: interestPayment,
      balance,
      cumulativePrincipal,
      cumulativeInterest,
      pmi: pmiThisPeriod,
    })

    if (balance <= 0) break
  }

  return schedule
}

/**
 * Calculate effective annual rate (APR) including all costs
 * Uses IRR method similar to loan calculator
 */
function calculateEffectiveRate(
  loanAmount: number,
  periodicPayment: number,
  totalPeriods: number,
  periodsPerYear: number,
  closingCosts: number,
  monthlyPmi: number,
  monthlyPropertyTax: number,
  monthlyInsurance: number,
  monthlyHoa: number
): number {
  const netAmount = loanAmount - closingCosts
  const totalPeriodicPayment =
    periodicPayment +
    monthlyPmi +
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyHoa

  if (netAmount <= 0 || totalPeriodicPayment <= 0) return 0

  // Newton-Raphson method for IRR
  let rate = 0.05 / periodsPerYear
  const maxIterations = 100
  const tolerance = 0.0000001

  for (let i = 0; i < maxIterations; i++) {
    let npv = -netAmount
    let npvDerivative = 0

    for (let t = 1; t <= totalPeriods; t++) {
      const discountFactor = Math.pow(1 + rate, t)
      npv += totalPeriodicPayment / discountFactor
      npvDerivative -= (t * totalPeriodicPayment) / Math.pow(1 + rate, t + 1)
    }

    const newRate = rate - npv / npvDerivative

    if (Math.abs(newRate - rate) < tolerance) {
      return (Math.pow(1 + newRate, periodsPerYear) - 1) * 100
    }

    rate = newRate
  }

  return (Math.pow(1 + rate, periodsPerYear) - 1) * 100
}

/**
 * Main mortgage calculation function
 */
export function calculateMortgage(inputs: MortgageInputs): MortgageResult {
  const {
    homePrice,
    downPaymentType,
    downPaymentPercentage,
    downPaymentAmount,
    interestRate,
    loanTerm,
    paymentFrequency,
    propertyTaxAnnual = 0,
    homeInsuranceAnnual = 0,
    hoaFees = 0,
    pmiRate = 0.5, // Default 0.5% if not specified
    pmiEnabled = true,
    closingCosts = 0,
    originationFee = 0,
    otherFees = 0,
  } = inputs

  // Calculate down payment
  const downPayment = calculateDownPayment(
    homePrice,
    downPaymentType,
    downPaymentPercentage,
    downPaymentAmount
  )

  // Calculate loan amount
  const loanAmount = roundToCents(homePrice - downPayment.amount)

  // Calculate payment details
  const periodsPerYear = getPeriodsPerYear(paymentFrequency)
  const totalPeriods = Math.round(loanTerm * (periodsPerYear / 12))
  const loanTermYears = loanTerm / 12

  // Calculate periodic payment (P&I only)
  const periodicPayment = calculatePeriodicPayment(
    loanAmount,
    interestRate,
    totalPeriods,
    periodsPerYear
  )

  // PMI calculation
  const pmiRequired = pmiEnabled && isPmiRequired(downPayment.percentage)
  const monthlyPmi = pmiRequired ? calculateMonthlyPmi(loanAmount, pmiRate) : 0

  // PMI removal period
  const pmiRemovalPeriod = pmiRequired
    ? calculatePmiRemovalPeriod(
        homePrice,
        loanAmount,
        periodicPayment,
        interestRate,
        periodsPerYear
      )
    : undefined

  // Monthly recurring costs
  const monthlyPropertyTax = roundToCents(propertyTaxAnnual / 12)
  const monthlyInsurance = roundToCents(homeInsuranceAnnual / 12)
  const monthlyHoa = hoaFees

  // Generate amortization schedule
  const amortizationSchedule = generateAmortizationSchedule(
    loanAmount,
    interestRate,
    totalPeriods,
    periodsPerYear,
    periodicPayment,
    monthlyPmi,
    pmiRemovalPeriod
  )

  // Calculate totals from schedule
  const totalInterest = roundToCents(
    amortizationSchedule.reduce((sum, row) => sum + row.interest, 0)
  )

  const totalPmi = roundToCents(
    amortizationSchedule.reduce((sum, row) => sum + (row.pmi || 0), 0)
  )

  // Closing costs
  const originationFeeAmount = (originationFee / 100) * loanAmount
  const totalClosingCosts = roundToCents(
    closingCosts + originationFeeAmount + otherFees
  )

  // Total payment over loan term
  const totalPayment = roundToCents(
    amortizationSchedule.reduce((sum, row) => sum + row.payment, 0) +
      totalPmi +
      monthlyPropertyTax * loanTerm +
      monthlyInsurance * loanTerm +
      monthlyHoa * loanTerm
  )

  // Total cost of ownership
  const totalCostOfOwnership = roundToCents(
    homePrice +
      totalInterest +
      totalPmi +
      totalClosingCosts +
      propertyTaxAnnual * loanTermYears +
      homeInsuranceAnnual * loanTermYears +
      monthlyHoa * loanTerm
  )

  // Calculate effective rate (APR)
  const effectiveRate = calculateEffectiveRate(
    loanAmount,
    periodicPayment,
    totalPeriods,
    periodsPerYear,
    totalClosingCosts,
    monthlyPmi,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyHoa
  )

  // Monthly payment breakdown
  const monthlyPayment: MonthlyPaymentBreakdown = {
    principal: roundToCents(periodicPayment),
    interest: amortizationSchedule[0]?.interest || 0,
    propertyTax: monthlyPropertyTax,
    homeInsurance: monthlyInsurance,
    pmi: monthlyPmi,
    hoaFees: monthlyHoa,
    totalMonthly: roundToCents(
      periodicPayment +
        monthlyPmi +
        monthlyPropertyTax +
        monthlyInsurance +
        monthlyHoa
    ),
  }

  return {
    homePrice,
    downPaymentAmount: roundToCents(downPayment.amount),
    downPaymentPercentage: roundToCents(downPayment.percentage),
    loanAmount,
    monthlyPayment,
    totalMonthlyPayment: monthlyPayment.totalMonthly,
    totalPayment,
    totalInterest,
    totalPrincipal: loanAmount,
    totalPmi,
    totalClosingCosts,
    totalCostOfOwnership,
    paymentFrequency,
    periodsPerYear,
    totalPeriods,
    loanTermYears,
    nominalRate: interestRate,
    effectiveRate: roundToCents(effectiveRate),
    pmiMonthly: monthlyPmi,
    pmiRequired,
    pmiRemovalPeriod,
    amortizationSchedule,
  }
}

/**
 * Validate mortgage inputs
 */
export function validateMortgageInputs(
  inputs: Partial<MortgageInputs>
): MortgageValidation {
  const errors: MortgageValidation['errors'] = []

  // Home price validation
  if (!inputs.homePrice || inputs.homePrice <= 0) {
    errors.push({
      field: 'homePrice',
      message: 'Home price must be greater than zero',
    })
  } else if (inputs.homePrice > 100000000) {
    errors.push({
      field: 'homePrice',
      message: 'Home price exceeds maximum ($100,000,000)',
    })
  }

  // Down payment validation
  if (inputs.downPaymentType === 'percentage') {
    if (
      inputs.downPaymentPercentage === undefined ||
      inputs.downPaymentPercentage < 0
    ) {
      errors.push({
        field: 'downPayment',
        message: 'Down payment cannot be negative',
      })
    } else if (inputs.downPaymentPercentage > 100) {
      errors.push({
        field: 'downPayment',
        message: 'Down payment cannot exceed 100%',
      })
    }
  } else if (inputs.downPaymentType === 'amount') {
    if (
      inputs.downPaymentAmount === undefined ||
      inputs.downPaymentAmount < 0
    ) {
      errors.push({
        field: 'downPayment',
        message: 'Down payment cannot be negative',
      })
    } else if (
      inputs.homePrice &&
      inputs.downPaymentAmount > inputs.homePrice
    ) {
      errors.push({
        field: 'downPayment',
        message: 'Down payment cannot exceed home price',
      })
    }
  }

  // Interest rate validation
  if (inputs.interestRate === undefined || inputs.interestRate < 0) {
    errors.push({
      field: 'interestRate',
      message: 'Interest rate cannot be negative',
    })
  } else if (inputs.interestRate > 30) {
    errors.push({
      field: 'interestRate',
      message: 'Interest rate exceeds 30%',
    })
  }

  // Loan term validation
  if (!inputs.loanTerm || inputs.loanTerm <= 0) {
    errors.push({
      field: 'loanTerm',
      message: 'Loan term must be greater than zero',
    })
  } else if (inputs.loanTerm > 360) {
    errors.push({
      field: 'loanTerm',
      message: 'Loan term exceeds maximum (30 years)',
    })
  }

  // Property tax validation
  if (
    inputs.propertyTaxAnnual !== undefined &&
    inputs.propertyTaxAnnual < 0
  ) {
    errors.push({
      field: 'propertyTax',
      message: 'Property tax cannot be negative',
    })
  }

  // Insurance validation
  if (
    inputs.homeInsuranceAnnual !== undefined &&
    inputs.homeInsuranceAnnual < 0
  ) {
    errors.push({
      field: 'homeInsurance',
      message: 'Insurance cannot be negative',
    })
  }

  // HOA validation
  if (inputs.hoaFees !== undefined && inputs.hoaFees < 0) {
    errors.push({
      field: 'hoaFees',
      message: 'HOA fees cannot be negative',
    })
  }

  // PMI rate validation
  if (
    inputs.pmiRate !== undefined &&
    (inputs.pmiRate < 0 || inputs.pmiRate > 5)
  ) {
    errors.push({
      field: 'pmiRate',
      message: 'PMI rate must be between 0% and 5%',
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Format a percentage value with specified decimal places
 */
export function formatPercentage(value: number, decimals = 2): string {
  if (isNaN(value)) return '0%'
  return `${value.toFixed(decimals)}%`
}
